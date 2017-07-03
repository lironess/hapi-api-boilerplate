import request from 'supertest';
import { verify } from 'jsonwebtoken';
import { getServer } from 'config/server';

jest.mock('jsonwebtoken');

describe('Routes - User', () => {
  let server;
  const { email, token } = {
    email: 'example@gmail.com',
    token: '1.2.3'
  };

  beforeAll(async () => {
    server = await getServer();
  });

  beforeEach(async () => {
    jest.resetAllMocks();
  });

  describe('/user', () => {
    it('returns user details when header provided', () => {
      verify.mockImplementation((_, __, ___, done) => done(null, { email }));

      return request(server.listener)
        .get('/user')
        .set('Authorization', token)
        .expect(200)
        .then(({ body }) => {
          expect(body).to.deep.equal({ data: { email } });
        });
    });
    it('returns null when header not provided', () => (
      request(server.listener)
        .get('/user')
        .expect(200)
        .then(({ body }) => {
          expect(body).to.deep.equal({});
        })
    ));
  });
});
