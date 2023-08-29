import { onRequest } from 'firebase-functions/v2/https';
import * as express from 'express';
import * as morgan from 'morgan';
import * as cors from 'cors';
import Stripe from 'stripe';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.post('/create-payment-intent', async (req, res) => {
  const { email, currency, amount } = req.body;

  if (process.env.STRIPE_SECRET_KEY) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-08-16',
    });

    const customer = await stripe.customers.create({ email });

    const params: Stripe.PaymentIntentCreateParams = {
      amount: parseInt(amount),
      currency,
      customer: customer.id,
      payment_method_options: {
        card: {
          request_three_d_secure: 'automatic',
        },
      },
      payment_method_types: ['card'],
    }

    try {
      const paymentIntent = await stripe.paymentIntents.create(params);
      return res.send({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      const stripeError: Stripe.StripeRawError = error as Stripe.StripeRawError;
      return res.send({
        error: stripeError.message,
      });
    }
  }

  return res.status(500).send({
    error: 'Stripe secret key is missing or invalid.',
  });
});

export const stripePayment = onRequest({ maxInstances: 10 }, app);
