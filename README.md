# Stencil Web-Types Output Target

## Notice

This package is experimental - It's pre-v1.0, things may change over time.

## Usage

Install the package:
```sh
$ npm i --save-dev   stencil-web-types-output-target
```

Add the output target to your `stencil.config.ts` file:
```ts
import { webTypesOutputTarget } from 'stencil-web-types-output-target';

export const config: Config = {
  outputTargets: [
    // ...
    webTypesOutputTarget(),
  ],
}
```

Be sure to add the following to your `package.json`:
```json
    "web-type": "./web-types.json"
```

## References

https://plugins.jetbrains.com/docs/intellij/websymbols-web-types.html#file-structure