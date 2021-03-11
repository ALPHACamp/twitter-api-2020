# 復刻板簡易Twitter專案
## 說明
本專案復刻Twitter版面，並實現核心基本功能。

專案展示: https://csyhd.github.io/twitter_test/  
前端專案: https://github.com/judychen117/twitter2.0.git  
後端專案: https://github.com/Subaruuuu/twitter-api-2020  

## 功能

#### 前台
1. 使用者可以註冊/登入
2. 使用者可以發表推文
3. 使用者可以回覆推文
4. 使用者可以對推文按喜愛/取消喜愛
5. 使用者可以追隨/取消追隨其他使用者
6. 使用者可以造訪其他使用者頁面
7. 使用者可以編輯個人資料
#### 後台
1. 管理員可以查看所有使用者
2. 管理員可以查看所有推文
3. 管理員可以刪除推文

## 啟動專案
1. 下載專案  
```
git clone https://github.com/Subaruuuu/twitter-api-2020.git 
```

2. 進入專案資料夾  
```
cd twitter-api-2020
```
3. 載入npm
```  
npm install  
```
4. 自行新增.env 並輸入
```
IMGUR_CLIENT_ID=自行帶入
JWT_SECRET=自行設定
```
5. 使用Workbench設置資料庫
```
create database ac_twitter_workspace;
create database ac_twitter_workspace_test;
```
6.進行migrate
```
npx sequelize db:migrate
```
7. 載入種子資料
```
npx sequelize db:seed:all
```
8. 啟動server
```
npm run dev
```
顯示 Example app listening on port 3000! 即代表連線成功。

## 開發環境
* Node.js: ^10.15.0
* bcrypt-nodejs: ^0.0.3,
* bcryptjs: ^2.4.3,
* body-parser: ^1.18.3,
* chai: ^4.2.0,
* connect-flash: ^0.1.1,
* cors: ^2.8.5,
* dotenv: ^8.2.0,
* express: ^4.16.4,
* express-handlebars: ^3.0.0,
* express-session: ^1.15.6,
* faker: ^4.1.0,
* imgur: ^0.3.2,
* imgur-node-api: ^0.1.0,
* jsonwebtoken: ^8.5.1,
* method-override: ^3.0.0,
* mocha: ^6.0.2,
* multer: ^1.4.2,
* mysql2: ^1.6.4,
* passport: ^0.4.0,
* passport-jwt: ^4.0.0,
* passport-local: ^1.0.0,
* sequelize: ^4.42.0,
* sequelize-cli: ^5.5.0,
* sinon: ^7.2.3,
* sinon-chai: ^3.3.0,
* swagger-ui-express: ^4.1.6

## 開發人員
[Oscar](https://github.com/Subaruuuu)  
[Wei](https://github.com/YINWEIHSU)
