import Joi from 'joi';

export const user = {
  auth: {
    mode: 'try'
  },
  description: 'User State',
  notes: 'Get all user details',
  tags: ['api', 'basic'],
  plugins: {
    'hapi-swagger': {
      responses: {
        200: {
          schema: Joi.object({
            data: Joi.object({
              email: Joi.string()
            })
          })
        }
      }
    }
  },
  handler: (request, reply) => {
    if (!request.auth.isAuthenticated) {
      return reply({});
    }
    return reply({
      data: {
        email: request.auth.credentials.email
      }
    });
  }
};
