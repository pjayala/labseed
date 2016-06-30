import { Mutation } from 'react-relay';
let Relay: any = require('react-relay');

export class UpdateUserMutation extends Mutation<any, any> {
  public getMutation() {
    return Relay.QL`
      mutation { updateUser }
    `;
  }

  public getVariables() {
    return {
      id: this.props.id,
      login: this.props.login,
      name: this.props.name,
      surname: this.props.surname,
      email: this.props.email
    };
  }

  public getFatQuery() {
    return Relay.QL`
      fragment on UpdateUserPayload {
        userEdge,
        store { userConnection }
      }
    `;
  }

  public getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        userEdge: {
          node: this.props.id
        },
        store: this.props.store.id
      }
    }];
  }

  public getOptimisticResponse() {
    return {
      userEdge: {
        node: {
          email: 'testingthis.props'
        }
      }
    };

  }
};
