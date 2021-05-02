# Simple Twitter
test this repo on heroku: https://twitter-socket-1.herokuapp.com/

## 環境建置與需求 (prerequisites)

#### 伺服器（server） 
- Node.js 10.15.0
- express 4.16.4

#### 身份驗證（authentication）
- passport 0.4.0
-  passport-jwt 4.0.0
- jsonwebtoken 8.5.1

#### 資料庫（database）
- MySQL 8.0.23
- sequelize 4.42.0
- sequelize-cli 5.5.0
- mysql2 1.6.4

#### 即時聊天（live chat）
- socket.io 4.0.1

## 本地安裝（local install）
1. Download repo:`git clone https://github.com/s091173/twitter-api-2020.git`
2. Move to repo folder: `cd twitter-api-2020`
3. Install package: `npm install`
4. Setup database: 
    - `create database ac_twitter_workspace`
    - `npx sequelize db:migrate`
    - `npx sequelize db:seed:all`
5. Create .env file
6. start server: `npm run dev

## Feature: twitter API

### 瀏覽所有 tweet 及其作者
**method & URL**
```
GET /api/tweets
```

**Response**

Success （依依推文發表時間 DESC 排序，只列出一筆 tweet 示意）
```
status code: 200
{
  "id": 63,
  "UserId": 1,
  "description": "Debitis corrupti sunt ducimus voluptatem officia.",
  "createdAt": "2021-04-24T05:20:58.000Z",
  "updatedAt": "2021-04-24T05:20:58.000Z",
  "replyCount": 0,
  "likeCount": 0,
  "isLiked": false,
  "User": {
    "id": 2,
    "account": "user1@example.com",
    "name": "User1",
    "avatar": "https://loremflickr.com/640/480/person?random=70&lock=117"
  }
}
```

### 瀏覽一筆 tweet 及其 reply
**method & URL**
```
GET /api/tweets/:tweetId
```

**Response**

Success （Replies 及 Likes 只列出一筆示意）
```
status code: 200
{
  "id": 3,
  "UserId": 1,
  "description": "Debitis corrupti sunt ducimus voluptatem officia.",
  "createdAt": "2021-04-23T09:17:16.000Z",
  "updatedAt": "2021-04-23T09:17:16.000Z",
  "User": {
    "id": 1,
    "email": "root@example.com",
    "name": "Admin",
    "avatar": "https://loremflickr.com/640/480/person?random=78&lock=898",
    "introduction": "My name is Admin",
    "role": "admin",
    "account": "root@example.com",
    "cover": "https://loremflickr.com/640/480/nature?random=90&lock=157",
    "createdAt": "2021-04-23T09:17:15.000Z",
    "updatedAt": "2021-04-23T09:17:15.000Z"
  },
  "Replies": [
    {
      "id": 7,
      "UserId": 1,
      "TweetId": 3,
      "comment": "omnis",
      "createdAt": "2021-04-23T09:17:16.000Z",
      "updatedAt": "2021-04-23T09:17:16.000Z",
      "User": {
        "id": 1,
        "email": "root@example.com",
        "name": "Admin",
        "avatar": "https://loremflickr.com/640/480/person?random=78&lock=898",
        "role": "admin",
        "account": "root@example.com",
        "cover": "https://loremflickr.com/640/480/nature?random=90&lock=157",
        "createdAt": "2021-04-23T09:17:15.000Z",
        "updatedAt": "2021-04-23T09:17:15.000Z"
      }
    }
  ],
  "replyCount": 3,
  "likeCount": 1,
  "isLiked": false
}
```

### 新增一筆 tweet
**method & URL**
```
POST /api/tweets
```

**Parameter**

| Params      | Require | Type         |
| ----------- | ------- | ------------ |
| description | true    | string (140) |

**Response**

Success
```
status code: 200
{ 
  "status": "success", 
  "message": "Success."
}
```
Failure
```
status code: 400
{
  "status": "error",
  "message": "Please enter description"
}
```
```
status code: 400
{
  "status": "error",
  "message": "The description field can have no more than 140 characters"
}
```

### 按讚一筆 tweet
**method & URL**
```
POST /api/tweets/:id/like
```

**Response**

Success
```
status code: 200
{ 
  "status": "success", 
  "message": "Success."
}
```
Failure
```
status code: 400
{
  "status": "error",
  "message": "Tweet doesn't exist"
}
```
```
status code: 400
{
  "status": "error",
  "message": "You already liked this tweet"
}
```

### 取消按讚一筆 tweet
**method & URL**
```
POST /api/tweets/:id/unlike
```

**Response**

Success
```
status code: 200
{ 
  "status": "success", 
  "message": "Success."
}
```
Failure
```
status code: 400
{
  "status": "error",
  "message": "Tweet doesn't exist"
}
```
```
status code: 400
{
  "status": "error",
  "message": "You haven't liked this tweet before"
}
```

### 新增一筆 reply
**method & URL**
```
POST /api/tweets/:tweetId/replies
```

**Parameter**

| Params  | Require | Type         |
| ------- | ------- | ------------ |
| comment | true    | string (140) |

**Response**

Success
```
status code: 200
{ 
  "status": "success", 
  "message": "Reply tweet successfully"
}
```
Failure
```
status code: 400
{
  "status": "error",
  "message": "Tweet doesn't exist"
}
```
```
status code: 400
{
  "status": "error",
  "message": "Write the comment before reply"
}
```
```
status code: 400
{
  "status": "error",
  "message": "The comment field can have no more than 140 characters"
}
```

### 瀏覽一筆推文的 reply
**method & URL**
```
GET /api/tweets/:tweetId/replies
```

**Response**

Success（只列出一筆 reply 示意）
```
status code: 200
[
  {
    "id": 13,
    "UserId": 6,
    "TweetId": 5,
    "comment": "In sed laboriosam nisi labore possimus.",
    "createdAt": "2021-04-21T06:14:38.000Z",
    "updatedAt": "2021-04-21T06:14:38.000Z",
    "User": {
      "id": 6,
      "email": "user5@example.com",
      "name": "User5",
      "avatar": "https://loremflickr.com/640/480/person?random=66&lock=354",
      "introduction": "My name is user5",
      "role": "user",
      "account": "user5@example.com",
      "cover": "https://loremflickr.com/640/480/nature?random=7&lock=212",
      "createdAt": "2021-04-21T06:14:37.000Z",
      "updatedAt": "2021-04-21T06:14:37.000Z"
    }
  }
]
```
Failure
```
status code: 400
{
  "status": "error",
  "message": "Reply doesn't exist"
}
```

### 瀏覽某位使用者的 tweet
**method & URL**
```
GET /api/users/:id/tweets
```

**Response**

Success （依推文發表時間 DESC 排序，只列出一筆 tweet 示意）
```
status code: 200
[
  {
    "id": 21,
    "description": "Repudiandae atque iste blanditiis aut voluptatibus praesentium.",
    "createdAt": "2021-04-23T09:17:16.000Z",
    "replyCount": 3,
    "likeCount": 1,
    "isLiked": true,
    "User": {
      "id": 3,
      "account": "user2@example.com",
      "name": "User2",
      "avatar": "https://loremflickr.com/640/480/person?random=10&lock=970"
    }
  }
]
```
Failure
```
status code: 400
{
  "status": "error",
  "message": "id should be an integer."
}
```
```
status code: 404
{
  "status": "error",
  "message": "Tweet not found."
}
```

### 瀏覽某使用者回覆過的 tweet （含 reply）
**method & URL**
```
GET /api/users/:id/replied_tweets
```

**Response**

Success （依回覆時間 DESC 排序，只列出兩筆資料示意）
```
status code: 200
[
  {
    "ReplyId": 7,
    "comment": "omnis",
    "createdAt": "2021-04-23T09:17:16.000Z",
    "Tweet": {
      "TweetId": 3,
      "description": "Debitis corrupti sunt ducimus voluptatem officia.",
      "createdAt": "2021-04-23T09:17:16.000Z",
      "replyCount": 3,
      "likeCount": 1,
      "isLiked": true,
      "User": {
        "id": 1,
        "account": "root@example.com",
        "name": "Admin",
        "avatar": "https://loremflickr.com/640/480/person?random=78&lock=898"
      }
    }
  },
  {
    "ReplyId": 11,
    "comment": "Consequatur dolorem error iure nam voluptatem sit consequatur.",
    "createdAt": "2021-04-23T09:17:16.000Z",
    "Tweet": null
}]
```
```
status code: 200
null
```
Failure
```
status code: 400
{
  "status": "error",
  "message": "id should be an integer."
}
```

### 瀏覽某使用者按讚過的 tweet
**method & URL**
```
GET /api/users/:id/likes
```

**Response**

Success （依按讚時間 DESC 排序，只列出兩筆資料示意）
```
status code: 200
[
  {
    "TweetId": 5,
    "description": "Labore nihil quis saepe.",
    "createdAt": "2021-04-23T09:17:16.000Z",
    "replyCount": 3,
    "likeCount": 1,
    "isLiked": true,
    "User": {
      "id": 1,
      "account": "root@example.com",
      "name": "Admin",
      "avatar": "https://loremflickr.com/640/480/person?random=78&lock=898"
    }
  }
]
```
```
status code: 200
null
```
Failure
```
status code: 400
{
  "status": "error",
  "message": "id should be an integer."
}
```

### 瀏覽某使用者跟隨中的 user
**method & URL**
```
GET /api/users/:id/followings
```

**Response**

Success （依跟隨時間 DESC 排序，只列出一筆資料示意）
```
status code: 200
[
  {
    "followingId": 5,
    "name": "User4",
    "account": "user4@example.com",
    "avatar": "https://loremflickr.com/640/480/person?random=76&lock=82",
    "introduction": "My name is user4",
    "isFollowed": true
  }
]
```
```
status code: 200
null
```
Failure
```
status code: 400
{
  "status": "error",
  "message": "id should be an integer."
}
```

瀏覽某使用者的跟隨者
**method & URL**
```
GET /api/users/:id/followers
```

**Response**

Success （依跟隨時間 DESC 排序，只列出一筆資料示意）
```
status code: 200
[
  {
    "followerId": 3,
    "name": "User2",
    "account": "user2@example.com",
    "avatar": "https://loremflickr.com/640/480/person?random=88&lock=59",
    "introduction": "My name is user2",
    "isFollowed": true
  }
]
```
```
status code: 200
null
```

### 瀏覽一筆 user
**method & URL**
```
GET /api/users/:id
```

**Response**

Success
```
status code: 200
{
  "id": 3,
  "account": "user2@example.com",
  "name": "User2",
  "email": "user2@example.com",
  "introduction": "My name is user2",
  "avatar": "https://loremflickr.com/640/480/person?random=10&lock=970",
  "cover": "https://loremflickr.com/640/480/nature?random=76&lock=282",
  "tweetCount": 10,
  "followingCount": 0,
  "followerCount": 1,
  "isFollowed": true
}
```
Failure
```
status code: 400
{
  "status": "error",
  "message": "id should be an integer."
}
```
```
status code: 404
{
  "status": "error",
  "message": "User not found."
}
```
```
status code: 400
{
  "status": "error",
  "message": "Cannot view administrator."
}
```

### 瀏覽最多人跟隨的前十個 user
**method & URL**
```
GET /api/users/top
```

**Response**

Success（只列出一筆 topUser 示意）
```
status code: 200
{
  "currentUserId": 2,
  "topUsers": [
    {
      "id": 6,
      "account": "user5@example.com",
      "name": "User5",
      "avatar": "https://loremflickr.com/640/480/person?random=52&lock=459",
      "followerCount": 2,
      "isFollowed": true
    }
  ]
}
```
```
status code: 200
null
```

### 瀏覽當前使用者
**method & URL**
```
GET /api/users/current
```

**Response**

Success
```
status code: 200
{ 
  "currentUser": {
    "id": 1,
    "name": "Admin",
    "account": "root@example.com",
    "email": "root@example.com",
    "avatar": "https://loremflickr.com/640/480/person?random=78&lock=898",
    "isAdmin": true
  }
}
```
Failure
```
status code: 404
{
  "status": "error",
  "message": "Current user not found."
}
```

### 取消跟隨某個使用者
**method & URL**
```
DELETE /api/followships/:followingId
```

**Response**

Success
```
status code: 200
{ 
  "status": "success", 
  "message": "Done."
}
```
Failure
```
status code: 400
{
  "status": "error",
  "message": "id should be an integer."
}
```
```
status code: 404
{
  "status": "error",
  "message": "You cannot unfollow a user you are not following."
}
```

### 跟隨某個使用者
**method & URL**
```
POST /api/followships
```

**Parameter**

| Params | Require | Type   |
| ------ | ------- | ------ |
| id     | true    | string |

**Response**

Success
```
status code: 200
{ 
  "status": "success", 
  "message": "Done."
}
```
Failure
```
status code: 400
{
  "status": "error",
  "message": "Please fill out the id field."
}
```
```
status code: 400
{
  "status": "error",
  "message": "Cannot follow yourself."
}
```
```
status code: 400
{
  "status": "error",
  "message": "id should be an integer."
}
```
```
status code: 404
{
  "status": "error",
  "message": "The user you want to follow dose not exist."
}
```
```
status code: 400
{
  "status": "error",
  "message": "Cannot follow administrator."
}
```
```
status code: 400
{
  "status": "error",
  "message": "You have already followed this user."
}
```


### 註冊
**method & URL**
```
POST /api/users
```

**Parameter**

| Params        | Require | Type          |
| ------------- | ------- | ------------- |
| account       | true    | string (255)  |
| name          | true    | string (25)   |
| email         | true    | string (255)  |
| password      | true    | string (255)  |
| checkPassword | true    | string        |

**Response**

Success
```
status code: 200
{ 
  "status": "success", 
  "message": "Registered"
}
```
Failure
```
status code: 400
{
  "message": [
    "Password and checkPassword are not match",
    "Invalid email address",
    "The name field can have no more than 25 characters"
  ]
}
```
```
status code: 400
{
  "message": [
    "Account already exist",
    "Email alreay exist"
  ]
}
```

### 編輯 profile
**method & URL**
```
PUT /api/users/:id
```

**Parameter**

| Params | Require | Type   |
| ------ | ------- | ------ |
| name     | false    | string |
| introduction | false | string |
| avatar | false | files |
| cover  | false | files |

**Response**

Success
```
status code: 200
{ 
  "status": "success", 
  "message": "Success"
}
```
Failure
```
status code: 403
{
  "status": "error",
  "message": "Unauthorized to edit user"
}
```
```
status code: 400
{
  "status": "error",
  "message": "The name field can have no more than 25 characters"
}
```
```
status code: 400
{
  "status": "error",
  "message": "The introduction field can have no more than 140 characters"
}
```

### 編輯帳戶設定
**method & URL**
```
PUT /api/users/:id/account
```

**Parameter**

| Params | Require | Type   |
| ------ | ------- | ------ |
| account | false | files |
| name | false    | string |
| email     | false    | string |
| password | false | string |
| checkPassword  | false | files |

**Response**

Success
```
status code: 200
{ 
  "status": "success", 
  "message": "Updated successfully"
}
```
Failure
```
status code: 400
{
  "status": "error",
  "message": "Unauthorized to edit account"
}
```
```
status code: 400
{
  "status": "error",
  "message": [
    "Password and checkPassword are not match",
    "Invalid email address",
    "The name field can have no more than 25 characters",
    "The email field can have no more than 255 characters",
    "The account field can have no more than 255 characters",
    "The password field can have no more than 255 characters"
  ]
}
```
```
status code: 400
{
  "status": "error",
  "message": [
    "Account already exist",
    "Email alreay exist"
  ]
}
```

### 後台瀏覽所有使用者

**method & URL**
```
GET /api/admin/users
```

**Response**

Success （依推文數 DESC 排序，只列出一筆 user 示意）
```
status code: 200
[
  {
    "id": 1,
    "name": "Admin",
    "avatar": "https://loremflickr.com/640/480/person?random=84&lock=260",
    "account": "root@example.com",
    "cover": "https://loremflickr.com/640/480/nature?random=10&lock=400",
    "followerCount": 0,
    "followingCount": 0,
    "likedCount": 0,
    "tweetCount": 10
  }
]
```

### 後台瀏覽所有推文

**method & URL**
```
GET /api/admin/tweets
```

**Response**

Success （依推文發表日期 DESC 排序，description 只取前 50 個字，只列出一筆 tweet 示意）
```
status code: 200
[
  {
    "id": 1,
    "description": "iste",
    "createdAt": "2021-04-24T05:20:58.000Z",
    "User": {
      "id": 1,
      "account": "root@example.com",
      "name": "Admin",
      "avatar": "https://loremflickr.com/640/480/person?random=84&lock=260"
    }
  }
]
```

### 後台刪除一筆推文
**method & URL**
```
DELETE /api/admin/tweets/:id 
```

**Response**

Success
```
status code: 200
{
  "status": "success",
  "message": "Done."
}
```
Failure
```
status code: 400
{
  "status": "error",
  "message": "id should be an integer."
}
```
```
status code: 404
{
  "status": "error",
  "message": "The tweet you want to delete does not exist."
}
```

### 後台登入
**method & URL**
```
POST /api/admin/login
```

**Parameter**

| Params        | Require | Type    |
| ------------- | ------- | ------- |
| account       | true    | string  |
| password      | true    | string  |

**Response**

Success
```
status code: 200
{
  "status": "success",
  "message": "ok",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjE4OTA5NTAyLCJleHAiOjE2MTg5MzgzMDJ9.O3SigAWN89OO625GviuGEG3EIaO_idhymhRigO-xJtw",
  "user": {
    "id": 2,
    "email": "user1@example.com",
    "name": "User1",
    "avatar": "http://lorempixel.com/640/480/people",
    "introduction": "My name is user1",
    "role": "user",
    "account": "user1",
    "cover": "http://lorempixel.com/640/480/nature",
    "createdAt": "2021-04-20T01:39:16.000Z",
    "updatedAt": "2021-04-20T01:39:16.000Z"
  }
}
```
###### token 會在 8 小時後過期

Failure
```
status code: 400
{
  status: 'error',
  "message": "Required fields didn't exist."
}
```
```
status code: 400
{
  status: 'error',
  "message": "Account does not exist."
}
```
```
status code: 400
{
  status: 'error',
  "message": "Passwords does not match."
}
```
```
status code: 403
{
  status: 'error',
  "message": "Administrator only. User permission denied."
}
```

### 前台登入
**method & URL**
```
POST /api/users/login
```

**Parameter**

| Params        | Require | Type    |
| ------------- | ------- | ------- |
| account       | true    | string  |
| password      | true    | string  |

**Response**

Success
```
status code: 200
{
  "status": "success",
  "message": "ok",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjE4OTA5NTAyLCJleHAiOjE2MTg5MzgzMDJ9.O3SigAWN89OO625GviuGEG3EIaO_idhymhRigO-xJtw",
  "user": {
    "id": 2,
    "email": "user1@example.com",
    "name": "User1",
    "avatar": "http://lorempixel.com/640/480/people",
    "introduction": "My name is user1",
    "role": "user",
    "account": "user1",
    "cover": "http://lorempixel.com/640/480/nature",
    "createdAt": "2021-04-20T01:39:16.000Z",
    "updatedAt": "2021-04-20T01:39:16.000Z"
  }
}
```
###### token 會在 8 小時後過期

Failure
```
status code: 400
{
  status: 'error',
  "message": "Required fields didn't exist."
}
```
```
status code: 400
{
  status: 'error',
  "message": "Account does not exist."
}
```
```
status code: 400
{
  status: 'error',
  "message": "Passwords does not match."
}
```
```
status code: 403
{
  status: 'error',
  "message": "User only. Administrator permission denied."
}
```

### 驗證失敗

**Response**

```
status code: 403
{
  "status": "error",
  "message": "Administrator only. User permission denied."
}
```
```
status code: 403
{
  "status": "error",
  "message": "User only. Administrator permission denied."
}
```
```
status code: 401
{
  "status": "error",
  "message": "Unauthorized"
}
```

### 伺服器錯誤

**Response**

```
status code: 500
{
  "status": "error",
  "message": "Some error message"
}
```

## Feature: 即時聊天

### 取得公開聊天室歷史訊息 API

**method & URL**
```
GET /api/chat/public
```

**Response**

Success （依 chat 發表日期 ASC 排序，只列出一筆 chat 示意）
```
status code: 200
[
  {
    "id": 1,
    "message": "test",
    "createdAt": "2021-05-01T14:05:04.000Z",
    "userId": 2,
    "name": "User1",
    "avatar": "https://loremflickr.com/cache/resized/65535_51027414847_a5270072c8_z_640_480_nofilter.jpg"
  }
]
```

### 取得公開聊天室在線使用者 API

**method & URL**
```
GET /api/chat/public/online-users
```

**Response**

Success （只列出一筆 user 示意）
```
status code: 200
[
  {
    "id": 2,
    "name": "User1",
    "avatar": "https://loremflickr.com/640/480/person?random=90&lock=528",
    "socketId": [
      "v50Y7_ScCT-rugdSAAAA"
    ]
  }
]
```

### 客戶端通知伺服器使用者已上線

**客戶端發送通知方式**
```
socket.emit('public-room-online', currentUserId)
```

| Argument      | Type    |
| ------------- | ------- |
| currentUserId | integer |

### 伺服器通知客戶端，某個使用者已上線

（若一個使用者重複連線，僅通知一次）

**客戶端接收通知方式**

```
socket.on('public-room-online', data => {
  // do something
})
```

| Argument | Type   |
| -------- | ------ |
| data     | object |

```
console.log(data)
/*
{
  "online": {
    "id": 6,
    "name": "User5",
    "avatar": "https://loremflickr.com/640/480/person?random=2&lock=207",
    "socketId": [
      "bXMTrHRKSIyL8PNtAAAF"
    ]
  },
  "onlineUsers": [ // 只列出一筆 user 示意
    {
      "id": 6,
      "name": "User5",
      "avatar": "https://loremflickr.com/640/480/person?random=2&lock=207",
      "socketId": [
        "bXMTrHRKSIyL8PNtAAAF"
      ]
    }
  ]
}
*/
```

### 伺服器通知客戶端，某個使用者已離線
（同一個使用者所有連線皆已離線時，才會發送離線通知）

**客戶端接收通知方式**

```
socket.on('public-room-online', data => {
  // do something
})
```

| Argument | Type   |
| -------- | ------ |
| data     | object |

```
console.log(data)
/*
{
  "offline": {
    "id": 6,
    "name": "User5",
    "avatar": "https://loremflickr.com/640/480/person?random=2&lock=207",
    "socketId": []
  },
  "onlineUsers": [ // 只列出一筆 user 示意
    {
      "id": 5,
      "name": "User4",
      "avatar": "https://loremflickr.com/640/480/person?random=28&lock=2607",
      "socketId": [
        "yK1Ccm4gSb0nnFppAAAD"
      ]
    }
  ]
}
*/
```

