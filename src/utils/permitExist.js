/* eslint-disable import/extensions */
import Permit from '../models/Permit.js';

const permitExist = async (userId, startDate, endDate) => {
  const permit = await Permit.findOne({
    userId,
    startDate: { $gte: startDate },
    endDate: { $lte: endDate },
    permitState: { $in: ['submitted', 'approved'] },
  });

  if (permit) { return true; }
  return false;
};

export default permitExist;
