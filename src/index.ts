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

export const webTypesOutputTarget = (): OutputTargetCustom => ({
  type: 'custom',
  name: 'web-types',
  validate(config: Config, diagnostics: Diagnostic[]) {
    return true;
  },
  async generator(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, docs: JsonDocs) {
    const timespan = buildCtx.createTimeSpan('generate web-types started', true);

    const webTypes = await generateWebTypes(config, compilerCtx, buildCtx.components);
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
};

export type ElementInfo = {
  name: string;
  description: string;
  attributes: AttributeInfo[];
};

type AttributeInfo = {
  name: string;
  description: string;
};

const generateElementInfo = (components: ComponentCompilerMeta[]): ElementInfo[] => {
  return components.map((cmpMeta: ComponentCompilerMeta) => {
    return {
      name: cmpMeta.tagName,
      description: cmpMeta.docs.text,
      attributes: cmpMeta.properties.map((prop: ComponentCompilerProperty) => {
        return {
          name: prop.attribute as string, // TODO: I can be undefined
          description: prop.docs.text,
        };
      }),
    };
  });
};

const generateWebTypes = async (
  config: StencilConfig,
  compilerCtx: CompilerCtx,
  components: ComponentCompilerMeta[],
): Promise<WebType> => {
  const webTypesInfo = getWebTypesInfo(config.namespace ?? ''); // TOOD(NOW): Validate
  const elements = generateElementInfo(components);
  return {
    $schema: webTypesInfo.$schema,
    'description-markup': webTypesInfo['description-markup'],
    name: webTypesInfo.name,
    version: webTypesInfo.version,
    contributions: {
      html: {
        elements,
      },
    },
  };
};
