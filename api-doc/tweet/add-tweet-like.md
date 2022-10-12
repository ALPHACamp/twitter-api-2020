# `POST` /api/tweets/:id/like

### Feature

對指定推文按 like

### Parameters

| Name | Description             |
| ---- | ----------------------- |
| `id` | 要被 like 的推文的 `id` |

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
按 like 的推文 id 不存在

```json
{
  "status": "error",
  "message": "TweetId dose not exist."
}
```

<font color="#DC143C">Failure | code: 422</font>  
對同一則貼文重複按 like

```json
{
  "status": "error",
  "message": "You already liked the tweet."
}
```
