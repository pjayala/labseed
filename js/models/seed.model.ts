import { IUser } from './user.model.ts';

export interface ISeed {
  id: number;
  name: string;
  description: string;
  index: number;
  user: IUser;
  location: string;
  createdAt: string;
};
