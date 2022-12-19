# `GET` /api/admin/tweets

### Feature

取得所有推文，由新到舊排序

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

依推文時間createdAt由新到舊回傳所有推文

備註: 推文僅回覆50字

```
[
    {
        "id": 1,
        "description": "Ducimus repudiandae porro saepe non.",
        "createdAt": 1670812139000,
        "User": {
            "id": 2,
            "name": "user1",
            "account": "user1",
            "avatar": "https://loremflickr.com/320/240/girl/?lock=6.568042719936207"
        }
    },
    {
        "id": 2,
        "description": "Ut sit non blanditiis corporis.",
        "createdAt": 1670812139000,
        "User": {
            "id": 2,
            "name": "user1",
            "account": "user1",
            "avatar": "https://loremflickr.com/320/240/girl/?lock=6.568042719936207"
        }
    },
.......// 依照時間先後排序，最新的排最前面
]
 

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