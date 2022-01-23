import { Test, TestingModule } from '@nestjs/testing';
import expect from 'expect';

import { AppController } from './app.controller';
import { ConfigPort, StubConfigAdapter } from './common/config';
import { DatabaseModule } from './common/database';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [AppController],
    })
      .overrideProvider(ConfigPort)
      .useValue(new StubConfigAdapter({ STORE: 'sql', DATABASE_FILENAME: ':memory:' }))
      .compile();

    appController = app.get(AppController);
  });

  it("checks the main component's availability", async () => {
    expect(await appController.healthcheck()).toEqual({
      api: true,
      db: true,
    });
  });
});
