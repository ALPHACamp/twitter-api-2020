# `GET` /api/tweets

### Feature

取得所有使用者推文(包含作者自己)，依crate日期排序，最新的在前

### URI Parameters

N/A

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

(首頁)依推文時間createdAt由新到舊，回傳所有推文

```
[
    {
        "id": 1,
        "description": "Ducimus repudiandae porro saepe non.",
        "createdAt": 1670812139000,
        "replyCount": 3,
        "likeCount": 0,
        "User": {
          "id": 2,
          "name": "user1",
          "account": "user1",
          "avatar": "https://loremflickr.com/320/240/girl/?lock=6.568042719936207"
        },
        "isLiked": false
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