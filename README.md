## twitter-api-2020
使用 Node.js、express、MySQL 打造的 Tweeter 專案 API


## Features 功能
1. 顯示全部推文
2. 顯示推文回覆
3. 對推文發出回覆功能
4. 查看特定推文
5. 推文加入like、推文取消like
6. 顯示發文畫面
7. 發出推文
8. 顯示最多人追蹤的前10名使用者
9. 建立使用者
10. 登入使用者
11. 顯示個人頁面資訊(回覆頁面、推文頁面、Like頁面、追蹤、被追蹤)
12. 個人資訊修改
13. 查看他人主頁
14. 追蹤其他使用者、取消追蹤其他使用者
15. 後台登入功能
16. 後台瀏覽所有tweet並可刪除任意tweet
17. 後台瀏覽所有使用者資訊

## API 文件
Tweet:
1. GET /api/tweets/postTweet
- HTTP Method
    - GET
- 中文說明 - 這條 API 是做什麼的？
    - 發文頁面
- Parameters
    - NO
- Request body
    - NO
- Response
    - Success - status code : 200
```
{
	avatar: 123.jpg
}
...略
```
Failure - status code : 500
```
{
    status: 'error', error: err.message
}
```

2. GET /api/tweets/:tweet_id/replies
- HTTP Method
    - GET
- 中文說明 - 這條 API 是做什麼的？
    - 推文內所有回覆
- Parameters
    - YES ( tweet_id )
- Request body
    - NO
- Response
    - Success - status code : 200
```
[
    {
        "id": 8084,
        "UserId": 414,
        "TweetId": 2824,
        "comment": "Quasi consectetur quas ipsa sit eveniet unde.",
        "createdAt": "2023-06-18T10:07:34.000Z",
        "updatedAt": "2023-06-18T10:07:34.000Z",
        "User": {
            "id": 414,
            "name": "user8",
            "account": "user8",
            "email": "user8@example.com",
            "password": "$2a$10$5gh1g/D9cZOzGLeQqjZ5cOzyEkjPhsfHUdX03TlSngBzc7A4bh3sK",
            "avatar": "http://randomuser.me/api/portraits/women/11.jpg",
            "introduction": "Recusandae voluptatibus ex et saepe corporis ut odio.",
            "role": "user",
            "banner": "https://i.imgur.com/jsrSDDm.png",
            "createdAt": "2023-06-18T10:07:34.000Z",
            "updatedAt": "2023-06-18T10:07:34.000Z"
        }
    },
    ...略
```
Failure - status code : 500
```
{
    status: 'error', error: err.message
}
```

3. POST /api/tweets/:tweet_id/replies
- HTTP Method
    - POST
- 中文說明 - 這條 API 是做什麼的？
    - 對貼文發回覆功能
- Parameters
    - YES ( tweet_id )
- Request body
    - YES ( comment )
- Response
    - Success - status code : 200
```
{
    "id": 11214,
    "comment": "123",
    "UserId": 424,
    "TweetId": "2824",
    "updatedAt": "2023-06-18T13:41:47.487Z",
    "createdAt": "2023-06-18T13:41:47.487Z"
}
```
Failure - status code : 500
```
{
    status: 'error', error: err.message
}
```

4. GET /api/tweets/:tweet_id
- HTTP Method
    - GET
- 中文說明 - 這條 API 是做什麼的？
    - 特定推文頁面
- Parameters
    - YES ( tweet_id )
- Request body
    - NO
- Response
    - Success - status code : 200
```
{
    "id": 2824,
    "UserId": 334,
    "description": "hic nam eum",
    "createdAt": "2023-06-18T10:07:34.000Z",
    "updatedAt": "2023-06-18T10:07:34.000Z",
    "tweetOwnerName": "root",
    "tweetOwnerAccount": "root",
    "tweetOwnerAvatar": "http://randomuser.me/api/portraits/women/3.jpg",
    "tweetLikeCount": 2,
    "tweetReplyCount": 7,
    "isLiked": true
}
```
Failure - status code : 500
```
{
    status: 'error', error: err.message
}
```

5. POST /api/tweets/:id/unlike
- HTTP Method
    - POST
- 中文說明 - 這條 API 是做什麼的？
    - 取消like
- Parameters
    - YES ( tweet_id )
- Request body
    - NO
- Response
    - Success - status code : 200
```
{
    "id": 2614,
    "UserId": 424,
    "TweetId": 2824,
    "createdAt": "2023-06-18T11:53:24.000Z",
    "updatedAt": "2023-06-18T11:53:24.000Z"
}
```
Failure - status code : 500
```
{
    status: 'error', error: err.message
}
```

6. POST /api/tweets/:id/like
- HTTP Method
    - POST
- 中文說明 - 這條 API 是做什麼的？
    - 加入like
- Parameters
    - YES ( tweet_id )
- Request body
    - NO
- Response
    - Success - status code : 200
```
{
    "id": 2814,
    "UserId": 424,
    "TweetId": "2824",
    "updatedAt": "2023-06-18T15:49:41.751Z",
    "createdAt": "2023-06-18T15:49:41.751Z"
}
```
Failure - status code : 500
```
{
    status: 'error', error: err.message
}
```

7. GET /api/tweets
- HTTP Method
    - GET
- 中文說明 - 這條 API 是做什麼的？
    - 所有推文
- Parameters
    - NO
- Request body
    - NO
- Response
    - Success - status code : 200
```
[
    {
        "id": 2824,
        "UserId": 334,
        "description": "hic nam eum",
        "createdAt": "2023-06-18T10:07:34.000Z",
        "updatedAt": "2023-06-18T10:07:34.000Z",
        "User": {
            "id": 334,
            "name": "root",
            "account": "root",
            "email": "root@example.com",
            "avatar": "http://randomuser.me/api/portraits/women/3.jpg",
            "introduction": "Eum praesentium aperiam vitae doloribus cupiditate consequatur.",
            "role": "admin",
            "banner": "https://i.imgur.com/jsrSDDm.png",
            "createdAt": "2023-06-18T10:07:34.000Z",
            "updatedAt": "2023-06-18T10:07:34.000Z"
        },
        "Replies": [
            {
                "id": 8084,
                "UserId": 414,
                "TweetId": 2824,
                "comment": "Quasi consectetur quas ipsa sit eveniet unde.",
                "createdAt": "2023-06-18T10:07:34.000Z",
                "updatedAt": "2023-06-18T10:07:34.000Z"
            },
            {
                "id": 8094,
                "UserId": 364,
                "TweetId": 2824,
                "comment": "Quo quia natus ut molestias ea nisi recusandae saepe rerum.",
                "createdAt": "2023-06-18T10:07:34.000Z",
                "updatedAt": "2023-06-18T10:07:34.000Z"
            },
            {
                "id": 8104,
                "UserId": 414,
                "TweetId": 2824,
                "comment": "Corporis ut vitae voluptates quia quo.",
                "createdAt": "2023-06-18T10:07:34.000Z",
                "updatedAt": "2023-06-18T10:07:34.000Z"
            },
            {
                "id": 11154,
                "UserId": 344,
                "TweetId": 2824,
                "comment": "test\n",
                "createdAt": "2023-06-18T12:46:20.000Z",
                "updatedAt": "2023-06-18T12:46:20.000Z"
            },
            {
                "id": 11164,
                "UserId": 344,
                "TweetId": 2824,
                "comment": "fdfsdfsdf",
                "createdAt": "2023-06-18T12:48:09.000Z",
                "updatedAt": "2023-06-18T12:48:09.000Z"
            },
            {
                "id": 11174,
                "UserId": 344,
                "TweetId": 2824,
                "comment": "fdsafasdfasdf",
                "createdAt": "2023-06-18T12:48:21.000Z",
                "updatedAt": "2023-06-18T12:48:21.000Z"
            }
        ],
        "Likes": [
            {
                "id": 2614,
                "UserId": 424,
                "TweetId": 2824,
                "createdAt": "2023-06-18T11:53:24.000Z",
                "updatedAt": "2023-06-18T11:53:24.000Z"
            },
            {
                "id": 2684,
                "UserId": 344,
                "TweetId": 2824,
                "createdAt": "2023-06-18T12:47:17.000Z",
                "updatedAt": "2023-06-18T12:47:17.000Z"
            }
        ],
        "RepliesCount": 6,
        "LikesCount": 2
    },
    ...略
```
Failure - status code : 500
```
{
    status: 'error', error: err.message
}
```

8. POST /api/tweets
- HTTP Method
    - POST
- 中文說明 - 這條 API 是做什麼的？
    - 發出推文
- Parameters
    - NO
- Request body
    - YES ( description )
- Response
    - Success - status code : 200
```
{
    "id": 3914,
    "description": "description",
    "UserId": 424,
    "updatedAt": "2023-06-18T16:21:09.461Z",
    "createdAt": "2023-06-18T16:21:09.461Z"
}
```
Failure - status code : 500
```
{
    status: 'error', error: err.message
}
```

User:
9. POST /api/users/signin
- HTTP Method
    - POST
- 中文說明 - 這條 API 是做什麼的？
    - `使用者登入`
- Parameters
    - NO
- Request body
    - YES
- Response
    - Success - status code : 200
{
    "status": "success",
    "data": {
        "token": "token",
        "user": {
            "id": 424,
            "name": "user9",
            "account": "user9",
            "email": "user9@example.com",
            "avatar": "http://randomuser.me/api/portraits/women/12.jpg",
            "introduction": "Molestiae voluptate id ut vero saepe accusamus.",
            "role": "user",
            "banner": "https://i.imgur.com/jsrSDDm.png",
            "createdAt": "2023-06-18T10:07:34.000Z",
            "updatedAt": "2023-06-18T10:07:34.000Z"
        }
    }
}
```
{
    status: 'error', error: err.message
}
```
Failure - status code : 500
```
{
    status: 'error', error: err.message
}
```

10. GET /api/users/top
- HTTP Method
    - GET
- 中文說明 - 這條 API 是做什麼的？
    - pop users
- Parameters
    - NO
- Request body
    - NO
- Response
    - Success - status code : 200
```
{
    "status": "success",
    "users": [
        {
            "id": 344,
            "name": "user22222",
            "account": "user1",
            "email": "user1@example.com",
            "avatar": "http://randomuser.me/api/portraits/women/4.jpg",
            "introduction": "jie,buratreahf",
            "role": "user",
            "banner": "https://i.imgur.com/jsrSDDm.png",
            "createdAt": "2023-06-18T10:07:34.000Z",
            "updatedAt": "2023-06-18T13:08:02.000Z",
            "Followers": [
                {
                    "id": 334,
                    "name": "root",
                    "account": "root",
                    "email": "root@example.com",
                    "avatar": "http://randomuser.me/api/portraits/women/3.jpg",
                    "introduction": "Eum praesentium aperiam vitae doloribus cupiditate consequatur.",
                    "role": "admin",
                    "banner": "https://i.imgur.com/jsrSDDm.png",
                    "createdAt": "2023-06-18T10:07:34.000Z",
                    "updatedAt": "2023-06-18T10:07:34.000Z",
                    "Followship": {
                        "followerId": 334,
                        "followingId": 344,
                        "createdAt": "2023-06-18T10:07:34.000Z",
                        "updatedAt": "2023-06-18T10:07:34.000Z"
                    }
                },
                {
                    "id": 364,
                    "name": "user3",
                    "account": "user3",
                    "email": "user3@example.com",
                    "avatar": "http://randomuser.me/api/portraits/women/6.jpg",
                    "introduction": "Temporibus suscipit velit cupiditate et reiciendis explicabo deleniti fuga.",
                    "role": "user",
                    "banner": "https://i.imgur.com/jsrSDDm.png",
                    "createdAt": "2023-06-18T10:07:34.000Z",
                    "updatedAt": "2023-06-18T10:07:34.000Z",
                    "Followship": {
                        "followerId": 364,
                        "followingId": 344,
                        "createdAt": "2023-06-18T10:07:34.000Z",
                        "updatedAt": "2023-06-18T10:07:34.000Z"
                    }
                },
                {
                    "id": 394,
                    "name": "user6",
                    "account": "user6",
                    "email": "user6@example.com",
                    "avatar": "http://randomuser.me/api/portraits/women/9.jpg",
                    "introduction": "Ex blanditiis corporis dolorum sit autem placeat aut in eos.",
                    "role": "user",
                    "banner": "https://i.imgur.com/jsrSDDm.png",
                    "createdAt": "2023-06-18T10:07:34.000Z",
                    "updatedAt": "2023-06-18T10:07:34.000Z",
                    "Followship": {
                        "followerId": 394,
                        "followingId": 344,
                        "createdAt": "2023-06-18T10:07:34.000Z",
                        "updatedAt": "2023-06-18T10:07:34.000Z"
                    }
                },
                {
                    "id": 404,
                    "name": "user7",
                    "account": "user7",
                    "email": "user7@example.com",
                    "avatar": "http://randomuser.me/api/portraits/women/10.jpg",
                    "introduction": "Pariatur aliquam modi illum non cum.",
                    "role": "user",
                    "banner": "https://i.imgur.com/jsrSDDm.png",
                    "createdAt": "2023-06-18T10:07:34.000Z",
                    "updatedAt": "2023-06-18T10:07:34.000Z",
                    "Followship": {
                        "followerId": 404,
                        "followingId": 344,
                        "createdAt": "2023-06-18T10:07:34.000Z",
                        "updatedAt": "2023-06-18T10:07:34.000Z"
                    }
                }
            ],
            "followersCount": 4,
            "isFollowed": false
        },
        ...略
```
Failure - status code : 500
```
{
    status: 'error', error: err.message
}
```

11. GET /api/users/:id/replied_tweets
- HTTP Method
    - GET
- 中文說明 - 這條 API 是做什麼的？
    - 個人頁面/回覆貼文頁面
- Parameters
    - YES ( id )
- Request body
    - NO
- Response
    - Success - status code : 200
```
[
    {
        "id": 11214,
        "UserId": 424,
        "TweetId": 2824,
        "comment": "123",
        "createdAt": "2023-06-18T13:41:47.000Z",
        "updatedAt": "2023-06-18T13:41:47.000Z",
        "Tweet": {
            "id": 2824,
            "User": {
                "account": "root"
            }
        },
        "replyName": "user9",
        "replyAccount": "user9",
        "replyAvatar": "http://randomuser.me/api/portraits/women/12.jpg"
    },
    ...略
```
Failure - status code : 500
```
{
    status: 'error', error: err.message
}
```
12. GET /api/users/:id/tweets
- HTTP Method
    - GET
- 中文說明 - 這條 API 是做什麼的？
    - 個人頁面/推文頁面
- Parameters
    - YES ( id )
- Request body
    - NO
- Response
    - Success - status code : 200
```
[
    {
        "id": 3914,
        "UserId": 424,
        "description": "description",
        "name": "user9",
        "account": "user9",
        "avatar": "http://randomuser.me/api/portraits/women/12.jpg",
        "createdAt": "2023-06-18T16:21:09.000Z",
        "replyCount": 0,
        "likeCount": 0,
        "isLiked": false
    },
    ...略
```
Failure - status code : 500
```
{
    status: 'error', error: err.message
}
```
13. GET /api/users/:id/likes
- HTTP Method
    - GET
- 中文說明 - 這條 API 是做什麼的？
    - 個人頁面/like頁面
- Parameters
    - YES ( id )
- Request body
    - NO
- Response
    - Success - status code : 200
```
[
    {
        "UserId": 424,
        "TweetId": 2824,
        "createdAt": "2023-06-18T15:49:41.000Z",
        "description": "hic nam eum",
        "tweetOwnerName": "root",
        "tweetOwnerAccount": "root",
        "tweetOwnerAvatar": "http://randomuser.me/api/portraits/women/3.jpg",
        "likeCount": 2,
        "replyCount": 7,
        "isLiked": false
    },
    ...略
```
Failure - status code : 500
```
{
    status: 'error', error: err.message
}
```
14. GET /api/users/:id/followings
- HTTP Method
    - GET
- 中文說明 - 這條 API 是做什麼的？
    - 個頁人面/追蹤資訊
- Parameters
    - YES ( id )
- Request body
    - NO
- Response
    - Success - status code : 200
```
[
    {
        "followingId": 354,
        "followingName": "user2",
        "followingAvatar": "http://randomuser.me/api/portraits/women/5.jpg",
        "followingIntroduction": "Ratione eum ipsam iure voluptatem.",
        "followshipCreatedAt": "2023-06-18T12:30:16.000Z",
        "isFollowing": true
    },
    ...略
```
Failure - status code : 500
```
{
    status: 'error', error: err.message
}
```
15. GET /api/users/:id/followers
- HTTP Method
    - GET
- 中文說明 - 這條 API 是做什麼的？
    - 個人頁面/被追蹤資訊
- Parameters
    - YES ( id )
- Request body
    - NO
- Response
    - Success - status code : 200
```
[
    {
        "followerName": "root",
        "followerAvatar": "http://randomuser.me/api/portraits/women/3.jpg",
        "followerIntroduction": "Eum praesentium aperiam vitae doloribus cupiditate consequatur.",
        "followerId": 334,
        "followingId": 424,
        "createdAt": "2023-06-18T10:07:34.000Z",
        "isFollowed": false
    },
    ...略
```
Failure - status code : 500
```
{
    status: 'error', error: err.message
}
```
16. GET /api/users/:id/edit
- HTTP Method
    - GET
- 中文說明 - 這條 API 是做什麼的？
    - 個人資訊修改頁面
- Parameters
    - YES ( id )
- Request body
    - NO
- Response
    - Success - status code : 200
```
{
    "status": "success",
    "user": {
        "id": 424,
        "name": "user9",
        "account": "user9",
        "email": "user9@example.com",
        "avatar": "http://randomuser.me/api/portraits/women/12.jpg",
        "introduction": "Molestiae voluptate id ut vero saepe accusamus.",
        "role": "user",
        "banner": "https://i.imgur.com/jsrSDDm.png",
        "createdAt": "2023-06-18T10:07:34.000Z",
        "updatedAt": "2023-06-18T10:07:34.000Z"
    }
}
```
Failure - status code : 500
```
{
    status: 'error', error: err.message
}
```
17. GET /api/users/:id/edit
- HTTP Method
    - GET
- 中文說明 - 這條 API 是做什麼的？
    - 個人資訊修改頁面
- Parameters
    - YES ( id )
- Request body
    - NO
- Response
    - Success - status code : 200
```
{
    "id": 424,
    "name": "user9",
    "account": "user9",
    "email": "user9@example.com",
    "avatar": "http://randomuser.me/api/portraits/women/12.jpg",
    "introduction": "Molestiae voluptate id ut vero saepe accusamus.",
    "role": "user",
    "banner": "https://i.imgur.com/jsrSDDm.png",
    "createdAt": "2023-06-18T10:07:34.000Z",
    "updatedAt": "2023-06-18T10:07:34.000Z",
    "followerCount": 3,
    "followingCount": 2,
    "TweetCount": 12,
    "isFollowing": false
}
```
Failure - status code : 500
```
{
    status: 'error', error: err.message
}
```
18. PUT /api/users/:id
- HTTP Method
    - PUT
- 中文說明 - 這條 API 是做什麼的？
    - 個人資訊修改功能
- Parameters
    - YES ( id )
- Request body
    - YES ( name、introduction )
- Response
    - Success - status code : 200
```
{
    "id": 424,
    "name": "user2touser3",
    "account": "user9",
    "email": "user9@example.com",
    "avatar": "http://randomuser.me/api/portraits/women/12.jpg",
    "introduction": "fdsafas123df",
    "role": "user",
    "banner": "https://i.imgur.com/jsrSDDm.png",
    "createdAt": "2023-06-18T10:07:34.000Z",
    "updatedAt": "2023-06-18T16:42:44.230Z"
}
```
Failure - status code : 500
```
{
    status: 'error', error: err.message
}
```
19. POST /api/users
- HTTP Method
    - POST
- 中文說明 - 這條 API 是做什麼的？
    - 新增使用者
- Parameters
    - NO
- Request body
    - YES ( name、account、password、checkPassword、email )
- Response
    - Success - status code : 200
```
{
    "id": 494,
    "name": "user11",
    "email": "user11@export.com",
    "account": "user11",
    "banner": "https://i.imgur.com/jsrSDDm.png",
    "updatedAt": "2023-06-18T16:45:09.406Z",
    "createdAt": "2023-06-18T16:45:09.406Z"
}
```
Failure - status code : 500
```
{
    status: 'error', error: err.message
}
```

Followship:
20. POST /api/followships
- HTTP Method
    - POST
- 中文說明 - 這條 API 是做什麼的？
    - 追蹤使用者
- Parameters
    - NO
- Request body
    - YES ( id )
- Response
    - Success - status code : 200
```
{
    "followerId": 424,
    "followingId": "474",
    "updatedAt": "2023-06-18T16:47:57.807Z",
    "createdAt": "2023-06-18T16:47:57.807Z"
}
```
Failure - status code : 500
```
{
    status: 'error', error: err.message
}
```
21. DEL /api/followships/:followingId
- HTTP Method
    - DEL
- 中文說明 - 這條 API 是做什麼的？
    - 取消追蹤使用者
- Parameters
    - YES ( followingId )
- Request body
    - YES ( id )
- Response
    - Success - status code : 200
```
{
    "followerId": 424,
    "followingId": 474,
    "createdAt": "2023-06-18T16:47:57.000Z",
    "updatedAt": "2023-06-18T16:47:57.000Z"
}
```
Failure - status code : 500
```
{
    status: 'error', error: err.message
}
```

Admin:
22. GET /api/admin/tweets
- HTTP Method
    - GET
- 中文說明 - 這條 API 是做什麼的？
    - 瀏覽所有Tweet
- Parameters
    - NO
- Request body
    - NO
- Response
    - Success - status code : 200
```
{
    "status": "success",
    "tweets": [
        {
            "id": 3914,
            "UserId": 424,
            "description": "description",
            "createdAt": "2023-06-18T16:21:09.000Z",
            "updatedAt": "2023-06-18T16:21:09.000Z",
            "User": {
                "id": 424,
                "name": "user2touser3",
                "account": "user9",
                "email": "user9@example.com",
                "avatar": "http://randomuser.me/api/portraits/women/12.jpg",
                "introduction": "fdsafas123df",
                "role": "user",
                "banner": "https://i.imgur.com/jsrSDDm.png",
                "createdAt": "2023-06-18T10:07:34.000Z",
                "updatedAt": "2023-06-18T16:42:44.000Z"
            },
            "Replies": [],
            "Likes": [],
            "RepliesCount": 0,
            "LikesCount": 0
        },
        ...略
```
Failure - status code : 500
```
{
    status: 'error', error: err.message
}
```
23. POST /api/admin/signin
- HTTP Method
    - POST
- 中文說明 - 這條 API 是做什麼的？
    - 後台登入
- Parameters
    - NO
- Request body
    - YES ( account、password )
- Response
    - Success - status code : 200
```
{
    "status": "success",
    "data": {
        "token": "token",
        "user": {
            "id": 334,
            "name": "root",
            "account": "root",
            "email": "root@example.com",
            "avatar": "http://randomuser.me/api/portraits/women/3.jpg",
            "introduction": "Eum praesentium aperiam vitae doloribus cupiditate consequatur.",
            "role": "admin",
            "banner": "https://i.imgur.com/jsrSDDm.png",
            "createdAt": "2023-06-18T10:07:34.000Z",
            "updatedAt": "2023-06-18T10:07:34.000Z"
        }
    }
}
```
Failure - status code : 500
```
{
    status: 'error', error: err.message
}
```
24. DEL /api/admin/tweets/:tweetId
- HTTP Method
    - DEL
- 中文說明 - 這條 API 是做什麼的？
    - 刪除Tweet
- Parameters
    - YES ( tweetId )
- Request body
    - NO
- Response
    - Success - status code : 200
```
{
    "status": "success",
    "deletedTweet": {
        "id": 3914,
        "UserId": 424,
        "description": "description",
        "createdAt": "2023-06-18T16:21:09.000Z",
        "updatedAt": "2023-06-18T16:21:09.000Z"
    }
}
```
Failure - status code : 500
```
{
    status: 'error', error: err.message
}
```
25. GET /api/amin/users
- HTTP Method
    - GET
- 中文說明 - 這條 API 是做什麼的？
    - 瀏覽所有使用者
- Parameters
    - NO
- Request body
    - NO
- Response
    - Success - status code : 200
```
[
    {
        "id": 344,
        "name": "user22222",
        "account": "user1",
        "email": "user1@example.com",
        "avatar": "http://randomuser.me/api/portraits/women/4.jpg",
        "introduction": "jie,buratreahf",
        "role": "user",
        "banner": "https://i.imgur.com/jsrSDDm.png",
        "createdAt": "2023-06-18T10:07:34.000Z",
        "updatedAt": "2023-06-18T13:08:02.000Z",
        "Tweets": [
            {
                "id": 2924,
                "UserId": 344,
                "description": "Culpa harum modi et ut distinctio velit asperiores nam consequatur. Ut veritatis repellendus illum aliquid sequi culpa ut at. Aliquid sint est vel. Ex modi rerum vel qui. Atque accusamus deserunt consequuntur quia molestiae placeat dolorum eos.",
                "createdAt": "2023-06-18T10:07:34.000Z",
                "updatedAt": "2023-06-18T10:07:34.000Z",
                "Likes": []
            },
            {
                "id": 2934,
                "UserId": 344,
                "description": "Ratione explicabo magnam odio molestiae accusantium eum ut.",
                "createdAt": "2023-06-18T10:07:34.000Z",
                "updatedAt": "2023-06-18T10:07:34.000Z",
                "Likes": []
            },
            {
                "id": 2944,
                "UserId": 344,
                "description": "Possimus qui aut. Sed rerum et et earum deserunt. Vero explicabo magni ex similique inventore ducimus aut animi. Omnis accusantium vel magni est doloremque quae. Perspiciatis qui labore laboriosam corporis aut doloremque saepe.\n \rDolores ad dicta. Qui et consequatur illum sit tempore dolores. Sunt in ea aut. Nostrum est nobis molestiae aliquam ullam sed laborum asperiores reiciendis.\n \rRerum recusandae non atque et magnam fugiat. Omnis optio quibusdam dicta. Qui pariatur sunt totam unde quaerat dolores nam inventore.",
                "createdAt": "2023-06-18T10:07:34.000Z",
                "updatedAt": "2023-06-18T10:07:34.000Z",
                "Likes": []
            },
            {
                "id": 2954,
                "UserId": 344,
                "description": "amet modi amet",
                "createdAt": "2023-06-18T10:07:34.000Z",
                "updatedAt": "2023-06-18T10:07:34.000Z",
                "Likes": []
            },
            {
                "id": 2964,
                "UserId": 344,
                "description": "Et dignissimos nemo.",
                "createdAt": "2023-06-18T10:07:34.000Z",
                "updatedAt": "2023-06-18T10:07:34.000Z",
                "Likes": []
            },
            {
                "id": 2974,
                "UserId": 344,
                "description": "vitae",
                "createdAt": "2023-06-18T10:07:34.000Z",
                "updatedAt": "2023-06-18T10:07:34.000Z",
                "Likes": []
            },
            {
                "id": 2984,
                "UserId": 344,
                "description": "ab aliquam provident",
                "createdAt": "2023-06-18T10:07:34.000Z",
                "updatedAt": "2023-06-18T10:07:34.000Z",
                "Likes": []
            },
            {
                "id": 2994,
                "UserId": 344,
                "description": "Tempore saepe voluptas est omnis id deserunt.",
                "createdAt": "2023-06-18T10:07:34.000Z",
                "updatedAt": "2023-06-18T10:07:34.000Z",
                "Likes": []
            },
            {
                "id": 3004,
                "UserId": 344,
                "description": "Ut odio qui deleniti repellendus quidem. Dolorem nihil quibusdam autem. Quis mollitia nulla voluptates repudiandae tempora est. Doloribus rerum voluptatem labore ducimus architecto fugit.",
                "createdAt": "2023-06-18T10:07:34.000Z",
                "updatedAt": "2023-06-18T10:07:34.000Z",
                "Likes": []
            },
            {
                "id": 3014,
                "UserId": 344,
                "description": "est beatae et",
                "createdAt": "2023-06-18T10:07:34.000Z",
                "updatedAt": "2023-06-18T10:07:34.000Z",
                "Likes": []
            },
            {
                "id": 3884,
                "UserId": 344,
                "description": "fefreerf",
                "createdAt": "2023-06-18T16:01:53.000Z",
                "updatedAt": "2023-06-18T16:01:53.000Z",
                "Likes": []
            },
            {
                "id": 3894,
                "UserId": 344,
                "description": "r jfioj riojo",
                "createdAt": "2023-06-18T16:02:05.000Z",
                "updatedAt": "2023-06-18T16:02:05.000Z",
                "Likes": []
            }
        ],
        "Followers": [
            {
                "id": 334,
                "name": "root",
                "account": "root",
                "email": "root@example.com",
                "avatar": "http://randomuser.me/api/portraits/women/3.jpg",
                "introduction": "Eum praesentium aperiam vitae doloribus cupiditate consequatur.",
                "role": "admin",
                "banner": "https://i.imgur.com/jsrSDDm.png",
                "createdAt": "2023-06-18T10:07:34.000Z",
                "updatedAt": "2023-06-18T10:07:34.000Z"
            },
            {
                "id": 364,
                "name": "user3",
                "account": "user3",
                "email": "user3@example.com",
                "avatar": "http://randomuser.me/api/portraits/women/6.jpg",
                "introduction": "Temporibus suscipit velit cupiditate et reiciendis explicabo deleniti fuga.",
                "role": "user",
                "banner": "https://i.imgur.com/jsrSDDm.png",
                "createdAt": "2023-06-18T10:07:34.000Z",
                "updatedAt": "2023-06-18T10:07:34.000Z"
            },
            {
                "id": 394,
                "name": "user6",
                "account": "user6",
                "email": "user6@example.com",
                "avatar": "http://randomuser.me/api/portraits/women/9.jpg",
                "introduction": "Ex blanditiis corporis dolorum sit autem placeat aut in eos.",
                "role": "user",
                "banner": "https://i.imgur.com/jsrSDDm.png",
                "createdAt": "2023-06-18T10:07:34.000Z",
                "updatedAt": "2023-06-18T10:07:34.000Z"
            },
            {
                "id": 404,
                "name": "user7",
                "account": "user7",
                "email": "user7@example.com",
                "avatar": "http://randomuser.me/api/portraits/women/10.jpg",
                "introduction": "Pariatur aliquam modi illum non cum.",
                "role": "user",
                "banner": "https://i.imgur.com/jsrSDDm.png",
                "createdAt": "2023-06-18T10:07:34.000Z",
                "updatedAt": "2023-06-18T10:07:34.000Z"
            }
        ],
        "Followings": [
            {
                "id": 354,
                "name": "user2",
                "account": "user2",
                "email": "user2@example.com",
                "avatar": "http://randomuser.me/api/portraits/women/5.jpg",
                "introduction": "Ratione eum ipsam iure voluptatem.",
                "role": "user",
                "banner": "https://i.imgur.com/jsrSDDm.png",
                "createdAt": "2023-06-18T10:07:34.000Z",
                "updatedAt": "2023-06-18T10:07:34.000Z"
            },
            {
                "id": 364,
                "name": "user3",
                "account": "user3",
                "email": "user3@example.com",
                "avatar": "http://randomuser.me/api/portraits/women/6.jpg",
                "introduction": "Temporibus suscipit velit cupiditate et reiciendis explicabo deleniti fuga.",
                "role": "user",
                "banner": "https://i.imgur.com/jsrSDDm.png",
                "createdAt": "2023-06-18T10:07:34.000Z",
                "updatedAt": "2023-06-18T10:07:34.000Z"
            },
            {
                "id": 374,
                "name": "user4",
                "account": "user4",
                "email": "user4@example.com",
                "avatar": "http://randomuser.me/api/portraits/women/7.jpg",
                "introduction": "Laboriosam numquam quo sit.",
                "role": "user",
                "banner": "https://i.imgur.com/jsrSDDm.png",
                "createdAt": "2023-06-18T10:07:34.000Z",
                "updatedAt": "2023-06-18T10:07:34.000Z"
            },
            {
                "id": 394,
                "name": "user6",
                "account": "user6",
                "email": "user6@example.com",
                "avatar": "http://randomuser.me/api/portraits/women/9.jpg",
                "introduction": "Ex blanditiis corporis dolorum sit autem placeat aut in eos.",
                "role": "user",
                "banner": "https://i.imgur.com/jsrSDDm.png",
                "createdAt": "2023-06-18T10:07:34.000Z",
                "updatedAt": "2023-06-18T10:07:34.000Z"
            }
        ],
        "tweetsCount": 12,
        "followersCount": 4,
        "followingsCount": 4,
        "likedTweetsCount": 0
    },
```
Failure - status code : 500
```
{
    status: 'error', error: err.message
}
```

## Environment SetUp 環境建置
1. Node.js
2. MySQL
3. express

## Installing 安裝流程
1. Clone 此專案至本機電腦，打開你的 terminal
```
git clone https://github.com/deamo771003/Reastaurant-list.git](https://github.com/Lanways/twitter-api-2020.git
```

2. 開啟終端機(Terminal)，進入存放此專案的資料夾  
```
cd twitter-api-2020
```

3. 安裝 npm 套件
```
npm init -y
```

4. 安裝所有套件
```
npm install
```

5. 新增.env檔並加入以下內容
```
JWT_SECRET=自定義
INGUR_CLIENT_ID=輸入個人帳號
```

6. 載入MySQL Table
```
npx sequelize db:migrate
```

7. 載入預設範例資料
```
npx sequelize db:seed:all
```

8. app.js allowedOrigins變數加入網域名稱
```
const allowedOrigins = ['http://localhost:3000', '自定義'];
```

9. package.json 內容修改
```
"scripts": {
    "start": "NODE_ENV=development node app.js",
    "dev": "cross-env NODE_ENV=development nodemon app.js"
```

23. 可使用以下帳號測試  
```
後台
account: root
password: 12345678

前台
email: user1@example.com
password: 12345678
```

## Contributor 開發人員
[Lanways](https://github.com/Lanways)
[JimmyLin](https://github.com/deamo771003)
