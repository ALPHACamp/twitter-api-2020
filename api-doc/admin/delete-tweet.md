# `DELETE` /api/admin/tweets/:id

### Feature

管理者可以刪除指定的使用者推文

### Parameters

| Params | Description |
| ------ | ----------- |
| `id`   | tweet id    |

### Request Body

N/A

### Response Body

<font color="#008B8B">Success | code: 200</font>  
成功刪除指定推文

```json
{
  "status": "success"
}
```

<font color="#DC143C">Failure | code: 404</font>  
欲刪除的推文 id 不存在

```json
{
  "status": "error",
  "message": "The tweet you want to delete does not exist."
}
```
