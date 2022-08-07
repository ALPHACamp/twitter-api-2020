# `DELETE` /api/followships/:followingId  

## API feature  
Delete a followship  

## Input data  
### parameters  
| name          | description                     |
| ------------- | ------------------------------- |
| `followingId` | user `id` who is being followed |

### req.body  
None  

## Output data  
### Success  
```json
// status code: 200
{
    "status": "success",
    "message": "Stop following"
}
```
### Errors  
Got blank in required fields
```json
// status code: 400
{
    "status": "error",
    "message": "followerId and followingId required"
}
```

`followingId` or `followerId` not exists in database.
```json
// status code: 401
{
    "status": "error",
    "message": "Follower or following not exists.。
"
}
```

Followship not exists
```json
// status code: 401
{
    "status": "error",
    "message": "Not followed yet"
}
```



## Links  
* [API index](../index.md)  
