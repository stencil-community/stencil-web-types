import type { ComponentCompilerEvent, ComponentCompilerMeta, ComponentCompilerProperty } from '@stencil/core/internal';

/**
 * Generate an array of symbol contributions to the JS namespace
 * @param components the Stencil components to generate info for to contribute to the JS namespace
 */
export const generateJsEvents = (components: ComponentCompilerMeta[]): any[] => {
  return components.map((cmpMeta: ComponentCompilerMeta) => {
    return {
      events: cmpMeta.events.map((ev: ComponentCompilerEvent) => {
        return {
          name: ev.name,
          description: ev.docs.text,
        };
      }),
    };
  });
};

export const generateJsProperties = (components: ComponentCompilerMeta[]): any[] => {
  return components.map((cmpMeta: ComponentCompilerMeta) => {
    return {
      properties: cmpMeta.properties.map((prop: ComponentCompilerProperty) => {
        return {
          name: prop.name,
        };
      }),
    };
  });
};
