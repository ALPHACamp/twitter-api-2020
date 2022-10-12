# `DELETE` /api/tweets/:id

### Feature

刪除 User 自己的指定推文

### Parameters

| Name | Description            |
| ---- | ---------------------- |
| `id` | 要刪除的指定推文的`id` |

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
使用者不擁有該則推文 or 網址列帶過來的 TweetId param 不存在

```json
{
  "status": "error",
  "message": "User dose not own the tweet or the tweet does not exist."
}
```
