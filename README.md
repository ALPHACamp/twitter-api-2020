# Simple Twitter API
It's an API server for [Simple Twitter](https://hsiaooooooju.github.io/simple-twitter/#/users/signin) website.

You can login with the accounts below:
| system     | account | password |
| ---------- | ------- | -------- |
| background | root    | 12345678 |
| foreground | user1   | 12345678 |

Visit the [Frontend Repo](https://github.com/HsiaooooooJu/simple-twitter). 

## Features

### Background for admin user
- Signin to get all users
- Get all tweets and delete a tweet

### Foreground for normal user
- Register and signin
- Edit user's own account setting and profile
- Post a tweet and delete user's own tweet
- Post a reply and delete user's own reply
- Get all tweets and a tweet's reply
- Like and unlike a tweet
- Follow and unfollow a user
- Get a user's profile, tweets, replies, liked tweets, followers, and followings 

## Getting Start

0. Install Node.js@14.16.0, npm, and MySQL

1. Clone the project

```
git clone https://github.com/eaz73727/twitter-api-2020.git
```

2. Install the required dependencies

```
npm install
```

3. Install nodemon 

```
npm i nodemon
```

4. Set environment variables in .env file according to .env.example

```
touch .env
```

5. Modify config.json with your own MySQL username, password, and database

```
"development": {
    "username": "<your username>",
    "password": "<your password>",
    "database": "<your database>",
    "host": "127.0.0.1",
    "dialect": "mysql"
}
```

6. Create tables and seeders 

```
npx sequelize db:migrate
npx sequelize db:seed:all
```

7. Start the server

```
npm run dev
```

8. Execute successfully if seeing following message

```
Example app listening on port 3000!
```

## Routes Table and API Doc
| Feature                              | Method | Route                                                                          |
| ------------------------------------ | ------ | ------------------------------------------------------------------------------ |
| **Admin**                            |        |                                                                                |
| Login to background for admin        | POST   | [/api/admin/signin](api-doc/admin/signin.md)                                   |
| Get all users for admin              | GET    | [/api/admin/users](api-doc/admin/get-users.md)                                 |
| Delete a tweet for admin             | DELETE | [/api/admin/tweets/:id](api-doc/admin/delete-tweet.md)                         |
| **User**                             |        |                                                                                |
| Login to foreground for user         | POST   | [/api/users/signin](api-doc/user/signin.md)                                    |
| Register an account                  | POST   | [/api/users](api-doc/user/signup.md)                                           |
| Get current user (admin/user)        | GET    | [/api/current_user](api-doc/user/get-current-user.md)                          |
| Get the user’s profile               | GET    | [/api/users/:id](api-doc/user/get-user-profile.md)                             |
| Edit user’s own profile              | PUT    | [/api/users/:id](api-doc/user/put-user-profile.md)                             |
| Edit user’s own account              | PUT    | [/api/users/:id/setting](api-doc/user/put-user-setting.md)                     |
| Get a user’s all tweets              | GET    | [/api/users/:id/tweets](api-doc/user/get-user-tweets.md)                       |
| Get a user’s all replies             | GET    | [/api/users/:id/replied_tweets](api-doc/user/get-user-replies.md)              |
| Get a user’s all liked tweets        | GET    | [/api/users/:id/likes](api-doc/user/get-user-liked-tweets.md)                  |
| Get a user’s all followings          | GET    | [/api/users/:id/followings](api-doc/user/get-user-followings.md)               |
| Get a user’s all followers           | GET    | [/api/users/:id/followers](api-doc/user/get-user-followers.md)                 |
| Get top 10 users with most followers | GET    | [/api/users/top_followers](api-doc/user/get-top-users.md)                      |
| **Followship**                       |        |                                                                                |
| Follow a user                        | POST   | [/api/followships](api-doc/followship/add-following.md)                        |
| Unfollow a user                      | DELETE | [/api/followships/:followingId](api-doc/followship/delete-following.md)        |
| **Tweet**                            |        |                                                                                |
| Add a tweet                          | POST   | [/api/tweets](api-doc/tweet/add-tweet.md)                                      |
| Delete a user’s own tweet            | DELETE | [/api/tweets/:id](api-doc/tweet/delete-tweet.md)                               |
| Get all tweets (admin/user)          | GET    | [/api/tweets](api-doc/tweet/get-tweets.md)                                     |
| Get a tweet                          | GET    | [/api/tweets/:id](api-doc/tweet/get-tweet.md)                                  |
| Add a reply related to a tweet       | POST   | [/api/tweets/:tweet_id/replies](api-doc/tweet/add-tweet-reply.md)              |
| Delete a user’s own reply            | DELETE | [/api/tweets/:tweet_id/replies/:reply_id](api-doc/tweet/delete-tweet-reply.md) |
| Get a tweet’s all replies            | GET    | [/api/tweets/:tweet_id/replies](api-doc/tweet/get-tweet-replies.md)            |
| Like a tweet                         | POST   | [/api/tweets/:id/like](api-doc/tweet/add-tweet-like.md)                        |
| Unlike a tweet                       | POST   | [/api/tweets/:id/unlike](api-doc/tweet/delete-tweet-like.md)                   |