import { SiteConfig } from 'config/definitions/sites';

export const DEFAULT: SiteConfig[] = [
  {
    name: 'local',
    host: 'http://localhost:8000',
    apiPrefix: '/ispyb/api/v1',
  },
];
