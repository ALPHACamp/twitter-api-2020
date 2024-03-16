# `GET` /api/users/:id

### Feature

取得單一使用者profile資訊

### URI Parameters

| Params | Description | Type |
| --- | --- | --- |
| id | 使用者id | Number |

### Request Header

```
Authorization: Bearer [bearer token]
```

### Request Body

N/A

---

### Response Header

```
content-type: application/json
```

### Response Body

Success | code: 200

```
{
    "id": 2,
    "account": "user1",
    "name": "user1",
    "email": "user1@example.com"
    "avatar": "https://loremflickr.com/320/240/man,woman/?lock=36",
    "cover": "https://loremflickr.com/800/600/man,woman/?lock=45",
    "introduction": "Sed ut perspiciatis unde omnis iste natus",
    "isFollowed": true, 
    "tweetCount": 25,
    "followingCount": 231,
    "followerCount": 45,
}
```

Failure | code: 404 找不到該使用者

```
{
  "status": "error",
  "message": "User not found!"
}
```

Failure | code: 401 使用者未登入就使用此服務

If your request header do not send`Authorization: Bearer [bearer token]`

You would get

```
{
  "status": "error",
  "message": "unauthorized"
}
```

Failure | code: 500 其他server error

```
{
  "status": "error",
  "message": {{err message}}
}
```