import type { CompilerJsDocTagInfo, ComponentCompilerMeta, ComponentCompilerProperty } from '@stencil/core/internal';
import { ElementInfo } from '../index';

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
          priority: 'high',
        };
      }),
      slots: cmpMeta.docs.tags
        // we only want '@slot' tags with _some_ amount of text on them
        .filter((tag: CompilerJsDocTagInfo) => tag.name.toLowerCase() === 'slot' && tag.text)
        .map((slotTag: CompilerJsDocTagInfo) => {
          // Stencil supports the following ways of recording slot data in a class component's JSDoc:
          //   1. Document a default slot, with a description:
          //   @slot - Content is placed between the named slots if provided without a slot.
          //   2. Document a named slot, without a description:
          //   @slot primary
          //   3. Document a named slot, without a description:
          //   @slot secondary - Content is placed to the right of the main slotted-in text.
          // Split on the first '-' to differentiate between the name and the description
          const [first, ...rest] = slotTag.text!.split('-');

          return {
            name: first.trim(),
            description: rest.join(' ').trim(),
          };
        }),
    };
  });
};
