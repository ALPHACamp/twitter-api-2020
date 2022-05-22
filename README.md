# **Twitter API**
本服務為 Twitter 專案之後端 API，提供本專案之前端使用。  
[前端 repo](https://github.com/Yanhuabcd820/twitter2022)  
[後端 API](https://damp-wave-52946.herokuapp.com/api-doc)  
[Twitter Demo](https://bunreal.github.io/Twitter2022/#/logIn)

### **測試帳號**
- | 帳號 | 密碼
--- | --- | ---
後台 | root | 12345678
前台 | user1 | 12345678


## <span style="color: red">**Getting Started**<span>
### 1. 將專案 clone 到本機
```bash
git clone https://github.com/GallonShih/twitter-api-2020.git
```
### 2. 透過 npm 安裝相關套件
```bash
npm install
```
### 3. 資料庫準備
* 請確認本機是否已安裝MySQL，並運行中  
[安裝MySQL & Workbench](https://downloads.mysql.com/archives/installer/)
* 在 MySQL Workbench 建立相關資料庫
```bash
create database ac_twitter_workspace;
create database ac_twitter_workspace_test;
```
* 確認 [./config/config.json](./config/config.json) 文件中的連線資訊是否相符
```
{
  "development": {
    "username": "<your username>",
    "password": "<your password>",
    "database": "ac_twitter_workspace",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "<your username>",
    "password": "your password",
    "database": "ac_twitter_workspace_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging": false
  }
}
```
* 建立資料表
```bash
npx sequelize db:migrate
```
* 載入種子資料
```bash
npx sequelize db:seed:all
```
### 4. 設定環境變數
根據 [.env.example](./.env.example)，建立 .env 檔案
### 5. 啟動 server
```bash
npm run start
```
### 6. 等待終端機出現
```bash
App is listening on port 3000!
```
### 7. 於網址輸入 [localhost:3000/api-doc](http://localhost:3000/api-doc)
### 8. 若要暫停使用
```bash
ctrl + c
```

## <span style="color: red">**Authors**<span>

* **[Gallon Shih](https://github.com/GallonShih)**
* **[maximeri](https://github.com/maximeri)**

## <span style="color: red">**Development Tools**<span>

* Node.js 14.16.0
* Express 4.16.4
* passport 0.4.0
* passport-local 1.0.0
* passport-jwt 4.0.0
* bcryptjs 2.4.3
* cors 2.8.5
* mysql2 1.6.4
* sequelize 6.18.0
* sequelize-cli 5.5.0
* imgur 1.0.2