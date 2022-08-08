# `GET` /api/followships  

## API feature
Get top 10 users who has most followers  

## Input data  
### query string  
Settings for pagination (optional)  
| name    | description           | default |
| ------- | --------------------- | ------- |
| `count` | limit of data records | 10      |
| `page`  | page (start from 1)   | null    |
### parameters  
None

### req.body  
None

## Output data  
### Success  
```json
// status code: 200
[
    {
        "id": 11,
        "name": "maiores officia",
        "account": "user10",
        "avatar": "https://avatar-url",
        "followerCount": 7,
        "isFollowed": true
    },
    {
        "id": 4,
        "name": "earum quo",
        "account": "user3",
        "avatar": "https://avatar-url",
        "followerCount": 6,
        "isFollowed": true
    }
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

## Links  
* [API index](../index.md)  
