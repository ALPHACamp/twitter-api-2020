# `PUT` /api/users/:id

Feature

使用者編輯自己的profile

### URI Parameters

| Params | Description | Type |
| --- | --- | --- |
| id | 登入的使用者自己的id | Number |

### Request Header

```
Content-Type:multipart/form-data
Authorization: Bearer [bearer token]
```

### Request Body

<form enctype: multipart/form-data> 這隻因為要傳圖檔，所以要麻煩送表單來

| Name | Required | Description | Type |
| --- | --- | --- | --- |
| name | True | 使用者暱稱 (上限50 字) | String |
| introduction | False | 個人簡介(上限160字) | String |
| avatar | False | 上傳大頭照(上限10MB) | file |
| cover | False | 個人頁面背景橫幅(上限10MB) | file |

### 備註

圖片檔用file上傳，不使用base64字串

---

### Response Header

```
content-type: application/json
```

### Response Body

Success | code: 200 

```
{
  "status": "success",
}
```

Failure | code: 400 未填寫使用者name

```
{
  "status": "error",
  "message": "User name is required!"
}
```

Failure | code: 400 cover或avatar使用者上傳非圖檔(接受png/jpg/jpeg格式)

```
{
  "status": "error",
  "message": "Please upload image file format."
}
```

Failure | code: 403 forbidden 使用者想編輯他人的檔案

```
{
  "status": "error",
  "message": "Cannot edit other user's profile."
}
```

Failure | code: 404 找不到這個使用者

```
{
  "status": "error",
  "message": "Cannot find this user."
}
```

Failure | code: 422 自我介紹字數超過160字

```
{
  "status": "error",
  "message": "User's introduction should be less than 160 chars"
}
```

Failure | code: 422 name暱稱字數超過50字

```
{
  "status": "error",
  "message": "Username should be less than 50 chars."
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

Failure | code: 500 

其他server error

```
{
  "status": "error",
  "message": {{err message}}
}
```