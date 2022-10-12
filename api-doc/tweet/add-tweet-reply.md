# `POST` /api/tweets/:tweet_id/replies

### Feature

對指定貼文新增一則回覆

### Parameters

| Name       | Description                      |
| ---------- | -------------------------------- |
| `tweet_id` | 要新增回覆的指定推文的`tweet_id` |

### Request Body

| Name      | Required | Description    | Type   |
| --------- | -------- | -------------- | ------ |
| `comment` | True     | 新增回覆的內容 | String |

### Response Body

<font color="#008B8B">Success | code: 200</font>

```json
{
  "status": "success"
}
```

<font color="#DC143C">Failure | code: 404</font>  
欲回覆的推文 id 不存在

```json
{
  "status": "error",
  "message": "TweetId dose not exist."
}
```

<font color="#DC143C">Failure | code: 400</font>  
Comment 空白

```json
{
  "status": "error",
  "message": "Reply comment is required."
}
```

<font color="#DC143C">Failure | code: 422</font>  
Comment 超過 140 個字

```json
{
  "status": "error",
  "message": "Reply comment must be less than 140 characters long."
}
```
