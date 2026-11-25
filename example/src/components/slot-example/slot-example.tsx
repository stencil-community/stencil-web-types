import { Component, h } from '@stencil/core';

/**
 * @slot - Content is placed between the named slots if provided without a slot.
 * @slot primary - Content is placed to the left of the main slotted-in text.
 * @slot secondary
 */
@Component({
  tag: 'slot-example',
  encapsulation: { type: 'shadow' },
})
export class SlotExample {
  render() {
    return (
      <section>
        <slot name="primary"></slot>
        <slot></slot>
        <slot name="secondary"></slot>
      </section>
    );
  }

}
