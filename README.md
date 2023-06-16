# Simple Twitter

---

## 簡介

本專案作為 simple-twitter 的後端專案，提供的 API 涵蓋使用者推文、回覆，對喜歡的推文按愛心，追蹤其他使用者等互動功能。並且使用 node.js 環境下的 express 作為框架、使用 MySQL 儲存資料。

前端畫面請參考：https://phoenix850508.github.io/simple-twitter/login。

---

## 主要功能

以下針對本專案所設計的 API 進行描述。

### 前台使用者可以做什麼？

使用者註冊登入後，即可查看其他使用者的推文，還可以發佈推文、對喜歡的推文按愛心、回覆某則推文以及對其他使用者做追蹤等互動。使用者還可以在首頁的右側看到推薦追蹤名單（此名單按追蹤人數進行排名）。

### 後台管理者可以做什麼？

管理者（admin）可以查看平台內所有使用者的名稱、帳號、推文總數、被按讚次數、被多少人追蹤以及追蹤了多少人。管理者也能瀏覽所有推文資料，還能刪除某篇推文。

---

## 開發工具

- Node.js 14.16.0
- 其他 Node.js 環境下的套件（如：Express 4.16.4）請參考 package.json

---

## 如何執行？

環境建置主要分為 MySQL 安裝及連線、本專案的安裝這兩個部分，詳細步驟請參考下方說明。

### MySQL 安裝及連線

**MySQL 安裝：如果你的電腦已經安裝，請跳過。實作本專案時，我們使用的版本是 8.0.15。**

請先根據你的作業系統至官方下載對應的安裝檔，下載過程中可能會出現官方廣告，請忽略並繼續下載即可 ：<https://dev.mysql.com/downloads/mysql>。

1. 執行安裝檔

- macOS：
  請找到安裝檔並執行，持續點擊 Continue 開始安裝流程，在安裝過程中會跳出軟件許可協議，點擊 Agree 來同意軟件許可協議。之後點擊 Install 並輸入電腦管理員密碼允許安裝程序繼續。

- Windows：
  請找到安裝檔並執行，接下來會進入安裝精靈，請一路按同意往下。中間需要選擇完成「完整版 (Full)」，這裡會一併把 MySQL Workbench 安裝好。

2. 安裝過程中

- macOS：
  接下來請選擇 Use Legacy Password Encryption，並點選 Next。

- Windows：
  （1）在 Check Requirements 點擊 Next 時，可能會出現相關編輯器軟體未達標準規格的提醒視窗。可以先點選 Yes。
  （2）點擊 Execute 執行安裝。完成後點擊 Next ，進入 Product Configuration 後，再點選 Next。
  （3）一直點 NEXT 直至進入 Type and Networking 的設定，Config Type 請選擇 Development Computer，將 TCP/IP 和 Open Windows Firewall ports for network access 勾選起來、Port 填寫 3306、X Protocol Port 填寫 33060，再次點擊 Next。
  （4）確保你選擇了 Use Legacy Authentication Method，然後點擊 Next。

3. 設定 root 管理者密碼並完成安裝
   資料庫會自動為你創建一個 root 管理者帳號，並請你填入自訂的密碼，往後在程式碼中，當你想連線資料庫都必須要使用該密碼。

- macOS：
  輸入密碼後，請同時點選下方的「Start MySQL server once the installation is complete」。
- Windows：
  輸入密碼後請點選 Next 進入下一步 Windows Service，留意 Windows Service Name 是否為 3306，也可以預設開機時自動開啟 MySQL。接下來就一直點選 Next，直到看到 Apply Configuration 畫面，再點擊 Execute，等程式跑完即可點擊 Finish 完成安裝。（如果這時尚未安裝完成，請依指示動作，例如：持續點擊 Next、Execute 、依指令輸入的密碼）

4. 安裝完成後

- macOS：
  請到「系統偏好設定」，點擊 MySQL 圖標後，查看資料庫伺服器的狀態，目前應該會是「停用」的狀態，請點擊 Start MySQL Server 啟動你的伺服器。當圈圈變成綠色，且按鈕變成 Stop MySQL Server，就代表現在 MySQL 已經啟用。

  > macOS 請至 <https://dev.mysql.com/downloads/workbench/> 下載 MySQL Workbench，按下 .dmg 檔案並完成安裝過程，再前往 **MySQL 連線** 步驟。

- Windows：
  MySQL Workbench 會自動開啟。這時可以點擊我們剛剛建立的 Local instance 3306，並點擊 Server Status；如果出現綠色箭頭，就表示 MySQL 與 MySQL Workbench 已成功連線。

  > 若你沒有看到 Local instance 3306，請嘗試以下 **MySQL 連線** 步驟。

**MySQL 連線**

1. 打開 MySQL Workbench，在首頁上點選 MySQL Connections 旁的「＋」開始建立連線。

2. 請輸入以下內容：

> Title: Local instance 3306
> Hostname: localhost
> Port: 3306
> Username: root
> Password: password

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

5. 請打開 package.json 檔案，根據你的作業系統確認 scripts 中的指令是否能在你的作業系統或是終端機上使用，以下提供簡單示例：

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

該種子資料會生成假使用者、假推文、假回覆等等資料，以下列出一位管理者及一位使用者帳號供試用，其他詳細訊息請查看資料庫：

> （1）管理者帳號：root，管理者密碼：12345678
> （2）使用者帳號：user1，使用者密碼：12345678

```js
// 補充：若生成種子資料有問題，你也可以使用以下指令將資料庫內的資料全部清除再重新生成
npx sequelize db:migrate:undo:all
```
