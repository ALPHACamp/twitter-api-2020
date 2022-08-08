# `GET` /api/admin/users

## API feature  
Get data of all users.  
* Ensure current user must Admin  
* Return all user data (includes admin)  
* Add counts of eash user (tweetCount、likeCount、followingCount、followerCount)  
* Ordered by tweetCount

## Input data  
### query string  
Settings for pagination (optional)  
| name    | description           | default |
| ------- | --------------------- | ------- |
| `count` | limit of data records | null    |
| `page`  | page (start from 1)   | null    |
### parameters  
None
### req.body  
None


## Output data  
### Success  
```json
// status code: 200
// return an Array
[
    {
        "id": 3,
        "name": "user2",
        "account": "user2",
        "avatar": "<url>",
        "cover": "<url>",
        "tweetCount": 15,
        "likeCount": 19,
        "followingCount": 3,
        "followerCount": 1
    },
    {
        "id": 2,
        "name": "user1",
        "account": "user1",
        "avatar": "<url>",
        "cover": "<url>",
        "tweetCount": 13,
        "likeCount": 20,
        "followingCount": 2,
        "followerCount": 1
    }
]
```


## Links  
* [API index](../index.md)
