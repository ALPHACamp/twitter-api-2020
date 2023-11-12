# twitter-api-2020
ALPHA Camp | 學期 3 | Simple Twitter | 自動化測試檔 (前後分離組) 
## 專案介紹
此專案為此為一個簡易的社群平臺的 API 專案，可進行推文、回覆推文等功能，後端使用 Node.js 並搭配 express.js框架做開發，並使用MySQL資料庫。


## 功能

### 前台（使用者）
- 註冊及登入功能
- 編輯自己的頁面
- 可瀏覽其他使用者的個人資料
- 追蹤和取消追蹤其他使用者
- 瀏覽全站所有推文
- 使用者可新增推文
- 瀏覽單筆推文及其回覆串
- 使用者可回覆他人的推文
- 喜歡及取消喜歡推文功能
  

### 後台（管理者）
- 登入功能
- 瀏覽全部使用者列表
- 瀏覽全站所有推文
- 可刪除任何人的推文


## 測試 / 種子帳號
| Role     | Account   | Password |
| :-------:| :-------: | :------: |
| 前台使用者 | user1     | 12345678 |
| 後台管理者 | root      | 12345678 |


## 安裝及使用

### 環境建置
確認本地端已下載
 - node.js
 - MYSQL
 - workbench

### 開始使用
1. 打開終端機(Terminal)，Clone 此專案至本機電腦
  ```
  $ git clone https://github.com/paulwu-tw/twitter-api-2020
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

6. 建立資料表
  ```
  $ npx sequelize db:migrate
  ```

7. 建立種子資料
  ```
  $ npx sequelize db:seed:all
  ```

8. 輸入以下指令，啟動本專案
  ```
  $ npm run dev
  ```
