# Simple Twitter API
This API is provided for [front-end](https://github.com/billychen0894/simple-twitter-frontend) and it built on Express.js framework in Node.js and MySQL database for Simple Twitter.

## API Document
More details of API, please refer this [API document](https://www.notion.so/Twitter-api-ca2197fe75704460a49c5b1fc82a172b) created through postman.

## Built with
- Node.js
- Express
- mysql2
- Sequelize
- Passport(Local & JWT)
- bcryptjs
- jsonwebtoken


## Getting Start
- [Installation](###Installation)
- [Environment Setup](###Environment-Setup)
- [Test](###Test)
- [Usage](###Usage)
### Installation
1. Clone this project to local
```
$ git clone https://github.com/wenliangsu/twitter-api-2023.git
```
2. Install all dependencies in project file
```
$ npm install
```
 
### Environment Setup
1. Setting database for development and test. Database name need to be same with config/config.json
```
DROP DATABASE IF EXISTS ac_twitter_workspace; 
CREATE DATABASE ac_twitter_workspace;
DROP DATABASE IF EXISTS ac_twitter_workspace_test; 
CREATE DATABASE ac_twitter_workspace_test;
```
2. Create Table through migration files in test and development environment separately
```
$ export NODE_ENV=test｀
$ npx sequelize db:migrate
```
```
$ export NODE_ENV=development
$ npx sequelize db:migrate
```
3. Create a `.env` file and refer `.env.example` to set environment varaible
```
IMGUR_CLIENT_ID = Your Client ID
IMGUR_CLIENT_SECRET = Your Client SECRET
IMGUR_REFRESH_TOKEN = Your Refresh Token

JWT_SECRET = Your JWTSecret
PORT = Your Port
```

### Test
To make sure all features are working properly, run the following command. If there is any test errors, make sure you setup as above.
```
$ export NODE_ENV=test
$ npm run test
```

### Usage
1. Create seed data through seed files before server start.
```
$ export NODE_ENV=development
$ npx sequelize db:seed:all
```
2. Start server. If successful, `Example app listening on port 3000!` will show in terminal
```
$ npm run start
```
3. If you have install `nodemon`, you could run the followin command
```
$ npm run dev
```
4. If you want to stop server running.
```
Ctrl + C
```

## Contributor
- [Wen](https://github.com/wenliangsu)
- [Isis Lin](https://github.com/qweb321)
