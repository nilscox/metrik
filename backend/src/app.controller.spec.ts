import { Test, TestingModule } from '@nestjs/testing';
import expect from 'expect';

import { AppController } from './app.controller';
import { ConfigPort } from './common/config';
import { TestConfigAdapter } from './common/config/test-config.adapter';
import { DatabaseModule } from './common/database';

describe('AppController', () => {
  let app: TestingModule;
  let appController: AppController;

  before(async () => {
    app = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [AppController],
    })
      .overrideProvider(ConfigPort)
      .useValue(new TestConfigAdapter({ STORE: 'sql' }))
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
