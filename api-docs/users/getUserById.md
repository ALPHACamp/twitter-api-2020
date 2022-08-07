# `GET` api/users/:id  

## API feature    
Get data of a certain user  
* Include tweetCount, followingCount and followerCount
* Exclude password, createdAt and updatedAt

## Input data  
### parameters  
| params | Description | required |
| ------ | ----------- | -------- |
| `id`   | user's id   | true     |
### req.body 
None

## Output data  
### Success  
```json
// status code: 200
{
    "id": 2,
    "name": "user1",
    "account": "user1",
    "email": "user1@example.com",
    "avatar": "https://avatar-url",
    "cover": "https://cover-url",
    "introduction": "balabala",
    "role": "user",
    "tweetCount": 10,
    "followingCount": 4,
    "followerCount": 2
}
```
### Errors  
User is not found by `id`
```json
// status code: 404
{
    "status": "error",
    "message": "User is not found."
}
```

## Links  
* [API index](../index.md)  
