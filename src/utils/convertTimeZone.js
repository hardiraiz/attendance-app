/* eslint-disable import/extensions */
/* eslint-disable import/no-extraneous-dependencies */
import dayjs from 'dayjs';
import utcPlugin from 'dayjs/plugin/utc.js';
import timezonePlugin from 'dayjs/plugin/timezone.js';

dayjs.extend(utcPlugin);
dayjs.extend(timezonePlugin);

// gmt = 'GMT+7'
const convertTimeZone = (currentTime, gmt) => {
  const utcDateTime = dayjs.utc(currentTime);
  const gmtPlusDateTime = utcDateTime.tz(gmt).format('YYYY-MM-DD HH:mm:ss');
  return gmtPlusDateTime;
};

export default convertTimeZone;
