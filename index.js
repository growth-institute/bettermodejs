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

	async getMembers(accessToken, options = {}) {
		const MEMBERS_QUERY = `
    query Members($after: String, $before: String, $filterBy: [MemberListFilterByInput!], $limit: Int!, $offset: Int, $orderBy: String, $query: String, $reverse: Boolean, $roleIds: [ID!], $status: [MemberStatusInput!]) {
      members(after: $after, before: $before, filterBy: $filterBy, limit: $limit, offset: $offset, orderBy: $orderBy, query: $query, reverse: $reverse, roleIds: $roleIds, status: $status) {
        totalCount
        edges {
          node {
            name
            id
            locale
            profilePictureId
            status
            username
            email
            emailStatus
            externalId
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
    `;

		const variables = {
			limit: options.limit || 10, // Valor por defecto de 10 si no se especifica
			...options
		};

		try {
			const response = await axios({
				url: this.uri,
				method: 'post',
				headers: {
					'Authorization': `Bearer ${accessToken}`,
					'Content-Type': 'application/json'
				},
				data: {
					query: MEMBERS_QUERY,
					variables: variables
				}
			});

			if (response.data?.data?.members) {
				return response.data.data.members;
			} else {
				console.error('Error: No member data received.');
				return null;
			}
		} catch (error) {
			console.error('Error occurred while fetching members:', error.message);
			return null;
		}
	}


	async getFeed(accessToken, options = {}) {
		const FEED_QUERY = `
        query getFeed($after: String, $before: String, $filterBy: [PostListFilterByInput!], $limit: Int!, $offset: Int, $onlyMemberSpaces: Boolean, $orderBy: PostListOrderByEnum, $postTypeIds: [String!], $reverse: Boolean) {
            feed(
                after: $after
                before: $before
                filterBy: $filterBy
                limit: $limit
                offset: $offset
                onlyMemberSpaces: $onlyMemberSpaces
                orderBy: $orderBy
                postTypeIds: $postTypeIds
                reverse: $reverse
            ) {
                nodes {...}
                pageInfo {...}
                totalCount
            }
        }
    `;
		const variables = {
			limit: options.limit || 10,
			...options
		};

		try {
			const response = await axios({
				url: this.uri,
				method: 'post',
				headers: {
					'Authorization': `Bearer ${accessToken}`,
					'Content-Type': 'application/json'
				},
				data: {
					query: FEED_QUERY,
					variables: variables
				}
			});

			if (response.data?.data?.feed) {
				return response.data.data.feed;
			} else {
				const errorMessage = response.data?.errors?.map(err => `${err.message}`).join(", ") || "No specific error message received";
				console.error('Error: No feed data received. Server response:', errorMessage);
				return null;
			}
		} catch (error) {
			console.error('Error occurred while fetching feed:', error.response?.status, error.response?.statusText, error.message);
			return null;
		}
	}


}
