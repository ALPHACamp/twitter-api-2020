# Simple Twitter API

本專案為前後分離協作，此API提供給 [twitter_project](https://github.com/JiangShuuu/twitter_project) 使用。

## 安裝流程
此安裝流程為本地端(local)使用。

### 專案建立
1. 打開你的終端機(terminal)，Clone 此專案至本機電腦

```
git clone https://github.com/Yung-Che/twitter-api-2020.git
```

2. 進入至專案資料夾

```
cd twitter-api-2020
```

3. 安裝 npm 相關套件

```
npm install
```

4. 新增 .env
為了確保使用順利，請新增.env檔，並按照.env.example檔設定
```
JWT_SECRET=SKIP
PORT = SKIP
IMGUR_CLIENT_ID=SKIP
```

5. 修改 MySQL 相關資訊
打開 ./config/config.json，更改development、test的password(請確保與MySQL Workbench相同)

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
```

6. 建立MySQL資料庫
請打開MySQL Workbench，並在登入後，新增SQL File後，於內文輸入

```
drop database if exists ac_twitter_workspace;
create database ac_twitter_workspace;
drop database if exists ac_twitter_workspace_test;
create database ac_twitter_workspace_test;
```

即建立ac_twitter_workspace、ac_twitter_workspace_test。

7. 建立資料庫table

```
npx sequelize db:migrate
```

8. 載入種子資料

```
npx sequelize db:seed:all
```

9. 啟動專案

```
nodemon app.js
```

10. 當終端機(terminal)出現以下字樣，代表執行成功

```
Example app listening on port 3000!
```

### 自動化測試

- 進行全部自動化測試，將測試Model、Request
```
NODE_ENV=test
npm run test
```
- 進行單一自動化測試，將測試選擇的檔案
```
NODE_ENV=test
npx mocha test/{{ Model or Request }}/{{Model or Request}}.spec.js --exit
```

## 產品功能
- 使用者能創建/登入帳戶
- 使用者能新增/刪除貼文
- 使用者能進行互動(回覆、追蹤、喜歡、查看top追蹤用戶)
- 後臺可管理所有社群狀況(刪除貼文、瀏覽用戶)

## 開發前置需求
- [Visual Studio Code](https://code.visualstudio.com/)
- [Node.js](https://nodejs.org/en/)
- [Express](https://www.npmjs.com/package/express)
- [nodemon](https://www.npmjs.com/package/nodemon)
- [MySQL](https://www.mysql.com/)
- [MySQL Workbench](https://dev.mysql.com/downloads/mysql/)

## 開發人員
[Eklipsorz](https://github.com/Eklipsorz)  
[Yung-Che](https://github.com/Yung-Che)
