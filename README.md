# Simple Twitter

---

## 簡介

本專案作為 simple-twitter 的後端專案，提供的API涵蓋使用者推文、回覆，對喜歡的推文按愛心，追蹤其他使用者等互動功能。並且使用 node.js 環境下的 express 作為框架、使用 MySQL 儲存資料。

前端畫面請參考：

---

## 主要功能

以下針對本專案所設計的 API 進行描述。

### 前台使用者可以做什麼？

使用者註冊登入後，會得到 member 身分。即有權限可以查看其他使用者的推文及個人資料，還可以發佈推文、對喜歡的推文按愛心、回覆某則推文以及對其他使用者做追蹤等互動。

使用者還可以在首頁的右側看到推薦追蹤名單（此名單按追蹤人數進行排名）。

### 後台管理者可以做什麼？

管理者（admin）可以查看平台內所有使用者及所有推文資料，也可以刪除某篇推文。

---

## 開發工具

- Node.js 14.16.0
- 其他 Node.js 環境下的套件（如：Express 4.16.4）請參考 package.json

---

## 如何執行？

環境建置主要分為MySQL安裝及部署、本專案的安裝兩部分，詳細步驟請參考下方說明。

### MySQL 安裝及部署

**MySQL 安裝：如果你已經安裝，請跳過。實作本專案時，我們使用的版本是8.0.15。**

- macOS
  1. 請先根據你的作業系統至官方下載對應的安裝檔，下載過程中可能會出現官方廣告，請忽略並繼續下載即可 ：<https://dev.mysql.com/downloads/mysql>。

  2. 上一步完成後，請找到安裝檔並執行，在安裝過程中會跳出軟件許可協議，點擊 Agree 來同意軟件許可協議。

> Windows 系統下載完成後，執行 mysql-installer-community-8.0.15.0.msi，進入安裝精靈，一路按同意往下。中間需要選擇完成「完整版 (Full)」，這裡會一併把 MySQL Workbench 安裝好。

4. 在安裝過程中會出現 Use Strong Password Ecryption 以及 Use Legacy Password Encryption, 選擇 Use Legacy Password Encryption，然後點擊 Next。

> Windows 系統請留意：
（1）在 Check Requirements 點擊 Next 時，可能會出現相關編輯器軟體未達標準規格的提醒視窗。在這裡我們先點選 Yes。
（2）點選 Execute 執行安裝。完成後點擊 Next ，進到 Product Configuration 後，再次點擊 Next。
（3）一直點 NEXT 直到進入到 Type and Networking 設定，請選擇 Development Computer，將 TCP/IP 和 Open Windows Firewall ports for network access，再次點擊 Next。
（4）確保你選擇 Use Legacy Authentication Method \*，然後點擊 Next。

5. 創建 root 密碼，安裝完成並啟動 MySQL Workbench，點擊 MySQL 圖標後，會秀出資料庫伺服器的狀態。一開始進來伺服器會是「停用」的狀態，請點擊 Start MySQL Server 啟動你的伺服器。當圈圈變成綠色，且按鈕變成 Stop MySQL Server，就代表現在 MySQL 已經啟用。

6. 檢查有沒有需要補充的地方

**MySQL 部署**

1. 打開 MySQL Workbench，在首頁上點選 MySQL Connections 旁的「＋」開始建立連線。

2. 請輸入以下內容：

> Title: Local instance 3306
Hostname: localhost
Port: 3306
Username: root
Password: password

3. 上一步都輸入完成後，按下 OK，你會看到 Workbench MySQL Connections 的下方出現了我們剛剛新增的 Local instance 3306。

4. 點擊剛才建立好的 Local instance 3306 來啟動連線，我們會先被要求登入 MySQL server，請使用剛剛設定的 Username 和 Password 登入，這樣就完成了 MySQL Workbench 的基本安裝與設定，並且與本機的 MySQL server 連線。

5. 若你想使用本專案的種子資料，請在剛才建立的 Local instance 3306 中新增資料庫，直接輸入以下 SQL 語法並按下閃電符號執行該語法，再按下位於 SCHEMA 右側的重新整理，你應該要看到 ac_twitter_workspace 這個資料庫：

> create database ac_twitter_workspace;

## 本專案的安裝使用

1. 請先確保本地有安裝 Node.js 、 MySQL Workbench 及 npm。

2. 將本專案下載至本地存放後，在專案內新增 temp 和 upload 資料夾（用以管理暫存圖片使用）。再把  .env.example  檔案改名成  .env ，並根據檔案中提供的變數名稱，填入相應的值。

3. 請使用終端機，並移至存放本專案的位置。

> cd 存放本專案的位置

4. 在終端機輸入以下內容，安裝與本專案相關的套件：

> npm install

5. 請打開 package.json 檔案，根據你的作業系統確認scripts中的指令是否能在你的作業系統或是終端機上使用，以下提供簡單示例：

```js
// macOS
  "scripts": {
    "start": "NODE_ENV=development node app.js",
    "dev": "NODE_ENV=development nodemon app.js"
  }
// windows：若你使用 Cmder 等模擬 Linux 指令的套件請留意
  "scripts": {
    "start": "set \"NODE_ENV=development\" && node app.js",
    "dev": "set \"NODE_ENV=development\" && nodemon app.js"
  }
```

6. 待上一步確認完成後，再輸入：

```js
// 如果你想使用我們的專案繼續開發
npm run dev
// 如果你只是想要試用我們的專案
npm run start
```

7. 待上一步完成後，終端機若提示如下，表示伺服器已開始運行：

> This server is listening on port 3000!

8. 如果你想暫停使用，請在終端機輸入 ctrl^c 即可。

9. 如有需要使用本專案的種子資料，請依序輸入：

```js
// 生成種子資料
npx sequelize db:migration
npx sequelize db:seed:all
```

該種子資料會生成一位管理者和十位一般使用者，以下列出管理者及一位使用者帳號供試用，其他詳細訊息請查看資料庫：

> （1）管理者帳號：root，管理者密碼：12345678
（2）使用者帳號：user1，使用者密碼：12345678

```js
// 補充：若生成種子資料有問題，你也可以使用以下指令將資料庫內的資料全部清除再重新生成
npx sequelize db:migrate:undo:all
```
