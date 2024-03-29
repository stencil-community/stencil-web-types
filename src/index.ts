import type {
  BuildCtx,
  CompilerCtx,
  ComponentCompilerMeta,
  ComponentCompilerProperty,
  Diagnostic,
  JsonDocs,
  OutputTargetCustom,
  StencilConfig,
} from '@stencil/core/internal';
import type { Config } from '@stencil/core';

import { getWebTypesInfo } from './schema-information.js';
import { generateElementInfo } from './contributions/html-contributions';
import { generateJsEvents, generateJsProperties } from './contributions/js-contributions';

export const webTypesOutputTarget = (): OutputTargetCustom => ({
  type: 'custom',
  name: 'web-types',
  validate(config: Config, diagnostics: Diagnostic[]) {
    return true;
  },
  async generator(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, docs: JsonDocs) {
    const timespan = buildCtx.createTimeSpan('generate web-types started', true);

    // DEBUG
    buildCtx.components.forEach((cmp) => console.log(cmp));

    const webTypes = await generateWebTypes(config, compilerCtx, buildCtx);
    // TODO(NOW): Make this configurable
    await compilerCtx.fs.writeFile('./web-types.json', JSON.stringify(webTypes, null, 2));

    timespan.finish('generate web-types finished');
  },
});

type WebType = {
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

const generateWebTypes = async (
  config: StencilConfig,
  compilerCtx: CompilerCtx,
  buildCtx: BuildCtx,
): Promise<WebType> => {
  const components = buildCtx.components;
  const webTypesInfo = getWebTypesInfo(buildCtx.packageJson.version ?? '', buildCtx.packageJson.name ?? ''); // TOOD(NOW): Validate
  const elements = generateElementInfo(components);
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
        elements,
      },
      js: {
        events: generateJsEvents(components),
        properties: generateJsProperties(components),
      },
    },
  };
};
