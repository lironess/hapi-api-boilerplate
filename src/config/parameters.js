import Joi from 'joi';

const port = 8000;

const shared = {
  JWT_SECRET: 'ThisIsHapiApiBoilerplatePassword'
};

const configuration = {
  development: {
    ...shared,
    PORT: port,
    SERVER_URL: 'http://127.0.0.1:8000',
    DATABASE_URL: 'postgres://postgres@127.0.0.1:5432/postgres',
    DOCUMENTATION: {
      PROTOCOL: 'http',
      HOST: `localhost:${port}`
    }
  },
  production: {
    ...shared,
    SERVER_URL: 'http://myServer:8000',
    DOCUMENTATION: {
      PROTOCOL: 'https',
      HOST: 'hapi-api-boilerplate.herokuapp.com'
    }
  }
};

const environment = process.env.NODE_ENV || 'development';

const parametersSchema = Joi.object({
  JWT_SECRET: Joi.string().required(),
  SERVER_URL: Joi.string().uri().required(),
  NODE_ENV: Joi.string().allow(['development', 'production']).default('development'),
  DATABASE_URL: Joi.string().required(),
  PORT: Joi.number().default(8000)
}).unknown().required();

const { error, value: parameters } = Joi.validate(
  {
    ...process.env,
    ...configuration[environment]
  },
  parametersSchema
);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default parameters;
