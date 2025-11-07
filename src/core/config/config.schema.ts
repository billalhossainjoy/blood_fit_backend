import Joi from 'joi';

export enum NODE_ENV {
  development = 'development',
  production = 'production',
  test = 'test',
}

export const ConfigValidateEnv = Joi.object({
  NODE_ENV: Joi.string()
    .valid(...Object.values(NODE_ENV))
    .default('development'),
  PORT: Joi.string().custom((value, helpers) => {
    const num = Number(value);
    if (isNaN(num))
      helpers.error('any.invalid', {
        value: value as string,
        message: 'PORT must be a number',
      });

    return num;
  }),
  API_URL: Joi.string().required(),
  API_DOCUMENTATION: Joi.string().required(),
  DATABASE_URL: Joi.string().required(),

  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),

  SMTP_HOST: Joi.string().required(),
  SMTP_PORT: Joi.string().required(),
  SMTP_SECURE: Joi.boolean().required(),
  SMTP_AUTH_USER: Joi.string().required(),
  SMTP_AUTH_PASSWORD: Joi.string().required(),
  SMTP_MAIL_FROM: Joi.string().required(),
});
