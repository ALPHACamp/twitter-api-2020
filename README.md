## Simple-twitter-api
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
* 請在終端機輸入

```
git clone https://github.com/wintersprouter/twitter-api-2020.git
cd twitter-api-2020
npm install  (請參考 package.json)
```

* 建立.env

```
PORT='3000'
JWT_SECRET= xxx
IMGUR_CLIENT_ID= xxx
```


* 使用 MySQL Workbench 建立資料庫
  * 需要與 config/config.json 一致

```
create database ac_twitter_workspace;
create database ac_twitter_workspace_test;
```

* 在終端機輸入以下指令，進行資料庫遷移、種子資料初始化

```
npx sequelize db:migrate
npx sequelize db:seed:all
```

* 在終端機輸入以下指令，啟動swagger API 和 後端專案

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

* 共用帳號
  ＊ 後台登入帳號：root　登入密碼：12345678　
  ＊ 前台登入帳號 : RyanHuang　登入密碼：12345678　
  
## API說明
* 除了後臺管理者登入、使用者登入、註冊這 3 條路由外，其餘路由需在 header 的 Authorization 帶上"Bearer" + token (token可從登入時拿到)
* response 皆包含 http status code & message (說明成功狀態或是失敗原因)

## API文件
## 前台註冊登入
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
{
    "status": "success",
    "message": "@Lee sign up successfully.Please sign in."
}
```
###### Failure
###### email或account重複註冊
```
{
    "status": "error",
    "message": [
        "This email address is already being used.",
        "This account is already being used."
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
{
    "status": "error",
    "message": [
        "All fields are required!",
        "That account is not registered!",
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
##### 找不到該追蹤者
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
##### 找不到該追蹤者
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
{
    "status": "success",
    "message": "Update ${name}'s profile successfully."
}
```
###### Failure
```
{
    "status": "error",
    "message": [
        "Permission denied.",
        "Cannot find this user in db.",
        "Name is required.",
        "Name can not be longer than 50 characters.",
        "Introduction can not be longer than 160 characters.",
        "Image type of ${file} should be .jpg, .jpeg, .png ."
    ]
}
```

### 瀏覽使用者檔案
```
PUT /api/users/:id/account
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
{
    "status": "success",
    "message": "@${account} Update account information successfully."
}
```
###### Failure
```
{
    "status": "error",
    "message": [
        "Permission denied.",
        "Cannot find this user in db.",
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
##### Response
###### Success
```
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
]
```

```
{
    "message": [
        "@${user.account} has no follower."
    ]
}
```

### 瀏覽使用者跟隨中的人
##### Method & URL
```
GET /api/users/:id/followings
```
##### Response
###### Success
```
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
]
```

```
{
    "message": [
        "@${user.account} has no following."
    ]
}
```
###### Failure
###### 找不到該使用者 或 使用者沒有前台瀏覽權限
```
{
    "status": "error",
    "message": [
        "Cannot find this user in db.",
    ]
}
```

### 瀏覽使用者發過的推文
##### Method & URL
```
GET /api/users/:id/tweets
```
##### Response
###### Success
```
[
    {
        "id": 3,
        "UserId": 1,
        "description": "Non quidem eligendi aspernatur veniam. Vero porro ea soluta dolores eveniet quas ipsum blanditiis exercitationem. Esse sit laborum ipsam har",
        "createdAt": "2021-06-25T10:41:56.000Z",
        "updatedAt": "2021-06-14T20:36:31.000Z",
        "User": {
            "id": 1,
            "account": "RyanHuang",
            "email": "ryan@example.com",
            "password": "$2a$10$d/OdTnXltn2zyy6icgAiWuyeYpUuSFkIOpf1Sg7iWenIfDPhxgICq",
            "name": "Ryan",
            "avatar": "https://i.pravatar.cc/150?img=68",
            "cover": "https://loremflickr.com/660/240/paris/?lock=62.67199844521949",
            "introduction": "consectetur",
            "role": "user",
            "createdAt": "2021-05-21T08:02:29.000Z",
            "updatedAt": "2021-02-19T23:49:05.000Z"
        },
        "Replies": [
            {
                "id": 9,
                "UserId": 3,
                "TweetId": 3,
                "comment": "Ratione architecto eaque dolor inventore nihil ver",
                "createdAt": "2021-04-28T00:10:19.000Z",
                "updatedAt": "2021-06-14T01:21:39.000Z"
            },
        ]
    },...
]
```

###### Failure
###### 找不到該使用者 或 使用者沒有前台瀏覽權限
```
{
    "status": "error",
    "message": [
        "Cannot find this user in db.",
    ]
}
```


### 瀏覽使用者的回覆
##### Method & URL
```
GET /api/users/:id/replied_tweets
```
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
{
    "status": "error",
    "message": [
        "Cannot find this user in db.",
    ]
}
```

### 瀏覽使用者按讚的紀錄
##### Method & URL
```
GET /api/users/:id/likes
```
##### Response
###### Success
```
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
{
    "status": "error",
    "message": [
        "Cannot find this user in db.",
    ]
}
```


## Admin
### 後台刪除一則貼文
##### Method & URL
```
DELETE /api/admin/tweets/:id
```
##### Response
###### Success
```
{
    "status": "success",
    "message": [
        "@${tweetAuthor}'s tweet has been deleted!"
    ]
}

```
###### Failure
```
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

