import { describe, expect, test } from 'vitest';
import { getWebTypesInfo } from './schema-information';

describe('getWebTypesInfo', () => {
  test('returns a well formed object', () => {
    const expected = {
      $schema: 'https://raw.githubusercontent.com/JetBrains/web-types/master/schema/web-types.json',
      'description-markup': 'markdown',
      name: 'ProjectName',
      version: '0.0.1',
    };

    const actual = getWebTypesInfo('ProjectName');

    expect(actual).toEqual(expected);
  });
});
