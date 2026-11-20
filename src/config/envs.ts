import 'dotenv/config';
import env from 'env-var';

export const envs = {
    PORT: env.get('PORT').required().asPortNumber(),
    NODE_ENV: env.get('NODE_ENV').required().asString(),
    MONGO_URL: env.get('MONGO_URL').required().asString(),
    MONGO_DBNAME: env.get('MONGO_DBNAME').required().asString(),
    JWT_SECRET: env.get('JWT_SECRET').required().asString(),
    EMAIL_API_KEY: env.get('EMAIL_API_KEY').required().asString(),
}