# Simple Twitter
![screenshot](public/images/placeholder1.png)

## About - 介紹
這是一個前後端分離的小組專案，前端使用 React，後端則使用 Node.js、Express 搭配 MySQL 關聯式資料庫所打造的 API 伺服器。Simple Twitter 提供後台管理及前台頁面，使用者可以註冊、登入、推文、回覆推文、喜歡及追蹤使用者等功能。

## URL - 網站連結
Website - https://zebrrrra.github.io/twitter_challenge/main<br>
Frontend Repo - https://github.com/zebrrrra/twitter_challenge

## Preview - 預覽
![screenshot](public/images/homePage.png)
![screenshot](public/images/tweetPage.png)
![screenshot](public/images/publicChat.png)

## API - 接口文件
文件內提供每個接口的的使用方式，回傳，成功跟失敗的回傳資訊：<br>
https://www.notion.so/API-c1a90264a00848d2af202689ae0148be 

## Environment - 開發環境
* node v14.16.0
* nodemon
## Installation and Execution - 安裝與執行步驟
### 1. 開啟Terminal, Clone此專案至本機:
```
git clone https://github.com/klu0926/twitter-api-2023.git
```
### 2. 進入存放此專案的資料夾
```
cd twitter-api-2023
```
### 3. 安裝所需要的NPM Packages
```
npm install
```

### 4. 在SQL WorkBench 建立資料庫 (在workBench內輸入) 
```
create database ac_twitter_workspace
```
### 5. 建立資料庫 tables
```
npx sequelize db:migrate
```

### 5. 建立資料庫 seed
```
npx sequelize db:seed:all
```

### 6. 建立.env 檔案放入密碼 (參考.env.example)
```
IMGUR_CLIENT_ID= 你的密碼
JWT_SECRET= 你的密碼
```
### 7. 啟動伺服器 (使用 nodemon)
```
npm run dev
```

### 8. Terminal出現以下字樣代表成功啟動！
```
Example app listening on port 3000!
``` 


## Seed Accounts - 測試帳號
專案提供 1 個後台管理者帳號與跟 9 位使用者帳號<br>
管理者帳號只可以使用後台功能，使用者帳號只能使用前台功能
### # 管理者帳號 - 後台
account: root <br>
email: root@example.com <br>
password: 12345678 <br>
### # 使用者帳號 - 前台
account: user1 ~ user9 <br>
email: user1@example.com <br>
password: 12345678 <br>
<br>
## Development Tools - 開發工具
* bcrypt-nodejs: "0.0.3",
* bcryptjs: "^2.4.3",
* body-parser: "^1.18.3",
* chai: "^4.2.0",
* connect-flash: "^0.1.1",
* cors: "^2.8.5",
* dotenv: "^10.0.0",
* express: "^4.16.4",
* express-session: "^1.15.6",
* faker: "^4.1.0",
* imgur: "^1.0.2",
* jsonwebtoken: "^8.5.1",
* method-override: "^3.0.0",
* mocha: "^6.0.2",
* multer: "^1.4.3",
* mysql2: "^1.6.4",
* passport: "^0.4.0",
* passport-jwt: "4.0",
* passport-local: "^1.0.0",
* sequelize: "^6.18.0",
* sequelize-cli: "^5.5.0",
* sinon: "^10.0.0",
* sinon-chai: "^3.3.0"

## Team - 團隊成員
### 前端
[zebrrrra](https://github.com/zebrrrra)<br>
[Jena Lin](https://github.com/J6127)
### 後端
[kim1037](https://github.com/kim1037)<br>
[klu0926](https://github.com/klu0926)


