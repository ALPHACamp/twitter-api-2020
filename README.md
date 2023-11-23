# Simple Twitter API
- 這是一個類 Twtter 的社群網站，透過推文、回覆、喜歡、追蹤等功能與其他人進行互動
- 本專案採用前後分離的開發模式，並透過 RESTful 風格進行設計
  - 後端成員：[Boxun](https://github.com/boxunw), [Jenny](https://github.com/yanyanyaa)
  - 前端成員：[James](https://github.com/James-Lee-01), [雅云](https://github.com/Ya-Yun-Zheng)
  - [前端 repo](https://github.com/James-Lee-01/simple-twitter)
  - [網站入口](https://simple-twitter-eight.vercel.app)

# 功能
- 使用者可以註冊/登入帳號
- 使用者可以瀏覽所有推文
- 使用者可以回覆所有推文
- 使用者可以喜歡/收回喜歡任何推文
- 使用者可以追蹤/取消追蹤其他使用者
- 使用者可以瀏覽其他使用者的個人頁面
- 使用者可以編輯個人資料與帳戶設定
- 後台管理者可以瀏覽所有推文清單，並且快覽推文的前 50 字
- 後台管理者可以瀏覽所有使用者清單，並附有使用者社群活躍數據
- 後台管理者可以刪除任何一篇推文
# API 文件
[API List](https://documenter.getpostman.com/view/29236995/2s9Y5cu1Rv#f83c365c-642e-4f90-b6c1-185551187722)
# 安裝
1. 請先確認有安裝 node.js 與 npm
2. 打開終端機，clone 此專案
```
git clone https://github.com/boxunw/simple-twitter-api.git
```
3. 打開專案資料夾
```
cd simple-twitter-api
```
4. 安裝 npm 套件
```
npm install
```
5. 參考 .env.example 檔案，建立 .env 檔案並設定環境變數
6. 打開 /config/config.json 檔案，修改為資料庫使用的帳號密碼
```
"development": {
  "username": "<your_mysql_workbench_name>",   // 修改此處
  "password": "<your_mysql_workbench_password>",   // 修改此處
  "database": "ac_twitter_workspace",
  "host": "127.0.0.1",
  "dialect": "mysql"
},
"test": {
  "username": "<your_mysql_workbench_name>",   // 修改此處
  "password": "<your_mysql_workbench_password>",   // 修改此處
  "database": "ac_twitter_workspace_test",
  "host": "127.0.0.1",
  "dialect": "mysql",
  "logging": false
},
```
7. 建立資料庫，可在 MySQL Workbench 輸入以下指令
```
create database ac_twitter_workspace;
create database ac_twitter_workspace_test;
```
8. 建立資料表
```
npx sequelize db:migrate
```
9. 建立種子資料
```
npx sequelize db:seed:all
```
10. 啟動伺服器
```
npm run dev
```
11. 當終端機出現以下字樣，表示伺服器已成功啟動
```
Example app listening on port 3000!
```
# 測試帳號
```
管理者
Account: root
Password: 12345678

一般使用者
Account: user1
Password: 12345678
```
# 自動化測試
1. 切換至測試環境
```
export NODE_ENV=test
```
2. 執行自動化測試（全部）
```
npm run test
```
3. 執行自動化測試（單一檔案）
```
npx mocha test/requests/user.spec.js --exit  // 範例
```


