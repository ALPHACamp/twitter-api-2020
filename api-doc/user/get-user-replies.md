# `GET` /api/users/:id/replied_tweets

### Feature

顯示指定用戶所有的回覆

### Parameters

| Params | Description |
| ------ | ----------- |
| `id`   | user id     |

### Request Body

N/A

### Response Body

<font color="#008B8B">Success | code: 200</font>  
依照 reply 的 createdAt 近到遠回傳指定用戶所有回覆

```json
[
    {
        "id": 104, // replyId
        "comment": "Est quis ad.",
        "createdAt": "2022-09-30T20:40:26.000Z", // order by 回覆的時間
        "User": { // 回覆者
            "id": 4,
            "name": "user3",
            "account": "user3",
            "avatar": "https://loremflickr.com/320/240/man,woman/?random=39"
        },
        "Tweet": { // 回覆的推文
            "id": 32,
            "User": { // 推文的作者
                "id": 5,
                "account": "user4"
            }
        }
    },
    {
        "id": 284,
        "comment": "Debitis voluptate occaecati.",
        "createdAt": "2022-09-29T11:37:49.000Z",
        "User": {
            "id": 4,
            "name": "user3",
            "account": "user3",
            "avatar": "https://loremflickr.com/320/240/man,woman/?random=39"
        },
        "Tweet": {
            "id": 92,
            "User": {
                "id": 11,
                "account": "user10"
            }
        }
    },
    ......
]

```

<font color="#DC143C">Failure | code: 404</font>  
欲查詢回覆的使用者 id 不存在或為 admin

```json
{
  "status": "error",
  "message": "The user does not exist."
}
```
