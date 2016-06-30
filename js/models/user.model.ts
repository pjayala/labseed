import { ISeed } from './seed.model.ts';
import { IPageInfo } from './page-info.model.ts';

export interface IUser {
  id: string;
  login: string;
  name: string;
  surname: string;
  email: string;
  createdAt: string;
  seedConnection: {
    pageInfo?: IPageInfo;
    edges: {
      node: ISeed;
    }
  };
};

export class User implements IUser {
  public id: string;
  public login: string;
  public name: string;
  public surname: string;
  public email: string;
  public createdAt: string;
  public seedConnection: any;
};
