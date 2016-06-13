import { IUser } from './user.model.ts';

export interface ISeed {
  _id: number;
  name: string;
  description: string;
  user: IUser;
  location: string;
};