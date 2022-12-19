# `POST` /api/users
### Feature

使用者註冊一個新帳號

### URI Parameters

N/A

### Request Header

不須帶JWT(還沒登入)

```
content-type: application/json
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
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsImFjY291bnQiOiJtYXJpbyIsIm5hbWUiOiJNYXJpbyIsImVtYWlsIjoibWFyaW9AZXhhbXBsZS5jb20iLCJ1cGRhdGVkQXQiOjE2NzEyNDU1NDUxOTEsImNyZWF0ZWRBdCI6MTY3MTI0NTU0NTE5MSwiaWF0IjoxNjcxMjQ1NTQ1LCJleHAiOjE2NzE2Nzc1NDV9.Jl435aEnUKRrDVGeePI652AEhUbir32dQEK6pdoQN-4",
        "user": {
            "id": 13,
            "account": "mario",
            "name": "Mario",
            "email": "mario@example.com",
            "updatedAt": 1671245545191,
            "createdAt": 1671245545191
        }
    }
} 
```

Failure | code: 400任一欄位為空值

```
{
  "status": "error",
  "message": "All field are required!"
}
```

Failure | code: 422密碼與確認密碼輸入值不同

```
{
  "status": "error",
  "message": "Password and confirmPassword do not match."
}
```

Failure | code: 422Email 格式不對

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
  "message": "Account already exists!"
}
```

Failure | code: 422 Email 已註冊

```
{
  "status": "error",
  "message": "Email already exists!"
}
```

Failure | code: 500 其他server error

```
{
  "status": "error",
  "message": {{err message}}
}
```