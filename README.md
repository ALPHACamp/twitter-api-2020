# Simple Twitter API

## Introduction

This is RESTful API server about Simple Twitter with fundamental operation of database, you can login by following account to start your twitter.

**Features**

- Signup account and signin
- Add, like/unlike, reply tweets
- Following/unfollowing users and check following or followers list
- Edit personal profile
- Top 10 user list

You can use the following accounts to login.

```
User(前台)
account: user1
password: 12345678

Admin(後台)
account: root
password: 12345678
```

## API Documents

Use api documents with following base URL.

```
https://quiet-mountain-47605.herokuapp.com/
```

- [API Documents](https://gabby-chimpanzee-de2.notion.site/API-Documents-8fbcef78100c4d3ebde095c3031a0856)

## Start to build a local API server

#### Please make sure you have installed Node.js, Express and MySQL.

#### Clone the repo

```
git clone https://github.com/miaout11/twitter-api-2022.git
```

#### Switch to project folder

```
cd twitter-api-2022
```

#### Open project

```
code .
```

#### Install packages required

```
npm install
```

#### Create file and folder in root

##### Set .env

- Create a `.env` file and set variables(see `.env.example` file).

```
JWT_SECRET=
IMGUR_CLIENT_ID=
```

##### Set upload feature

- Create `temp` folder for ensuring image to enable upload.

#### Setting database

- Modify `/config/config.json`

```
"development": {
  "username": "root",<change to your mysql username>
  "password": "password",<change to your mysql password>
  "database": "ac_twitter_workspace",
  "host": "127.0.0.1",
  "dialect": "mysql"
}
```

- Create database to your MySQL

```SQL
CREATE DATABASE ac_twitter_workspace;
```

- Migrations and seeds(run in terminal)

```
npx sequelize db:migrate
npx sequelize db:seed:all
```

### Start server

```
npm start
```

## Built With

- [Express](https://expressjs.com/) - The framework used
- [MySQL](https://www.mysql.com/) - Database
- [Heroku](https://www.heroku.com/platform) - Where API hosted

## Authors

- [Evelyn](https://github.com/miaout11)
- [Timothy](https://github.com/Coli-co)
