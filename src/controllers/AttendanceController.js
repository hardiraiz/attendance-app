/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-throw-literal */
/* eslint-disable import/extensions */
import dayjs from 'dayjs';
import mongoose from 'mongoose';
import startWorkingTime from '../utils/startWorkingTime.js';
import attendanceExist from '../utils/attendanceExist.js';
import Attendance from '../models/Attendance.js';

class AttendanceController {
  async index(req, res) {
    try {
      const attendance = await Attendance
        .find({ userId: req.jwt.id })
        .sort({ checkInTime: -1 })
        .select('_id checkInTime checkOutTime absentState');

      return res.status(200).json({
        status: true,
        message: 'SUCCESS_GET_ATTENDANCE',
        attendance,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async store(req, res) {
    try {
      if (!req.body.checkInTime) {
        throw { code: 400, message: 'CHECK_IN_TIME_IS_REQUIRED' };
      }
      if (!dayjs(req.body.checkInTime).isValid()) {
        throw { code: 400, message: 'INVALID_CHECK_IN_TIME' };
      }
      const isCheckInExist = await attendanceExist
        .checkInTimeExist(req.jwt.id, req.body.checkInTime);

      if (isCheckInExist) {
        throw { code: 400, message: 'CHECK_IN_TIME_ALREADY_EXIST' };
      }

      const checkInTime = new Date(req.body.checkInTime);
      const startTime = startWorkingTime(req.body.checkInTime);

      const statusCheckIn = startTime > checkInTime ? 'onTime' : 'late';

      const attendance = await Attendance.create({
        userId: req.jwt.id,
        checkInTime,
        absentState: statusCheckIn,
      });

      if (!attendance) {
        throw { code: 500, message: 'CHECK_IN_TIME_FAILED_TO_RECORD' };
      }

      return res.status(200).json({
        status: true,
        message: 'CHECK_IN_SUCCESS',
        attendance: {
          id: attendance._id,
          checkInTime: attendance.checkInTime,
          checkOutTime: attendance.checkOutTime,
          absentState: attendance.absentState,
        },
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: 'ATTENDANCE_ID_IS_REQUIRED' };
      }
      if (!req.body.checkOutTime) {
        throw { code: 400, message: 'CHECK_OUT_TIME_IS_REQUIRED' };
      }
      if (!dayjs(req.body.checkOutTime).isValid()) {
        throw { code: 400, message: 'INVALID_CHECK_OUT_TIME' };
      }

      const attendance = await Attendance.findById(
        { _id: req.params.id, userId: req.jwt.id },
      );

      if (attendance.checkOutTime) {
        throw { code: 400, message: 'CHECK_OUT_TIME_ALREADY_EXIST' };
      }

      if (req.body.checkOutTime.checkOutTime < attendance.checkInTime) {
        throw { code: 400, message: 'CHECK_OUT_CANT_LESS_THAN_CHECK_IN' };
      }

      const checkOutTime = new Date(req.body.checkOutTime);
      attendance.checkOutTime = checkOutTime;
      const updateAttendance = await attendance.save();

      if (!updateAttendance) {
        throw { code: 404, message: 'ATTENDANCE_UPDATE_FAILED ' };
      }

      return res.status(200).json({
        status: true,
        message: 'SUCCESS_UPDATE_ATTENDANCE',
        attendance: {
          id: attendance._id,
          checkInTime: attendance.checkInTime,
          checkOutTime: attendance.checkOutTime,
          absentState: attendance.absentState,
        },
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async show(req, res) {
    try {
      if (req.jwt.role !== 'manager') {
        throw { code: 403, message: 'FORBIDDEN_ACCESS_RIGHT' };
      }
      if (!req.params.id) {
        throw { code: 400, message: 'REQUIRED_USER_ID' };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: 'INVALID_USER_ID' };
      }

      const attendance = await Attendance.find({ userId: req.params.id });
      if (!attendance) {
        throw { code: 404, message: 'ATTENDANCE_USER_NOT_FOUND' };
      }

      return res.status(200).json({
        status: true,
        message: 'SUCCESS_GET_USER_ATTENDANCE',
        userId: req.params.id,
        attendance,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
}

export default new AttendanceController();
