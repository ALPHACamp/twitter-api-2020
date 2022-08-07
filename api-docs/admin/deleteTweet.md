# `DELETE` /api/admin/tweets/:id  

## API feature  
Delete a certain tweet.  
* Ensure is authencated admin。  

## Input data  
### parameters  
| name | description  | required |
| ---- | ------------ | -------- |
| `id` | tweet's `id` | true     |

### req.body  
None  

## Output data  
### Success  
```javascript
// status code: 200
{
    "status": "success",
    "message": "1 tweet was deleted"
}
```

### Errors  
Lack of any parameters 
```json
// status code: 400
{
    "status": "error",
    "message": "All fields are required."
}
```

Signin with account of role user
```javascript
// status code: 401
{
    "status": "error",
    "message": "permission denied: need permission of admin"
}
```

No tweet related to `id` is found
```javascript
// status code: 404
{
    "status": "error",
    "message": "Invalid id parameter or no tweet was found"
}
```

## Links  
* [API index](../index.md)  
