/* eslint-disable no-throw-literal */
/* eslint-disable import/extensions */
/* eslint-disable class-methods-use-this */
import dayjs from 'dayjs';
import calculateAttendance from '../utils/userReports.js';

class ReportController {
  async report(req, res) {
    try {
      if (req.jwt.role !== 'manager') {
        throw { code: 403, message: 'ONLY_MANAGER_CAN_VIEW_REPORT' };
      }
      if (!req.body.startDate) {
        throw { code: 400, message: 'START_DATE_REQUIRED' };
      }
      if (!dayjs(req.body.startDate).isValid()) {
        throw { code: 400, message: 'INVALID_START_DATE' };
      }
      if (!req.body.endDate) {
        throw { code: 400, message: 'END_DATE_REQUIRED' };
      }
      if (!dayjs(req.body.endDate).isValid()) {
        throw { code: 400, message: 'INVALID_PERMIT_END_DATE' };
      }
      if (req.body.startDate > req.body.endDate) {
        throw { code: 400, message: 'START_DATE_CANT_BIGGER_THAN_END_DATE' };
      }

      const userData = await calculateAttendance(req);

      return res.status(200).json({
        status: true,
        message: 'SUCCESS_GET_USERS_REPORT',
        userData,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
}

export default new ReportController();
