import expressAsyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Event from '../models/event-model';
import { Request, Response } from 'express';

export const newEvent = expressAsyncHandler(async (req: any, res: Response) => {
  const data = req.body;
  try {
    if (!mongoose.isValidObjectId(data._id)) {
      delete data._id;
      const createEvent = await Event.create(data);
      req.io.emit('update-event', createEvent);
      res.status(200).json(createEvent);
    } else {
      const updateEvent = await Event.findByIdAndUpdate(data._id, data, { new: true });
      req.io.emit('update-event', updateEvent);
      res.status(200).json(updateEvent);
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

export const getEvents = async (req: Request, res: Response) => {
  try {
    const events = await Event.find({});
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ msg: 'Invalid event ID' });
    }
    const event = await Event.findById(id);
    if (!event) {
      res.status(404).json({ msg: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
