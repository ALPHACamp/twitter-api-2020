const swaggerAutogen = require('swagger-autogen')()
const outputFile = './swagger_output.json' // 輸出的文件名稱
const endpointsFiles = ['./app.js'] // 要指向的 API，使用 Express 直接指向到 app.js

const doc = {
  info: {
    version: '1.0.0',
    title: 'Simple Twitter API',
    description: 'This API document is for <b>Simple Twitter</b> project. '
  },
  host: 'localhost:3000',
  basePath: '/',
  schemes: [
    'http'
  ],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [ // by default: empty Array
    {
      name: 'SignUp/Signin',
      description: 'Sign up and sign in related.'
    },
    {
      name: 'Users',
      description: 'Users related.'
    },
    {
      name: 'Admin',
      description: 'Admin related.'
    },
    {
      name: 'Tweets',
      description: 'Tweets related.'
    },
    {
      name: 'Replies',
      description: 'Replies related.'
    },
    {
      name: 'Likes',
      description: 'Likes related.'
    },
    {
      name: 'Followships',
      description: 'Followships related.'
    }
  ],

  securityDefinitions: {
    BearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header'
    }
  }
}

swaggerAutogen(outputFile, endpointsFiles, doc) // swaggerAutogen 的方法
