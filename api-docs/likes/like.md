# `POST` /api/tweets/:id/like  

## API feature  
Like a tweet  

## Input data  
### parameters  
| name | description | required |
| ---- | ----------- | -------- |
| `id` | tweet `id`  | true     |

### req.body  
None  

## Output data  
### Success  
```json
// status code: 200
{
    "status": "success",
    "message": "like success"
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
Already liked
```json
// status code: 401
{
    "status": "error",
    "message": "already liked"
}
```



## Links  
* [API index](../index.md)  
