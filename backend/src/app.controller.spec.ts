import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import expect from 'expect';

import { AppController } from './app.controller';
import { ConfigPort, StubConfigAdapter } from './common/config';
import { DatabaseModule } from './common/database';
import { DevNullLogger } from './common/logger';

describe('AppController', () => {
  let app: TestingModule;
  let appController: AppController;

  before(async () => {
    app = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [AppController],
    })
      .overrideProvider(Logger)
      .useClass(DevNullLogger)
      .overrideProvider(ConfigPort)
      .useValue(new StubConfigAdapter({ STORE: 'sql', DATABASE_FILENAME: ':memory:' }))
      .compile();

    appController = app.get(AppController);
  });

  after(async () => {
    await app?.close();
  });

  it("checks the main component's availability", async () => {
    expect(await appController.healthcheck()).toEqual({
      api: true,
      db: true,
    });
  });
});
