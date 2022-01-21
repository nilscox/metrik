import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import dotenv from 'dotenv-safe';
import request, { SuperAgentTest } from 'supertest';

import { AppModule } from './app.module';
import { DatabaseService } from './common/database/database.service';
import { Logger, LoggerModule } from './common/logger';
import { DevNullLogger } from './common/logger/dev-null-logger';
import { Credentials } from './modules/authentication/domain/credentials';
import { createUser } from './modules/user/domain/user';
import { UserStore, UserStoreToken } from './modules/user/domain/user.store';

dotenv.config({ path: '.env.test' });

describe('e2e', () => {
  let db: DatabaseService;
  let userStore: UserStore;
  let app: INestApplication;

  let agent: SuperAgentTest;

  before(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, LoggerModule],
    })
      .overrideProvider(Logger)
      .useClass(DevNullLogger)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    db = app.get(DatabaseService);
    userStore = app.get<UserStore>(UserStoreToken);

    await db.runMigrations();

    agent = request.agent(app.getHttpServer());
  });

  after(async () => {
    await db.closeConnection();
    await app?.close();
  });

  beforeEach(async () => {
    await db.clear();
  });

  it('a user logs in, creates a project and its last metrics', async () => {
    const credentials: Credentials = {
      email: 'user@domain.tld',
      password: 'some password',
    };

    // prettier-ignore
    // cSpell:disable-next-line
    const hashedPassword = '$2b$10$QB2yC/AtXUMZA3mxOahcjuETGF6rOkpJXnKQY3LIlPJHmhOWai5aO';
    const user = createUser({ email: credentials.email, hashedPassword });

    await userStore.saveUser(user);

    const loginResponse = await agent.post('/auth/login').send(credentials).expect(200);
    const token = loginResponse.body.token;

    agent.use((req) => {
      req.set('Authorization', `Beer ${token}`);
    });

    const { body: project } = await agent.post('/project').send({ name: 'My project' }).expect(201);
    project;
  });
});
