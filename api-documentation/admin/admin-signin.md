# `POST` /api/admin/signin

### Feature

使用者登入後台頁面。(只有admin可以登入後台，一般使用者無法登入後台)

### URI Parameters

N/A

### Request Header

不須帶JWT(還沒登入)

```
Content-Type: Content-Type: application/json
```

### Request Body

form enctype: default application/x-www-form-urlencoded;charset=utf-8

| Name | Required | Description | Type |
| --- | --- | --- | --- |
| account | True | 帳號 | String |
| password | True | 密碼 | String |

---

### Response Header

```
content-type: application/json
```

### Response Body

Success | code: 200 使用者登入成功

```json
{
    "status": "success",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjQsIm5hbWUiOiJyb290IiwiZW1haWwiOiJyb290QGV4YW1wbGUuY29tIiwiaXNBZG1pbiI6dHJ1ZSwiaW1hZ2UiOm51bGwsImNyZWF0ZWRBdCI6IjIwMjItMTEtMzBUMDg6MTQ6NTQuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMjItMTEtMzBUMDg6MTQ6NTQuMDAwWiIsImlhdCI6MTY3MDU1NjM0MiwiZXhwIjoxNjcxNDIwMzQyfQ.JDPA4_qFE3GyLFyGH6miWuATgsMLDqB8xW3NgeWXqsA",
        "user": {
            "id": 1,
						"account": "root"
            "name": "Admin",
						"email": "root@example.com"
            "role": "admin",
            "avatar": "<img_url>", // 如果沒有大頭貼圖檔會回傳null
            "createdAt": 1670812139000,
            "updatedAt": 1670812139000
        }
    }
}
```

Failure | code: 400 帳號或密碼未填寫

```json
{
  "status": "error",
  "message": "Account and Password field is required."
}
```

Failure | code: 401 密碼不正確

```json
{
  "status": "error",
  "message": "Account or password is not correct."
}
```

Failure | code: 404 此管理員帳號不存在

```json
{
  "status": "error",
  "message": "This admin account has not created."
}
```

Failure | code: 403 forbidden 一般使用者登入後台

```json
{
  "status": "error",
  "message": "Permission denied."
}
```

Failure | code: 500 其他server error

```json
{
  "status": "error",
  "message": {{err message}}
}
```