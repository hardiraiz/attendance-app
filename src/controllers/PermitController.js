/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-throw-literal */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/extensions */
import dayjs from 'dayjs';
import mongoose from 'mongoose';
import permitExist from '../utils/permitExist.js';
import autoUpdateCreateAttendance from '../utils/autoUpdateCreateAttendance.js';
import Permit from '../models/Permit.js';

class PermitController {
  async listPermits(req, res) {
    try {
      if (req.jwt.role !== 'manager') {
        throw { code: 403, message: 'FORBIDDEN_ACCESS_RIGHT' };
      }

      const queryParam = {};
      if (req.query.permit_state) {
        queryParam.permitState = req.query.permit_state;
      }

      const permit = await Permit.find(queryParam);

      if (!permit) {
        throw { code: 400, message: 'FAILED_GET_LIST_PERMIT' };
      }

      return res.status(200).json({
        status: true,
        message: 'SUCCESS_GET_LIST_PERMIT',
        permit,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async listUserPermits(req, res) {
    try {
      const queryParam = { userId: req.jwt.id };
      if (req.query.permit_state) {
        queryParam.permitState = req.query.permit_state;
      }

      const permit = await Permit.find(queryParam);

      if (!permit) {
        throw { code: 400, message: 'FAILED_GET_USER_LIST_PERMIT' };
      }

      return res.status(200).json({
        status: true,
        message: 'SUCCESS_GET_USER_LIST_PERMIT',
        permit,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async showUserPermits(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: 'REQUIRED_PERMIT_ID' };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: 'INVALID_PERMIT_ID' };
      }

      const filterParam = { _id: req.params.id };

      let permit = {};
      if (req.jwt.role === 'manager') {
        permit = await Permit.findOne(filterParam);
      } else {
        filterParam.userId = req.jwt.id;
        permit = await Permit.findOne(filterParam);
      }

      if (!permit) {
        throw { code: 404, message: 'USER_PERMIT_NOT_FOUND' };
      }

      return res.status(200).json({
        status: true,
        message: 'SUCCESS_GET_PERMIT',
        permit,
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
      if (req.jwt.role !== 'employee') {
        throw { code: 403, message: 'ONLY_EMPLOYEE_CAN_REQUEST_PERMIT' };
      }
      if (!req.body.permitInfo) {
        throw { code: 400, message: 'REQUIRED_PERMIT_INFORMATION' };
      }
      if (!req.body.permitType) {
        throw { code: 400, message: 'REQUIRED_PERMIT_TYPE' };
      }
      if (!req.body.startDate) {
        throw { code: 400, message: 'REQUIRED_PERMIT_START_DATE' };
      }
      if (!dayjs(req.body.startDate).isValid()) {
        throw { code: 400, message: 'INVALID_START_DATE' };
      }
      if (!req.body.endDate) {
        throw { code: 400, message: 'REQUIRED_PERMIT_END_DATE' };
      }
      if (!dayjs(req.body.checkInTime).isValid()) {
        throw { code: 400, message: 'INVALID_PERMIT_END_DATE' };
      }
      if (req.body.startDate > req.body.endDate) {
        throw { code: 400, message: 'START_DATE_CANT_BIGGER_THAN_END_DATE' };
      }

      const startDate = new Date(req.body.startDate);
      startDate.setUTCHours(0, 0, 0);

      const endDate = new Date(req.body.endDate);
      endDate.setUTCHours(23, 59, 59);

      const isPermitExist = await permitExist(req.jwt.id, startDate, endDate);
      if (isPermitExist) {
        throw { code: 400, message: 'YOUR_PERMIT_ALREADY_EXIST' };
      }

      const permit = await Permit.create({
        userId: req.jwt.id,
        permitInfo: req.body.permitInfo,
        permitType: req.body.permitType,
        startDate,
        endDate,
      });

      return res.status(200).json({
        status: true,
        message: 'PERMIT_HAS_BEEN_SUBMITTED',
        permit: {
          _id: permit._id,
          permitInfo: permit.permitInfo,
          permitType: permit.permitType,
          startDate: permit.startDate,
          endDate: permit.endDate,
          permitState: permit.permitState,
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
      if (req.jwt.role !== 'manager') {
        throw { code: 403, message: 'FORBIDDEN_ACCESS_RIGHT' };
      }
      if (!req.params.id) {
        throw { code: 400, message: 'REQUIRED_USER_ID' };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: 'INVALID_USER_ID' };
      }
      if (!req.params.permitId) {
        throw { code: 400, message: 'REQUIRED_PERMIT_ID' };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.permitId)) {
        throw { code: 400, message: 'INVALID_PERMIT_ID' };
      }
      if (!req.body.permitState) {
        throw { code: 400, message: 'REQUIRED_PERMIT_STATE' };
      }

      const permit = await Permit.findOne({ _id: req.params.permitId, userId: req.params.id });
      if (permit.permitState === 'approved') {
        throw { code: 403, message: 'PERMIT_ALREADY_APPROVE' };
      }

      const permitSave = await permit.save();
      if (!permitSave) {
        throw { code: 404, message: 'UPDATE_PERMIT_FAILED' };
      }

      const message = ['SUCCESS_UPDATE_PERMIT_STATUS'];
      const updateCreateAttendances = await autoUpdateCreateAttendance(permit);
      if (updateCreateAttendances) {
        message.push(...updateCreateAttendances);
      }

      return res.status(200).json({
        status: true,
        message,
        permit: {
          _id: permit._id,
          permitInfo: permit.permitInfo,
          permitType: permit.permitType,
          permitState: permit.permitState,
          startDate: permit.startDate,
          endDate: permit.endDate,
        },

      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
}

export default new PermitController();
