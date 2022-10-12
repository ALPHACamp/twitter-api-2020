# `POST` /api/admin/signin

### Feature
管理者只能登入後台

### Parameters

N/A

### Request Body

| Name       | Required | Description    | Type   |
| ---------- | -------- | -------------- | ------ |
| `account`  | True     | admin account  | String |
| `password` | True     | admin password | String |


### Response Body

<font color="#008B8B">Success | code: 200</font>  
管理者成功登入，回傳管理者個人資料

```json
{
    "status": "success",
    "token": "fhuiwqhef.189u389gre.gqjreip",
    "user": {
        "id": 1,
        "name": "root"
        "role": "admin"
    }
}
```

<font color="#DC143C">Failure | code: 400</font>  
帳號或密碼欄位為空值（此回應由 passport 產生）

```json
{
    "Bad Request"
}
```
<font color="#DC143C">Failure | code: 401</font>  
帳號未註冊過

```json
{
    "status": "error",
    "message": "Incorrect account or password."
}
```
<font color="#DC143C">Failure | code: 401</font>  
密碼錯誤

```json
{
    "status": "error",
    "message": "Incorrect account or password."
}
```
<font color="#DC143C">Failure | code: 403</font>  
以非管理員帳號登入後台

```json
{
    "status": "error",
    "message": "Permission denied."
}
```