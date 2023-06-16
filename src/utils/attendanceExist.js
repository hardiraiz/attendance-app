/* eslint-disable import/extensions */
import Attendance from '../models/Attendance.js';

const checkInTimeExist = async (userId, checkInTime) => {
  const startOfDay = new Date(checkInTime);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(checkInTime);
  endOfDay.setHours(23, 59, 59, 999);

  const attendance = await Attendance.findOne({
    userId,
    checkInTime: { $gte: startOfDay, $lte: endOfDay },
  });

  if (attendance) { return true; }
  return false;
};

const checkOutTimeExist = async (userId, checkOutTime) => {
  const startOfDay = new Date(checkOutTime);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(checkOutTime);
  endOfDay.setHours(23, 59, 59, 999);

  const attendance = await Attendance.findOne({
    userId,
    checkOutTime: { $gte: startOfDay, $lte: endOfDay },
  });

  if (attendance) { return true; }
  return false;
};

export default { checkInTimeExist, checkOutTimeExist };
