import * as dotenv from 'dotenv';

dotenv.config();

export const { STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY } = process.env;
