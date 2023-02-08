# `DELETE` /api/followships/:followingId

### Feature

User 刪除一筆追蹤紀錄

### Parameters

| Name | Description            |
| ---- | ---------------------- |
| `id` | 要刪除的追蹤紀錄的`id` |

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
欲取消的追蹤關係不存在 or 網址列帶過來的 followingId param 不存在

```json
{
  "status": "error",
  "message": "You have not followed the user or the user dose not exist."
}
```
