# `GET` /api/admin/users

### Feature
管理者可以看見站內所有使用者

### Parameters

N/A

### Request Body

N/A

### Response Body

<font color="#008B8B">Success | code: 200</font>  
依照 tweetCount 多到少回傳所有 users

```json
[
  {
    "id": 2,
    "account": "user1",
    "name": "user1",
    "avatar": "<url>",
    "cover": "<url>"
    "tweetCount": 10,
    "likeCount": 3,
    "followingCount": 4,
    "followerCount": 5
  },
  {
    "id": 3,
    "account": "user2",
    "name": "user2",
    "avatar": "<url>",
    "cover": "<url>"
    "tweetCount": 8,
    "likeCount": 3,
    "followingCount": 4,
    "followerCount": 5
  },
    ....
]
```