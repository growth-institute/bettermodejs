import axios from 'axios';

export class BetterMode {
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
			context: 'NETWORK',
			networkId,
			entityId: networkId,
		};

		if(memberId) {
			argumentsObj.impersonateMemberId = memberId;
		}

		const GET_ACCESS_TOKEN = `query limitedToken(
				$context: PermissionContext!,
				$networkId: String!,
				$entityId: String!,
				$impersonateMemberId: String
			) {
				limitedToken(context: $context, networkId: $networkId, entityId: $entityId, impersonateMemberId: $impersonateMemberId) {
					accessToken
				}
			}
		`;

		try {
			console.log('Fetching access token...');
			const response = await axios({
				url: url,
				method: 'post',
				data: {
					query: GET_ACCESS_TOKEN,
					variables: argumentsObj,
				},
			});

			if(response.data?.data?.limitedToken?.accessToken) {
				return response.data.data.limitedToken.accessToken;
			} else {
				console.error('Error: No access token received.');
				return null;
			}
		} catch(error) {
			console.error('Error occurred:', error.message);
			return null;
		}
	}

	/**
	 * Makes a request to the BetterMode API.
	 *
	 * @param {string} query - The GraphQL query to be executed.
	 * @param {Object} variables - The variables for the GraphQL query.
	 * @returns {Promise<Object|null>} - The response data from the API or null if an error occurred.
	 * @throws {Error} - Throws an error if no URI or access token is provided.
	 */
	async makeRequest(query, variables) {

		// if no uri is provided, throw an error
		if(!this.uri) throw new Error('No URI provided');

		// if no access token is provided, throw an error
		if(!this.accessToken) throw new Error('No access token provided');

		try {
			const response = await axios({
				url: this.uri,
				method: 'post',
				headers: {
					'Authorization': `Bearer ${ this.accessToken }`,
					'Content-Type': 'application/json',
				},
				data: {
					query: query,
					variables: variables,
				},
			});

			return response.data;
		} catch(e) {
			console.error('Error occurred:', e.message, e.response.data);
			return null;
		}
	}

	/**
	 * Retrieves a list of spaces from the BetterMode API.
	 *
	 * @param {Object} [options={}] - The options for querying spaces.
	 * @param {string} [options.after] - The cursor for fetching the next page of results.
	 * @param {string} [options.before] - The cursor for fetching the previous page of results.
	 * @param {string} [options.collectionId] - The ID of the collection to filter spaces by.
	 * @param {number} [options.limit=30] - The number of spaces to retrieve. Default is 30.
	 * @param {string} [options.memberId] - The ID of the member to filter spaces by.
	 * @param {number} [options.offset] - The offset for pagination.
	 * @param {string} [options.orderBy] - The field to order the results by.
	 * @param {Array<Object>} [options.filterBy] - The filters to apply to the space list.
	 * @param {string} [options.query] - The search query to filter spaces.
	 * @param {boolean} [options.reverse] - Whether to reverse the order of the results.
	 * @param {Array<string>} [options.type] - The types of spaces to filter by.
	 * @returns {Promise<Object|null>} - The list of spaces or null if an error occurred.
	 */
	async getSpaces(options = {}) {
		const query = `query GetSpaces(
			$after: String,
			$before: String,
			$collectionId: String,
			$limit: Int!,
			$memberId: ID,
			$offset: Int,
			$orderBy: SpaceListOrderByEnum,
			$filterBy: [EntityListFilterByInput!]
			$query: String
			$reverse: Boolean
			$type: [SpaceType!]) {
				spaces(
					after: $after
					before: $before
					collectionId: $collectionId
					limit: $limit
					memberId: $memberId
					filterBy: $filterBy
					offset: $offset
					orderBy: $orderBy
					query: $query
					reverse: $reverse
					type: $type
				) {
					totalCount
					pageInfo {
						endCursor
						hasNextPage
					}
					edges {
						cursor
						node {
							id
							networkId
							name
							description
							slug
							type
							layout
							isHomepage
							address {
								path
								exact
								editable
							}
							createdById
							groupId
							imageId
							bannerId
							membersCount
							createdAt
							updatedAt
							private
							hidden
							inviteOnly
							nonAdminsCanInvite
							customOrderingIndexInGroup
							whoCanPost
							whoCanReact
							whoCanReply
							customSeoDetail {
								description
								noIndex
								thumbnail {
									... on Image {
										__typename
										id
										url
										width
										height
										dominantColorHex
										dpi
										cropHeight
										cropWidth
										cropX
										cropY
										cropZoom
										urls {
											__typename
											full
											large
											medium
											small
											thumb
										}
									}
									... on Emoji {
										__typename
										id
										text
									}
									... on Glyph {
										__typename
										id
										text
										variant
									}
									... on File {
										id
										name
										url
									}
								}
								thumbnailId
								title
							}
							relativeUrl
							url
							postsCount
							image {
								... on Image {
									__typename
									id
									url
									width
									height
									dominantColorHex
									dpi
									cropHeight
									cropWidth
									cropX
									cropY
									cropZoom
									urls {
										__typename
										full
										large
										medium
										small
										thumb
									}
								}
								... on Emoji {
									__typename
									id
									text
								}
								... on Glyph {
									__typename
									id
									text
									variant
								}
								... on File {
									id
									name
									url
								}
							}
							banner {
								... on Image {
									__typename
									id
									url
									width
									height
									dominantColorHex
									dpi
									cropHeight
									cropWidth
									cropX
									cropY
									cropZoom
									urls {
										__typename
										full
										large
										medium
										small
										thumb
									}
								}
								... on Emoji {
									__typename
									id
									text
								}
								... on Glyph {
									__typename
									id
									text
									variant
								}
								... on File {
									id
									name
									url
								}
							}
							authMemberProps {
								context
								lastReadAt
								membershipStatus
								scopes
								unreadPostsCount
								subscribed
								permissions {
									name
									isAuthorized {
										authorized
										reason
										requiredPlan
									}
									inputPermissions {
										path
										isAuthorized {
											authorized
											reason
											requiredPlan
										}
									}
									outputPermissions {
										path
										isAuthorized {
											authorized
											reason
											requiredPlan
										}
									}
								}
								availablePostTypes {
									__typename
									archived
									allowedEmojis
									context
									createdAt
									forbiddenEmojis
									id
									languageTemplate
									name
									description
									nativeFieldsTemplates {
										description
										thumbnailId
										title
									}
									negativeReactions
									pluralName
									positiveReactions
									primaryReactionType
									shortContentTemplate
									singleChoiceReactions
									allowedReactions
									customReactions {
										__typename
										activeColor
										activeGlyphId
										activeName
										color
										glyphId
										key
										name
									}
									slug
									titleTemplate
									updatedAt
									mappings {
										key
										field
										type
										title
										description
										required
										isMainContent
										isSearchable
										default
									}
								}
							}
							slate {
								rootBlock
								blocks {
									id
									name
									props
									extraProps
									children
									output
								}
								restrictions {
									nonEditableBlocks
									lockedChildrenBlocks
									nonRemovableBlocks
								}
							}
						}
					}
					nodes {
						id
						networkId
						name
						description
						slug
						type
						layout
						isHomepage
						address {
							path
							exact
							editable
						}
						createdById
						groupId
						imageId
						bannerId
						membersCount
						createdAt
						updatedAt
						private
						hidden
						inviteOnly
						nonAdminsCanInvite
						customOrderingIndexInGroup
						whoCanPost
						whoCanReact
						whoCanReply
						customSeoDetail {
							description
							noIndex
							thumbnail {
								... on Image {
									__typename
									id
									url
									width
									height
									dominantColorHex
									dpi
									cropHeight
									cropWidth
									cropX
									cropY
									cropZoom
									urls {
										__typename
										full
										large
										medium
										small
										thumb
									}
								}
								... on Emoji {
									__typename
									id
									text
								}
								... on Glyph {
									__typename
									id
									text
									variant
								}
								... on File {
									id
									name
									url
								}
							}
							thumbnailId
							title
						}
						relativeUrl
						url
						postsCount
						image {
							... on Image {
								__typename
								id
								url
								width
								height
								dominantColorHex
								dpi
								cropHeight
								cropWidth
								cropX
								cropY
								cropZoom
								urls {
									__typename
									full
									large
									medium
									small
									thumb
								}
							}
							... on Emoji {
								__typename
								id
								text
							}
							... on Glyph {
								__typename
								id
								text
								variant
							}
							... on File {
								id
								name
								url
							}
						}
						banner {
							... on Image {
								__typename
								id
								url
								width
								height
								dominantColorHex
								dpi
								cropHeight
								cropWidth
								cropX
								cropY
								cropZoom
								urls {
									__typename
									full
									large
									medium
									small
									thumb
								}
							}
							... on Emoji {
								__typename
								id
								text
							}
							... on Glyph {
								__typename
								id
								text
								variant
							}
							... on File {
								id
								name
								url
							}
						}
						authMemberProps {
							context
							lastReadAt
							membershipStatus
							scopes
							unreadPostsCount
							subscribed
							permissions {
								name
								isAuthorized {
									authorized
									reason
									requiredPlan
								}
								inputPermissions {
									path
									isAuthorized {
										authorized
										reason
										requiredPlan
									}
								}
								outputPermissions {
									path
									isAuthorized {
										authorized
										reason
										requiredPlan
									}
								}
							}
							availablePostTypes {
								__typename
								archived
								allowedEmojis
								context
								createdAt
								forbiddenEmojis
								id
								languageTemplate
								name
								description
								nativeFieldsTemplates {
									description
									thumbnailId
									title
								}
								negativeReactions
								pluralName
								positiveReactions
								primaryReactionType
								shortContentTemplate
								singleChoiceReactions
								allowedReactions
								customReactions {
									__typename
									activeColor
									activeGlyphId
									activeName
									color
									glyphId
									key
									name
								}
								slug
								titleTemplate
								updatedAt
								mappings {
									key
									field
									type
									title
									description
									required
									isMainContent
									isSearchable
									default
								}
							}
						}
						slate {
							rootBlock
							blocks {
								id
								name
								props
								extraProps
								children
								output
							}
							restrictions {
								nonEditableBlocks
								lockedChildrenBlocks
								nonRemovableBlocks
							}
						}
					}
				}
			}`;

		const variables = {
			limit: options.limit || 30, // Valor por defecto de 10 si no se especifica
			...options,
		};

		try {
			const response = await this.makeRequest(query, variables);

			if(response.data?.spaces) {
				return response.data.spaces;
			} else {
				console.error('Error: No space data received: ' + response.errors);
				return null;
			}

		} catch(error) {
			console.error('Error occurred while fetching spaces:', error.message);
			return null;
		}
	}

	/**
	 * Retrieves a specific space from the BetterMode API.
	 *
	 * @param {string} idSpace - The ID of the space to retrieve.
	 * @returns {Promise<Object|null>} - The space data or null if an error occurred.
	 */
	async getSpace(idSpace) {
		const query = `query GetSpace($id: ID, $slug: ID, $path: String) {
			space(id: $id, slug: $slug, path: $path) {
				id
				networkId
				name
				description
				slug
				type
				layout
				isHomepage
				address {
					path
					exact
					editable
				}
				createdById
				groupId
				imageId
				bannerId
				membersCount
				createdAt
				updatedAt
				private
				hidden
				inviteOnly
				nonAdminsCanInvite
				customOrderingIndexInGroup
				whoCanPost
				whoCanReact
				whoCanReply
				customSeoDetail {
					description
					noIndex
					thumbnail {
						... on Image {
							__typename
							id
							url
							width
							height
							dominantColorHex
							dpi
							cropHeight
							cropWidth
							cropX
							cropY
							cropZoom
							urls {
								__typename
								full
								large
								medium
								small
								thumb
							}
						}
						... on Emoji {
							__typename
							id
							text
						}
						... on Glyph {
							__typename
							id
							text
							variant
						}
						... on File {
							id
							name
							url
						}
					}
					thumbnailId
					title
				}
				relativeUrl
				url
				postsCount
				image {
					... on Image {
						__typename
						id
						url
						width
						height
						dominantColorHex
						dpi
						cropHeight
						cropWidth
						cropX
						cropY
						cropZoom
						urls {
							__typename
							full
							large
							medium
							small
							thumb
						}
					}
					... on Emoji {
						__typename
						id
						text
					}
					... on Glyph {
						__typename
						id
						text
						variant
					}
					... on File {
						id
						name
						url
					}
				}
				banner {
					... on Image {
						__typename
						id
						url
						width
						height
						dominantColorHex
						dpi
						cropHeight
						cropWidth
						cropX
						cropY
						cropZoom
						urls {
							__typename
							full
							large
							medium
							small
							thumb
						}
					}
					... on Emoji {
						__typename
						id
						text
					}
					... on Glyph {
						__typename
						id
						text
						variant
					}
					... on File {
						id
						name
						url
					}
				}
				highlightedTags {
					description
					id
					slug
					title
				}
				collection {
					id
					slug
					name
					description
					createdAt
					relativeUrl
					url
				}
				authMemberProps {
					context
					lastReadAt
					membershipStatus
					scopes
					unreadPostsCount
					subscribed
					permissions {
						name
						isAuthorized {
							authorized
							reason
							requiredPlan
						}
						inputPermissions {
							path
							isAuthorized {
								authorized
								reason
								requiredPlan
							}
						}
						outputPermissions {
							path
							isAuthorized {
								authorized
								reason
								requiredPlan
							}
						}
					}
					availablePostTypes {
						__typename
						archived
						allowedEmojis
						context
						createdAt
						forbiddenEmojis
						id
						languageTemplate
						name
						description
						nativeFieldsTemplates {
							description
							thumbnailId
							title
						}
						negativeReactions
						pluralName
						positiveReactions
						primaryReactionType
						shortContentTemplate
						singleChoiceReactions
						allowedReactions
						customReactions {
							__typename
							activeColor
							activeGlyphId
							activeName
							color
							glyphId
							key
							name
						}
						slug
						titleTemplate
						updatedAt
						mappings {
							key
							field
							type
							title
							description
							required
							isMainContent
							isSearchable
							default
						}
					}
				}
				slate {
					rootBlock
					blocks {
						id
						name
						props
						extraProps
						children
						output
					}
					restrictions {
						nonEditableBlocks
						lockedChildrenBlocks
						nonRemovableBlocks
					}
				}
			}
		}`;

		const variables = { id: idSpace };

		try {
			const response = await this.makeRequest(query, variables);

			if(response.data?.space) {
				return response.data.space;
			} else {
				console.error('Error: No space data received: ' + response.errors);
				return null;
			}

		} catch(error) {
			console.error(`Error occurred while fetching space ${ idSpace }:`, error.message);
			return null;
		}
	}

	async createReply(idPost, content) {
		const query = `mutation createReply($postId: ID!, $input: CreatePostInput!) {
			createReply(postId: $postId, input: $input) {
				id
				slug
				mappingFields {
					key
					type
					value
				}
				fields {
					key
					value
					relationEntities {
						__typename
						medias {
							__typename
							... on Emoji {
								__typename
								id
								text
							}
							... on File {
								__typename
								downloadUrl
								extension
								id
								name
								size
								status
								url
							}
							... on Image {
								__typename
								cropHeight
								cropWidth
								cropX
								cropY
								cropZoom
								dominantColorHex
								downloadUrl
								dpi
								height
								id
								name
								status
								url
								urls {
									__typename
									full
									large
									medium
									small
									thumb
								}
								width
							}
						}
						members {
							__typename
							bannerId
							blockedMemberIds
							createdAt
							displayName
							email
							emailStatus
							externalId
							externalUrl
							flagged
							id
							lastSeen
							lastSeenAt
							locale
							name
							networkId
							newEmail
							overrideTeammate
							profilePicture {
								__typename
								... on Image {
									__typename
									cropHeight
									cropWidth
									cropX
									cropY
									cropZoom
									dominantColorHex
									downloadUrl
									dpi
									height
									id
									name
									status
									url
									urls {
										__typename
										full
										large
										medium
										small
										thumb
									}
									width
								}
							}
							profilePictureId
							relativeUrl
							roleId
							score
							staffReasons
							status
							subscribersCount
							tagline
							teammate
							timeZone
							updatedAt
							url
							username
							verifiedAt
						}
						posts {
							__typename
							allowedEmojis
							allowedReactions
							attachmentIds
							createdAt
							createdById
							description
							embedIds
							externalId
							externalUrl
							followersCount
							forbiddenEmojis
							forbiddenReactions
							hasMoreContent
							id
							imageIds
							isAnonymous
							isHidden
							language
							lastActivityAt
							locked
							mentionedMembers
							negativeReactions
							negativeReactionsCount
							networkId
							ownerId
							pinnedInto
							positiveReactions
							positiveReactionsCount
							postTypeId
							primaryReactionType
							publishedAt
							reactionsCount
							relativeUrl
							repliedToId
							repliedToIds
							repliesCount
							shortContent
							singleChoiceReactions
							slug
							spaceId
							status
							subscribersCount
							tagIds
							textContent
							thumbnailId
							title
							topicIds
							totalRepliesCount
							updatedAt
							url
						}
						spaces {
							__typename
							bannerId
							createdAt
							createdById
							customOrderingIndexInGroup
							description
							externalId
							externalUrl
							groupId
							hidden
							highlightedTagIds
							id
							image {
								__typename
								... on Emoji {
									__typename
									id
									text
								}
								... on Image {
									__typename
									cropHeight
									cropWidth
									cropX
									cropY
									cropZoom
									dominantColorHex
									downloadUrl
									dpi
									height
									id
									name
									status
									url
									urls {
										__typename
										full
										large
										medium
										small
										thumb
									}
									width
								}
							}
							imageId
							inviteOnly
							isHomepage
							isNewUserHomepage
							isReturningUserHomepage
							key
							layout
							membersCount
							name
							networkId
							nonAdminsCanInvite
							postsCount
							private
							relativeUrl
							slug
							subscribersCount
							type
							updatedAt
							url
							whoCanPost
							whoCanReact
							whoCanReply
						}
						tags {
							__typename
							description
							id
							slug
							spaceId
							title
						}
					}
				}
				subscribersCount
				postTypeId
				reactionsCount
				hasMoreContent
				isAnonymous
				isHidden
				shortContent
				createdAt
				publishedAt
				ownerId
				createdById
				status
				spaceId
				imageIds
				pinnedInto
				repliesCount
				totalRepliesCount
				locked
				repliedToIds
				repliedToId
				title
				description
				thumbnail {
					... on Image {
						__typename
						id
						url
						width
						height
						dominantColorHex
						dpi
						cropHeight
						cropWidth
						cropX
						cropY
						cropZoom
						urls {
							__typename
							full
							large
							medium
							small
							thumb
						}
					}
					... on Emoji {
						__typename
						id
						text
					}
					... on Glyph {
						__typename
						id
						text
						variant
					}
					... on File {
						id
						name
						url
					}
				}
				embedIds
				mentionedMembers
				primaryReactionType
				lastActivityAt
				language
				customSeoDetail {
					description
					noIndex
					thumbnail {
						... on Image {
							__typename
							id
							url
							width
							height
							dominantColorHex
							dpi
							cropHeight
							cropWidth
							cropX
							cropY
							cropZoom
							urls {
								__typename
								full
								large
								medium
								small
								thumb
							}
						}
						... on Emoji {
							__typename
							id
							text
						}
						... on Glyph {
							__typename
							id
							text
							variant
						}
						... on File {
							id
							name
							url
						}
					}
					thumbnailId
					title
					canonicalUrl
				}
				relativeUrl
				url
				attachments {
					extension
					id
					name
					size
					url
					downloadUrl
				}
				authMemberProps {
					context
					scopes
					subscribed
					permissions {
						name
						isAuthorized {
							authorized
							reason
							requiredPlan
						}
						inputPermissions {
							path
							isAuthorized {
								authorized
								reason
								requiredPlan
							}
						}
						outputPermissions {
							path
							isAuthorized {
								authorized
								reason
								requiredPlan
							}
						}
					}
					availableReplyTypes {
						__typename
						archived
						allowedEmojis
						context
						createdAt
						forbiddenEmojis
						id
						languageTemplate
						name
						description
						nativeFieldsTemplates {
							description
							thumbnailId
							title
						}
						negativeReactions
						pluralName
						positiveReactions
						primaryReactionType
						shortContentTemplate
						singleChoiceReactions
						allowedReactions
						customReactions {
							__typename
							activeColor
							activeGlyphId
							activeName
							color
							glyphId
							key
							name
						}
						slug
						titleTemplate
						updatedAt
						mappings {
							key
							field
							type
							title
							description
							required
							isMainContent
							isSearchable
							default
						}
					}
					canReact
				}
				postType {
					__typename
					archived
					allowedEmojis
					context
					createdAt
					forbiddenEmojis
					id
					languageTemplate
					name
					description
					nativeFieldsTemplates {
						description
						thumbnailId
						title
					}
					negativeReactions
					pluralName
					positiveReactions
					primaryReactionType
					shortContentTemplate
					singleChoiceReactions
					allowedReactions
					customReactions {
						__typename
						activeColor
						activeGlyphId
						activeName
						color
						glyphId
						key
						name
					}
					slug
					titleTemplate
					updatedAt
					mappings {
						key
						field
						type
						title
						description
						required
						isMainContent
						isSearchable
						default
					}
					postFields {
						__typename
						fields {
							default
							description
							externalKeys
							key
							name
							archived
							readPrivacy {
								allow
							}
							required
							searchable
							settings {
								key
								value
							}
							type
							typeOptions {
								dateType
								numberType
								relationType
								richTextType
								textType
							}
							validators {
								customErrorMessage
								validation
								value
							}
							writePrivacy {
								allow
							}
							items {
								description
								key
								name
								required
								type
								typeOptions {
									dateType
									numberType
									relationType
									richTextType
									textType
								}
								validators {
									customErrorMessage
									validation
									value
								}
							}
							properties {
								description
								key
								name
								required
								type
								typeOptions {
									dateType
									numberType
									relationType
									richTextType
									textType
								}
								validators {
									customErrorMessage
									validation
									value
								}
								items {
									description
									key
									name
									required
									type
									typeOptions {
										dateType
										numberType
										relationType
										richTextType
										textType
									}
									validators {
										customErrorMessage
										validation
										value
									}
								}
								properties {
									description
									key
									name
									required
									type
									typeOptions {
										dateType
										numberType
										relationType
										richTextType
										textType
									}
									validators {
										customErrorMessage
										validation
										value
									}
								}
							}
						}
					}
					validReplyTypes {
						__typename
						archived
						allowedEmojis
						context
						createdAt
						forbiddenEmojis
						id
						languageTemplate
						name
						description
						nativeFieldsTemplates {
							description
							thumbnailId
							title
						}
						negativeReactions
						pluralName
						positiveReactions
						primaryReactionType
						shortContentTemplate
						singleChoiceReactions
						allowedReactions
						customReactions {
							__typename
							activeColor
							activeGlyphId
							activeName
							color
							glyphId
							key
							name
						}
						slate {
							rootBlock
							blocks {
								id
								name
								props
								extraProps
								children
								output
							}
							restrictions {
								nonEditableBlocks
								lockedChildrenBlocks
								nonRemovableBlocks
							}
						}
						slug
						titleTemplate
						updatedAt
						mappings {
							key
							field
							type
							title
							description
							required
							isMainContent
							isSearchable
							default
						}
						postFields {
							__typename
						}
						icon {
							... on Image {
								__typename
								id
								url
								width
								height
								dominantColorHex
								dpi
								cropHeight
								cropWidth
								cropX
								cropY
								cropZoom
								urls {
									__typename
									full
									large
									medium
									small
									thumb
								}
							}
							... on Emoji {
								__typename
								id
								text
							}
							... on Glyph {
								__typename
								id
								text
								variant
							}
							... on File {
								id
								name
								url
							}
						}
						validReplyTypes {
							__typename
							archived
							allowedEmojis
							context
							createdAt
							forbiddenEmojis
							id
							languageTemplate
							name
							description
							nativeFieldsTemplates {
								description
								thumbnailId
								title
							}
							negativeReactions
							pluralName
							positiveReactions
							primaryReactionType
							shortContentTemplate
							singleChoiceReactions
							allowedReactions
							customReactions {
								__typename
								activeColor
								activeGlyphId
								activeName
								color
								glyphId
								key
								name
							}
							slug
							titleTemplate
							updatedAt
							mappings {
								key
								field
								type
								title
								description
								required
								isMainContent
								isSearchable
								default
							}
						}
						authMemberProps {
							context
							scopes
						}
					}
				}
				owner {
					__typename
					member {
						displayName
						name
						id
						locale
						profilePictureId
						bannerId
						status
						username
						email
						emailStatus
						newEmail
						tagline
						lastSeenAt
						createdAt
						updatedAt
						relativeUrl
						url
						externalId
						roleId
						flagged
						teammate
						staffReasons
						profilePicture {
							... on Image {
								__typename
								id
								url
								width
								height
								dominantColorHex
								dpi
								cropHeight
								cropWidth
								cropX
								cropY
								cropZoom
								urls {
									__typename
									full
									large
									medium
									small
									thumb
								}
							}
							... on Emoji {
								__typename
								id
								text
							}
							... on Glyph {
								__typename
								id
								text
								variant
							}
							... on File {
								id
								name
								url
							}
						}
						badges {
							backgroundColor
							badgeId
							imageId
							longDescription
							text
							shortDescription
							textColor
							type
							badge {
								active
								backgroundColor
								daysUntilExpired
								id
								imageId
								longDescription
								name
								shortDescription
								textColor
								text
								type
								settings {
									key
									value
								}
								image {
									... on Image {
										__typename
										id
										url
										width
										height
										dominantColorHex
										dpi
										cropHeight
										cropWidth
										cropX
										cropY
										cropZoom
										urls {
											__typename
											full
											large
											medium
											small
											thumb
										}
									}
									... on Emoji {
										__typename
										id
										text
									}
									... on Glyph {
										__typename
										id
										text
										variant
									}
									... on File {
										id
										name
										url
									}
								}
							}
						}
					}
				}
				tags {
					description
					id
					slug
					title
				}
				embeds {
					author
					author_url
					description
					html
					id
					provider_name
					thumbnail_height
					thumbnail_url
					thumbnail_width
					title
					type
					url
				}
				mentions {
					displayName
					name
					id
					locale
					profilePictureId
					bannerId
					status
					username
					email
					emailStatus
					newEmail
					tagline
					lastSeenAt
					createdAt
					updatedAt
					relativeUrl
					url
					externalId
					roleId
					flagged
					teammate
					staffReasons
				}
				space {
					id
					networkId
					name
					description
					slug
					type
					layout
					isHomepage
					address {
						path
						exact
						editable
					}
					createdById
					groupId
					imageId
					bannerId
					membersCount
					createdAt
					updatedAt
					private
					hidden
					inviteOnly
					nonAdminsCanInvite
					customOrderingIndexInGroup
					whoCanPost
					whoCanReact
					whoCanReply
					customSeoDetail {
						description
						noIndex
						thumbnail {
							... on Image {
								__typename
								id
								url
								width
								height
								dominantColorHex
								dpi
								cropHeight
								cropWidth
								cropX
								cropY
								cropZoom
								urls {
									__typename
									full
									large
									medium
									small
									thumb
								}
							}
							... on Emoji {
								__typename
								id
								text
							}
							... on Glyph {
								__typename
								id
								text
								variant
							}
							... on File {
								id
								name
								url
							}
						}
						thumbnailId
						title
					}
					relativeUrl
					url
					postsCount
					image {
						... on Image {
							__typename
							id
							url
							width
							height
							dominantColorHex
							dpi
							cropHeight
							cropWidth
							cropX
							cropY
							cropZoom
							urls {
								__typename
								full
								large
								medium
								small
								thumb
							}
						}
						... on Emoji {
							__typename
							id
							text
						}
						... on Glyph {
							__typename
							id
							text
							variant
						}
						... on File {
							id
							name
							url
						}
					}
					banner {
						... on Image {
							__typename
							id
							url
							width
							height
							dominantColorHex
							dpi
							cropHeight
							cropWidth
							cropX
							cropY
							cropZoom
							urls {
								__typename
								full
								large
								medium
								small
								thumb
							}
						}
						... on Emoji {
							__typename
							id
							text
						}
						... on Glyph {
							__typename
							id
							text
							variant
						}
						... on File {
							id
							name
							url
						}
					}
					highlightedTags {
						description
						id
						slug
						title
					}
					collection {
						id
						slug
						name
						description
						createdAt
						relativeUrl
						url
					}
					authMemberProps {
						context
						lastReadAt
						membershipStatus
						scopes
						unreadPostsCount
						subscribed
						permissions {
							name
							isAuthorized {
								authorized
								reason
								requiredPlan
							}
							inputPermissions {
								path
								isAuthorized {
									authorized
									reason
									requiredPlan
								}
							}
							outputPermissions {
								path
								isAuthorized {
									authorized
									reason
									requiredPlan
								}
							}
						}
						availablePostTypes {
							__typename
							archived
							allowedEmojis
							context
							createdAt
							forbiddenEmojis
							id
							languageTemplate
							name
							description
							nativeFieldsTemplates {
								description
								thumbnailId
								title
							}
							negativeReactions
							pluralName
							positiveReactions
							primaryReactionType
							shortContentTemplate
							singleChoiceReactions
							allowedReactions
							customReactions {
								__typename
								activeColor
								activeGlyphId
								activeName
								color
								glyphId
								key
								name
							}
							slug
							titleTemplate
							updatedAt
							mappings {
								key
								field
								type
								title
								description
								required
								isMainContent
								isSearchable
								default
							}
						}
					}
					slate {
						rootBlock
						blocks {
							id
							name
							props
							extraProps
							children
							output
						}
						restrictions {
							nonEditableBlocks
							lockedChildrenBlocks
							nonRemovableBlocks
						}
					}
				}
				reactions {
					count
					reacted
					reaction
					participants(limit: 10) {
						nodes {
							participant {
								id
								name
							}
						}
					}
				}
				replies(limit: 2, reverse: true) {
					nodes {
						id
						slug
						mappingFields {
							key
							type
							value
						}
						fields {
							key
							value
							relationEntities {
								__typename
								medias {
									__typename
									... on Emoji {
										__typename
										id
										text
									}
									... on File {
										__typename
										downloadUrl
										extension
										id
										name
										size
										status
										url
									}
									... on Image {
										__typename
										cropHeight
										cropWidth
										cropX
										cropY
										cropZoom
										dominantColorHex
										downloadUrl
										dpi
										height
										id
										name
										status
										url
										urls {
											__typename
											full
											large
											medium
											small
											thumb
										}
										width
									}
								}
								members {
									__typename
									bannerId
									blockedMemberIds
									createdAt
									displayName
									email
									emailStatus
									externalId
									externalUrl
									flagged
									id
									lastSeen
									lastSeenAt
									locale
									name
									networkId
									newEmail
									overrideTeammate
									profilePicture {
										__typename
										... on Image {
											__typename
											cropHeight
											cropWidth
											cropX
											cropY
											cropZoom
											dominantColorHex
											downloadUrl
											dpi
											height
											id
											name
											status
											url
											urls {
												__typename
												full
												large
												medium
												small
												thumb
											}
											width
										}
									}
									profilePictureId
									relativeUrl
									roleId
									score
									staffReasons
									status
									subscribersCount
									tagline
									teammate
									timeZone
									updatedAt
									url
									username
									verifiedAt
								}
								posts {
									__typename
									allowedEmojis
									allowedReactions
									attachmentIds
									createdAt
									createdById
									description
									embedIds
									externalId
									externalUrl
									followersCount
									forbiddenEmojis
									forbiddenReactions
									hasMoreContent
									id
									imageIds
									isAnonymous
									isHidden
									language
									lastActivityAt
									locked
									mentionedMembers
									negativeReactions
									negativeReactionsCount
									networkId
									ownerId
									pinnedInto
									positiveReactions
									positiveReactionsCount
									postTypeId
									primaryReactionType
									publishedAt
									reactionsCount
									relativeUrl
									repliedToId
									repliedToIds
									repliesCount
									shortContent
									singleChoiceReactions
									slug
									spaceId
									status
									subscribersCount
									tagIds
									textContent
									thumbnailId
									title
									topicIds
									totalRepliesCount
									updatedAt
									url
								}
								spaces {
									__typename
									bannerId
									createdAt
									createdById
									customOrderingIndexInGroup
									description
									externalId
									externalUrl
									groupId
									hidden
									highlightedTagIds
									id
									image {
										__typename
										... on Emoji {
											__typename
											id
											text
										}
										... on Image {
											__typename
											cropHeight
											cropWidth
											cropX
											cropY
											cropZoom
											dominantColorHex
											downloadUrl
											dpi
											height
											id
											name
											status
											url
											urls {
												__typename
												full
												large
												medium
												small
												thumb
											}
											width
										}
									}
									imageId
									inviteOnly
									isHomepage
									isNewUserHomepage
									isReturningUserHomepage
									key
									layout
									membersCount
									name
									networkId
									nonAdminsCanInvite
									postsCount
									private
									relativeUrl
									slug
									subscribersCount
									type
									updatedAt
									url
									whoCanPost
									whoCanReact
									whoCanReply
								}
								tags {
									__typename
									description
									id
									slug
									spaceId
									title
								}
							}
						}
						subscribersCount
						postTypeId
						reactionsCount
						hasMoreContent
						isAnonymous
						isHidden
						shortContent
						createdAt
						publishedAt
						ownerId
						createdById
						status
						spaceId
						imageIds
						pinnedInto
						repliesCount
						totalRepliesCount
						locked
						repliedToIds
						repliedToId
						title
						description
						thumbnail {
							... on Image {
								__typename
								id
								url
								width
								height
								dominantColorHex
								dpi
								cropHeight
								cropWidth
								cropX
								cropY
								cropZoom
								urls {
									__typename
									full
									large
									medium
									small
									thumb
								}
							}
							... on Emoji {
								__typename
								id
								text
							}
							... on Glyph {
								__typename
								id
								text
								variant
							}
							... on File {
								id
								name
								url
							}
						}
						embedIds
						mentionedMembers
						primaryReactionType
						lastActivityAt
						language
						customSeoDetail {
							description
							noIndex
							thumbnail {
								... on Image {
									__typename
									id
									url
									width
									height
									dominantColorHex
									dpi
									cropHeight
									cropWidth
									cropX
									cropY
									cropZoom
									urls {
										__typename
										full
										large
										medium
										small
										thumb
									}
								}
								... on Emoji {
									__typename
									id
									text
								}
								... on Glyph {
									__typename
									id
									text
									variant
								}
								... on File {
									id
									name
									url
								}
							}
							thumbnailId
							title
							canonicalUrl
						}
						relativeUrl
						url
						attachments {
							extension
							id
							name
							size
							url
							downloadUrl
						}
						authMemberProps {
							context
							scopes
							subscribed
							permissions {
								name
								isAuthorized {
									authorized
									reason
									requiredPlan
								}
								inputPermissions {
									path
									isAuthorized {
										authorized
										reason
										requiredPlan
									}
								}
								outputPermissions {
									path
									isAuthorized {
										authorized
										reason
										requiredPlan
									}
								}
							}
							availableReplyTypes {
								__typename
								archived
								allowedEmojis
								context
								createdAt
								forbiddenEmojis
								id
								languageTemplate
								name
								description
								nativeFieldsTemplates {
									description
									thumbnailId
									title
								}
								negativeReactions
								pluralName
								positiveReactions
								primaryReactionType
								shortContentTemplate
								singleChoiceReactions
								allowedReactions
								customReactions {
									__typename
									activeColor
									activeGlyphId
									activeName
									color
									glyphId
									key
									name
								}
								slug
								titleTemplate
								updatedAt
								mappings {
									key
									field
									type
									title
									description
									required
									isMainContent
									isSearchable
									default
								}
							}
							canReact
						}
						owner {
							__typename
							member {
								displayName
								name
								id
								locale
								profilePictureId
								bannerId
								status
								username
								email
								emailStatus
								newEmail
								tagline
								lastSeenAt
								createdAt
								updatedAt
								relativeUrl
								url
								externalId
								roleId
								flagged
								teammate
								staffReasons
								profilePicture {
									... on Image {
										__typename
										id
										url
										width
										height
										dominantColorHex
										dpi
										cropHeight
										cropWidth
										cropX
										cropY
										cropZoom
										urls {
											__typename
											full
											large
											medium
											small
											thumb
										}
									}
									... on Emoji {
										__typename
										id
										text
									}
									... on Glyph {
										__typename
										id
										text
										variant
									}
									... on File {
										id
										name
										url
									}
								}
								badges {
									backgroundColor
									badgeId
									imageId
									longDescription
									text
									shortDescription
									textColor
									type
									badge {
										active
										backgroundColor
										daysUntilExpired
										id
										imageId
										longDescription
										name
										shortDescription
										textColor
										text
										type
										settings {
											key
											value
										}
										image {
											... on Image {
												__typename
												id
												url
												width
												height
												dominantColorHex
												dpi
												cropHeight
												cropWidth
												cropX
												cropY
												cropZoom
												urls {
													__typename
													full
													large
													medium
													small
													thumb
												}
											}
											... on Emoji {
												__typename
												id
												text
											}
											... on Glyph {
												__typename
												id
												text
												variant
											}
											... on File {
												id
												name
												url
											}
										}
									}
								}
							}
						}
						embeds {
							author
							author_url
							description
							html
							id
							provider_name
							thumbnail_height
							thumbnail_url
							thumbnail_width
							title
							type
							url
						}
						mentions {
							displayName
							name
							id
							locale
							profilePictureId
							bannerId
							status
							username
							email
							emailStatus
							newEmail
							tagline
							lastSeenAt
							createdAt
							updatedAt
							relativeUrl
							url
							externalId
							roleId
							flagged
							teammate
							staffReasons
						}
						reactions {
							count
							reacted
							reaction
							participants(limit: 10) {
								nodes {
									participant {
										id
										name
									}
								}
							}
						}
					}
					pageInfo {
						endCursor
						hasNextPage
					}
					totalCount
				}
				repliedTos {
					id
					slug
					mappingFields {
						key
						type
						value
					}
					fields {
						key
						value
						relationEntities {
							__typename
							medias {
								__typename
								... on Emoji {
									__typename
									id
									text
								}
								... on File {
									__typename
									downloadUrl
									extension
									id
									name
									size
									status
									url
								}
								... on Image {
									__typename
									cropHeight
									cropWidth
									cropX
									cropY
									cropZoom
									dominantColorHex
									downloadUrl
									dpi
									height
									id
									name
									status
									url
									urls {
										__typename
										full
										large
										medium
										small
										thumb
									}
									width
								}
							}
							members {
								__typename
								bannerId
								blockedMemberIds
								createdAt
								displayName
								email
								emailStatus
								externalId
								externalUrl
								flagged
								id
								lastSeen
								lastSeenAt
								locale
								name
								networkId
								newEmail
								overrideTeammate
								profilePicture {
									__typename
									... on Image {
										__typename
										cropHeight
										cropWidth
										cropX
										cropY
										cropZoom
										dominantColorHex
										downloadUrl
										dpi
										height
										id
										name
										status
										url
										urls {
											__typename
											full
											large
											medium
											small
											thumb
										}
										width
									}
								}
								profilePictureId
								relativeUrl
								roleId
								score
								staffReasons
								status
								subscribersCount
								tagline
								teammate
								timeZone
								updatedAt
								url
								username
								verifiedAt
							}
							posts {
								__typename
								allowedEmojis
								allowedReactions
								attachmentIds
								createdAt
								createdById
								description
								embedIds
								externalId
								externalUrl
								followersCount
								forbiddenEmojis
								forbiddenReactions
								hasMoreContent
								id
								imageIds
								isAnonymous
								isHidden
								language
								lastActivityAt
								locked
								mentionedMembers
								negativeReactions
								negativeReactionsCount
								networkId
								ownerId
								pinnedInto
								positiveReactions
								positiveReactionsCount
								postTypeId
								primaryReactionType
								publishedAt
								reactionsCount
								relativeUrl
								repliedToId
								repliedToIds
								repliesCount
								shortContent
								singleChoiceReactions
								slug
								spaceId
								status
								subscribersCount
								tagIds
								textContent
								thumbnailId
								title
								topicIds
								totalRepliesCount
								updatedAt
								url
							}
							spaces {
								__typename
								bannerId
								createdAt
								createdById
								customOrderingIndexInGroup
								description
								externalId
								externalUrl
								groupId
								hidden
								highlightedTagIds
								id
								image {
									__typename
									... on Emoji {
										__typename
										id
										text
									}
									... on Image {
										__typename
										cropHeight
										cropWidth
										cropX
										cropY
										cropZoom
										dominantColorHex
										downloadUrl
										dpi
										height
										id
										name
										status
										url
										urls {
											__typename
											full
											large
											medium
											small
											thumb
										}
										width
									}
								}
								imageId
								inviteOnly
								isHomepage
								isNewUserHomepage
								isReturningUserHomepage
								key
								layout
								membersCount
								name
								networkId
								nonAdminsCanInvite
								postsCount
								private
								relativeUrl
								slug
								subscribersCount
								type
								updatedAt
								url
								whoCanPost
								whoCanReact
								whoCanReply
							}
							tags {
								__typename
								description
								id
								slug
								spaceId
								title
							}
						}
					}
					subscribersCount
					postTypeId
					reactionsCount
					hasMoreContent
					isAnonymous
					isHidden
					shortContent
					createdAt
					publishedAt
					ownerId
					createdById
					status
					spaceId
					imageIds
					pinnedInto
					repliesCount
					totalRepliesCount
					locked
					repliedToIds
					repliedToId
					title
					description
					thumbnail {
						... on Image {
							__typename
							id
							url
							width
							height
							dominantColorHex
							dpi
							cropHeight
							cropWidth
							cropX
							cropY
							cropZoom
							urls {
								__typename
								full
								large
								medium
								small
								thumb
							}
						}
						... on Emoji {
							__typename
							id
							text
						}
						... on Glyph {
							__typename
							id
							text
							variant
						}
						... on File {
							id
							name
							url
						}
					}
					embedIds
					mentionedMembers
					primaryReactionType
					lastActivityAt
					language
					customSeoDetail {
						description
						noIndex
						thumbnail {
							... on Image {
								__typename
								id
								url
								width
								height
								dominantColorHex
								dpi
								cropHeight
								cropWidth
								cropX
								cropY
								cropZoom
								urls {
									__typename
									full
									large
									medium
									small
									thumb
								}
							}
							... on Emoji {
								__typename
								id
								text
							}
							... on Glyph {
								__typename
								id
								text
								variant
							}
							... on File {
								id
								name
								url
							}
						}
						thumbnailId
						title
						canonicalUrl
					}
					relativeUrl
					url
					owner {
						__typename
						member {
							displayName
							name
							id
							locale
							profilePictureId
							bannerId
							status
							username
							email
							emailStatus
							newEmail
							tagline
							lastSeenAt
							createdAt
							updatedAt
							relativeUrl
							url
							externalId
							roleId
							flagged
							teammate
							staffReasons
						}
						role {
							id
							name
							type
							description
						}
						space {
							id
							networkId
							name
							description
							slug
							type
							layout
							isHomepage
							address {
								path
								exact
								editable
							}
							createdById
							groupId
							imageId
							bannerId
							membersCount
							createdAt
							updatedAt
							private
							hidden
							inviteOnly
							nonAdminsCanInvite
							customOrderingIndexInGroup
							whoCanPost
							whoCanReact
							whoCanReply
							customSeoDetail {
								description
								noIndex
								thumbnail {
									... on Image {
										__typename
										id
										url
										width
										height
										dominantColorHex
										dpi
										cropHeight
										cropWidth
										cropX
										cropY
										cropZoom
										urls {
											__typename
											full
											large
											medium
											small
											thumb
										}
									}
									... on Emoji {
										__typename
										id
										text
									}
									... on Glyph {
										__typename
										id
										text
										variant
									}
									... on File {
										id
										name
										url
									}
								}
								thumbnailId
								title
							}
							relativeUrl
							url
						}
					}
				}
				pinnedReplies {
					id
					slug
					mappingFields {
						key
						type
						value
					}
					fields {
						key
						value
						relationEntities {
							__typename
							medias {
								__typename
								... on Emoji {
									__typename
									id
									text
								}
								... on File {
									__typename
									downloadUrl
									extension
									id
									name
									size
									status
									url
								}
								... on Image {
									__typename
									cropHeight
									cropWidth
									cropX
									cropY
									cropZoom
									dominantColorHex
									downloadUrl
									dpi
									height
									id
									name
									status
									url
									urls {
										__typename
										full
										large
										medium
										small
										thumb
									}
									width
								}
							}
							members {
								__typename
								bannerId
								blockedMemberIds
								createdAt
								displayName
								email
								emailStatus
								externalId
								externalUrl
								flagged
								id
								lastSeen
								lastSeenAt
								locale
								name
								networkId
								newEmail
								overrideTeammate
								profilePicture {
									__typename
									... on Image {
										__typename
										cropHeight
										cropWidth
										cropX
										cropY
										cropZoom
										dominantColorHex
										downloadUrl
										dpi
										height
										id
										name
										status
										url
										urls {
											__typename
											full
											large
											medium
											small
											thumb
										}
										width
									}
								}
								profilePictureId
								relativeUrl
								roleId
								score
								staffReasons
								status
								subscribersCount
								tagline
								teammate
								timeZone
								updatedAt
								url
								username
								verifiedAt
							}
							posts {
								__typename
								allowedEmojis
								allowedReactions
								attachmentIds
								createdAt
								createdById
								description
								embedIds
								externalId
								externalUrl
								followersCount
								forbiddenEmojis
								forbiddenReactions
								hasMoreContent
								id
								imageIds
								isAnonymous
								isHidden
								language
								lastActivityAt
								locked
								mentionedMembers
								negativeReactions
								negativeReactionsCount
								networkId
								ownerId
								pinnedInto
								positiveReactions
								positiveReactionsCount
								postTypeId
								primaryReactionType
								publishedAt
								reactionsCount
								relativeUrl
								repliedToId
								repliedToIds
								repliesCount
								shortContent
								singleChoiceReactions
								slug
								spaceId
								status
								subscribersCount
								tagIds
								textContent
								thumbnailId
								title
								topicIds
								totalRepliesCount
								updatedAt
								url
							}
							spaces {
								__typename
								bannerId
								createdAt
								createdById
								customOrderingIndexInGroup
								description
								externalId
								externalUrl
								groupId
								hidden
								highlightedTagIds
								id
								image {
									__typename
									... on Emoji {
										__typename
										id
										text
									}
									... on Image {
										__typename
										cropHeight
										cropWidth
										cropX
										cropY
										cropZoom
										dominantColorHex
										downloadUrl
										dpi
										height
										id
										name
										status
										url
										urls {
											__typename
											full
											large
											medium
											small
											thumb
										}
										width
									}
								}
								imageId
								inviteOnly
								isHomepage
								isNewUserHomepage
								isReturningUserHomepage
								key
								layout
								membersCount
								name
								networkId
								nonAdminsCanInvite
								postsCount
								private
								relativeUrl
								slug
								subscribersCount
								type
								updatedAt
								url
								whoCanPost
								whoCanReact
								whoCanReply
							}
							tags {
								__typename
								description
								id
								slug
								spaceId
								title
							}
						}
					}
					subscribersCount
					postTypeId
					reactionsCount
					hasMoreContent
					isAnonymous
					isHidden
					shortContent
					createdAt
					publishedAt
					ownerId
					createdById
					status
					spaceId
					imageIds
					pinnedInto
					repliesCount
					totalRepliesCount
					locked
					repliedToIds
					repliedToId
					title
					description
					thumbnail {
						... on Image {
							__typename
							id
							url
							width
							height
							dominantColorHex
							dpi
							cropHeight
							cropWidth
							cropX
							cropY
							cropZoom
							urls {
								__typename
								full
								large
								medium
								small
								thumb
							}
						}
						... on Emoji {
							__typename
							id
							text
						}
						... on Glyph {
							__typename
							id
							text
							variant
						}
						... on File {
							id
							name
							url
						}
					}
					embedIds
					mentionedMembers
					primaryReactionType
					lastActivityAt
					language
					customSeoDetail {
						description
						noIndex
						thumbnail {
							... on Image {
								__typename
								id
								url
								width
								height
								dominantColorHex
								dpi
								cropHeight
								cropWidth
								cropX
								cropY
								cropZoom
								urls {
									__typename
									full
									large
									medium
									small
									thumb
								}
							}
							... on Emoji {
								__typename
								id
								text
							}
							... on Glyph {
								__typename
								id
								text
								variant
							}
							... on File {
								id
								name
								url
							}
						}
						thumbnailId
						title
						canonicalUrl
					}
					relativeUrl
					url
					attachments {
						extension
						id
						name
						size
						url
						downloadUrl
					}
					owner {
						__typename
						member {
							displayName
							name
							id
							locale
							profilePictureId
							bannerId
							status
							username
							email
							emailStatus
							newEmail
							tagline
							lastSeenAt
							createdAt
							updatedAt
							relativeUrl
							url
							externalId
							roleId
							flagged
							teammate
							staffReasons
							profilePicture {
								... on Image {
									__typename
									id
									url
									width
									height
									dominantColorHex
									dpi
									cropHeight
									cropWidth
									cropX
									cropY
									cropZoom
									urls {
										__typename
										full
										large
										medium
										small
										thumb
									}
								}
								... on Emoji {
									__typename
									id
									text
								}
								... on Glyph {
									__typename
									id
									text
									variant
								}
								... on File {
									id
									name
									url
								}
							}
							badges {
								backgroundColor
								badgeId
								imageId
								longDescription
								text
								shortDescription
								textColor
								type
								badge {
									active
									backgroundColor
									daysUntilExpired
									id
									imageId
									longDescription
									name
									shortDescription
									textColor
									text
									type
									settings {
										key
										value
									}
									image {
										... on Image {
											__typename
											id
											url
											width
											height
											dominantColorHex
											dpi
											cropHeight
											cropWidth
											cropX
											cropY
											cropZoom
											urls {
												__typename
												full
												large
												medium
												small
												thumb
											}
										}
										... on Emoji {
											__typename
											id
											text
										}
										... on Glyph {
											__typename
											id
											text
											variant
										}
										... on File {
											id
											name
											url
										}
									}
								}
							}
						}
					}
					embeds {
						author
						author_url
						description
						html
						id
						provider_name
						thumbnail_height
						thumbnail_url
						thumbnail_width
						title
						type
						url
					}
					mentions {
						displayName
						name
						id
						locale
						profilePictureId
						bannerId
						status
						username
						email
						emailStatus
						newEmail
						tagline
						lastSeenAt
						createdAt
						updatedAt
						relativeUrl
						url
						externalId
						roleId
						flagged
						teammate
						staffReasons
					}
				}
			}
		}`;

		const variables = {
			postId: idPost,
			'input': {
				'postTypeId': 'fu1HHZaXZzs82C5',
				'mappingFields': [
					{
						'key': 'content',
						'type': 'html',
						'value': `"${ content }"`,
					},
				],
				'publish': true,
			},
		};

		try {
			const response = await this.makeRequest(query, variables);

			if(response.data?.createReply) {
				return response.data.createReply.status;
			} else {
				console.error('Error: No create reply data received: ' + response.errors);
				return null;
			}

		} catch(error) {
			console.error('Error occurred while creating reply:', error.message);
			return null;
		}
	}

	/**
	 * Retrieves a list of members from the BetterMode API.
	 *
	 * @param {Object} [options={}] - The options for querying members.
	 * @param {string} [options.after] - The cursor for fetching the next page of results.
	 * @param {string} [options.before] - The cursor for fetching the previous page of results.
	 * @param {Array<Object>} [options.filterBy] - The filters to apply to the member list.
	 * @param {number} [options.limit=10] - The number of members to retrieve. Default is 10.
	 * @param {number} [options.offset] - The offset for pagination.
	 * @param {string} [options.orderBy] - The field to order the results by.
	 * @param {string} [options.query] - The search query to filter members.
	 * @param {boolean} [options.reverse] - Whether to reverse the order of the results.
	 * @param {Array<string>} [options.roleIds] - The role IDs to filter members by.
	 * @param {Array<Object>} [options.status] - The status filters to apply to the member list.
	 * @returns {Promise<Object|null>} - The list of members or null if an error occurred.
	 */
	async getMembers(options = {}) {
		const query = `query Members(
				$after: String,
				$before: String,
				$filterBy: [MemberListFilterByInput!],
				$limit: Int!,
				$offset: Int,
				$orderBy: String,
				$query: String,
				$reverse: Boolean,
				$roleIds: [ID!],
				$status: [MemberStatusInput!]
			) {
				members(
					after: $after,
					before: $before,
					filterBy: $filterBy,
					limit: $limit,
					offset: $offset,
					orderBy: $orderBy,
					query: $query,
					reverse: $reverse,
					roleIds: $roleIds,
					status: $status
				) {
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
			...options,
		};

		try {

			const response = await this.makeRequest(query, variables);

			if(response.data?.members) {
				return response.data.members;
			} else {
				console.error('Error: No member data received.');
				return null;
			}
		} catch(error) {
			console.error('Error occurred while fetching members:', error.message);
			return null;
		}
	}

	/**
	 * Adds a reaction to a post.
	 *
	 * @param {string} idPost - The ID of the post to add the reaction to.
	 * @param {string} [type='+1'] - The type of reaction to add. Default is '+1'.
	 * @returns {Promise<string|null>} - The status of the reaction addition or null if an error occurred.
	 */
	async addReaction(idPost, type = '+1') {

		const query = `mutation addReaction($input: AddReactionInput!, $postId: ID!) {
			addReaction(input: $input, postId: $postId) {
				status
			}
		}`;

		const variables = {
			postId: idPost,
			'input': {
				'reaction': type,
				'overrideSingleChoiceReactions': true,
			},
		};

		try {
			const response = await this.makeRequest(query, variables);

			if(response.data?.addReaction) {
				return response.data.addReaction.status;
			} else {
				console.error('Error: No add reaction data received: ' + response.errors);
				return null;
			}

		} catch(error) {
			console.error('Error occurred while adding reaction:', error.message);
			return null;
		}
	}

	/**
	 * Removes a reaction from a post.
	 *
	 * @param {string} idPost - The ID of the post to remove the reaction from.
	 * @param {string} [type='+1'] - The type of reaction to remove. Default is '+1'.
	 * @returns {Promise<string|null>} - The status of the reaction removal or null if an error occurred.
	 */
	async removeReaction(idPost, type = '+1') {

		const query = `mutation removeReaction($reaction: String!, $postId: ID!) {
			removeReaction(reaction: $reaction, postId: $postId) {
				status
			}
		}`;

		const variables = {
			postId: idPost,
			reaction: type,
		};

		try {
			const response = await this.makeRequest(query, variables);

			if(response.data?.removeReaction) {
				return response.data.removeReaction.status;
			} else {
				console.error('Error: No remove reaction data received: ' + response.errors);
				return null;
			}

		} catch(error) {
			console.error('Error occurred while removing reaction:', error.message);
			return null;
		}
	}

	/**
	 * Subscribes to a publisher in the BetterMode API.
	 *
	 * @param {string} idPublisher - The ID of the publisher to subscribe to.
	 * @returns {Promise<string|null>} - The status of the subscription or null if an error occurred.
	 */
	async subscribe(idPublisher) {

		const query = `mutation subscribe($publisherId: String!) {
			subscribe(publisherId: $publisherId) {
				__typename
				status
			}
		}`;

		const variables = { publisherId: idPublisher };

		try {
			const response = await this.makeRequest(query, variables);

			if(response.data?.subscribe) {
				return response.data.subscribe.status;
			} else {
				console.error('Error: No subscribe data received: ' + response.errors);
				return null;
			}

		} catch(error) {
			console.error('Error occurred while subscribing:', error.message);
			return null;
		}
	}

	/**
	 * Unsubscribes from a publisher in the BetterMode API.
	 *
	 * @param {string} idPublisher - The ID of the publisher to unsubscribe from.
	 * @returns {Promise<string|null>} - The status of the unsubscription or null if an error occurred.
	 */
	async unsubscribe(idPublisher) {

		const query = `mutation unsubscribe($publisherId: String!) {
			unsubscribe(publisherId: $publisherId) {
				__typename
				status
			}
		}`;

		const variables = { publisherId: idPublisher };

		try {
			const response = await this.makeRequest(query, variables);

			if(response.data?.unsubscribe) {
				return response.data.unsubscribe.status;
			} else {
				console.error('Error: No unsubscribe data received: ' + response.errors);
				return null;
			}

		} catch(error) {
			console.error('Error occurred while unsubscribing:', error.message);
			return null;
		}
	}
}
