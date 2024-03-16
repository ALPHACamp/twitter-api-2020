# `GET` /api/users/:id/replied_tweets

### Feature

取得單一使用者的所有回覆

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

Success | code: 200 依回覆時間createdAt由新到舊回傳該用戶所有回覆

```
[
    {
      "id": 9,// replyId in replies table
      "comment": "Sed ut perspiciatis unde omnis iste natus",
      "createdAt": 1670812139000, // 整理時間格式
      "User": { // 此使用者(寫回覆的人）
        "id":2
        "name":"user2",
        "account":"user2",
        "avatar": "https://loremflickr.com/320/240/man,woman/?lock=36"
      },
      "Tweet": { // 此使用者回覆的推文
        "id": 2, // 該推文id
        "User": { // 原推文的作者
          "id": 3, 
          "account": "user3"
        }
    }	
  },
	
 ....// 依照時間先後排序，最新的排最前面
]

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