import { Config } from '@stencil/core';
import { webTypesOutputTarget } from '@stencil-community/web-types-output-target';

export const config: Config = {
  namespace: 'example',
  outputTargets: [
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
    webTypesOutputTarget(),
  ],
  testing: {
    browserHeadless: "new",
  },
};
