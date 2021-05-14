# Simple Twitter API

# Simple Twitter API

---

這是一個為了提供給前端開發的簡易 Twitter 專案，所自製的後端 API 伺服器。

### Base URL

- Simple Twitter API on heroku [https://simple-twitter-api-2021.herokuapp.com/](https://simple-twitter-api-2021.herokuapp.com/)

## 環境建置( prerequisites )

---

- [Express 4.16.4](https://www.npmjs.com/package/express)
- [Node.js v10.15.0](https://nodejs.org/en/download/)
- [MySQL v8.0.23](https://dev.mysql.com/downloads/mysql/)
- [MySQL Workbench v8.0.23](https://dev.mysql.com/downloads/mysql/)
- [Socket.io 4.0.1](https://www.npmjs.com/package/socket.io)

## 本地專案初始化( local install )

1.  下載專案並安裝套件

---

```jsx
git clone [https://github.com/KarolChang/twitter-api-2020](https://github.com/KarolChang/twitter-api-2020)
npm install
```

2. 設定 MySQL 資料庫與種子資料，並執行專案資料庫(需下載 MySQL)

```jsx
npx sequelize db:migrate
npx sequelize db:seed:all
```

3. 建立.env 檔

```jsx
JWT_SECRET = your_JWT_SECRET;
IMGUR_CLIENT_ID = your_client_id;
```

4. 執行專案

```jsx
npm run dev
```

## 共同開發人員

---

[Karol Chang](https://github.com/KarolChang/twitter-api-2020)

[Calvin Huang](https://github.com/yuchengH1988/twitter-api-2020)

# API 說明

- 除了**後臺管理者登入**、**使用者登入**、**註冊**這 3 條路由之外，其餘皆需在 header 的 Authorization 帶上"Bearer" + token
- response 皆包含 http status code & message (說明成功狀態或是失敗原因)
- 可使用下列的使用者帳號於系統登入

```jsx
Admin;
Account: root;
Password: 12345678;

User;
Account: user1;
Password: 12345678;
```

## API 文件

---

### 後臺管理者登入 ( 使用者認證 )

```jsx
POST / api / admin / login;
```

**Request**

| 欄位(Body) | 型別( type ) | 說明 (description) |
| ---------- | ------------ | ------------------ |
| account    | String       | 帳號               |
| password   | String       | 密碼               |

**Response**

Success

```jsx
{
    "status": "success",
    "message": "ok",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjE5MDE1NjUyfQ.p4SoR-YSIBf_WhbacPFdKuEAKui8nRnuWd7F5g808vQ",
    "user": {
        "id": 1,
        "account": "@root",
        "email": "root@example.com",
        "name": "root",
        "role": "admin"
    }
}
```

error

```jsx
{
    "status": "error",
    "message": "account and password are required!"
}
```

```jsx
{
    "status": "error",
    "message": "this account has not been registered!"
}
```

```jsx
{
    "status": "error",
    "message": "you don't have authority to login!"
}
```

```jsx
{
    "status": "error",
    "message": "password incorrect!"
}
```

### 後臺查看站內所有的使用者

```jsx
GET / api / admin / users;
```

**Response**

Success ( 以一個使用者為例 )，以 tweetCount 數量由大盜排列

```jsx
[
  {
    id: 6,
    account: "user5",
    name: "user5",
    avatar: "https://loremflickr.com/320/240/people/?lock=69",
    cover: "https://loremflickr.com/800/300/restaurant,food/?lock=938",
    tweetCount: 10,
    tweetsLikedCount: 20,
    followingsCount: 2,
    followersCount: 5,
  },
];
```

error

```jsx
{
  message: "db has no user!";
}
```

### 後臺刪除一筆推文

```jsx
DELETE /api/admin/tweets/:id
```

**Response**

Success

```jsx
{
    "status": "success",
    "message": "this tweet has been deleted!"
}
```

error

```jsx
{
    "status": "error",
    "message": "this tweet doesn't exist!"
}
```

### 使用者登入 ( 使用者認證 )

```jsx
POST / api / login;
```

**Request**

| 欄位(Body) | 型別( type ) | 說明 (description) |
| ---------- | ------------ | ------------------ |
| account    | String       | 帳號               |
| password   | String       | 密碼               |

**Response**

Success

```jsx
{
    "status": "success",
    "message": "ok",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjE5MDUyMzA2fQ.KA-DnUFacafM1EanBDtY97vyo5f0cnQlyuhnwqdg_0I",
    "user": {
        "id": 2,
        "account": "@user1",
        "email": "user1@example.com",
        "name": "user1",
        "role": "user"
    }
}
```

error

```jsx
{
    "status": "error",
    "message": "email and password are required!"
}
```

```jsx
{
    "status": "error",
    "message": "this account has not been registered!"
```

```jsx
{
    "status": "error",
    "message": "you don't have authority to login!"
```

```jsx
{
    "status": "error",
    "message": "password incorrect!"
}
```

### 註冊

```jsx
POST / api / users;
```

**Request**

| 欄位(Body)    | 型別( type ) | 說明 (description) |
| ------------- | ------------ | ------------------ |
| account       | String       | 帳號               |
| name          | String       | 暱稱               |
| email         | String       | 信箱               |
| password      | String       | 密碼               |
| checkPassword | String       | 確認密碼           |

**Response**

Success

```jsx
{
    "status": "success",
    "message": "register success!"
}
```

error

```jsx
{
    "status": "error",
    "message": "password & confirmPassword must be same!"
}
```

### 查看單一使用者資訊

```jsx
GET /api/users/:id
```

**Response**

Success

```jsx
{
    "id": 3,
    "account": "@user2",
    "name": "user2",
    "avatar": "https://loremflickr.com/320/240/people/?lock=42",
    "cover": "https://loremflickr.com/800/300/restaurant,food/?lock=132",
    "introduction": "Consequatur consequatur sit numquam voluptas velit nulla iste magni veniam. Velit et culpa id velit. Reprehenderit nihil unde officia et itaque unde voluptas. Architecto corrupti et alias inventore assumenda. Consequatur libero ipsa consequuntur fugiat soluta magni."
    "tweetCount": 10,
    "followingCount": 1,
    "followerCount": 0,
    "isFollowing": false,
    "isSubscript": true
}
```

error

```jsx
{
    "message": "can not find this user!"
}
```

### 使用者編輯自己的資料

```jsx
PUT /api/users/:id
```

**Request**

| 欄位(Body)    | 型別( type ) | 說明 (description)               |
| ------------- | ------------ | -------------------------------- |
| name          | String       | 暱稱                             |
| email         | String       | 信箱                             |
| account       | String       | 帳號                             |
| password      | String       | 密碼                             |
| checkPassword | String       | 確認密碼                         |
| introduction  | String       | 簡介                             |
| avatar        | String       | 大頭貼(需為.png/.jpg/.jpeg 檔案) |
| cover         | String       | 封面照(需為.png/.jpg/.jpeg 檔案) |

**Response**

Success

```jsx
{
    "status": "success",
    "message": "profile edit success!"
}
```

error

```jsx
{
    "status": "error",
    "message": "can not edit profile of other users!"
}
```

```jsx
{
    "status": "error",
    "message": "password & checkPassword must be same!"
}
```

```jsx
{
    "status": "error",
    "message": "this account or email has been used!"
}
```

```jsx
{
    "status": "error",
    "message": "image type of avatar/cover is not avaliable, please upload .jpg, .jpeg, .png file!"
}
```

### 查看單一使用者發過的推文

```jsx
GET /api/users/:id/tweets
```

**Response**

Success ( 以一則為例 )

```jsx
[
  {
    id: 31,
    UserId: 5,
    description:
      "Omnis et et laboriosam placeat qui aut vel velit voluptates. Sit similique aut. Beatae sed repellendus velit. Similique voluptatem cum atque deleniti necessitatibus eveniet. Hic similique suscipit a. Est autem fuga.",
    createdAt: "2021-04-24T09:48:06.000Z",
    fromNow: "a day ago",
    User: {
      id: 5,
      name: "user4",
      account: "user4",
      avatar: "https://loremflickr.com/800/300/restaurant,food/?lock=769",
    },
    repliedCount: 3,
    likedCount: 1,
    isliked: true,
  },
];
```

```jsx
{
    "message": "this user has no tweet!"
}
```

error

```jsx
{
    "message": "can not find this user!"
}
```

### 查看單一使用者回覆過的貼文

```jsx
GET /api/users/:id/replied_tweets
```

**Response**

Success

```jsx
[
    {
        "id": 21,
        "comment": "Architecto dolores quibusdam libero et. Aperiam rerum explicabo voluptatem dolore sed. Sed dolores provident. Tenetur enim minus est ratione impedit eum corrupti nobis omnis. Et laboriosam et ipsam et et.",
        "createdAt": "2021-04-22T07:10:45.000Z",
        "FromNow": "a few seconds ago",
        "Tweet": {
            "id": 7,
            "UserId": 2,
            "description": "Assumenda rerum consequuntur qui porro officiis aut repellendus. Consequatur fugit perferendis id aliquid est aliquid molestias. Voluptatibus hic quis ipsam asperiores et sequi culpa consequatur. Expedita commodi impedit illum optio. Quo autem suscipit ut nulla ipsum.",
            "createdAt": "2021-04-22T07:10:45.000Z",
            "FromNow": "a few seconds ago",
            "User": {
                "id": 2,
                "account": "@user1",
                "name": "user1",
                "avatar": "https://loremflickr.com/320/240/people/?lock=906"
            },
            "repliedCount": 3,
            "likedCount": 1,
            "isliked": true
        }
    }
```

```jsx
{
    "message": "this user has no reply for any tweet!"
}
```

error

```jsx
{
    "message": "this user does not exist!"
}
```

### 查看單一使用者喜歡過的貼文

```jsx
GET /api/users/:id/likes
```

**Response**

Success ( 以一則 tweet 為例 )

```jsx
[
  {
    id: 2,
    UserId: 3,
    TweetId: 14,
    createdAt: "2021-04-22T07:10:45.000Z",
    Tweet: {
      id: 14,
      UserId: 3,
      description:
        "Veritatis ut harum ut rerum blanditiis. Nemo et veniam aspernatur et mollitia nesciunt aut sed ipsa. Facilis omnis aut voluptatem.",
      createdAt: "2021-04-22T07:10:45.000Z",
      fromNow: "16 minutes ago",
      User: {
        id: 3,
        name: "user2",
        account: "@user2",
        avatar: "https://loremflickr.com/320/240/people/?lock=226",
      },
      repliedCount: 3,
      likedCount: 1,
      isliked: true,
    },
  },
];
```

```jsx
{
    "message": "this user has no like for any tweet!"
}
```

error

```jsx
{
    "message": "this user has no like for any tweet!"
}
```

### 查看單一使用者的跟隨者

```jsx
GET /api/users/:id/follow
```

**Response**

Success ( 以一位跟隨者為例 )

```jsx
[
  {
    followerId: 4,
    account: "@user3",
    name: "user3",
    avatar: "https://loremflickr.com/320/240/people/?lock=648",
    introduction:
      "Et laudantium itaque accusantium voluptatum nesciunt atque id voluptas. Explicabo deserunt consequatur quia.",
    followshipCreatedAt: "2021-04-21T03:26:24.000Z",
    isFollowing: true,
  },
];
```

```jsx
{
    "message": "this user has no follower!"
}
```

error

```jsx
{
    "message": "this user does not exist!"
}
```

### 查看單一使用者跟隨中的人

```jsx
GET /api/users/:id/followings
```

**Response**

Success

```jsx
[
  {
    followingId: 2,
    account: "@user1",
    name: "user1",
    avatar: "https://i.imgur.com/OFjWJfj.jpg",
    introduction: "hello000",
    followshipCreatedAt: "2021-04-21T03:26:24.000Z",
    isFollowing: true,
  },
];
```

```jsx
{
    "message": "this user has no following!"
}
```

error

```jsx
{
    "message": "this user has no following!"
}
```

### 查看建議追隨名單

```jsx
GET / api / users / tops;
```

**Response**

Success ( 以 1 個 user 為例 )

```jsx
[
  {
    id: 2,
    name: "user1",
    account: "user1",
    avatar: "https://loremflickr.com/320/240/people/?lock=804",
    isFollowing: false,
  },
];
```

### 取得現在登入的 user 資料

```jsx
GET / api / users / currentUser;
```

**Response**

Success

```jsx
{
    "id": 3,
    "account": "user2",
    "name": "user2",
    "avatar": "https://loremflickr.com/320/240/people/?lock=465",
    "cover": "https://loremflickr.com/800/300/restaurant,food/?lock=911",
    "introduction": "Inventore et autem sapiente est quo sint incidunt earum nostrum. Velit voluptas voluptas aperiam enim autem autem quis ab. Aut suscipit modi voluptas laboriosam rerum occaecati eius eos.",
    "role": "user"
}
```

### 追蹤一個使用者

```jsx
POST /api/followships/
```

**Request**

| 欄位(Body) | 型別( type ) | 說明 (description) |
| ---------- | ------------ | ------------------ |
| id         | INTEGER      | 追蹤者 id          |

**Response**

Success

```jsx
{
    "status": "success",
    "message": "Followship has built successfully!"
}
```

error

```jsx
{
    "status": "error",
    "message": "Can't find followerId."
}
```

### 取消追蹤使用者

```jsx
DELETE /api/followships/:userId
```

**Response**

Success

```jsx
{
    "status": "success",
    "message": "Followship has removed successfully!"
}
```

error

```jsx
{
    "status": "error",
    "message": "Can't find followerId!"
}
```

### 瀏覽多則推文

包含使用者資料、喜歡數量、回覆數量

```jsx
GET / api / tweets;
```

**Response**

Success ( 以一則 tweet 為例)

```jsx
{
        "id": 1,
        "UserId": 2,
        "description": "Natus ut id consequatur autem. Suscipit mollitia a et. Aliquid illum qui dolor voluptatem pariatur veritatis ut odit incidunt. Eius nemo saepe quo est vel ut est. Ad aut harum.",
        "createdAt": "2021-04-20T10:27:23.000Z",
        "updatedAt": "2021-04-20T10:27:23.000Z",
        "likedCount": 2,
        "repliedCount": 3,
        "user": {
            "avatar": "https://loremflickr.com/320/240/people/?lock=213",
            "name": "user1",
            "account": "@user1"
        }
    }
```

error

```jsx
{
    "status": "error",
    "message": "There is no tweets in database."
}
```

### 瀏覽一筆推文

包含使用者資料、喜歡數量、回覆內容及數量

```jsx
GET/api/tweets/:tweetId
```

**Response**

Success

```jsx
{
    "id": 45,
    "UserId": 6,
    "description": "Enim a iure quasi deleniti vel. Molestias voluptatum ut doloremque nesciunt voluptas ut sed. Ad eos iure explicabo excepturi corporis. Ea ullam dolor. Consequatur iure et omnis est assumenda sint. Unde quo amet quibusdam quaerat rerum quis omnis.",
    "createdAt": "2021-04-20T10:27:23.000Z",
    "updatedAt": "2021-04-20T10:27:23.000Z",
    "likedCount": 1,
    "repliedCount": 4,
    "user": {
        "avatar": "https://loremflickr.com/320/240/people/?lock=428",
        "name": "user5",
        "account": "@user5"
    },
    "tweetReplies": [
        {
            "id": 152,
            "tweetId": 45,
            "comment": "9999999999999999",
            "updatedAt": "2021-04-23T02:13:17.000Z",
            "User": {
                "id": 2,
                "avatar": "https://loremflickr.com/320/240/people/?lock=213",
                "name": "user1",
                "account": "@user1"
            }
        }
    ]
}
```

error

```jsx
{ status: 'error', message: "Can't find this tweet." }
```

### 新增一筆推文

```jsx
POST/api/tweets/
```

**Request**

| 欄位(Body)  | 型別( type ) | 說明 (description) |
| ----------- | ------------ | ------------------ |
| description | String       | 140 字以下         |

**Response**

Success

```jsx
{
    "status": "success",
    "message": "Tweet has built successfully!"
}
```

error

```jsx
{
    "status": "error",
    "message": "Can't find this tweet."
}
```

```jsx
{
    "status": "error",
    "message": "Description max length is 140 words"
}
```

### 瀏覽一筆推文的回覆

```jsx
GET/api/tweets/:tweetId/replies
```

**Response**

Success ( 以一筆回覆為例 )

```jsx
{
        "id": 13,
        "tweetId": 5,
        "comment": "Eius voluptatem deleniti inventore sit quis esse nulla et. Cumque ut debitis. Aspernatur vero similique ipsum nam.",
        "updatedAt": "2021-04-20T10:27:23.000Z",
        "User": {
            "id": 4,
            "avatar": "https://loremflickr.com/320/240/people/?lock=584",
            "name": "user3",
            "account": "@user3"
        }
    }
```

error

```jsx
{
    "status": "error",
    "message": "Can't find this tweet."
}
```

### 新增一則回覆

```jsx
POST/api/tweets/:tweetId/replies
```

**Request**

| 欄位(Body) | 型別( type ) | 說明 (description) |
| ---------- | ------------ | ------------------ |
| comment    | String       | 140 字以下         |

**Response**

Success

```jsx
{
    "status": "success",
    "message": "Reply has built successfully!"
}
```

error

```jsx
{ "status": "error", "message": "It must have comment to reply." }
```

```jsx
{ "status": "error", "message": "This tweetId doesn't exist." }
```

```jsx
{ "status": "error", "message": "comment max length is 140 words" }
```

### 喜歡一則貼文

```jsx
POST/api/tweets/:tweetId/like
```

**Response**

Success

```jsx
{
    "status": "success",
    "message": "Like has built successfully!"
}
```

error

```jsx
{ "status": "error", "message": "This tweetId doesn't exist." }
```

```jsx
{
    "status": "error",
    "message": "Failed to build a like."
}
```

### 收回對一則貼文的喜歡

```jsx
POST/api/tweets/:tweetId/unlike
```

**Response**

Success

```jsx
{
    "status": "success",
    "message": "Like has removed successfully!"
}
```

error

```jsx
{
    "status": "error",
    "message": "Failed to remove a like."
}
```

### 瀏覽所有通知

```jsx
GET / api / notifies;
```

**Response**

Success ( 以一則為例 )

```jsx
"notifies": [
        {
            "id": 10,
            "readStatus": 1,
            "objectId": 88,
            "objectType": "tweets",
            "objectText": "12345678901234567890",
            "createdAt": "2021-05-02T04:06:31.000Z",
            "Sender": {
                "id": 5,
                "account": "user4",
                "name": "user4",
                "avatar": "https://loremflickr.com/320/240/people/?lock=661"
            }
        }
]
```

---

## 聊天室 API (Socket io)

### 使用者驗證

| 連線狀態          | 後端操作 | 前端操作                        |
| ----------------- | -------- | ------------------------------- |
| before connection | io.use() | 把 token 帶進 socket.auth.token |

### userInfo 事件

| 連線狀態   | 後端操作    | 回傳格式 | 回傳說明   |
| ---------- | ----------- | -------- | ---------- |
| connection | socket.emit | obj      | 使用者資訊 |

**Response**

```jsx
{
    id: 2,
    name: 'aaa',
    account: 'user1',
    email: 'user1@example.com'
    avatar: 'https://loremflickr.com/320/240/people/?lock=804',
    role: 'user',
    socketId: 'BX4owhmhO77C3znPAAAB',
    channel: 'publicRoom'
}
```

### historyMsg 事件

| 連線狀態   | 後端操作    | 回傳格式   | 回傳說明           |
| ---------- | ----------- | ---------- | ------------------ |
| connection | socket.emit | array(obj) | 公開聊天室歷史訊息 |

**Response**

```jsx
[
  {
    id: 10,
    text: '123',
    time: '10:58 am',
    UserId: 3,
    username: 'bbb',
    avatar: 'https://i.imgur.com/vBdOrW2.jpeg'
  },
  ...
]
```

### userOnline 事件

| 連線狀態   | 後端操作                     | 回傳格式 | 回傳說明                               |
| ---------- | ---------------------------- | -------- | -------------------------------------- |
| connection | socket.to('publicRoom').emit | obj      | 廣播使用者進入聊天室(第一次進入聊天室) |

**Response**

```jsx
{
    username: 'Chat Bot',
    text: 'user1 has joined the chat',
    time: '10:10 下午',
    msgType: 'userOnline'
}
```

### onlineCount 事件

| 連線狀態                                                               | 後端操作 | 回傳格式 | 回傳說明                                                |
| ---------------------------------------------------------------------- | -------- | -------- | ------------------------------------------------------- |
| (1) connection (2) connection / socket.on('privateUser') (3)disconnect | io.emit  | number   | 目前線上的人數(同一個使用者開多分頁會被視為 1 個使用者) |

**Response**

```jsx
10;
```

### userList 事件

| 連線狀態                                                                | 後端操作 | 回傳格式    | 回傳說明                                                        |
| ----------------------------------------------------------------------- | -------- | ----------- | --------------------------------------------------------------- |
| (1) connection (2) connection / socket.on('privateUser') (3) disconnect | io.emit  | array (obj) | 目前在線上的使用者列表(同一個使用者開多分頁會被視為 1 個使用者) |

**Response**

```jsx
[
  {
   id: 2,
    name: 'aaa',
    account: 'user1',
    email: 'user1@example.com'
    avatar: 'https://loremflickr.com/320/240/people/?lock=804',
    role: 'user',
    socketId: 'BX4owhmhO77C3znPAAAB',
    channel: 'publicRoom'
   }
  ...
]
```

### userOffline 事件

| 連線狀態   | 後端操作                 | 回傳格式 | 回傳說明             |
| ---------- | ------------------------ | -------- | -------------------- |
| disconnect | io.to('publicRoom').emit | obj      | 廣播使用者離開聊天室 |

**Response**

```jsx
{
    username: 'Chat Bot',
    text: 'user1 has left the chat',
    time: '10:10 下午',
    msgType: 'userOffline'
}
```

### chatMsg 事件 & privateChatMsg 事件

- chatMsg → 公開聊天室
- privateChatMsg → 私人聊天室

| 連線狀態                          | 後端操作                        | 回傳格式 | 回傳說明     |
| --------------------------------- | ------------------------------- | -------- | ------------ |
| connection / socket.on('userMsg') | io.to(socket.user.channel).emit | obj      | 廣播聊天訊息 |

**Response**

```jsx
{
    ChatId: 10
    UserId: 3,
    receivedUserId: 4
    username: 'bbb',
    avatar: 'https://loremflickr.com/320/240/people/?lock=8',
    text: 'dsfdsf',
    time: '12:04 下午',
    isRead: true,
    msgType: ''
}
```

### findUser 事件

| 連線狀態                              | 後端操作    | 回傳格式 | 回傳說明           |
| ------------------------------------- | ----------- | -------- | ------------------ |
| connection / socket.on('privateUser') | socket.emit | string   | 這個 user 是否存在 |

**Response**

```jsx
// 找的到這個user
user: user1 has been found~

// 找不到這個user
can not find user: user1!
```

### privateHistoryMsg 事件

| 連線狀態                              | 後端操作    | 回傳格式   | 回傳說明           |
| ------------------------------------- | ----------- | ---------- | ------------------ |
| connection / socket.on('privateUser') | socket.emit | array(obj) | 私人聊天室歷史訊息 |

**Response**

```jsx
[
  {
    id: 10,
    text: '123',
    time: '10:58 am',
    UserId: 3,
    username: 'bbb',
    avatar: 'https://i.imgur.com/vBdOrW2.jpeg'
  },
  ...
]
```

### historyMsgForOneUser 事件

| 連線狀態                                                                                       | 後端操作                                                               | 回傳格式               | 回傳說明                                             |
| ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------- | ---------------------------------------------------- |
| (1) connection (2) connection / socket.on('privateUser') (3) connection / socket.on('userMsg') | (1,2) socket.emit (3) io.to('publicRoom').to(socket.user.channel).emit | arr(obj)/number/number | 歷史訊息列表、傳訊息的使用者 id、收到訊息的使用者 id |

**Response**

```jsx
historyMsgList:
[
  {
    id: 14,
    UserId: 3,
    receivedUserId: 4,
    text: '5444',
    time: '3:18 下午',
    channel: '3-4',
    username: 'bbb',
    account: 'user2',
    avatar: 'https://loremflickr.com/320/240/people/?lock=239'
  },...
]

UserId: 1
receivedUserId: 2
```

### unreadMsg 事件

| 連線狀態                                                                                       | 後端操作                                           | 回傳格式        | 回傳說明                  |
| ---------------------------------------------------------------------------------------------- | -------------------------------------------------- | --------------- | ------------------------- |
| (1) connection (2) connection / socket.on('privateUser') (3) connection / socket.on('userMsg') | (1,2) socket.emit (3) socket.to('publicRoom').emit | arr(obj)/number | 未讀訊息、未讀的使用者 id |

**Response**

```jsx
message:
[{
  id: 2,
  UserId: 3,
  receivedUserId: 4,
  channel: 3-4
  time: '12:04 下午'
},...]

id: 2
```
