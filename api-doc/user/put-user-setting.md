# `PUT` /api/users/:id/setting

### Feature
編輯使用者自己的帳戶資料

### Parameters

| Params | Description |
| ------ | ----------- |
| `id`   | user id     | 


### Request Body

| Name            | Description           | Type   |
| --------------- | --------------------- | ------ |
| `account`       | user account          | String |
| `name`          | username              | String |
| `email`         | user email            | String |
| `password`      | user password         | String |
| `checkPassword` | confirm user password | String |


### Response Body

<font color="#008B8B">Success | code: 200</font>  

```json
{
    "status": "success"
}
```

<font color="#DC143C">Failure | code: 403</font>  
欲編輯他人的 account or 欲編輯的使用者 id 不存在

```json
{
    "status": "error",
    "message": "User can only edit their own data."
}
```
<font color="#DC143C">Failure | code: 400</font>  
name, account, email 任一為空值

```json
{
    "status": "error",
    "message": "Account, name, email are required"
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