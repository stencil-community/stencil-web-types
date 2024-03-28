# Stencil Web-Types Output Target

## Usage

Add this output target to your `stencil.config.ts` file:
```ts
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