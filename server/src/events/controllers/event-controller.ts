import expressAsyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Event from '../models/event-model';
import { Request, Response } from 'express';
import { CustomRequest } from '../../types';
import Transaction from '../models/transaction-model';

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

export const getEvents = async (req: CustomRequest, res: Response) => {
  try {
    const events = await Event.find({});
    const isAdmin =
      req.user.role === 'admin'
        ? events
        : req.user.role === 'tenant'
        ? events.filter((x) => x.createdBy.toString() === req.user._id.toString())
        : events.filter((x) => x.createdBy.toString() === (req.user as any).tenantUserId?.tenantId);
    res.status(200).json(isAdmin);
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
//ransaction-creation
export const createEvent = expressAsyncHandler(async (req: any, res: Response) => {
  const data = req.body;

  try {
    if (!mongoose.isValidObjectId(data._id)) {
      delete data._id;
      const createTransaction = await Transaction.create(data);
      req.io.emit('update-transaction', createTransaction);
      res.status(200).json(createTransaction);
    } else {
      const updateTransaction = await Transaction.findByIdAndUpdate(data._id, data, { new: true });
      req.io.emit('update-transaction', updateTransaction);
      res.status(200).json(updateTransaction);
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

export const getTransactions = async (req: CustomRequest, res: Response) => {
  try {
    const transaction = await Transaction.find({});
    const isAdmin =
      req.user.role === 'admin'
        ? transaction
        : req.user.role === 'tenant'
        ? transaction.filter((x) => x.tenantId.toString() === req.user._id.toString())
        : transaction.filter((x) => x.tenantId.toString() === (req.user as any).tenantUserId?.tenantId);
    res.status(200).json(isAdmin);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
