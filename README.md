# Simple Twitter RESTful API 
 這是一個使用 Node.js + Express + MySQL 建立的 Simple Twitter 後端專案，部署於 Heroku，以 RESTFul API 滿足社群網站不同資料的互動需求，搭配 [Simple-Twitter-Vue](https://github.com/chris1085/SimpleTwitter-vue) 前端專案，打造一個全方位的社群網站。
 
 ## 目錄
- [環境建置與需求 (Enviroment)](#環境建置與需求(Enviroment))
- [專案安裝流程 (Installing)](#專案安裝流程(Installing))
- [開發人員 (Contributor)](#開發人員(Contributor))
- [API文件](#API文件)

## 環境建置與需求(Enviroment)
### 伺服器（server）
* [Node.js](https://nodejs.org/en/) - v14.16.1
* [Express](https://expressjs.com/) - v4.17.1
### 資料庫（database）
* [sequelize](https://www.npmjs.com/package/sequelize) - v4.44.4
* [sequelize-cli](https://www.npmjs.com/package/sequelize-cli) - v5.5.1
* [mysql2](https://www.npmjs.com/package/mysql2) - v1.7.0
* [MySQL](https://www.mysql.com/) - v8.0.25
* [MySQL workbench](https://dev.mysql.com/downloads/) - v8.0.25
### 身份驗證（authentication）
* [passport](https://www.npmjs.com/package/passport) - v0.4.1
* [passport-jwt](https://www.npmjs.com/package/passport-jwt) - v 4.0.0
* [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - v8.5.1


## 專案安裝流程(Installing)
1. 請在終端機輸入

```
git clone https://github.com/wintersprouter/twitter-api-2020.git
cd twitter-api-2020
npm install  (請參考 package.json)
```

2. 建立.env

```
PORT='3000'
JWT_SECRET= xxx
IMGUR_CLIENT_ID= xxx
```


3. 使用 MySQL Workbench 建立資料庫
  * 需要與 config/config.json 一致

```
create database ac_twitter_workspace;
create database ac_twitter_workspace_test;
```

4. 在終端機輸入以下指令，進行資料庫遷移、種子資料初始化

```
npx sequelize db:migrate
npx sequelize db:seed:all
```

5. 在終端機輸入以下指令，啟動 swagger API 和 後端專案

```
npm run swagger-autogen
npm run dev
```

* 註: 在終端機輸入以下指令，可以清空種子資料

```
npx sequelize db:seed:undo:all
```
## 開發人員(Contributor)
* [Chia-Hui](https://github.com/wintersprouter)
* [Hsin Yeh](https://github.com/Hsinyehh)


## API文件網址
http://localhost:3000/api-doc/

  
## API說明
* 除了管理員、使用者登入和使用者註冊這 2 條路由外，其餘路由需在 header 的 Authorization 帶上"Bearer" + token (token可從登入時拿到)
* response 皆包含 http status code & message (說明成功狀態或是失敗原因)
### Base URL
* http://localhost:3000/api/{route}
* https://simpletwitter-api.herokuapp.com/api/{route}
### Demo 帳號
使用者可以使用以下帳號分別登入系統前台、後台。

|role| account | password |
| -------- | -------- | -------- |
| admin  | root   | 12345678  |
| user   | RyanHuang   | 12345678    
## API文件
 ### API 目錄
- [Sign in & Sign up](#Sign-in-&-Sign-up)
  - [前台使用者註冊](#前台使用者註冊)
  - [使用者或管理員登入](#使用者或管理員登入)
  
- [Tweets ](#Tweets)
  - [新增推文](#新增推文)
  - [瀏覽所有推文](#瀏覽所有推文)
  - [瀏覽一則推文詳情](#瀏覽一則推文詳情)
- [Reply](#Reply)
  - [瀏覽一則推文詳情](#瀏覽一則推文詳情)
  - [回覆一則推文](#回覆一則推文)
  - [瀏覽回覆](#瀏覽回覆)
  
- [Like](#Like)
  - [喜歡一則推文](#喜歡一則推文)
  - [取消喜歡一則推文](#取消喜歡一則推文)
 
- [Followship](#Followship) 
  - [追蹤一位使用者](#追蹤一位使用者)
  - [取消追蹤一位使用者](取消追蹤一位使用者)
 
- [Users](#Users)  
  - [瀏覽使用者的檔案](瀏覽使用者的檔案)
  - [編輯自己的使用者檔案](編輯自己的使用者檔案)
  - [編輯使用者帳戶資料](編輯使用者帳戶資料)
  - [瀏覽使用者跟隨者](瀏覽使用者跟隨者)
  - [瀏覽使用者跟隨中的人](瀏覽使用者跟隨中的人)
  - [瀏覽使用者發過的所有推文](瀏覽使用者發過的所有推文)
  - [瀏覽使用者的所有回覆](瀏覽使用者的所有回覆)
  - [瀏覽使用者所有點讚的推文](瀏覽使用者所有點讚的推文)
  - [目前登入的使用者](目前登入的使用者)
  - [全站追蹤者數量前 10 名的使用者名單](全站追蹤者數量前 10 名的使用者名單)
  
- [Admin](#Admin) 
   - [後台刪除一則貼文](後台刪除一則貼文)
   - [後台瀏覽所有使用者](後台瀏覽所有使用者)

## Sign in & Sign up
### 前台使用者註冊
##### Method & URL
```
POST /api/users
```
##### Request

| body   | Type   | Required |
| --------| ------ | ---------|
| account | Srting | True |
| name    | String | True |
| email   | String | True |
| password| String | True |

##### Response
###### Success
```
status code: 200
{
    "status": "success",
    "message": "@Lee sign up successfully.Please sign in."
}
```
###### Failure
##### email 或 account 重複註冊
```
status code: 400
{
    "status": "error",
    "message": [
        "This email address is already being used.",
        "This account is already being used."
    ]
}
```
##### 有未填欄位
```
status code: 400
{
    "status": "error",
    "message": [
        "All fields are required！"
    ]
}
```
##### 表單填寫錯誤原因
```
status code: 400
{
    "status": "error",
    "message": [
        "Name can not be longer than 50 characters.",
        "Account can not be longer than 20 characters.",
        "example.com is not a valid email address.",
        "Password does not meet the required length.",
        "The password and confirmation do not match.Please retype them."
    ]
}
```

### 使用者或管理員登入
##### Method & URL
```
POST /api/users/signin
```
##### Request

| body  | Type   | Required |
| --------| ------ | ---------|
| account | Srting | True |
| password| String | True |

##### Response
###### Success
```
status code: 200
{
    "status": "success",
    "message": "Sign in successfully.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiaWF0IjoxNjI1OTg5NzYzfQ.1eaLL0Qn19CMHeO33R93S80w3aHEz9LKhuWsso69W7w",
    "user": {
        "id": 7,
        "account": "Lee",
        "email": "lee@example.com",
        "name": "Lee",
        "avatar": "https://www.seekpng.com/png/full/114-1149972_avatar-free-png-image-avatar-png.png",
        "cover": "https://www.seekpng.com/png/full/153-1536586_free-facebook-cover-image-transparent-png-facebook-cover.png",
        "role": "user"
    }
}
```
###### Failure
##### 所有欄位都是必填的
```
status code: 422
{
    "status": "error",
    "message": [
        "All fields are required！"
    ]
}
```
##### 此帳號未註冊
```
status code: 401
{
    "status": "error",
    "message": [
        "That account is not registered!"
    ]
}
```
##### 帳號或密碼有誤
```
status code: 401
{
    "status": "error",
    "message": [
        "Account or Password incorrect."
    ]
}
```


## Tweets
### 新增推文
##### Method & URL
```
POST /api/tweets
```
##### Request

| body  | Type   | Required |
| --------| ------ | ---------|
| description | Srting | True |

##### Response
###### Success
```
status code: 200
{
    "status": "success",
    "message": "The tweet was successfully created."
}
```
###### Failure
##### 推文內容不得空白
```
status code: 400
{
    "status": "error",
    "message": [
        "Please input tweet."
    ]
}
```
##### 推文字數不得超過 140 字
```
status code: 409
{
    "status": "error",
    "message": [
        "Tweet can't be more than 140 words."
    ]
}
```

### 瀏覽所有推文
##### Method & URL
```
GET /api/tweets
```
##### Response
###### Success
```
status code: 200
[
    {
        "id": 30,
        "UserId": 3,
        "description": "dicta",
        "createdAt": "2021-07-01T22:57:24.000Z",
        "account": "AaronWang",
        "name": "Aaron",
        "avatar": "https://i.pravatar.cc/150?img=56",
        "likedCount": 0,
        "repliedCount": 3,
        "isLike": false
    },
    ...
]
```
###### Failure
##### 查無任何推文
```
status code: 404
{
    "status": "error",
    "message": [
        "Cannot find this tweets in db."
    ]
}
```


### 瀏覽一則推文詳情
##### Method & URL
```
GET /api/tweets/:tweet_id
```
#### Parameters
tweet_id：欲瀏覽的推文 id
##### Response
###### Success
```
status code: 200
{
    "status": "success",
    "message": "Get the tweet successfully",
    "id": 1,
    "UserId": 1,
    "description": "Aut enim reiciendis dicta quo ducimus tempora illum soluta. Eligendi nobis molestias hic. Numquam eos dignissimos doloribus nisi minus conse",
    "createdAt": "2021-03-24T03:10:18.000Z",
    "account": "RyanHuang",
    "name": "Ryan",
    "avatar": "https://i.pravatar.cc/150?img=68",
    "likedCount": 2,
    "repliedCount": 3,
    "isLike": true
}
```
###### Failure
##### 找不到該推文
```
status code: 404
{
    "status": "error",
    "message": [
        "Cannot find this tweet in db."
    ]
}
```



## Reply
### 回覆一則推文
##### Method & URL
```
POST /api/tweets/:tweet_id/replies
```
##### Request

| body   | Type   | Required |
| --------| ------ | ---------|
| comment | Srting | True |

#### Parameters
tweet_id：欲回覆的推文 id

##### Response
###### Success
```
status code: 200
{
    "status": "success",
    "message": "You replied @${repliedTweetAuthor}'s tweet successfully."
}
```
###### Failure
##### 找不到該推文
```
status code: 404
{
    "status": "error",
    "message": [
        "Cannot find this tweet in db."
    ]
}
```
##### 推文回覆空白
```
status code: 400
{
    "status": "error",
    "message": [
        "Please input comment."
    ]
}
```
##### 推文回覆超過50字
```
status code: 409
{
    "status": "error",
    "message": [
        "Comment can\'t be more than 50 words."
    ]
}
```

### 瀏覽回覆
##### Method & URL
```
GET /api/tweets/:tweet_id/replies
```
#### Parameters
tweet_id：瀏覽回覆的推文 id
##### Response
###### Success
```
status code: 200
[
    {
        "id": 2,
        "UserId": 3,
        "TweetId": 1,
        "tweetAuthorAccount": "RyanHuang",
        "comment": "Suscipit at rerum excepturi id ullam laboriosam at",
        "createdAt": "2021-06-22T17:24:32.000Z",
        "commentAccount": "AaronWang",
        "name": "Aaron",
        "avatar": "https://i.pravatar.cc/150?img=56"
    },
    ...
]
```
###### Failure
##### 找不到任何回覆
```
status code: 404
{
    "status": "error",
    "message": [
        "Cannot find any replies in db."
    ]
}
```


## Like
### 喜歡一則推文
##### Method & URL
```
POST /api/tweets/:id/like
```
#### Parameters
id：欲點like的推文 id
##### Response
###### Success
```
status code: 200
{
    "status": "success",
    "message": "You liked @${likedTweetAuthor}'s tweet successfully."
}
```
###### Failure
##### 找不到該推文
```
status code: 404
{
    "status": "error",
    "message": [
        "Cannot find this tweet in db."
    ]
}
```
##### 推文已被按讚
```
status code: 400
{
    "status": "error",
    "message": [
        "You already liked this tweet." 
    ]
}
```

### 取消喜歡一則推文
##### Method & URL
```
POST /api/tweets/:id/unlike
```
#### Parameters
id：欲取消like的推文 id

##### Response
###### Success
```
status code: 200
{
    "status": "success",
    "message": "You unliked ${unlikedTweetAuthor}'s tweet successfully."
}
```
###### Failure
##### 找不到該推文
```
status code: 404
{
    "status": "error",
    "message": [
        "Cannot find this tweet in db."
    ]
}
```
##### 推文沒被按讚
```
status code: 400
{
    "status": "error",
    "message": [
        "You never like this tweet before." 
    ]
}
```

## Followship
### 追蹤一位使用者
##### Method & URL
```
POST /api/followships
```
##### Request

| body  | descriotion |
| --------| ------ | 
| followingId | 欲追蹤的使用者id | 

##### Response
###### Success
```
status code: 200
{
    "status": "success",
    "message": "You followed @${followingUser.account} successfully."
}
```
###### Failure
##### 找不到該使用者
```
status code: 404
{
    "status": "error",
    "message": [
        "Cannot find this followingId or followerId."
    ]
}
```
##### 不能追蹤自己
```
status code: 403
{
    "status": "error",
    "message": [
        "You cannot follow yourself." 
    ]
}
```
##### 已經追蹤該名使用者了
```
status code: 409
{
    "status": "error",
    "message": [
        "You already followed @${followingUser.account}" 
    ]
}
```

### 取消追蹤一位使用者
##### Method & URL
```
DELETE /api/followships/:followingId
```
#### Parameters
followingId：欲取消追蹤的使用者 id

##### Response
###### Success
```
status code: 200
{
    "status": "success",
    "message": "Unfollowed @${followingUser.account} successfully."
}
```
###### Failure
##### 找不到該使用者 
```
status code: 404
{
    "status": "error",
    "message": [
        "Cannot find this followingId or followerId."
    ]
}
```
##### 不能取消追蹤自己
```
status code: 403
{
    "status": "error",
    "message": [
        "You cannot unfollow yourself." 
    ]
}
```

##### 沒有追蹤過
```
status code: 409
{
    "status": "error",
    "message": [
        "You didn't followed @${unfollowingUser.account} before." 
    ]
}
```

## Users
### 瀏覽使用者的檔案
##### Method & URL
```
POST /api/users/:id
```
#### Parameters
id：欲瀏覽的使用者 id
##### Response
###### Success
```
status code: 200
{
    "status": "success",
    "message": "Get @BeatricePai's  profile successfully.",
    "id": 4,
    "name": "Beatrice",
    "account": "BeatricePai",
    "email": "betrice@example.com",
    "avatar": "https://i.pravatar.cc/150?img=28",
    "cover": "https://loremflickr.com/660/240/paris/?lock=95.94581210965639",
    "introduction": "Soluta iusto nihil ut. Ipsam alias nesciunt voluptatem.,
    "tweetCount": 10,
    "followerCount": 2,
    "followingCount": 1,
    "isFollowed": true
}
```
###### Failure
##### 找不到該使用者
```
status code: 404
{
   "status": "error",
   "message": [
       "Cannot find any user in db."
   ]
}
```
### 編輯自己的使用者檔案
##### Method & URL
```
PUT /api/users/:id
```
#### Parameters
id：目前登入的使用者 id
##### Request

| body  | Type   | Required |
| --------| ------ | ---------|
| name    | String | True |
| introduction  | String | False |
| avator| String | False |
| cover| String | False |

##### Response
###### Success
```
status code: 200
{
    "status": "success",
    "message": "Update ${name}'s profile successfully."
}
```
###### Failure

##### 只有使用者本人可以編輯
```
status code: 401
{
    "status": "error",
    "message": [
        "Permission denied."
    ]
}
```
##### 找不到該使用者 或 使用者沒有前台瀏覽權限
 ```
status code: 404
{
    "status": "error",
    "message": [
        "Cannot find any user in db."
    ]
}
```
##### 名稱未填寫
 ```
status code: 400
{
    "status": "error",
    "message": [
        "Name is required."
    ]
}
 ```
 ##### 名稱不得超過 50 字
 ##### 簡介不得超過 160 字
  ```
status code: 400
{
    "status": "error",
    "message": [
        "Name can not be longer than 50 characters."
        "Introduction can not be longer than 160 characters."
    ]
}
 ```
 ##### 圖片格式須符合.jpg, .jpeg, .png 

```
status code: 400
{
    "status": "error",
    "message": [
        " Image type of file should be .jpg, .jpeg, .png ."
    ]
}
 ```


### 編輯使用者帳戶資料
```
PUT /api/users/:id/account
```
#### Parameters
id：目前登入的使用者id
##### Request

| body   | Type   | Required |
| --------| ------ | ---------|
| account | Srting | True |
| name    | String | True |
| email   | String | True |
| password| String | True |

##### Response
###### Success
```
status code: 200
{
    "status": "success",
    "message": "@${account} Update account information successfully."
}
```
###### Failure

##### 只有使用者本人可以編輯
```
status code: 401
{
    "status": "error",
    "message": [
        "Permission denied."
    ]
}
```
##### 找不到該使用者 或 使用者沒有前台瀏覽權限
 ```
status code: 404
{
    "status": "error",
    "message": [
        "Cannot find any user in db."
    ]
}
```
##### 所有欄位都是必填的
```
status code: 400
{
    "status": "error",
    "message": [
        "All fields are required！"
    ]
}
```
##### 表單填寫錯誤原因
```
status code: 400
{
    "status": "error",
    "message": [
        "Name can not be longer than 50 characters.",
        "Account can not be longer than 20 characters.",
        "example.com is not a valid email address.",
        "Password does not meet the required length.",
        "The password and confirmation do not match.Please retype them."
    ]
}
```
##### 信箱或帳號已存在
```
status code: 400
{
    "status": "error",
    "message": [
        "This email address is already being used.",
        "This account is already being used."
    ]
}
```

### 瀏覽使用者跟隨者
##### Method & URL
```
GET /api/users/:id/followers
```
#### Parameters
id：欲瀏覽的使用者id
##### Response
###### Success
```
status code: 200
[
    {
        "followerId": 2,
        "account": "LyviaLee",
        "name": "Lyvia",
        "avatar": "https://i.pravatar.cc/150?img=29",
        "introduction": "Illo ab sed quos maxime adipisci est.",
        "followshipCreatedAt": "2021-03-17T13:07:42.000Z",
        "isFollowed": false
    }
    ...
]
```
status code: 200
```
{
    "message": [
        "@${user.account} has no follower."
    ]
}
```
###### Failure
##### 找不到該使用者 或 使用者沒有前台瀏覽權限
 ```
status code: 404
{
    "status": "error",
    "message": [
        "Cannot find any user in db."
    ]
}
```

### 瀏覽使用者跟隨中的人
##### Method & URL
```
GET /api/users/:id/followings
```
#### Parameters
id：欲瀏覽的使用者id
##### Response
###### Success
```
status code: 200
[
    {
        "followerId": 2,
        "account": "LyviaLee",
        "name": "Lyvia",
        "avatar": "https://i.pravatar.cc/150?img=29",
        "introduction": "Illo ab sed quos maxime adipisci est.\nFugiat facere dolores quis quidem impedit id.",
        "followshipCreatedAt": "2021-03-17T13:07:42.000Z",
        "isFollowed": false
    }
    ...
]
```

```
status code: 200
{
    "message": [
        "@${user.account} has no following."
    ]
}
```
###### Failure
###### 找不到該使用者 或 使用者沒有前台瀏覽權限
```
status code: 404
{
    "status": "error",
    "message": [
        "Cannot find this user in db.",
    ]
}
```

### 瀏覽使用者發過的所有推文
##### Method & URL
```
GET /api/users/:id/tweets
```
#### Parameters
id：欲瀏覽的使用者id
##### Response
###### Success
```
status code: 200
[
    {
        "id": 5,
        "UserId": 1,
        "description": "labore",
        "createdAt": "2021-06-19T21:05:51.000Z",
        "account": "RyanHuang",
        "name": "123",
        "avatar": "https://i.pravatar.cc/150?img=68",
        "likedCount": 0,
        "repliedCount": 3,
        "isLike": false
    },
    {
        "id": 9,
        "UserId": 1,
        "description": "Vel est ut ea amet mollitia.",
        "createdAt": "2021-05-03T05:00:31.000Z",
        "account": "RyanHuang",
        "name": "123",
        "avatar": "https://i.pravatar.cc/150?img=68",
        "likedCount": 1,
        "repliedCount": 3,
        "isLike": false
    },
    ...
]    

```

###### Failure
###### 找不到該使用者 或 使用者沒有前台瀏覽權限
```
status code: 404
{
    "status": "error",
    "message": [
        "Cannot find this user in db.",
    ]
}
```
###### 查無任何推文
```
status code: 404
{
    "status": "error",
    "message": [
        "Cannot find any tweets in db.",
    ]
}
```

### 瀏覽使用者的所有回覆
##### Method & URL
```
GET /api/users/:id/replied_tweets
```
#### Parameters
id：欲瀏覽的使用者id
##### Response

###### Success
```
[
    {
        "id": 25,
        "UserId": 1,
        "TweetId": 9,
        "tweetAuthorAccount": "RyanHuang",
        "comment": "praesentium cumque perspiciatis",
        "createdAt": "2021-07-04T14:32:25.000Z",
        "commentAccount": "RyanHuang",
        "name": "Ryan",
        "avatar": "https://i.pravatar.cc/150?img=68"
    },
    ...
]
```

###### Failure
###### 找不到該使用者 或 使用者沒有前台瀏覽權限
```
status code: 404
{
    "status": "error",
    "message": [
        "Cannot find this user in db.",
    ]
}
```
###### 查無任何回覆
```
status code: 404
{
    "status": "error",
    "message": [
        "Cannot find any replies in db.",
    ]
}
```

### 瀏覽使用者所有點讚的推文
##### Method & URL
```
GET /api/users/:id/likes
```
#### Parameters
id：欲瀏覽的使用者id
##### Response
###### Success
```
status code: 200
[
    {
        "id": 12,
        "UserId": 1,
        "TweetId": 28,
        "likeCreatedAt": "2021-03-23T17:47:34.000Z",
        "account": "AaronWang",
        "name": "Aaron",
        "avatar": "https://i.pravatar.cc/150?img=56",
        "description": "fugiat accusantium vitae",
        "tweetCreatedAt": "2021-04-22T20:51:47.000Z",
        "likedCount": 1,
        "repliedCount": 3,
        "isLike": true
    },
    ...
]
```
###### Failure
###### 找不到該使用者 或 使用者沒有前台瀏覽權限
```
status code: 404
{
    "status": "error",
    "message": [
        "Cannot find this user in db.",
    ]
}
```
###### 查無點讚的推文
```
status code: 404
{
    "status": "error",
    "message": [
        "Cannot find any liked tweets in db.",
    ]
}
```
### 目前登入的使用者
##### Method & URL
```
GET /api/users/current
```
##### Response
###### Success
```
status code: 200
{
    "id": 1,
    "name": "Ryan",
    "account": "RyanHuang",
    "email": "ryan@example.com",
    "avatar": "https://i.pravatar.cc/150?img=68",
    "role": "user",
    "cover": "https://loremflickr.com/660/240/paris/?lock=37.08013914092159",
    "introduction": "Et odio eaque.\nQuae illum nemo."
}
```
### 全站追蹤者數量前 10 名的使用者名單
##### Method & URL
```
GET /api/users
```
##### Response
###### Success
```
status code: 200
{
    "status": "success",
    "message": "Get top ten users successfully",
    "users": [ 
        {
            "id": 3,
            "name": "Aaron",
            "avatar": "https://i.pravatar.cc/150?img=56",
            "account": "AaronWang",
            "followerCount": 2,
            "isFollowed": true
        },
        {
            "id": 4,
            "name": "Beatrice",
            "avatar": "https://i.pravatar.cc/150?img=28",
            "account": "BeatricePai",
            "followerCount": 1,
            "isFollowed": true
        },
        ...
    ]
}
```
###### Failure
###### 找不到使用者
```
status code: 404
{
   "status": "error",
   "message": [
       "Cannot find any user in db."
   ]
}
```



## Admin
### 後台刪除一則貼文
##### Method & URL
```
DELETE /api/admin/tweets/:id
```
#### Parameters
id：欲刪除的推文id
##### Response
###### Success
```
status code: 200
{
    "status": "success",
    "message": [
        "@${tweetAuthor}'s tweet has been deleted!"
    ]
}

```

###### Failure
###### 該則推文不存在
```
status code: 401
{
    "status": "error",
    "message": [
        "This tweet doesn't exist!"
    ]
}
```

### 後台瀏覽所有使用者
##### Method & URL
```
GET /api/admin/users
```
##### Response
###### Success
```
status code: 200
[
    {
        "id": 1,
        "account": "RyanHuang",
        "name": "Ryan",
        "avatar": "https://i.pravatar.cc/150?img=68",
        "cover": "https://loremflickr.com/660/240/paris/?lock=62.67199844521949",
        "tweetCount": 10,
        "likedCount": 5,
        "followingCount": 0,
        "followerCount": 1
    },
    ...
]
```
###### Failure
###### 找不到任何使用者
```
status code: 404
{
    "status": "error",
    "message": [
        "Cannot find any users in db.",
    ]
}
```


[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)
