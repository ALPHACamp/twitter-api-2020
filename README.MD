# Alphitter API 
## A Simple Twitter Project
This is an API server for for [A Simple Twitter Application](https://s339428326.github.io/AlphaCamp-Twitter/login).

This app have background and foreground application, you can login with

| program    | account | password |
| ---------- | ------- | -------- |
| foreground |  user1  | 12345678 |
| background |  root   | 12345678 |

And go to [Front-end Github Repository](https://github.com/s339428326/AlphaCamp-Twitter)

## Features 

### Background program - only admin allowed to use
- Login and see all users (except admin).
- See all tweets on this app and can delete user's tweet.

### Foreground program - only normal users allow to use
- Register a new account and login.
- Get user's own profile, tweets, tweets they liked (have clicked like button), replies.
- Get user's following and follower users list.
- Edit user's own profile, upload avatar and cover photo.
- Edit user's account setting, change account, name, email and password.
- Post a tweet and reply a tweet.
- Like and unlike other users' tweet.
- Get all tweets and replies of one tweet.
- Follow and unfollow other user.


## Getting Start

### Prerequisites 

1. Install Node.js@14.16.0, npm, and MySQL

### Installing

1. Switch to your Terminal(for MacOS) or git-bash(for Windows)

2. Clone the project to local

```
git clone https://github.com/bensonybs/twitter-api-2020.git
```

3. CD to this project

```
cd twitter-api-2020
```

4. Install required dependencies

```
npm install
```


5. Touch a .env file and add environment variables according to .env.example

```
touch .env
```

```
JWT_SECRET=SKIP
IMGUR_ALBUM_ID=SKIP
IMGUR_CLIENT_ID=SKIP
IMGUR_CLIENT_SECRET=SKIP
IMGUR_REFRESH_TOKEN=SKIP
PORT=3000
```


6. create a database in MySQL, you can run this SQL query

```
create database ac_twitter_workspace;

```

7. Modify config.json with your own MySQL username and password

```
"development": {
    "username": "<your username>",
    "password": "<your password>",
    "database": "ac_twitter_workspace",
    "host": "127.0.0.1",
    "dialect": "mysql"
}
```

8. Create tables and write seeds data, run below command in your terminal:

```
npx sequelize db:migrate
npx sequelize db:seed:all
```

9. Start the server

```
npm run start
```

10. If your terminal shows

```
Example app listening on port 3000!
```
Congrats! This API server start successfully.

11. To terminate the server, type in

```
ctrl + c
```

## Routes Table and API documents link
[API documents](https://pse.is/4nwhyk)

| Feature                              | Method | Route                                                                                 |
| ------------------------------------ | ------ | --------------------------------------------------------------------------------------|
| **Admin**                            |        |                                                                                       |
| Admin login to background system     | POST   | [/api/admin/signin](api-documentation/admin/admin-signin.md)                          |
| Admin get all users list             | GET    | [/api/admin/users](api-documentation/admin/admin-get-all-users.md)                    |
| Admin delete a tweet                 | DELETE | [/api/admin/tweets/:id](api-documentation/admin/admin-delete-a-tweet.md)              |
| Admin get all tweets                 | GET    | [/api/admin/tweets](api-documentation/admin/admin-get-all-tweets.md)                  |
||
| **User**                                                                                                                              |
| Normal user login to foreground app  | POST   | [/api/signin](api-documentation/users/user-login.md)                                  |
| New user register                    | POST   | [/api/users](api-documentation/users/user-signup.md)                                  |
| Get user's profile                   | GET    | [/api/users/:id](api-documentation/users/get-single-user-profile.md)                  |
| Edit user's own profile              | PUT    | [/api/users/:id](api-documentation/users/edit-login-user-profile.md)                  |
| Get user's own replies               | GET    | [/api/users/:id/replied_tweets](api-documentation/users/get-single-user-replies.md)   |
| Get user's own tweets                | GET    | [/api/users/:id/tweets](api-documentation/users/get-single-user-tweets.md)            |
| Get user's liked tweets              | GET    | [/api/users/:id/likes](api-documentation/users/get-single-user-likes-tweet.md)        |
| Get user's followings list           | GET    | [/api/users/:id/followings](api-documentation/users/get-single-user-followings.md)    |
| Get user's followers list            | GET    | [/api/users/:id/followers](api-documentation/users/get-single-user-followers.md)      |
| Get top-10 users (top #followers)    | GET    | [/api/users/top](api-documentation/users/get-top10-users.md)                          | 
| Edit user's account setting          | POST   | [/api/users/:id/setting](api-documentation/users/edit-login-user-account-setting.md)  |
| Check user's permission              | GET    | [/api/auth/test-token](api-documentation/users/get-token-status.md)                   |
||
| **Followship**                                                                                                                        |
| Follow a user                        | POST   | [/api/followships](api-documentation/followship/follow-a-user.md)                     |
| Unfollow a user                      | DELETE | [/api/followships/:followingId](api-documentation/followship/unfollow-a-user.md)      |
||
| **Tweet**                                                                                                                             |
| Post a tweet                         | POST   | [/api/tweets](api-documentation/tweets/post-a-tweet.md)                               |
| Post reply for a tweet               | POST   | [/api/tweets/:tweet_id/replie](api-documentation/tweets/post-a-tweet-reply.md)        |
| Get all tweets                       | GET    | [/api/tweets](api-documentation/tweets/get-all-tweets.md)                             |
| Get a tweet detail                   | GET    | [/api/tweets/:tweet_id](api-documentation/tweets/get-a-tweet.md)                      |
| Get all replies for a tweet          | GET    | [/api/tweets/:tweet_id/replies](api-documentation/tweets/get-a-tweet-replies.md)      |
| Like a tweet                         | POST   | [/api/tweets/:tweet_id/like](api-documentation/tweets/like-a-tweet.md)                |
| Unlike a tweet                       | POST   | [/api/tweets/:tweet_id/unlike](api-documentation/tweets/unlike-a-tweet.md)            |


## Contributors
- [Benson Ye Bin Shuo](https://github.com/bensonybs)
- [Shorty Lin](https://github.com/shorty60)
