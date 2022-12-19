# `GET` /api/users/top

### Feature

取得跟隨者數量前10名的推薦名單(畫面右邊欄位)

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

跟隨者人數followerCount前十名使用者，由多到少排序

```
[
  {
    "id": 2,// 最熱門人物的userId
    "name":"user2",
    "account":"user2",
    "avatar": "https://loremflickr.com/320/240/man,woman/?lock=36",
    "followerCount":100000,
    "isFollowed": true, //登入的使用者是否已追蹤
  },
  {
    "id": 6,// 最熱門人物的userId
    "name":"Mario",
    "account":"mario",
    "avatar": "https://loremflickr.com/320/240/man,woman/?lock=45",
    "followerCount":99800,
    "isFollowed": false, //登入的使用者是否已追蹤
  },  
	...// 共10人	
]

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