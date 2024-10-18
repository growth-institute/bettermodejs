const ADD_REACTION = `mutation addReaction($input: AddReactionInput!, $postId: ID!) {
			addReaction(input: $input, postId: $postId) {
				status
			}
		}`;

const REMOVE_REACTION = `mutation removeReaction($reaction: String!, $postId: ID!) {
			removeReaction(reaction: $reaction, postId: $postId) {
				status
			}
		}`

const SUBSCRIBE = `mutation subscribe($publisherId: String!) {
			subscribe(publisherId: $publisherId) {
				__typename
				status
			}
		}`


const UNSUBSCRIBE = `mutation unsubscribe($publisherId: String!) {
			unsubscribe(publisherId: $publisherId) {
				__typename
				status
			}
		}`



export {ADD_REACTION, REMOVE_REACTION, SUBSCRIBE, UNSUBSCRIBE};
