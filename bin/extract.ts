import cheerio from "cheerio";
import fetch from "node-fetch";
import {
  EnumMemberStructure,
  OptionalKind,
  Project,
  StructureKind,
} from "ts-morph";

const project = new Project({});

const extract = async () => {
  const response = await fetch(
    "https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code/code_values"
  );
  const body = await response.text();

  const $ = cheerio.load(body);

  const validCell = (val: string) => {
    return val && val.toLowerCase() !== "unidentified";
  };

  const keys: OptionalKind<EnumMemberStructure>[] = [];

  const windowsTable = $("#code_values_on_windows~div table");
  windowsTable.find("tr").each((_, el) => {
    const cells = $(el).children("td");
    if (cells.length !== 2) {
      return;
    }

    const regex = /\"([a-zA-Z0-9]*)\"/;
    const val1 = cells.first().text().match(regex)?.[1] || "";
    const val2 = cells.last().text().match(regex)?.[1] || "";
    if (val1 === val2 && validCell(val1) && validCell(val2)) {
      if (keys.find((val) => val.name === val1)) {
        return;
      }
      keys.push({
        name: val1,
        value: val1,
      });
    }
  });

  project.addSourceFilesAtPaths("src/**/*.ts");

  project
    .createSourceFile(
      "src/codes.ts",
      {
        statements: [
          {
            kind: StructureKind.Enum,
            name: "KeyCode",
            isExported: true,
            members: keys,
          },
        ],
      },
      {
        overwrite: true,
      }
    )
    .formatText({ indentSize: 2 });
  await project.save();
};

extract();
