require('dotenv').config();

import * as env from 'env-var';

export const serverConfig = {
  url: env.get('FORUM_DEFAULT_URL').default('localhost:3000').asUrlString(),

  port: env.get('FORUM_SERVICE_PORT').default('3000').asPortNumber(),

  env: env.get('NODE_ENV').default('development').asString(),
};

export const secret = {
  JWT_SECRET_KEY: env.get('JWT_SECRET_KEY').required().asString(),
};
