import { createSingletonResource, SingletonEntity } from './Base/Singleton';

class LoginEntity extends SingletonEntity {
  plugin: string
  login: string
  password: string
  token: string
}

export const LoginResource = createSingletonResource({
  path: '/auth/login/:dummy',
  schema: LoginEntity,
});
