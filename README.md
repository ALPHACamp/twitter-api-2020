# Simple Twitter Backend API
本專案是一個採用RESTful的理念設計API，主要提供[Simple Twitter](https://github.com/21Jasper12/Twitter-React) 專案中所需的所有資料

## 開始使用
1. 將本專案下載至本地
```
git clone https://github.com/jiawu777/twitter-api-2020.git
```
2. 進入專案資料夾
```
cd twitter-api-2020
```
3. 安裝所需套件
```
npm install
```
4. 打開 Visual Studio Code
```
code .
```
5. 請將本地資料庫的 username、password 與 /config/config.json 中的 development 設定一致。
```
"development": {
  "username": "root", // 設定此項
  "password": "password", // 設定此項
  "database": "ac_twitter_workspace",
  "host": "127.0.0.1",
  "dialect": "mysql"
}
```
6. 建立資料庫 [ 輸入於 MySQL Workbench 的 Query 介面 ]
```
create database ac_twitter_workspace;
create database ac_twitter_workspace_test;
```
7. 建立資料表 [ 輸入於 Visual Studio Code 的 terminal 介面 ]
```
npx sequelize db:migrate
```
8. 建立種子資料 [ 輸入於 Visual Studio Code 的 terminal 介面 ]
```
npx sequelize db:seed:all
```
9. 建立檔案 .env 並設定環境變數，可參考 .env.example
```
JWT_SECRET=
IMGUR_CLIENT_ID=
```
10. 啟動伺服器
```
npm run dev
```
若終端機顯示 ```Example app listening on port 3000!```，表示啟動成功。

## 測試網址
```
http://localhost:3000/
```
## 測試帳號
```
管理者
Account: root
Password: 12345678
一般使用者
Account: user1
Password: 12345678
```
## API 文件
https://www.notion.so/API-5febd9912288435896542ae00980a175

## 網站連結
https://21jasper12.github.io/Twitter-React/
