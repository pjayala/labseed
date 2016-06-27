import * as React from 'react';
import { TextField, RaisedButton } from 'material-ui';

interface IMainState {
}

interface IMainProps {
  createUser: any;
}

export class UserCreateComponent extends React.Component<IMainProps, IMainState> {
  public refs: {
    [string: string]: any;
    newLogin: any;
    newName: any;
    newSurname: any;
    newEmail: any;
  };

  public handleSubmit: any = (e: any): void => {
    e.preventDefault();
    this.props.createUser({
      login: this.refs.newLogin.input.value,
      name: this.refs.newName.input.value,
      surname: this.refs.newSurname.input.value,
      email: this.refs.newEmail.input.value
    });
    this.refs.newLogin.input.value = '';
    this.refs.newName.input.value = '';
    this.refs.newSurname.input.value = '';
    this.refs.newEmail.input.value = '';
  }

  public render(): any {
    return (
      <form onSubmit={this.handleSubmit}>
        <TextField
          hintText='Enter a unique user login'
          floatingLabelText='User login'
          fullWidth={true}
          ref='newLogin'
          /><br />
        <TextField
          hintText='User name'
          floatingLabelText='Name'
          fullWidth={true}
          ref='newName'
          /><br />
        <TextField
          hintText='User surname'
          floatingLabelText='Surname'
          fullWidth={true}
          ref='newSurname'
          /><br />
        <TextField
          hintText='Email address'
          floatingLabelText='Email'
          fullWidth={true}
          ref='newEmail'
          /><br />
        <RaisedButton type='submit' label='New user' primary/>
      </form>
    );
  }
};

