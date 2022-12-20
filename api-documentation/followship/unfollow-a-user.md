# `DELETE` /api/followships/:followingId

### Feature

刪除追蹤使用者紀錄

### URI Parameters

| Params | Description | Type |
| --- | --- | --- |
| followingId | 要取消追蹤的user id | Number |

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

成功取消追蹤使用者

```
{
  "status":"success"
}
```

Failure | code: 404

已經取消追蹤了或是沒有追蹤此使用者

```
{
    "status": "error",
    "message": "You have already unfollowed this user or you havn't followed this user."
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