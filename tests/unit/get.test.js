const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated users get a fragments array', async () => {
    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
  });

  // Using a valid username/password pair should give a success result with expanded fragments metadata
  test('authenticated users get expanded fragments metadata', async () => {
    const res = await request(app)
      .get('/v1/fragments?expand=1')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
    if (res.body.fragments.length > 0) {
      expect(res.body.fragments[0]).toHaveProperty('id');
      expect(res.body.fragments[0]).toHaveProperty('ownerId');
      expect(res.body.fragments[0]).toHaveProperty('created');
      expect(res.body.fragments[0]).toHaveProperty('updated');
      expect(res.body.fragments[0]).toHaveProperty('type');
      expect(res.body.fragments[0]).toHaveProperty('size');
    }
  });
});
