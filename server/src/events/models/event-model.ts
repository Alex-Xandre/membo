import mongoose, { Schema, model } from 'mongoose';
import { EventTypes } from '../../types';
import { getRandomCover } from '../../helpers/generateRandomCover';

const eventSchema = new Schema<EventTypes>(
  {
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    eventName: { type: String },
    eventBanner: { type: String, default: getRandomCover() },
    eventDescription: { type: String },
    eventStartDate: { type: String },
    eventStartTime: { type: String },
    eventEndDate: { type: String },
    eventEndTime: { type: String },
    eventType: String,
    eventIsFeatured: { type: Boolean, default: false },
    eventAddress: {
      fullAddress: { type: String },
      latitude: { type: Number },
      longitude: { type: Number },
    },
    eventPrice: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export default model<EventTypes>('Event', eventSchema);
