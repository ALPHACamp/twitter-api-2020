# `GET` /api/users/:id/followings

### Feature

顯示指定用戶所有跟隨中的人

### Parameters

| Params | Description |
| ------ | ----------- |
| `id`   | user id     |

### Request Body

N/A

### Response Body

<font color="#008B8B">Success | code: 200</font>  
依照追蹤記錄成立的 createdAt 近到遠回傳指定用戶的所有跟隨中的使用者

```json
[
    {
        "followerId": 4,
        "followingId": 6,
        "createdAt": "2022-09-23T01:15:30.000Z",
        "updatedAt": "2022-10-06T15:46:37.000Z",
        "Followings": {
            "id": 6,
            "account": "user5",
            "name": "user5",
            "introduction": "Deleniti quos ut.",
            "avatar": "https://loremflickr.com/320/240/man,woman/?random=38",
            "isFollowed": 0
        }
    },
    {
        "followerId": 4,
        "followingId": 11,
        "createdAt": "2022-09-11T18:40:04.000Z",
        "updatedAt": "2022-10-06T15:46:37.000Z",
        "Followings": {
            "id": 11,
            "account": "user10",
            "name": "user10",
            "introduction": "Veniam qui sit.",
            "avatar": "https://loremflickr.com/320/240/man,woman/?random=40",
            "isFollowed": 1
        }
    },
    ....
]
```

<font color="#DC143C">Failure | code: 404</font>  
欲查詢的使用者 id 不存在或為 admin

```json
{
  "status": "error",
  "message": "The user does not exist."
}
```
