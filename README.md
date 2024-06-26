# Stencil Web Types Output Target

<p align="center">
  <a href="https://www.npmjs.com/package/@stencil-community/web-types-output-target">
    <img src="https://img.shields.io/npm/v/@stencil-community/web-types-output-target.svg" alt="The npm package version" /></a>
  <a href="https://github.com/ionic-team/stencil/blob/main/LICENSE.md">
    <img src="https://img.shields.io/badge/license-MIT-yellow.svg" alt="Released under the MIT license." />
  </a>
  <a href="https://github.com/stencil-community/stencil-web-types/blob/main/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome!" />
  </a>
  <a href="https://twitter.com/stenciljs">
    <img src="https://img.shields.io/badge/follow-%40stenciljs-1DA1F2?logo=twitter" alt="Follow @stenciljs">
  </a>
  <a href="https://chat.stenciljs.com">
    <img src="https://img.shields.io/discord/520266681499779082?color=7289DA&label=%23stencil&logo=discord&logoColor=white" alt="Official Ionic Discord" />
  </a>
</p>

A Stencil output target for generating [web types](https://plugins.jetbrains.com/docs/intellij/websymbols-web-types.html#file-structure) to provide intellisense for Stencil components in HTML files.

> [!NOTE]
> This package follows [semantic versioning](https://semver.org).
> Small breaking changes to the API may occur prior to hitting v1.0.

## Overview

One of the core features of web components is the ability to create [custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements), which allow developers to reuse custom functionality defined by their components.
When Stencil compiles a project, it generates a custom element for each component in the project.

By default, integrated development environments (IDEs) like JetBrains' WebStorm are not aware of a project's custom elements.
This causes the IDE to often warn developers that it doesn't have any information about their custom elements, and results in a poorer developement experience.
In order to enable more intelligent features in JetBrains products, such as auto-completion, hover tooltips, etc., developers need to inform it of their project's custom elements.

The `webTypesOutputTarget` output target tells Stencil to generate a JSON file containing this information.

This is an opt-in feature and will write a JSON file containing web types in a directory specified by the output target.
Once the feature is enabled and your IDE is informed of the JSON file's location, writing code in HTML files will have similar intellisense to that of TSX files.

## Set Up

The output target is not built in to Stencil itself.
It's a third party package, that needs to be installed as a dev-dependency:
```bash
$ npm i --save-dev @stencil-community/web-types-output-target
```

To generate custom element information for JetBrains IDE's, add the `webTypesOutputTarget` output target to your `stencil.config.ts`:
```tsx
import { Config } from '@stencil/core';
import { webTypesOutputTarget } from '@stencil-community/web-types-output-target';

export const config: Config = {
  outputTargets: [
    webTypesOutputTarget(),
  ]
};
```

Stencil will write a `web-types.json` to your project's root directory the next time the Stencil [build task](https://stenciljs.com/docs/cli#stencil-build) is run.

## Configuration

The `webTypesOutputTarget` output target takes an optional argument, an object literal to configure the output target.
The following are properties on that configuration object.

### `outFile`

Defaults to `StencilConfig#{rootDir}/web-types.json`.

Since v0.3.0.

Description: A string that represents the directory to place the output file.
Users may specify either a directory (e.g. '../'), a filename (e.g. 'my-types.json') or both (e.g. '../my-types.json').
If no filename ending is '.json' is provided, the output target assumes that a filename must be added to the path.
In such cases, the default 'web-types.json' will be added to the path.

It is not recommended that users use absolute paths for this setting, as this can cause errors in projects shared by more than one developer.

## Using Web Types

Once web types have been written to disk, they need to be picked up by the IDE.
Web types for your project can be picked by JetBrains IDEs by setting the `web-types` property at the root level of your project's `package.json` file:

```json
{
  "name": "your-projects-name",
  "version": "1.0.0",
  "//": "Other details omitted",
  "web-types": "./web-types.json"
}
```

Having this file locally on disk will allow your JetBrains IDE to pick up additional typings automatically.
To provide these IDE-specific typings to users of your library, be sure to include the generated web types file in your package's distributable by adding it to your `package.json#files` array.

## References

https://plugins.jetbrains.com/docs/intellij/websymbols-web-types.html#file-structure
