# `GET` /api/tweets/:tweet_id

### Feature

查閱單一推文內容

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

單一推文內容

```json

	{
	  "id": 2, // 貼文id
	  "description": "Sed ut perspiciatis unde omnis iste natus",
		"createdAt": 1670812139000,
		"replyCount": 13,
		"likeCount": 76,
		"isLiked": false,
		"User": { // 發貼文的人(這個登入者)
				"id":2
				"name":"user2",
				"account":"user2",
				"avatar": "https://loremflickr.com/320/240/man,woman/?lock=36"
		}
	},

```

Failure | code: 404 找不到該使用者(討論是否刪除?)

```json
{
  "status": "error",
  "message": "User not found!"
}
```

Failure | code: 404 找不到該推文(新增)

```json
{
  "status": "error",
  "message": "Cannot find this tweet."
}
```

Failure | code: 401 使用者未登入就使用此服務

If your request header do not send`Authorization: Bearer [bearer token]`

You would get

```json
{
	"status": "error",
  "message": "unauthorized"
}
```

Failure | code: 500 其他server error

```json
{
  "status": "error",
  "message": {{err message}}
}
```