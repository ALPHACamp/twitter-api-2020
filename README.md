# Twitter API
本服務為 Twitter 專案之後端 API，提供本專案之前端使用。  
前端 repo：https://github.com/Yanhuabcd820/twitter2022

## Getting Started
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
* 在 MySQl 建立相關資料庫
```bash
create database ac_twitter_workspace;
create database ac_twitter_workspace_test;
```
* 確認 ./config/config.js 文件中的連線資訊是否相符
* 建立資料表
```bash
npx sequelize db:migrate
```
* 載入種子資料
```bash
npx sequelize db:seed:all
```
### 4. 啟動 server
```bash
nodemon app.js
```
### 5. 等待終端機出現
```bash
App is listening on port 3000!
```
### 6. 於網址輸入 localhost:3000/api
### 7. 若要暫停使用
```bash
ctrl + c
```

## Authors

* **Gallon Shih** 
* **maximeri** :  https://github.com/maximeri

## Development Tools

* Node.js 14.16.0
* Express 4.16.4
* passport 0.4.0
* passport-local 1.0.0
* passport-jwt 4.0.0
* cors 2.8.5
* mysql2 1.6.4
* sequelize 6.18.0
* sequelize-cli 5.5.0