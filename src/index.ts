import type { BuildCtx, CompilerCtx, OutputTargetCustom, Config } from '@stencil/core/internal';
import { generateWebTypes } from './generate-web-types.js';
import { Diagnostic } from '@stencil/core/internal/stencil-public-compiler';

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
  name: 'web-types-output-target',
  validate(config: Config, _diagnostics: Diagnostic[]) {
    if (typeof config.rootDir === 'undefined') {
      // defer to Stencil to create & load ths into its diagnostics, rather than us having to generate one ourselves
      throw new Error('Unable to determine the Stencil root directory. Exiting without generating web types.');
    }
  },
  async generator(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx) {
    const timespan = buildCtx.createTimeSpan('generate web-types started', true);

    /**
     * One source of truth to rule them all - plus, this makes testing a skosh easier, as we can mock easily.
     * This should have been validated in the `validate` fn, hence the bang operator - Stencil doesn't allow us to
     * return a value from `validate`, which makes a type guard that gets used in `validate` unusable in any meaningful
     * way in `generator`
     */
    const stencilRootDirectory = config.rootDir!;
    const webTypes = generateWebTypes(buildCtx, stencilRootDirectory);

    await compilerCtx.fs.writeFile('web-types.json', JSON.stringify(webTypes, null, 2));

    timespan.finish('generate web-types finished');
  },
});

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
  /**
   * Link the custom HTML element back to the Stencil component
   */
  source: {
    /**
     * The TSX file containing the definition of the component, relative to the generated web-types.json
     */
    module: string;
    /**
     * The exported symbol (i.e. the Stencil component name)
     */
    symbol: string;
  };
  attributes: AttributeInfo[];
  /**
   * All slots associated with the component.
   * Slots are detected using the `@slot` JSDoc tag on a Stencil component's class JSDoc.
   */
  slots: SlotInfo[];
  css: {
    /**
     * All shadow parts associated with the component.
     * Shadow parts are detected using the `@part` JSDoc tag on a Stencil component's class JSDoc.
     */
    parts?: CssPart[];
  };
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

/**
 * Describes a CSS Shadow Part in a Stencil component
 */
export type CssPart = {
  /**
   * The name of the part.
   */
  name: string;
  /**
   * A string of text explaining the purpose/usage of the part.
   */
  description: string;
};
