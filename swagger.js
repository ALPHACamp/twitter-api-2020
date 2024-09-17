const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' })
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const doc = {
  info: {
    version: '1.0.0', // by default: "1.0.0"
    title: 'Twitter API', // by default: "REST API"
    description: '這是一個夢想的航道！' // by default: ""
  },
  host: process.env.HOST,
  schemes: ['http', 'https'],
  tags: [
    {
      name: 'Admin',
      description: '後台管理者 router'
    },
    {
      name: 'Users',
      description: '使用者 router'
    },
    {
      name: 'Tweets',
      description: '推特 router'
    },
    {
      name: 'Replies',
      description: '回覆 router'
    },
    {
      name: 'Followships',
      description: '追蹤 router'
    }
  ],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      in: 'header', // can be "header", "query" or "cookie"
      name: 'Authorization', // name of the header, query parameter or cookie
      description: 'Please enter a valid token to test the requests below...',
      scheme: 'bearer',
      bearerFormat: 'JWT'
    }
  }
}

const outputFile = './swagger-output.json'
const endpointsFiles = ['./app.js']

swaggerAutogen(outputFile, endpointsFiles, doc)
