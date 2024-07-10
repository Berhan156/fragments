const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments/:id/info', () => {
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/1/info').expect(401));

  test('incorrect credentials are denied', () =>
    request(app)
      .get('/v1/fragments/1/info')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  test('authenticated users get fragment info by ID', async () => {
    const postResponse = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');

    const fragmentId = postResponse.body.id;

    const getResponse = await request(app)
      .get(`/v1/fragments/${fragmentId}/info`)
      .auth('user1@email.com', 'password1');

    expect(getResponse.statusCode).toBe(200);
    expect(getResponse.body.status).toBe('ok');
    expect(getResponse.body.fragment.id).toBe(fragmentId);
    expect(getResponse.body.fragment.type).toBe('text/plain');
    expect(getResponse.body.fragment.size).toBe(18);
  });

  test('return 404 if fragment not found', async () => {
    const res = await request(app)
      .get('/v1/fragments/invalid-id/info')
      .auth('user1@email.com', 'password1');

    console.log('Response:', res.body);

    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.error.code).toBe(404);
    expect(res.body.error.message).toBe('Fragment not found');
  });
});
