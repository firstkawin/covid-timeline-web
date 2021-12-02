import moment from 'moment';

const dateFormat = 'DD-MM-YYYY';
const timeFormat = 'HH:MM';

export const clearTime = (date: any) => {
  return moment(date).hours(0).minutes(0).seconds(0);
};

export const isDuplicatDate = (date1: any, date2: any) => {
  return moment(date1).diff(moment(date2)) === 0;
};

export const getTimeFormat = (date: any) => {
  return moment(date).format(timeFormat);
};
export const getDateFormat = (date: any) => {
    return moment(date).format(dateFormat);
  };
