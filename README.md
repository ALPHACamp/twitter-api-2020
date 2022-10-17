# Simple Twitter API 伺服器
## 專案簡述
本專案為前後端分離開發的後端部分，主要功能為操作資料庫之 CRUD，以實現前後端分工，為瀏覽器端提供服務。前後端專案串接後可模擬社群媒體 Twitter 的基本功能。
```
本專案前端 repo：https://github.com/imabby0508/simple-twitter
```
## 專案設定
1. 將本專案下載至本地
```
$ git clone https://github.com/PigeonShogi/twitter-api-2020.git
```
2. 進入專案資料夾
```
$ cd twitter-api-2020
```
3. 安裝所需套件
```
$ npm install
```
4. 建立資料庫（以 MySQLWorkbench 為例）
```
※ 請先核對本地資料庫的 username、password 是否與 /config/config.json 中的 development 設定一致。
步驟A：create database ac_twitter_workspace;
步驟B：字元集設定
Character Set: utf8mb4
Collation: utf8mb4_unicode_ci
```
5. 建立資料表
```
$ npx sequelize db:migrate
```
6. 建立種子資料
```
$ npx sequelize db:seed:all
```
7. 建立檔案 .env 並設定環境變數
```
環境變數設定可參考 .env.example
```
8. 啟動伺服器 
```
$ npm run dev
// 若終端機顯示「Example app listening on port 3000!」字樣，表示啟動成功。
```
## 執行測試
1. 建立測試用資料庫（以 MySQLWorkbench 為例）
```
※ 請先核對本地資料庫的 username、password 是否與 /config/config.json 中的 test 設定一致。
步驟A：create database ac_twitter_workspace_test;
步驟B：字元集設定
Character Set: utf8mb4
Collation: utf8mb4_unicode_ci
```
2. 進入測試環境
```
$ export NODE_ENV=test
```
3. 建立測試用資料表
```
$ npx sequelize db:migrate
```
4. 建立種子資料
```
$ npx sequelize db:seed:all
```
5. 測試
```
$ npm run test
```
## 測試帳號
* 管理員帳號：root
  密碼：12345678
* 一般用戶帳號 1：user1
  密碼：12345678
* 一般用戶帳號 2：user2
  密碼：12345678
* 一般用戶帳號 3：user3
  密碼：12345678
* 一般用戶帳號 4：user4
  密碼：12345678
* 一般用戶帳號 5：user5
  密碼：12345678
## API 文件
* Admin 相關路由：https://www.notion.so/Admin-APIs-72bce6d76c4947e5a0472183549a06bb
* Followship 相關路由：https://www.notion.so/Followship-APIs-13af0e79ac4c4e8289c0a90514cc499b
* Tweet 相關路由：https://www.notion.so/Tweet-APIs-7c7b82adf7a245f7b4fadff9d885c780
* User 相關路由：https://www.notion.so/User-APIs-cdc56858f87b4007b68d1974106f4a2a
## 主要開發工具
* Node.js 14.16.0
* Express 4.16.4
* MySQL2 1.6.4
* passport 0.4.0
* jsonwebtoken 8.5.1
* bcrypt-nodejs 0.0.3
