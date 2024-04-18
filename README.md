# Stencil Web-Types Output Target

> [!NOTE]
> This package is experimental - It's pre-v1.0, things may change over time.

## Overview

One of the core features of web components is the ability to create [custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements),
which allow developers to reuse custom functionality defined in their components.
When Stencil compiles a project, it generates a custom element for each component in the project.
Each of these [custom elements has an associated `tag` name](../components/component.md#component-options) that allows the custom element to be used in HTML files.

By default, integrated development environments (IDEs) like WebStorm are not aware of a project's custom elements when authoring HTML.
In order to enable more intelligent features in JetBrains products such as auto-completion, hover tooltips, etc., developers need to inform it of their project's custom elements.

The `docs-web-types` output target tells Stencil to generate a JSON file containing this information.

This is an opt-in feature and will save a JSON file containing [web-types](https://plugins.jetbrains.com/docs/intellij/websymbols-web-types.html#file-structure) in a directory specified by the output target.
Once the feature is enabled and your IDE is informed of the JSON file's location, HTML files can gain code editing features similar to TSX files.

## Enabling

The web-types output target is not built in to Stencil itself.
Instead, it's a third party package, that needs to be installed as a dev dependency:
```bash
$ npm i --save-dev  stencil-web-types-output-target
```

To generate custom element information for JetBrains IDE's, add the `docs-web-types` output target to your `stencil.config.ts`:
```tsx
import { Config } from '@stencil/core';
import { webTypesOutputTarget } from 'stencil-web-types-output-target';

export const config: Config = {
  outputTargets: [
    webTypesOutputTarget(),
  ]
};
```

By default, Stencil assumes that the file will be generated in the project's root directory.

Be sure to add the following to your `package.json`'s root level object:
```json
{
  "name": "your-projects-name",
  "version": "1.0.0",
  "//": "Other details omitted",
  "web-type": "./web-types.json"
}
```

To generate the JSON file, have Stencil build your project.

## References

https://plugins.jetbrains.com/docs/intellij/websymbols-web-types.html#file-structure