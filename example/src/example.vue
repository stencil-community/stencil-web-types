<!-- Note: This Vue file is not wired up to any webserver. It is solely for demonstration purposes in the IDE -->

<!-- For any of the components in this file, right-clicking on the tag name->"Go To"->"Declaration or Usages" will -->
<!-- take you to the component's class definition file. -->

<template>
  <!-- After setup, hover over the component name and each of the props -->
  <!--
       - my-component will have its description pulled from its JSDoc
       - first will have its description pulled from its JSDoc. Its required status will be reported (hint: try removing it and see what the IDE does).
       - middle will have its description pulled from its JSDoc. Its default value will be reported.
       - last will have its description pulled from its JSDoc.
       - suffix will have its description pulled from its JSDoc. It will be reported as deprecated.
  -->
  <h2>Prop Example (&lt;my-component&gt;)</h2>
  <my-component first="Stencil" middle=" " last="'Don't call me a framework'" suffix="JS"></my-component>

  <br />

  <!-- After setup, hover over the slot names - each of the slot's descriptions will be shown by intellisense -->
  <!-- Also try deleting one of the slot attributes, notice how intellisense suggests the slot names for you! -->
  <h2>Slot Example (&lt;slot-example&gt;)</h2>
  <slot-example>
    <div>Main content</div>
    <div slot="primary">Primary Content</div>
    <div slot="secondary">Secondary Content</div>
  </slot-example>

  <br />

  <!-- Demonstrates how shadow parts work. See the style tag below for more information. -->
  <h2>CSS Shadow Part Example (&lt;shadow-parts&gt;)</h2>
  <shadow-parts></shadow-parts>
</template>

<!-- Corresponds to the shadow-parts element above.  -->
<!-- After setup, hover over the shadow part name to see its description. -->
<!-- After setup, autocomplete for the shadow part names will also work. Try deleting 'first-msg' below and retyping it -->
<style scoped>
shadow-parts::part(first-msg) {
  background: aqua;
}
shadow-parts::part(second-msg) {
  background: lightgreen;
}
</style>
