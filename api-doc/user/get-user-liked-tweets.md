# `GET` /api/users/:id/likes


### Feature
顯示指定用戶所有 like 過的推文

### Parameters

| Params | Description |
| ------ | ----------- |
| `id`   | user id     |


### Request Body
N/A


### Response Body

<font color="#008B8B">Success | code: 200</font>  
依照 like 的 createdAt 近到遠回傳指定用戶所有 like 過的推文

```json
[
    {
        "id": 25, // likeId
        "TweetId": 61, // 測試檔規定要的
        "createdAt": "2022-09-29T12:01:20.000Z", // order by like 的時間
        "Tweet": { // 喜歡的推文
            "id": 61,
            "description": "Totam quo natus est enim accusantium.",
            "createdAt": "2022-09-04T22:05:26.000Z", // 推文建立的時間
            "replyCount": 3,
            "likeCount": 2,
            "isLiked": 1, // currentUser 是否按過 like
            "User": { // 推文的作者
                "id": 8,
                "name": "user7",
                "account": "user7",
                "avatar": "https://loremflickr.com/320/240/man,woman/?random=1"
            }
        }
    },
    {
        "id": 29,
        "TweetId": 74,
        "createdAt": "2022-09-20T16:16:24.000Z",
        "Tweet": {
            "id": 74,
            "description": "Voluptatibus ducimus quo magnam ea voluptatem.",
            "createdAt": "2022-09-21T14:41:14.000Z",
            "replyCount": 3,
            "likeCount": 1,
            "isLiked": 0,
            "User": {
                "id": 9,
                "name": "user8",
                "account": "user8",
                "avatar": "https://loremflickr.com/320/240/man,woman/?random=43"
            }
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