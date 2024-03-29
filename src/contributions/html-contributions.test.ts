import { describe, expect, test } from 'vitest';
import { generateElementInfo } from './html-contributions';
import { ElementInfo } from '../index';
import { ComponentCompilerMeta } from '@stencil/core/internal';

describe('generateElementInfo', () => {
  test('returns an empty array when no components are provided', () => {
    expect([]).toEqual(generateElementInfo([]));
  });

  test('handles a component with no attributes', () => {
    const expected: ElementInfo = {
      name: 'my-component',
      description: 'a simple component that shows us your name',
      attributes: [],
    };

    const actual: ElementInfo[] = generateElementInfo([
      stubComponentCompilerMeta({
        tagName: 'my-component',
        docs: {
          text: 'a simple component that shows us your name',
          tags: [],
        },
        properties: [],
      }),
    ]);

    expect(actual).toHaveLength(1);
    expect(actual[0]).toEqual(expected);
  });

  // TODO(NOW): Additional testing
});

// TODO(NOW): Need a better way to share this stub from Stencil Core
/**
 * Generates a stub {@link ComponentCompilerMeta}. This function uses sensible defaults for the initial stub. However,
 * any field in the object may be overridden via the `overrides` argument.
 * @param overrides a partial implementation of `ComponentCompilerMeta`. Any provided fields will override the
 * defaults provided by this function.
 * @returns the stubbed `ComponentCompilerMeta`
 */
export const stubComponentCompilerMeta = (overrides: Partial<ComponentCompilerMeta> = {}): ComponentCompilerMeta => ({
  assetsDirs: [],
  attachInternalsMemberName: null,
  componentClassName: 'StubCmp',
  dependencies: [],
  dependents: [],
  directDependencies: [],
  directDependents: [],
  docs: { text: 'docs', tags: [] },
  elementRef: '',
  encapsulation: 'none',
  events: [],
  excludeFromCollection: false,
  formAssociated: false,
  hasAttribute: false,
  hasAttributeChangedCallbackFn: false,
  hasComponentDidLoadFn: false,
  hasComponentDidRenderFn: false,
  hasComponentDidUnloadFn: false,
  hasComponentDidUpdateFn: false,
  hasComponentShouldUpdateFn: false,
  hasComponentWillLoadFn: false,
  hasComponentWillRenderFn: false,
  hasComponentWillUpdateFn: false,
  hasConnectedCallbackFn: false,
  hasDisconnectedCallbackFn: false,
  hasElement: false,
  hasEvent: false,
  hasLifecycle: false,
  hasListener: false,
  hasListenerTarget: false,
  hasListenerTargetBody: false,
  hasListenerTargetDocument: false,
  hasListenerTargetParent: false,
  hasListenerTargetWindow: false,
  hasMember: false,
  hasMethod: false,
  hasMode: false,
  hasProp: false,
  hasPropBoolean: false,
  hasPropMutable: false,
  hasPropNumber: false,
  hasPropString: false,
  hasReflect: false,
  hasRenderFn: false,
  hasState: false,
  hasStyle: false,
  hasVdomAttribute: false,
  hasVdomClass: false,
  hasVdomFunctional: false,
  hasVdomKey: false,
  hasVdomListener: false,
  hasVdomPropOrAttr: false,
  hasVdomRef: false,
  hasVdomRender: false,
  hasVdomStyle: false,
  hasVdomText: false,
  hasVdomXlink: false,
  hasWatchCallback: false,
  htmlAttrNames: [],
  htmlParts: [],
  htmlTagNames: [],
  internal: false,
  isCollectionDependency: false,
  isPlain: false,
  isUpdateable: false,
  jsFilePath: '/some/stubbed/path/my-component.js',
  listeners: [],
  methods: [],
  potentialCmpRefs: [],
  properties: [],
  shadowDelegatesFocus: false,
  sourceFilePath: '/some/stubbed/path/my-component.tsx',
  sourceMapPath: '/some/stubbed/path/my-component.js.map',
  states: [],
  styleDocs: [],
  styles: [],
  tagName: 'stub-cmp',
  virtualProperties: [],
  watchers: [],
  ...overrides,
});
