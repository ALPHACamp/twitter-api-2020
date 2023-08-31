# Simple Twitter API

## 專案介紹
本專案以Node.js及express框架製作，搭配MySQL關聯式資料庫，提供Simple Twitter後端RESTful API。


## 主要功能

### 前台（使用者）
- 註冊及登入功能
- 瀏覽推文及回覆
- 發佈推文及回覆推文
- 跟隨和取消跟隨其他使用者
- 喜歡及取消喜歡推文功能
- 編輯自己的帳號與密碼等相關資訊
- 編輯自己的公開個人檔案
- 瀏覽他人頁面及其推文、回覆、喜歡的內容
- 瀏覽推薦跟隨的名單

### 後台（管理者）
- 瀏覽全站使用者列表
- 瀏覽全站使用者發佈的推文數量及推文受喜歡的數量
- 瀏覽全站使用者跟隨數中的人數及被多少人跟隨
- 瀏覽及刪除全站推文


## 測試 / 種子帳號
| Role     | Account   | Email             | Password |
| :-------:| :-------: | :---------------: | :------: |
| 前台使用者 | user1     | user1@example.com | 12345678 |
| 後台管理者 | root      | root@example.com  | 12345678 |


## 安裝及使用

### 本地基礎設置
確認本地端已安裝 Node.js 、 npm 、 Git 、 MySQL Workbench

### 資料庫連線設定
您可選擇本地資料庫或遠端資料庫作為您的 Database，使用 MySQL Workbench 在應用程式首頁建立一個新的 MySQL Connections，設定您資料庫的相關參數並建立連線：
- 伺服器位址（Host）
- 埠號（Port）
- 資料庫名稱（Database Name）
- 使用者名稱（Username）
- 密碼（Password）
 
### 開始
1. 打開terminal，輸入以下指令Clone本專案至本地
  ```
  $ git clone https://github.com/Nilney/twitter-api-2020.git
  ```

2. 進入此專案資料夾
  ```
  $ cd twitter-api-2020
  ```

3. 安裝本專案相依套件 
  ```
  $ npm install
  ```

4. 參考 `.env.example` 建立 `.env` 文件，並設置您的環境變數
  ```
  JWT_SECRET=<setting by your own>
  IMGUR_CLIENT_ID=<you imgur client id>
  ```

5. 於 `config/config.json` 文件中設定您資料庫的相關訊息

6. 在資料庫內建立資料表
  ```
  $ npx sequelize db:migrate
  ```

7. 建立種子資料
  ```
  $ npx sequelize db:seed:all
  ```

8. 輸入以下指令，快速啟動本專案
  ```
  $ npm run start
  ```
  - 種子資料含以下資料
    - 1 組管理者帳號、5 組一般使用者帳號
    - 每個使用者擁有 10 篇推文
    - 每篇推文底下有隨機 3 則留言

9. 於終端機見提示訊息\
  **Example app listening on port 3000!**\
  代表您已成功啟動本專案

10. 若要停止使用，請輸入以下指令
  ```
  ctrl + c
  ```


## API 文件
專案 [Postman連結](https://documenter.getpostman.com/view/29223126/2s9Y5Ty4mq#53591c9b-0bc5-40bb-b0f8-b63b87c41ebb)


## 開發工具
包含以下但不限於
- Node.js @
- Express @4.16.4
- mysql2 @1.6.4
- sequelize: @6.18.0
- sequelize-cli @5.5.0
- passport @0.4.0
- passport-jwt @4.0.0
- method-override @3.0.0
- imgur @1.0.2
- multer @1.4.3
- bcryptjs @2.4.3
- dayjs @1.10.6
- cors @2.8.5
- dotenv @10.0.0
- jsonwebtoken @8.5.1\
*其餘詳見檔案 package.json*


## 開發人員
[Harrison Chen](https://github.com/Harrison0502)\
[Lynn Lin](https://github.com/Nilney)