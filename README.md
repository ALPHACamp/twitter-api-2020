# twitter-api-2020
# 前端串接 README


## 初始化
### 請在終端機輸入

```
git clone https://github.com/wintersprouter/twitter-api-2020.git
cd twitter-api-2020
npm install  (請參考 package.json)
```


### 建立.env

```
PORT='3000'
JWT_SECRET= xxx
IMGUR_CLIENT_ID= xxx
```


### 使用 MySQL Workbench 建立資料庫
需要與 config/config.json 一致

```
create database ac_twitter_workspace;
create database ac_twitter_workspace_test;
```


### 在終端機輸入以下指令，以進行資料庫遷移、種子資料初始化、啟動專案

```
npx sequelize db:migrate
npx sequelize db:seed:all
npm run dev
```


## 共用帳號
共用root user
root@example.com，登入密碼 12345678
