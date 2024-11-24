import 'dotenv/config';

export const ENV = {
  DB_URL: process.env.DB_URL,
  KAFKA_URL: process.env.KAFKA_URL,
  S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
  S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
  S3_REGION: process.env.S3_REGION,
  S3_BUCKET: process.env.S3_BUCKET,
};
