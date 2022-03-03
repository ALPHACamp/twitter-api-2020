<p align="center">
    <img src="https://img.shields.io/badge/Javascript-yellow" />
    <img src="https://img.shields.io/badge/express-orange" />
    <img src="https://img.shields.io/badge/Sequelize-blue"  />
    <img src="https://img.shields.io/badge/mySQL-blue"  />
</p>

# Simple-Twitter API

這是一個簡易版的推特(Twitter)專案，主要功能分別提供：
* 前台使用者
  1.發佈、瀏覽、回覆、喜歡推文(Tweet)
  2.追蹤其他使用者
  3.編輯個人資料
* 後台使用者
  1.看見所有使用者清單
  2.看見所有推文
  3.刪除使用者推文   

本專案主要技術包含：Node.js, Express, bcryptjs, passport, Sequelize, JWT，相關資訊請見以下：

## 使用流程
#### 複製專案到本機
```
git clone https://github.com/lcy101u/twitter-api-2020 
```
#### 進入專案資料夾
```
cd twitter-api-2020 
```
#### 安裝相關套件
```
npm install
```
#### 環境設定
依照 .env.example 中資訊範例設立 .env
```
JWT_SECRET=
IMGUR_CLIENT_ID=
PORT=3000
```
<details style="margin-left:2em;">
  <summary>如何取得 IMGUR_CLIENT_ID </summary>
  <ol>
    <li>前往 <a href="https://api.imgur.com/oauth2/addclient">imgur - Register an Application</a> 填寫資訊</li>
    <li>於 <code>Authorization type:</code> 請選擇 <code>OAuth 2 authorization without a callback URL</code></li>
    <li>點選 <code>submit</code> 便可取得 <code>Client ID</code> 與 <code>Client Secret</code>
    </li>
  </ol>
  <p style="margin-left:2em; color: yellow;">※ 一旦關閉便無法再次檢視資訊，請務必紀錄後再關閉頁面</p>
</details>

#### 資料庫

1. 設定 MySQL 連線資訊: 在 ./config/config.json，請確保MySQL Server帳號密碼與username、password一致
```
  "development": {
    "username": "root",
    "password": "password",
    "database": "ac_twitter_workspace",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": "password",
    "database": "ac_twitter_workspace_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging": false
  }
```

2. 登入MySQL Workbench後，在SQL File輸入並執行
```
create database ac_twitter_workspace
create database ac_twitter_workspace_test
```
3. 建立資料庫table，在終端機輸入
```
npx sequelize db:migrate
```
4. 建立種子資料
```
npx sequelize db:seed:all
```

#### 啟動本地端伺服器
需先安裝 [nodemon](https://www.npmjs.com/package/nodemon)
```
npm run dev
```
#### 成功執行
```
Example app listening on port <PORT>
```
#### 測試帳號
```
* 後台 admin 
account: root
password: 12345678
```

```
* 一般使用者
account: user1
password: 12345678
```

## 環境建置
* [Node.js](https://nodejs.org/)(v16.14.0)
* [Express](https://expressjs.com/)
* [MySQL](https://downloads.mysql.com/archives/installer/)
* [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) (v8.0.27)
* [sequelize](https://sequelize.org/)
* [sequelize-cli](https://github.com/sequelize/cli)
* .env

## 相關資訊
[前端元件圖](https://docs.google.com/spreadsheets/d/1EgFcej3ymy3WLrhQAI4U8qpoZr4-kWYOJj0-q5Q8E34/edit#gid=2012444158)
[API 文件](https://hackmd.io/zzv3xsJ4Rpaj4evqL5Mezg?view)
[系統架構](https://docs.google.com/spreadsheets/d/1EgFcej3ymy3WLrhQAI4U8qpoZr4-kWYOJj0-q5Q8E34/edit#gid=1226065534)


## 本次專案人員
[Rain](https://github.com/lcy101u)  
[Kemal](https://github.com/Kemal-Wuzhi) 

