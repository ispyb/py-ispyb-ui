import { Entity } from '@rest-hooks/endpoint';
import { SiteEndpoint } from './Base/Site';

class LoginEntity extends Entity {
  plugin: string;
  login: string;
  password: string;
  token: string;

  pk() {
    return this.login;
  }
}

export const LoginEndpoint = new SiteEndpoint({
  path: '/auth/login',
  schema: LoginEntity,
  method: 'POST',
});
