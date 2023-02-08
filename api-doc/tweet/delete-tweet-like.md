# `POST` /api/tweets/:id/unlike

### Feature

對指定推文按 unlike

### Parameters

| Name | Description              |
| ---- | ------------------------ |
| `id` | 要被 unlike 的推文的`id` |

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
使用者未 like 該則貼文 or 網址列帶過來的 TweetId param 不存在

```json
{
  "status": "error",
  "message": "You have not liked the tweet or the tweet dose not exist."
}
```
