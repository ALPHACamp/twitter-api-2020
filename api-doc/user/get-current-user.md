# `GET` /api/current_user

### Feature

獲取當前用戶資料

### Parameters

N/A

### Request Body

N/A

### Response Body

<font color="#008B8B">Success | code: 200</font>  
回傳當前登入的使用者資料

```json
{
  "id": 2,
  "email": "user1@example.com",
  "account": "user1",
  "name": "user1",
  "avatar": "https://loremflickr.com/320/240/man,woman/?random=43",
  "cover": null,
  "introduction": "Aperiam velit ipsam.",
  "role": "user"
}
```
