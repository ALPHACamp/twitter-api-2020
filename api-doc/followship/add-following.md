# `POST` /api/followships

### Feature

User 新增一筆追蹤紀錄

### Parameters

N/A

### Request Body

| Name | Required | Description                   | Type   |
| ---- | -------- | ----------------------------- | ------ |
| `id` | True     | 要新增追蹤紀錄的`followingId` | Number |

### Response Body

<font color="#008B8B">Success | code: 200</font>

```json
{
  "status": "success"
}
```

<font color="#DC143C">Failure | code: 404</font>  
欲追蹤的使用者 id 不存在

```json
{
  "status": "error",
  "message": "The user does not exist."
}
```

<font color="#DC143C">Failure | code: 422</font>  
欲追蹤自己

```json
{
  "status": "error",
  "message": "User can not follow themself."
}
```

<font color="#DC143C">Failure | code: 422</font>  
欲重複追蹤

```json
{
  "status": "error",
  "message": "You already followed the user."
}
```
