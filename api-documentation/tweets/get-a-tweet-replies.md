# `GET` /api/tweets/:tweet_id/replies

### Feature

取得特定推文的所有留言，依create日期排序，最新的在前

### URI Parameters

| Params | Description | Type |
| --- | --- | --- |
| tweet_id | 推文id | Number |

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

依回覆時間createdAt由新到舊，回傳特定推文的所有回覆

```
[
 {
  "id": 9,// replyId in replies table
  "comment": "Sed ut perspiciatis unde omnis iste natus",
  "createdAt": 1670812139000,
  "User": { // 寫reply的使用者
    "id":2
    "name":"user2",
    "account":"user2",
    "avatar": "https://loremflickr.com/320/240/man,woman/?lock=36"
		 },
	"Tweet": {
    "id": 3, // 回覆的teewtId
    "User": {
    "id": 6, // 推文的作者id
    "account": "mario",
     }
	 }
  },

	....// 依照時間先後排序，最新的排最前面
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