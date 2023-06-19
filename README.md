# Simple Twitter
![markdown](https://i.imgur.com/w40859T.png "Home Page")
## 介紹
利用前後端分離的方式，打造一個類Twitter的社群平台"Alphitter"，前端使用React框架，後端使用Express框架與MySQL關聯式資料庫，使用者可在平台建立帳號，新增、瀏覽、更新、刪除貼文，並追蹤其他使用者。
## Features功能
•	使用者可註冊帳號登入，編輯自己資料
•	新增、瀏覽、更新、刪除貼文
•	於貼文按讚或留言
•	追蹤其他使用者
## 前端網站連結
https://tales91817.github.io/simple-twitter
## API - 接口文件
提供每個API的使用方式與所回應格式與資訊
https://www.notion.so/Twitter_api_2020-80b7a66e89514f638eea161d028e765b
## Environment Setup 環境建置
•	Node.js 18.16.0
•	nodemon

## Install安裝與使用
1.	確認安裝Node.js和npm之後，將專案 clone 到本地
```
https://github.com/mamadoujiaohao/twitter-api-2020.git
```
2.	透過終端機進入此專案資料夾，安裝所需NPM Packages：
```
npm install
```
3.	在SQL WorkBench 建立資料庫 (在workBench內輸入)：
```
create database ac_twitter_workspace
```
4.	建立資料庫Table：
```
npx sequelize db:migrate
```
5.	在資料庫建立種子資料：
```
npx sequelize db:seed:all
```
6.	在.env檔案中放入密碼(參考.env.example)：
```
IMGUR_CLIENT_ID= 你的密碼
JWT_SECRET= 你的密碼
```
7.	啟動伺服器
```
npm run start
```
8.	若看見此行訊息則代表順利運行，打開瀏覽器進入到以下網址
```
Example app listening on http://localhost:3000
```
9.	若欲暫停使用
```
ctrl + c
```
10.	測試帳號
```
•	管理者帳號-後台
account: root
email: root@example.com
password: 12345678
•	使用者帳號-前台
account: user0~user4
email: user0@example.com ~ user4@example.com
password: 12345678
```