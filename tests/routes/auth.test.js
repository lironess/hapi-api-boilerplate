import { mocks } from 'utils';
import request from 'supertest';
import { Model } from 'sequelize';
import { verify } from 'jsonwebtoken';
import isUndefined from 'lodash/fp/isUndefined';

jest.mock('sequelize');
jest.mock('jsonwebtoken');
jest.doMock('config/db', mocks.hapiPlugin);
const { getServer } = require('config/server'); // require instead of import becaose of babel-plugin-jest-hoist

describe('Routes - Auth', () => {
  let server;
  const { email, password, token, id } = {
    email: 'example@gmail.com',
    password: '1234567',
    token: '1.2.3',
    id: 1
  };
  const mockDatabase = ({
    authenticateResult = true,
    findOneResult,
    createResult = { id, email, password, token } } = {}) => {
    const authenticate = jest.fn(() => authenticateResult);
    let findOne = {
      authenticate,
      ...createResult
    };
    if (!(isUndefined(findOneResult))) {
      findOne = findOneResult;
    }
    Model.findOne.mockImplementation(() => findOne);
    Model.create.mockImplementation(() => createResult);
    return { authenticate };
  };

  beforeAll(async () => {
    server = await getServer();
    server.decorate('request', 'getDb', () => ({
      models: {
        user: Model
      }
    }));
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('/login', () => {
    it('successfully login', () => {
      const { authenticate } = mockDatabase();

      return request(server.listener)
        .post('/login')
        .send({ email, password })
        .expect(200)
        .then(({ body, headers }) => {
          expect(authenticate).toBeCalled();
          expect(body).to.deep.equal({
            success: true,
            data: { email, id, token }
          });
          expect(headers.authorization).to.equal(token);
        });
    });

    it('returns 400 if no email provided', () => (
      request(server.listener)
        .post('/login')
        .send({ password })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).to.have.string('email');
        })
    ));

    it('returns 400 if no password provided', () => (
      request(server.listener)
        .post('/login')
        .send({ email })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).to.have.string('password');
        })
    ));

    it('returns error when already authenticated', () => {
      verify.mockImplementation((_, __, ___, done) => done(null, { email }));

      return request(server.listener)
        .post('/login')
        .set('Authorization', token)
        .send({ email, password })
        .expect(200)
        .then(({ body }) => {
          expect(body).to.deep.equal({
            success: false,
            error: 'already authenticated'
          });
        });
    });

    it('return error if user does not exist', () => {
      mockDatabase({ findOneResult: null });

      return request(server.listener)
        .post('/login')
        .send({ email, password })
        .expect(200)
        .then(({ body }) => {
          expect(body).to.deep.equal({
            success: false,
            error: 'invalid email/password'
          });
        });
    });

    it('return error if invalid credentials provided (wrong passord)', () => {
      const { authenticate } = mockDatabase({ authenticateResult: false });

      return request(server.listener)
        .post('/login')
        .send({ email, password })
        .expect(200)
        .then(({ body }) => {
          expect(authenticate).toBeCalled();
          expect(body).to.deep.equal({
            success: false,
            error: 'invalid email/password'
          });
        });
    });
  });

  describe('/register', () => {
    it('successfully register', () => {
      mockDatabase({ findOneResult: null });

      return request(server.listener)
        .post('/register')
        .send({ email, password })
        .expect(200)
        .then(({ body, headers }) => {
          expect(body).to.deep.equal({
            success: true,
            data: { email, id, token }
          });
          expect(headers.authorization).to.equal(token);
        });
    });

    it('returns 400 if no email provided', () => (
      request(server.listener)
        .post('/register')
        .send({ password })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).to.have.string('email');
        })
    ));

    it('returns 400 if no password provided', () => (
      request(server.listener)
        .post('/register')
        .send({ email })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).to.have.string('password');
        })
    ));

    it('returns error when already authenticated', () => {
      verify.mockImplementation((_, __, ___, done) => done(null, { email }));

      return request(server.listener)
        .post('/register')
        .set('Authorization', token)
        .send({ email, password })
        .expect(200)
        .then(({ body }) => {
          expect(body).to.deep.equal({
            success: false,
            error: 'already authenticated'
          });
        });
    });

    it('return error if user with this email is already exists', () => {
      mockDatabase();

      return request(server.listener)
        .post('/register')
        .send({ email, password })
        .expect(200)
        .then(({ body }) => {
          expect(body).to.deep.equal({
            success: false,
            error: 'user with this email is already exists'
          });
        });
    });
  });
});
