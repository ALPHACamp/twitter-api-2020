# `GET` /api/users/:id/followings

### Feature

取得單一使用者追隨中的人(關注清單)


### URI Parameters

| Params | Description | Type |
| --- | --- | --- |
| id | 使用者id | Number |

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

依使用者追蹤紀錄成立時間(createdAt)也就是按下跟隨按鈕的時間，由新到舊回傳該用戶所有追隨中(following)用戶。

```

[
  {
      "followerId" : 3, // 這個用戶的id＝userId
      "followingId": 2,
      "createdAt": 1670812139000, // 追蹤紀錄成立時間，以此排序
      "updatedAt": 1670812139000, 
      "Followings": {
        "id": 2,
        "account": "user1",
        "name": "user1",
        "avatar": "https://loremflickr.com/320/240/man,woman/?lock=36",
        "introduction": "Sed ut perspiciatis unde omnis iste natus",
        "isFollowed": true, // 登入的這個使用者是否已追隨清單上這個用戶
        }
  },
		....// 依照追蹤紀錄時間先後排序，最新的排最前面 
]

// 如果使用者沒有追蹤者，會得到空陣列
[]
```

Failure | code: 404 找不到該使用者

```
{
  "status": "error",
  "message": "User not found!"
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