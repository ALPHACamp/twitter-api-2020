# `POST` /api/tweets/:tweet_id/unlike

### Feature

使用者unlike(取消喜歡)一則推文

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

推文unlike成功

```
{
  "status":"success"
}
```

Failure | code: 404

找不到這則推文或使用者沒有like這則推文

```
{
  "status": "error",
  "message": "Cannot find this tweet or you havn't like this tweet."
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