# `POST` /api/tweets

### Feature

User 新增一則貼文

### Parameters

N/A

### Request Body

| Name          | Required | Description    | Type   |
| ------------- | -------- | -------------- | ------ |
| `description` | True     | 新增貼文的內容 | String |

### Response Body

<font color="#008B8B">Success | code: 200</font>

```json
{
  "status": "success"
}
```

<font color="#DC143C">Failure | code: 400</font>  
Description 空白

```json
{
  "status": "error",
  "message": "Tweet description is required."
}
```

<font color="#DC143C">Failure | code: 422</font>  
Description 超過 140 個字

```json
{
  "status": "error",
  "message": "Tweet description must be less than 140 characters long."
}
```
