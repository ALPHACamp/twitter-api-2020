# Simple Twitter BackEnd API

- [Simple Twitter BackEnd API](#simple-twitter-backend-api)
  - [Before getting start](#before-getting-start)
    - [Clone the repo to local](#clone-the-repo-to-local)
    - [Create database Refer to config/config.json](#create-database-refer-to-configconfigjson)
    - [Install npm packages](#install-npm-packages)
    - [Database migrate Models](#database-migrate-models)
    - [Database seeds install](#database-seeds-install)
    - [Set env variables Refer to `.env.example` file](#set-env-variables-refer-to-envexample-file)
    - [Active apis](#active-apis)
  - [Routes and Controllers Table](#routes-and-controllers-table)
    - [User Controller](#user-controller)
    - [Admin Controller](#admin-controller)
    - [Followship Controller](#followship-controller)
    - [Tweet Controller](#tweet-controller)
    - [Like Controller](#like-controller)
    - [Reply Controller](#reply-controller)
  - [API DOC](#api-doc)
    - [User APIs](#user-apis)
      - [1. 使用者註冊帳號：POST /api/users](#1-使用者註冊帳號post-apiusers)
      - [2. 使用者登入：POST /api/users/signin](#2-使用者登入post-apiuserssignin)
      - [3. 使用者可以看到自己的帳戶資料：GET /api/users/:id/setting](#3-使用者可以看到自己的帳戶資料get-apiusersidsetting)
      - [4. 使用者可以編輯自己的帳戶資料：PATCH /api/users/:id/setting](#4-使用者可以編輯自己的帳戶資料patch-apiusersidsetting)
      - [5. 使用者可以看到某使用者（包括自己）的個人資料：GET /api/users/:id](#5-使用者可以看到某使用者包括自己的個人資料get-apiusersid)
      - [6. 使用者可以編輯自己的個人資料：PUT /api/users/:id](#6-使用者可以編輯自己的個人資料put-apiusersid)
      - [7. 使用者可以看到某使用者（包括自己）的所有 tweets：GET /api/users/:id/tweets](#7-使用者可以看到某使用者包括自己的所有-tweetsget-apiusersidtweets)
      - [8. 使用者看到某使用者（包括自己）回覆過的所有 tweets：GET /api/users/:id/replied_tweets](#8-使用者看到某使用者包括自己回覆過的所有-tweetsget-apiusersidreplied_tweets)
      - [9. 使用者看到某使用者（包括自己）點擊過 like 的所有 tweets：GET /api/users/:id/likes](#9-使用者看到某使用者包括自己點擊過-like-的所有-tweetsget-apiusersidlikes)
      - [10. 使用者可以看到某使用者（包括自己）正在追蹤的人：GET /api/users/:id/followings](#10-使用者可以看到某使用者包括自己正在追蹤的人get-apiusersidfollowings)
      - [11. 使用者（包括自己）可以看到某使用者被哪些人追蹤：GET /api/users/:id/followers](#11-使用者包括自己可以看到某使用者被哪些人追蹤get-apiusersidfollowers)
      - [12. 取得current user資訊：GET /api/get_current_user](#12-取得current-user資訊get-apiget_current_user)
    - [Admin APIs](#admin-apis)
      - [1. 管理者登入：POST /api/admin/signin](#1-管理者登入post-apiadminsignin)
      - [2. 管理者可以瀏覽所有使用者清單：GET /api/admin/users](#2-管理者可以瀏覽所有使用者清單get-apiadminusers)
      - [3. 管理者可以瀏覽全站的 tweets：GET /api/admin/tweets](#3-管理者可以瀏覽全站的-tweetsget-apiadmintweets)
      - [4. 管理者可以刪除任一則 tweet：DELETE /api/admin/tweets/:id](#4-管理者可以刪除任一則-tweetdelete-apiadmintweetsid)
    - [Followship APIs](#followship-apis)
      - [1. 使用者可以追蹤其他使用者：POST /api/followships](#1-使用者可以追蹤其他使用者post-apifollowships)
      - [2. 使用者可以取消追蹤其他使用者：DETELE /api/followships/:followingId](#2-使用者可以取消追蹤其他使用者detele-apifollowshipsfollowingid)
      - [3. 使用者可以看到最多人追蹤的 10 個人：GET /api/followships/top_users](#3-使用者可以看到最多人追蹤的-10-個人get-apifollowshipstop_users)
    - [Tweet APIs](#tweet-apis)
      - [1. 使用者可以撰寫 tweet：POST /api/tweets](#1-使用者可以撰寫-tweetpost-apitweets)
      - [2. 使用者可以看到所有 tweet：GET /api/tweets](#2-使用者可以看到所有-tweetget-apitweets)
      - [3. 使用者可以看到特定一則 tweet：GET /api/tweets/:tweet_id](#3-使用者可以看到特定一則-tweetget-apitweetstweet_id)
    - [Reply APIs](#reply-apis)
      - [1. 使用者可以回覆特定一則 tweet：POST /api/tweets/:tweet_id/replies](#1-使用者可以回覆特定一則-tweetpost-apitweetstweet_idreplies)
      - [2. 使用者可以看到特定一則 tweet 的所有回覆：GET /api/tweets/:tweet_id/replies](#2-使用者可以看到特定一則-tweet-的所有回覆get-apitweetstweet_idreplies)
    - [Like APIs](#like-apis)
      - [1. 使用者可以對特定一則 tweet 點擊愛心：POST /api/tweets/:id/like](#1-使用者可以對特定一則-tweet-點擊愛心post-apitweetsidlike)
      - [2. 使用者可以對特定一則 tweet 收回點擊過的愛心：POST /api/tweets/:id/unlike](#2-使用者可以對特定一則-tweet-收回點擊過的愛心post-apitweetsidunlike)

## Before getting start

### Clone the repo to local

```
git clone https://github.com/wuwachon/twitter-api-2020
```

### Create database Refer to config/config.json

create your database name as "ac_twitter_workspace" and username/password as below.

```
"development": {
  "username": "root",
  "password": "password",
  "database": "ac_twitter_workspace",
  "host": "127.0.0.1",
  "dialect": "mysql"
}
```

### Install npm packages

```
cd twitter-api-2020
npm install
```

### Database migrate Models

```
npm run migrate
```

### Database seeds install

```
npm run seed
```

### Set env variables Refer to `.env.example` file

Remove the `.example` from `.env.example` file name, and set up the info below in `.env` file before active apis

```
JWT_SECRET=
IMGUR_CLIENT_ID=
```

### Active apis

```
npm run dev
```

You will see `Example app listening on port 3000` message in your terminal if it runs fine.

## Routes and Controllers Table

### User Controller

| Index | Feature                                | Method | Route                                | Controller Action                 | Note                |
| ----- | -------------------------------------- | ------ | ------------------------------------ | --------------------------------- | ------------------- |
| 1     | user sign up                           | POST   | POST /api/users                      | user-controller.signUp            |                     |
| 2     | user sign in                           | POST   | POST /api/users/signIn               | user-controller.sginIn            |                     |
| 3     | get specific user’s sign up data       | GET    | GET /api/users/:id/setting           | user-controller.getSetting        | need authentication |
| 4     | edit specific user’s sign up data      | PATCH  | PATCH /api/users/:id/setting         | user-controller.patchSetting      | need authentication |
| 5     | get specific user’s profile            | GET    | GET /api/users/:id                   | user-controller.getUser           | need authentication |
| 6     | user can edit his own profile data     | PUT    | PUT /api/users/:id                   | user-controller.putUser           | need authentication |
| 7     | get all tweets of the specific user    | GET    | GET /api/users/:id/tweets            | user-controller.getUserTweets     | need authentication |
| 8     | get all replies of the specific user   | GET    | GET /api/users/:id/replied_tweets    | user-controller.getUserReplies    | need authentication |
| 9     | get all tweets the specific user liked | GET    | GET /api/users/:id/likes             | user-controller.getUserLikes      | need authentication |
| 10    | get the specific user’s followings     | GET    | GET /api/users/:id/followings        | user-controller.getUserFollowings | need authentication |
| 11    | get the specific user’s followers      | GET    | GET /api/users/:id/followers         | user-controller.getUserFollowers  | need authentication |
| 12    | get current user                       | GET    | GET /api/get_current_user            | user-controller.getCurrentUSer    | need authentication |

### Admin Controller

| Index | Feature                                | Method | Route                                | Controller Action                 | Note                |
| ----- | -------------------------------------- | ------ | ------------------------------------ | --------------------------------- | ------------------- |
| 1     | admin sign in                          | POST   | POST /api/admin/signin               | admin-controller.signIn           |                     |
| 2     | admin can see all users                | GET    | GET /api/admin/users                 | admin-controller.getUsers         | need authentication |
| 3     | admin can see all tweets               | GET    | GET /api/admin/tweets                | admin-controller.getTweets        | need authentication |
| 4     | admin can delete a tweet               | DELETE | DELETE /api/admin/tweets/:id         | admin-controller.deleteTweet      | need authentication |

### Followship Controller

| Index | Feature                                | Method | Route                                | Controller Action                      | Note                |
| ----- | -------------------------------------- | ------ | ------------------------------------ | -------------------------------------- | ------------------- |
| 1     | user can follow another user           | POST   | POST /api/followships                | followship-controller.postFollowship   | need authentication |
| 2     | user can unfollow another user         | DELETE | DETELE /api/followships/:followingId | followship-controller.deleteFollowship | need authentication |
| 3     | get top 10 users having most followers | GET    | GET /api/followships/top_users       | followship-controller.getTopUsers      | need authentication |

### Tweet Controller

| Index | Feature                                | Method | Route                                | Controller Action                 | Note                |
| ----- | -------------------------------------- | ------ | ------------------------------------ | --------------------------------- | ------------------- |
| 1     | user can post a tweet                  | POST   | POST /api/tweets                     | tweet-controller.postTweet        | need authentication |
| 2     | get all tweets                         | GET    | GET /api/tweets                      | tweet-controller.getTweets        | need authentication |
| 3     | get the specific tweet                 | GET    | GET /api/tweets/:tweet_id            | tweet-controller.getTweet         | need authentication |

### Like Controller

| Index | Feature                                | Method | Route                                | Controller Action                 | Note                |
| ----- | -------------------------------------- | ------ | ------------------------------------ | --------------------------------- | ------------------- |
| 1     | like the specific tweet                | POST   | POST /api/tweets/:id/like            | like-controller.postLikeToTweet   | need authentication |
| 2     | unlike the specific tweet              | POST   | POST /api/tweets/:id/unlike          | like-controller.postUnlikeToTweet | need authentication |

### Reply Controller

| Index | Feature                                | Method | Route                                | Controller Action                 | Note                |
| ----- | -------------------------------------- | ------ | ------------------------------------ | --------------------------------- | ------------------- |
| 1     | user can reply to the specific tweet   | POST   | POST /api/tweets/:tweet_id/replies   | reply-controller.postReply        | need authentication |
| 2     | get all replies of the specific tweet  | GET    | GET /api/tweets/:tweet_id/replies    | reply-controller.getReplies       | need authentication |

## API DOC

### User APIs

#### 1. 使用者註冊帳號：POST /api/users

- HTTP Method : POST
- Request Parameters：No
- Request Body ：註冊表單內的資料
     
    | Index | Request Name  | Type    | Required | Example              |
    | ----- | ------------- | ------- | -------- | -------------------- |
    | 1     | account       | STRING  | True     | 'Captain'            |
    | 2     | name          | STRING  | True     | 'Captain'            |
    | 3     | email         | STRING  | True     | 'captain@marvel.com' |
    | 4     | password      | STRING  | True     | 'youneverknow'       |
    | 5     | checkPassword | STRING  | True     | 'youneverknow'       |
- Success Response：
    
    ```json
    {
      "status": "success"
    }
    ```
    
- Failure Response：
    
    ```json
    Status Code: 500
    // 註冊表單上任何一個欄位是空白
    {
      "status": "error",
      "message": "Error: All fields are required"
    }
    
    // 密碼和再次確認密碼不相同
    {
      "status": "error",
      "message": "Error: password and checkPassword not matched"
    }
    
    // 帳號超過20個字
    {
      "status": "error",
      "message": "Error: Characters length of account should be less than 20"
    }
    
    // 名字超過50個字
    {
      "status": "error",
      "message": "Error: Characters length of name should be less than 50"
    }
    
    // 帳號已經被註冊過
    {
      "status": "error",
      "message": "Error: The account has already been used by someone else"
    }
    
    // email 已經被註冊過
    {
      "status": "error",
      "message": "Error: The email has already been used by someone else"
    }
    ```
    

#### 2. 使用者登入：POST /api/users/signin

- HTTP Method : POST
- Request Parameters：No
- Request Body ：登入表單內的資料
    
    | Index | Request Name  | Type    | Required | Example              |
    | ----- | ------------- | ------- | -------- | -------------------- |
    | 1     | account       | STRING  | True     | 'Captain'            |
    | 2     | password      | STRING  | True     | 'youneverknow'       |
- Success Response：
    
    ```json
    {
      "status": "success",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsImFjY291bnQiOiJ1c2VyMiIsIm5hbWUiOiJ1c2VyMiIsImVtYWlsIjoidXNlcjJAZXhhbXBsZS5jb20iLCJhdmF0YXIiOiJodHRwczovL2xvcmVtZmxpY2tyLmNvbS8zMjAvMjQwL3BhcmlzLGdpcmwvYWxsIiwiaW50cm9kdWN0aW9uIjoic2F5IHNvbWV0aGluZy4uIiwiYmFubmVyIjoiaHR0cHM6Ly9sb3JlbWZsaWNrci5jb20vMzIwLzI0MC9iZWFjaCIsInJvbGUiOiJ1c2VyIiwiY3JlYXRlZEF0IjoiMjAyMi0wOC0wMlQxMToyNTo1Ny4wMDBaIiwidXBkYXRlZEF0IjoiMjAyMi0wOC0wMlQxMToyNTo1Ny4wMDBaIiwiaWF0IjoxNjU5NDk3NTA0LCJleHAiOjE2NjA3MDcxMDR9.UmjpzseSMG3yOpdeq4DmVHE0Nk4PS9BAR5s4r6ejQWo"
    }
    ```
    
- Failure Response：
    
    ```json
    // 帳號或密碼錯誤
    Status Code: 500
    { 
      "status": "error",
      "message": "Error: Account or Password error!"
    }
    // 使用者禁止登入管理者後台，管理者也禁止登入前台，視為帳號不存在
    Status Code: 500
    {
      "status": "error",
      "message": "Error: account not exist"
    }
    ```
    

#### 3. 使用者可以看到自己的帳戶資料：GET /api/users/:id/setting

- HTTP Method : GET
- Request Parameters：
    
    | Index | Request Name  | Type    | Required | Example              |
    | ----- | ------------- | ------- | -------- | -------------------- |
    | 1     | user id       | INTEGER | True     | 1                    |
- Request Body ：
- Success Response：
    
    ```json
    {
      "id": 3,
      "account": "user20",
      "name": "user20",
      "email": "user20",
      "avatar": "https://loremflickr.com/320/240/paris,girl/all",
      "introduction": "say something..",
      "banner": "https://loremflickr.com/320/240/beach",
      "role": "user",
      "createdAt": "2022-08-02T02:49:02.000Z",
      "updatedAt": "2022-08-03T03:03:26.000Z"
    }
    ```
    
- Failure Response：
    
    ```json
    // 如果參數id檢查發現不是登入者
    Status Code: 403
    {
      "status": "error",
      "message": "Error: permission denied"
    }
    // 如果參數id資料庫找不到人
    Status Code: 500
    {
      "status": "error",
      "message": "Error: Target user not exist"
    }
    ```
    

#### 4. 使用者可以編輯自己的帳戶資料：PATCH /api/users/:id/setting

- HTTP Method : PATCH
- Request Parameters：
    
    | Index | Request Name  | Type    | Required | Example              |
    | ----- | ------------- | ------- | -------- | -------------------- |
    | 1     | user id       | INTEGER | True     | 1                    |    

- Request Body ：編輯帳戶資料表單內的資料
    
    | Index | Request Name  | Type    | Required | Example              |
    | ----- | ------------- | ------- | -------- | -------------------- |
    | 1     | account       | STRING  | True     | 'Captain'            |
    | 2     | name          | STRING  | True     | 'Captain'            |
    | 3     | email         | STRING  | True     | 'captain@gmail.com'  |
    | 4     | password      | STRING  | Optional | 'nowyouknow'         |
    | 5     | checkPassword | STRING  | Optional | 'nowyouknow'         |
- Success Response：
    
    ```json
    {
      "status": "success"
    }
    ```
    
- Failure Response：
    
    ```json
    // 如果參數id檢查發現不是登入者
    Status Code: 403
    {
      "status": "error",
      "message": "Error: permission denied"
    }
    // 若是帳號、名字或email任何一項空白
    Status Code: 500
    {
      "status": "error",
      "message": "Error: ${field} is required"
    }
    // 若是名字超過50個字
    Status Code: 500
    {
      "status": "error",
      "message": "Error: Characters length of name should be less than 50."
    }
    // 若是密碼或密碼確認欄位有值，但兩者不相符
    Status Code: 500
    {
      "status": "error",
      "message": "Error: password and checkPassword not matched"
    }
    // 若是有改帳號，但新改的帳號已有其他使用者使用了
    Status Code: 500
    {
      "status": "error",
      "message": "Error: The account has already been used by someone else"
    }
    // 若是有改email，但新改的email已有其他使用者使用了
    Status Code: 500
    {
      "status": "error",
      "message": "Error: The email has already been used by someone else"
    }
    ```
    
#### 5. 使用者可以看到某使用者（包括自己）的個人資料：GET /api/users/:id
    
- HTTP Method : GET
- Request Parameters：
    
    | Index | Request Name  | Type    | Required | Example              |
    | ----- | ------------- | ------- | -------- | -------------------- |
    | 1     | user id       | INTEGER | True     | 1                    |   
- Request Body ：No
- Success Response：
    
    ```json
    {
      "id": 14,
      "account": "user2",
      "name": "user2",
      "avatar": "https://loremflickr.com/320/240/paris,girl/all",
      "introduction": "say something..",
      "banner": "https://loremflickr.com/320/240/beach",
      "role": "user",
      "tweetCounts": 10,
      "followerCounts": 6,
      "followingCounts": 8,
      "isFollowed": true
    }
    ```
    
- Failure Response：
    
    ```json
    // 如果參數id資料庫找不到人
    Status Code: 500
    {
      "status": "error",
      "message": "Error: Target user not exist"
    }
    ```
    

#### 6. 使用者可以編輯自己的個人資料：PUT /api/users/:id

- HTTP Method : PUT
- Request Parameters：
    
    | Index | Request Name  | Type    | Required | Example              |
    | ----- | ------------- | ------- | -------- | -------------------- |
    | 1     | user id       | INTEGER | True     | 1                    |   
- Request Body ：編輯個人資料表單內的資料
    
    | Index | Request Name  | Type    | Required | Example              |
    | ----- | ------------- | ------- | -------- | -------------------- |
    | 1     | name          | STRING  | True     | 'steve'              |
    | 2     | introduction  | TEXT    | Optional | 'oooolala' || null   |
    | 3     | avatar        | STRING  | Optional | 'image.link' || null |
    | 4     | banner        | STRING  | Optional | 'image.link' || null |
- Success Response：
    
    ```json
    {
      "status": "success"
    }
    ```
    
- Failure Response：
    
    ```json
    // 如果參數id檢查發現不是登入者
    Status Code: 403
    {
      "status": "error",
      "message": "Error: permission denied"
    }
    // 如果參數id資料庫找不到人
    Status Code: 500
    {
      "status": "error",
      "message": "Error: Target user not exist"
    }
    // 若是名字空白
    Status Code: 500
    {
      "status": "error",
      "message": "Error: name field is required"
    }
    // 若是名字超過50個字
    Status Code: 500
    {
      "status": "error",
      "message": "Error: Characters length of name should be less than 50."
    }
    // 若是自我介紹不是空白但超過160個字
    Status Code: 500
    {
      "status": "error",
      "message": "Error: Characters length of introduction should be less than 160."
    }
    ```
    

#### 7. 使用者可以看到某使用者（包括自己）的所有 tweets：GET /api/users/:id/tweets

- HTTP Method : GET
- Request Parameters：
    
    | Index | Request Name  | Type    | Required | Example              |
    | ----- | ------------- | ------- | -------- | -------------------- |
    | 1     | user id       | INTEGER | True     | 1                    |   
- Request Body ：No
- Success Response：
    
    ```json
    [
      {
        "id": 20,
        "userId": 3,
        "description": "Enim non distinctio culpa impedit eligendi sunt fugit dolor eaque. Omnis nam odio facilis quo. Quis corrupti ipsa sit veniam repellendus min",
        "createdAt": "2022-08-02T02:49:05.000Z",
        "updatedAt": "2022-08-02T02:49:05.000Z",
        "UserId": 3,
        "replyCounts": 6,
        "likeCounts": 2
      },
      {
        "id": 11,
        "userId": 3,
        "description": "Temporibus explicabo vel minima. Alias quas fugit. Laudantium accusantium quia eos. Alias delectus ratione rerum voluptas tempore consequatu",
        "createdAt": "2022-08-02T02:49:05.000Z",
        "updatedAt": "2022-08-02T02:49:05.000Z",
        "UserId": 3,
        "replyCounts": 6,
        "likeCounts": 2
      },

      ......
    ]
    ```
    
- Failure Response：
    
    ```json
    // 如果參數id資料庫找不到人
    Status Code: 500
    {
      "status": "error",
      "message": "Error: Target user not exist"
    }
    ```
    

#### 8. 使用者看到某使用者（包括自己）回覆過的所有 tweets：GET /api/users/:id/replied_tweets

- HTTP Method : GET
- Request Parameters：
    
    | Index | Request Name  | Type    | Required | Example              |
    | ----- | ------------- | ------- | -------- | -------------------- |
    | 1     | user id       | INTEGER | True     | 1                    |   
- Request Body ：No
- Success Response：
    
    ```json
    [
      {
        "id": 3,
        "userId": 3,
        "tweetId": 1,
        "comment": "Voluptatem nihil nihil qui ratione ad et qui modi quam. Sunt eius enim. Commodi ipsa praesentium sequi eum voluptatem.",
        "createdAt": "2022-08-02T02:49:05.000Z",
        "updatedAt": "2022-08-02T02:49:05.000Z",
        "UserId": 3,
        "TweetId": 1,
        "replyUserAccount": "user1"
      },
      {
        "id": 5,
        "userId": 3,
        "tweetId": 2,
        "comment": "Hic repellat omnis voluptas ut magnam non eum rerum. Deserunt omnis et ut tempore necessitatibus facilis rem. Beatae eveniet quidem libero e",
        "createdAt": "2022-08-02T02:49:05.000Z",
        "updatedAt": "2022-08-02T02:49:05.000Z",
        "UserId": 3,
        "TweetId": 2,
        "replyUserAccount": "user1"
      },

    ......
    ]
    ```
    
- Failure Response：
    
    ```json
    // 如果參數id資料庫找不到人
    Status Code: 500
    {
      "status": "error",
      "message": "Error: Target user not exist"
    }
    ```
    

#### 9. 使用者看到某使用者（包括自己）點擊過 like 的所有 tweets：GET /api/users/:id/likes

- HTTP Method : GET
- Request Parameters：
    
    | Index | Request Name  | Type    | Required | Example              |
    | ----- | ------------- | ------- | -------- | -------------------- |
    | 1     | user id       | INTEGER | True     | 1                    |   
- Request Body ：No
- Success Response：
    
    ```json
    [
      {
        "id": 25,
        "UserId": 5,
        "TweetId": 79,
        "createdAt": "2022-08-02T02:49:05.000Z",
        "updatedAt": "2022-08-02T02:49:05.000Z",
        "Tweet": {
          "id": 79,
          "userId": 9,
          "description": "Provident est repudiandae ratione ut. Occaecati est voluptas ducimus non. Quis animi dolores aut dolorem consequatur. Qui officiis cumque ut",
          "createdAt": "2022-08-02T02:49:05.000Z",
          "updatedAt": "2022-08-02T02:49:05.000Z",
          "UserId": 9,
          "replyUserAccount": "user8",
          "replyCounts": 6,
          "likeCounts": 1
        }
      },
      {
        "id": 26,
        "UserId": 5,
        "TweetId": 63,
        "createdAt": "2022-08-02T02:49:05.000Z",
        "updatedAt": "2022-08-02T02:49:05.000Z",
        "Tweet": {
          "id": 63,
          "userId": 8,
          "description": "Explicabo in aut. Maxime dolorum eum. Tempora explicabo tempore quod perspiciatis. Culpa enim et non illum rem consequatur ut accusamus sunt",
          "createdAt": "2022-08-02T02:49:05.000Z",
          "updatedAt": "2022-08-02T02:49:05.000Z",
          "UserId": 8,
          "replyUserAccount": "user7",
          "replyCounts": 6,
          "likeCounts": 1
        }
      },

    ......
    ]
    ```
    
- Failure Response：
    
    ```json
    // 如果參數id資料庫找不到人
    Status Code: 500
    {
      "status": "error",
      "message": "Error: Target user not exist"
    }
    ```
    

#### 10. 使用者可以看到某使用者（包括自己）正在追蹤的人：GET /api/users/:id/followings

- HTTP Method : GET
- Request Parameters：
    
    | Index | Request Name  | Type    | Required | Example              |
    | ----- | ------------- | ------- | -------- | -------------------- |
    | 1     | user id       | INTEGER | True     | 1                    |   
- Request Body ：No
- Success Response：
    
    ```json
    [
      {
        "id": 2,
        "account": "user1",
        "name": "user1",
        "avatar": "https://loremflickr.com/320/240/paris,girl/all",
        "introduction": "say something..",
        "role": "user",
        "createdAt": "2022-08-02T02:49:02.000Z",
        "updatedAt": "2022-08-02T02:49:02.000Z",
        "followingId": 2
      },
      {
        "id": 4,
        "account": "user3",
        "name": "user3",
        "avatar": "https://loremflickr.com/320/240/paris,girl/all",
        "introduction": "say something..",
        "role": "user",
        "createdAt": "2022-08-02T02:49:02.000Z",
        "updatedAt": "2022-08-02T02:49:02.000Z",
        "followingId": 4
      },
      {
        "id": 7,
        "account": "user6",
        "name": "user6",
        "avatar": "https://loremflickr.com/320/240/paris,girl/all",
        "introduction": "say something..",
        "role": "user",
        "createdAt": "2022-08-02T02:49:03.000Z",
        "updatedAt": "2022-08-02T02:49:03.000Z",
        "followingId": 7
      },

    ......
    ]
    ```
    
- Failure Response：
    
    ```json
    // 如果參數id資料庫找不到人
    Status Code: 500
    {
      "status": "error",
      "message": "Error: Target user not exist"
    }
    ```
    

#### 11. 使用者（包括自己）可以看到某使用者被哪些人追蹤：GET /api/users/:id/followers

- HTTP Method : GET
- Request Parameters：
    
    | Index | Request Name  | Type    | Required | Example              |
    | ----- | ------------- | ------- | -------- | -------------------- |
    | 1     | user id       | INTEGER | True     | 1                    |   
- Request Body ：No
- Success Response：
    
    ```json
    [
      {
        "id": 4,
        "account": "user3",
        "name": "user3",
        "avatar": "https://loremflickr.com/320/240/paris,girl/all",
        "introduction": "say something..",
        "role": "user",
        "createdAt": "2022-08-02T02:49:02.000Z",
        "updatedAt": "2022-08-02T02:49:02.000Z",
        "isFollowed": true,
        "followerId": 4
      },
      {
        "id": 6,
        "account": "user5",
        "name": "user5",
        "avatar": "https://loremflickr.com/320/240/paris,girl/all",
        "introduction": "say something..",
        "role": "user",
        "createdAt": "2022-08-02T02:49:03.000Z",
        "updatedAt": "2022-08-02T02:49:03.000Z",
        "isFollowed": true,
        "followerId": 6
      },
      {
        "id": 7,
        "account": "user6",
        "name": "user6",
        "avatar": "https://loremflickr.com/320/240/paris,girl/all",
        "introduction": "say something..",
        "role": "user",
        "createdAt": "2022-08-02T02:49:03.000Z",
        "updatedAt": "2022-08-02T02:49:03.000Z",
        "isFollowed": true,
        "followerId": 7
      },

    ......
    ]
    ```
    
- Failure Response：
    
    ```json
    // 如果參數id資料庫找不到人
    Status Code: 500
    {
      "status": "error",
      "message": "Error: Target user not exist"
    }
    ```
    

#### 12. 取得current user資訊：GET /api/get_current_user

- HTTP Method : GET
- Request Parameters：No
- Request Body ：No
- Success Response：
    
    ```json
    {
      "id": 27,
      "account": "user2",
      "name": "user2",
      "email": "user2@example.com",
      "avatar": "https://loremflickr.com/320/240/paris,girl/all",
      "introduction": "say something..",
      "banner": "https://loremflickr.com/320/240/beach",
      "role": "user",
      "createdAt": "2022-08-03T10:13:21.000Z",
      "updatedAt": "2022-08-03T10:13:21.000Z"
    }
    ```
    
- Failure Response：
    
    ```json
    // 如果Token失效
    Status Code: 401
    {
      "status": "error",
      "message": "Error: unauthorized"
    }
    ```

### Admin APIs

#### 1. 管理者登入：POST /api/admin/signin

- HTTP Method : POST
- Request Parameters：No
- Request Body ：登入表單內的資料
    
    
    | Index | Request Name  | Type    | Required | Example              |
    | ----- | ------------- | ------- | -------- | -------------------- |
    | 1     | account       | STRING  | True     | 'Captain'            |
    | 2     | password      | STRING  | True     | 'youneverknow'       |
- Success Response：
    
    ```json
    Status Code: 200
    {
      "status": "success",
      "token": "eyJhbGciVCJ9.eyJpZCI6MTIWFpbCTYzfQ.pBXEHFrghYO8"
    }
    ```
    
- Failure Response：
    
    ```json
    // 帳號或密碼錯誤 if account or password is not correct
    Status Code: 500
    {
      "status": "error",
      "message": "Error: Account or Password error!"
    }
    
    // 使用者禁止登入管理者後台，管理者也禁止登入前台
    // if user insist to login on admin's login page or admin insist to login on user's login page
    Status Code: 403
    {
      "status": "error",
      "message": "Error: permission denied"
    }
    ```
    

#### 2. 管理者可以瀏覽所有使用者清單：GET /api/admin/users

- HTTP Method : GET
- Request Parameters：No
- Request Body ：No
- Success Response：
  - data type: Array of Object
    
    ```json
    Status Code: 200
    [
      {
        "id": 13,
        "account": "user1",
        "name": "user1",
        "avatar": "https://loremflickr.com/320/240/paris,girl/all",
        "banner": "https://loremflickr.com/320/240/beach",
        "tweetCounts": 10,
        "likeCounts": 3,
        "followingCounts": 2,
        "followerCounts": 6
      },
      {
        "id": 14,
        "account": "user2",
        "name": "user2",
        "avatar": "https://loremflickr.com/320/240/paris,girl/all",
        "banner": "https://loremflickr.com/320/240/beach",
        "tweetCounts": 10,
        "likeCounts": 3,
        "followingCounts": 8,
        "followerCounts": 6
      },

    ......
    ]
    ```
    
- Failure Response：
    
    ```json
    // 未通過登入驗證
    Status Code: 401
    {
      "status": "error",
      "message": "unauthorized"
    }
    
    // current user's role 不是 admin
    Satus Code: 403
    {
      "status": "error",
      "message": "account not exist"
    }
    
    // 沒有任何一筆 user 資料
    // 理論上來說，這個情況應該不可能發生，至少還是會有 root 這個人
    // 未知實際情況會如何，還是放進來
    Satus Code: 500
    {
      "status": "error",
      "message": "Target users not exist."
    }
    ```
    

#### 3. 管理者可以瀏覽全站的 tweets：GET /api/admin/tweets

- HTTP Method : GET
- Request Parameters：No
- Request Body ：No
- Success Response：
  - data type: Array of Object
  - description 已處理成只取前 50 字
  - 依照發文時間排序，新到舊
    
    ```json
    Status Code: 200
    [
      {
        "id": 215,
        "description": "Elephants can smell water sources up to 19.2 km aw",
        "createdAt": "2022-08-02T14:42:47.000Z",
        "user": {
          "id": 13,
          "name": "user1",
          "account": "user1",
          "avatar": "https://loremflickr.com/320/240/paris,girl/all"
        }
      },
      {
        "id": 214,
        "description": "8b8b8b8b8b8b8b8bbooloo8b8b8b8b8b8b8b8bbooloo8b8b8b",
        "createdAt": "2022-08-02T14:40:39.000Z",
        "user": {
          "id": 13,
          "name": "user1",
          "account": "user1",
          "avatar": "https://loremflickr.com/320/240/paris,girl/all"
        }
      },
      {
        "id": 213,
        "description": "8b8b8b8b8b8b8b8bbooloo",
        "createdAt": "2022-08-02T14:40:36.000Z",
        "user": {
          "id": 13,
          "name": "user1",
          "account": "user1",
          "avatar": "https://loremflickr.com/320/240/paris,girl/all"
        }
      },

    ......
    ]
    ```
    
- Failure Response：
    
    ```json
    // 未通過登入驗證
    Status Code: 401
    {
      "status": "error",
      "message": "unauthorized"
    }
    
    // current user's role 不是 admin
    Satus Code: 403
    {
      "status": "error",
      "message": "account not exist"
    }
    
    // 沒有任何一筆 tweet 資料
    // 相較於找不到任何一筆 user 資料，找不到任何一筆 tweet 資料比較有可能發生
    Satus Code: 500
    {
      "status": "error",
      "message": "Target tweets not exist."
    }
    ```
    

#### 4. 管理者可以刪除任一則 tweet：DELETE /api/admin/tweets/:id

- HTTP Method : DELETE
- Request Parameters：
    
    | Index | Request Name  | Type    | Required | Example              |
    | ----- | ------------- | ------- | -------- | -------------------- |
    | 1     | tweet id      | INTEGER | True     | 1                    |
- Request Body ：No
- Success Response：
    
    ```json
    // 成功刪除該筆 tweet
    Status Code: 200
    {
      "status": "success"
    }
    ```
    
- Failure Response：
    
    ```json
    // 未通過登入驗證
    Status Code: 401
    {
      "status": "error",
      "message": "unauthorized"
    }

    // current user's role 不是 admin
    Status Code: 403
    {
      "status": "error",
      "message": "account not exist"
    }

    // 缺少 request params
    Status Code: 500
    {
      "status": "error",
      "message": "Error: Params id is required."
    }

    // 欲刪除的該則 tweet 不存在
    Status Code: 500
    {
      "status": "error",
      "message": "Error: This tweet doesn't exist."
    }
    ```

### Followship APIs

#### 1. 使用者可以追蹤其他使用者：POST /api/followships

- HTTP Method : POST
- Request Parameters：No
- Request Body ：追蹤按鈕請一定要用表單，不然後端收不到（因為測試檔這樣規定）
    
    | Index | Request Name  | Type    | Required | Example              |
    | ----- | ------------- | ------- | -------- | -------------------- |
    | 1     | user_id       | INTEGER | True     | 7                    |
- Success Response：
    
    ```json
    // 已成功追蹤
    Status Code: 200
    {
      "status": "success"
    }
    ```
    
- Failure Response：
    
    ```json
    // current user's role 不是 user
    Status Code: 403
    {
      "status": "error",
      "message": "account not exist"
    }
    
    // 後端沒收到被追蹤者的 user id，被追蹤者的 user id 資料型別不是 number
    Status Code: 500
    {
      "status": "error",
      "message": "Error: Target user id is required."
    }
    
    // 使用者不能追蹤自己
    Status Code: 500
    {
      "status": "error",
      "message": "Error: Current uesr can't follow itself."
    }
    
    // 使用者不能追蹤任何一位 admin
    Status Code: 500
    {
      "status": "error",
      "message": "Error: Current uesr can't follow admin."
    }
    
    // 使用者要追蹤的這個人不存在
    Status Code: 500
    {
      "status": "error",
      "message": "Error: Target user doesn't exist."
    }
    
    // 使用者已經追蹤過此人
    Status Code: 500
    {
      "status": "error",
      "message": "Error: User has already followed the target user."
    }
    ```
    

#### 2. 使用者可以取消追蹤其他使用者：DETELE /api/followships/:followingId

- HTTP Method : DELETE
- Request Parameters：
    
    | Index | Request Name  | Type    | Required | Example              |
    | ----- | ------------- | ------- | -------- | -------------------- |
    | 1     |  followingId  | INTEGER | True     | 2                    |
- Request Body ：No
- Success Response：
    
    ```json
    // 已取消追蹤
    Status Code: 200
    {
      "status": "success"
    }
    ```
    
- Failure Response：
    
    ```json
    // current user's role 不是 user
    Status Code: 403
    {
      "status": "error",
      "message": "account not exist"
    }
    
    // 後端沒收到被追蹤者的 user id
    Status Code: 500
    {
      "status": "error",
      "message": "Error: Params target user id is required."
    }
    
    // 使用者不能取消追蹤任何一位 admin
    Status Code: 500
    {
      "status": "error",
      "message": "Error: Current uesr can't unfollow admin."
    }
    
    // 使用者要取消追蹤的這個人不存在
    Status Code: 500
    {
      "status": "error",
      "message": "Error: Target user not exist."
    }
    
    // 使用者根本沒追蹤過此人
    Status Code: 500
    {
      "status": "error",
      "message": "Error: You have not followed target user."
    }
    
    ```
    

#### 3. 使用者可以看到最多人追蹤的 10 個人：GET /api/followships/top_users

- HTTP Method : GET
- Request Parameters：No
- Request Body ：No
- Success Response：
    - Types : Array
    - 依照追蹤人數`followerCounts`排序，由多到少
    - `"isFollowed": false/ true` ：登入的使用者是否有追蹤 top users
    
    ```json
    [
      {
        "id": 17,
        "account": "user5",
        "name": "user5",
        "avatar": "https://loremflickr.com/320/240/paris,girl/all",
        "followerCounts": 8,
        "isFollowed": true
      },
      {
        "id": 20,
        "account": "user8",
        "name": "user8",
        "avatar": "https://loremflickr.com/320/240/paris,girl/all",
        "followerCounts": 8,
        "isFollowed": true
      },
      {
        "id": 19,
        "account": "user7",
        "name": "user7",
        "avatar": "https://loremflickr.com/320/240/paris,girl/all",
        "followerCounts": 7,
        "isFollowed": false
      },
      {
        "id": 13,
        "account": "user1",
        "name": "user1",
        "avatar": "https://loremflickr.com/320/240/paris,girl/all",
        "followerCounts": 6,
        "isFollowed": false
      },
      {
        "id": 14,
        "account": "user2",
        "name": "user2",
        "avatar": "https://loremflickr.com/320/240/paris,girl/all",
        "followerCounts": 6,
        "isFollowed": false
      },
      {
        "id": 18,
        "account": "user6",
        "name": "user6",
        "avatar": "https://loremflickr.com/320/240/paris,girl/all",
        "followerCounts": 5,
        "isFollowed": false
      },

    ...... 總共 10 筆
    ]
    ```
    
- Failure Response：
    
    ```json
    // current user's role 不是 user
    Status Code: 403
    {
      "status": "error",
      "message": "account not exist"
    }
    
    // 沒有任何一筆 user 資料
    Status Code: 500
    {
      "status": "error",
      "message": "Target users not exist."
    }
    ```
    
### Tweet APIs

#### 1. 使用者可以撰寫 tweet：POST /api/tweets

- HTTP Method : POST
- Request Parameters：No
- Request Body ：撰寫 tweet 的表單內的資料
    
    | Index | Request Name  | Type    | Required | Example              |
    | ----- | ------------- | ------- | -------- | -------------------- |
    | 1     | description   | TEXT    | True     | Elephants can fly... |
  - 後端收到的格式範例如下
        
      ```json
      {
          "description": "8b8b8b8b8b8b8b8bbooloo"
      }
      ```
        
- Success Response：
    
    ```json
    // 成功新增一筆 tweet
    Status Code: 200
    {
      "status": "success"
    }
    ```
    
- Failure Response：
    
    ```json
    // current user's role 不是 user
    Satus Code: 403
    {
      "status": "error",
      "message": "account not exist"
    }
    
    // server 沒收到使用者的 tweet 內容
    // 或 tweet 內容空白（全部都打空白鍵也會視為空白 tweet）
    Status Code: 500
    {
      "status": "error",
      "message": "Error: Target tweet description is required."
    }
    
    // tweet 字數超過 140 字
    Status Code: 500
    {
      "status": "error",
      "message": "Error: Characters length of tweet should be less than 140."
    }
    ```
    

#### 2. 使用者可以看到所有 tweet：GET /api/tweets

- HTTP Method : GET
- Request Parameters：No
- Request Body ：No
- Success Response：
    
    ```json
    Status Code: 200
    [
      {
        "id": 216,
        "description": "Elephants can smell water sources up to 19.2 km away. How cool is that!",
        "createdAt": "2022-08-03T05:39:30.000Z",
        "user": {
          "id": 13,
          "account": "user1",
          "name": "user1",
          "avatar": "https://loremflickr.com/320/240/paris,girl/all"
        },
        "isLiked": false,
        "likesCounts": 0,
        "repliesCounts": 0
      },
      {
        "id": 215,
        "description": "Elephants can smell water sources up to 19.2 km away. How cool is that!",
        "createdAt": "2022-08-02T14:42:47.000Z",
        "user": {
          "id": 13,
          "account": "user1",
          "name": "user1",
          "avatar": "https://loremflickr.com/320/240/paris,girl/all"
        },
        "isLiked": true,
        "likesCounts": 1,
        "repliesCounts": 0
      },
      {
        "id": 214,
        "description": "8b8b8b8b8b8b8b8bbooloo8b8b8b8b8b8b8b8bbooloo8b8b8b8b8b8b8b8bbooloo8b8b8b8b8b8b8b8bbooloo",
        "createdAt": "2022-08-02T14:40:39.000Z",
        "user": {
          "id": 13,
          "account": "user1",
          "name": "user1",
          "avatar": "https://loremflickr.com/320/240/paris,girl/all"
        },
        "isLiked": false,
        "likesCounts": 0,
        "repliesCounts": 0
      },

    ......
    ]
    ```
    
- Failure Response：
    
    ```json
    // current user's role 不是 user
    Satus Code: 403
    {
      "status": "error",
      "message": "account not exist"
    }
    
    // 資料庫內沒有任何一則 tweet
    Status Code: 500
    {
      "status": "error",
      "message": "Error: Not any tweet has been post!"
    }
    ```
    

#### 3. 使用者可以看到特定一則 tweet：GET /api/tweets/:tweet_id

- HTTP Method : GET
- Request Parameters：
    
    | Index | Request Name  | Type    | Required | Example              |
    | ----- | ------------- | ------- | -------- | -------------------- |
    | 1     | tweet_id      | INTEGER | True     | 20                   |
- Request Body ：No
- Success Response：
    
    ```json
    Status Code: 200
    {
      "id": 215,
      "description": "Elephants can smell water sources up to 19.2 km away. How cool is that!",
      "createdAt": "2022-08-02T14:42:47.000Z",
      "user": {
        "id": 13,
        "account": "user1",
        "name": "user1",
        "avatar": "https://loremflickr.com/320/240/paris,girl/all"
      },
      "isLiked": true,
      "likeCounts": 1,
      "replyCounts": 0
    }
    ```
    
- Failure Response：
    
    ```json
    // current user's role 不是 user
    Satus Code: 403
    {
      "status": "error",
      "message": "account not exist"
    }
    
    // 後端沒收到 /:tweet_id
    Status Code: 500
    {
      "status": "error",
      "message": "Error: Params tweet_id is required."
    }
    
    // 沒有該則 tweet
    Status Code: 500
    {
      "status": "error",
      "message": "Error: Target tweet not exist."
    }
    ```
    
### Reply APIs

#### 1. 使用者可以回覆特定一則 tweet：POST /api/tweets/:tweet_id/replies

- HTTP Method : POST
- Request Parameters：
    
    | Index | Request Name  | Type    | Required | Example              |
    | ----- | ------------- | ------- | -------- | -------------------- |
    | 1     | tweet_id      | INTEGER | True     | 77                   |
- Request Body ：撰寫回文的表單內的資料
    
    | Index | Request Name  | Type    | Required | Example              |
    | ----- | ------------- | ------- | -------- | -------------------- |
    | 1     | comment       | TEXT    | True     | Elephants can fly... |
- Success Response：
    
    ```json
    {
      "status": "success"
    }
    ```
    
- Failure Response：
    
    ```json
    // 若是回覆內容空白
    Status Code: 500
    {
      "status": "error",
      "message": "Error: comment field is required."
    }
    // 若是回覆字數超過140個字
    Status Code: 500
    {
      "status": "error",
      "message": "Error: Characters length of comment should be less than 140."
    }
    // 若是回覆的推文不存在
    Status Code: 500
    {
      "status": "error",
      "message": "Error: Target tweet not exist"
    }
    ```
    

#### 2. 使用者可以看到特定一則 tweet 的所有回覆：GET /api/tweets/:tweet_id/replies

- HTTP Method : GET
- Request Parameters：
    
    | Index | Request Name  | Type    | Required | Example              |
    | ----- | ------------- | ------- | -------- | -------------------- |
    | 1     | tweet_id      | INTEGER | True     | 77                   |
- Request Body ：No
- Success Response：
    
    ```json
    [
      {
        "id": 1234,
        "userId": 34,
        "tweetId": 311,
        "comment": "Reiciendis sint sint laudantium culpa incidunt laborum distinctio ratione aut. Neque et quo. Natus iusto aut fugit molestiae explicabo facer",
        "createdAt": "2022-08-03T10:13:22.000Z",
        "updatedAt": "2022-08-03T10:13:22.000Z",
        "UserId": 34,
        "TweetId": 311,
        "replyUser": {
          "id": 34,
          "name": "user9",
          "account": "user9",
          "avatar": "https://loremflickr.com/320/240/paris,girl/all"
        },
        "tweetUser": {
          "id": 26,
          "name": "user1",
          "account": "user1"
        }
      },
      {
        "id": 1235,
        "userId": 29,
        "tweetId": 311,
        "comment": "Aut doloribus nemo magni voluptas soluta temporibus nobis blanditiis. Qui commodi tenetur. Asperiores voluptatibus voluptate. Expedita iusto",
        "createdAt": "2022-08-03T10:13:22.000Z",
        "updatedAt": "2022-08-03T10:13:22.000Z",
        "UserId": 29,
        "TweetId": 311,
        "replyUser": {
          "id": 29,
          "name": "user4",
          "account": "user4",
          "avatar": "https://loremflickr.com/320/240/paris,girl/all"
        },
        "tweetUser": {
          "id": 26,
          "name": "user1",
          "account": "user1"
        }
      },
      {
        "id": 1236,
        "userId": 28,
        "tweetId": 311,
        "comment": "Ut reiciendis odio. Atque eos quia veritatis quia amet perferendis qui soluta autem. Quos et cum quo dicta quod molestias.",
        "createdAt": "2022-08-03T10:13:22.000Z",
        "updatedAt": "2022-08-03T10:13:22.000Z",
        "UserId": 28,
        "TweetId": 311,
        "replyUser": {
          "id": 28,
          "name": "user3",
          "account": "user3",
          "avatar": "https://loremflickr.com/320/240/paris,girl/all"
        },
        "tweetUser": {
          "id": 26,
          "name": "user1",
          "account": "user1"
        }
      }
    ]
    ```
    
- Failure Response：
    
    ```json
    // 若是推文不存在
    Status Code: 500
    {
      "status": "error",
      "message": "Error: Target tweet not exist"
    }
    ```
    
### Like APIs

#### 1. 使用者可以對特定一則 tweet 點擊愛心：POST /api/tweets/:id/like

- HTTP Method : POST
- Request Parameters：
    
    | Index | Request Name  | Type    | Required | Example              |
    | ----- | ------------- | ------- | -------- | -------------------- |
    | 1     | tweet_id      | INTEGER | True     | 77                   |
- Request Body：No
- Success Response：
    
    ```json
    
    // 已點擊喜歡
    Status Code: 200
    {
      "status": "success"
    }
    ```
    
- Failure Response：
    
    ```json
    // current user's role 不是 user
    Status Code: 403
    {
      "status": "error",
      "message": "account not exist"
    }
    
    // 後端沒收到 /:id
    // 這裡的 /:id 是 tweet id
    Status Code: 500
    {
      "status": "error",
      "message": "Error: Params id is required."
    }
    ```
    

#### 2. 使用者可以對特定一則 tweet 收回點擊過的愛心：POST /api/tweets/:id/unlike

- HTTP Method : POST
- Request Parameters：
    
    | Index | Request Name  | Type    | Required | Example              |
    | ----- | ------------- | ------- | -------- | -------------------- |
    | 1     | tweet_id      | INTEGER | True     | 77                   |
- Request Body：No
- Success Response：
    
    ```json
    // 已取消點擊過的喜歡
    Status Code: 200
    {
      "status": "success"
    }
    ```
    
- Failure Response：
    
    ```json
    // current user's role 不是 user
    Status Code: 403
    {
      "status": "error",
      "message": "account not exist"
    }
    
    // 後端沒收到 /:id
    // 這裡的 /:id 是 tweet id
    Status Code: 500
    {
      "status": "error",
      "message": "Error: Params id is required."
    }
    
    // current user 根本沒對這則 tweet 點擊過喜歡
    Status Code: 500
    {
      "status": "error",
      "message": "Error: Current user has not liked this tweet."
    }
    
    ```
