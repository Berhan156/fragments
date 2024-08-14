// tests/unit/app.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('App', () => {
  test('404 handler', async () => {
    const res = await request(app).get('/does-not-exist');
    expect(res.body.status).toEqual('error');
    expect(res.body.error.message).toEqual('not found');
    expect(res.body.error.code).toBe(404);
  });
});
