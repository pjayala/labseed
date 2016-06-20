import * as React from 'react';

import { IPageInfo } from '../models/index.ts';

interface IProps {
  pageInfo: IPageInfo;
  showMore: any;
}

export class ShowMore extends React.Component<IProps, any> {
  public render(): any {
    const showMoreButton: React.HTMLProps<HTMLButtonElement> | any =
      this.props.pageInfo.hasNextPage ?
        <button type='submit' onClick={this.props.showMore}>Show more</button>
        : null;
    return (
      <span>
        { showMoreButton }
      </span>
    );
  }
};
