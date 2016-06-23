import { Mutation } from 'react-relay';
let Relay: any = require('react-relay');

export class CreateSeedMutation extends Mutation<any, any> {
  public getMutation() {
    return Relay.QL`
      mutation { createSeed }
    `;
  }

  public getVariables() {
    return {
      name: this.props.name,
      description: this.props.description,
      location: this.props.location,
      userId: this.props.userId,
      seedFirstParentIndex: this.props.seedFirstParentIndex,
      seedSecondParentIndex: this.props.seedSecondParentIndex
    };
  }

  public getFatQuery() {
    return Relay.QL`
      fragment on CreateSeedPayload {
        seedEdge,
        store { seedConnection }
      }
    `;
  }

  public getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'store',
      parentID: this.props.store.id,
      connectionName: 'seedConnection',
      edgeName: 'seedEdge',
      rangeBehaviors: {
        'query()': 'prepend'
      }
    }];
  }

  public getOptimisticResponse() {
    return {
      seedEdge: {
        node: {
          id: '0',
          name: this.props.name,
          description: this.props.description,
          location: this.props.location,
          user: {
            id: this.props.userId
          }
        }
      }
    };

  }
};
