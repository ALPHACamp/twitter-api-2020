# 專案名稱: twitter-api-2020

本專案主要是實現推特的後端服務，包含用戶註冊、登錄、發布推文、關注其他用戶、查看推文等功能。

## 目錄

- [安裝](#安裝)
- [使用方法](#使用方法)
- [貢獻](#貢獻)
- [許可證](#許可證)
- [聯絡資訊](#聯絡資訊)

## 安裝

首先，您需要在本地電腦上clone該repo，並使用git bash:

```
git clone https://github.com/Chingsan0722/twitter-api-2020.git
cd twitter-api-2020
```
接著，使用npm安裝專案依賴項：

```
npm install
```

## 使用方法
根據你的 package.json 文件，你有多種方式可以運行這個專案：


```
npm run start  // 生產模式
npm run dev  // 開發者模式
npm run test  // 跑測試檔
```

ESLint啟動與執行

```
npm run eslintInit // 初始化lint
npm run lint  // 啟動lint
```

## 貢獻
如果您對該專案有任何建議或想要貢獻，請隨時提交pull request或開啟issue。

## 許可證
本專案使用ISC許可證，請參見 LICENSE 文件以獲取更多信息。

## 套件依賴

本專案使用了以下的套件：

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

開發依賴：

- eslint: "^8.42.0"
- eslint-config-standard: "^17.1.0"
- eslint-plugin-import: "^2.27.5"
- eslint-plugin-n: "^16.0.0"
- eslint-plugin-promise: "^6.1.1"
- proxyquire: "^2.1.3"
- sequelize-test-helpers: "^1.4.2"
- supertest: "^3.3.0"
