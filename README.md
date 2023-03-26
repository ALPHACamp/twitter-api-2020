# Simple Twitter RESTful API 

 這是一個使用 Node.js + Express + MySQL 建立的 Simple Twitter [後端專案](https://github.com/JoshuaLiuTw/twitter-api-2020)，部署於 Heroku，以 RESTFul API 滿足社群網站不同資料的互動需求，搭配 [前端專案](https://github.com/mirageapache/simple_twitter_frontend) ，打造一個全方位的社群網站。

### Demo 帳號
使用者可以使用以下帳號分別登入系統前台、後台。

|role| account | password |
| -------- | -------- | -------- |
| admin  | root   | 12345678  |
| user   | user1  | 12345678   
 
 ## Outline-目錄
- [Features-專案功能](#Features-專案功能)
- [Enviroment-環境建置與需求](#Enviroment-環境建置與需求)
- [Installing-專案安裝流程](#Installing-專案安裝流程)
- [API文件](#API文件)

## Features-專案功能
- 使用者 CRUD
  - 使用者可以註冊一個帳號
  - 使用者可以新增一則推文
  - 使用者可以回覆推文
  - 使用者能對別人的推文按 Like/Unlike
  - 使用者可以追蹤/取消追蹤其他使用者 (不能追蹤自己)
  - 使用者可以編輯自己的帳號資料
  - 使用者能編輯自己的名稱、介紹、大頭照和個人頁橫幅背景
  - 使用者能在首頁瀏覽所有的推文
  - 使用者點擊貼文方塊時，能查看該則貼文的詳情與回覆串
  - 使用者可以瀏覽別的使用者的個人資料及推文
  - 使用者能在首頁看見跟隨者 (followers) 數量排列前 10 的使用者推薦名單
  - 任何登入使用者都可以瀏覽特定使用者的以下資料：推文、推文與回覆、跟隨中、跟隨者、喜歡的內容
- 管理者 CRUD
  - 管理者可以瀏覽全站的 Tweet 清單
  - 管理者可以瀏覽站內所有的使用者清單包含：使用者社群活躍數據，包括推文 (tweet) 數量、關注人數、跟隨者人數、推文被 like 的數量
  - 管理者可以直接刪除任何人的推文
- 使用 bcryptjs 加密使用者密碼
- 整合 mocha、chai、sinon、sinon-chai 完成 Model 和 Request 的測試
- 加入 cors 實現跨網域連線
- 設定 dotenv 加入環境變數和隱藏敏感資訊
- 使用 faker 套件產生內容假資料
- 使用 multer 實作圖片上傳功能
- 整合 imgur-node-api 將圖片上傳至第三方平台
- 加入 validator 實作後端資料驗證

## Enviroment-環境建置與需求
### 伺服器（server）
* [Node.js](https://nodejs.org/en/) - v14.16.0
* [Express](https://expressjs.com/) - v4.16.4
### 資料庫（database）
* [sequelize](https://www.npmjs.com/package/sequelize) - v6.18.0
* [sequelize-cli](https://www.npmjs.com/package/sequelize-cli) - v5.5.0
* [mysql2](https://www.npmjs.com/package/mysql2) - v1.6.4
* [MySQL](https://www.mysql.com/) - v5.6.50

* [MySQL workbench](https://dev.mysql.com/downloads/) - v5.6.50
### 身份驗證（authentication）
* [passport](https://www.npmjs.com/package/passport) - v0.4.0
* [passport-jwt](https://www.npmjs.com/package/passport-jwt) - v 4.0.0
* [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - v8.5.1

## Installing-專案安裝流程
1. 請在終端機輸入

```
git clone https://github.com/JoshuaLiuTw/twitter-api-2020
cd twitter-api-2020
npm install  (請參考 package.json)
```

2. 建立.env

```
PORT='3000'
JWT_SECRET= xxx
IMGUR_CLIENT_ID= xxx
```


3. 使用 MySQL Workbench 建立資料庫
  * 需要與 config/config.json 一致

```
create database ac_twitter_workspace;
create database ac_twitter_workspace_test;
```

4. 在終端機輸入以下指令，進行資料庫遷移、種子資料初始化

```
npx sequelize db:migrate
npx sequelize db:seed:all
```

5. 在終端機輸入以下指令，啟動 swagger API 和 後端專案

```
npm run dev
```

* 註: 在終端機輸入以下指令，可以清空種子資料

```
npx sequelize db:seed:undo:all
```
    
## API文件網址
https://documenter.getpostman.com/view/26396156/2s93RNyaXx

### Base URL
* http://localhost:3000/api/{route}
* https://mysterious-reaches-21389.herokuapp.com/api/{route}



