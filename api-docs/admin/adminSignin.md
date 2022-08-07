# `POST` /api/admin/signin  

## API feature  
If is authenticated, return a token  
* Ensure account and password are correct  
* Ensure login user role is `admin`  

## Input data  
### parameters  
None
### req.body  

| name       | description | required |
| ---------- | ----------- | -------- |
| `account`  | account     | true     |
| `password` | password    | true     |


## Output data  
### Success  
```javascript
// status code: 200
{
    "token": "random token",
    "user": {
        "id": 1,
        "account": "root",
        "email": "root@example.com",
        "name": "root",
        "avatar": "<url>",
        "cover": "<url>",
        "introduction": "text content",
        "role": "admin",
        "createdAt": "2022-07-29T22:00:00.000Z",
        "updatedAt": "2022-07-29T22:00:00.000Z"
    }
}
```
### Errors  
Got blank in required fields
```json
// status code: 400
{
    "status": "error",
    "message": "All fields are required."
}
```

User user account to login or account not registered yet
```json
// status code: 401
{
    "status": "error",
    "message": "Account not exists for admin."
}
```

Password incorrect
```json
// status code: 401
{
    "status": "error",
    "message": "Password incorrect."
}
```

## Links  
* [API index](../index.md)  
