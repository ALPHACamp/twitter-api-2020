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

| Feature                              | Method | Route                         |
| ------------------------------------ | ------ | ----------------------------- |
| **Admin**                            |        |                               |
| Admin login to background system     | POST   | /api/admin/signin             |
| Admin get all users list             | GET    | /api/admin/users              |
| Admin delete a tweet                 | DELETE | /api/admin/tweets/:id         |
| Admin get all tweets                 | GET    | /api/admin/tweets             |
|--------------------------------------|--------|-------------------------------|
| **User**                             |        |                               |
| Normal user login to foreground app  | POST   | /api/signin                   |
| New user register                    | POST   | /api/users                    |
| Get user's profile                   | GET    | /api/users/:id                |
| Get login user's info                | GET    | /api/users/login_user         |
| Edit user's own profile              | PUT    | /api/users/:id                |
| Get user's own replies               | GET    | /api/users/:id/replied_tweets |
| Get user's own tweets                | GET    | /api/users/:id/tweets         |
| Get user's liked tweets              | GET    | /api/users/:id/likes          |
| Get user's followings list           | GET    | /api/users/:id/followings     |
| Get user's followers list            | GET    | /api/users/:id/followers      |
| Get top-10 users (top #followers)    | GET    | /api/users/top                | 
| Edit user's account setting          | POST   | /api/users/:id/setting        |
| Check user's permission              | GET    | /api/auth/test-token          |
|--------------------------------------|--------|-------------------------------|
| **Followship**                       |        |                               |
| Follow a user                        | POST   | /api/followships              |
| Unfollow a user                      | DELETE | /api/followships/:followingId |
|--------------------------------------|--------|-------------------------------|
| **Tweet**                            |        |                               |
| Post a tweet                         | POST   | /api/tweets                   |
| Post reply for a tweet               | POST   | /api/tweets/:tweet_id/replies |
| Get all tweets                       | GET    | /api/tweets                   |
| Get a tweet detail                   | GET    | /api/tweets/:tweet_id         |
| Get all replies for a tweet          | GET    | /api/tweets/:tweet_id/replies |
| Like a tweet                         | POST   | /api/tweets/:tweet_id/like    |
| Unlike a tweet                       | POST   | /api/tweets/:tweet_id/unlike  |
|--------------------------------------|--------|-------------------------------|