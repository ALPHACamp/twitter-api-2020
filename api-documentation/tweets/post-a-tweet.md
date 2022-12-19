# `POST` /api/tweets

### Feature

使用者新增一則推文

### URI Parameters

N/A

### Request Header

```
Content-Type: Content-Type: application/json
Authorization: Bearer [bearer token]
```

### Request Body

| Name | Required | Description | Type |
| --- | --- | --- | --- |
| description | True | 推文內容(不可空白，上限140字) | String |
---

### Response Header

```
content-type: application/json
```

### Response Body

Success | code: 200

推文新增成功

```
{
  "status":"success"
}
```

Failure | code: 400輸入空白內容

```
{
  "status": "error",
  "message": "Discription is empty."
}
```

Failure | code: 422 

推文內容超過140字

```
{
  "status": "error",
  "message": "Tweets content should be less than 140 characters."
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