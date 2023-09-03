# simple-twitter

## 介紹
此為支援簡易社群平臺的 API 專案，以 Node.js 下的 express.js 為基礎框架，並搭配 MySQL 進行開發。

### 功能
+ 用戶認證系統 (自行註冊)
+ 瀏覽所有推文及發佈推文
+ 瀏覽推文下的所有留言及發佈留言
+ 推文按讚、收回
+ 用戶追蹤、取消
+ 瀏覽主頁及其他用戶主頁
+ 編輯個人資料
+ 後臺管理

## 啟用專案
1. 請確認本地端已安裝 Node.js、npm 和 MySQL
2. 將此專案clone到本地端
3. 安裝相關套件
```
npm install
```
4. 新增 temp 和 upload 資料夾
5. 參考 env.example 建立 .env
6. 若作業系統為 Windows 請先安裝 cross-env 套件，並修改腳本如下
```
 "scripts": {
    "start": "cross-env NODE_ENV=development node app.js",
    "dev": "cross-env NODE_ENV=development nodemon app.js",
    "test": "mocha test --exit --recursive --timeout 5000"
  }
```
7. 新增種子資料
```
npx sequelize db:migrate
npx sequelize db:seed:all
```
此步驟將產生一組管理者資料及五組用戶資料
```
1. 管理者
account root 
email root@example.com
password 12345678

2. 用戶一
name user1
email user1@example.com
password 12345678
```
8. 運行專案
```
npm run start
```
若有安裝nodemon可使用以下指令運行專案
```
npm run dev
```
