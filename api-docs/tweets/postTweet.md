# `POST` /api/tweets  

## API feature  
Post a new tweet  

## Input data  
### parameters  
None  

### req.body  
| name          | description                             | required |
| ------------- | --------------------------------------- | -------- |
| `description` | content of tweet(within 140 characters) | true     |

## Output data  
### Success  
```json
// status code: 200
{
    "status": "success",
    "message": "New tweet added",
    "tweetId": "10"
}
```
### Errors  
### 檢查失敗  
`description` is longer than 140 characters
```json
// status code: 400
{
    "status": "error",
    "message": "tweet should be within 140 characters"
}
```

## Links  
* [API index](../index.md)  
