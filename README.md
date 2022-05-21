## 介紹
在 Alphitter 上認識各式各樣的人，
為自己的生活留下足跡，與其他人互動、留言、按讚，拓展自己的社交圈吧！

## API文件
[api文件](https://immediate-drifter-dfc.notion.site/API-51e9e3d8b43b47259127a719f9d6c011)

## 產品功能

1. 使用者可以註冊個人帳號，並使用個人帳號登入，編輯個人名稱、帳號、email、介紹、個人顯示圖片及背景圖片。
2. 使用者可以發布自己的文字推文訊息。
3. 使用者可以瀏覽其他使用者的推文訊息，對推文新增回覆、按讚。
4. 使用者可以追蹤其他使用者或取消追蹤。
5. 使用者可以瀏覽其他使用者個人介紹頁面，瀏覽對方的歷史推文、留言、按讚的內容、追蹤中的使用者及追蹤該名使用者的清單。
6. 後台管理者可以瀏覽所有使用者以及所有發布的推文，並且管理者能夠刪除推文。
7. 所有使用者的帳戶密碼經過雜湊處理存入資料庫，以提高安全性。

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

## 專案安裝流程

1. 請先安裝 Node.js、npm 與 Mysql workbench
2. 打開你的終端機，開啟資料庫，並將此專案 Clone 到本地
```
git clone https://github.com/Kate-Chu/twitter-api-2020
```
3. 之後進入專案資料夾，輸入
```
npm install
```
4. 安裝完畢後，輸入以下內容 載入種子資料
```
npm run seed
```
5. 若是跑出 "種子資料 載入結束" 代表成功，請繼續輸入以下內容 開始運行網站
```
npm run start
```
6. 若是跑出 "Example app listening on http://localhost:3000" 代表成功，現在可以輸入網址了
```
http:/localhost:3000
```
7. 可以用以下模擬帳號登入並開始體驗網站
```
一般帳號 user1@example.com
密碼 12345678
```
```
管理員帳號 root@example.com
密碼 12345678
```
8. 要結束運行請按下 ctrl + c

## 專案開發人員
> [Kate-Chu](https://github.com/Kate-Chu)<br>
> [yanpin0524](https://github.com/yanpin0524)

