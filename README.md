## 介紹
<ul>
  <li>以 twitter 規格發想的簡易 simple twitter 專案</li>
<li>分別以 Vue.js 打造前端使用者介面，後端使用 Node.js 搭配 Express 框架建構，使用關連式資料庫 mysql 作為 database</li>
<li>使用者可以在專案中發布推文、留言、按讚、追蹤使用者，管理者則能夠在後台管理所有使用者以及留言。</li>
<li>本 repository 為專案後端 repository</li>
</ul>

## 圖片範例
### 登入頁
![image](https://github.com/Kate-Chu/twitter-api-2020/blob/master/public/signin.png)
### 一般使用者首頁
![image](https://github.com/Kate-Chu/twitter-api-2020/blob/master/public/index_new.png)
### 一般使用者 Profile 頁
![image](https://github.com/Kate-Chu/twitter-api-2020/blob/master/public/profile_new.png)

## API 文件
[api 文件](https://immediate-drifter-dfc.notion.site/API-51e9e3d8b43b47259127a719f9d6c011)

## 產品功能
1. 使用者可以註冊個人帳號，並使用個人帳號登入，編輯個人資料，包括名稱、帳號、密碼、email、介紹、個人顯示圖片及背景圖片。
2. 使用者可以發布自己的文字推文訊息。
3. 使用者可以瀏覽其他使用者的推文訊息，對推文新增回覆、按讚。
4. 使用者可以追蹤其他使用者或取消追蹤。
5. 使用者可以瀏覽其他使用者個人介紹頁面，瀏覽對方的歷史推文、留言、按讚的內容、追蹤中的使用者及追蹤該名使用者的清單。
6. 後台管理者可以瀏覽所有使用者以及所有發布的推文，並且管理者能夠刪除推文。
7. 所有使用者的帳戶密碼經過雜湊處理存入資料庫，以提高安全性。

## 雲端部署
> [完整專案](https://irene289.github.io/twitter-front-end-vue/#/signin)<br>
> 前端部署於 Github Page <br>
> 後端伺服器部署於 Heroku ，雲端資料庫則使用 Cleardb 儲存

## 專案後端開發人員
> [Kate-Chu](https://github.com/Kate-Chu)<br>
> [yanpin0524](https://github.com/yanpin0524)

## 專案前端開發人員
> [SeijoHuang](https://github.com/SeijoHuang)<br>
> [IreneLIU](https://github.com/Irene289)

## 完整專案本地安裝流程

1. 請確認電腦已經安裝 Node.js、npm 與 Mysql workbench
2. 打開終端機，輸入以下指令將此專案 clone 到本地
```
git clone https://github.com/Kate-Chu/twitter-api-2020
```
3. 終端機移動至專案資料夾，輸入指令安裝套件
```
cd 專案資料夾
npm install
```
4. 安裝完畢後，請開啟 Mysql Workbench，進入資料庫後，輸入以下指令建立資料庫
```
CREATE DATABASE ac_twitter_workspace;
```
5. 打開 config 資料夾內的 config.json 檔案，確認 development 資料庫環境設定與本機資料相符
```
  "development": {
    "username": "資料庫使用者帳號",
    "password": "資料庫密碼",
    "database": "ac_twitter_workspace",
    // ...
  },
```
6. 在終端機依序輸入以下內容，建立相關資料表以及種子資料
```
npx sequelize db:migrate
npx sequelize db:seed:all
```
7. 新增 .env 檔案，根據 .env.example 補足所需變數設定
```
SESSION_SECRET=自訂加密salt
JWT_SECRET=自訂加密salt
IMGUR_CLIENT_ID=可使用的 Imgur id
GITHUB_PAGE=前端頁面網址（如果使用本地 Vue page，則不需加入此項）
```
8. 當種子資料建立完畢後，請繼續輸入以下內容，開始運行後端伺服器
```
npm run dev
```
9. 若是跑出以下內容，代表伺服器已經成功運行了
```
Example app listening on http://localhost:3000
```
10. 開啟另一個終端機分頁，複製專案前端程式至本地
```
git clone https://github.com/Irene289/twitter-front-end-vue.git
```
11. 終端機移動至專案資料夾，輸入指令安裝套件、建立 Vue Page 以及運行前端伺服器
```
cd 專案資料夾
npm install
npm run build
npm run serve
```
12. 前端終端機若是出現下列指令表示運行成功
```
App running at:
  - Local:   http://localhost:8080/ 
  - Network: http://172.20.10.2:8080/
```
13. 確認已經使用兩個終端機頁面分別運行前端伺服器以及後端伺服器，即能使用下列網址進入專案介面，<br>
    並能使用以下模擬帳號登入及體驗網站
```
http://localhost:8080/ 
```
```
一般帳號 user1@example.com
密碼 12345678
```
```
管理員帳號 root@example.com
密碼 12345678
```
14. 要結束運行請分別在兩個終端機頁面按下 ctrl + c 即可終止程式。
15. 若要刪除資料庫，可在後端終端機輸入以下指令，即可刪除相關資料。
```
npx sequelize db:drop
```

## 後端開發工具

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
15. faker: v4.1.0
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
