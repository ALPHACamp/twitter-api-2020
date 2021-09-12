# Simple Twitter API

此專案使用前/後端分離進行開發一個簡易版的 Twitter 專案，此 Repo 為 Simple-Twitter-Backend。

Simple-Twitter-Frontend: https://github.com/WilliamTsou818/simple-twitter-frontend

API 文件：https://whapsimpletwitter.docs.apiary.io/#

## Devolper:

William: https://github.com/WilliamTsou818

Avery: https://github.com/Kcih4518

## Getting Started

### 功能

- 使用者能建立帳戶
- 使用者能登入、登出
- 使用者能新增推文
- 使用者能進行互動(Reply、Following、Like)
- 使用者能編輯個人與帳戶資訊
- 管理者可瀏覽社群狀況(所有貼文、用戶概覽)
- 管理者可以瀏覽站內所有的使用者清單
- 管理者可以瀏覽站內所有的使用者的資訊 (推文數、關注數、跟隨者人數、like 數)
- 管理者無法登入前台

### Install

請確保你有執行環境有安裝 NPM、 MySQL、Workbench。

1. 透過 https 取得此專案

```bash
$ git clone https://github.com/WilliamTsou818/twitter-api-2020.git
```

2. 安裝相關套件

```bash
$ cd twitter-api-2020
$ npm install
```

3. 根據需求修改.env.example 的內容並更換其檔名

```bash
$ vim .env.example
$ mv .env.example .env
```

4. workbench 新增資料庫

我們要新增兩個資料庫，開發環境用的，以及測試環境用的。測試環境使用的資料庫，慣例會命名為開發環境資料庫加上 \_test。

```bash
create database ac_twitter_workspace
create database ac_twitter_workspace_test
```

5. 執行 migration

Model 設定才會寫入資料庫

```bash
$ npx sequelize db:migrate

```

6. 載入種子資料

- User ：

  - 1 名管理者
  - 5 名使用者
  - 每名使用者有 10 篇推文
  - 每篇推文有 3 篇留言，且留言者不可重複

- Like ：

  - 新增 150 筆種子資料
  - 每篇推文有 3 個人按讚 (不重複)
  - 5 名使用者每人共按 30 筆讚

- Followship ：
  - 新增 5 筆追隨資料
  - 每位 user 追隨 1 位本人以外的 user

```bash
$ npx sequelize db:seed:all
```

7. 透過 npm 在 local 啟動 web server

```bash
$ export NODE_ENV=development
$ npm run dev
Express is running on http://localhost:3000
```

## Development environment

| Package         | Version  |
| --------------- | -------- |
| Node.js         | v14.17.1 |
| Nodemon         | 2.0.7    |
| Express         | 4.16.4   |
| method-override | 3.0.0    |
| standard        | 16.0.3   |
| passport        | 0.4.1    |
| passport-jwt    | 4.0.0    |
| dotenv          | 10.0.0   |
| bcryptjs        | 2.4.3    |
| body-parser     | 1.18.3   |
| cors            | 2.8.5    |
| faker           | 5.5.3    |
| imgur-node-api  | 0.1.0    |
| jsonwebtoken    | 8.5.1    |
| method-override | 3.0.0    |
| mysql2          | 2.3.0    |
| jsonwebtoken    | 8.5.1    |
| sequelize       | 6.6.5    |
| sequelize-cli   | 6.2.0    |
