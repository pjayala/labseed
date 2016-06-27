export interface IUser {
  id: string;
  login: string;
  name: string;
  surename: string;
  email: string;
  createdAt: string;
};

export class User implements IUser {
  public id: string;
  public login: string;
  public name: string;
  public surename: string;
  public email: string;
  public createdAt: string;
};
