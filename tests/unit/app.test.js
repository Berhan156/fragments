// tests/unit/app.test.js

const request = require('supertest');
const app = require('../../src/app');

describe('404 handler', () => {
  test('should return 404 for non-existent endpoints', async () => {
    const res = await request(app).get('/non-existent-endpoint');
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.error).toHaveProperty('message', 'not found');
    expect(res.body.error).toHaveProperty('code', 404);
  });
});
