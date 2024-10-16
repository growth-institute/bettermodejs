const GET_SPACES = `
query GetSpaces($after: String, $before: String, $collectionId: String, $limit: Int!, $memberId: ID, $offset: Int, $orderBy: SpaceListOrderByEnum, $filterBy: [EntityListFilterByInput!], $query: String, $reverse: Boolean, $type: [SpaceType!]) {
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
}

`

const GET_SPACE = `
query GetSpace($id: ID, $slug: ID, $path: String) {
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
}

`
export {GET_SPACES, GET_SPACE}
