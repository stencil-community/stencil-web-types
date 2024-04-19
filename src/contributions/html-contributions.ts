import type {
  CompilerJsDocTagInfo,
  ComponentCompilerMeta,
  ComponentCompilerProperty,
  JsonDocsTag,
} from '@stencil/core/internal';
import { CssPart, ElementInfo } from '../index';
import { JsonDocsPart } from '@stencil/core/internal/stencil-public-docs';

// https://plugins.jetbrains.com/docs/intellij/websymbols-web-types.html#web-components
// https://github.com/JetBrains/web-types/blob/2c07137416e4151bfaf44bf3226dca7f1a5e9bd3/schema/web-types.json#L303
// https://github.com/JetBrains/web-types/blob/2c07137416e4151bfaf44bf3226dca7f1a5e9bd3/schema/web-types.json#L806
// https://github.com/JetBrains/web-types/blob/2c07137416e4151bfaf44bf3226dca7f1a5e9bd3/schema/web-types.json#L922
/**
 * Generate an array of symbol contributions to the HTML namespace
 * @param componentMetadata the Stencil component metadata to generate info for to contribute to the HTML namespace
 */
export const generateElementInfo = (componentMetadata: ComponentCompilerMeta[]): ElementInfo[] => {
  return componentMetadata.map((cmpMeta: ComponentCompilerMeta): ElementInfo => {
    // avoid serializing parts for css contributions for an element if we can avoid it
    let cssParts: CssPart[] | undefined = getDocsParts(cmpMeta.htmlParts, cmpMeta.docs.tags).map((parts) => {
      return { name: parts.name, description: parts.docs };
    });
    cssParts = cssParts.length ? cssParts : undefined;

    return {
      name: cmpMeta.tagName,
      deprecated: !!cmpMeta.docs.tags.find((tag) => tag.name.toLowerCase() === 'deprecated'),
      description: cmpMeta.docs.text,
      attributes: cmpMeta.properties
        .filter((prop: ComponentCompilerProperty): prop is ComponentCompilerProperty & { attribute: string } => {
          return !!prop.attribute;
        })
        .map((prop) => {
          return {
            name: prop.attribute,
            deprecated: !!prop.docs.tags.find((tag) => tag.name.toLowerCase() === 'deprecated'),
            description: prop.docs.text,
            required: prop.required,
            default: prop.defaultValue ?? '', // TODO is | undefined valid? - Think about this in the context of Stencil `@Prop() first: boolean`;
            priority: 'high',
          };
        }),
      slots: cmpMeta.docs.tags
        // we only want '@slot' tags with _some_ amount of text on them
        .filter((tag: CompilerJsDocTagInfo) => tag.name.toLowerCase() === 'slot' && tag.text)
        .map((slotTag: CompilerJsDocTagInfo) => {
          // Stencil supports the following ways of recording slot data in a class component's JSDoc:
          //   1. Document a default slot, with a description:
          //   `@slot - Content is placed between the named slots if provided without a slot.`
          //   2. Document a named slot, without a description:
          //   `@slot primary`
          //   3. Document a named slot, without a description:
          //   `@slot secondary - Content is placed to the right of the main slotted-in text.`
          // Split on the first '-' to differentiate between the name and the description
          const [first, ...rest] = slotTag.text!.split('-');

          return {
            name: first.trim(),
            description: rest.join(' ').trim(),
          };
        }),
      css: {
        parts: cssParts,
      },
    };
  });
};

/**
 * Attribution: https://github.com/ionic-team/stencil/blob/6bfba1dda502f4ad67263b31b2945fa38a04b338/src/compiler/docs/generate-doc-data.ts#L352
 * Find all JSDoc `@part` tags
 * @param vdom auto-detected shadow parts from the vdom
 * @param tags any JSDoc tags associated with the component
 * @returns the found docs for shadow parts
 */
const getDocsParts = (vdom: string[], tags: JsonDocsTag[]): JsonDocsPart[] => {
  const docsParts = getNameText('part', tags).map(([name, docs]) => ({ name, docs }));
  const vdomParts = vdom.map((name) => ({ name, docs: '' }));
  return sortBy(
    unique([...docsParts, ...vdomParts], (p) => p.name),
    (p) => p.name,
  );
};

/**
 * Attribution: https://github.com/ionic-team/stencil/blob/6bfba1dda502f4ad67263b31b2945fa38a04b338/src/compiler/docs/generate-doc-data.ts#L361
 * Search for one or more JSDoc tags with the provided `name` value
 * @param name the JSDoc name to search for
 * @param tags the list of JSDoc tags to search through
 * @returns an array of tuples containing the name of the desired tag and its description text
 */
const getNameText = (name: string, tags: JsonDocsTag[]): [name: string, description: string][] => {
  return tags
    .filter((tag): tag is JsonDocsTag & { text: string } => tag.name.toLowerCase() === name.toLowerCase() && !!tag.text)
    .map(({ text }) => {
      const [namePart, ...rest] = (' ' + text).split(' - ');
      return [namePart.trim(), rest.join('').trim()];
    });
};

/**
 * Attribution: https://github.com/ionic-team/stencil/blob/84e1a14048bc34e64a866659d39376af605f8f9a/src/utils/helpers.ts#L79
 *
 * Sort an array without mutating it in-place (as `Array.prototype.sort`
 * unfortunately does).
 *
 * We use this instead of `toSorted`, as only Node 20+ supports it (and Stencil v4 can run on Node 16, 18).
 *
 * @param array the array you'd like to sort
 * @param prop a function for deriving sortable values (strings or numbers)
 * from array members
 * @returns a new array of all items `x` in `array` ordered by `prop(x)`
 */
export const sortBy = <T>(array: T[], prop: (item: T) => string | number): T[] => {
  return array.slice().sort((a, b) => {
    const nameA = prop(a);
    const nameB = prop(b);
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });
};

/**
 * Attribution: https://github.com/ionic-team/stencil/blob/84e1a14048bc34e64a866659d39376af605f8f9a/src/utils/helpers.ts#L118
 *
 * Deduplicate an array, retaining items at the earliest position in which
 * they appear.
 *
 * So `unique([1,3,2,1,1,4])` would be `[1,3,2,4]`.
 *
 * @param array the array to deduplicate
 * @param predicate an optional function used to generate the key used to
 * determine uniqueness
 * @returns a new, deduplicated array
 */
export const unique = <T, K>(array: T[], predicate: (item: T) => K = (i) => i as any): T[] => {
  const set = new Set();
  return array.filter((item) => {
    const key = predicate(item);
    if (key == null) {
      return true;
    }
    if (set.has(key)) {
      return false;
    }
    set.add(key);
    return true;
  });
};
