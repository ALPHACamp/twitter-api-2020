# Simple Twitter API

## 介紹

提供開發者可以串接多種功能的 API，接收特定 JSON 格式的 request，並回傳特定 JSON 格式的 response

## 功能

詳細功能說明可參考[ API 文件](https://nutritious-sun-1c3.notion.site/223aa71d1aad49c2938ed3e889eb593a?v=4717636d2df548588ffbed67d4884eec)
- 使用者註冊功能 API
- 使用者登入功能 API
- 修改使用者本身的資訊 API
- 特定使用者資訊 API
- 特定使用者發過的推文 API
- 特定使用者發過的回覆 API
- 特定使用者喜歡的推文 API
- 特定使用者跟隨中的人 API
- 特定使用者的跟隨者 API
- 跟隨者數量前 10 的推薦跟隨名單 API
- 特定推文 API
- 特定推文的全部回覆 API
- 全部推文 API
- 新增推文 API
- 新增特定推文的回覆 API
- 跟隨特定使用者 API
- 取消跟隨特定使用者 API
- 喜歡特定推文 API
- 取消特定喜歡的推文 API
- 管理者登入 API (僅供管理者使用)
- 全部推文 API (僅供管理者使用)
- 刪除特定推文 API (僅供管理者使用)
- 全部使用者 API (僅供管理者使用)


## 開始使用

1. 請先確認有安裝 Node.js 、 npm 、 MySQL 與 MySQL Workbench
2. 開啟終端機，到欲存放專案的路徑下，將專案 clone 到本地，輸入：

   ```bash
   git clone https://github.com/realyutou/twitter-api-2020.git
   ```
   
3. 安裝相關套件，輸入：

   ```bash
   npm install
   ```
   
4. 安裝 nodemon，輸入：

   ```bash
   npm i -g nodemon
   ```

5. 新增 .env 檔案，設定環境變數，詳細內容可參考 .env.example
   
6. 開啟 MySQL Workbench，建立資料庫，輸入：

   ```SQL
   create database ac_twitter_workspace;
   ```

7. 開啟終端機，建立資料表，輸入：

   ```bash
   npx sequelize db:migrate
   ```

8. 載入種子資料，輸入：

   ```bash
   npm run seed
   ```
   
9. 執行專案，輸入：

   ```bash
   npm run dev
   ```

10. 在終端機看見以下訊息代表順利執行

     ```bash
     Example app listening on port 3000!
     ```

11. 終止伺服器
    
     ```bash
     ctrl + c
     ```

12. 若要開放給其他網域的開發者串接 API，可部署至雲端伺服器，以下操作以部署到 Heroku 為例：

13. 開啟終端機，登入 Heroku，輸入：

     ```bash
     heroku login
     ```

14. 瀏覽器跳出登入頁面，登入 Heroku

15. 返回終端機，建立 Heroku 專案，輸入：

     ```bash
     heroku create
     ```

16. 開啟 Heroku 專案設定頁面，新增連線遠端資料庫與 JWT_SECRET 的環境變數

17. 修改 config.json 檔案：

     ```json
     "production": {
      "use_env_variable": "<連線遠端資料庫的環境變數>"
     }
     ```

18. 將本地專案推上 Heroku，輸入：

     ```bash
     git push heroku <主要分支名稱>
     ```

19. 啟動 Heroku 上的專案，輸入：

     ```bash
     heroku ps:scale web=1 -a <Heroku 專案名稱>
     ```

20. 開啟應用程式，利用網址即可對其他網域提供 API 接口


## 開發工具

- Node.js - 執行環境
- Express - Web 應用程式後端框架
- CORS - 跨網域發送請求套件
- Passport - 驗證機制套件
- JSON Web Token - 發送憑證套件
- Sequelize - 非同步 ORM 框架
- Dotenv - 設定環境變數套件
- ESLint - 定義程式碼風格套件
