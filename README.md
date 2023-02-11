# Simple Twitter API
Simple Twitter採用前後端分離式的開發方式，提供一個論壇服務讓使用者登入後和其他使用者互動，而本專案是一個API伺服器，服務架設於Heroku，採用RESTful的理念設計API路由，主要提供Simple Twitter專案中所需的所有資料。

## Installation
### Clone the project to local
```
git clone https://github.com/eliochen34/twitter-api-2020.git
```
### Install the utilities
```
npm install
```
### Add .env file
```
JWT_SECRET=<jwt_secret>
IMGUR_CLIENT_ID=<imgur_client_id>
```
### add your password and username of your MySQL workbench to config/config.json
```
{
  "development": {
    "username": "username",
    "password": "mysql_workbench_password",
    "database": "ac_twitter_workspace",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
```
### Create the database
```
create database ac_twitter_workspace;
create database ac_twitter_workspace_test;
```
### Create the data table
```
$ npx sequelize db:migrate
```
### Create the seed data
```
$ npx sequelize db:seed:all
```
### Run the service
```
$ npm run dev
```
The service is running when console shows "Example app listening on port 3000!".
### Test accounts
```
Admin
Account: root
Password: 12345678
User
Account: user1
Password: 12345678
```
### API docs
https://www.notion.so/API-DEMO-01ccfd30c6f04c38a090051758e71097#32f3db0ba070415e87cec202edae8fdf