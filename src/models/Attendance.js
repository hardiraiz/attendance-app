import mongoose from 'mongoose';

const Schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    checkInTime: {
      type: Date,
    },
    checkOutTime: {
      type: Date,
    },
    absentState: {
      type: String,
      enum: ['onTime', 'late', 'permission', 'sick', 'onLeave'],
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

export default mongoose.model('Attendance', Schema);
