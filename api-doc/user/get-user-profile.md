# `GET` /api/users/:id

### Feature
顯示指定用戶的 profile


### Parameters

| Params | Description |
| ------ | ----------- |
| `id`   | user id     |

### Request Body

N/A


### Response Body

<font color="#008B8B">Success | code: 200</font>  

```json
{
    "id": 4,
    "account": "user3",
    "name": "user3",
    "avatar": "https://loremflickr.com/320/240/man,woman/?random=44",
    "cover": null,
    "introduction": "Esse sed alias.",
    "followerCount": 5,
    "followingCount": 3
}
```

<font color="#DC143C">Failure | code: 404</font>  
欲獲取的使用者 id 不存在或為 admin

```json
{
    "status": "error",
    "message": "The user does not exist."
}
```