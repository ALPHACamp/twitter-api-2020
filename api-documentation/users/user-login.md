# `POST`  /api/signin

### Feature

使用者登入前台頁面。(一般使用者只能登入前台，admin不可登入前台)

### URI Parameters

N/A

### Request Header


```
Content-Type: application/json
```

### Request Body

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

```
{
    "status": "success",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiYWNjb3VudCI6InVzZXIxIiwibmFtZSI6InVzZXIxIiwiZW1haWwiOiJ1c2VyMUBleGFtcGxlLmNvbSIsImludHJvZHVjdGlvbiI6ImN1bXF1ZSBzaW50IHV0IHF1aSBkZWJpdGlzIG9mZmljaWEiLCJhdmF0YXIiOiJodHRwczovL2xvcmVtZmxpY2tyLmNvbS8zMjAvMjQwL2dpcmwvP2xvY2s9Ni41NjgwNDI3MTk5MzYyMDciLCJjb3ZlciI6Imh0dHBzOi8vbG9yZW1mbGlja3IuY29tLzgyMC8zMjAvbGFuZHNjYXBlLz9sb2NrPTQ3LjQyMjU5NjU0MzY5Mzc2NCIsInJvbGUiOiJ1c2VyIiwiY3JlYXRlZEF0IjoiMjAyMi0xMi0xMlQwMjoyODo1OC4wMDBaIiwidXBkYXRlZEF0IjoiMjAyMi0xMi0xMlQwMjoyODo1OC4wMDBaIiwiaWF0IjoxNjcwODIzNDY5LCJleHAiOjE2NzEyNTU0Njl9.cZqoiGF03owU7fIFWInjWVeNk5gplLon8PfgXRI60qg",
        "user": {
            "id": 2,
            "account": "user1",
            "name": "user1",
            "email": "user1@example.com",
            "introduction": "cumque sint ut qui debitis officia",
            "avatar": "https://loremflickr.com/320/240/girl/?lock=6.568042719936207",
            "cover": "https://loremflickr.com/820/320/landscape/?lock=47.422596543693764",
            "role": "user",
            "createdAt": 1670812139000,
            "updatedAt": 1670812139000
        }
    }
}
```

Failure | code: 400 帳號或密碼未填寫

```
{
  Bad Request
}
```

Failure | code: 401 帳號不存在

```
{
  "status": "error",
  "message": "This account has not registered."
}
```

Failure | code: 401 密碼不正確

```
{
  "status": "error",
  "message": "Account or password is not correct."
}
```

Failure | code: 403 forbidden 管理員登入前台

```
{
  "status": "error",
  "message": "Permission denied."
}
```

Failure | code: 500 其他server error

```
{
  "status": "error",
  "message": {{err message}}
}
```