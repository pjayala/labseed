import * as React from 'react';
import { Link } from 'react-router';
import { RaisedButton, Drawer, MenuItem } from 'material-ui';

interface IState {
}

interface IProps {
  open: boolean;
  close: any;
}

export class SideMenu extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  public handleToggle: any = () => {
    this.setState({ open: ! this.props.open });
  };

  public render(): any {
    return (
      <span>
        <Drawer
          docked={false}
          width={200}
          open={this.props.open}
          onRequestChange={(open) => this.props.close()} >
          <MenuItem
            primaryText='Seeds'
            containerElement={<Link to={{ pathname: `/` }}/>}/>
          <MenuItem
            primaryText='Users'
            containerElement={<Link to={{ pathname: `/users` }}/>}/>
        </Drawer>
      </span>
    );
  }
};

