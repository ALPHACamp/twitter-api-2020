# Simple Twitter API
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

這是一個使用Node.js、Express、及 MySQL 建立的簡單Twitter  RESTful API，它可以讓使用者註冊、登入、發推文、查看推文，並且追蹤其他用戶。此外，API也提供了一些基本的驗證和授權機制。

![cover](./public/image/cover_simple_twitter.jpg)

## 專案作品

* [網站入口](https://ai-chen-hsieh.github.io/Twitter-2023/login)
* [前端 Github Repo 連結](https://github.com/Ai-Chen-Hsieh/Twitter-2023)
<br/>
<br/>


## 測試帳號

| 登入權限  | 角色  | 帳號  | 密碼 |
| ------------- | ------------- | ------------- |:-------------:|
| 後台      | admin      | root      | 12345678     |
| 前台      | user      | user1      | 12345678     |



## API 文件

更多詳細資訊請參閱[ API 文件](https://simpletwitterapi4.docs.apiary.io/#)
<br/>
<br/>

## 功能描述 Features

* 使用者
 - 可以登入、註冊帳號
 - 可以在首頁瀏覽所有推文
 - 可以點擊推文，查看推文與回覆串
 - 可以回覆推文
 - 可以對推文按like/unlike
 - 可以追蹤/取消追蹤其他使用者
 - 可以編輯自己的帳號資料、自我介紹、大頭照和個人頁橫幅背景
 - 任何登入使用者都可以瀏覽特定使用者的以下資料：個人資料、推文、回覆、喜歡的內容、關注清單、跟隨者清單
 - 能在首頁的側邊欄，看見跟隨者 (followers) 數量排列前 10 的推薦跟隨名單
 
* 管理者
 - 可以登入後台
 - 可以瀏覽全站的 Tweet 清單
 - 可以在清單上直接刪除任何人的推文
 - 可以瀏覽站內所有的使用者清單：推文數量、關注人數、跟隨者人數、使用者的 Tweet 獲得 like 的累積總量
<br/>
<br/>


## 技術細節
- 使用 Express 框架來創建 RESTful API
- 使用 Sequelize ORM 來管理 MySQL 數據庫
- 使用 MySQL Workbench 來管理數據庫結構和數據
- 使用 dotenv 加入環境變數
- 使用 cors 處理跨網域資源共享
- 使用 imgur API 處理圖片上傳

<br/>

## 安裝與執行步驟 Installation and Execution
1. 請先確認有安裝 Node.js、npm、MySQL workbench
2. 打開終端機(Terminal)，將專案 clone 至本機位置

```
git clone https://github.com/yy933/twitter-api-2020
```
3. 進入存放此專案的資料夾

```
cd twitter-api-2020
```
4. 安裝 npm 套件

```
npm install
```
5. 建立 .env 檔 (參照.env.example)


6. 使用 MySQL Workbench 建立資料庫

```
create database ac_twitter_workspace;
create database ac_twitter_workspace_test;
```

6. 建立資料表並載入種子資料

```
npx sequelize db:migrate
npx sequelize db:seed:all
```
7. 執行

```
npm run dev
```
8. 若看見此行訊息則代表順利運行，打開瀏覽器進入到以下網址

```
Example app listening on port 3000!
```
9. 若要暫停使用，則輸入

```
ctrl + c
```
<br/>

## 環境建置與需求 Prerequisites

* Node.js 18.12.1
* Express 4.16.4
* mysql2 1.6.4
* sequelize 6.29.3
* sequelize-cli 5.5.0

<br/>

## 開發人員 Contributor
#### Back-end
[ Emily ](https://github.com/yy933)
<br/>
[ Abbie ](https://github.com/abbie930)
#### Front-end
[ Anna ](https://github.com/b10332040)
<br/>
[ Evan ](https://github.com/Ai-Chen-Hsieh)
<br/>
[ Tammy ](https://github.com/TammyKao)

<br/>