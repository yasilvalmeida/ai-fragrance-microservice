import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe('ok');
        expect(res.body.service).toBe('ai-fragrance-microservice');
      });
  });

  it('/fragrance/match (POST) should require valid data', () => {
    return request(app.getHttpServer())
      .post('/fragrance/match')
      .send({
        preferences: 'test',
        preferredNotes: [],
        intensity: 'invalid',
      })
      .expect(400);
  });

  it('/fragrance/match (POST) should accept valid data', () => {
    return request(app.getHttpServer())
      .post('/fragrance/match')
      .send({
        preferences: 'I love fresh, citrusy scents that make me feel energetic',
        preferredNotes: ['citrus', 'bergamot'],
        intensity: 'moderate',
        occasion: 'daily',
        season: 'summer',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.recommendations).toBeDefined();
        expect(Array.isArray(res.body.recommendations)).toBe(true);
        expect(res.body.analysis).toBeDefined();
        expect(res.body.tips).toBeDefined();
        expect(res.body.timestamp).toBeDefined();
      });
  });
}); 