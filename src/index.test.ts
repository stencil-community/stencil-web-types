import { describe, expect, it } from 'vitest';
import { webTypesOutputTarget } from './index.js';
import { Config } from '@stencil/core/internal';

describe('webTypesOutputTarget', () => {
  describe('validate', () => {
    it('does not throw when all required fields are set', () => {
      const config: Config = {
        rootDir: '/some/mocked/field',
      };

      expect(() => webTypesOutputTarget().validate!(config, [])).not.toThrowError();
    });

    describe('no rootDir set', () => {
      const EXPECTED_ERR_MSG = 'Unable to determine the Stencil root directory. Exiting without generating web types.';

      it('throws an error when the root dir is set to undefined', () => {
        expect(() => webTypesOutputTarget().validate!({ rootDir: undefined }, [])).toThrowError(EXPECTED_ERR_MSG);
      });

      it('throws an error when the root dir is missing', () => {
        expect(() => webTypesOutputTarget().validate!({}, [])).toThrowError(EXPECTED_ERR_MSG);
      });
    });
  });
});
