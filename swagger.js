const swaggerAutogen = require('swagger-autogen')()

const doc = {
  tags: [ // by default: empty Array
    {
      name: "SignUp/Signin",
      description: "註冊登入 router"
    },
    {
      name: "Users",
      description: "使用者 router"
    },
    {
      name: "Admin",
      description: "後台 router"
    },
    {
      name: "Tweets",
      description: "Tweets router"
    },
    {
      name: "Replies",
      description: "Replies router"
    },
    {
      name: "Likes",
      description: "Likes router"
    },
    {
      name: "Followships",
      description: "追蹤 router"
    },
  ],
}

const outputFile = './swagger_output.json' // 輸出的文件名稱
const endpointsFiles = ['./app.js'] // 要指向的 API，使用 Express 直接指向到 app.js 

swaggerAutogen(outputFile, endpointsFiles, doc) // swaggerAutogen 的方法