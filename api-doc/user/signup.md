# `POST` /api/users

### Feature

註冊一個新帳號

### Parameters

N/A

### Request Body

| Name            | Description            | Type   |
| --------------- | ---------------------- | ------ |
| `account`       | user account           | String |
| `name`          | 使用者名稱 (50 字以內) | String |
| `email`         | email                  | String |
| `password`      | 登入密碼               | String |
| `checkPassword` | 確認與登入密碼相同     | String |

### Response Body

<font color="#008B8B">Success | code: 200</font>

```json
{
  "id": 3,
  "account": "user"
}
```

<font color="#DC143C">Failure | code: 400</font>  
任一欄位為空值

```json
{
  "status": "error",
  "message": "All the fields are required"
}
```

<font color="#DC143C">Failure | code: 422</font>  
密碼與確認密碼欄位不同

```json
{
  "status": "error",
  "message": "The password confirmation does not match."
}
```

<font color="#DC143C">Failure | code: 422</font>  
Email 格式不符

```json
{
  "status": "error",
  "message": "Email address is invalid."
}
```

<font color="#DC143C">Failure | code: 422</font>  
Name 超過 50 個字

```json
{
  "status": "error",
  "message": "Name must be less than 50 characters long."
}
```

<font color="#DC143C">Failure | code: 422</font>  
Account 已註冊過

```json
{
  "status": "error",
  "message": "Account already exists."
}
```

<font color="#DC143C">Failure | code: 422</font>  
Email 已註冊過

```json
{
  "status": "error",
  "message": "Email already exists."
}
```
