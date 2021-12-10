# Simple Twitter API

此專案提供 API 給[前台](https://github.com/learnpytest/Front_End_Vue_Simple_Twitter)使用

# 功能

- 使用者能註冊/登入帳戶
- 使用者能檢視所有推文
- 使用者能/新增/刪除推文、Like/unLike 推文
- 使用者能追蹤/檢視/使用者資訊(推文、回覆、Like 的內容、追蹤者/追隨者數量)
- 後臺可查看/刪除貼文、瀏覽所有用戶

# 測試種子資料

```
  Admin: {
    "account": "root",
    "email": "root@example.com",
    "password": "12345678"
  },
  User1: {
    "username": "user1",
    "email": "user1@example.com",
    "password": "12345678"
  },
```

# 建立專案

1. 使用 Terminal，Clone 專案到本地

```
git clone https://github.com/steven4program/twitter-api-2020
```

2. 進入存放此專案的資料夾

```
cd twitter-api-2020
```

3. 安裝相關套件

```
npm install
```

4. 將.env.example 改為.env，並改為自己的設定

```
JWT_SECRET=SKIP
IMGUR_CLIENT_ID=SKIP
```

5. 修改 MySQL 相關資訊
   修改 ./config/config.json，裡面 development、test 的 password
   如要更改 database 的命名請於下一步一起更改

```
  "development": {
    "username": "root",
    "password": "<your_mysql_workbench_password>",
    "database": "ac_twitter_workspace",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": "<your_mysql_workbench_password>",
    "database": "ac_twitter_workspace_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging": false
  },
  ...
  "travis": {
    "username": "travis",
    "database": "ac_twitter_workspace_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging": false
  }
```

6. 建立 MySQL 資料庫
   打開 MySQL Workbench，並在登入且新增 SQL file 後，輸入

```
drop database if exists ac_twitter_workspace;
create database ac_twitter_workspace;
drop database if exists ac_twitter_workspace_test;
create database ac_twitter_workspace_test;
```

7. 建立資料庫及種子資料

```
npx sequelize db:migrate
npm sequelize db:seed:all
```

8. 啟動伺服器

```
npm run dev
```

9. 在終端機看到以下字串代表伺服器建立成功：

```
Example app listening on port 3000!
```

10. 自動化測試

```
NODE_ENV=test
npm run test
```

11. 特定測試檔自動化測試

```
NODE_ENV=test
npx mocha test/{{ Model or Request }}/{{Model or Request}}.spec.js --exit
```

## 開發前置需求

- [Visual Studio Code](https://code.visualstudio.com/)
- [Node.js](https://nodejs.org/en/)
- [Express](https://www.npmjs.com/package/express)
- [nodemon](https://www.npmjs.com/package/nodemon)
- [MySQL](https://www.mysql.com/)
- [MySQL Workbench](https://dev.mysql.com/downloads/mysql/)

## 開發人員

[steven4program](https://github.com/steven4program)
[leo812leo](https://github.com/leo812leo)
