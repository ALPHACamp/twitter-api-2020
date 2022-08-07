# `GET` /api/tweets/:id  

## API feature  
Get data of a certain tweet  

## Input data  
### parameters  
| name | description |
| ---- | ----------- |
| `id` | tweet `id`  |

### req.body  
None.

## Output data  
### Success  
```json
// status code: 200
{
    "id": 4,
    "description": "content text",
    "createdAt": "2022-07-21T14:16:39.000Z",
    "User": {
        "id": 2,
        "name": "user1",
        "account": "user1",
        "avatar": "<url>"
    },
    "replyCount": 3,
    "likeCount": 5,
    "isLiked": true
}
```
### Errors  
Lack of parameter `id` 。
```json
// status code: 400
{
    "status": "error",
    "message": "id of tweet is required"
}
```
### 查詢失敗  
No tweet was found
```javascript
// status code: 400
{
    "status": "error",
    "message": "tweet not found"
}
```
## Links  
* [API index](../index.md)  
