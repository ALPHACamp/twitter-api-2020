# twitter-api-2020
ALPHA Camp | 學期 3 | Simple Twitter |
### Introduction
這是一個給前端使用的API
### Installation Guide
1. 使用終端機將專案clone至本地
```
git clone 
```
2. 進入到專案資料夾
```
cd twitter-api-2020
```
3. 安裝相關套件
```
npm install
```
4. 建立.env檔案，並參考.env.example，放入環境變數
5. 開啟./config/config.json檔案，修改成本地使用的帳號密碼
```
{
  "development": {
    "username": "<your_mysql_workbench_name>",
    "password": "<your_mysql_workbench_password>",
    "database": "ac_twitter_workspace",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "<your_mysql_workbench_name>",
    "password": "<your_mysql_workbench_password>",
    "database": "ac_twitter_workspace_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging": false
  },
  ...
}
```
6. 使用 MySQL Workbench 建立資料庫
```
drop database if exists ac_twitter_workspace;
create database ac_twitter_workspace;
drop database if exists ac_twitter_workspace_test; //測試檔用
create database ac_twitter_workspace_test;
```
7. 建立資料庫
```
npx sequelize db:migrate
```
8. 建立種子資料
```
npx sequelize db:seed:all
```
9. 啟動伺服器
```
npm run dev
```
10. 在終端機看到以下字串代表伺服器建立成功
```
Example app listening on port 3000!
```
11. 利用Postman連接API伺服器
12. 在Postman使用下方路由
```
POST http://localhost:3000/api/users
```
* 並在Body部分輸入以下帳號，即可登入前台
```
{
  "account": "user1@example.com",
  "password": "12345678"
}
```

* 輸入以下帳號則可登入後台
```
{
  "account": "root@example.com",
  "password": "12345678"
}
```
13. 取得 Token 後，即可開始測試各條路由
```
{
    "success": "true",
    "data": {
        "token": "...",
}
```
### API Endpoints
請參考
* https://documenter.getpostman.com/view/26339461/2s93RNyudo#intro

### Authors
* [chikumark](https://github.com/chikunmark)
* [LinTzuAn](https://github.com/LinTzuAn)
