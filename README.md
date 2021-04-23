# Simple Twitter API

A RESTful API server, built with Node.js, Express, and mySQL, for [Simple Twitter](https://github.com/ivyhungtw/simple-twitter) project.

## Base URL

All URLs referenced in the API documentation have the following host and base path:

```
https://simple-twitter-api-2021.herokuapp.com/api
```

## API Guideline

Please refer to [API Docs](https://simple-twitter-api-2021.herokuapp.com/api-docs/) for more details.

#### Admin related

| Method | Path              | description                                                    | req.body | res.json tables |
| ------ | ----------------- | -------------------------------------------------------------- | -------- | --------------- |
| GET    | /admin/users      | 取得站內所有使用者資料及其社群活躍數據，，按推文數從多到少排序 | -------- | users           |
| DELETE | /admin/tweets/:id | 刪除一筆 id 符合的推文                                         | -------- | --------        |

#### User related

| Method | Path                      | description                                                 | req.body                                                                    | res.json tables                     |
| ------ | ------------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------- | ----------------------------------- |
| GET    | /users                    | 取出推薦追蹤的使用者資料，取出 followers 前六名的使用者資料 | -------                                                                     | users, followships                  |
| POST   | /users                    | 使用者註冊帳號                                              | account, name, email, password, checkPassword                               | --------                            |
| POST   | /users/login              | 使用者登入                                                  | account, password                                                           | users                               |
| GET    | /users/:id                | 瀏覽單一 user 資料                                          | --------                                                                    | users, tweets, followships          |
| PUT    | /users/:id                | 編輯自己所有的資料                                          | account, name, email, password, checkPassword, introduction, avatar, banner | --------                            |
| GET    | /users/:id/tweets         | 看見某使用者發過的推文                                      | --------                                                                    | tweets, replies, followships, likes |
| GET    | /users/:id/replied_tweets | 看見某使用者回覆過的推文及回覆                              | --------                                                                    | tweets, replies, likes, users       |
| GET    | /users/:id/likes          | 看見某使用者喜歡過的推文                                    | --------                                                                    | tweets, replies, likes, users       |
| GET    | /users/:id/followings     | 看見某使用者跟隨中的人                                      | --------                                                                    | users, followships                  |
| GET    | /users/:id/followers      | 看見某使用者的跟隨者                                        | --------                                                                    | users, followships                  |

#### Tweet related

| Method | Path              | description                                      | req.body         | res.json tables               |
| ------ | ----------------- | ------------------------------------------------ | ---------------- | ----------------------------- |
| POST   | /tweets           | 建立一筆推文                                     | description(140) | -------                       |
| GET    | /tweets           | 取出全站推文及其關聯資料，按建立日期從新到舊排序 | --------         | tweets, users, replies, likes |
| GET    | /tweets/:tweet_id | 取出一筆推文、推文者資料及按讚數                 | --------         | tweets, users, replies, likes |

#### Followship related

| Method | Path                      | description        | req.body    | res.json tables |
| ------ | ------------------------- | ------------------ | ----------- | --------------- |
| POST   | /followships              | follow 一個 user   | followingId | --------        |
| DELETE | /followships/:followingId | unfollow 一個 user | --------    | --------        |

#### Like related

| Method | Path               | description  | req.body | res.json tables |
| ------ | ------------------ | ------------ | -------- | --------------- |
| POST   | /tweets/:id/like   | 喜歡一則推文 | -------- | --------        |
| POST   | /tweets/:id/unlike | 取消喜歡     | -------- | --------        |

#### Reply related

| Method | Path                      | description            | req.body         | res.json tables |
| ------ | ------------------------- | ---------------------- | ---------------- | --------------- |
| POST   | /tweets/:tweet_id/replies | 新增回覆               | comment (text>0) | --------        |
| GET    | /tweets/:tweet_id/replies | 瀏覽一則推文的所有回覆 | --------         | replies, users  |

## Install Simple Twitter API

Following the instruction, you can run a Simple Twitter API server on your local machine.

#### Prerequisites

- [Git](https://git-scm.com/downloads)
- [Node.js v14.15.1](https://nodejs.org/en/download/)
- [MySQL v8.0.20](https://dev.mysql.com/downloads/mysql/)
- [MySQL Workbench v8.0.20](https://dev.mysql.com/downloads/mysql/)

#### Clone the repository locally

```
$ git clone https://github.com/ivyhungtw/twitter-api-2020.git
```

#### Install project dependencies

```
$ cd twitter-api-2020
$ npm install
```

#### Add .env file

To properly use the app and login feature, make sure you have filled out the following information in .env file.

You can register your own IMGUR client id on [IMGUR](https://api.imgur.com/oauth2/addclient).

```
JWT_SECRET=<your_jwt_secret>
IMGUR_CLIENT_ID=<your_imgur_client_id>
```

#### Enter your MySQL Workbench password in config.json file

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

#### Create database in MySQL

To create database for development and test, run the following syntax in MySQL Workbench.

```
drop database if exists ac_twitter_workspace;
create database ac_twitter_workspace;
drop database if exists ac_twitter_workspace_test;
create database ac_twitter_workspace_test;
```

#### Use Sequelize CLI to create tables in database

```
$ npx sequelize db:migrate
$ NODE_ENV=test
$ npx sequelize db:migrate
```

#### Import seed data

To have default users, tweets, and replies set up in ac_twitter_workspace database, run the following script.

```
$ NODE_ENV=development
$ npx sequelize db:seed:all
```

#### Run test

```
$ NODE_ENV=test
$ npm run test
```

#### Start the server

If you have installed [nodemon](https://www.npmjs.com/package/nodemon), run the following script:

```
$ npm run dev
```

or just run:

```
$ node app.js
```

The server will start running on http://localhost:3000/

## Authors

[Yi-Tzu(Ivy) Hung](https://github.com/ivyhungtw)

[Sherry Liao](https://github.com/sherryliao21)
