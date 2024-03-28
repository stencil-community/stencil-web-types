import type {BuildCtx, CompilerCtx, Diagnostic, JsonDocs, OutputTargetCustom} from '@stencil/core/internal';
import type {Config } from "@stencil/core";

export const webTypesOutputTarget = (): OutputTargetCustom => ({
  type: 'custom',
  name: 'web-types',
  validate(config: Config, diagnostics: Diagnostic[]) {
    return true;
  },
  async generator(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, docs: JsonDocs) {
    const timespan = buildCtx.createTimeSpan('generate web-types started', true);

    console.log('This is where the impl would live!');

    timespan.finish('generate web-types finished');
  },
});
