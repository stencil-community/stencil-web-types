import type { BuildCtx } from '@stencil/core/internal';
import { generateElementInfo } from './contributions/html-contributions';
import { generateJsEvents, generateJsProperties } from './contributions/js-contributions';
import { WebType } from './index';

/**
 * Generate the contents of the web-types document
 * @param buildCtx the Stencil build context, which holds the build-time metadata for a project's Stencil components
 * @returns the generated web-types document contents
 */
export const generateWebTypes = (buildCtx: BuildCtx): WebType => {
  const { components, packageJson } = buildCtx;
  const webTypesInfo = getWebTypesInfo(
    packageJson.version ?? 'UNKNOWN_VERSION',
    packageJson.name ?? 'UNKNOWN_PKG_NAME',
  );

  return {
    ...webTypesInfo,
    contributions: {
      // the following entries are namespaces - `html`, `js` and `css`
      // the contents of each namespace are the contributions to that namespace
      html: {
        // these are symbol kind names.
        // the full list can be found here: https://plugins.jetbrains.com/docs/intellij/websymbols-web-types.html#direct-support
        elements: generateElementInfo(components),
      },
      js: {
        events: generateJsEvents(components),
        properties: generateJsProperties(components),
      },
    },
  };
};

/**
 * Generate the base information to be included in the Web Types file.
 * This includes:
 * - `$schema` - the JSON schema URL of Web Types used in the project
 * - `name` - the name of the project
 * - `version` -  the version of the project
 *
 * Note that these fields aren't all strictly required by Web Types.
 *
 * @param packageVersion the package.json#version field value of the package that these web-types describe
 * @param namespace the Stencil project namespace, to contribute to the `name` field
 * @returns the aforementioned data
 */
export const getWebTypesInfo = (
  packageVersion: string,
  namespace: string,
): { $schema: string; name: string; version: string; 'description-markup': string } => {
  return {
    $schema: 'https://raw.githubusercontent.com/JetBrains/web-types/master/schema/web-types.json',
    // descriptions are formatted in JSDoc, and are assumed to match markdown
    'description-markup': 'markdown',
    name: namespace,
    version: packageVersion,
  };
};
