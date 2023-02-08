# `GET` /api/tweets

### Feature

取得所有推文，包括推文作者

### Parameters

N/A

### Request Body

N/A

### Response Body

<font color="#008B8B">Success | code: 200</font>  
依照 tweet createdAt 近到遠回傳所有的推文

```json
[
    {
        "id": 3,
        "description": "Magni maiores minima iusto ad itaque.",
        "createdAt": "2022-09-29T09:30:57.000Z",
        "replyCount": 3,
        "likeCount": 1,
        "isLiked": 0,
        "User": {
            "id": 2,
            "name": "user1",
            "account": "user1",
            "avatar": "https://loremflickr.com/320/240/man,woman/?random=31"
        }
    },
    {
        "id": 31,
        "description": "Est dolorum et labore et ut.",
        "createdAt": "2022-09-29T04:07:54.000Z",
        "replyCount": 3,
        "likeCount": 3,
        "isLiked": 1,
        "User": {
            "id": 5,
            "name": "user4",
            "account": "user4",
            "avatar": "https://loremflickr.com/320/240/man,woman/?random=7"
        }
    },
    ......
]
```
