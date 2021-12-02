import axios from 'axios';
import { config } from '../config';

export enum GENDER {
  MALE = 'M',
  FEMALE = 'FM',
}

export enum GENDER_TEXT {
  M = 'Male',
  FM = 'Female',
}

export interface IPatient {
  name: string;
  gender: GENDER;
  age: number;
  occupation: string;
}

export const getTextGender = (gender: GENDER) => {
  return GENDER_TEXT[gender];
};

export const getNamePatients = async () => {
  const response = await axios.get(`${config.API_URL}/patients/name`);
  return response.data;
};

export const getPatientTimeline = async (name: string) => {
  const response = await axios.get(
    `${config.API_URL}/patients/timelines/${name}`,
  );
  return response.data;
};

export const createPatient = async (body: IPatient) => {
  await axios.post(`${config.API_URL}/patients`, body);
};
