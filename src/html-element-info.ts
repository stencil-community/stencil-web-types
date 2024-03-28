import type { ComponentCompilerMeta, ComponentCompilerProperty } from '@stencil/core/internal';
import { ElementInfo } from './index';

export const generateElementInfo = (components: ComponentCompilerMeta[]): ElementInfo[] => {
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
