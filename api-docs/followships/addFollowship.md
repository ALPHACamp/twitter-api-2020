# `POST` /api/followships  

## API feature  
Add a followship  

## Input data  
### parameters  
None  

### req.body  
| name | description                    |
| ---- | ------------------------------ |
| `id` | user `id` who will be followed |

## Output data  
### Success  
```json
// status code: 200
{
    "status": "success",
    "message": "Start following"
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

Try to self-followed 
```json
// status code: 401
{
    "status": "error",
    "message": "Can not follow yourself"
}
```

Try to follow user who is already being followed
```json
// status code: 401
{
    "status": "error",
    "message": "Can not follow user who is already being followed"
}
```



## Links  
* [API index](../index.md)  
