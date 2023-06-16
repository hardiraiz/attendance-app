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
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    permitType: {
      type: String,
      enum: ['permission', 'onLeave', 'sick'],
      default: 'permission',
    },
    permitState: {
      type: String,
      enum: ['submitted', 'approved', 'rejected'],
      default: 'submitted',
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
