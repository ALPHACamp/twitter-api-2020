# `GET` /api/users/:id/followers

## API feature
Get followers data of a certain user 
* Ordered by timestamp of followship created 

## Input data  
### query string  
Settings for pagination (optional)  
| name    | description           | default |
| ------- | --------------------- | ------- |
| `count` | limit of data records | null    |
| `page`  | page (start from 1)   | null    |
### parameters  
| params | Description               | required |
| ------ | ------------------------- | -------- |
| `id`   | id of user being searched | true     |
### req.body  
None

## Output data  
### Success  
```json
// status code: 200
[
    {
        "followerId": 2,
        "createdAt": "2022-08-03T11:10:34.000Z",
        "name": "user111",
        "account": "user1",
        "avatar": "https://avatar-rul",
        "introduction": "helloworld",
        "isFollowing": false,
        "followId": 2
    },
    {
        "followerId": 3,
        "createdAt": "2022-08-03T11:10:34.000Z",
        "name": "blanditiis a",
        "account": "user2",
        "avatar": "https://avatar-rul",
        "introduction": "helloworld",
        "isFollowing": true,
        "followId": 3
    },
    // ...more followers
]
```

### Errors  
Lack of valid token
```json
// status code: 401
{
    "status": "error",
    "message": "Unauthorized. Please login first."
}
```
Can't find user by parameter `id`
```json
// status code: 404
{
    "status": "error",
    "message": "User is not found"
}
```

## Links  
* [API index](../index.md)  
