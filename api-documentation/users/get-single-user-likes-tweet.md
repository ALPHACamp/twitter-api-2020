# `GET` /api/users/:id/likes

### Feature

取得單一使用者所有喜歡的推文，推文由新到舊排序

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

Success | code: 200 依like時間createdAt由新到舊回傳該用戶所有like的推文

```
[
  {
      "TweetId": 2, // 該使用者喜歡的推文id(測試規定)
      "createdAt": 1670812139000, // 該使用者按下like的時間
      "Tweet": { // 該使用者喜歡的推文
          "id": 2, 
          "description": "ued ut perspiciatis unde omnis iste natus",
          "createdAt": 1670812139000,
          "replyCount": 10,
          "likeCount": 36,
          "isLiked": true, // 現在登入的使用者是否like過這則推文
          "User": { // 推文的作者
            "id":2
            "name":"user2",
            "account":"user2",
            "avatar": "https://loremflickr.com/320/240/man,woman/?lock=36"
          }
        }
  },
		....// 依照時間先後排序，最新的排最前面
 
]

```

Failure | code: 404 找不到該使用者

```
{
  "status": "error",
  "message": "User not found!"
}
```

Failure | code: 401 使用者未登入就使用此服務

If your request header do not send
`Authorization: Bearer [bearer token]`

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