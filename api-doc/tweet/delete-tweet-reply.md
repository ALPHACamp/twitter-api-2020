# `DELETE` /api/tweets/:tweet_id/replies/:reply_id

### Feature

刪除 User 自己的指定回覆

### Parameters

| Name | Description          |
| ---- | -------------------- |
| `id` | 要被刪除的回覆的`id` |

### Request Body

N/A

### Response Body

<font color="#008B8B">Success | code: 200</font>

```json
{
  "status": "success"
}
```

<font color="#DC143C">Failure | code: 404</font>  
使用者不擁有該則回覆 or 該則回覆不屬於指定推文 or 網址列帶過來的 TweetId/ReplyId params 不存在

```json
{
  "status": "error",
  "message": "User dose not own the reply or the reply does not exist."
}
```
