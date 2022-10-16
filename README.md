# Simple Twitter API
這是一個前後端合作專案中的後端部分，主要採RESTFul API設計來做資料間的互動，並搭配前端專案建立一個基本的社交網站

## 安裝步驟

### Clone專案到本機

```
$ git clone https://github.com/parker3216/twitter-api-2020.git
```
### 安裝套件

```
$ cd twitter-api-2020
$ npm install
```
### 增加.env檔案

```
JWT_SECRET=你的<jwt_secret>
IMGUR_CLIENT_ID=你的<imgur_client_id>
```
### 輸入你的MySQL Workbench密碼到config.json file

```
{
  "development": {
    "username": "root",
    "password": "你的 mysql_workbench_password",
    "database": "ac_twitter_workspace",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
```

### 到MySQL建立資料庫

輸入下列語法，建立developmnet及test環境的資料庫

```
create database ac_twitter_workspace;
```
### 建立資料表

```
$ npx sequelize db:migrate
```
### 建立種子資料

```
$ npx sequelize db:seed:all
```
### 啟動server

```
$ npm run dev
```
當本機出現Example app listening on port 3000! 代表啟動成功！

### 測試帳號

```
Admin
Account: root
Password: 12345678

User
Account: user1
Password: 12345678
```
## API文件
[文件連結](https://docs.google.com/document/d/1uj7txqbYDzgLnbGzjxk0KF0K8Z9QCxctKmKQBmbr6rw/)

