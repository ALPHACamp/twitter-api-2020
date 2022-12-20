# `POST` /api/followships

### Feature

新增追蹤使用者紀錄

### URI Parameters

N/A

### Request Header

```
Authorization: Bearer [bearer token]
```

### Request Body

| Params | Required | Description | Type |
| --- | --- | --- | --- |
| id | True | 要追蹤的user id | Number |

---

### Response Header

```
content-type: application/json
```

### Response Body

Success | code: 200

成功新增追蹤

```
{
  "status":"success"
}
```

Failure | code: 404

找不到這個想追蹤的user

```
{
    "status": "error",
    "message": "Cannot find this user."
}
```

Failure | code: 422

使用者追蹤自己

```
{
    "status": "error",
    "message": "You cannot follow yourself."
}
```

Failure | code: 422

已追蹤此使用者了

```
{
    "status": "error",
    "message": "You have already followed this user."
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