# Simple Twitter API

This is back-end REST-API app for AC Simple Twitter Project

## How to use?

**Note: ** This instruction is for local side

### Project init

1. Open you terminal and clone this repo to your local machine

```
git clone https://github.com/PaulChen79/PaulChen-twitter-api-2020.git
```

2. Get into the folder you cloned

```
cd PaulChen-twitter-api-2020
```

3. Install all dependencies

```
npm install
```

4. Add new .env file and add envirement variables with following

```
JWT_SECRET =
IMGUR_CLIENT_ID =
```

5. Modify the config.json file in config folder with you mySQL setting

```
"development": {
    "username": "root",
    "password": <your mysql password>,
    "database": "ac_twitter_workspace",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": <your mysql password>,
    "database": "ac_twitter_workspace_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging": false
  },
```

6. Create database to your MySQL server

```
CREATE DATABASE ac_twitter_workspace;
CREATE DATABASE ac_twitter_workspace_test;
```

7. Back to your terminal and do migrations and create seeds data

```
npx sequelize db:migrate
npx sequelize db:seed:all
```

8. Run the server and you can test APIs with the host: localhost:3000/api/

```
npm run start
```

### Run test

For running test you have to set your NODE_ENV to test

```
$env:NODE_ENV="test"
```

If it is first time you run the test, make sure your migrate the DB to your test DB

```
npx seqeulize db:migrate
```

Then run the test

```
npm run test
```

After you finished your test, make sure you change NODE_ENV back to development

```
$env:NODE_ENV="development"
```

## Features

- User can register and login as user
- After login, User can post tweet or view other user's tweet
- User can edit/delete their own tweet
- User can edit their profile data
- User can reply, like or unlike to other tweet
- User can follow or unfollow other user
- User can not login to admin page
- You can not register to be an admin. Admin user can only be create by manual in DB
- Admin can not login to normal page
- Admin can delete any tweet, view all users data

## Contributors

[PaulChen79](https://github.com/PaulChen79/)
[cincinfish](https://github.com/cincinfish)
