import { BuildCtx } from '@stencil/core/internal';
import { describe, expect, it } from 'vitest';
import { generateWebTypes, WebType } from './index';

describe('index', () => {
  describe('generateWebTypes', () => {
    it('generates well a formed WebType', () => {
      const expected: WebType = {
        $schema: 'https://raw.githubusercontent.com/JetBrains/web-types/master/schema/web-types.json',
        'description-markup': 'markdown',
        contributions: {
          html: { elements: [] },
          js: { events: [], properties: [] },
        },
        name: 'my-stencil-library',
        version: '0.0.1',
      };

      const buildCtx = mockBuildCtx();
      const actual = generateWebTypes(buildCtx);

      expect(actual).toEqual(expected);
    });

    it("defaults package.json fields if they're undefined", () => {
      const expected: WebType = {
        $schema: 'https://raw.githubusercontent.com/JetBrains/web-types/master/schema/web-types.json',
        'description-markup': 'markdown',
        contributions: {
          html: { elements: [] },
          js: { events: [], properties: [] },
        },
        name: 'UNKNOWN_PKG_NAME',
        version: 'UNKNOWN_VERSION',
      };

      const buildCtx = mockBuildCtx({ packageJson: {} });
      const actual = generateWebTypes(buildCtx);

      expect(actual).toEqual(expected);
    });
  });
});

export function mockBuildCtx(overrides: Partial<BuildCtx> = {}): BuildCtx {
  /**
   * Stencil's `BuildCtx` is a rather complex type. For now, let's simply stub it out with the information that we need
   * to get the tests going.
   */
  return {
    components: [],
    packageJson: {
      name: 'my-stencil-library',
      version: '0.0.1',
    },
    ...overrides,
  } as unknown as BuildCtx;
}
