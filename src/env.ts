import dotenv from 'dotenv';

dotenv.config();

export const { PORT, STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY } = process.env;
