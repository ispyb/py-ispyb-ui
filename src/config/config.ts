import { DEFAULT } from './default';
import { ESRF } from './esrf';
import { NETLIFY } from './netlify';

const ISPYB_ENV = process.env.REACT_APP_ISPYB_ENV;
console.log(ISPYB_ENV);

const getSitesConfig = () => {
  if (ISPYB_ENV === undefined) return DEFAULT;
  if (ISPYB_ENV.toLowerCase().includes('esrf')) return ESRF;
  if (ISPYB_ENV.toLowerCase().includes('netlify')) return NETLIFY;
  return DEFAULT;
};

export const SITES = getSitesConfig();
