import mongoose from 'mongoose';

const Schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    permitInfo: {
      type: String,
      required: true,
    },
    permitState: {
      type: String,
      enum: ['submitted', 'approved', 'rejected'],
      default: 'onTime',
    },
    createdAt: {
      type: Number,
    },
    updatedAt: {
      type: Number,
    },
  },
  {
    timestamps: {
      currentTime: () => Math.floor(Date.now() / 1000),
    },
  },
);

export default mongoose.model('Permit', Schema);
