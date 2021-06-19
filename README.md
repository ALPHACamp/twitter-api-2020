# Simple Twitter API

A RESTful API server for [Simple Twitter](https://github.com/ivyhungtw/simple-twitter) project built with Node.js, Express framework, and MySQL

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

  - 200: Retrieve an array of user objects

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

  - page: '' for profile page, 'setting' for setting page
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
    "page": "('' for profile page, 'setting' for setting page)",
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

  Unsubscribe the user by user id

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

#### `GET /tweets`

- **Description**

  Get a list of all tweets

- **Response**

  - 200: Successfully retrieved an array of tweet objects

  ```
    [
      {
          "id": 1,
          "UserId": 1,
          "description": "Ipsa quaerat modi alias vel eos odit qui ut et. Vel dolor doloribus iure deleniti veritatis ut. Aut quam odio reprehenderit. Et reprehenderit temporibus",
          "createdAt": "2021-04-19T16:45:10.000Z",
          "updatedAt": "2021-04-19T16:45:10.000Z",
          "replyCount": 3,
          "likeCount": 1,
          "isLiked": true,
          "user": {
              "avatar": "https://i.imgur.com/q6bwDGO.png",
              "name": "root",
              "account": "root"
          }
      }
    ]
  ```

  - 401: Access token is missing or invalid

#### `POST /tweets`

- **Description**

  Post a tweet

- **Request Body**

  - UserId
  - description

```
  {
    "UserId": 1,
    "description": "Ipsa quaerat modi alias vel eos odit qui ut et. Vel dolor doloribus iure deleniti veritatis ut. Aut quam odio reprehenderit. Et reprehenderit temporibus. Excepturi expedita blanditiis fugiat. Ratione debitis mollitia explicabo nam omnis.\n \rDicta officiis"
  }
```

- **Response**

  - 200: Successfully posted a tweet

  ```
    {
      "status": "success",
      "message": "successfully posted a tweet",
      "tweet": [
        {
          "id": 60,
          "UserId": 1,
          "description": "Ipsa quaerat.\n \rDicta officiis",
          "createdAt": "2021-04-27T09:09:15.000Z",
          "updatedAt": "2021-04-27T09:09:15.000Z"
        }
      ]
    }
  ```

  - 401: Access token is missing or invalid

  - 422: Input cannot be longer than 140 characters or empty

  ```
    {
      "status": "error",
      "message": "Input cannot be longer than 140 characters / input should not be blank"
    }
  ```

#### `GET /tweets/:tweet_id`

- **Description**

  Get the data of a specific tweet by tweet id

- **Parameters**

  - tweet_id: The id of the tweet

- **Response**

  - 200: Successfully retrieved the data of the tweet

  ```
    {
      "id": 13,
      "description": "Vitae reiciendis voluptatem laudantium quis laudantium.\nIpsa et dolor et quasi suscipit totam neque nisi.",
      "createdAt": "2021-04-19T16:45:10.000Z",
      "updatedAt": "2021-04-19T16:45:10.000Z",
      "user": {
        "id": 2,
        "name": "user1",
        "avatar": "https://i.imgur.com/q6bwDGO.png"
      },
      "likesLength": 0,
      "commentsLength": 4,
      "isLiked": false
    }
  ```

  - 401: Access token is missing or invalid

  - 404: This tweet doesn't exist

#### `PUT /tweets/:tweet_id`

- **Description**

  Edit a tweet of the current login user

- **Parameters**

  - tweet_id: The id of the tweet

- **Request Body**

  - UserId
  - description

```
  {
    "UserId": 1,
    "description": "doloribus iure deleniti veritatis ut. Aut quam odio reprehenderit. Et reprehenderit temporibus. Excepturi expedita blanditiis fugiat"
  }
```

- **Response**

  - 200: Successfully edited a tweet

  ```
    {
      "status": "success",
      "message": "successfully edited a tweet",
      "editedTweetId": 2
    }
  ```

  - 401: Access token is missing or invalid

  - 403: You cannot edit other user's tweet

  ```
    {
      "status": "error",
      "message": "you cannot edit other user's tweet"
    }
  ```

  - 422: Input cannot be longer than 140 characters

  ```
    {
      "status": "error",
      "message": "input cannot be longer than 140 characters"
    }
  ```

#### `DELETE /tweets/:tweet_id`

- **Description**

  Delete a specific tweet by tweet id

- **Parameters**

  - tweet_id: The id of the tweet

- **Response**

  - 200: Successfully deleted the tweet

  ```
    {
      "status": "success",
      "message": "delete successfully"
    }
  ```

  - 401: Access token is missing or invalid

  - 403: You cannot delete other user's tweet

  ```
    {
      "status": "error",
      "message": "you cannot delete other user's tweet"
    }
  ```

#### `POST /tweets/:tweet_id/like`

- **Description**

  Like a specific tweet by tweet id

- **Parameters**

  - tweet_id: The id of the tweet

- **Response**

  - 200: Successfully liked this tweet

  ```
    {
      "status": "success"
    }
  ```

  - 401: Access token is missing or invalid

#### `DELETE /tweets/:tweet_id/like`

- **Description**

  Unlike a specific tweet by tweet id

- **Parameters**

  - tweet_id: The id of the tweet

- **Response**

  - 200: Successfully unliked this tweet

  ```
    {
      "status": "success"
    }
  ```

  - 401: Access token is missing or invalid

#### `GET /tweets/:tweet_id/replies`

- **Description**

  Get all replies of a specific tweet by tweet id

- **Parameters**

  - tweet_id: The id of the tweet

- **Response**

  - 200: Successfully retrieved replies of this tweet

  ```
    [
      {
        "id": 13,
        "UserId": 3,
        "TweetId": 5,
        "comment": "Adipisci minus officia voluptatum totam aut et qui",
        "createdAt": "2021-04-19T16:45:10.000Z",
        "updatedAt": "2021-04-19T16:45:10.000Z"
    }
    ]
  ```

  - 401: Access token is missing or invalid

  - 404: This tweet doesn't exist

  ```
    {
      "status": "error",
      "message": "this tweet doesn't exist"
    }
  ```

#### `POST /tweets/:tweet_id/replies`

- **Description**

  Reply to a specific tweet by tweet id

- **Parameters**

  - tweet_id: The id of the tweet

- **Request Body**

  - UserId
  - comment

```
  {
    "UserId": 1,
    "comment": "Ipsa quaerat modi alias vel eos odit qui ut et. Vel dolor doloribus iure deleniti veritatis ut. Aut quam odio reprehenderit. Et reprehenderit temporibus. Excepturi expedita blanditiis fugiat. Ratione debitis mollitia explicabo nam omnis.\n \rDicta officiis"
    }
```

- **Response**

  - 200: Successfully replied to this tweet

  ```
    {
      "status": "success",
      "message": "successfully replied to this tweet"
    }
  ```

  - 401: Access token is missing or invalid

  - 422: comment cannot be empty

  ```
    {
      "status": "success",
      "message": "comment cannot be blank"
    }
  ```

#### `PUT /tweets/:tweet_id/replies/:reply_id`

- **Description**

  Edit a reply to a specific tweet by tweet id and reply id

- **Parameters**

  - tweet_id: The id of the tweet
  - reply_id: The id of the reply

- **Request Body**

  - UserId
  - ReplyId
  - description

```
  {
    "UserId": 1,
    "ReplyId": 1,
    "description": "doloribus iure deleniti veritatis ut. Excepturi expedita blanditiis fugiat"
  }
```

- **Response**

  - 200: Successfully edited the reply

  ```
    {
      "status": "success",
      "message": "successfully updated your reply",
      "updatedReplyId": 1
    }
  ```

  - 401: Access token is missing or invalid

  - 400: This reply does not exist or belong to you

  ```
    {
      "status": "error",
      "message": "This reply does not exist or belong to you"
    }
  ```

  - 422: comment cannot be empty

  ```
    {
      "status": "success",
      "message": "comment cannot be blank"
    }
  ```

#### `DELETE /tweets/:tweet_id/replies/:reply_id`

- **Description**

  Delete a reply to a tweet by tweet id and reply id

- **Parameters**

  - tweet_id: The id of the tweet
  - reply_id: The id of the reply

- **Response**

  - 200: Successfully deleted your reply

  ```
    {
      "status": "success",
      "message": "successfully deleted your reply"
    }
  ```

  - 401: Access token is missing or invalid

  - 400: This reply does not exist or belong to you

  ```
    {
      "status": "error",
      "message": "This reply does not exist or belong to you"
    }
  ```

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
