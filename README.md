# Simple Twitter

## 簡介

本專案作為 AC Simple Twitter 的後端 Web API 專案，提供使用者推文、回覆，對喜歡的推文按愛心，追蹤其他使用者等功能。

前端畫面請參考：https://github.com/ailsayang999/my-simple-twitter

## 環境建置

使用 Ｎode.js 的 express 作為框架； MySQL Workbench 作為資料庫儲存資料；其他相關套件請見 package.json 檔案

## 主要功能

### 前台使用者

使用者註冊登入後，可查看其他使用者的推文、發佈推文、對喜歡的推文按愛心、回覆某一則推文、觀看其他使用者追蹤以及被追蹤名單，還可以瀏覽推薦追蹤名單。

```
使用者帳號：user1
使用者email: user1@example.com
使用者密碼：12345678
```

### 後台管理者

管理者（admin）可以查看平台內所有使用者的暱稱、帳號、推文總數、被按讚次數、被多少人追蹤以及追蹤了多少人，也能瀏覽所有推文、刪除某一則推文。
```
管理者帳號：root
管理者email: root@example.com
管理者密碼：12345678
```

## 檔案執行

1. 請先確保 local 端有安裝 Node.js、MySQL Workbench 及 npm。

2. 將本專案下載至本地存放後，在專案內新增 temp 和 upload 資料夾（用以管理暫存圖片使用）， 再將 .env.example  檔案改名成  .env ，並根據檔案中使用到的環境變數名稱填入相應的資料。

3. 在終端機輸入以下指令，一次安裝所有套件

```
npm install
```
4. 確認與 MySQL workbench 資料庫連線

5. 可根據 package.json 中的預設指令執行本檔案

6. 若出現以下訊息，代表可正式運作本專案

```
Example app listening on port 3000!
```

7. 若需要使用本專案的種子資料，請依序輸入：

```js
  // 生成種子資料
  npx sequelize db:migrate
  npx sequelize db:seed:all
```

此種子資料會生成假使用者、假推文、假回覆，以及追蹤和按讚等使用者關聯的假資料

