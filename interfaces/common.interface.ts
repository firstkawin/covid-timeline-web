import { GENDER } from '../services/patient.service';

export const messageResponse = {
  SUCCESS: 'completed',
  SOMETHING_WRONG: 'Something wrong please try again.',
};

export enum LOCATION_TYPE {
  HOME = 'HOME',
  INDOOR = 'INDOOR',
  OUTDOOR = 'OUTDOOR',
  TRAVELLING = 'TRAVELLING,',
}

export interface Patient {
  age: 13;
  createdDate: Date;
  gender: GENDER;
  id: number;
  name: string;
  occupation: string;
  timelines: ITimeline[];
}

export interface ITimeline {
  createdDate: Date;
  detail: string;
  endDate: Date;
  id: 2;
  locationName: string | null;
  locationType: LOCATION_TYPE;
  patientId: number;
  startDate: Date;
}
