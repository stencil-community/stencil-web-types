import type { ComponentCompilerMeta, ComponentCompilerProperty } from '@stencil/core/internal';
import { ElementInfo } from './index';

// https://plugins.jetbrains.com/docs/intellij/websymbols-web-types.html#web-components
// https://github.com/JetBrains/web-types/blob/2c07137416e4151bfaf44bf3226dca7f1a5e9bd3/schema/web-types.json#L303
// https://github.com/JetBrains/web-types/blob/2c07137416e4151bfaf44bf3226dca7f1a5e9bd3/schema/web-types.json#L806
// https://github.com/JetBrains/web-types/blob/2c07137416e4151bfaf44bf3226dca7f1a5e9bd3/schema/web-types.json#L922
/**
 * Generate an array of symbol contributions to the HTML namespace
 * @param components the Stencil components to generate info for to contribute to the HTML namespace
 */
export const generateElementInfo = (components: ComponentCompilerMeta[]): ElementInfo[] => {
  return components.map((cmpMeta: ComponentCompilerMeta) => {
    return {
      name: cmpMeta.tagName,
      description: cmpMeta.docs.text,
      attributes: cmpMeta.properties.map((prop: ComponentCompilerProperty) => {
        return {
          name: prop.attribute as string, // TODO: I can be undefined
          description: prop.docs.text,
          required: prop.required,
          default: prop.defaultValue ?? '', // TODO is | undefined valid?
        };
      }),
    };
  });
};
