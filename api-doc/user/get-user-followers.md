# `GET` /api/users/:id/followers


### Feature

取得指定用戶所有的跟隨者

### Parameters

| Name | Description      |
| ---- | ---------------- |
| `id` | 指定 User 的`id` |

### Request Body

N/A

### Response Body

<font color="#008B8B">Success | code: 200</font>  
依照追蹤記錄成立的 createdAt 近到遠回傳指定用戶的所有跟隨者

```json
[
    {
        "followerId": 11,
        "followingId": 4,
        "createdAt": "2022-09-21T05:37:16.000Z",
        "updatedAt": "2022-10-06T15:46:37.000Z",
        "Followers": {
            "id": 11,
            "account": "user10",
            "name": "user10",
            "introduction": "Veniam qui sit.",
            "avatar": "https://loremflickr.com/320/240/man,woman/?random=40",
            "isFollowed": 1
        }
    },
    {
        "followerId": 9,
        "followingId": 4,
        "createdAt": "2022-09-08T10:23:36.000Z",
        "updatedAt": "2022-10-06T15:46:37.000Z",
        "Followers": {
            "id": 9,
            "account": "user8",
            "name": "user8",
            "introduction": "Perspiciatis blanditiis at.",
            "avatar": "https://loremflickr.com/320/240/man,woman/?random=43",
            "isFollowed": 0
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