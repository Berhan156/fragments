// tests/unit/post.test.js

const request = require('supertest');
const app = require('../../src/app');

describe('POST /v1/fragments', () => {
  test('Return a success response if a text/plain fragment is created', async () => {
    const response = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');

    console.log(response.body);

    expect(response.statusCode).toBe(201);
    expect(response.body.status).toBe('ok');
    expect(response.body.id).toBeDefined();
    expect(response.body['Content-Type']).toBe('text/plain');
  });

  test('Return a success response if an application/json fragment is created', async () => {
    const response = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ key: 'value' }));

    console.log(response.body);

    expect(response.statusCode).toBe(201);
    expect(response.body.status).toBe('ok');
    expect(response.body.id).toBeDefined();
    expect(response.body['Content-Type']).toBe('application/json');
  });

  test('Return 400 error if no body is provided', async () => {
    const response = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('');

    console.log(response.body);

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe('error');
    expect(response.body.error.code).toBe(400);
    expect(response.body.error.message).toBe('No body provided');
  });

  test('Return 415 error for improper Content-Type', async () => {
    const response = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/unsupported')
      .send('This is a fragment');

    console.log(response.body);

    expect(response.statusCode).toBe(415);
    expect(response.body.status).toBe('error');
    expect(response.body.error.code).toBe(415);
    expect(response.body.error.message).toBe('Improper Content-Type');
  });
});
