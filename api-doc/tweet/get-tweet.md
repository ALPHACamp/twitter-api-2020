# `GET` /api/tweets/:id

### Feature

取得一則指定貼文的詳細資料

### Parameters

|Name|Description|
|----|-----------|
|`id`|要取得的指定推文的`id`|

### Request Body

N/A

### Response Body

<font color="#008B8B">Success | code: 200</font>  

```json
{
    "id": 88,
    "description": "Rerum dolor labore est ad deserunt.",
    "createdAt": "2022-09-15T23:15:26.000Z",
    "replyCount": 3,
    "likeCount": 3,
    "isLiked": 1,
    "User": {
        "id": 10,
        "name": "user9",
        "account": "user9",
        "avatar": "https://loremflickr.com/320/240/man,woman/?random=2"
    }
}
```
<font color="#DC143C">Failure | code: 404</font>  
欲查詢的推文 id 不存在

```json
{
    "status": "error",
    "message": "The tweet does not exist."
}
```