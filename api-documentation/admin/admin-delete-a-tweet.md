# `DELETE` /api/admin/tweets/:id

### Feature

管理者刪除單一推文

### URI Parameters

| Params | Description | Type |
| ---| --- | --- |
| id | 要刪除的tweetId | Number |

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

貼文刪除成功

```
{
	"status": "success"
}

```

Failure | code: 404 找不到此筆推文

```
{
    "status": "error",
    "message": "Tweet does not exist."
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