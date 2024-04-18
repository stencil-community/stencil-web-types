import type { BuildCtx, CompilerCtx, OutputTargetCustom } from '@stencil/core/internal';
import type { Config } from '@stencil/core';

import { getWebTypesInfo } from './schema-information.js';
import { generateElementInfo } from './contributions/html-contributions';
import { generateJsEvents, generateJsProperties } from './contributions/js-contributions';

/**
 * A Stencil output target for generating [web-types](https://github.com/JetBrains/web-types) for a Stencil project.
 * Web-Types are a JSON format for documenting web components to provide metadata to Integrated Development Environments
 * (IDEs) for richer intellisense features in HTML files.
 *
 * While Web-Types is an IDE agnostic format, it is largely used by the JetBrains family of products - WebStorm,
 * IntelliJ, etc.
 *
 * The usage of this output target is completely optional. However, it can be beneficial for:
 * 1. Authors of web component libraries, who want greater intellisense when developing locally.
 * 2. Consumers of web component libraries, whose IDE can use this generated metadata in authoring HTML documents.
 *
 * For more information on using this output target, please see the project's README file.
 */
export const webTypesOutputTarget = (): OutputTargetCustom => ({
  type: 'custom',
  name: 'stencil-web-types',
  async generator(_config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx) {
    const timespan = buildCtx.createTimeSpan('generate web-types started', true);

    const webTypes = await generateWebTypes(buildCtx);
    await compilerCtx.fs.writeFile('web-types.json', JSON.stringify(webTypes, null, 2));

    timespan.finish('generate web-types finished');
  },
});

/**
 * Generate the contents of the web-types document
 * @param buildCtx the Stencil build context, which holds the build-time metadata for a project's Stencil components
 * @returns the generated web-types document contents
 */
export const generateWebTypes = (buildCtx: BuildCtx): WebType => {
  const { components, packageJson } = buildCtx;
  const webTypesInfo = getWebTypesInfo(
    packageJson.version ?? 'UNKNOWN_VERSION',
    packageJson.name ?? 'UNKNOWN_PKG_NAME',
  );

  return {
    $schema: webTypesInfo.$schema,
    'description-markup': webTypesInfo['description-markup'],
    name: webTypesInfo.name,
    version: webTypesInfo.version,
    contributions: {
      // the following entries are namespaces - `html`, `js` and `css`
      // the contents of each namespace are the contributions to that namespace
      html: {
        // these are symbol kind names.
        // the full list can be found here: https://plugins.jetbrains.com/docs/intellij/websymbols-web-types.html#direct-support
        elements: generateElementInfo(components),
      },
      js: {
        events: generateJsEvents(components),
        properties: generateJsProperties(components),
      },
    },
  };
};

export type WebType = {
  $schema: string;
  name: string;
  version: string;
  'description-markup': string;
  contributions: Contributions;
};

type Contributions = {
  html: {
    elements: ElementInfo[];
  };
  js: {
    events: any[];
    properties: any[];
  };
};

export type ElementInfo = {
  name: string;
  deprecated: boolean;
  description: string;
  attributes: AttributeInfo[];
  /**
   * All slots associated with the component.
   * Slots are detected using the `@slot` JSDoc tag on a Stencil component's class JSDoc.
   */
  slots: SlotInfo[];
};

type AttributeInfo = {
  name: string;
  description: string;
  required: boolean;
  default: string;
  deprecated: boolean;
  priority: 'lowest' | 'low' | 'normal' | 'high' | 'highest';
};

/**
 * Describes a slot in a Stencil component
 */
export type SlotInfo = {
  /**
   * The name of the slot. If empty, it is assumed ot be the default slot.
   */
  name: string;
  /**
   * A string of text explaining the purpose/usage of the slot
   */
  description: string;
};
