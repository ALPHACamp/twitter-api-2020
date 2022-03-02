# Simple Twitter API
An API server for [Simple Twitter](https://zheanzheng.github.io/) built on Node.js with Exress.js and MySQL database.
## Try It Out ✨
Simple Twitter API is running on [Heroku](heroku.com). You can experience its full feature with [this link](https://zheanzheng.github.io/), and enter the following existing **account** and **password** to login through admin/user login page respectively.
| Role | Account | Password |
| ------ | ------ | ------ |
| Admin | root | 12345678 |
| User | user1 | 12345678 |

## API Guideline
Please refer more details to the API with this [API Documentation](https://documenter.getpostman.com/view/18991958/UVknuGu4). All {{base_url}} in the API document reference to the following URL.
```
https://twitter-louis.herokuapp.com/api
```
If you'd like to download it locally, you can use it with the test accounts if you follow the instrucitons below.

## Getting Started
Running Simple Twiiter API server locally by following instructions below.

### Prerequisite
- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/en/download/)
- [MySQL](https://dev.mysql.com/downloads/mysql/)
- [MySQL Workbench](https://dev.mysql.com/downloads/mysql/)

## Installation
#### Clone the project
```
$ git clone https://github.com/Phiphi0912/twitter-api-2020.git
```
####  Change directory to the project
```
$ cd twitter-api-2020
```
#### Install dependencies
```
$ npm install
```
## Configuration
#### Add .env file
Please reference `.env.example` to create a `.env` file for app functionality.
For IMGUR_CLIENT_ID, you must first register an application on [IMGUR](https://api.imgur.com/oauth2/addclient).
```
JWT_SECRET=<your_jwt_secret>
IMGUR_CLIENT_ID=<your_imgur_client_id>
PORT=<your_port>
```

#### Config MySQL in `config/config.json` for development/test environment

```
{
  "development": {
    "username": "root",
    "password": "<your_mysql_workbench_password>",
    "database": "ac_twitter_workspace",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": "your_mysql_workbench_password",
    "database": "ac_twitter_workspace_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging": false
  },
```

#### Create database
Please open MySQL Workbench and create database for both development/test environment through following SQL command.
```
drop database if exists ac_twitter_workspace;
create database ac_twitter_workspace;
drop database if exists ac_twitter_workspace_test;
create database ac_twitter_workspace_test;
```

#### Database migration
Use npx to run Sequelize command for creating tables through migration files.
For development:
```
$ NODE_ENV=development
$ npx sequelize db:migrate
```
For test:
```
$ NODE_ENV=test
$ npx sequelize db:migrate
```

## Usage
#### Generate seed data
We have all kinds of default data for your convenience. 
```
$ NODE_ENV=development
$ npx sequelize db:seed:all
```
#### Run the server
Simpily do:
```
$ node app.js
```
Or you can install [nodemon](https://www.npmjs.com/package/nodemon) then run the following script for better developing experience.
```
$ npm run dev
```
You should see `Alphitter api server listening on port <your_port>!` on your terninal.

## Authors
- [Louis Zeng](https://github.com/Phiphi0912)
- [Richard Widjaya](https://github.com/ricwidjaya)
