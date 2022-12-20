# `POST` /api/tweets/:tweet_id/replies

### Feature

使用者對特定推文新增一筆回覆

### URI Parameters

| Params | Description | Type |
| --- | --- | --- |
| tweet_id | 推文id | Number |

### Request Header

```
Content-Type: Content-Type: application/json
Authorization: Bearer [bearer token]
```

### Request Body

| Name | Required | Description | Type |
| --- | --- | --- | --- |
| comment | True | 回覆內容(不可空白，上限140字，教案內僅限制不可空白) | String |
 

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
  "message": "Replied comment is empty."
}
```

Failure | code: 404

找不到這則推文

```
{
    "status": "error",
    "message": "Cannot find this tweet."
}
```

Failure | code: 422 

推文內容超過140字

```
{
  "status": "error",
  "message": "Replied comment should be less than 140 characters."
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