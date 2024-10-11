import axios from 'axios';

export class BetterMode {
  constructor() {
    this.uri = 'https://app.tribe.so/graphql';
  }

  async getAppToken(networkId, url, memberId = '') {
    const argumentsObj = {
      context: 'NETWORK',
      networkId,
      entityId: networkId,
    };

    if (memberId) {
      argumentsObj.impersonateMemberId = memberId;
    }

    const GET_ACCESS_TOKEN = `
    query limitedToken($context: PermissionContext!, $networkId: String!, $entityId: String!, $impersonateMemberId: String) {
      limitedToken(context: $context, networkId: $networkId, entityId: $entityId, impersonateMemberId: $impersonateMemberId) {
        accessToken
      }
    }
    `;

    try {
      console.log("Fetching access token...");
      const response = await axios({
        url: url,
        method: 'post',
        data: {
          query: GET_ACCESS_TOKEN,
          variables: argumentsObj
        }
      });

      if (response.data?.data?.limitedToken?.accessToken) {
        return response.data.data.limitedToken.accessToken;
      } else {
        console.error('Error: No access token received.');
        return null;
      }
    } catch (error) {
      console.error('Error occurred:', error.message);
      return null;
    }
  }
}
