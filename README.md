# twitter-api

本專案為開發推特的後端API服務，使用nodeJS與express框架，並使用MySQL資料庫
前端開發者可向本服務請求資料，包含用戶註冊、登錄、發布推文、追蹤其他用戶、查看推文等功能。
API使用方式請查看我們撰寫的[API文件](https://lime-quokka-29b.notion.site/API-4e6a515faffe40f895ea28a7b2fe126c)

## 目錄

- [環境建置](#環境建置)
- [使用方式](#使用方式)
- [套件版本](#套件版本)
- [開發人員](#開發人員)

## 環境建置

0. 請先安裝 [Node.js](https://nodejs.org/en/) 與 [MySQL workbench](https://www.mysql.com/)

1. 在電腦上打開terminal，並Clone至本機，再移動至專案資料夾
```
git clone https://github.com/Chingsan0722/twitter-api-2020.git
cd twitter-api-2020
```

2. 使用npm安裝所需的套件：
```
npm install
```

3. 若您的電腦尚未安裝nodemon，請先輸入指令進行安裝，以便在開發環境中運作
```
npm install nodemon
```
4. 新增.env 並依照 .env.example填入必要資訊

5. 開啟 $config/config.json，並在MySQL Workbench中建立一個新的資料庫
   並確認development環境設置與MySQL Workbench的設定一致

6. 載入 migration 與 seeder
   透過以下指令將資料表寫入資料庫
```
npx sequelize db:migrate
npx sequelize db:seed:all
```

## 使用方式
1. 透過以下的指令在本地進行twitter-api測試

```
npm run dev
or
npm run start
```

2. 確認app正常運作
```
Example app listening on port 3000!
```

3. 使用[Postman](https://www.postman.com/)進行api request test

4. 若您依照先前步驟完成seeder載入，將會得到預設的種子帳號及密碼
   admin
    account: root
    password: 12345678

   user1
    account: user1
    password: 12345678


## 套件版本

本專案使用了以下的套件：
請注意，版本使用不同有可能造成錯誤
Node.js @14.16.0

- bcryptjs: "^2.4.3"
- body-parser: "^1.18.3"
- chai: "^4.2.0"
- connect-flash: "^0.1.1"
- cors: "^2.8.5"
- dotenv: "^10.0.0"
- express: "^4.16.4"
- express-session: "^1.15.6"
- faker: "^4.1.0"
- imgur: "^1.0.2"
- jsonwebtoken: "^8.5.1"
- method-override: "^3.0.0"
- mocha: "^6.0.2"
- multer: "^1.4.3"
- mysql2: "^1.6.4"
- passport: "^0.4.0"
- passport-jwt: "^4.0.0"
- passport-local: "^1.0.0"
- sequelize: "^6.18.0"
- sequelize-cli: "^5.5.0"
- sinon: "^10.0.0"
- sinon-chai: "^3.3.0"

開發使用套件：

- eslint: "^8.42.0"
- eslint-config-standard: "^17.1.0"
- eslint-plugin-import: "^2.27.5"
- eslint-plugin-n: "^16.0.0"
- eslint-plugin-promise: "^6.1.1"
- proxyquire: "^2.1.3"
- sequelize-test-helpers: "^1.4.2"
- supertest: "^3.3.0"

### 開發人員

- [Ching](https://github.com/Chingsan0722)
- [Ben](https://github.com/Banwind)

### 前端 Demo
- [Simple-twitter](https://rubytzu.github.io/simple-twitter/)