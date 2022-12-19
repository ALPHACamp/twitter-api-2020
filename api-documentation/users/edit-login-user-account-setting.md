# `PUT` /api/users/:id/setting

使用者編輯自己的帳戶設定

### URI Parameters
| Params | Description | Type |
| --- | --- | --- |
| id | 登入的使用者自己的id | Number |

### Request Header

```
content-type: application/json
Authorization: Bearer [bearer token]
```

### Request Body

| Name | Required | Description | Type |
| --- | --- | --- | --- |
| account | True | 使用者帳號 | String |
| name | True | 使用者暱稱 (上限50 字) | String |
| email | True | email | String |
| password | True | 密碼 | String |
| checkPassword | True | 需與登入密碼相同 | String |

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

Failure | code: 400 任一欄位為空值

```
{
  "status": "error",
  "message": "All field are required!"
}
```

Failure | code: 403 forbidden 使用者想編輯他人的設定

```
{
  "status": "error",
  "message": "Cannot edit other user's setting."
}
```

Failure | code: 404 使用者id不存在

```
{
  "status": "error",
  "message": "User not found!"
}
```

Failure | code: 422 Email 格式不對

```
{
  "status": "error",
  "message": "Email input is invalid!"
}
```

Failure | code: 422 Name 超過 50 個字

```
{
  "status": "error",
  "message": "Name field has max length of 50 characters."
}
```

Failure | code: 422 Account 已註冊

```
{
  "status": "error",
  "message": "Account name already exists!"
}
```

Failure | code: 422 Email 已註冊

```
{
  "status": "error",
  "message": "Email already exists!"
}
```

Failure | code: 422密碼與確認密碼輸入值不同

```
{
  "status": "error",
  "message": "Password and confirmPassword do not match."
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