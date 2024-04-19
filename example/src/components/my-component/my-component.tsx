import { Component, Prop, h } from '@stencil/core';

/**
 * A component for displaying a person's name
 */
@Component({
  tag: 'my-component',
  shadow: true,
})
export class MyComponent {
  /**
   * The first name, which is required
   */
  @Prop() first!: string;

  /**
   * The middle name, defaults to "Unknown"
   */
  @Prop() middle: string = "Unknown";

  /**
   * The last name
   */
  @Prop() last: string;

  /**
   * A suffix, for titles like "PhD" and "MBA"
   * @deprecated
   */
  @Prop() suffix: string;

  render() {
    return <div>Hello, World! I'm here</div>;
  }
}
