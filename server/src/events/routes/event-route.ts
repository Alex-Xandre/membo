import express from 'express';

import protect from '../middlewares/auth-protect';
import { getEventById, getEvents, newEvent } from '../events/controllers/event-controller';

const router = express.Router();

router.post('/add-event', protect, newEvent);
router.get('/events', protect, getEvents);
router.get('/event/:id', protect, getEventById);

export default router;
