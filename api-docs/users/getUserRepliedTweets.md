# `GET` /api/users/:id/replied_tweets 

## API feature
Get replied tweets data of a certain user  
* Ordered by timestamp of reply created 

## Input data  
### query string  
Settings for pagination (optional)  
| name    | description           | default |
| ------- | --------------------- | ------- |
| `count` | limit of data records | null    |
| `page`  | page (start from 1)   | null    |
### parameters  
| params | Description               | required |
| ------ | ------------------------- | -------- |
| `id`   | id of user being searched | true     |
### req.body  
None

## Output data  
### Success  
```json
// status code: 200
// id: 4
[
    {
        "id": 15,
        "comment": "nihil quo est",
        "createdAt": "2022-07-28T17:52:29.000Z",
        "User": { // reply作者
            "id": 4,
            "name": "user3",
            "account": "user3",
            "avatar": "https://avatar-url"
        },
        "Tweet": {
            "id": 5,
            "User": { // reply的原tweet作者
                "id": 2,
                "name": "user1",
                "account": "user1"
            }
        }
    },
    {
        "id": 33,
        "comment": "laboriosam quibusdam assumenda",
        "createdAt": "2022-07-28T16:07:39.000Z",
        "User": {
            "id": 4,
            "name": "user3",
            "account": "user3",
            "avatar": "https://avatar-url"
        },
        "Tweet": {
            "id": 11,
            "User": {
                "id": 3,
                "name": "user2",
                "account": "user2"
            }
        }
    },
    // ...more replies
]
```

### Errors  
Lack of valid token
```json
// status code: 401
{
    "status": "error",
    "message": "Unauthorized. Please login first."
}
```
Can't find user by parameter `id`
```json
// status code: 404
{
    "status": "error",
    "message": "User is not found"
}
```

## Links  
* [API index](../index.md)  
