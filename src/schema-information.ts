/**
 * Generate the base information to be included in the Web Types file.
 * This includes:
 * - `#schema` - the JSON schema URL of Web Types used in the project
 * - `name` - the name of the project
 * - `version` -  the version of the project
 *
 * Note that these fields aren't all strictly required by Web Types.
 *
 * @param namespace the Stencil project namespace, to contribute to the `name` field
 * @returns the aforementioned data
 */
export const getWebTypesInfo = (
  namespace: string,
): { $schema: string; name: string; version: string; 'description-markup': string } => {
  return {
    $schema: 'https://raw.githubusercontent.com/JetBrains/web-types/master/schema/web-types.json',
    // descriptions are formatted in JSDoc, and are assumed to match markdown
    'description-markup': 'markdown',
    name: namespace,
    version: '0.0.1', // TODO(STENCIL): Do we have this info outside of the bundled artifact?
  };
};
