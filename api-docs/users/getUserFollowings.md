# `GET` /api/users/:id/followings  

## API feature  
Get followings data of a certain user  
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
        "followingId": 11,
        "createdAt": "2022-08-03T11:10:34.000Z",
        "name": "quaerat sit",
        "account": "user10",
        "avatar": "https://avatar-url",
        "introduction": "helloworld",
        "isFollowing": true,
        "followId": 11
    },
    {
        "followingId": 4,
        "createdAt": "2022-08-03T11:10:34.000Z",
        "name": "impedit error",
        "account": "user3",
        "avatar": "https://avatar-url",
        "introduction": "helloworld",
        "isFollowing": true,
        "followId": 4
    },
    // ...more followings
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
