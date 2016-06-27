import { Mutation } from 'react-relay';
let Relay: any = require('react-relay');

export class CreateUserMutation extends Mutation<any, any> {
  public getMutation() {
    return Relay.QL`
      mutation { createUser }
    `;
  }

  public getVariables() {
    return {
      login: this.props.login,
      name: this.props.name,
      surname: this.props.surname,
      email: this.props.email
    };
  }

  public getFatQuery() {
    return Relay.QL`
      fragment on CreateUserPayload {
        userEdge,
        store { userConnection }
      }
    `;
  }

  public getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'store',
      parentID: this.props.store.id,
      connectionName: 'userConnection',
      edgeName: 'userEdge',
      rangeBehaviors: {
        'query()': 'prepend'
      }
    }];
  }

  public getOptimisticResponse() {
    return {
      userEdge: {
        node: {
          login: this.props.login,
          name: this.props.name,
          surname: this.props.surname,
          email: this.props.email
        }
      }
    };

  }
};
