# Simple Twitter Backend API
### 開始使用
### 1. clone 專案
```
git clone https://github.com/LoisChen68/twitter-api-2020.git
```
### 2. 參考 `config/config.json` 新增資料庫
```
"development": {
  "username": "root",
  "password": "password",
  "database": "ac_twitter_workspace",
  "host": "127.0.0.1",
  "dialect": "mysql"
}
```
### 3. 下載套件
```
cd twitter-api-2020
npm install
```
### 4. 新增資料表
```
npx sequelize db:migrate
```
### 5. 新增種子資料
```
npx sequelize db:seed:all
```
### 6. 參考 `.env.example` 建立 `.env`
```
JWT_SECRET=
IMGUR_CLIENT_ID=
```
### 7. 啟動伺服器
```
npm run dev
```
看見 `Example app listening on port 3000!` 訊息代表成功啟動。

## API 文件
### User APIs
### 1. 註冊：POST api/users
- Parameters：No
- Request Body：
```Json
{
    "name":"user",
    "email":"user@example.com",
    "account":"user",
    "password":"12345678",
    "checkPassword":"12345678"
}
```
- Response
- 200 OK
```json
{
    "status": "success"
}
```
- 500 Internal Server Error
```json
{
    "status": "error",
    "message": "密碼與確認密碼不相符"
}
```
```json
{
    "status": "error",
    "message": "該account已被註冊！"
}
```
```json
{
    "status": "error",
    "message": "該Email已被註冊！"
}
```
### 2. 登入：POST api/users/signin
- Parameters：No
- Request Body：
```Json
{
    "account":"user",
    "password":"12345678"
}
```
- Response
- 200 OK
```Json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsImFjY291bnQiOiJ1c2VyIiwibmFtZSI6InVzZXIiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJyb2xlIjoidXNlciIsInByb2ZpbGVQaG90byI6Imh0dHBzOi8vY2RuLWljb25zLXBuZy5mbGF0aWNvbi5jb20vNTEyLzExNDQvMTE0NDc2MC5wbmciLCJjb3ZlclBob3RvIjoiaHR0cHM6Ly9pLmltZ3VyLmNvbS90MFlScVFILmpwZyIsImludHJvZHVjdGlvbiI6bnVsbCwiY3JlYXRlZEF0IjoiMjAyMi0xMC0xNFQxMzoxNDo0My4wMDBaIiwidXBkYXRlZEF0IjoiMjAyMi0xMC0xNFQxMzoxNDo0My4wMDBaIiwiaWF0IjoxNjY1NzU5MzA0LCJleHAiOjE2NjgzNTEzMDR9.AtkevVARxo-UOCSFOcw686gkPjQUZNSvBZmSH9M9vLE",
    "userData": {
        "id": 13,
        "account": "user",
        "name": "user",
        "email": "user@example.com",
        "role": "user",
        "profilePhoto": "https://cdn-icons-png.flaticon.com/512/1144/1144760.png",
        "coverPhoto": "https://i.imgur.com/t0YRqQH.jpg",
        "introduction": null,
        "createdAt": "2022-10-14T13:14:43.000Z",
        "updatedAt": "2022-10-14T13:14:43.000Z"
    }
}
```
- 403 Forbidden
```json
{
    "status": "error",
    "message": "權限不足"
}
```
- 500 Internal Server Error
```json
{
    "status": "error",
    "message": "帳號不存在"
}
```
```json
{
    "status": "error",
    "message": "帳號或密碼錯誤"
}
```
### 3. 取得當前登入使用者的資料： GET api/users
- Parameters：No
- Request Body：No
- Response：
- 200 OK
```json
{
    "id": 2,
    "account": "user1",
    "name": "user1",
    "email": "user1@example.com",
    "role": "user",
    "profilePhoto": "https://fakeimg.pl/140/",
    "coverPhoto": "https://i.imgur.com/t0YRqQH.jpg",
    "introduction": null
}
```
- 401 Unauthorized
```json
{
    "status": "error",
    "message": "尚未登入"
}
```
### 4. 取得個人資料： GET api/users/:id
- Parameters：

| Params | Required | Type | Description |
| --- | --- | --- | --- |
| id | Required | int | 使用者的 id |

- Request Body：No
- Response：
- 200 OK
```json
{
    "id": 3,
    "account": "user",
    "name": "user3",
    "email": "user@example.com",
    "role": "user",
    "profilePhoto": "https://fakeimg.pl/140/",
    "coverPhoto": "https://i.imgur.com/t0YRqQH.jpg",
    "introduction": null,
    "createdAt": "2022-10-07T20:15:00.000Z",
    "followerCounts": 1,
    "followingCounts": 3,
    "isFollowed": true
}
```
- 401 Unauthorized
```json
{
    "status": "error",
    "message": "尚未登入"
}
```
- 403 Forbidden
```json
{
    "status": "error",
    "message": "權限不足"
}
```
- 500 Internal Server Error
```json
{
    "status": "error",
    "message": "該使用者不存在"
}
```
### 5. 取得使用者發過的推文： GET api/users/:id/tweets
- Parameters：

| Params | Required | Type | Description |
| --- | --- | --- | --- |
| id | Required | int | 使用者的 id |

- Request Body：No
- Response：
- 200 OK
```json
[
    {
        "id": 1, // 推文id
        "description": "Voluptatum et quisquam. Est molestiae reprehenderit reprehenderit odio consequatur. Id fuga asperiores animi. Dolore et eos quaerat. Culpa n",
        "UserId": 2, // 推文擁有者id
        "createdAt": "2022-10-11T09:22:10.000Z",
        "updatedAt": "2022-10-11T09:22:10.000Z",
        "replyCounts": 3, //推文留言數
        "likeCounts": 1, // 推文喜歡數
        "User": {
            "id": 2, // 推文擁有者資料
            "account": "user1",
            "name": "user1",
            "profilePhoto": "https://cdn-icons-png.flaticon.com/512/1144/1144760.png"
        },
        "isLiked": true // 此推文是否被當前使用者按過喜歡
    },
]
```
- 401 Unauthorized
```json
{
    "status": "error",
    "message": "尚未登入"
}
```
- 403 Forbidden
```json
{
    "status": "error",
    "message": "權限不足"
}
```
- 500 Internal Server Error
```json
{
    "status": "error",
    "message": "使用者不存在"
}
```
### 6. 取得使用者在推文的留言： GET api/users/:id/replied_tweets
- Parameters：

| Params | Required | Type | Description |
| --- | --- | --- | --- |
| id | Required | int | 使用者的 id |

- Request Body：No
- Response：
- 200 OK
```json
[
    {
        "id": 332,
        "comment": "天氣晴",
        "UserId": 2,
        "TweetId": 2,
        "createdAt": "2022-10-14T14:52:05.000Z",
        "updatedAt": "2022-10-14T14:52:05.000Z",
        "User": {
            "id": 2,
            "account": "user1",
            "name": "user1",
            "profilePhoto": "https://cdn-icons-png.flaticon.com/512/1144/1144760.png"
        },
        "Tweet": {
            "UserId": 2,
            "User": {
                "id": 2,
                "account": "user1"
            }
        }
    }
]
```
- 401 Unauthorized
```json
{
    "status": "error",
    "message": "尚未登入"
}
```
- 403 Forbidden
```json
{
    "status": "error",
    "message": "權限不足"
}
```
- 500 Internal Server Error
```json
{
    "status": "error",
    "message": "使用者不存在"
}
```
### 7. 取得使用者喜歡的內容： GET api/users/:id/likes
- Parameters：

| Params | Required | Type | Description |
| --- | --- | --- | --- |
| id | Required | int | 使用者的 id |

- Request Body：No
- Response：
```Json
[
    {
        "id": 1, //推文id
        "description": "Voluptatum et quisquam. Est molestiae reprehenderit reprehenderit odio consequatur. Id fuga asperiores animi. Dolore et eos quaerat. Culpa n",
        "UserId": 2, //推文擁有者id
        "createdAt": "2022-10-11T09:22:10.000Z",
        "updatedAt": "2022-10-11T09:22:10.000Z",
        "replyCounts": 3, //此推文留言數
        "likeCounts": 1, // 此推文喜歡數
        "User": { //推文擁有者資料
            "id": 2,
            "name": "user1",
            "account": "user1",
            "profilePhoto": "https://cdn-icons-png.flaticon.com/512/1144/1144760.png"
        },
        "isLiked": true, // // 此推文是否被當前使用者按過喜歡
        "TweetId": 1 // 推文id
    }
]
```
- 401 Unauthorized
```json
{
    "status": "error",
    "message": "尚未登入"
}
```
- 403 Forbidden
```json
{
    "status": "error",
    "message": "權限不足"
}
```
### 8. 取得使用者正在關注清單： GET api/users/:id/followings
- Parameters：

| Params | Required | Type | Description |
| --- | --- | --- | --- |
| id | Required | int | 使用者的 id |

- Request Body：No
- Response：
- 200 OK
```Json
[
    {
        "id": 2,
        "name": "user1",
        "profilePhoto": "https://cdn-icons-png.flaticon.com/512/1144/1144760.png",
        "introduction": null,
        "followingId": 2,
        "isFollowed": false
    }
]
```
- 401 Unauthorized
```json
{
    "status": "error",
    "message": "尚未登入"
}
```
- 403 Forbidden

```json
{
    "status": "error",
    "message": "權限不足"
}
```
- 500 Internal Server Error
```json
{
    "status": "error",
    "message": "該使用者不存在"
}
```
### 9. 取得使用者追隨者清單： GET api/users/:id/followers
- Parameters：

| Params | Required | Type | Description |
| --- | --- | --- | --- |
| id | Required | int | 使用者的 id |

- Request Body：No
- Response：
- 200 OK
```Json
[
    {
        "id": 3,
        "name": "user2",
        "profilePhoto": "https://cdn-icons-png.flaticon.com/512/1144/1144760.png",
        "introduction": null,
        "followerId": 3,
        "isFollowed": false
    },
    {
        "id": 4,
        "name": "user3",
        "profilePhoto": "https://cdn-icons-png.flaticon.com/512/1144/1144760.png",
        "introduction": null,
        "followerId": 4,
        "isFollowed": false
    },
]
```
- 401 Unauthorized
```json
{
    "status": "error",
    "message": "尚未登入"
}
```
- 403 Forbidden

```json
{
    "status": "error",
    "message": "權限不足"
}
```
- 500 Internal Server Error
```json
{
    "status": "error",
    "message": "該使用者不存在"
}
```
### 10. 修改個人資料： PUT api/users/:id
- Parameters：

| Params | Required | Type | Description |
| --- | --- | --- | --- |
| id | Required | int | 使用者的 id |

- Request Body：

form-data

| key | type | description |
| --- | --- | --- |
| name | text | 名稱 |
| introduction | text | 自我介紹 |
| profilePhoto | file | 大頭貼 |
| coverPhoto | file | 封面照片 |

- Response
- 200 OK
```json
{
    "id": 2,
    "account": "user1",
    "name": "Lois",
    "email": "user1@example.com",
    "role": "user",
    "profilePhoto": "https://i.imgur.com/jhYUDck.jpeg",
    "coverPhoto": "https://i.imgur.com/8ENbF06.png",
    "introduction": "天氣晴",
    "createdAt": "2022-10-07T20:15:00.000Z",
    "updatedAt": "2022-10-12T06:49:40.302Z"
}
```
- 401 Unauthorized

```json
{
    "status": "error",
    "message": "尚未登入"
}
```
- 403 Forbidden
```json
{
    "status": "error",
    "message": "權限不足"
}
```
- 500 Internal Server Error
```json
{
    "status": "error",
    "message": "不具有權限"

```
```json
{
    "status": "error",
    "message": "暱稱字數限制需在 1~ 50 字之內"
}
```
```json
{
    "status": "error",
    "message": "自我介紹字數限制需在 160 字之內"
}
```
### 11. 修改使用者帳號設定： PUT api/users/:id/setting
- Parameters：

| Params | Required | Type | Description |
| --- | --- | --- | --- |
| id | Required | int | 使用者的 id |

- Request Body
```
{
    "account": "user1",
    "name": "user1",
    "email":"user1@example.com",
    "password": "1234",
    "checkPassword": "1234"
}
```
- Response
- 200 OK
```json
{
    "id": 2,
    "account": "user1",
    "name": "user1",
    "email": "user1@example.com",
    "role": "user",
    "profilePhoto": "https://cdn-icons-png.flaticon.com/512/1144/1144760.png",
    "coverPhoto": "https://i.imgur.com/t0YRqQH.jpg",
    "introduction": null,
    "createdAt": "2022-10-14T13:14:11.000Z",
    "updatedAt": "2022-10-14T15:07:24.819Z"
}
```
- 401 Unauthorized
```json
{
    "status": "error",
    "message": "尚未登入"
}
```
- 403 Forbidden
```json
{
    "status": "error",
    "message": "權限不足"
}
```
- 500 Internal Server Error
```json
{
    "status": "error",
    "message": "此帳號已被使用"
}
```
```json
{
    "status": "error",
    "message": "此Email已被使用"
}
```
```json
{
    "status": "error",
    "message": "密碼不相符"
}
```
### 12. 移除使用者封面照片： PATCH api/users/:id/cover
- Parameters：

| Params | Required | Type | Description |
| --- | --- | --- | --- |
| id | Required | int | 使用者的 id |

- Request Body：No
- Response：
- 200 OK
```json
{
    "status": "success"
}
```
- 401 Unauthorized
```json
{
    "status": "error",
    "message": "尚未登入"
}
```
- 403 Forbidden
```json
{
    "status": "error",
    "message": "權限不足"
}
```
- 500 Internal Server Error
```Json
{
    "status": "error",
    "message": "不具權限"
}
```
### Tweet APIs
### 1. 新增推文： POST api/tweets
- Parameters：No
- Request Body：
```json
{
    "description": "天氣晴"
}
```
- Response：
- 200 OK
```json
{
    "id": 1,
    "description": "天氣晴",
    "UserId": 2,
    "updatedAt": "2022-10-06T15:59:27.859Z",
    "createdAt": "2022-10-06T15:59:27.859Z"
}
```
- 401 Unauthorized
```json
{
    "status": "error",
    "message": "尚未登入"
}
```
- 403 Forbidden
```json
{
    "status": "error",
    "message": "權限不足"
}
```
### 2. 取得所有推文： GET api/tweets
- Parameters：No
- Request Body：No
- Response：
- 200 OK
```json
[
    {
        "id": 111,
        "description": "天氣晴",
        "UserId": 2,
        "createdAt": "2022-10-14T13:58:54.000Z",
        "updatedAt": "2022-10-14T13:58:54.000Z",
        "replyCounts": 0,
        "likeCounts": 0,
        "User": {
            "id": 2,
            "account": "user1",
            "name": "user1",
            "profilePhoto": "https://cdn-icons-png.flaticon.com/512/1144/1144760.png"
        },
        "isLiked": false
    },
]
```
- 401 Unauthorized
```json
{
    "status": "error",
    "message": "尚未登入"
}
```
- 403 Forbidden
```json
{
    "status": "error",
    "message": "權限不足"
}
```
### 3. 取得個別推文： GET api/tweets/:tweet_id
- Parameters：

| Params | Required | Type | Description |
| --- | --- | --- | --- |
| id | Required | int | tweet 的 id |

- Request Body：No
- Response：
- 200 OK
```Json
{
    "id": 3,
    "description": "cusantium quis rerum quod vitae. Officiis numquam praesentium autem maxime. Aspernatur at",
    "UserId": 2,
    "createdAt": "2022-10-14T13:14:22.000Z",
    "updatedAt": "2022-10-14T13:14:22.000Z",
    "replyCounts": 3,
    "likeCounts": 0,
    "User": {
        "id": 2,
        "account": "user1",
        "name": "user1",
        "profilePhoto": "https://cdn-icons-png.flaticon.com/512/1144/1144760.png"
    },
    "isLiked": false
}
```
- 401 Unauthorized
```json
{
    "status": "error",
    "message": "尚未登入"
}
```
- 403 Forbidden
```json
{
    "status": "error",
    "message": "權限不足"
}
```
- 500 Internal Server Error
```json
{
    "status": "error",
    "message": "此推文不存在"
}
```
### 4. 在推文底下新增回覆： POST api/tweets/:tweet_id/replies
- Parameters：

| Params | Required | Type | Description |
| --- | --- | --- | --- |
| id | Required | int | tweet 的 id |

- Request Body：
```json
{
    "comment": "天氣晴"
}
```
- Response：
- 200 OK
```json
{
    "id": 331,
    "comment": "天氣晴",
    "UserId": 2,
    "TweetId": 1,
    "updatedAt": "2022-10-14T14:03:03.025Z",
    "createdAt": "2022-10-14T14:03:03.025Z"
}
```
- 401 Unauthorized
```json
{
    "status": "error",
    "message": "尚未登入"
}
```
- 403 Forbidden
```json
{
    "status": "error",
    "message": "權限不足"
}
```
- 500 Internal Server Error
```json
{
    "status": "error",
    "message": "此貼文不存在"
}
```
### 5. 取得推文中所有回覆： GET api/tweets/:tweet_id/replies
- Parameters：

| Params | Required | Type | Description |
| --- | --- | --- | --- |
| tweet_id | Required | int | tweet 的id |

- Request Body：No
- Response：
- 200 OK
```json
[
    {
        "id": 1,
        "comment": "Sit odit aliquid vel.",
        "UserId": 12,
        "TweetId": 1,
        "createdAt": "2022-10-14T13:14:22.000Z",
        "updatedAt": "2022-10-14T13:14:22.000Z",
        "User": {
            "id": 12,
            "account": "user11",
            "name": "user11",
            "profilePhoto": "https://cdn-icons-png.flaticon.com/512/1144/1144760.png"
        },
        "Tweet": {
            "UserId": 2,
            "User": {
                "id": 2,
                "account": "user1"
            }
        }
    },
]
```
- 401 Unauthorized
```json
{
    "status": "error",
    "message": "尚未登入"
}
```
- 403 Forbidden
```json
{
    "status": "error",
    "message": "權限不足"
}
```
- 500 Internal Server Error
```json
{
    "status": "error",
    "message": "此推文不存在"
}
```
### 6. 將推文加入喜歡： POST api/tweets/:id/like
- Parameters：

| Params | Required | Type | Description |
| --- | --- | --- | --- |
| id | Required | int | tweet的 id |

- Request Body：No
- Response：
- 200 OK
```json
{
    "id": 6,
    "UserId": 2,
    "TweetId": 30,
    "updatedAt": "2022-10-09T06:51:25.305Z",
    "createdAt": "2022-10-09T06:51:25.305Z"
}
```
- 401 Unauthorized
```json
{
    "status": "error",
    "message": "尚未登入"
}
```
- 403 Forbidden
```json
{
    "status": "error",
    "message": "權限不足"
}
```
- 500 Internal Server Error
```json
{
    "status": "error",
    "message": "按過喜歡了"
}
```
```json
{
    "status": "error",
    "message": "推文不存在"
}
```
### 7. 將推文移除喜歡： POST api/tweets/:id/unlike
- Parameters：

| Params | Required | Type | Description |
| --- | --- | --- | --- |
| id | Required | int | tweet 的 id |

- Request Body
- Response：
- 200 OK
```json
{
    "id": 6,
    "UserId": 2,
    "TweetId": 30,
    "createdAt": "2022-10-09T06:51:25.000Z",
    "updatedAt": "2022-10-09T06:51:25.000Z"
}
```
- 401 Unauthorized
```json
{
    "status": "error",
    "message": "尚未登入"
}
```
- 403 Forbidden
```json
{
    "status": "error",
    "message": "權限不足"
}
```
- 500 Internal Server Error
```json
{
    "status": "error",
    "message": "沒按過"
}
```
```json
{
    "status": "error",
    "message": "推文不存在"
}
```

### Followship APIs
### 1. 新增追蹤： POST api/followships
- Parameters：No
- Request Body：
```json
{
    "id":"2"
}
```
- Response：
- 200 OK
```json
{
    "followerId": 1,
    "followingId": 2,
    "updatedAt": "2022-10-05T11:01:12.269Z",
    "createdAt": "2022-10-05T11:01:12.269Z"
}
```
- 500 Internal Server Error
```json
{
    "status": "error",
    "message": "已追蹤過這個使用者"
}
```
```json
{
    "status": "error",
    "message": "該使用者不存在"
}
```
```json
{
    "status": "error",
    "message": "無法追蹤自己"
}
```
### 2. 取消追蹤： DELETE api/followships/:followingId
- Parameters：

| Params | Required | Type | Description |
| --- | --- | --- | --- |
| id | Required | int | followship 的 id |

- Request Body：No
- Response：
- 200 OK
```json
{
    "followerId": 3,
    "followingId": 5,
    "createdAt": "2022-10-14T15:39:24.000Z",
    "updatedAt": "2022-10-14T15:39:24.000Z"
}
```
- 403 Forbidden
```json
{
    "status": "error",
    "message": "權限不足"
}
```
- 500 Internal Server Error
```json
{
    "status": "error",
    "message": "尚未追蹤這個使用者"
}
```
### 3. 推薦跟隨名單： GET api/followships/top
- Parameters：No
- Request Body：No
- Response：
- 200 OK
```json
[
    {
        "id": 4,
        "account": "user3",
        "name": "user3",
        "profilePhoto": "https://fakeimg.pl/140/",
        "introduction": null,
        "FollowingsCount": 2,
        "isFollowed": true
    },
    {
        "id": 3,
        "account": "user2",
        "name": "user2",
        "profilePhoto": "https://fakeimg.pl/140/",
        "introduction": null,
        "FollowingsCount": 1,
        "isFollowed": false
    },
    {
        "id": 5,
        "account": "user4",
        "name": "user4",
        "profilePhoto": "https://fakeimg.pl/140/",
        "introduction": null,
        "FollowingsCount": 1,
        "isFollowed": true
    },
			//...
]
```
- 401 Unauthorized
```json
{
    "status": "error",
    "message": "尚未登入"
}
```
- 403 Forbidden
```json
{
    "status": "error",
    "message": "權限不足"
}
```
### Admin APIs
### 1. 後台使用者登入： POST api/admin/signin
- Parameters：No
- Request Body：
```json
{
    "account": "root",
    "password": "12345678"
}
```
- Response：
- 200 OK
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiYWNjb3VudCI6InJvb3QiLCJuYW1lIjoicm9vdCIsImVtYWlsIjoicm9vdEBleGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiIsInByb2ZpbGVQaG90byI6Imh0dHBzOi8vY2RuLWljb25zLXBuZy5mbGF0aWNvbi5jb20vNTEyLzExNDQvMTE0NDc2MC5wbmciLCJjb3ZlclBob3RvIjoiaHR0cHM6Ly9pLmltZ3VyLmNvbS90MFlScVFILmpwZyIsImludHJvZHVjdGlvbiI6bnVsbCwiY3JlYXRlZEF0IjoiMjAyMi0xMC0wOVQwOToyMTo1NC4wMDBaIiwidXBkYXRlZEF0IjoiMjAyMi0xMC0wOVQwOToyMTo1NC4wMDBaIiwiaWF0IjoxNjY1Mzg1NDA0LCJleHAiOjE2Njc5Nzc0MDR9.5ULtMf-rmvMgXv3qkSrAkYKkU0qJf23CNkKVuadoMTI",
    "userData": {
        "id": 1,
        "account": "root",
        "name": "root",
        "email": "root@example.com",
        "role": "admin",
        "profilePhoto": "https://cdn-icons-png.flaticon.com/512/1144/1144760.png",
        "coverPhoto": "https://i.imgur.com/t0YRqQH.jpg",
        "introduction": null,
        "createdAt": "2022-10-09T09:21:54.000Z",
        "updatedAt": "2022-10-09T09:21:54.000Z"
    }
}
```
### 2. 取得所有使用者： GET api/admin/users
- Parameters：No
- Request Body：No
- Response：
- 200 OK
```json
[
    {
        "id": 2,
        "account": "user1",
        "name": "user1",
        "profilePhoto": "https://fakeimg.pl/140/",
        "coverPhoto": "https://i.imgur.com/t0YRqQH.jpg",
        "createdAt": "2022-10-07T07:23:22.000Z",
        "followerCount": 2,
        "followingCount": 0,
        "tweetsCount": 11,
        "likesCount": 2
    },
    {
        "id": 4,
        "account": "user3",
        "name": "user3",
        "profilePhoto": "https://fakeimg.pl/140/",
        "coverPhoto": "https://i.imgur.com/t0YRqQH.jpg",
        "createdAt": "2022-10-07T07:23:22.000Z",
        "followerCount": 1,
        "followingCount": 1,
        "tweetsCount": 11,
        "likesCount": 1
    },
    {
        "id": 3,
        "account": "user2",
        "name": "user2",
        "profilePhoto": "https://fakeimg.pl/140/",
        "coverPhoto": "https://i.imgur.com/t0YRqQH.jpg",
        "createdAt": "2022-10-07T07:23:22.000Z",
        "followerCount": 0,
        "followingCount": 2,
        "tweetsCount": 10,
        "likesCount": 1
    },
    {
        "id": 5,
        "account": "user4",
        "name": "user4",
        "profilePhoto": "https://fakeimg.pl/140/",
        "coverPhoto": "https://i.imgur.com/t0YRqQH.jpg",
        "createdAt": "2022-10-07T07:23:22.000Z",
        "followerCount": 0,
        "followingCount": 0,
        "tweetsCount": 10,
        "likesCount": 0
    }
]
```
- 401 Unauthorized
```json
{
    "status": "error",
    "message": "尚未登入"
}
```
- 403 Forbidden
```json
{
    "status": "error",
    "message": "權限不足"
}
```
### 3. 取得所有推文： GET api/admin/tweets
- Parameters：No
- Request Body：No
- Response：
- 200 OK
```json
[
    {
        "id": 60,
        "description": "user3的推文",
        "UserId": 4,
        "createdAt": "2022-10-07T17:29:13.000Z",
        "updatedAt": "2022-10-07T17:29:13.000Z",
        "User": {
            "id": 4,
            "account": "user3",
            "name": "user3",
            "profilePhoto": "https://fakeimg.pl/140/"
        }
    },
    {
        "id": 59,
        "description": "user3的推文",
        "UserId": 4,
        "createdAt": "2022-10-07T17:29:12.000Z",
        "updatedAt": "2022-10-07T17:29:12.000Z",
        "User": {
            "id": 4,
            "account": "user3",
            "name": "user3",
            "profilePhoto": "https://fakeimg.pl/140/"
        }
    },
    {
        "id": 58,
        "description": "user1的推文",
        "UserId": 2,
        "createdAt": "2022-10-07T17:29:00.000Z",
        "updatedAt": "2022-10-07T17:29:00.000Z",
        "User": {
            "id": 2,
            "account": "user1",
            "name": "user1",
            "profilePhoto": "https://fakeimg.pl/140/"
        }
    }
]
```
- 401 Unauthorized
```json
{
    "status": "error",
    "message": "尚未登入"
}
```
- 403 Forbidden
```json
{
    "status": "error",
    "message": "權限不足"
}
```
### 4. 管理員刪除推文： DELETE api/admin/tweets/:id
- Parameters：

| Params | Required | Type | Description |
| --- | --- | --- | --- |
| id | Required | int | tweet 的 id |

- Request Body：No
- Response：
- 200 OK
```json
{
    "id": 1,
    "description": "Odit earum facere sit similique aspernatur omnis quasi quia. Reiciendis quae nisi id tenetur nam commodi facilis. Nostrum sunt et pariatur. ",
    "UserId": 2,
    "createdAt": "2022-10-07T07:23:28.000Z",
    "updatedAt": "2022-10-07T07:23:28.000Z"
}
```
- 401 Unauthorized
```json
{
    "status": "error",
    "message": "尚未登入"
}
```
- 403 Forbidden
```json
{
    "status": "error",
    "message": "權限不足"
}
```