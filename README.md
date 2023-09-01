# Simple Twitter

![screenshot](public/images/placeholder1.png)

## About - 介紹

這是一個前後端分離的小組專案，前端使用React，後端則使用Node.js、Express搭配MySQL關連式資料庫所打造的API Server。
Simple Twitter 提供後台管理及前台頁面，使用者可以註冊，登入，推文，回覆推文，喜歡跟追蹤使用者等功能。
<br><br>

## 前端github repo - <https://github.com/akedaikuki/react-twitter>

<br><br>

## API - 接口文件

文件內提供每個街口的的使用方式，回傳，成功跟失敗的回傳資訊：<br>
<https://documenter.getpostman.com/view/28413018/2s9Xy5LqWf>
<br><br>

## Environment - 開發環境

* node v18.16.1
* nodemon
<br><br>

## Installation and Execution - 安裝與執行步驟

### 1. 開啟Terminal, Clone此專案至本機

```
git clone https://github.com/DannyHucc/twitter-api-2020.git
```

### 2. 進入存放此專案的資料夾

```
cd twitter-api-2020
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

### 6. 建立.env 檔案放入密碼 (參考.env.exp)

```
IMGUR_CLIENT_ID= 你的密碼
JWT_SECRET= 你的密碼
```

### 7. 啟動伺服器 (使用 nodemon)

```
npm run dev
```

### 8. Terminal出現以下字樣代表成功啟動

```
Server running on port:3000!
yes re-sync done!
```

<br>

## Seed Accounts - 測試帳號

專案提供 1 個後台管理者帳號與跟 5 位使用者帳號<br>
管理者帳號只可以使用後台功能，使用者帳號只能使用前台功能

### # 管理者帳號 - 後台

account: root <br>
email: <root@example.com> <br>
password: 12345678 <br>

### # 使用者帳號 - 前台

account: user1 ~ user5 <br>
email: <user1@example.com> <br>
password: 12345678 <br>
<br>

## Development Tools - 開發工具

* bcrypt-nodejs: "0.0.3",
* bcryptjs: "^2.4.3",
* body-parser: "^1.18.3",
* chai: "^4.2.0",
* connect-flash: "^0.1.1",
* cors: "^2.8.5",
* dotenv: "^16.3.1",
* express: "^4.16.4",
* express-session: "^1.15.6",
* express-validator: "^7.0.1",
* faker: "^5.5.3",
* imgur: "^1.0.2",
* jsonwebtoken: "^8.5.1",
* method-override: "^3.0.0",
* mocha: "^6.0.2",
* multer: "^1.4.3",
* mysql2: "^1.6.4",
* passport: "^0.4.0",
* passport-jwt: "4.0.0",
* passport-local: "^1.0.0",
* sequelize: "^6.18.0",
* sequelize-cli: "^5.5.0",
* sinon-chai: "^3.3.0",
* socket.io: "^4.7.1"
<br><br>

## Team - 團隊成員

### 前端

[akedaikuki](https://github.com/akedaikuki)<br>
[aria198a](https://github.com/aria198a)

### 後端

[DannyHucc](https://github.com/DannyHucc)<br>
[muco0521](https://github.com/muco0521)
