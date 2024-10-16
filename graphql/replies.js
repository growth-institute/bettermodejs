const CREATE_REPLY = `
mutation createReply($postId: ID!, $input: CreatePostInput!) {
  createReply(postId: $postId, input: $input) {
    id
    status
  }
}`


export { CREATE_REPLY };
