import axios from 'axios';
import { config } from '../config';
import { LOCATION_TYPE } from '../interfaces/common.interface';

export interface ITimeline {
  name: string;
  detail: string;
  endDate: Date;
  startDate: Date;
  locationName: string;
  locationType: LOCATION_TYPE;
}

export const getLocationTimelines = async (name: string) => {
  const response = await axios.get(`${config.API_URL}/timelines/${name}`);
  return response.data;
};

export const createTimeline = async (body: ITimeline) => {
  await axios.post('${config.API_URL}/timelines', body);
};

export const deleteTimeline = async (id: number) => {
  await axios.delete(`${config.API_URL}/timelines/${id}`);
};
