# use-shortcut-key

>

[![NPM](https://img.shields.io/npm/v/use-shortcut-key.svg)](https://www.npmjs.com/package/use-shortcut-key) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save use-shortcut-key
```

## Usage

```jsx
import React, { Component } from "react";

import { useShortcutKeys } from "use-shortcut-key";

const Example = () => {
  const handleShortCut = () => {
    console.log("Shortcut keys are used");
  };
  useShortcutKeys(["Control", "k", "s"], handleShortCut);
  return (
    <div>
      <button onClick={handleShortCut}>Handle Shortcut using button</button>
    </div>
  );
};
```

As you've seen in above example. You can use button onClick to run a function (or) you can use this hook to create shortcut for handling the function

> **_NOTE:_** The shortcuts you use will over ride default behaviour of browser. If you use "Control", "p" inside of this hook it overrides default behaviour of web browser which is print

## License

MIT © [RajVadeghar](https://github.com/RajVadeghar)

---

This hook is created using [create-react-hook](https://github.com/hermanya/create-react-hook).
