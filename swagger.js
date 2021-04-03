const swaggerAutogen = require('swagger-autogen')()

const doc = {
  info: {
    version: '2.1.0',
    title: 'Twitter REST API'
  },
  definitions: {
    User: {
      id: 2,
      account: 'user1',
      email: 'user1@example.com',
      name: 'user1',
      avatar: 'http://placeimg.com/640/480/people',
      introduction: 'I am Jackson',
      role: 'user',
      cover: 'http://placeimg.com/640/480/nature',
      createdAt: '2021-03-02T02:18:21.000Z',
      updatedAt: '2021-03-02T02:18:21.000Z'
    },
    UserIsSelf: {
      id: 2,
      account: 'user1',
      email: 'user1@example.com',
      name: 'user1',
      avatar: 'http://placeimg.com/640/480/people',
      introduction: 'I am Jackson',
      role: 'user',
      cover: 'http://placeimg.com/640/480/nature',
      createdAt: '2021-03-02T02:18:21.000Z',
      updatedAt: '2021-03-02T02:18:21.000Z',
      isSelf: true,
      isFollowed: false
    },
    FollowshipUser: {
      id: 1,
      account: 'root',
      email: 'root@example.com',
      name: 'root',
      avatar: 'http://placeimg.com/640/480/people',
      introduction: 'I am Jackson',
      role: 'admin',
      cover: 'http://placeimg.com/640/480/nature',
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
      avatar: 'http://placeimg.com/640/480/people',
      introduction: 'I am Johnny',
      role: 'user',
      cover: 'http://placeimg.com/640/480/nature',
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
      isLikedbyMe: false,
      isMyTweet: true
    },
    RepliedTweet: {
      id: 1,
      UserId: 2,
      TweetId: 1,
      comment: 'Reply 1',
      createdAt: '2021-03-02T02:18:21.000Z',
      updatedAt: '2021-03-02T02:18:21.000Z',
      User: { $ref: '#/definitions/User' },
      Tweet: { $ref: '#/definitions/Tweet' }
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
    LikedTweet: {
      id: 2,
      UserId: 2,
      TweetId: 1,
      createdAt: '2021-03-02T12:55:19.000Z',
      updatedAt: '2021-03-02T12:55:19.000Z',
      User: { $ref: '#/definitions/User' },
      Tweet: { $ref: '#/definitions/Tweet' }
    },
    Like: {
      id: 2,
      UserId: 2,
      TweetId: 1,
      createdAt: '2021-03-02T12:55:19.000Z',
      updatedAt: '2021-03-02T12:55:19.000Z'
    },
    Following: {
      followerId: 11,
      followingId: 21,
      createdAt: '2021-03-05T04:26:13.000Z',
      updatedAt: '2021-03-05T04:26:13.000Z',
      following: {
        id: 21,
        account: 'user2',
        email: 'user2@example.com',
        name: 'Johnny2',
        avatar: 'http://placeimg.com/640/480/people',
        introduction: 'I am Johnny2',
        role: 'user',
        cover: 'http://placeimg.com/640/480/nature',
        createdAt: '2021-03-05T04:26:13.000Z',
        updatedAt: '2021-03-05T04:26:13.000Z'
      },
      isFollowed: true,
      isSelf: false
    },
    Follower: {
      followerId: 21,
      followingId: 11,
      createdAt: '2021-03-05T04:26:13.000Z',
      updatedAt: '2021-03-05T04:26:13.000Z',
      follower: {
        id: 21,
        account: 'user2',
        email: 'user2@example.com',
        name: 'Johnny2',
        avatar: 'http://placeimg.com/640/480/people',
        introduction: 'I am Johnny2',
        role: 'user',
        cover: 'http://placeimg.com/640/480/nature',
        createdAt: '2021-03-05T04:26:13.000Z',
        updatedAt: '2021-03-05T04:26:13.000Z'
      },
      isFollowed: true,
      isSelf: false
    },
    TopUser: {
      id: 41,
      account: 'user4',
      email: 'user4@example.com',
      password: '$2a$10$P/pvqRxhgVuoIC6fG2yHOunYnFnkhBOIR6kdi1LWhLM96kF9/rtHK',
      name: 'Johnny4',
      avatar: 'http://placeimg.com/640/480/people',
      introduction: 'I am Johnny4',
      role: 'user',
      cover: 'http://placeimg.com/640/480/nature',
      createdAt: '2021-03-05T04:26:13.000Z',
      updatedAt: '2021-03-05T04:26:13.000Z',
      Followers: [],
      followerCount: 5,
      isFollowed: false
    },
    SuccessMessage: { status: 'success', message: 'Success' }
  }
}

const outputFile = './swagger_output.json'
const endpointsFiles = ['./app.js']

swaggerAutogen(outputFile, endpointsFiles, doc)
