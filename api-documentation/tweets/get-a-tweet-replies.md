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
        "id": 34,
        "comment": "Quae sit corrupti.",
        "createdAt": 1671066800000,
        "User": {
            "id": 9,
            "name": "user8",
            "account": "user8",
            "avatar": "https://loremflickr.com/320/240/girl/?lock=29.08188472012867"
        },
        "Tweet": {
            "id": 12,
            "User": {
                "id": 3,
                "account": "user2"
            }
        }
    },
    {
        "id": 35,
        "comment": "Sunt est non.",
        "createdAt": 1671066800000,
        "User": {
            "id": 7,
            "name": "user6",
            "account": "user6",
            "avatar": "https://loremflickr.com/320/240/girl/?lock=40.70390280327909"
        },
        "Tweet": {
            "id": 12,
            "User": {
                "id": 3,
                "account": "user2"
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
Failure | code: 404 找不到該推文(新增)

```
{
    "status": "error",
    "message": "Cannot find this tweet."
}
```
Success | code: 204 沒有任何回覆(只會收到狀態碼，不會收到response body)

Failure | code: 500 其他server error

```
{
  "status": "error",
  "message": {{err message}}
}
```