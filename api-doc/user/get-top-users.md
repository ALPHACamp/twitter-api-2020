# `GET` /api/users/top_followers

### Feature

取得跟隨者數量排列前 10 的使用者

### Parameters

N/A

### Request Body

N/A

### Response Body

<font color="#008B8B">Success | code: 200</font>  
依照 followerCount 多到少回傳最多 follower 的前 10 名 User

```json
[
    {
        "id": 4,
        "account": "user3",
        "name": "user3",
        "avatar": "https://loremflickr.com/320/240/man,woman/?random=44",
        "followerCount": 5,
        "isFollowed": 1
    },
    {
        "id": 6,
        "account": "user5",
        "name": "user5",
        "avatar": "https://loremflickr.com/320/240/man,woman/?random=24",
        "followerCount": 4,
        "isFollowed": 0
    },
    ....
]
```
