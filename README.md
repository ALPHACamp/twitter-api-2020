# Simple Twitter API

A RESTFUL API server for [Simple Twitter](https://pooppicker.github.io/simple-twitter-vue/#/twitter/Setting) build with Node.js, Express & MySQL.

Testing accounts
```
Admin
account: root@example.com
password: 12345678

User 
account: User1
password: 12345678
```
## Live demo URL 
https://pooppicker.github.io/simple-twitter-vue/#/twitter/Home

## Base URL 
```
https://twitter-apis-demo.herokuapp.com/api
```

## API Guidelines

### **Users API**


#### Sign In 
[**POST /users/signin**](https://twitter-apis-demo.herokuapp.com/api/users/signin)

#### Sign Up 
[**POST /users**](https://twitter-apis-demo.herokuapp.com/api/users)

#### Current User
[**GET /users/currentuser**](https://twitter-apis-demo.herokuapp.com/api/users/currentuser)

#### Individual User (Except Admin)
[**GET /users/:userId**](https://twitter-apis-demo.herokuapp.com/api/users/:userId)

#### Edit user profile ( Only who in used ) 
[**PUT users/:userId**](https://twitter-apis-demo.herokuapp.com/api/users/:userId)

#### User tweets 
[**GET users/:userId/tweets**](https://twitter-apis-demo.herokuapp.com/api/users/:userId/tweets)

#### User replied_tweets
[**GET users/:userId/tweets**](https://twitter-apis-demo.herokuapp.com/api/users/:userId/replied_tweets)

#### User liked tweets
[**GET users/:userId/likes**](https://twitter-apis-demo.herokuapp.com/api/users/:userId/likes)

#### User followers
[**GET users/:userId/followers**](https://twitter-apis-demo.herokuapp.com/api/users/:userId/followers)

#### User followings
[**GET users/:userId/followings**](https://twitter-apis-demo.herokuapp.com/api/users/:userId/followings)

### **Tweets API**

#### GET all tweets
[**GET /tweets**](https://twitter-apis-demo.herokuapp.com/api/tweets)

#### Check specific tweets
[**GET /tweets/:tweetId**](https://twitter-apis-demo.herokuapp.com/api/tweets/:tweetId)

#### POST tweets
[**POST /tweets**](https://twitter-apis-demo.herokuapp.com/api/tweets)

#### GET all replies
[**GET /tweets**](https://twitter-apis-demo.herokuapp.com/api/tweets/:tweetId/replies)

#### Add replies
[**POST /tweets**](https://twitter-apis-demo.herokuapp.com/api/tweets/:tweetId/replies)

### **Followings API**

#### Follow user
[**POST /followships**](https://twitter-apis-demo.herokuapp.com/api/followships)

#### unFollow user
[**DELETE /followships**](https://twitter-apis-demo.herokuapp.com/api/followships/:followingId)

### **Admins API**

#### Admin sign in 
[**POST /admin/signin**](https://twitter-apis-demo.herokuapp.com/api/admin/signin)

#### Check all users
[**GET /admin/users**](https://twitter-apis-demo.herokuapp.com/api/admin/users)

#### Check all tweets
[**GET /admin/tweets**](https://twitter-apis-demo.herokuapp.com/api/admin/tweets)

#### Delete tweet (one at a time)
[**DELETE /admin/tweets/:tweetId**](https://twitter-apis-demo.herokuapp.com/api/admin/tweets/:tweetId)

### **Likes API**

#### Like tweet
[**POST /tweets/:tweetId/like**](https://twitter-apis-demo.herokuapp.com/api/tweets/:tweetId/like)

#### unLike tweet
[**POST /tweets/:tweetId/like**](https://twitter-apis-demo.herokuapp.com/api/tweets/:tweetId/unlike)

## Installation Guidelines

Run the the API server by following instructions below.

### Environment setup
- GIT
- Express
- MySQL WorkBench

### Installing

1. Clone into local repo 
```
$ git clone https://github.com/pooppicker/twitter-api-2020.git
```
2. Install project dependencies 
```
$ cd twitter-api-2020
$ npm install
```
3. Add .env file 
```
JWT_SECRET=<your_jwt_secret>
IMGUR_CLIENT_ID=<your_imgur_client_id>
```
4. Enter your MySQL Workbench password in config.json 
```
{
  "development": {
    "username": "root",
    "password": "<your_mysql_workbench_password>",
    "database": "forum",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": "<your_mysql_workbench_password>",
    "database": "forum_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging": false
}
```
5. Create database in MySQL WorkBench

run the following syntax in WorkBench
```drop database if exists ac_twitter_workspace;
create database ac_twitter_workspace;
drop database if exists ac_twitter_workspace_test;
create database ac_twitter_workspace_test;
```
6. Use Sequelize CLI to create tables in database
```
$ npx sequelize db:migrate
$ NODE_ENV=test
$ npx sequelize db:migrate
```
7. Import seed data 
```
$ NODE_ENV=development
$ npx sequelize db:seed:all
```
8. Run test
```
$ npm test
```
9. Start the server & check if the following message shows
```
$ npm run dev
$ Example app listening on port 3000!

```







