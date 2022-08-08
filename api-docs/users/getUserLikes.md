# `GET` /api/users/:id/likes 

## API feature
Get likes data of a certain user  
* Ordered by timestamp of like created  



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
### 成功  
```json
// status code: 200
[
    {
        "id": 4,
        "TweetId": 2,
        "createdAt": "2022-07-30T14:24:25.000Z",  // like created time, sorting by this value
        "Tweet": {
            "id": 2,
            "description": "balabala",
            "createdAt": "2022-06-30T17:37:30.000Z", // tweet created time
            "likeCount": 4,
            "replyCount": 3,
            "User": {  // tweet author
                "id": 2,
                "name": "user1",
                "account": "user1",
                "avatar": "https://avatar-url"
            }
        },
        "isLiked": true  // if the current user (req.user) is like the tweet
    },
    {
        "id": 14,
        "TweetId": 7,
        "createdAt": "2022-07-30T14:24:25.000Z",
        "Tweet": {
            "id": 7,
            "description": "balabababa",
            "createdAt": "2022-07-17T20:08:40.000Z",
            "likeCount": 5,
            "replyCount": 3,
            "User": {
                "id": 2,
                "name": "user1",
                "account": "user1",
                "avatar": "https://avatar-url"
            }
        },
        "isLiked": true
    },
    // ...more likes
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
