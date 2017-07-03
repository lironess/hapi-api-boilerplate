import Joi from 'joi';
import pick from 'lodash/fp/pick';

const authResponses = {
  200: {
    schema: Joi.object({
      success: Joi.bool().required(),
      data: Joi.object({
        email: Joi.string(),
        id: Joi.number(),
        token: Joi.string()
      }),
      error: Joi.string()
    }).required()
  },
  400: { description: 'Invalid paramters' }
};

export const login = {
  auth: { mode: 'try' },
  description: 'Login',
  notes: 'Basic login - without OAuth',
  tags: ['api', 'auth'],
  plugins: {
    'hapi-swagger': {
      responses: authResponses
    }
  },
  validate: {
    payload: Joi.object({
      email: Joi.string().email().required().example('a@a.com'),
      password: Joi.string().required().example('a')
    }).required()
  },
  handler: async (request, reply) => {
    if (request.auth.isAuthenticated) {
      return reply({
        success: false,
        error: 'already authenticated'
      });
    }

    const user = await request.getDb().models.user.findOne({
      where: { email: request.payload.email }
    });
    if (!user || !(user.authenticate(request.payload.password))) {
      return reply({
        success: false,
        error: 'invalid email/password'
      });
    }
    return reply({ success: true, data: { ...pick(['email', 'id', 'token'])(user) } }).header('Authorization', user.token);
  }
};

export const register = {
  auth: { mode: 'try' },
  description: 'Register',
  notes: 'Register route',
  tags: ['api', 'auth'],
  plugins: {
    'hapi-swagger': {
      responses: authResponses
    }
  },
  validate: {
    payload: Joi.object({
      email: Joi.string().email().required().example('a@a.com'),
      password: Joi.string().required().example('a')
    }).required()
  },
  handler: async (request, reply) => {
    if (request.auth.isAuthenticated) {
      return reply({
        success: false,
        error: 'already authenticated'
      });
    }

    const user = await request.getDb().models.user.findOne({
      where: { email: request.payload.email }
    });
    if (user) {
      return reply({
        success: false,
        error: 'user with this email is already exists'
      });
    }
    const newUser = await request.getDb().models.user.create({
      email: request.payload.email,
      password: request.payload.password
    }, { returning: true });
    return reply({ success: true, data: pick(['email', 'id', 'token'])(newUser) }).header('Authorization', newUser.token);
  }
};
