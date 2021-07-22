# Simple Twitter API Server
本專案為簡易型社群網站Simple Twitter，專案採前後端分離開發，
此Repo為後端API Server，利用Express.js及MySQL搭建，並使用RESTful API原則進行設計，
前端Repo可[點此前往](https://github.com/fogjogger1992/simple-twitter)，採用Vue.js框架進行開發。

## Live Demo

URL: https://fogjogger1992.github.io/simple-twitter/#/

可使用以下帳號進行登入
| 登入口 | Email | Password |
| -------- | -------- | -------- |
| 後台 | root@example | 12345678 |
| 前台 | user1@example | 12345678 |

## Features - 專案功能

* 使用者可以註冊帳戶進行登入，並編輯個人資料。
* 使用者可以新增貼文、對他人貼文進行留言
* 使用者可以瀏覽他人的公開個人資訊
* 使用者可以跟他人進行互動(對貼文按喜歡、追蹤使用者)
* 使用者可以進入公開聊天室與他人進行即時聊天

## Installation - 安裝專案

1. Clone 專案到本地

```
git clone https://github.com/bradychen2/twitter-api-2020.git
cd twitter-api-2020
```
2. 安裝套件

```
npm install
```
3. 設定資料庫

```
npx sequelize db:create
npx sequelize db:migrate
```
4. 產生種子資料

```
npx sequelize db:seed:all
```
5. 建立.env並設置敏感資料

```
IMGUR_CLIENT_ID= Your Imgur Application Client ID
```

## Tools or Packages - 工具套件

### 環境/框架

* Node.js v14.16.1
* Express v4.16.4

### 資料庫相關

* MySQL v8.0.25
* mysql2 v1.6.4
* sequelize v4.42.0
* sequelize-cli v5.5.0

### 驗證相關

* passport v0.4.0
* passport-jwt v4.0.0
* jsonwebtoken v8.5.1


### 即時聊天室

* [Socker.io](https://socket.io/) v4.1.3

### 其他

* bcryptjs v2.4.3
* cors v2.8.5
* dotenv v10.0.0
* faker v4.1.0
* imgur-node-api v0.1.0
* moment v2.29.1
* multer v1.4.2

## Developers - 開發人員

Brady - https://github.com/bradychen2
Chris - https://github.com/chriszychen
Leslie - https://github.com/lesliezsy
