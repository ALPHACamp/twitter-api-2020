# `GET` /api/admin/users

### Feature

管理員取得所有使用者清單

### URI Parameters

N/A

### Request Header

```
Authorization: Bearer [bearer token]
```

### Request Body

N/A

---

### Response Header

```
content-type: application/json
```

### Response Body

Success | code: 200 

回傳所有使用者清單(含admin)按推文數量(tweetsCount)由多到少排序

```
[
    {
        "id": 2,
        "name":"user1",
        "account":"user1",
        "avatar": "https://loremflickr.com/320/240/man,woman/?lock=36",
        "cover": "<url>",
        "tweetsCount": 10000,
        "tweetsLikedCount":900,
        "followingCount":100,
        "followerCount":90,
    },
    {
        "id": 6,
        "name":"Mario",
        "account":"mario",
        "avatar": "https://loremflickr.com/320/240/man,woman/?lock=45",
        "cover": "<url>",
        "tweetsCount": 99998,
        "tweetsLikedCount":5000,
        "followingCount":3000,
        "followerCount":3000,
    },  
	...
]

```

Failure | code: 403 前台user想用後台功能

```
{
  "status": "error",
  "message": "permission denied"
}
```

Failure | code: 401 使用者未登入就使用此服務

If your request header do not send
`Authorization: Bearer [bearer token]`

You would get

```
{
  "status": "error",
  "message": "unauthorized"
}
```

Failure | code: 500 其他server error

```
{
  "status": "error",
  "message": {{err message}}
}
```