import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { GroupsModule } from '../src/groups/groups.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [GroupsModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/groups (GET)', () => {
    return request(app.getHttpServer()).get('/groups').expect(200);
  });
});
