# `POST` /api/tweets/:id/unlike  

## API feature  
Unlike a tweet  

## Input data  
### parameters  
| name | description |
| ---- | ----------- |
| `id` | tweet `id`  |

### req.body  
None  

## Output data  
### Success  
```json
// status code: 200
{
    "status": "success",
    "message": "unlike success"
}
```
### Errors  
Lack of parameter `id`。
```json
// status code: 400
{
    "status": "error",
    "message": "TweetId is required"
}
```
Tweet isn't liked yet
```json
// status code: 404
{
    "status": "error",
    "message": "like not found"
}
```



## Links  
* [API index](../index.md)  
