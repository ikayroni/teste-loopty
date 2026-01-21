import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user', () => {
      const email = `test-${Date.now()}@example.com`;
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email,
          password: 'password123',
          name: 'Test User',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('token');
          expect(res.body.user).toHaveProperty('email', email);
        });
    });

    it('should fail with invalid email', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123',
          name: 'Test User',
        })
        .expect(400);
    });

    it('should fail with short password', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: '123',
          name: 'Test User',
        })
        .expect(400);
    });
  });

  describe('/auth/login (POST)', () => {
    it('should login an existing user', async () => {
      const email = `test-${Date.now()}@example.com`;
      const password = 'password123';

      // First register
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email,
          password,
          name: 'Test User',
        });

      // Then login
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email, password })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('token');
          expect(res.body.user).toHaveProperty('email', email);
        });
    });

    it('should fail with wrong credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });
});
