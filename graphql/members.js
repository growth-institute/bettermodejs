const GET_MEMBERS = `query Members($after: String, $before: String, $filterBy: [MemberListFilterByInput!], $limit: Int!, $offset: Int, $orderBy: String, $query: String, $reverse: Boolean, $roleIds: [ID!], $status: [MemberStatusInput!]) {
  members(
    after: $after
    before: $before
    filterBy: $filterBy
    limit: $limit
    offset: $offset
    orderBy: $orderBy
    query: $query
    reverse: $reverse
    roleIds: $roleIds
    status: $status
  ) {
    totalCount
    edges {
      node {
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
        role {
          id
          name
          type
          description
          visible
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
        authMemberProps {
          context
          scopes
          canSendPrivateMessages
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
        }
        fields {
          key
          value
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}`;

const GET_FEED = `query getFeed($after: String, $before: String, $filterBy: [PostListFilterByInput!], $limit: Int!, $offset: Int, $onlyMemberSpaces: Boolean, $orderBy: PostListOrderByEnum, $postTypeIds: [String!], $reverse: Boolean) {
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
			    nodes {
			      id
			      createdAt
			      slug
			      updatedAt
			      repliesCount
			      totalRepliesCount
			      reactionsCount
			      authMemberProps{
			        subscribed
			      }
			      space {
			        name
			      }
			      fields {
			        key
			        value
			      }
			      reactions {
			        participants(limit: 10) {
			          nodes {
			            participant {
			              id
			            }
			          }
			        }
			      }
			      owner {
			        member {
			          name
			          externalId
			          id
			          profilePicture {
			            ...on Image {
			              urls {
			                thumb
			              }
			            }
			          }
			        }
			      }
			      createdBy {
			        member {
			          name
			          externalId
			          id
			          profilePicture {
			            ...on Image {
			              urls {
			                thumb
			              }
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
			}`;

const GET_LIMITED_TOKEN = `query limitedToken(
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
export {GET_MEMBERS, GET_FEED, GET_LIMITED_TOKEN};
