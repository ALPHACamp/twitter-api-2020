const option = {
  openapi: '3.0.2'
}
const swaggerAutogen = require('swagger-autogen')(option)

const doc = {
  info: {
    version: '1.0.0',
    title: 'simple twitter REST API',
    description: ''
  },
  externalDocs: {
    description: 'Find out more about simple-tiwtter',
    url: 'https://arcane-wave-79231.herokuapp.com/api-doc'
  },
  servers: [
    {
      url: 'https://arcane-wave-79231.herokuapp.com'
    }
  ],
  tags: [
    {
      name: 'admin'
    },
    {
      name: 'user'
    },
    {
      name: 'followship'
    },
    {
      name: 'like'
    },
    {
      name: 'reply'
    },
    {
      name: 'tweet'
    }
  ],
  components: {
    schemas: {
      user: {
        id: 15,
        account: 'user2',
        name: 'user2',
        email: 'user2@example.com',
        avatar: 'https://loremflickr.com/320/240/cat/?lock=75.13205674938455',
        TweetsCount: 10,
        LikesCount: 1,
        FollowingCount: 2,
        FollowerCount: 1
      }
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ]
}

const outputFile = './swagger_output.json'
const endpointsFiles = ['./app.js']

swaggerAutogen(outputFile, endpointsFiles, doc)
