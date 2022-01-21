import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import dotenv from 'dotenv-safe';
import request, { SuperAgentTest } from 'supertest';

import { AppModule } from './app.module';
import { Credentials } from './authentication/domain/credentials';
import { createUser } from './authentication/domain/user';
import { UserStore, UserStoreToken } from './authentication/domain/user.store';
import db from './sql/database';

dotenv.config({ path: '.env.test' });

describe('e2e', () => {
  let userStore: UserStore;
  let app: INestApplication;

  let agent: SuperAgentTest;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    userStore = app.get<UserStore>(UserStoreToken);

    agent = request.agent(app.getHttpServer());
  });

  beforeEach(async () => {
    await db.deleteFrom('user').execute();
  });

  afterEach(async () => {
    await app?.close();
  });

  it("logs in and fetches the user's last metrics", async () => {
    const credentials: Credentials = {
      email: 'user@domain.tld',
      password: 'some password',
    };

    // prettier-ignore
    // cSpell:disable-next-line
    const hashedPassword = '$2b$10$QB2yC/AtXUMZA3mxOahcjuETGF6rOkpJXnKQY3LIlPJHmhOWai5aO';
    const user = createUser({ email: credentials.email, hashedPassword });

    await userStore.saveUser(user);

    const loginResponse = await agent
      .post('/auth/login')
      .send(credentials)
      .expect(200);

    const token = loginResponse.body.token;

    await agent
      .get('/metrics/last')
      .set('Authorization', `Beer ${token}`)
      .expect(200);
  });
});
