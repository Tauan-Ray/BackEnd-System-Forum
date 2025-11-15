require('dotenv').config();

import * as env from 'env-var';

export const serverConfig = {
  port: env.get('FORUM_SERVICE_PORT').default('3000').asPortNumber(),
};

export const secret = {
  JWT_SECRET_KEY: env.get('JWT_SECRET_KEY').required().asString(),
};

export const ociConfig = {
  OCI_REGION: env.get('OCI_REGION').required().asString(),
  OCI_BUCKET_NAME: env.get('OCI_BUCKET_NAME').required().asString(),
};
