# `GET` /api/tweets  

## API feature
Get data of all tweets  

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

## Output Data  
### Success  
```json
// status code: 200
[
    {
        "id": 43,
        "description": "balabala",
        "createdAt": "2022-07-30T09:39:15.000Z",
        "replyCount": 3,
        "likeCount": 2,
        "User": {
            "id": 6,
            "name": "user5",
            "account": "user5",
            "avatar": "https://avatar-url"
        },
        "isLiked": false
    },
    {
        "id": 49,
        "description": "balabababa",
        "createdAt": "2022-07-29T17:27:20.000Z",
        "replyCount": 3,
        "likeCount": 0,
        "User": {
            "id": 6,
            "name": "user5",
            "account": "user5",
            "avatar": "https://avatar-url"
        },
        "isLiked": false
    },
    // ...more tweets
]
```


## Links  
* [API index](../index.md)  
