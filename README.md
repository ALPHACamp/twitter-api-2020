# 簡易推特 API

一個後端 API 伺服器，提供類似 Twitter 的社群媒體服務功能，例如發佈推文、點讚、或是追隨等動作，主要使用技術包含 Node.js + Express + passport + bcryptjs + Sequelize。


## 功能描述

登入註冊

- 一般使用者註冊
- 一般使用者登入
- 管理者登入

推文功能

- 新增推文、或是回覆推文資訊
- 查詢推文、以及推文回覆資訊
- 可對推文點讚、收回點讚動作

使用者功能

- 可修改自己的帳號密碼、或大頭貼、封面和簡介
- 查詢使用者的詳細資料
- 查詢使用者的推文歷史
- 查詢使用者的按讚歷史
- 查詢使用者的追蹤與被追隨名單

追隨功能

- 可對其他使用者進行追隨
- 可對其他使用者取消追隨

後台功能

- 顯示所有使用者清單
- 顯示所有推文清單
- 刪除推文資訊


## 環境建置需求

- [Node.js 14.16.0](https://nodejs.org/en/)
- Terminal | CMD | [Git Bash](https://gitforwindows.org/)
- [MySQL Community Server 8.0.15](https://downloads.mysql.com/archives/installer/)
- MySQL Workbench 8.0.15


## 安裝步驟

1. 打開終端機或是Git Bash，移動到指定路徑 ( 以 windows 桌面 為例 )

```text
cd C:\Users\'使用者名稱'\Desktop
```

2. 下載 twitter-api-2020 專案到本地電腦上

```text
git clone https://github.com/Richie-Yang/twitter-api-2020.git
```

3. 進入 twitter-api-2020 資料夾

```text
cd twitter-api-2020
```

4. 位於 twitter-api-2020 資料夾裡面，執行以下指令安裝必須套件

```text
npm install
```

5. 位於 twitter-api-2020 資料夾裡面，建立 .env 檔案，內容可以參考 .env.example 檔案

```text
PORT=3000
SESSION_SECRET="輸入隨機字串"
```

6. 執行資料庫的遷徙檔案 ( `須先確定 MySQL 已啟動` )

```text
npx sequelize db:migrate
```

7. 執行資料庫的種子檔案 ( `須先確定 MySQL 已啟動` )，請勿重複執行

```text
npx sequelize db:seed:all
```


## 執行步驟

1. 執行專案 ( 伺服器啟動後會顯示 `Example app listening on port 3000!` )

```text
npm run start
```

2. 開啟瀏覽器輸入網址 <http://localhost:3000> 或是 <http://127.0.0.1:3000>

3. 使用測試帳號登入

root (這個帳號只能使用於後台)

```text
account : root
password : 12345678
```

user1 (這個帳號只能使用於前台)

```text
account : user1
password : 12345678
```

## 參與專案協作者
- [靜易](https://github.com/z88243310)
- [Richie](https://github.com/Richie-Yang)


更新時間 : 2021.02.28