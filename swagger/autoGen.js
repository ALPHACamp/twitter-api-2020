// 這檔案會生成新的 swagger json
const swaggerAutogen = require('swagger-autogen')()

// 改變檔案名稱，這樣不會意外洗掉原始檔
const outputFile = '../swagger/swagger_output2.json'
const endpointsFiles = ['../app.js'] // Path to your main Express app file

swaggerAutogen(outputFile, endpointsFiles)
