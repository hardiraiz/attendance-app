import dotenv from 'dotenv';

const env = dotenv.config().parsed;

const startWorkingTime = (attendanceTime) => {
  const [hours, minutes, seconds] = env.START_WORKING_TIME.split(':');
  const workingTime = new Date(attendanceTime);
  workingTime.setUTCHours(hours, minutes, seconds);
  return workingTime;
};

export default startWorkingTime;
