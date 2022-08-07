# `GET` /api/followships  

## API feature
Get top 10 users who has most followers  

## Input data  
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
        "id": 114,
        "name": "autem qui",
        "account": "user11",
        "avatar": "<url>",
        "isFollowed": true
    },
    {
        "id": 84,
        "name": "qui aliquid",
        "account": "user8",
        "avatar": "<url>",
        "isFollowed": false
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
