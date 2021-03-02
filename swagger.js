const swaggerAutogen = require('swagger-autogen')()

const doc = {
  info: {
    version: '1.0.0',
    title: 'Twitter REST API'
  },
  definitions: {
    AdminUser: {
      id: 1,
      account: 'root',
      email: 'root@example.com',
      password: '$2a$10$2KimfHLZKIso1yqP4ZzkfekhC4zAoz8neTfsPEcJVk2Op87rj5sC2',
      name: 'root',
      avatar: 'null',
      introduction: 'I am Jackson',
      role: 'admin',
      cover: 'null',
      createdAt: '2021-03-02T02:18:21.000Z',
      updatedAt: '2021-03-02T02:18:21.000Z'
    },
    GeneralUser: {
      id: 2,
      account: 'user1',
      email: 'user1@example.com',
      password: '$2a$10$2KimfHLZKIso1yqP4ZzkfekhC4zAoz8neTfsPEcJVk2Op87rj5sC2',
      name: 'user1',
      avatar: 'null',
      introduction: 'I am Johnny',
      role: 'user',
      cover: 'null',
      createdAt: '2021-03-02T02:18:21.000Z',
      updatedAt: '2021-03-02T02:18:21.000Z'
    },
    Tweet: {
      id: 1,
      UserId: 11,
      description: 'Johnny1 is a handsome guy.',
      createdAt: '2021-03-02T02:18:21.000Z',
      updatedAt: '2021-03-02T02:18:21.000Z',
      Replies: [{ $ref: '#/definitions/Reply' }],
      Likes: [{ $ref: '#/definitions/Like' }]
    },
    Reply: {
      id: 1,
      UserId: 11,
      TweetId: 1,
      comment: 'Reply 1',
      createdAt: '2021-03-02T02:18:21.000Z',
      updatedAt: '2021-03-02T02:18:21.000Z'
    },
    Like: {
      id: 2,
      UserId: 52,
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
