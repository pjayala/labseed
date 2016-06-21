import * as React from 'react';
import { FlatButton } from 'material-ui';

import { IPageInfo } from '../models/index.ts';

interface IProps {
  pageInfo: IPageInfo;
  showMore: any;
}

export class ShowMore extends React.Component<IProps, any> {
  public render(): any {
    const showMoreButton: React.HTMLProps<HTMLButtonElement> | any =
      this.props.pageInfo.hasNextPage ?
        <FlatButton
          type='submit'
          onClick={this.props.showMore}
          label='Show more'/>
        : null;
    return (
      <span>
        { showMoreButton }
      </span>
    );
  }
};
