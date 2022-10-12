# `POST` /api/users/signin

### Feature

使用者只能登入前台

### Parameters

N/A

### Request Body

| Name       | Required | Description   | Type   |
| ---------- | -------- | ------------- | ------ |
| `account`  | True     | user account  | String |
| `password` | True     | user password | String |

### Response Body

<font color="#008B8B">Success | code: 200</font>  
使用者成功登入，回傳使用者個人資料

```json
{
  "status": "success",
  "token": "fhuiwqhef.189u389gre.gqjreip",
  "user": {
    "id": 2,
    "name": "user1",
    "account": "user1",
    "email": "user1@example.com",
    "avatar": "<url>",
    "role": "user"
  }
}
```

<font color="#DC143C">Failure | code: 400</font>  
帳號或密碼欄位為空值（此回應由 passport 產生）

```json
{
    "Bad Request"
}
```

<font color="#DC143C">Failure | code: 401</font>  
帳號未註冊過

```json
{
  "status": "error",
  "message": "Incorrect email or password."
}
```

<font color="#DC143C">Failure | code: 401</font>  
密碼錯誤

```json
{
  "status": "error",
  "message": "Incorrect email or password."
}
```

<font color="#DC143C">Failure | code: 403</font>  
以管理者帳號登入前台

```json
{
  "status": "error",
  "message": "Permission denied."
}
```
