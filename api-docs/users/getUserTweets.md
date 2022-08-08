# `GET` /api/users/:id/tweets

## API feature  
Get tweets of a certain user  
* Ordered by timestamp of tweet created  

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
### 驗證成功  
```json
// status code: 200
// return an Array
[
    {
        "id": 4,
        "description": "balabala",
        "createdAt": "2022-07-29T13:02:03.000Z",
        "replyCount": 3,
        "likeCount": 2,
        "User": {
            "id": 2,
            "name": "user1",
            "account": "user1",
            "avatar": "https://avatar-url"
        },
        "isLiked": true
    },
    {
        "id": 8,
        "description": "balabababa",
        "createdAt": "2022-07-21T19:33:12.000Z",
        "replyCount": 3,
        "likeCount": 0,
        "User": {
            "id": 2,
            "name": "user1",
            "account": "user1",
            "avatar": "https://avatar-url"
        },
        "isLiked": false
    },
    // ...more tweets
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
