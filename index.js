import axios from 'axios';
import {GET_SPACE, GET_SPACES} from "./graphql/spaces.js";
import {CREATE_REPLY} from "./graphql/replies.js";
import {ADD_REACTION, REMOVE_REACTION, UNSUBSCRIBE, SUBSCRIBE} from "./graphql/posts.js";
import {GET_FEED, GET_LIMITED_TOKEN, GET_MEMBERS} from "./graphql/members.js";

/**
 * Class representing the BetterMode API client.
 */
export class BetterMode {
	/**
	 * Creates an instance of BetterMode.
	 *
	 * @param {string} accessToken - The access token for authenticating API requests.
	 */
	constructor(accessToken) {
		this.uri = 'https://api.bettermode.com';
		this.accessToken = accessToken;
	}

	/**
	 * Retrieves an application token from the BetterMode API.
	 *
	 * @param {string} networkId - The ID of the network.
	 * @param {string} url - The URL to send the request to.
	 * @param {string} [memberId=''] - The ID of the member to impersonate (optional).
	 * @returns {Promise<string|null>} - The application token or null if an error occurred.
	 */
	async getAppToken(networkId, url, memberId = '') {
		const argumentsObj = {
			context: 'NETWORK', networkId, entityId: networkId,
		};

		if (memberId) {
			argumentsObj.impersonateMemberId = memberId;
		}

		try {
			console.log('Fetching access token...');
			const response = await axios({
				url: url, method: 'post', data: {
					query: GET_LIMITED_TOKEN, variables: argumentsObj,
				},
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

	/**
	 * Makes a request to the BetterMode API.
	 *
	 * @param {string} query - The GraphQL query to be executed.
	 * @param {Object} variables - The variables for the GraphQL query.
	 * @param operationName
	 * @returns {Promise<Object|null>} - The response data from the API or null if an error occurred.
	 * @throws {Error} - Throws an error if no URI or access token is provided.
	 */
	async makeRequest(query, variables) {
		// If no URI is provided, throw an error
		if (!this.uri) throw new Error('No URI provided');

		// If no access token is provided, throw an error
		if (!this.accessToken) throw new Error('No access token provided');

		try {
			const configurationPayload = {
				query: query, variables: variables,
			}

			const response = await axios({
				url: this.uri, method: 'post', headers: {
					'Authorization': `Bearer ${this.accessToken}`, 'Content-Type': 'application/json',
				}, data: {
					query: query, variables: variables,
				},
			});

			return response.data;
		} catch (e) {
			console.error('Error occurred:', e.message, e.response?.data);
			return null;
		}
	}

	/**
	 * Retrieves a list of spaces from the BetterMode API.
	 *
	 * @param {Object} [variables={}] - The variables for the GraphQL query.
	 * @param {string} [variables.after] - The cursor for fetching the next page of results.
	 * @param {string} [variables.before] - The cursor for fetching the previous page of results.
	 * @param {string} [variables.collectionId] - The ID of the collection to filter spaces by.
	 * @param {number} [variables.limit=30] - The number of spaces to retrieve. Default is 30.
	 * @param {string} [variables.memberId] - The ID of the member to filter spaces by.
	 * @param {number} [variables.offset] - The offset for pagination.
	 * @param {string} [variables.orderBy] - The field to order the results by.
	 * @param {Array<Object>} [variables.filterBy] - The filters to apply to the space list.
	 * @param {string} [variables.query] - The search query to filter spaces.
	 * @param {boolean} [variables.reverse] - Whether to reverse the order of the results.
	 * @param {Array<string>} [variables.type] - The types of spaces to filter by.
	 * @param {string} [query=''] - Optional GraphQL query to override the default.
	 * @returns {Promise<Object|null>} - The list of spaces or null if an error occurred.
	 */
	async getSpaces(variables = {}, query = '') {
		const queryGraph = query || GET_SPACES;
		const variablesGraph = {
			limit: variables.limit || 5, // Default value of 30 if not specified
			...variables,
			orderBy: "CUSTOM_ORDERING_INDEX",
			type: [
				"Group"
			]
		};
		try {
			const response = await this.makeRequest(queryGraph, variablesGraph);
			if (response.data?.spaces) {
				return response.data.spaces;
			} else {
				console.error('Error: No space data received:', response.errors);
				return null;
			}

		} catch (error) {
			console.error('Error occurred while fetching spaces:', error.message);
			return null;
		}
	}

	/**
	 * Retrieves a specific space from the BetterMode API.
	 *
	 * @param {string} idSpace - The ID of the space to retrieve.
	 * @param {Object} [variables={}] - Additional variables for the GraphQL query.
	 * @param {string} [query=''] - Optional GraphQL query to override the default.
	 * @returns {Promise<Object|null>} - The space data or null if an error occurred.
	 */
	async getSpace(idSpace, variables = {}, query = '') {
		const queryGraph = query || GET_SPACE;
		const variablesGraph = {
			id: idSpace,
			...variables,
		};

		try {
			const response = await this.makeRequest(queryGraph, variablesGraph);
			console.info(response.data);
			if (response.data?.space) {
				return response.data.space;
			} else {
				console.error('Error: No space data received:', response.errors);
				return null;
			}

		} catch (error) {
			console.error(`Error occurred while fetching space ${idSpace}:`, error.message);
			return null;
		}
	}

	/**
	 * Creates a reply to a post in the BetterMode API.
	 *
	 * @param {string} idPost - The ID of the post to reply to.
	 * @param {string} content - The content of the reply.
	 * @param {Object} [variables={}] - Additional variables for the GraphQL query.
	 * @param {string} [query=''] - Optional GraphQL query to override the default.
	 * @returns {Promise<string|null>} - The status of the created reply or null if an error occurred.
	 */
	async createReply(idPost, content, variables = {}, query = '') {

		const queryGraph = query || CREATE_REPLY;

		const variablesGraph = {
			postId: idPost,
			input: {
				postTypeId: 'fu1HHZaXZzs82C5',
				mappingFields: [
					{
						key: 'content', type: 'html', value:  JSON.stringify(content)
					}
				],
				publish: true,
			},
			...variables,
		};

		try {
			const response = await this.makeRequest(queryGraph, variablesGraph);
			console.info(response.data);
			if (response.data?.createReply) {
				return response.data.createReply.status;
			} else {
				console.error('Error: No create reply data received:', response.errors);
				return null;
			}

		} catch (error) {
			console.error('Error occurred while creating reply:', error.message);
			return null;
		}
	}

	/**
	 * Retrieves a list of members from the BetterMode API.
	 *
	 * @param {Object} [variables={}] - The variables for the GraphQL query.
	 * @param {string} [variables.after] - The cursor for fetching the next page of results.
	 * @param {string} [variables.before] - The cursor for fetching the previous page of results.
	 * @param {Array<Object>} [variables.filterBy] - The filters to apply to the member list.
	 * @param {number} [variables.limit=10] - The number of members to retrieve. Default is 10.
	 * @param {number} [variables.offset] - The offset for pagination.
	 * @param {string} [variables.orderBy] - The field to order the results by.
	 * @param {string} [variables.query] - The search query to filter members.
	 * @param {boolean} [variables.reverse] - Whether to reverse the order of the results.
	 * @param {Array<string>} [variables.roleIds] - The role IDs to filter members by.
	 * @param {Array<Object>} [variables.status] - The status filters to apply to the member list.
	 * @param {string} [query=''] - Optional GraphQL query to override the default.
	 * @returns {Promise<Object|null>} - The list of members or null if an error occurred.
	 */
	async getMembers(variables = {}, query = '') {
		const queryGraph = query || GET_MEMBERS;
		const variablesGraph = {
			limit: variables.limit || 5, // Default value of 10 if not specified
			...variables,
		};

		try {
			const response = await this.makeRequest(queryGraph, variablesGraph);

			if (response.data?.members) {
				return response.data.members;
			} else {
				console.error('Error: No member data received:', response.errors);
				return null;
			}
		} catch (error) {
			console.error('Error occurred while fetching members:', error.message);
			return null;
		}
	}

	/**
	 * Adds a reaction to a post in the BetterMode API.
	 *
	 * @param {string} idPost - The ID of the post to add the reaction to.
	 * @param {string} [type='+1'] - The type of reaction to add. Default is '+1'.
	 * @param {Object} [variables={}] - Additional variables for the GraphQL query.
	 * @param {string} [query=''] - Optional GraphQL query to override the default.
	 * @returns {Promise<string|null>} - The status of the reaction addition or null if an error occurred.
	 */
	async addReaction(idPost, type = '+1', variables = {}, query = '') {
		const queryGraph = query || ADD_REACTION;
		const variablesGraph = {
			postId: idPost, input: {
				reaction: type, overrideSingleChoiceReactions: true,
			}, ...variables,
		};

		try {
			const response = await this.makeRequest(queryGraph, variablesGraph);

			if (response.data?.addReaction) {
				return response.data;
			} else {
				console.error('Error: No add reaction data received:', response.errors);
				return null;
			}

		} catch (error) {
			console.error('Error occurred while adding reaction:', error.message);
			return null;
		}
	}

	/**
	 * Removes a reaction from a post in the BetterMode API.
	 *
	 * @param {string} idPost - The ID of the post to remove the reaction from.
	 * @param {string} [type='+1'] - The type of reaction to remove. Default is '+1'.
	 * @param {Object} [variables={}] - Additional variables for the GraphQL query.
	 * @param {string} [query=''] - Optional GraphQL query to override the default.
	 * @returns {Promise<string|null>} - The status of the reaction removal or null if an error occurred.
	 */
	async removeReaction(idPost, type = '+1', variables = {}, query = '') {
		const queryGraph = query || REMOVE_REACTION;
		const variablesGraph = {
			postId: idPost, reaction: type, ...variables,
		};

		try {
			const response = await this.makeRequest(queryGraph, variablesGraph);

			if (response.data?.removeReaction) {
				return response.data;
			} else {
				console.error('Error: No remove reaction data received:', response.errors);
				return null;
			}

		} catch (error) {
			console.error('Error occurred while removing reaction:', error.message);
			return null;
		}
	}

	/**
	 * Subscribes to a publisher in the BetterMode API.
	 *
	 * @param {string} idPublisher - The ID of the publisher to subscribe to.
	 * @param {Object} [variables={}] - Additional variables for the GraphQL query.
	 * @param {string} [query=''] - Optional GraphQL query to override the default.
	 * @returns {Promise<string|null>} - The status of the subscription or null if an error occurred.
	 */
	async subscribe(idPublisher, variables = {}, query = '') {
		const queryGraph = query || SUBSCRIBE;
		const variablesGraph = {
			publisherId: idPublisher, ...variables
		};

		try {
			const response = await this.makeRequest(queryGraph, variablesGraph);

			if (response.data?.subscribe) {
				return response.data;
			} else {
				console.error('Error: No subscribe data received:', response.errors);
				return null;
			}

		} catch (error) {
			console.error('Error occurred while subscribing:', error.message);
			return null;
		}
	}

	/**
	 * Unsubscribes from a publisher in the BetterMode API.
	 *
	 * @param {string} idPublisher - The ID of the publisher to unsubscribe from.
	 * @param {Object} [variables={}] - Additional variables for the GraphQL query.
	 * @param {string} [query=''] - Optional GraphQL query to override the default.
	 * @returns {Promise<string|null>} - The status of the unsubscription or null if an error occurred.
	 */
	async unsubscribe(idPublisher, query = '', variables = {}) {
		const queryGraph = query || UNSUBSCRIBE;
		const variablesGraph = {publisherId: idPublisher, ...variables};

		try {
			const response = await this.makeRequest(queryGraph, variablesGraph);

			if (response.data?.unsubscribe) {
				return response.data;
			} else {
				console.error('Error: No unsubscribe data received:', response.errors);
				return null;
			}

		} catch (error) {
			console.error('Error occurred while unsubscribing:', error.message);
			return null;
		}
	}

	/**
	 * Retrieves the feed data from the BetterMode API.
	 *
	 * @param {Object} [variables={}] - The variables for the GraphQL query.
	 * @param {number} [variables.limit=10] - The number of feed items to retrieve. Default is 10.
	 * @param {string} [variables.after] - The cursor for fetching the next page of results.
	 * @param {string} [variables.before] - The cursor for fetching the previous page of results.
	 * @param {Array<Object>} [variables.filterBy] - The filters to apply to the feed.
	 * @param {string} [variables.query] - The search query to filter the feed.
	 * @param {boolean} [variables.reverse] - Whether to reverse the order of the results.
	 * @param {Array<string>} [variables.postTypeIds] - The post type IDs to filter the feed.
	 * @param {string} [query=''] - Optional GraphQL query to override the default.
	 * @returns {Promise<Object|null>} - The feed data or null if an error occurred.
	 */
	async getFeed(variables = {}, query = '') {
		const queryGraph = query || GET_FEED;
		const variablesGraph = {
			limit: variables.limit || 10, ...variables
		};

		try {
			const response = await this.makeRequest(queryGraph, variablesGraph);
			if (response.data?.feed) {
				return response.data.feed;
			} else {
				console.error('Error: No feed data received:', response.errors);
				return null;
			}
		} catch (error) {
			console.error('Error occurred while fetching feed:', error.message);
			return null;
		}
	}
}
