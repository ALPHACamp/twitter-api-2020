# Simple Twitter RESTful API 
##### 這是一個提供前端開發串接API的Simple Twitter專案

## 共同開發人員 (Collaborator)
* [Chia-Hui](https://github.com/wintersprouter)
* [Hsin Yeh](https://github.com/Hsinyehh)

## 環境建置與需求 (Enviroment)
* Node.js - v14.16.1
* Express - v4.17.1
* MySQL - v8.0.25
* MySQL workbench - - v8.0.25

## 初始化（Initialize）
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

## 串接資源
*　API文件網址
http://localhost:3000/api-doc/

＊ API串接網址
http://localhost:3000/api/{route}

### 共用帳號
使用者可以使用以下帳號分別登入系統前台、後台。


| role| account | password |
| -------- | -------- | -------- |
| admin  | root   | 12345678  |
| user   | RyanHuang   | 12345678   |
  
## API說明
* 除了後臺管理者登入、使用者登入、註冊這 3 條路由外，其餘路由需在 header 的 Authorization 帶上"Bearer" + token (token可從登入時拿到)
* response 皆包含 http status code & message (說明成功狀態或是失敗原因)

## API文件
## Sign in & Sign up
#### 前台註冊
##### Method & URL
```
POST /api/users
```
##### Request

| Params  | Type   | Required |
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
###### email或account重複註冊
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
###### 有未填欄位
```
status code: 400
{
    "status": "error",
    "message": [
        "All fields are required！"
    ]
}
```
###### 表單填寫錯誤原因
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

#### 使用者或管理員登入
##### Method & URL
```
POST /api/users/signin
```
##### Request

| Params  | Type   | Required |
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
```
status code: 422
{
    "status": "error",
    "message": [
        "All fields are required！"
    ]
}
```
```
status code: 401
{
    "status": "error",
    "message": [
        "That account is not registered!"
    ]
}
```
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

| Params  | Type   | Required |
| --------| ------ | ---------|
| description | Srting | True |

##### Response
###### Success
```
{
    "status": "success",
    "message": "The tweet was successfully created."
}
```
###### Failure
```
{
    "status": "error",
    "message": [
        "Please input tweet."
    ]
}
```
```
{
    "status": "error",
    "message": [
        "Tweet can't be more than 140 words."
    ]
}
```

### 瀏覽推文
##### Method & URL
```
GET /api/tweets
```
##### Response
###### Success
```
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
```
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
##### Response
###### Success
```
{
    "status": "success",
    "message": "Get the tweet successfully",
    "id": 1,
    "UserId": 1,
    "description": "Aut enim reiciendis dicta quo ducimus tempora illum soluta. Eligendi nobis molestias hic. Numquam eos dignissimos doloribus nisi minus conse",
    "LikeCount": 2,
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
```
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

| Params  | Type   | Required |
| --------| ------ | ---------|
| comment | Srting | True |

##### Response
###### Success
```
{
    "status": "success",
    "message": "The tweet was successfully created."
}
```
###### Failure
##### 找不到該推文
```
{
    "status": "error",
    "message": [
        "Cannot find this tweet in db."
    ]
}
```
##### 推文回覆空白
```
{
    "status": "error",
    "message": [
        "Please input comment."
    ]
}
```
##### 推文回覆超過50字
```
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
##### Response
###### Success
```
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
```
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
##### Response
###### Success
```
{
    "status": "success",
    "message": "You liked @${likedTweetAuthor}'s tweet successfully."
}
```
###### Failure
##### 找不到該推文
```
{
    "status": "error",
    "message": [
        "Cannot find this tweet in db."
    ]
}
```
##### 推文已被按讚
```
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

##### Response
###### Success
```
{
    "status": "success",
    "message": "You unliked ${unlikedTweetAuthor}'s tweet successfully."
}
```
###### Failure
##### 找不到該推文
```
{
    "status": "error",
    "message": [
        "Cannot find this tweet in db."
    ]
}
```
##### 推文沒被按讚
```
{
    "status": "error",
    "message": [
        "You never like this tweet before." 
    ]
}
```

## Followship
### 追蹤
##### Method & URL
```
POST /api/followships
```
##### Response
###### Success
```
{
    "status": "success",
    "message": "You followed @${followingUser.account} successfully."
}
```
###### Failure
##### 找不到該使用者
```
{
    "status": "error",
    "message": [
        "Cannot find this followingId or followerId."
    ]
}
```
##### 不能追蹤自己
```
{
    "status": "error",
    "message": [
        "You cannot follow yourself." 
    ]
}
```

### 取消追蹤
##### Method & URL
```
DELETE /api/followships/:followingId
```
##### Response
###### Success
```
{
    "status": "success",
    "message": "Unfollowed @${followingUser.account} successfully."
}
```
###### Failure
##### 找不到該使用者 
```
{
    "status": "error",
    "message": [
        "Cannot find this followingId or followerId."
    ]
}
```
##### 不能取消追蹤自己
```
{
    "status": "error",
    "message": [
        "You cannot follow yourself." 
    ]
}
```

##### 沒有追蹤過
```
{
    "status": "error",
    "message": [
        "You didn't followed @${unfollowingUser.account} before." 
    ]
}
```



## Users
### 編輯自己的使用者檔案
##### Method & URL
```
PUT /api/users/:id
```
#### Parameters
id：目前登入的使用者id
##### Request

| Params  | Type   | Required |
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

| Params  | Type   | Required |
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

