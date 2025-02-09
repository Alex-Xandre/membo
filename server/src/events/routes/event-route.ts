import express from 'express';
import protect from '../../middlewares/auth-protect';
import { createEvent, getEventById, getEvents, newEvent } from '../controllers/event-controller';
import stripeInstance from './stripe';

const router = express.Router();

router.post('/add-event', protect, newEvent);
router.get('/events', protect, getEvents);
router.get('/event/:id', protect, getEventById);

router.post('/add-transaction', protect, createEvent);
router.get('/transaction', protect, getEvents);
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency } = req.body;

    if (!amount || !currency) {
      return res.status(400).json({ error: 'Amount and currency are required.' });
    }

    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
