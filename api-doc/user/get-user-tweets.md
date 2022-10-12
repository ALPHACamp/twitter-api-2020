# `GET` /api/users/:id/tweets


### Feature
顯示指定用戶所有的推文

### Parameters

| Params | Description |
| ------ | ----------- |
| `id`   | user id     |


### Request Body

N/A

### Response Body

<font color="#008B8B">Success | code: 200</font>  
依照 createdAt 近到遠回傳指定用戶所有的推文

```json
[
    {
        "id": 23,
        "description": "Accusamus provident voluptates distinctio enim ad.",
        "createdAt": "2022-09-07T22:04:42.000Z",
        "replyCount": 3,
        "likeCount": 1,
        "isLiked": 0,
        "User": {
            "id": 4,
            "name": "user3",
            "account": "user3",
            "avatar": "https://loremflickr.com/320/240/man,woman/?random=44"
        }
    },
    {
        "id": 28,
        "description": "Nemo suscipit assumenda recusandae aspernatur in.",
        "createdAt": "2022-09-07T00:17:39.000Z",
        "replyCount": 3,
        "likeCount": 3,
        "isLiked": 1,
        "User": {
            "id": 4,
            "name": "user3",
            "account": "user3",
            "avatar": "https://loremflickr.com/320/240/man,woman/?random=44"
        }
    },
    ......
]

```

<font color="#DC143C">Failure | code: 404</font>  
欲查詢推文的使用者 id 不存在或為 admin

```json
{
    "status": "error",
    "message": "The user does not exist."
}
```