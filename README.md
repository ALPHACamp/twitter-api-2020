# Alphitter api server
---
## 這是什麼？
這是Alpha Camp的團體專案：Simple Twitter，模擬Twitter的簡化版Twitter。
是存放作為前端串接資料、進行database操作的路由的repository。

---
## 有哪些功能？
* 管理者方面
  1. 登入
  2. 瀏覽使用者清單
  3. 刪除使用者推文
* 使用者方面
  1. 註冊與登入
  2. 瀏覽使用者資訊
     (1) 瀏覽目前使用者的資訊
     (2) 瀏覽其他使用者的推文、回覆、喜歡與追蹤等清單
     (3) 瀏覽前十名最多人追蹤的清單
  3. 使者者互動
     (1) 編輯目前使用者的資訊
     (2) 對推文進行發布、回覆與喜歡的動作
     (3) 對其他使用者進行追蹤與小鈴鐺的開啟和取消的行為
---
## 具有哪些內容？
* 資料庫
  * config/config.js：設定對應本機SQL的username, password與database名稱
  * migrations：建立各個Model的Table時，預設之變數與資料型態
  * models：各個Model的變數與資料型態，及其與其他Model的關聯性
* 路由
  * config/passport.js：登入的驗證功能之設定
  * controllers/api：回傳來自services送來的資料或狀態
  * route/api.js：路由列表
  * services：每條路由所對應之database的CRUD
* 套件與其他
  * package.json：本repository所使用的套件和執行設定

---
## 怎麼使用？
1. 下載repository
 ```git clone -b master git@github.com:jadokao/twitter-api-2020.git```
2. 進入資料夾，進行套件下載
   ```npm install```
3. 建立檔案：*.env*，並參考檔案：*.env.example*，放入環境變數
4. 至資料夾*config*裡的*config.json*，修改環境*development*內的*username*與*password*和本機的SQL資訊相符
5. 到SQL Workbench，輸入指令來建立database
   ```create database ac_twitter_workspace;```
6. 建立Model的Table至database
   ```npx sequelize db:migrate```
7. 載入種子檔
 ``` npx sequelize db:seed:all```
7. 建立資料夾：*temp*和*upload*
8. 輸入指令，運行server
 ```npm run dev```
##### 注意事項
* 如果是使用windows系統，需要到檔案：*package.json*，找到*scripts*下的*dev*，把內容改成：
  ```nodemon app.js```
---
## 測試用帳號
* 前台測試帳號
  * account：user1
  * email：user1@example.com
  * password：12345678
* 後台測試帳號
  * account：root
  * email：root@example.com
  * password：12345678