# `GET` /api/tweets/:tweet_id/replies

## API feature
Get replies of a certain tweet.
* Ordered by timestamp of reply created

## Input data  
### query string  
Settings for pagination (optional)  
| name    | description           | default |
| ------- | --------------------- | ------- |
| `count` | limit of data records | null    |
| `page`  | page (start from 1)   | null    |
### parameters  
| params     | Description |
| ---------- | ----------- |
| `tweet_id` | tweet id    |
### req.body  
None

## Output data  
### Success  
```json
// status code: 200
[
    {
        "id": 334,
        "comment": "test",
        "tweetAuthorId": 2,
        "tweetAuthorAccount": "user1",
        "User": {
            "id": 2,
            "name": "user1",
            "account": "user1",
            "avatar": "https://avatar-url"
        },
        "createdAt": "2022-08-02T13:04:55.000Z"
    },
    {
        "id": 8,
        "comment": "sequi soluta praesentium",
        "tweetAuthorId": 2,
        "tweetAuthorAccount": "user1",
        "User": {
            "id": 4,
            "name": "incidunt aut",
            "account": "user3",
            "avatar": "https://avatar-url"
        },
        "createdAt": "2022-07-28T17:04:14.000Z"
    },
    // ...more replies
]
```

## Links  
* [API index](../index.md)  
