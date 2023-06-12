**# Simple Twitter**

---

**## 簡介**

提供平台供使用者推文、回覆，對喜歡的留言按愛心，追蹤其他使用者等互動功能得小型社群平台

---

**## 主要功能**

作為 simple-twittter 的後端專案。使用 node.js 環境的 express 作為 web 框架、MySQL 儲存資料。

**### 使用者 API**

使用者註冊登入後，會得到 member 身分。即有權限可以查看其他使用者的推文及個人資料（但無法編輯），還可以自己推文、對喜歡的推文按愛心、回覆以及對其他使用者做追蹤等互動。

使用者可以在首頁的右邊看到前十名被追蹤最多的使用者（本人無法追蹤自己）

**### 管理者 API**

管理員（admin）可以查看所有使用者和推文資料及管理（刪除）推文。

**### JWT & Session/cookie**

登入成功時時產生 JWT token，方便前端 react app 取得使用者資料，減少與伺服器連線次數。預設為 30 天。

---

**## 如何執行**

**### 環境建置**

1. 把  .env.example  改名成  .env。打開檔案填入等號後面的值。

2. $ npm install：安裝所需套件。

3. $ SQL

---

**## 開發工具**

- Node.js 14.16.0
- Express 4.16.4
- SQL 資料庫（MySQL Workbench 8.0.16)

---

**## MySQL 安裝及部署**

**### MySQL 安裝**

1. 請先至官方下載頁 ：https://dev.mysql.com/downloads/mysql 下載。

2. OS 系統請在頁面下方找到 macOS 10.14（x86,64-bit), DMG Archive，點擊 Download 按鈕

> Windows 系統請到 https://downloads.mysql.com/archives/installer/ 找到 Windows (x86, 32-bit), MSI Installer(mysql-installer-community-8.0.15.0.msi)

3. 在安裝過程中會跳出軟件許可協議點擊 Agree 來同意軟件許可協議

> Windows 系統下載完成後，執行 mysql-installer-community-8.0.15.0.msi，進入安裝精靈，一路按同意往下。中間需要選擇完成「完整版 (Full)」，這裡會一併把 MySQL Workbench 安裝好

4. 在安裝過程中會出現 Use Strong Password Ecryption 以及 Use Legacy Password Encryption, 選擇 Use Legacy Password Encryption，然後點擊 Next

> Windows 系統在 Check Requirements 點擊 Next 時，可能會出現相關編輯器軟體未達標準規格的提醒視窗。在這裡我們先點選 Yes。

> Windows 系統點選 Execute 執行安裝。完成後點擊 Next ，進到 Product Configuration 後，再次點擊 Next。

> Windows 系統一直點 NEXT 直到進入到 Type and Networking 設定，請選擇 Development Computer，將 TCP/IP 和 Open Windows Firewall ports for network access，再次點擊 Next。

> Windows 系統確保你選擇 Use Legacy Authentication Method \*，然後點擊 Next

5. 創建 root 密碼，安裝完成並啟動 MySQL Workbench，點擊 MySQL 圖標後，會秀出資料庫伺服器的狀態。一開始進來伺服器會是「停用」的狀態，請點擊 Start MySQL Server 啟動你的伺 器。當圈圈變成綠色，且按鈕變成 Stop MySQL Server，就代表現在 MySQL 已經啟用。

**### MySQL 部署**

1. 點選 MySQL Connections 旁的「＋」開始建立連線。

2. 輸入以下內容：

Title: Local instance 3306
Hostname: localhost
Port: 3306
Username: root
Password: password

3. 點擊 OK，你會看到 Workbench MySQL Connections 的下方出現了我們剛剛新增的 Local instance 3306。

4. 點擊新建好的 Local instance 3306 來啟動連線，首先會被要求登入 MySQL server，使用 root/password 登入，就完成了 MySQL Workbench 的基本安裝與設定，並成功與本機的 MySQL server 連線了

---

**## 如何安裝使用**

1. 請先確保本地有安裝 Node.js 、 MySQL Workbench 及 npm。

2. 將本專案下載至本地存放，並在專案內新增 temp 和 upload 資料夾（用以管理暫存圖片使用）。

3. 請使用終端機，並移至存放本專案的位置。

> cd 存放本專案的位置

4. 輸入以下內容，安裝與本專案相關的套件：

> npm install

5. 待上一步安裝完成後，再輸入：

> npm run start

6. 待上一步完成後，終端機會提示如下，請將後方網址複製到瀏覽器上進行瀏覽。

> This server is running on <http://localhost:3000>

7. 如果想暫停使用，請在終端機輸入 ctrl^c，並關閉瀏覽器即可。
