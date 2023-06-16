/* eslint-disable import/extensions */
import Attendance from '../models/Attendance.js';

const autoUpdateCreateAttendance = async (permit) => {
  // auto attendance permit
  const message = [];
  const { userId, startDate, endDate } = permit;

  const startOfDay = new Date(startDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(endDate);
  endOfDay.setHours(23, 59, 59, 999);

  // update all data
  const attendancesUpdate = await Attendance.updateMany(
    {
      userId,
      checkInTime: { $gte: startOfDay, $lte: endOfDay },
    },
    { $set: { absentState: permit.permitType } },
  );

  const update = attendancesUpdate ? 'SUCCESS_UPDATE_ATTENDANCE_DATA' : 'SUCCESS_UPDATE_ATTENDANCE_DATA';
  message.push(update);

  // retrieve updated data
  const updateAttendanceData = await Attendance.find({
    userId,
    checkInTime: { $gte: startOfDay, $lte: endOfDay },
  });

  const newAttendanceData = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const attendanceData = {
      userId,
      absentState: permit.permitType,
      checkInTime: new Date(currentDate),
      checkOutTime: new Date(currentDate),
    };

    const isExist = updateAttendanceData.some(
      (data) => data.checkInTime.getDate() === currentDate.getDate(),
    );

    if (!isExist) {
      newAttendanceData.push(attendanceData);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  const attendancesCreate = await Attendance.insertMany(newAttendanceData);
  const create = attendancesCreate ? 'SUCCESS_INSERT_ATTENDANCE_DATA' : 'SUCCESS_INSERT_ATTENDANCE_DATA';
  message.push(create);

  return message;
};

export default autoUpdateCreateAttendance;
