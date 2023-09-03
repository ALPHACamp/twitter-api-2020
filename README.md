#  Simple Twitter | (前後分離組) 

後端採用express開發API伺服器，前端使用react，以json格式互相傳遞資料，組成Simple Twitter的基本功能
# 功能
- 註冊/登入/登出
  - 使用者要登入才能使用網站
  - 使用者註冊重複/登入/登出失敗時，會跳出對應的錯誤提示
- 使用者
  - 使用者能在首頁瀏覽所有的推文
  - 使用者能回覆別人的推文
  - 使用者點擊貼文方塊時，能查看該則貼文的詳情與回覆串
  - 使用者可以追蹤/取消追蹤其他使用者
  - 點擊貼文中使用者頭像時，能瀏覽該使用者的個人資料及推文
  - 使用者可以在個人頁面編輯自己的名稱、介紹、大頭照和個人背景
  - 使用者可以在設定頁面編輯自己的帳號、名稱、email和密碼
  - 使用者能在首頁的右邊側邊欄，看見跟隨者數量排列前 10 的使用者推薦名單
- 後台管理
  - 管理者可以瀏覽站內所有的使用者清單，依照推文數排序由多至少
  - 管理者可以瀏覽全站的推文清單
  - 管理者可以刪除任意推文

# 環境建置
 - node.js 以及 npm
 - npm， 
 - mySQL
 - 任一種您喜歡或常用的資料庫GUI(如workbench)

# 安裝流程
1.開啟終端機將專案clone本機:
```
git clone https://github.com/mmm999xp/twitter-api-2023.git
```
2.進入存放此專案的資料夾
```
cd twitter-api-2023
```
3.環境變數設定
```
 根目錄建立一個env檔案，根據.env.example檔案的輸入示範中輸入您自己的imgur金鑰﹑jwt secret等等
```
4.建立資料庫
開啟 MySQL workbench，再連線至本地資料庫，輸入以下建立資料庫 

```
drop database if exists ac_twitter_workspace;
create database ac_twitter_workspace;

drop database if exists ac_twitter_workspace_test;
create database ac_twitter_workspace_test;
```
5.安裝 npm 套件， 將會自動安裝package.json的所有套件
```
 npm install
```
6.db:migrate 設定
```
npx sequelize db:migrate 
```
7.加入種子資料
```
npx sequelize db:seed:all 
```
8.啟動專案
```
npm run dev
```
9.使用
終端機出現下列訊息: "http://localhost:3000"
可開啟瀏覽器輸入 http://localhost:3000 使用，會出現API server started!

10.預設使用者 Seed User
- 一般使用者帳號5組 (帳號:user1﹑user2﹑user3…etc，密碼皆為12345678)
- 管理者帳號有1組 (帳號:root ，密碼:12345678)
