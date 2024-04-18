import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'example',
  outputTargets: [
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
  testing: {
    browserHeadless: "new",
  },
};
