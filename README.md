## 介紹
在 Alphitter 上認識各式各樣的人，
為自己的生活留下足跡，與其他人互動、留言、按讚，拓展自己的社交圈吧！

## API 文件
[api 文件](https://immediate-drifter-dfc.notion.site/API-51e9e3d8b43b47259127a719f9d6c011)

## 產品功能
1. 使用者可以註冊個人帳號，並使用個人帳號登入，編輯個人名稱、帳號、email、介紹、個人顯示圖片及背景圖片。
2. 使用者可以發布自己的文字推文訊息。
3. 使用者可以瀏覽其他使用者的推文訊息，對推文新增回覆、按讚。
4. 使用者可以追蹤其他使用者或取消追蹤。
5. 使用者可以瀏覽其他使用者個人介紹頁面，瀏覽對方的歷史推文、留言、按讚的內容、追蹤中的使用者及追蹤該名使用者的清單。
6. 後台管理者可以瀏覽所有使用者以及所有發布的推文，並且管理者能夠刪除推文。
7. 所有使用者的帳戶密碼經過雜湊處理存入資料庫，以提高安全性。

## 雲端部署
> [完整專案](https://irene289.github.io/twitter-front-end-vue/#/signin)<br>
> 前端部署於 Github Page
> 後端伺服器部署於 Heroku ，雲端資料庫則使用 Cleardb 儲存

## 專案後端開發人員
> [Kate-Chu](https://github.com/Kate-Chu)<br>
> [yanpin0524](https://github.com/yanpin0524)

## 專案前端開發人員
> [SeijoHuang](https://github.com/SeijoHuang)<br>
> [IreneLIU](https://github.com/Irene289)

## 專案安裝流程

1. 請先確認電腦已經安裝 Node.js、npm 與 Mysql workbench
2. 打開終端機，開啟資料庫，並將此專案 Clone 到本地
```
git clone https://github.com/Kate-Chu/twitter-api-2020
```
3. 終端機 cd 至專案資料夾，輸入指令安專套件
```
cd 專案資料夾
npm install
```
4. 安裝完畢後，請開啟 Mysql Workbench，進入 root 資料庫後，輸入以下指令建立資料庫
```
CREATE DATABASE ac_twitter_workspace;
```
5. 安裝完畢後，在終端機依序輸入以下內容，建立相關資料表以及種子資料
```
npx sequelize db:migrate
npx sequelize db:seed:all
```
6. 當種子資料建立完畢後，請繼續輸入以下內容，開始運行後端伺服器
```
npm run dev
```
7. 若是跑出 "Example app listening on http://localhost:3000" 代表伺服器已經成功運行了
```
http:/localhost:3000
```
8. 開啟另一個終端機分頁，複製前端程式
```
git clone https://github.com/Irene289/twitter-front-end-vue.git
```
9. 終端機 cd 至專案資料夾，輸入指令安專套件、建立 Vue Page 以及運行前端伺服器
```
cd 專案資料夾
npm install
npm run build
npm run serve
```
10. 前端終端機若是出現下列指令表示運行成功
```
App running at:
  - Local:   http://localhost:8080/ 
  - Network: http://172.20.10.2:8080/
```
11. 確認已經使用兩個終端機頁面分別運行前端伺服器以及後端伺服器，可以使用以下模擬帳號登入並開始體驗網站
```
一般帳號 user1@example.com
密碼 12345678
```
```
管理員帳號 root@example.com
密碼 12345678
```
12. 要結束運行請分別在兩個終端機頁面按下 ctrl + c 即可終止程式。
13. 若要刪除資料庫，可在終端機輸入以下指令，即可刪除。
```
npx sequelize db:drop
```

## 開發工具

1. bcryptjs: v2.4.3
2. body-parser: v1.18.3
3. chai: v4.2.0
4. cloudinary: v1.23.0
5. cors: v2.8.5
6. dotenv: v16.0.0
7. eslint: v7.32.0
8. eslint-config-standard: v16.0.3
9. eslint-plugin-import: v2.23.4
10. eslint-plugin-node: v11.1.0
11. eslint-plugin-promise: v5.1.0
12. express: v4.16.4
13. express-handlebars: v6.0.5
14. express-session: v1.15.6
15. faker": "4.1.0
16. imgur: v1.0.2
17. jsonwebtoken: v8.5.1
18. mocha: v6.0.2
19. multer: v1.4.2
20. multer-storage-cloudinary: v4.0.0
21. mysql2: v1.6.4
22. passport: v0.4.0
23. passport-jwt: v4.0.0
24. passport-local: v1.0.0
25. pg: v8.7.3
26. sequelize: v6.18.0
27. sequelize-cli: v5.5.0
28. sinon: v10.0.0
29. sinon-chai: v3.3.0
30. sqlite3: v5.0.8
