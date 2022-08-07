# `GET` /api/currentUser  

## API feature  
* Get data of current login user from `req.user`.  
* Data are stored into `req.user` after authenticated. 


## Input data  
### parameters  
None  

### req.body  
None

## Output data  
### Success  
```json
// status code: 200
{
    "id": 14,
    "name": "user1",
    "account": "user1",
    "avatar": "<url>",
    "email": "user1@example.com",
    "role": "user"
}
```

## Links  
* [API index](../index.md)  
