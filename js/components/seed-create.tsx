import * as React from 'react';
import { createContainer, RelayProp } from 'react-relay';
import { debounce } from 'lodash';
let Relay: any = require('react-relay');

import {
  TextField,
  RaisedButton,
  AutoComplete,
  RadioButtonGroup,
  RadioButton
} from 'material-ui';

import { IUser, ISeed } from '../models/index.ts';

interface IMainState {
  disableSeedSecond: boolean;
}

interface ISeedEdges {
  node: ISeed;
}

interface ISeedConnection {
  edges: ISeedEdges[];
};

interface IEdges {
  node: IUser;
}

interface IUserConnection {
  edges: IEdges[];
};

interface IMainProps {
  createSeed: any;
  relay: RelayProp;
  createUser: boolean;
  store: {
    seedConnection: ISeedConnection;
    userConnection: IUserConnection;
  };
}

export class SeedCreateComponent extends React.Component<IMainProps, IMainState> {
  public refs: {
    [string: string]: any;
    newName: any;
    newDescription: any;
    newLocation: any;
    newUserId: any;
    newCrossingType: any;
    newSeedFirstParentIndex: any;
    newSeedSecondParentIndex: any;
  };

  private setVariables: any = debounce(this.props.relay.setVariables, 300);

  constructor(props: IMainProps) {
    super(props);
    this.state = {
      disableSeedSecond: true
    };
  }

  public handleSubmit: any = (e: any): void => {
    e.preventDefault();
    let user: IEdges = this.props.store.userConnection.edges.find(
      (edge: IEdges) => edge.node.login === this.refs.newUserId.refs.searchTextField.input.value
    );
    this.props.createSeed({
      name: this.refs.newName.input.value,
      description: this.refs.newDescription.input.value,
      location: this.refs.newLocation.input.value,
      userId: user.node.id,
      crossingType: this.refs.newCrossingType.state.selected,
      seedFirstParentIndex: this.refs.newSeedFirstParentIndex.refs.searchTextField.input.value,
      seedSecondParentIndex: this.refs.newSeedSecondParentIndex.refs.searchTextField.input.value
    });
  }

  public getUsers: any = () => {
    return this.props.store.userConnection ? this.props.store.userConnection.edges.map(edge => {
      return {
        text: `${edge.node.login}`,
        value: `${edge.node.login}  -  ${edge.node.email}`
      };
    }) : [];
  };

  public handleUserUpdateInput: any = (input: any) => {
    this.setVariables({ userQuery: input });
  };

  public getSeeds: any = () => {
    let seeds: any = this.props.store.seedConnection ? this.props.store.seedConnection.edges.map(edge => {
      return {
        text: `${edge.node.index}`,
        value: `${edge.node.index}  -  ${edge.node.name}`
      };

    }) : [];
    return seeds;
  };

  public handleSeedUpdateInput: any = (input: any) => {
    this.setVariables({ seedQuery: input });
  };

  public handleChangeCrossType: any = (event: any, value: string) => {
    this.setState({
      disableSeedSecond: value === 'G'
    });
  };

  public render(): any {
    return (

      <form onSubmit={this.handleSubmit}>
        <TextField
          hintText='Name'
          floatingLabelText='Name'
          fullWidth={true}
          ref='newName'
          /><br />
        <TextField
          hintText='Description'
          floatingLabelText='Description'
          fullWidth={true}
          ref='newDescription'
          /><br />
        <TextField
          hintText='Location'
          floatingLabelText='Location'
          fullWidth={true}
          ref='newLocation'
          /><br />

        <AutoComplete
          hintText='Select a user'
          floatingLabelText='User'
          dataSource={this.getUsers() }
          onUpdateInput={this.handleUserUpdateInput}
          fullWidth={true}
          openOnFocus={true}
          filter={(searchText: string, key: string) => true}
          ref='newUserId'
          /><br />

        <RadioButtonGroup
          name='crossType'
          defaultSelected='G'
          onChange={this.handleChangeCrossType}
          ref='newCrossingType'>
          <RadioButton
            value='G'
            label='Self crossing'
            />
          <RadioButton
            value='F'
            label='Crossing'
            />
          <RadioButton
            value='T'
            label='Transforming'
            />
          <RadioButton
            value='BC'
            label='Back crossing'
            />
          <RadioButton
            value='OC'
            label='Out crossing'
            />
        </RadioButtonGroup>
        <br />

        <AutoComplete
          hintText='Select first parent seed'
          floatingLabelText='Parent Seed 1'
          dataSource={this.getSeeds() }
          onUpdateInput={this.handleSeedUpdateInput}
          fullWidth={true}
          openOnFocus={true}
          filter={(searchText: string, key: string) => true}
          ref='newSeedFirstParentIndex'
          /><br />

        <AutoComplete
          hintText='Select second parent seed'
          floatingLabelText='Parent Seed 2'
          dataSource={this.getSeeds() }
          onUpdateInput={this.handleSeedUpdateInput}
          disabled={this.state.disableSeedSecond}
          fullWidth={true}
          openOnFocus={true}
          filter={(searchText: string, key: string) => true}
          ref='newSeedSecondParentIndex'
          /><br />

        <RaisedButton type='submit' label='New seed' primary/>
      </form>
    );
  }
};

export let SeedCreate: any = createContainer(SeedCreateComponent, {
  initialVariables: {
    userQuery: '',
    seedQuery: '',
    createUser: false
  },
  fragments: {
    store: () => Relay.QL`
      fragment on Store {
        userConnection(first: 10, query: $userQuery) @include(if: $createUser) {
          edges {
            node {
              id,
              login,
              email
            }
          }
        },
        seedConnection(first: 10, query: $seedQuery) @include(if: $createUser) {
          edges {
            node {
              index,
              name
            }
          }
        }
      }`
  }
});
