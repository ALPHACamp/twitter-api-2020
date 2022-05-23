# Twitter 專案
### 環境需求

* Node.js 14.16.0 以上
* MySQL 8.0.28  
  <br />
### 本地安裝方式
  <br />

#### node.js
至[官網下載](https://nodejs.org/en/)

#### MySQL 
至[官網下載](https://dev.mysql.com/)
  <br />


## 安裝步驟
下載專案  <br />
```git clone https://github.com/eruc1117/twitter-api-2020.git```

移動至專案資料夾  <br />
```cd twitter-api-2020```

套件下載  <br />
```npm install```

補上環境變數 .env <br />

JWT_SECRET=自行設定  <br />
IMGUR_CLIENT_ID=自己在[imgur](https://api.imgur.com/)的ID

伺服器運行  <br />
```npm run dev```

這個專案是前後端分離之專案。 <br />
前端 [Github 連結](https://github.com/DaisyLIEN/twitter-front-end-vue.js)  <br />
[入口網站](https://peggyhung.github.io/Demo-of-Twitter/#/signin)

#### 測試用帳號
##### 後台帳號
帳號: root  <br />
密碼: 12345678

##### 前台帳號
帳號: user1  <br />
密碼: 12345678

***
## API 文件  

前端連接時依照後端伺服器設置位置決定
`{{baseUrl}}` <br />
本地 `http://localhost:3000` <br />
雲端範例 `https://still-savannah-82085.herokuapp.com`

### 後台相關
  <br />
登入 <br />
提供後台管理者進行登入

`POST {{baseUrl}}/api/admin/login`

需要資料範本
```
{
    "account": "root",
    "password": "12345678"
}
```
登入成功後回傳資料
```
{
    "status": "success",
    "data": {
        "token": "JWT Token",
        "user": {
            "id": 4,
            "account": "root",
            "name": "root",
            "email": "root@example.com",
            "avatar": "https://loremflickr.com/250/250/paradise/?random=80",
            "introduction": "ullam nemo saepe",
            "cover": "https://loremflickr.com/800/350/selfie/?random=81",
            "role": "admin",
            "createdAt": "2022-05-21T11:59:41.000Z",
            "updatedAt": "2022-05-21T11:59:41.000Z"
        }
    }
}
```

瀏覽所有推文 <br />
瀏覽所有推文，推文只顯示前 50 個字  <br />
`GET {{baseUrl}}/api/admin/tweets`  <br />
回傳資料
```
[
    {
        "avatar": "https://loremflickr.com/250/250/paradise/?random=72",
        "name": "user1",
        "account": "user1",
        "tweetCreatedAt": "2022-05-21T13:40:57.000Z",
        "description": "TEST",
        "totalLikeCount": 0,
        "totalReplyCount": 0,
        "UserId": 14,
        "TweetId": 1064
    }
......
]
```


瀏覽所有使用者 <br />
瀏覽所有使用者，使用者按照推文數量排列  <br />
`GET {{baseUrl}}/api/admin/users`  <br />
回傳資料
```
{
        "id": 14,
        "account": "user1",
        "name": "user1",
        "email": "user1@example.com",
        "avatar": "https://loremflickr.com/250/250/paradise/?random=72",
        "cover": "https://loremflickr.com/800/350/selfie/?random=4",
        "role": "user",
        "totalTweetNum": 14,
        "totalLikeCount": 3,
        "followersNum": 4,
        "followingsNum": 2
} 
......
```

刪除單一推文  <br />
管理者刪除單一推文  <br />
`DELETE /api/admin/tweets/:id` <br />
id => 推文 id
  <br />
回傳成功

### 前台相關
  <br />
登入 <br />
提供前台使用者進行登入 <br />

`POST {{baseUrl}}/api/login`
需要資料範本
```
{
    "account": "user1",
    "password": "12345678"
}
```
登入成功後回傳資料

```
{
    "status": "success",
    "data": {
        "token": "JWT Token",
        "user": {
            "id": 5,
            "account": "user1",
            "name": "user1",
            "email": "user1@example.com",
            "avatar": "https://loremflickr.com/250/250/paradise/?random=80",
            "introduction": "ullam nemo saepe",
            "cover": "https://loremflickr.com/800/350/selfie/?random=81",
            "role": "admin",
            "createdAt": "2022-05-21T11:59:41.000Z",
            "updatedAt": "2022-05-21T11:59:41.000Z"
        }
    }
}
```

註冊  <br />
使用者新建一個帳號，其中信箱跟帳號不可與他人相同
需要資料範本
```
{
    "account": "example",
    "name": "example",
    "email": "example@example.com",
    "password": "12345678",
    "checkPassword": "12345678"
}
```
註冊成功回傳資料
```
{
    "id": 164,
    "account": "example",
    "name": "example",
    "email": "example@example.com",
    "avatar": null,
    "introduction": null,
    "cover": null,
    "role": "user",
    "createdAt": "2022-05-21T23:06:45.000Z",
    "updatedAt": "2022-05-21T23:06:45.000Z"
}
```

使用者瀏覽所有推文 <br />
`GET {{baseUrl}}/api/tweets`
   <br />
回傳所有推文
```
[
    {
        "avatar": "https://loremflickr.com/250/250/paradise/?random=72",
        "name": "user1",
        "account": "user1",
        "tweetCreatedAt": "2022-05-21T13:40:57.000Z",
        "description": "TEST",
        "totalLikeCount": 0,
        "totalReplyCount": 0,
        "UserId": 14,
        "TweetId": 1064,
        "isLike": false
    }
......
]
```

使用者讀取單一推文  <br />
`GET {{baseUrl}}/api/tweets/:id`  <br />
id => 推文 id
<br />
成功回傳資料
```
{
    "avatar": "https://loremflickr.com/250/250/paradise/?random=72",
    "name": "user1",
    "account": "user1",
    "tweetCreatedAt": "2022-05-21T11:59:42.000Z",
    "description": "deleniti omnis assumenda",
    "totalLikeCount": 0,
    "totalReplyCount": 3,
    "UserId": 14,
    "TweetId": 14,
    "isLike": false
}
......
```

使用者新增推文  <br />
`POST {{baseUrl}}/api/tweets`  <br />
需要資料範本
```
{
    "description": "example"
}
```
回傳所有推文
```
[
    {
        "avatar": "https://loremflickr.com/250/250/paradise/?random=72",
        "name": "user1",
        "account": "user1",
        "tweetCreatedAt": "2022-05-21T23:27:06.000Z",
        "description": "dsa",
        "totalLikeCount": 0,
        "totalReplyCount": 0,
        "UserId": 14,
        "TweetId": 1074,
        "isLike": false
    }
......
]
```

使用者喜歡一篇推文  <br />
`POST {{baseUrl}}/api/tweets/:id/like` <br />
id => 推文 id  <br />
回傳該推文
```
{
    "avatar": "https://loremflickr.com/250/250/paradise/?random=6",
    "name": "user6",
    "account": "user6",
    "tweetCreatedAt": "2022-05-21T11:59:42.000Z",
    "description": "Quos quisquam perspiciatis vel voluptatem ad facilis amet.",
    "totalLikeCount": 1,
    "totalReplyCount": 3,
    "UserId": 64,
    "TweetId": 514,
    "isLike": true
}
```

使用者不喜歡一篇推文  <br />
`POST {{baseUrl}}/api/tweets/:id/unlike` <br />
id => 推文 id  <br />
回傳該推文
```
{
    "avatar": "https://loremflickr.com/250/250/paradise/?random=6",
    "name": "user6",
    "account": "user6",
    "tweetCreatedAt": "2022-05-21T11:59:42.000Z",
    "description": "Quos quisquam perspiciatis vel voluptatem ad facilis amet.",
    "totalLikeCount": 1,
    "totalReplyCount": 3,
    "UserId": 64,
    "TweetId": 514,
    "isLike": true
}
```

使用者查看一篇推文所有回覆  <br />
`GET {{baseUrl}}/api/tweets/:tweet_id/replies` <br />
tweet_id => 推文 id  <br />
回傳該推文的所有回覆
```
[
    {
        "avatar": "https://i.imgur.com/hlU4Gzh.jpeg",
        "userName": "user555666777",
        "userAccount": "user5",
        "replyCreatedAt": "2022-05-21T15:17:35.000Z",
        "replyAccount": "user1",
        "comment": "88",
        "totalLikeCount": 0,
        "totalReplyCount": 99,
        "UserId": 54,
        "replyId": 3044,
        "tweetId": 54
    }
    ......
]
```

使用者回覆一篇推文  <br />
`POST  {{baseUrl}}/api/tweets/:tweet_id/replies` <br />
tweet_id => 推文 id  <br />
回傳成功訊息

使用者更新使用者資料  <br />
`PUT {{baseUrl}}/api/users/:id` <br />
id => 使用者 id
需要資料範本  <br />
```
name
account
email
password
checkPassword
avatar
cover
```
更新成功後 <br />
```
{
    "status": "更新成功",
    "user": {
        "id": 14,
        "account": "user1",
        "name": "user1",
        "email": "user1@example.com",
        "password": "$2a$10$.XRK/Xl/FzNX3dvFgqRK6ebXGvYxzSzcJaUTkXOw3hAxHXzcSqM9a",
        "avatar": "https://i.imgur.com/aPaEDlg.png",
        "introduction": "quis quisquam in(更改)",
        "cover": "https://loremflickr.com/800/350/selfie/?random=4",
        "role": "user",
        "createdAt": "2022-05-21T11:59:40.000Z",
        "updatedAt": "2022-05-21T23:34:13.947Z"
    }
}
```

使用者閱覽任何使用者的資料  <br />
`GET {{baseUrl}}/api/users/:id` <br />
id => 使用者 id  <br />
```
{
    "status": "success",
    "id": 14,
    "account": "user1",
    "name": "user1",
    "email": "user1@example.com",
    "avatar": "https://i.imgur.com/aPaEDlg.png",
    "introduction": "quis quisquam in(更改)",
    "cover": "https://loremflickr.com/800/350/selfie/?random=4",
    "role": "user",
    "createdAt": "2022-05-21T11:59:40.000Z",
    "updatedAt": "2022-05-21T23:34:13.000Z",
    "Tweets": [
        {
            "id": 1074,
            "description": "dsa",
            "UserId": 14,
            "createdAt": "2022-05-21T23:27:06.000Z",
            "updatedAt": "2022-05-21T23:27:06.000Z"
        }
        ......
    ],
    "Followers": [
        {
            "id": 44,
            "account": "user4",
            "name": "user4",
            "email": "user4@example.com",
            "password": "$2a$10$jrHnGVi4F23n5vxBJd1sW.B6vxjOQobycG0dmnRvTN2WabSzc2yCe",
            "avatar": "https://loremflickr.com/250/250/paradise/?random=47",
            "introduction": "Fugit omnis maxime vel iure ea quisquam sequi.\nDebitis possimus non iure id magnam in.\nPerferendis voluptatibus ipsum repellat adipisci vel ad laudantium error.\nConsequatur velit ut quia autem nobis ab doloribus.",
            "cover": "https://loremflickr.com/800/350/selfie/?random=86",
            "role": "user",
            "createdAt": "2022-05-21T11:59:40.000Z",
            "updatedAt": "2022-05-21T11:59:40.000Z",
            "Followship": {
                "followerId": 44,
                "followingId": 14,
                "createdAt": "2022-05-21T11:59:42.000Z",
                "updatedAt": "2022-05-21T11:59:42.000Z"
            }
        },
     ......
    ],
    "Followings": [
        {
            "id": 64,
            "account": "user6",
            "name": "user6",
            "email": "user6@example.com",
            "password": "$2a$10$lroBd092XW9IPPIHfvK.wubcTn.UECz.CxF5B8N1qR.cUDEh7ko9q",
            "avatar": "https://loremflickr.com/250/250/paradise/?random=6",
            "introduction": "Sit aut quam ut adipisci. Enim voluptatem quo quos. Enim quae fugiat placeat aspernatur. Quia blanditiis molestiae nihil. Amet qui aperiam nihil sunt corrupti odit.",
            "cover": "https://loremflickr.com/800/350/selfie/?random=57",
            "role": "user",
            "createdAt": "2022-05-21T11:59:40.000Z",
            "updatedAt": "2022-05-21T11:59:40.000Z",
            "Followship": {
                "followerId": 14,
                "followingId": 64,
                "createdAt": "2022-05-21T11:59:42.000Z",
                "updatedAt": "2022-05-21T11:59:42.000Z"
            }
        },
    ......
    ],
    "tweetCount": 15,
    "followingsCount": 3,
    "followersCount": 2
}
```
使用者瀏覽特定使用者的所有推文  <br />
`GET {{baseUrl}}/api/users/:id/tweets`  <br />
id => 使用者 id  <br />
成功回傳資料  <br />
```
[
    {
        "avatar": "https://loremflickr.com/250/250/paradise/?random=91",
        "name": "user0",
        "account": "user0",
        "tweetCreatedAt": "2022-05-21T07:17:48.000Z",
        "description": "Quia natus quia dolore et eligendi molestiae laborum.",
        "totalLikeCount": 0,
        "totalReplyCount": 3,
        "UserId": 2,
        "TweetId": 1,
        "isLike": false
    },
    ......
]
```

使用者瀏覽特定使用者的所有回覆  <br />
`GET {{baseUrl}}/api/users/:id/replied_tweets`  <br />
id => 使用者 id  <br />
成功回傳資料  <br />
```
[
    {
        "avatar": "https://loremflickr.com/250/250/paradise/?random=91",
        "userName": "user0",
        "userAccount": "user0",
        "replyCreatedAt": "2022-05-21T07:17:48.000Z",
        "replyAccount": "user0",
        "comment": "Itaque maiores ducimus corporis aut enim et aliquid quas. Impedit aut debitis voluptatum vitae nemo ut. Cum et dolor rem iste.",
        "totalLikeCount": 0,
        "totalReplyCount": 3,
        "UserId": 2,
        "replyId": 9
    }
    ......
]
```
使用者瀏覽特定使用者的所有喜歡的推文  <br />
`GET {{baseUrl}}/api/users/:id/likes`  <br />
id => 使用者 id  <br />
成功回傳資料  <br />
```
[
    {
        "avatar": "https://loremflickr.com/250/250/paradise/?random=91",
        "name": "user0",
        "account": "user0",
        "tweetCreatedAt": "2022-05-21T07:17:48.000Z",
        "description": "Exercitationem aut est molestiae pariatur. Libero perferendis animi quia voluptatem maiores eveniet rerum expedita tempora. Consequuntur esse consequatur nobis ducimus pariatur.",
        "totalLikeCount": 1,
        "totalReplyCount": 3,
        "UserId": 2,
        "TweetId": 2,
        "isLike": true
    },
......
]
```
使用者瀏覽特定使用者的所有追隨中的使用者  <br />
`GET {{baseUrl}}/api/users/:id/followings`  <br />
id => 使用者 id  <br />
成功回傳資料  <br />
```
[
    {
        "id": 5,
        "account": "user3",
        "name": "user3",
        "avatar": "https://loremflickr.com/250/250/paradise/?random=78",
        "introduction": "faker.lorem.text()",
        "Followship": {
            "followerId": 2,
            "followingId": 5,
            "createdAt": "2022-05-21T07:17:48.000Z",
            "updatedAt": "2022-05-21T07:17:48.000Z"
        },
        "followingId": 5,
        "followerId": 2,
        "isFollowed": true
    },
......
]
```
使用者瀏覽特定使用者所有被跟隨的使用者  <br />
`GET {{baseUrl}}/api/users/:id/followers`  <br />
id => 使用者 id  <br />
成功回傳資料  <br />
```
[
    {
        "id": 9,
        "account": "user7",
        "name": "user7",
        "avatar": "https://loremflickr.com/250/250/paradise/?random=26",
        "introduction": "faker.lorem.text()",
        "Followship": {
            "followerId": 9,
            "followingId": 2,
            "createdAt": "2022-05-21T07:17:48.000Z",
            "updatedAt": "2022-05-21T07:17:48.000Z"
        },
        "followingId": 2,
        "followerId": 9,
        "isFollowed": false
    },
......
]
```
使用者追蹤特定使用者  <br />
`POST {{baseUrl}}/api/followships?id=`  <br />
id => 使用者 id  <br />
成功回傳資料  <br />
```
{
    "followship": {
        "followingId": null,
        "followerId": 2,
        "updatedAt": "2022-05-22T00:03:54.384Z",
        "createdAt": "2022-05-22T00:03:54.384Z"
    }
}
```
使用者取消追蹤特定使用者  <br />
`DELETE {{baseUrl}}/api/followships?id=`  <br />
id => 使用者 id  <br />
回傳成功  <br />

