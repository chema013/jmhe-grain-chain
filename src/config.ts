import * as dotenv from 'dotenv';
dotenv.config();

export const GLOBAL_PREFIX = process.env.GLOBAL_PREFIX || '';
export const PORT = process.env.PORT || 3000;

export const config = () => ({
  port: Number(PORT),
  global_prefix: GLOBAL_PREFIX,
});
