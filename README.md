# keycode-enum

TypeScript enum for `KeyboardEvent.code` values extracted from [MDN](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code/code_values).

Automatically extracted. Only common keys of Firefox and Chrome are available.

```ts
import { KeyCode } from "..."

window.addEventListener("keydown", (event) => {
  if (event.code === KeyCode.ArrowLeft) {
    console.log(`keydown: ${KeyCode.ArrowLeft}`)
  }
}
```
