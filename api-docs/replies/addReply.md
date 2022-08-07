# `POST` /api/tweets/:tweet_id/replies

## API feature
Add reply to a tweet

## Input data  
### parameters  
| params     | Description |
| ---------- | ----------- |
| `tweet_id` | tweet id    |
### req.body  
| name      | Description      | required |
| --------- | ---------------- | -------- |
| `comment` | content of reply | true     |

## Output data  
### Success  
```json
// status code: 200
{
    "status": "success",
    "message": "Post reply successfully"
}
```

### Errors  
Can't find tweet by `tweet_id`
```json
// status code: 404
{
    "status": "error",
    "message": "Tweet is not found"
}
```
Got blank in required fields
```json
// status code: 400
{
    "status": "error",
    "message": "TweetId is required"
}
```

Got blank in required fields
```json
// status code: 400
{
    "status": "error",
    "message": "Reply is blank."
}
```



## Links  
* [API index](../index.md)  
