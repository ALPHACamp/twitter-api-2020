# Simple Twitter團隊專案(Backend)
復刻打造簡易的twitter功能
+ 前端專案 - https://github.com/jolinhappy/twitter-project-2020-frontend
+ 後端專案 - https://github.com/LIN-CHANG-YI/twitter-api-2020-backend
+ 後端heroku - https://simple-twitter-project.herokuapp.com
# 專案功能
+ 註冊成為一般使用者即可使用該網站
+ 一般使用者可以發佈貼文
+ 一般使用者可以回覆貼文
+ 一般使用者可以喜歡/取消喜歡貼文
+ 一般使用者可以追蹤/取消追蹤其他使用者
+ 一般使用者可以修改個人帳戶與編輯個人資料
+ 一般使用者可以造訪其他使用者個人主頁面
+ 管理員可以刪除任何一篇貼文
+ 管理員可以查看所有使用者資訊
# 啟動方式
1. 下載專案至本地
```
git clone https://github.com/LIN-CHANG-YI/twitter-api-2020-backend.git
```
2. 進入專案資料夾後輸入
```
npm install
```
3. 新增.env檔加入
```
JWT_SECRET=自行輸入
IMGUR_CLIENT_ID=自行輸入
PORT=3000
```
4. Workbench設置資料庫後，依序執行
```
npx sequelize db:migrate
npx sequelize db:seed:all
```
5. 啟動Server
```
nodemon app.js
or
node app.js
```
6. 終端機顯示即成功啟動
```
Example app listening on port 3000!
```
# 測試帳號
| 帳號 | 密碼 |
| :---:| :--------:|
| root | 12345678 |
| user1 | 12345678 |
| user2 | 12345678 |
| user3 | 12345678 |
| user4 | 12345678 |
| user5 | 12345678 |
# 開發環境
+ Node.js: v10.15.0
+ bcryptjs: v2.4.3
+ body-parser: v1.18.3
+ chai: v4.2.0
+ cor: v2.8.5
+ dotenv: v8.2.0
+ express: v4.16.4
+ express-handlebars: v3.0.0
+ express-session: v1.15.6
+ faker: v4.1.0
+ imgur-node-api: v0.1.0
+ jsonwebtoken: v8.5.1
+ method-override: v3.0.0
+ mocha: v6.0.2
+ multer: v1.4.2
+ mysql2: v1.6.4
+ passport: v0.4.0
+ passport-jwt: v4.0.0
+ passport-local: v1.0.0
+ pg: v8.3.3
+ sequelize: v4.42.0
+ sequelize-cli: v5.5.0
+ sinon: v7.2.3
+ sinon-chai: v3.3.0
# 開發人員
+ [LIN-CHANG-YI](https://github.com/LIN-CHANG-YI)
+ [Ezra Tsai](https://github.com/EzraTsai)
