# `PUT` /api/users/:id


### Feature
編輯使用者自己的 profile

### Parameters

| Params | Description |
| ------ | ----------- |
| `id`   | user id     | 


### Request Body

| Name            | Description           | Type   |
| --------------- | --------------------- | ------ |
| `name`          | username              | String |
| `avatar`        | user avatar           | String |
| `cover`         | user cover image      | String |
| `introduction`  | user intro            | String |


### Response Body

<font color="#008B8B">Success | code: 200</font>  

```json
{
    "status": "success"
}
```

<font color="#DC143C">Failure | code: 403</font>  
欲編輯他人的 profile or 欲編輯的使用者 id 不存在

```json
{
    "status": "error",
    "message": "User can only edit their own data."
}
```
<font color="#DC143C">Failure | code: 400</font>  
Name 為空值

```json
{
    "status": "error",
    "message": "Name is required."
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
Introduction 超過 160 個字

```json
{
    "status": "error",
    "message": "Introduction must be less than 160 characters long."
}
```
<font color="#DC143C">Failure | code: 400</font>  
Cover, Avatar 非圖檔

```json
{
    "status": "error",
    "message": "Please upload an image."
}
```