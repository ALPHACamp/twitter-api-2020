# twitter-api-2020 readme
### 簡介
以 Node.js 中的 Express.js 框架，來模擬 Twitter 製作，用於 Simple Twitter 的 MySQL 資料庫 API 伺服器。
並以 JWT(JSON Web Token) 進行身份驗證。
本專案採前後端分離的開發模式，此 repo  為後端 API ，請搭配前端 repo 使用。

[前端repo連結](https://github.com/Ingrid-chi/twitter_frontend)

---

### 專案DEMO
[專案入口網站](https://ingrid-chi.github.io/twitter_frontend/#/signin)

#### 測試帳號

|  | account |password|
| -------- | -------- | -------- |
| 使用者|users1|12345678|
|管理員|root|12345678|

（放截圖）

---
### 功能說明
#### 登入相關功能
* 使用者可以自己創建帳號，使用帳號登入、登出。
* 使用者必須要登入才能使用網頁功能。
* 使用者無法登入後台與使用後台功能。

#### 推文與回覆功能
* 使用者可以看到所有人的推文，與關於推文的回覆。
* 使用者可以自己發布推文，可以回覆他人或自己的推文。

#### Like與追蹤功能
* 使用者可以對推文點選Like，或取消Like。
* 使用者可以對其他使用者點選追蹤，或取消追蹤。

#### 查看使用者資訊
* 使用者可以瀏覽一位使用者的個人資訊。
* 使用者可以瀏覽一位使用者的所有推文、所有回覆、所有Like的推文。
* 使用者可以瀏覽一位使用者的所追蹤中的人，以及追蹤他的人。

#### 編輯使用者資訊
* 使用者可以編輯自己的名稱、帳號、email、介紹、大頭照、個人背景、密碼。

#### 推薦追蹤列表
* 使用者可以看見最多人追蹤的前十位使用者

#### 後台管理
* 可以使用管理者帳號登入後台，未登入無法使用後台功能。
* 管理者帳號無法使用前台功能
* 管理者可以在後台看到所有的使用者。
* 管理者可以在後台瀏覽所有推文。
* 管理者可以在後台刪除推文。

---
### 環境建置與需求
```
"Node.js": "16.14.0"
"express": "^4.16.4"
"bcrypt-nodejs": "0.0.3"
"bcryptjs": "^2.4.3"
"body-parser": "^1.18.3"
"express-session": "^1.15.6"
"imgur": "^1.0.2"
"jsonwebtoken": "^8.5.1"
"multer": "^1.4.3"
"mysql2": "^1.6.4"
"passport": "^0.4.1"
"passport-jwt": "^4.0.0"
"passport-local": "^1.0.0"
"sequelize": "^6.18.0"
"sequelize-cli": "^5.5.0"
```

---

### 安裝步驟
#### 安裝Node.js
至[Node.js的官方網站](https://nodejs.org)下載適合本地規格的Node.js

#### 使用終端機下載本專案
```
git clone https://github.com/InzooC/twitter-api-2020.git
```

#### 透過終端機進入資料夾
```
cd twitter-api-2020
```

#### 安裝相關套件
```
npm install
```

#### 確認安裝好MySQL，在MySQL輸入指令建立資料庫
至[MySQL workbench官網](https://dev.mysql.com/downloads/workbench/)下載資料庫軟體
```
create database ac_twitter_workspace;
```
#### 在終端機輸入指令，建立Model
```
npx sequelize db:migrate
```

#### 在終端機輸入指令，建立種子資料
```
npx sequelize db:seed:all
```
種子資料包含
|      | account |password|
| -------- | -------- | -------- |
| 管理員 |root  |12345678|
| 使用者1|users1|12345678|
| 使用者2|users2|12345678|
| 使用者3|users3|12345678|
| 使用者4|users4|12345678|
| 使用者5|users5|12345678|

已及種子使用者之間的推文、回覆、追蹤、Like

#### 在終端機輸入指令，建立.env檔
```
touch .env
```
#### 在.env檔中設定機密資料
```
JWT_SECRET=自己設定一組密碼
SESSION_SECRET=自己設定一組密碼
IMGUR_CLIENT_ID=請至https://imgur.com/申請
```

#### 配置/config.json
config/config.json 開發與測試環境中的資料庫連接設置。
```
{
  "development": {
    "username": "root",
    "password": "<your_password>",
    "database": "ac_twitter_workspace",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": "<your_password>",
    "database": "ac_twitter_workspace_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging": false
  }
}
```

#### 在終端機輸入指令，啟動伺服器
```
npm run start
```
#### 確認伺服器連線
若看見終端機出現 App is listening on port 3000! 代表順利運行。
可以向http://localhost:3000/ 發出api請求

#### 若欲暫停使用，請在終端機輸入指令
```
ctrl + c
```

---
### API文件
[API文件傳送門](https://hackmd.io/OhVqwYoaR3SiqcRCgP2JqQ?view)

---

### 開發成員與GitHub連結
* 後端：[小玥](https://github.com/InzooC)、[singingw](https://github.com/singingw)
* 前端：[渣渣兒](https://github.com/yaoqizha)、[Ingrid](https://github.com/Ingrid-chi)

