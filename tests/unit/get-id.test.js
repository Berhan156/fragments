const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments/:id', () => {
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/1').expect(401));

  test('incorrect credentials are denied', () =>
    request(app)
      .get('/v1/fragments/1')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  test('authenticated users get a fragment by ID', async () => {
    const postResponse = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send('# This is a fragment');

    const fragmentId = postResponse.body.id;

    const getResponse = await request(app)
      .get(`/v1/fragments/${fragmentId}`)
      .auth('user1@email.com', 'password1');

    expect(getResponse.statusCode).toBe(200);
    expect(getResponse.text).toBe('# This is a fragment');
  });

  test('return 404 if fragment not found', async () => {
    const res = await request(app)
      .get('/v1/fragments/invalid-id')
      .auth('user1@email.com', 'password1');
    
    console.log('Response:', res.body);

    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.error.code).toBe(404);
    expect(res.body.error.message).toBe('Fragment not found');
  });

  test('convert Markdown fragment to HTML', async () => {
    const postResponse = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send('# This is a fragment');

    console.log('POST response:', postResponse.body);

    const fragmentId = postResponse.body.id;

    const getResponse = await request(app)
      .get(`/v1/fragments/${fragmentId}.html`)
      .auth('user1@email.com', 'password1');

    console.log('GET response:', getResponse.body);

    expect(getResponse.statusCode).toBe(200);
    expect(getResponse.headers['content-type']).toBe('text/html');
    expect(getResponse.text).toBe('<h1>This is a fragment</h1>\n');
  });
});
