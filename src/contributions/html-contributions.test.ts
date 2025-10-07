import { beforeEach, describe, expect, it } from 'vitest';
import { generateElementInfo } from './html-contributions';
import { ElementInfo } from '../index';
import { ComponentCompilerMeta } from '@stencil/core/internal';
import { join } from 'node:path';

const MOCK_STENCIL_ROOT_DIR = '/';
const MOCK_CLASS_COMPONENT_NAME = 'StubCmp';
const MOCK_MODULE_PATH = join('some', 'stubbed', 'path', 'my-component.tsx');

describe('generateElementInfo', () => {
  it('returns an empty array when no components are provided', () => {
    expect([]).toEqual(generateElementInfo([], MOCK_STENCIL_ROOT_DIR));
  });

  it.each(['deprecated', 'DEPRECATED', 'Deprecated'])('marks a component as deprecated', (deprecated: string) => {
    const cmpMeta = stubComponentCompilerMeta({
      tagName: 'my-component',
      docs: {
        text: 'a simple component that shows us your name',
        tags: [{ name: deprecated }],
      },
      properties: [],
    });

    const expected: ElementInfo = {
      name: 'my-component',
      deprecated: true,
      description: 'a simple component that shows us your name',
      source: { module: MOCK_MODULE_PATH, symbol: MOCK_CLASS_COMPONENT_NAME },
      attributes: [],
      slots: [],
      css: {},
    };

    const actual: ElementInfo[] = generateElementInfo([cmpMeta], MOCK_STENCIL_ROOT_DIR);

    expect(actual).toHaveLength(1);
    expect(actual[0]).toEqual(expected);
  });

  describe('attributes', () => {
    let cmpMeta: ComponentCompilerMeta;

    beforeEach(() => {
      cmpMeta = stubComponentCompilerMeta({
        tagName: 'my-component',
        docs: {
          text: 'a simple component that shows us your name',
          tags: [],
        },
        properties: [],
      });
    });

    it('handles a component with no attributes', () => {
      const expected: ElementInfo = {
        name: 'my-component',
        deprecated: false,
        description: 'a simple component that shows us your name',
        source: { module: MOCK_MODULE_PATH, symbol: MOCK_CLASS_COMPONENT_NAME },
        attributes: [],
        slots: [],
        css: {},
      };

      cmpMeta.properties = [];
      const actual: ElementInfo[] = generateElementInfo([cmpMeta], MOCK_STENCIL_ROOT_DIR);

      expect(actual).toHaveLength(1);
      expect(actual[0]).toEqual(expected);
    });

    it('does not include properties that do not have a name', () => {
      cmpMeta.properties = [
        {
          attribute: undefined,
          docs: {
            text: 'this is the first name of the user',
            tags: [],
          },
          required: false,
          name: '',
          internal: false,
          mutable: false,
          optional: false,
          type: 'string',
          complexType: { original: 'string', resolved: 'string', references: {} },
          getter: false,
          setter: false,
        },
        {
          attribute: '',
          docs: {
            text: 'this is the first name of the user',
            tags: [],
          },
          required: false,
          name: '',
          internal: false,
          mutable: false,
          optional: false,
          type: 'string',
          complexType: { original: 'string', resolved: 'string', references: {} },
          getter: false,
          setter: false,
        },
      ];

      const actual: ElementInfo[] = generateElementInfo([cmpMeta], MOCK_STENCIL_ROOT_DIR);

      expect(actual).toHaveLength(1);
      expect(actual[0].attributes).toHaveLength(0);
    });

    it('parses the properties field into a well formed entry', () => {
      const expected: ElementInfo = {
        name: 'my-component',
        deprecated: false,
        description: 'a simple component that shows us your name',
        source: { module: MOCK_MODULE_PATH, symbol: MOCK_CLASS_COMPONENT_NAME },
        attributes: [
          {
            default: 'Bob',
            deprecated: false,
            description: 'this is the first name of the user',
            name: 'first-name',
            priority: 'high',
            required: false,
          },
        ],
        slots: [],
        css: {},
      };

      cmpMeta.properties = [
        {
          attribute: 'first-name',
          docs: {
            text: 'this is the first name of the user',
            tags: [],
          },
          defaultValue: 'Bob',
          required: false,
          name: '',
          internal: false,
          mutable: false,
          optional: false,
          type: 'string',
          complexType: { original: 'string', resolved: 'string', references: {} },
          getter: false,
          setter: false,
        },
      ];
      const actual: ElementInfo[] = generateElementInfo([cmpMeta], MOCK_STENCIL_ROOT_DIR);

      expect(actual).toHaveLength(1);
      expect(actual[0]).toEqual(expected);
    });

    it.each(['deprecated', 'DEPRECATED', 'Deprecated'])("'%s' marks an attribute as deprecated", (deprecated) => {
      const expected: ElementInfo = {
        name: 'my-component',
        deprecated: false,
        description: 'a simple component that shows us your name',
        source: { module: MOCK_MODULE_PATH, symbol: MOCK_CLASS_COMPONENT_NAME },
        attributes: [
          {
            default: 'Bob',
            deprecated: true,
            description: 'this is the first name of the user',
            name: 'first-name',
            priority: 'high',
            required: false,
          },
        ],
        slots: [],
        css: {},
      };

      cmpMeta.properties = [
        {
          attribute: 'first-name',
          docs: {
            text: 'this is the first name of the user',
            tags: [{ name: deprecated, text: '' }],
          },
          defaultValue: 'Bob',
          required: false,
          name: '',
          internal: false,
          mutable: false,
          optional: false,
          type: 'string',
          complexType: { original: 'string', resolved: 'string', references: {} },
          getter: false,
          setter: false,
        },
      ];
      const actual: ElementInfo[] = generateElementInfo([cmpMeta], MOCK_STENCIL_ROOT_DIR);

      expect(actual).toHaveLength(1);
      expect(actual[0]).toEqual(expected);
    });
  });

  describe('slots', () => {
    let cmpMeta: ComponentCompilerMeta;

    beforeEach(() => {
      cmpMeta = stubComponentCompilerMeta({
        tagName: 'my-component',
        docs: {
          text: 'a simple component that shows us your name',
          tags: [],
        },
        properties: [],
      });
    });

    it('parses a component with no slots', () => {
      const expected: ElementInfo = {
        name: 'my-component',
        deprecated: true,
        description: 'a simple component that shows us your name',
        source: { module: MOCK_MODULE_PATH, symbol: MOCK_CLASS_COMPONENT_NAME },
        attributes: [],
        slots: [],
        css: {},
      };

      cmpMeta.docs.tags = [
        {
          name: 'deprecated',
          text: "please don't use this",
        },
      ];
      const actual: ElementInfo[] = generateElementInfo([cmpMeta], MOCK_STENCIL_ROOT_DIR);

      expect(actual).toHaveLength(1);
      expect(actual[0]).toEqual(expected);
    });

    it('parses the default slot', () => {
      const expected: ElementInfo = {
        name: 'my-component',
        deprecated: false,
        description: 'a simple component that shows us your name',
        source: { module: MOCK_MODULE_PATH, symbol: MOCK_CLASS_COMPONENT_NAME },
        attributes: [],
        slots: [
          {
            name: '',
            description: 'Content is placed between the named slots if provided without a slot.',
          },
        ],
        css: {},
      };

      cmpMeta.docs.tags = [
        {
          name: 'slot',
          text: '- Content is placed between the named slots if provided without a slot.',
        },
      ];
      const actual: ElementInfo[] = generateElementInfo([cmpMeta], MOCK_STENCIL_ROOT_DIR);

      expect(actual).toHaveLength(1);
      expect(actual[0]).toEqual(expected);
    });

    it('parses a named slot with no description', () => {
      const expected: ElementInfo = {
        name: 'my-component',
        deprecated: false,
        description: 'a simple component that shows us your name',
        source: { module: MOCK_MODULE_PATH, symbol: MOCK_CLASS_COMPONENT_NAME },
        attributes: [],
        slots: [
          {
            name: 'primary',
            description: '',
          },
        ],
        css: {},
      };

      cmpMeta.docs.tags = [
        {
          name: 'slot',
          text: 'primary ',
        },
      ];
      const actual: ElementInfo[] = generateElementInfo([cmpMeta], MOCK_STENCIL_ROOT_DIR);

      expect(actual).toHaveLength(1);
      expect(actual[0]).toEqual(expected);
    });

    it('parses a slot with a name and description', () => {
      const expected: ElementInfo = {
        name: 'my-component',
        deprecated: false,
        description: 'a simple component that shows us your name',
        source: { module: MOCK_MODULE_PATH, symbol: MOCK_CLASS_COMPONENT_NAME },
        attributes: [],
        slots: [
          {
            name: 'secondary',
            description: 'Content is placed to the right of the main slotted in text',
          },
        ],
        css: {},
      };

      cmpMeta.docs.tags = [
        {
          name: 'slot',
          text: 'secondary - Content is placed to the right of the main slotted in text',
        },
      ];
      const actual: ElementInfo[] = generateElementInfo([cmpMeta], MOCK_STENCIL_ROOT_DIR);

      expect(actual).toHaveLength(1);
      expect(actual[0]).toEqual(expected);
    });
  });

  describe('shadow parts', () => {
    let cmpMeta: ComponentCompilerMeta;

    beforeEach(() => {
      cmpMeta = stubComponentCompilerMeta({
        tagName: 'my-component',
        docs: {
          text: 'a simple component that shows us your name',
          tags: [],
        },
        properties: [],
      });
    });

    it('parses a component with shadow parts', () => {
      const expected: ElementInfo = {
        name: 'my-component',
        deprecated: false,
        description: 'a simple component that shows us your name',
        source: { module: MOCK_MODULE_PATH, symbol: MOCK_CLASS_COMPONENT_NAME },
        attributes: [],
        slots: [],
        css: {
          parts: [
            // note how these will be sorted by name
            { name: 'another-label', description: 'Another label describing the component' },
            { name: 'label', description: 'The label describing the component' },
          ],
        },
      };

      cmpMeta.docs.tags = [
        {
          name: 'part',
          text: 'label - The label describing the component',
        },
        {
          name: 'part',
          text: 'another-label - Another label describing the component',
        },
      ];
      const actual: ElementInfo[] = generateElementInfo([cmpMeta], MOCK_STENCIL_ROOT_DIR);

      expect(actual).toHaveLength(1);
      expect(actual[0]).toEqual(expected);
    });

    it('omits the parts section when there are no shadow parts', () => {
      const expected: ElementInfo = {
        name: 'my-component',
        deprecated: false,
        description: 'a simple component that shows us your name',
        source: { module: MOCK_MODULE_PATH, symbol: MOCK_CLASS_COMPONENT_NAME },
        attributes: [],
        slots: [],
        css: {},
      };

      cmpMeta.docs.tags = [];
      const actual: ElementInfo[] = generateElementInfo([cmpMeta], MOCK_STENCIL_ROOT_DIR);

      expect(actual).toHaveLength(1);
      expect(actual[0]).toEqual(expected);
    });
  });
});

/**
 * Attribution: https://github.com/ionic-team/stencil/blob/85221bca12087f658328f05aba3f038c5abd4abf/src/compiler/types/tests/ComponentCompilerMeta.stub.ts#L10
 *
 * Generates a stub {@link ComponentCompilerMeta}. This function uses sensible defaults for the initial stub. However,
 * any field in the object may be overridden via the `overrides` argument.
 * @param overrides a partial implementation of `ComponentCompilerMeta`. Any provided fields will override the
 * defaults provided by this function.
 * @returns the stubbed `ComponentCompilerMeta`
 */
export const stubComponentCompilerMeta = (overrides: Partial<ComponentCompilerMeta> = {}): ComponentCompilerMeta => ({
  assetsDirs: [],
  attachInternalsMemberName: null,
  componentClassName: MOCK_CLASS_COMPONENT_NAME,
  dependencies: [],
  dependents: [],
  deserializers: [],
  directDependencies: [],
  directDependents: [],
  docs: { text: 'docs', tags: [] },
  doesExtend: false,
  elementRef: '',
  encapsulation: 'none',
  events: [],
  excludeFromCollection: false,
  formAssociated: false,
  hasAttribute: false,
  hasAttributeChangedCallbackFn: false,
  hasComponentDidLoadFn: false,
  hasComponentDidRenderFn: false,
  hasComponentDidUpdateFn: false,
  hasComponentShouldUpdateFn: false,
  hasComponentWillLoadFn: false,
  hasComponentWillRenderFn: false,
  hasComponentWillUpdateFn: false,
  hasConnectedCallbackFn: false,
  hasDeserializer: false,
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
  hasModernPropertyDecls: false,
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
  hasSerializer: false,
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
  serializers: [],
  shadowDelegatesFocus: false,
  sourceFilePath: `/${MOCK_MODULE_PATH}`,
  sourceMapPath: '/some/stubbed/path/my-component.js.map',
  states: [],
  styleDocs: [],
  styles: [],
  tagName: 'stub-cmp',
  virtualProperties: [],
  watchers: [],
  ...overrides,
});
