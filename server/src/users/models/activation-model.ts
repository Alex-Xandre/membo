import mongoose from 'mongoose';

const activationCodeSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    code: {
      type: String,
      required: true,
    },
    expiry: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ActivationCode = mongoose.model('ActivationCode', activationCodeSchema);

export default ActivationCode;
