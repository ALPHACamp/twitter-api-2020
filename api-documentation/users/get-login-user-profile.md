# `GET` /api/users/login_user

### Feature

取得現在登入的這個使用者個人資料

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

回傳現在登入的這個使用者資訊

```json
{
  "id": 2,
  "account": "user1",
	"name": "user1",
	"email": "user1@example.com",
	"avatar": "https://loremflickr.com/320/240/man,woman/?lock=36",
	"cover": "https://loremflickr.com/800/600/man,woman/?lock=45",
	"introduction": "Sed ut perspiciatis unde omnis iste natus",
	"role": "user",
	"tweetCount": 25,
	"followingCount": 231,
	"followerCount": 45,
}
```

Failure | code: 404 找不到該使用者

```json
{
  "status": "error",
  "message": "User not found!"
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