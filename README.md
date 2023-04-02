# Twitter API

## API URL

```
https://morning-hamlet-47874.herokuapp.com/{router}
```

## [API list](https://www.notion.so/API-ba5531ec339c40b4bbb40203afd74a19)
**For user**
- [User](#signup)
- [Tweet](#post-new-tweet)
- [Reply](#post-new-reply-for-one-tweet)
- [Like](#like-a-tweet)
- [Followship](#following-a-user)

**For admin**
- [Admin](#signin-for-admin)

## [Signup](https://alabaster-crayon-174.notion.site/POST-api-users-eb41ece282c14ba3840727249b52f23f)

### Method & URL

```
POST /api/users
```

### Parameter
None

### Request Body
``` json
{
    "name": "name",
    "email": "name@email",
    "account": "account",
    "password": "password",
    "checkPassword": "password"
}
```

## [Signin]( https://www.notion.so/POST-api-users-signin-7d00249ea36344fe88d9019a446692ce)

### Method & URL

```
POST /api/users/signin
```

### Parameter
None

### Request Body
``` json
{
    "account": "user1",
    "password": "12345678"
}
```

### Response
``` json
{
    "authToken": "your authToken"
}
```

## [Show user's profile]( https://www.notion.so/GET-api-users-id-2e155b86d8374e5ab730df088f6d9454)

### Method & URL (authToken needed)

```
GET /api/users/:id
```

### Parameter
| Params | Required | Type | Description |
| :---- | :---- | :---- | :---- |
| id | Required | integer | user id |

### Request Body
None

## [Show user's tweets]( https://www.notion.so/GET-api-users-id-tweets-3a10d7749248470dbb6c28527272d12d)

### Method & URL (authToken needed)

```
GET /api/users/:id/tweets
```

### Parameter
| Params | Required | Type | Description |
| :---- | :---- | :---- | :---- |
| id | Required | integer | user id |

### Request Body
None

## [Show user's replies]( https://www.notion.so/GET-api-users-id-replied_tweets-7af3b446a4bc4b1da2f59f21654d1195)

### Method & URL (authToken needed)

```
GET /api/users/:id/replied_tweets
```

### Parameter
| Params | Required | Type | Description |
| :---- | :---- | :---- | :---- |
| id | Required | integer | user id |

### Request Body
None

## [Show user's likes]( https://www.notion.so/GET-api-users-id-likes-4452d6ce8d324b82be7e5b40b921be05)

### Method & URL (authToken needed)

```
GET /api/users/:id/likes
```

### Parameter
| Params | Required | Type | Description |
| :---- | :---- | :---- | :---- |
| id | Required | integer | user id |

### Request Body
None

## [Show user's followings]( https://www.notion.so/GET-api-users-id-followings-e6698bf3f85445a9924750bf4e93a2af)

### Method & URL (authToken needed)

```
GET /api/users/:id/followings
```

### Parameter
| Params | Required | Type | Description |
| :---- | :---- | :---- | :---- |
| id | Required | integer | user id |

### Request Body
None

## [Show user's followers]( https://www.notion.so/GET-api-users-id-followers-ebd597dcf3514c0e97ee7f26d14c195c)

### Method & URL (authToken needed)

```
GET /api/users/:id/followers
```

### Parameter
| Params | Required | Type | Description |
| :---- | :---- | :---- | :---- |
| id | Required | integer | user id |

### Request Body
None

## [Modify user's profile](https://www.notion.so/PUT-api-users-id-2b59fd4fdd68412884d9c9cc91cac739)

### Method & URL (authToken needed)

```
PUT /api/users/:id
```

### Parameter
| Params | Required | Type | Description |
| :---- | :---- | :---- | :---- |
| id | Required | integer | user id |

### Request Body

form-data
| key | type | 
| :-----| :----- | 
| name | text | 
| introduction | text | 
| avatar | file | 
| cover | file | 

## [Modify user's setting](https://www.notion.so/PUT-api-users-id-setting-e8fd583b4a86441c983a2f429c98a772)

### Method & URL (authToken needed)

```
PUT /api/users/:id/setting
```

### Parameter
| Params | Required | Type | Description |
| :---- | :---- | :---- | :---- |
| id | Required | integer | user id |

### Request Body

form-data
| key | type | 
| :-----| :----- | 
| account | text | 
| name | text | 
| email | text | 
| password | text | 
| checkPassword | text | 

## [Post new tweet](https://www.notion.so/POST-api-tweets-c641f65069cf408287bd93b2de1a7d5d)

### Method & URL (authToken needed)

```
POST /api/tweets
```

### Parameter
None

### Request Body
``` json
{
    "description": "new tweet"
}
```

## [Show all tweets](https://www.notion.so/GET-api-tweets-767fe9d01497461e86ceb59761a11aee)

### Method & URL (authToken needed)

```
GET /api/tweets
```

### Parameter
None

### Request Body
None

## [Show one tweet](https://www.notion.so/GET-api-tweets-tweet_id-b053ae9014954386b730cadb54ef482b)

### Method & URL (authToken needed)

```
GET /api/tweets/:tweet_id
```

### Parameter
| Params | Required | Type | Description |
| :---- | :---- | :---- | :---- |
| tweet_id | Required | integer | tweet id |

### Request Body
None

## [Post new reply for one tweet](https://www.notion.so/POST-api-tweets-tweet_id-replies-31038a6b450f448da911ed003aeb63e7)

### Method & URL (authToken needed)

```
POST /api/tweets/:tweet_id/replies
```

### Parameter
| Params | Required | Type | Description |
| :---- | :---- | :---- | :---- |
| tweet_id | Required | integer | tweet id |

### Request Body
``` json
{
    "comment": "new reply"
}
```

## [Show all replies for one tweet](https://www.notion.so/GET-api-tweets-tweet_id-replies-43ba104b28f54fd18e12c4edae24c689)

### Method & URL (authToken needed)

```
GET /api/tweets/:tweet_id/replies
```

### Parameter
| Params | Required | Type | Description |
| :---- | :---- | :---- | :---- |
| tweet_id | Required | integer | tweet id |

### Request Body
None

## [Like a tweet](https://www.notion.so/POST-api-tweets-id-like-52caa69cd0e94429a1df77490da0414d)

### Method & URL (authToken needed)

```
POST /api/tweets/:id/like
```

### Parameter
| Params | Required | Type | Description |
| :---- | :---- | :---- | :---- |
| id | Required | integer | tweet id |

### Request Body
None

## [Cancel like a tweet](https://www.notion.so/POST-api-tweets-id-unlike-4276de3e063245b7b49c9b3bcaaed8b8)

### Method & URL (authToken needed)

```
POST /api/tweets/:id/unlike
```

### Parameter
| Params | Required | Type | Description |
| :---- | :---- | :---- | :---- |
| id | Required | integer | tweet id |

### Request Body
None

## [Following a user](https://www.notion.so/POST-api-followships-0c81e978ee6645c99d21681ba37b14f2)

### Method & URL (authToken needed)

```
POST /api/followships
```

### Parameter
None

### Request Body
``` json
{
    "id":"1"
}
```

## [Cancel following a user](https://www.notion.so/DELETE-api-followships-followingId-64d150b622104322bea4cb7568230160)

### Method & URL (authToken needed)

```
DELETE api/followships/:followingId
```

### Parameter
| Params | Required | Type | Description |
| :---- | :---- | :---- | :---- |
| followingId | Required | integer | following id |

### Request Body
None

## [Show top users (having most followers)](https://www.notion.so/GET-api-followships-top-f74e7b92d2284a27a5bcfb6f13b30739)

### Method & URL (authToken needed)

```
GET /api/followships/top
```

### Parameter
None

### Request Body
None

## [Signin for admin](https://www.notion.so/POST-api-admin-signin-3f736e415afa4758aa26cd4c3dde9da5)

### Method & URL

```
POST /api/admin/signin
```

### Parameter
None

### Request Body
``` json
{
    "account": "root",
    "password": "12345678"
}
```

### Response
``` json
{
    "authToken": "your authToken"
}
```

## [Show all users for admin](https://www.notion.so/GET-api-admin-users-dc5c91d206ad48d6b4a1de3199f6cde8)

### Method & URL (authToken needed)

```
GET /api/admin/users
```

### Parameter
None

### Request Body
None

## [Show all tweets for admin](https://www.notion.so/GET-api-admin-tweets-a8e0a28ec04d4bf7a3e9b321e884ed7e)

### Method & URL (authToken needed)

```
GET /api/admin/tweets
```

### Parameter
None

### Request Body
None

## [Delete a tweet for admin](https://www.notion.so/DELETE-api-admin-tweets-id-ea069263bec94e299bb9e1c064ba72d7)

### Method & URL (authToken needed)

```
DELETE /api/admin/tweets/:id
```

### Parameter
| Params | Required | Type | Description |
| ---- | ---- | ---- | ---- |
| id | Required | integer | tweet id |

### Request Body
None

