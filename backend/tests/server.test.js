process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../server');

describe('Backend API - basic health and validation', () => {
  test('GET / should return running message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/running/i);
  });

  test('POST /api/auth/login without credentials should return 400', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('GET /api/notes without auth token should return 401', async () => {
    const res = await request(app).get('/api/notes');
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
});
