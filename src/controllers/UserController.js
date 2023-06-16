/* eslint-disable no-throw-literal */
/* eslint-disable class-methods-use-this */
/* eslint-disable import/extensions */
import User from '../models/User.js';

class UserController {
  async index(req, res) {
    try {
      if (req.jwt.role !== 'manager') {
        throw { code: 403, message: 'FORBIDDEN_ACCESS_RIGHT' };
      }

      const users = await User.find().select(' _id fullname email ');
      if (!users) {
        throw { code: 400, message: 'FAILED_GET_USER_LIST' };
      }

      return res.status(200).json({
        status: true,
        message: 'SUCCESS_GET_USER_LIST',
        users,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
}

export default new UserController();
