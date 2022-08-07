# `POST` /api/users  

## API feature  
user signup。  
* `name` should be with in 50 characters  
* `account` and `email` is unique  
* `password` should equals to `checkPassword`  

## Input data  
### parameters  
None

### req.body  
| Column        | Description                | required |
| ------------- | -------------------------- | -------- |
| name          | user name(within 50 chars) | true     |
| account       | login account              | true     |
| email         | email                      | true     |
| password      | password                   | true     |
| passwordCheck | enter password again       | true     |

## Output data  
### Success  
```json
// status code: 200
{
    "status": "success",
    "message": "Sign up success."
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

`name` is longer than 50 characters 
```json
// status code: 400
{
    "status": "error",
    "message": "Field 'name' should be limited within 50 characters."
}
```

Password doesn't equals to checkPassword
```json
// status code: 401
{
    "status": "error",
    "message": "Password and checkPassword should be the same."
}
```

`account` or `email` is already registered
```json
// status code: 401

// account 
{
    "status": "error",
    "message": "Account already exists. Please try another one."
}

// email 
{
    "status": "error",
    "message": "Email already exists. Please try another one."
}
```

## Links  
* [API index](../index.md)  
