# `GET` /api/tweets/:tweet_id/replies

### Feature

取得指定推文的所有回覆

### Parameters

| Name       | Description                      |
| ---------- | -------------------------------- |
| `tweet_id` | 要取得回覆的指定推文的`tweet_id` |

### Request Body

N/A

### Response Body

<font color="#008B8B">Success | code: 200</font>  
依照 reply createdAt 近到遠回傳所有的回覆

```json
[
    {
        "id": 10, // replyId
        "comment": "tweet description",
        "createdAt": "2022-10-03T00:00:50.000Z",
        "User": {
            "id": 2, // 回覆者的 UserId
            "name": "user1",
            "account": "user1",
            "avatar": "<url>"
        },
        "Tweet": {
            "id": 2
            "User": { // 推文作者
                "id": 3,
                "account": "user2"
            }
        }
    },
    {
        "id": 9,
        "comment": "tweet description",
        "createdAt": "2022-10-03T00:00:20.000Z",
        "User": {
            "id": 2
            "name": "user1",
            "account": "user1",
            "avatar": "<url>"
        },
        "Tweet": {
            "id": 4
            "User": {
                "id": 4,
                "account": "user3"
            }
        }
    },
    ......
]
```

<font color="#DC143C">Failure | code: 404</font>  
欲查詢回覆的推文 id 不存在

```json
{
  "status": "error",
  "message": "The tweet does not exist."
}
```
