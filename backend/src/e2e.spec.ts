import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request, { SuperAgentTest } from 'supertest';

import { AppModule } from './app.module';
import { Credentials } from './authentication/domain/credentials';
import { createUser } from './authentication/domain/user';
import { UserStoreToken } from './authentication/domain/user.store';
import { InMemoryUserStore } from './authentication/infrastructure/user-store/in-memory-user.store';
import { InMemoryMetricsStore } from './metrics/infrastructure/store/in-memory-metrics.store';
import { MetricsStoreToken } from './metrics/infrastructure/store/metrics-store-token';

describe('e2e', () => {
  let userStore: InMemoryUserStore;
  let metricsStore: InMemoryMetricsStore;

  let app: INestApplication;

  let agent: SuperAgentTest;

  beforeEach(async () => {
    userStore = new InMemoryUserStore();
    metricsStore = new InMemoryMetricsStore();

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(UserStoreToken)
      .useValue(userStore)
      .overrideProvider(MetricsStoreToken)
      .useValue(metricsStore)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    agent = request.agent(app.getHttpServer());
  });

  afterEach(async () => {
    await app.close();
  });

  it("logs in and fetches the user's last metrics", async () => {
    const credentials: Credentials = {
      email: 'user@domain.tld',
      password: 'some password',
    };

    // prettier-ignore
    // cSpell:disable-next-line
    const hashedPassword = '$2b$10$QB2yC/AtXUMZA3mxOahcjuETGF6rOkpJXnKQY3LIlPJHmhOWai5aO';

    userStore.add(createUser({ email: credentials.email, hashedPassword }));

    const loginResponse = await agent
      .post('/auth/login')
      .send(credentials)
      .expect(200);

    const token = loginResponse.body.token;

    await agent
      .get('/metrics/last')
      .set('Authorization', `Bières ${token}`)
      .expect(200);
  });
});
