import { describe, expect, it } from 'vitest';
import { type WebTypesConfig, webTypesOutputTarget } from './index.js';
import { type Config } from '@stencil/core/internal';
import { join, normalize } from 'path';

describe('webTypesOutputTarget', () => {
  describe('validate', () => {
    describe('WebTypesConfig field validation', () => {
      describe('outFile', () => {
        it.each([normalize('/user/defined/directory/web-types.json'), normalize('/user/defined/directory/types.json')])(
          "does not override a user-provided, absolute path, '%s'",
          (expectedDir) => {
            const outputTargetConfig: WebTypesConfig = { outFile: expectedDir };

            webTypesOutputTarget(outputTargetConfig).validate!({ rootDir: '' }, []);

            expect(outputTargetConfig.outFile).toBe(expectedDir);
          },
        );

        it.each([
          [normalize('./web-types.json'), normalize('~/one/two/web-types.json')],
          [normalize('../web-types.json'), normalize('~/one/web-types.json')],
          [normalize('../../web-types.json'), normalize('~/web-types.json')],
        ])("normalizes relative path '%s' against rootDir", (relPath, expected) => {
          const outputTargetConfig: WebTypesConfig = { outFile: relPath };

          webTypesOutputTarget(outputTargetConfig).validate!({ rootDir: normalize('~/one/two/') }, []);

          expect(outputTargetConfig.outFile).toBe(expected);
        });

        it.each([
          '~',
          '/',
          '.',
          normalize('./.'),
          normalize('~/user/defined/directory/'),
          normalize('~/user/defined.directory/'),
          normalize('~/user.defined.directory/'),
          normalize('~/user.defined.directory/.'),
          normalize('/user/defined/directory/types.txt'),
          normalize('/user/defined/directory/no-trailing-slash'),
        ])("sets the filename if none is detected for '%s'", (dirName) => {
          const expectedDir = join(`${dirName}`, 'web-types.json');
          const outputTargetConfig: WebTypesConfig = { outFile: dirName };

          webTypesOutputTarget(outputTargetConfig).validate!({ rootDir: '' }, []);

          expect(outputTargetConfig.outFile).toBe(expectedDir);
        });

        it('provides a reasonable default if the user does not provide a directory', () => {
          const outputTargetConfig: WebTypesConfig = {};

          webTypesOutputTarget(outputTargetConfig).validate!({ rootDir: '' }, []);

          expect(outputTargetConfig.outFile).toBe('web-types.json');
        });
      });
    });

    describe('Stencil Config validation', () => {
      it('does not throw when all required fields are set', () => {
        const config: Config = {
          rootDir: normalize('/some/mocked/field'),
        };

        expect(() => webTypesOutputTarget().validate!(config, [])).not.toThrowError();
      });

      describe('no rootDir set', () => {
        const EXPECTED_ERR_MSG =
          'Unable to determine the Stencil root directory. Exiting without generating web types.';

        it('throws an error when the root dir is set to undefined', () => {
          expect(() => webTypesOutputTarget().validate!({ rootDir: undefined }, [])).toThrowError(EXPECTED_ERR_MSG);
        });

        it('throws an error when the root dir is missing', () => {
          expect(() => webTypesOutputTarget().validate!({}, [])).toThrowError(EXPECTED_ERR_MSG);
        });
      });
    });
  });
});
