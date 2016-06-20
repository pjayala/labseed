export interface IUser {
  _id: number;
  id: string;
  name: string;
  surename: string;
  email: string;
  createdAt: string;
};

export class User implements IUser {
  public _id: number;
  public id: string;
  public name: string;
  public surename: string;
  public email: string;
  public createdAt: string;
};