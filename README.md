# README
本專案採前後分離模式開發社群網站Alphitter，後端使用 Express.js、SQL資料庫、RESTful API 設計風格來架設API伺服器，前端使用Vue.js框架。
[前端REPO](https://github.com/ShuenRachel/twitter-front-end)
[後端REPO](https://github.com/lavender0822/twitter-api-2020)

## 功能
* 使用者可註冊帳號作為登入使用
* 使用者可編輯個人資料
* 使用者能新增推文
* 使用者能在首頁瀏覽所有的推文
* 使用者能回覆別人的推文
* 使用者可以追蹤/取消追蹤其他使用者
* 使用者能對別人的推文按 Like/Unlike
* 管理者可從後台登入瀏覽全站的推文及使用者的清單

## 測試帳號
| 登入 | Email | Password |
| --- | ----- | -------- |
| 前台 | user1 | 12345678 |
| 後台 | root | 12345678 |

## 安裝專案

1. Clone 專案到本地

```
git clone https://github.com/bradychen2/twitter-api-2020.git
```
2. 進入此專案資料夾
```
cd twitter-api-2020
```
3. 安裝套件

```
npm install
```
4. 安裝MySQL並建置資料庫與config/config.json 一致

```
create database ac_twitter_workspace;
create database ac_twitter_workspace_test;
```
5. 初始化資料庫schema

```
npx sequelize db:migrate
```
6. 新增種子資料
```
npx sequelize db:seed:all
```

7. 建立.env並設置敏感資料

```
IMGUR_CLIENT_ID=
JWT_SECRET=
```

8. 啟動專案
```
npm run dev
```

## 相關套件
* bcryptjs: 2.4.3
* cors: 2.8.5
* dotenv: 10.0.0
* express: 4.16.4
* faker: 4.1.0
* imgur: 1.0.2
* jsonwebtoken: 8.5.1
* multer: 1.4.4
* mysql2: 1.6.4
* passport: 0.4.0
* passport-jwt: 4.0.0
* sequelize: 4.42.0
* sequelize-cli: 5.5.0