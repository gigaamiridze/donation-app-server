import express, { Application, Request, Response } from 'express';
import Stripe from 'stripe';
import morgan from 'morgan';
import cors from 'cors';
import { PORT, STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY } from './env';

const app: Application = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.post('/create-payment-intent', async (req: Request, res: Response) => {
  const { email, currency, amount } = req.body;

  if (STRIPE_SECRET_KEY) {
    const stripe = new Stripe(STRIPE_SECRET_KEY, {
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
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
