import mongoose, { Schema, model } from 'mongoose';

const transactionSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    events: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
    total: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    paymentMethod: { type: String, enum: ['card', 'paypal', 'bank_transfer'], required: true, default: 'card' },
    transactionId: String,
    tenantId: String,
  },
  { timestamps: true }
);

export default model('Transaction', transactionSchema);
