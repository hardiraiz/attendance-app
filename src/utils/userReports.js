/* eslint-disable import/extensions */
import User from '../models/User.js';
import Attendance from '../models/Attendance.js';
import Permit from '../models/Permit.js';

const calculateAttendance = async (req) => {
  const startOfDay = new Date(req.body.startDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(req.body.endDate);
  endOfDay.setHours(23, 59, 59, 999);

  // Menghitung selisih dalam milidetik
  const timeDiff = Math.abs(startOfDay.getTime() - endOfDay.getTime());

  // Menghitung jumlah hari dengan membagi selisih waktu dengan jumlah milidetik dalam satu hari
  const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

  const users = await User.find().lean();

  const userPromises = users.map(async (user) => {
    const { _id: userId, fullname } = user;

    const onTimeCount = await Attendance.countDocuments({
      userId,
      absentState: 'onTime',
      checkInTime: { $gte: startOfDay, $lte: endOfDay },
    });

    const lateCount = await Attendance.countDocuments({
      userId,
      absentState: 'late',
      checkInTime: { $gte: startOfDay, $lte: endOfDay },
    });

    const sickCount = await Attendance.countDocuments({
      userId,
      absentState: 'sick',
      checkInTime: { $gte: startOfDay, $lte: endOfDay },
    });

    const permissionCount = await Attendance.countDocuments({
      userId,
      absentState: 'permission',
      checkInTime: { $gte: startOfDay, $lte: endOfDay },
    });

    const onLeaveCount = await Attendance.countDocuments({
      userId,
      absentState: 'onLeave',
      checkInTime: { $gte: startOfDay, $lte: endOfDay },
    });

    const notPresentCount = diffDays - sickCount - permissionCount
                            - onLeaveCount - lateCount - onTimeCount;

    const rejectedPermissionCount = await Permit.countDocuments({
      userId,
      permitState: 'rejected',
      permitType: 'permission',
    });

    const rejectedOnLeaveCount = await Permit.countDocuments({
      userId,
      permitState: 'rejected',
      permitType: 'onLeave',
    });

    return {
      userId,
      fullname,
      lateCount,
      sickCount,
      permissionCount,
      onLeaveCount,
      rejectedPermissionCount,
      rejectedOnLeaveCount,
      notPresentCount,
    };
  });

  const userData = await Promise.all(userPromises);
  return userData;
};

export default calculateAttendance;
