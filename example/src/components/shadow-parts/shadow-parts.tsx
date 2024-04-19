import { Component, h } from '@stencil/core';

/**
 * An example using Shadow Parts.
 *
 * The 'label' part is declared in the component-level JSDoc using "@part NAME - DESCRIPTION".
 *
 * @part first-msg - The text describing the first message of the component.
 * @part second-msg - The text describing the second message of the component.
 */
@Component({
  tag: 'shadow-parts',
  styles: 'div { background: LightGray; }',
  shadow: true,
})
export class ShadowParts {

  render() {
    return (
      <div>
        <div part="first-msg">I am styled with Shadow Parts!</div>
        <div part="second-msg">I am also styled with Shadow Parts!</div>
        <div>I am not styled with Shadow Parts</div>
      </div>
    );
  }

}
