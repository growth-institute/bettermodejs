import { request, gql } from 'graphql-request';

export class BetterMode {
  constructor() {
    this.uri = 'https://app.tribe.so/graphql';
  }

  /**
   * Fetches an access token and makes a POST request to the specified URL.
   * @param {string} networkId - The network ID for the GraphQL query.
   * @param {string} url - The URL to which the POST request will be made.
   * @param {string} [memberId] - Optional member ID for impersonation.
   * @returns {Promise<any>} The data returned from the POST request.
   */
  async getAppToken(networkId, url, memberId = '') {
    const argumentsObj = {
      context: 'NETWORK',
      networkId,
      entityId: networkId,
    };
  
    if (memberId) {
      argumentsObj.impersonateMemberId = memberId;
    }
  
    const GET_ACCESS_TOKEN = gql`
    query limitedToken($context: PermissionContext!, $networkId: String!, $entityId: String!, $impersonateMemberId: String) {
      limitedToken(context: $context, networkId: $networkId, entityId: $entityId, impersonateMemberId: $impersonateMemberId) {
        accessToken
      }
    }
    `;
  
    try {
      console.log("Fetching access token...");
      const data = await request(url, GET_ACCESS_TOKEN, argumentsObj);
  
      if (data?.limitedToken?.accessToken) {
        const accessToken = data.limitedToken.accessToken;
        return accessToken;
      } else {
        console.error('Error: No access token received.');
        return null;
      }
    } catch (error) {
      console.error('Error occurred:', error);
      return null;
    }
  }
  
}
