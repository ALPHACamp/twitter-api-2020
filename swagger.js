const swaggerAutogen = require('swagger-autogen')()

const doc = {
  info: {
    version: '1.0.0',
    title: 'Twitter REST API'
  },
  definitions: {
    User: {
      id: 2,
      account: 'user1',
      email: 'user1@example.com',
      name: 'user1',
      avatar: 'null',
      introduction: 'I am Jackson',
      role: 'admin',
      cover: 'null',
      createdAt: '2021-03-02T02:18:21.000Z',
      updatedAt: '2021-03-02T02:18:21.000Z'
    },
    FollowshipUser: {
      id: 1,
      account: 'root',
      email: 'root@example.com',
      name: 'root',
      avatar: 'null',
      introduction: 'I am Jackson',
      role: 'admin',
      cover: 'null',
      createdAt: '2021-03-02T02:18:21.000Z',
      updatedAt: '2021-03-02T02:18:21.000Z',
      Followship: {
        followerId: 2,
        followingId: 11,
        createdAt: '2021-03-03T03:14:10.000Z',
        updatedAt: '2021-03-03T03:14:10.000Z'
      }
    },
    GeneralUser: {
      id: 2,
      account: 'user1',
      email: 'user1@example.com',
      name: 'user1',
      avatar: 'null',
      introduction: 'I am Johnny',
      role: 'user',
      cover: 'null',
      createdAt: '2021-03-02T02:18:21.000Z',
      updatedAt: '2021-03-02T02:18:21.000Z',
      Replies: [{ $ref: '#/definitions/Reply' }],
      Likes: [{ $ref: '#/definitions/Like' }],
      Tweets: [{ $ref: '#/definitions/Tweet' }],
      Followers: [],
      Followings: [{ $ref: '#/definitions/FollowshipUser' }]
    },
    Tweet: {
      id: 1,
      UserId: 2,
      description: 'Johnny1 is a handsome guy.',
      createdAt: '2021-03-02T02:18:21.000Z',
      updatedAt: '2021-03-02T02:18:21.000Z',
      Replies: [{ $ref: '#/definitions/Reply' }],
      Likes: [{ $ref: '#/definitions/Like' }],
      User: { $ref: '#/definitions/User' },
      isLikedbyMe: false
    },
    Reply: {
      id: 1,
      UserId: 2,
      TweetId: 1,
      comment: 'Reply 1',
      createdAt: '2021-03-02T02:18:21.000Z',
      updatedAt: '2021-03-02T02:18:21.000Z',
      User: { $ref: '#/definitions/User' }
    },
    Like: {
      id: 2,
      UserId: 2,
      TweetId: 1,
      createdAt: '2021-03-02T12:55:19.000Z',
      updatedAt: '2021-03-02T12:55:19.000Z'
    },
    SuccessMessage: { status: 'success', message: 'Success' }
  }
}

const outputFile = './swagger_output.json'
const endpointsFiles = ['./app.js']

swaggerAutogen(outputFile, endpointsFiles, doc)
