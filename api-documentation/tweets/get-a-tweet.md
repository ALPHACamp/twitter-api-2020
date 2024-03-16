# `GET` /api/tweets/:tweet_id

### Feature

查閱單一推文內容

### URI Parameters

| Params | Description | Type |
| --- | --- | --- |
| tweet_id | 推文id | Number |

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

單一推文內容

```

{
    "id": 14, // 貼文id
    "description": "Sunt qui id ut optio.",
    "createdAt": 1671066800000,
    "replyCount": 3,
    "likeCount": 0,
    "isLiked": false,
    "User": { // 發貼文的人(這個登入者)
        "id": 3,
        "name": "user2",
        "account": "user2",
        "avatar": "https://loremflickr.com/320/240/girl/?lock=67.72936483701146"
    }
}

```


Failure | code: 404 找不到該推文(新增)

```
{
  "status": "error",
  "message": "Cannot find this tweet."
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