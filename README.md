# Simple Twitter API

A RESTful API server for [Simple Twitter](https://github.com/ivyhungtw/simple-twitter) project built with Node.js, Express framework, and mySQL

## Base URL

All URLs referenced in the API documentation have the following host and base path:

```
https://simple-twitter-api-2021.herokuapp.com/api
```

## API Guideline

Please refer to [API Docs](https://simple-twitter-api-2021.herokuapp.com/api-docs/) for more details. You can also test these APIs with the Swagger UI with the account below.

```
Admin
Account: root
Password: 12345678

User
Account: user1
Password: 12345678
```

#### Admin related

#### `GET /admin/users`

- **Description**

  Get all users data including their social activeness

- **Response**

  - 200: Successfully retrieved an array of user objects

  ```
    [
      {
        "id": 4,
        "name": "user3",
        "avatar": "https://i.imgur.com/q6bwDGO.png",
        "account": "user3",
        "cover": "https://i.imgur.com/1jDf2Me.png",
        "tweetCount": 10,
        "followerCount": 0,
        "followingCount": 1,
        "likeCount": 0
      }
    ]
  ```

  - 401: Access token is missing or invalid

#### `DELETE /admin/tweets/:tweet_id`

- **Description**

  Delete a tweet by specifying its id

- **Parameters**

  - tweet_id: The id of the tweet you want to delete

- **Response**

  - 200: Successfully deleted a tweet

  ```
    {
      "status": "success",
      "message": "delete successfully"
    }
  ```

  - 401: Access token is missing or invalid

#### User related

#### `GET /users`

- **Description**

  Get the data of top 6 users with most followers

- **Response**

  - 200: SRetrieve an array of user objects

  ```
    [
      {
        "id": 2,
        "name": "user1",
        "avatar": "https://i.imgur.com/q6bwDGO.png",
        "account": "user1",
        "isFollowed": true
      }
    ]
  ```

  - 401: Access token is missing or invalid

#### `POST /users`

- **Description**

  Register an account by filling out required fields of personal information

- **Request Body**

  - account
  - name
  - email
  - password
  - checkPassword

  ```
    {
      "account": "user1",
      "name": "user1",
      "email": "user1@example.com",
      "password": "12345678",
      "checkPassword": "12345678"
    }
  ```

- **Response**

  - 200: Registered an account

  ```
    {
      "status": "success",
      "message": "user1 register successfully! Please login."
    }
  ```

  - 401: Access token is missing or invalid

  - 409: A user already exists

  ```
    {
      "status": "error",
      "message": "A user with email 'user7@example.com' already exists. Choose a different account or login directly.",
      "userInput": {
        "email": "user7@example.com",
        "password": "12345678",
        "name": "rrrr",
        "checkPassword": "12345678",
        "account": "user1"
      }
    }
  ```

  - 422: Did not meet field requirements

  ```
    {
      "status": "error",
      "errors": [
        {
          "message": "Please enter the correct email address."
        },
        {
          "message": "Password and checkPassword do not match."
        }
      ],
      "userInput": {
        "email": "user7@example",
        "password": "1234567",
        "name": "rrrr",
        "checkPassword": "12345678",
        "account": "user1"
      }
    }
  ```

#### `POST /users/login`

- **Description**

  Login by filling out account and password

- **Request Body**

  - account
  - password

  ```
  {
    "account": "user1",
    "password": "12345678"
  }
  ```

- **Response**

  - 200: Login successfully

  ```
    {
      "status": "success",
      "message": "login successfully",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNjE5NDUyNzY1fQ.PWVB3oa9pqmA6-sQii69BCs1bFJXlYO6yaM4hhthq7E",
      "user": {
        "id": 3,
        "name": "user2",
        "email": "user2@example.com",
        "account": "user2",
        "avatar": "https://i.imgur.com/q6bwDGO.png",
        "introduction": "Dignissimos repellat maxime nisi quia molestiae po",
        "cover": "https://i.imgur.com/1jDf2Me.png",
        "role": "user"
      }
    }
  ```

  - 401: Incorrect password

  ```
    {
      "status": "error",
      "message": "Incorrect Password"
    }
  ```

  - 422: All fields are required

  ```
    {
      "status": "error",
      "message": "All fields are required."
    }
  ```

#### `GET /users/current_user`

- **Description**

  Get current login user's data

- **Response**

  - 200: Retrieved a user

  ```
    {
      "id": 14,
      "name": "user1",
      "account": "user1",
      "email": "user1@example.com",
      "avatar": "https://i.imgur.com/q6bwDGO.png",
      "role": "user",
      "cover": "https://i.imgur.com/1jDf2Me.png",
      "introduction": "Maxime quo quos beatae aut quaerat rem."
    }
  ```

  - 401: Access token is missing or invalid

#### `GET /users/:id`

- **Description**

  Get a specific user's data by id

- **Parameters**

  - id: The id of the user

- **Response**

  - 200: Retrieved an user object

  ```
    {
      "id": 24,
      "name": "user2",
      "email": "user2@example.com",
      "account": "user2",
      "avatar": "https://i.imgur.com/q6bwDGO.png",
      "introduction": "Accusamus harum voluptas. Nostrum incidunt fugiat ",
      "cover": "https://i.imgur.com/1jDf2Me.png",
      "role": "user",
      "tweetCount": 10,
      "followerCount": 1,
      "followingCount": 0,
      "isFollowed": true,
      "isSubscribed": false
    }
  ```

  - 401: Access token is missing or invalid

  - 404: User does not exist

  ```
    {
      "status": "error",
      "message": "user does not exist"
    }
  ```

#### `PUT /users/:id`

- **Description**

  Edit the profile or set the data

- **Parameters**

  - id: The id of the current login user

- **Request Body**

  - page: leave it blank for profile page, setting for setting page
  - account
  - name
  - email
  - password
  - checkPassword
  - introduction
  - avatar
  - cover

```
  {
    "page": "(leave blank for profile, setting for setting page)",
    "account": "user1",
    "name": "user1",
    "email": "user1@example.com",
    "password": "12345678",
    "checkPassword": "12345678",
    "introduction": "Hi",
    "avatar": "https://i.imgur.com/q6bwDGO.png",
    "cover": "https://i.imgur.com/1jDf2Me.png"
  }
```

- **Response**

  - 200: Profile/setting page updated successfully

  ```
    {
      "status": "success",
      "message": "profile/setting update successfully"
    }
  ```

  - 401: Access token is missing or invalid

  - 403: You can not edit other's profile

  ```
    {
      "status": "error",
      "message": "You can not edit other's profile"
    }
  ```

  - 409: A user already exists

  ```
    {
      "status": "error",
      "message": "A user with 'user1@example.com' already exists. Choose a different email.",
      "userInput": {
        "email": "user1@example.com",
        "password": "12345678",
        "name": "root",
        "checkPassword": "12345678",
        "account": "user10",
        "page": "setting"
      }
    }
  ```

  - 422: Did not meet field requirements

  ```
    {
      "status": "error",
      "errors": [
        {
          "message": "Please fill out all fields."
        },
        {
          "message": "Please enter the correct email address."
        },
        {
          "message": "Password and checkPassword do not match."
        }
      ],
      "userInput": {
        "email": "",
        "password": "12345678",
        "name": "rrrr",
        "checkPassword": "123456789",
        "account": "user2",
        "page": "setting"
      }
    }
  ```

#### `GET /users/:id/tweets`

- **Description**

  Get a specific user's tweets by user id

- **Parameters**

  - id: The id of the user

- **Response**

  - 200: Retrieved an array of tweet objects

  ```
    [
      {
        "id": 104,
        "description": "Ad sit vel ut doloribus fugiat. Quasi repudiandae ea error deleniti amet a iusto. Unde voluptatem officia. Et mollitia accusamus qui quia est doloribus quisquam ex odit. Amet quo omnis eos corporis qui cum est rerum.",
        "createdAt": "2021-04-25T14:07:36.000Z",
        "replyCount": 3,
        "likeCount": 1,
        "isLiked": true
      }
    ]
  ```

  - 401: Access token is missing or invalid

  - 404: User does not exist

  ```
    {
      "status": "error",
      "message": "user does not exist"
    }
  ```

#### `GET /users/:id/replied_tweets`

- **Description**

  Get the tweets a specific user replied by user id

- **Parameters**

  - id: The id of the user

- **Response**

  - 200: Retrieved an array of tweet objects

  ```
    [
      {
        "id": 314,
        "comment": "Voluptate qui enim magnam error dolorum voluptas e",
        "createdAt": "2021-04-25T14:07:36.000Z",
        "TweetId": 104,
        "Tweet": {
          "id": 104,
          "description": "Ad sit vel ut doloribus fugiat. Quasi repudiandae ea error deleniti amet a iusto. Unde voluptatem officia. Et mollitia accusamus qui quia est doloribus quisquam ex odit. Amet quo omnis eos corporis qui cum est rerum.",
          "createdAt": "2021-04-25T14:07:36.000Z",
          "isLiked": true,
          "User": {
            "id": 24,
            "name": "user2",
            "account": "user2",
            "avatar": "https://i.imgur.com/q6bwDGO.png"
          },
          "replyCount": 3,
          "likeCount": 1
        }
      }
    ]
  ```

  - 401: Access token is missing or invalid

  - 404: User does not exist

  ```
    {
      "status": "error",
      "message": "user does not exist"
    }
  ```

#### `GET /users/:id/likes`

- **Description**

  Get the tweets a specific user likes by user id

- **Parameters**

  - id: The id of the user

- **Response**

  - 200: Retrieved an array of tweet objects

  ```
    [
      {
        "id": 4,
        "createdAt": "2021-04-25T14:16:45.000Z",
        "TweetId": 104,
        "Tweet": {
          "id": 104,
          "description": "Ad sit vel ut doloribus fugiat. Quasi repudiandae ea error deleniti amet a iusto. Unde voluptatem officia. Et mollitia accusamus qui quia est doloribus quisquam ex odit. Amet quo omnis eos corporis qui cum est rerum.",
          "createdAt": "2021-04-25T14:07:36.000Z",
          "isLiked": true,
          "User": {
            "id": 24,
            "name": "user2",
            "account": "user2",
            "avatar": "https://i.imgur.com/q6bwDGO.png"
          },
          "replyCount": 3,
          "likeCount": 1
        }
      }
    ]
  ```

  - 401: Access token is missing or invalid

  - 404: User does not exist

  ```
    {
      "status": "error",
      "message": "user does not exist"
    }
  ```

#### `GET /users/:id/followings`

- **Description**

  Get a specific user's following list by user id

- **Parameters**

  - id: The id of the user

- **Response**

  - 200: Retrieved an array of user objects

  ```
    [
      {
        "followingId": 24,
        "name": "user2",
        "account": "user2",
        "avatar": "https://i.imgur.com/q6bwDGO.png",
        "introduction": "Accusamus harum voluptas. Nostrum incidunt fugiat ",
        "createdAt": "2021-04-25T14:07:36.000Z",
        "isFollowing": true
      }
    ]
  ```

  - 401: Access token is missing or invalid

  - 404: User does not exist

  ```
    {
      "status": "error",
      "message": "user does not exist"
    }
  ```

#### `GET /users/:id/followers`

- **Description**

  Get a specific user's follower list by user id

- **Parameters**

  - id: The id of the user

- **Response**

  - 200: Retrieved an array of user objects

  ```
    [
      {
        "followerId": 14,
        "name": "user1",
        "account": "user1",
        "avatar": "https://i.imgur.com/q6bwDGO.png",
        "introduction": "Maxime quo quos beatae aut quaerat rem.",
        "createdAt": "2021-04-25T14:07:35.000Z",
        "isFollowing": false
      }
    ]
  ```

  - 401: Access token is missing or invalid

  - 404: User does not exist

  ```
    {
      "status": "error",
      "message": "user does not exist"
    }
  ```

#### `POST users/:id/followships`

- **Description**

  Follow the user by user id

- **Parameters**

  - id: The id of the user

- **Response**

  - 200: Successfully followed the user

  ```
    {
      "status": "success",
      "message": "successfully followed user",
      "followingUser": {
        "id": 2,
        "name": "user1",
        "account": "user1",
        "avatar": "https://i.imgur.com/q6bwDGO.png",
        "cover": "https://i.imgur.com/1jDf2Me.png",
        "introduction": "Non enim aut. Rerum esse ratione voluptatem accusa"
      }
    }
  ```

  - 401: Access token is missing or invalid

  - 403: You cannot follow yourself

  ```
    {
      "status": "error",
      "message": "you cannot follow yourself"
    }
  ```

  - 409: Already followed this user

  ```
    {
      "status": "error",
      "message": "already followed this user"
    }
  ```

#### `DELETE users/:id/followships`

- **Description**

  Unfollow the user by user id

- **Parameters**

  - id: The id of the user

- **Response**

  - 200: Successfully unfollowed the user

  ```
    {
      "status": "success",
      "message": "successfully unfollowed the user",
    }
  ```

  - 403: You cannot unfollow yourself

  ```
    {
      "status": "error",
      "message": "you cannot unfollow yourself"
    }
  ```

#### `POST users/:id/subscriptions`

- **Description**

  Subscribe the user by user id

- **Parameters**

  - id: The id of the user

- **Response**

  - 200: Successfully subscribed the user

  ```
    {
      "status": "success",
      "message": "subscribed @user4",
      "author": {
          "id": 5,
          "name": "user4",
          "email": "user4@example.com",
          "password": "$2a$10$OqwegZokDJq4YXwoyoxoquHTCZzzo96exM4rObEvofIAlhf4Nw8Xy",
          "role": "user",
          "avatar": "https://i.imgur.com/q6bwDGO.png",
          "introduction": "reprehenderit dignissimos dolores",
          "account": "user4",
          "cover": "https://i.imgur.com/1jDf2Me.png",
          "createdAt": "2021-04-25T17:45:46.000Z",
          "updatedAt": "2021-04-25T17:45:46.000Z"
      }
    }
  ```

  - 401: Access token is missing or invalid

  - 403: You cannot subscribe yourself

  ```
    {
      "status": "error",
      "message": "you cannot subscribe yourself"
    }
  ```

  - 409: Already subscribed this user

  ```
    {
      "status": "error",
      "message": "already subscribed this user"
    }
  ```

#### `DELETE users/:id/subscriptions`

- **Description**

  Unsubscribe the user user by user id

- **Parameters**

  - id: The id of the user

- **Response**

  - 200: Successfully unsubscribe the user

  ```
    {
      "status": "success",
      "message": "Unsubscribe @user1",
    }
  ```

#### Tweet related

| Method | Path              | description                                      | req.body         | res.json tables               |
| ------ | ----------------- | ------------------------------------------------ | ---------------- | ----------------------------- |
| POST   | /tweets           | 建立一筆推文                                     | description(140) | -------                       |
| GET    | /tweets           | 取出全站推文及其關聯資料，按建立日期從新到舊排序 | --------         | tweets, users, replies, likes |
| GET    | /tweets/:tweet_id | 取出一筆推文、推文者資料及按讚數                 | --------         | tweets, users, replies, likes |

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

By following the instruction, you can run a Simple Twitter API server on your local machine.

#### Prerequisites

- [Git](https://git-scm.com/downloads)
- [Node.js v14.15.1](https://nodejs.org/en/download/)
- [MySQL v8.0.20](https://dev.mysql.com/downloads/mysql/)
- [MySQL Workbench v8.0.20](https://dev.mysql.com/downloads/mysql/)

#### Clone the repository to your local machine

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
