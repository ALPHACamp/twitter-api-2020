# `GET` /api/users/:id/followers

### Feature

取得單一使用者的追隨者(跟隨者清單，誰跟隨他)


### URI Parameters

| Params | Description | Type |
| --- | --- | --- |
| id | 要查看的使用者id | Number |

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

依使用者追蹤紀錄成立時間(createdAt)也就是按下跟隨按鈕的時間，由新到舊回傳該用戶所有追隨者(followers)用戶。

```
[
  {
      "followerId" : 6,  // 追隨者id
      "followingId": 3, // 這個用戶的id
      "createdAt": 1670812139000, // 追蹤紀錄成立時間，以此排序
      "updatedAt": 1670812139000, 
      "Followers":  {
        "id": 6,
        "account": "mario",
        "name": "Mario",
        "avatar": "https://loremflickr.com/320/240/man,woman/?lock=45",
        "introduction": "Nulla eros mauris, rhoncus eu mattis ut",
        "isFollowed": false, // 登入的使用者是否已追隨清單上這個用戶(Mario)	 
        }
  },
	
  ....// 依照追蹤紀錄時間先後排序，最新的排最前面 
]

// 如果使用者沒有追隨者，會得到空陣列
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