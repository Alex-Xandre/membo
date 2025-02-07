import mongoose, { Schema, model } from 'mongoose';
import { EventTypes } from '../../types';

const eventSchema = new Schema<EventTypes>(
  {
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    eventName: { type: String },
    eventDescription: { type: String },
    eventStartDate: { type: String },
    eventStartTime: { type: String },
    eventEndDate: { type: String },
    eventEndTime: { type: String },
    eventAddress: {
      fullAddress: { type: String },
      latitude: { type: Number },
      longitude: { type: Number },
    },
  },
  {
    timestamps: true,
  }
);

export default model<EventTypes>('Event', eventSchema);
