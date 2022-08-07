# `PUT` /api/users/:id

## API feature  
Update user's own profile.
* Ensure only `role = user` can edit profile
* Data：
    * Image(avatar, cover) will be  uploaded to imgur and return an URL stored in database
    * `email` and `accout` should be unique
    * `name` should be within 50 characters, `introduction` should be within 160 characters
    * `password` should equals to `checkPassword`  
* Return updated user data(password excluded)

## Input data  
### parameters  
| params | Description | required |
| ------ | ----------- | -------- |
| `id`   | user id     | true     |
### Request
Content-Type: multipart/form-data

All values are optional.
| params          | Description                      |
| --------------- | -------------------------------- |
| `id`            | user id                          |
| `name`          | user name                        |
| `email`         | user email                       |
| `password`      | user password                    |
| `checkPassword` | user password again              |
| `introduction`  | user introduction                |
| `avatar`        | user avatar （string: image url) |
| `cover`         | user cover （string: image url)  |


## Output data  
### Success  
```json
// status code: 200
{
    "id": 2,
    "account": "user1",
    "email": "user1@example.com",
    "name": "user1",
    "avatar": "https://avatar-url",
    "cover": "https://cover-url",
    "introduction": "helloworld",
    "role": "user",
    "createdAt": "2022-08-03T11:10:34.000Z",
    "updatedAt": "2022-08-04T03:34:37.263Z"
}
```

### Errors  
Lack of parameter `id`
```json
// status code: 401
{
    "status": "error",
    "message": "Id number is not found in url request"
}
```

parameter `id` doesn't equals to  current user id
```json
// status code: 400
{
    "status": "error",
    "message": "Can not edit other's profile"
}
```
`email` is already registered by other user
```json
// status code: 401
{
    "status": "error",
    "message": "The email is registered."
}
```
`account` is already registered by other user
```json
// status code: 401
{
    "status": "error",
    "message": "The account is registered."
}
```
`name` is longer than 50 characters
```json
// status code: 400
{
    "status": "error",
    "message": "Name is too long."
}
```
`introduction` is longer than 160 characters
```json
// status code: 400
{
    "status": "error",
    "message": "Introduction is too long."
}
```
`password` doesn't equals to `checkPassword` 
```json
// status code: 401
{
    "status": "error",
    "message": "Password and checkPassword are not same."
}
```

## Links  
* [API index](../index.md)  
