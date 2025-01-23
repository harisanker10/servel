import 'dotenv/config';

export const ENV = {
  DB_URL: process.env.DB_URL,
  GRPC_URL: process.env.GRPC_URL,

  KAFKA_URL: process.env.KAFKA_URL,
};
