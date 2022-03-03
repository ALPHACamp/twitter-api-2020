# 簡易推特 API

[![Framework](https://img.shields.io/badge/Framework-Express-aliceblue.svg)](https://www.npmjs.com/package/express)
[![ORM](https://img.shields.io/badge/ORM-Sequelize-steelblue.svg)](https://www.npmjs.com/package/mysql)
[![Database](https://img.shields.io/badge/Database-MySQL-lightblue.svg)](https://www.npmjs.com/package/mysql)

此為簡易推特專案(`Simple Twitter`)專用的一個後端 API 伺服器，提供類似 Twitter 的社群媒體服務功能，例如發佈推文、點讚、或是追隨等動作，主要使用技術包含 Node.js + Express + passport + bcryptjs + Sequelize。

<span style="color: red">注意:</span> `簡易推特專案一共需要前端網頁以及後端API伺服器，而此 Github Repo 頁面為後端 Repo，如果要前往前端 Github Repo 的頁面，請看接下來的前後端協作資訊，裡面有前端 Github Repo 連結。`

<br>

- 前後端協作資訊:
  - [前端 Github Repo 連結](https://github.com/ChiaLine/Simple-Twitter)
  - [ERD 資訊連結](https://app.quickdatabasediagrams.com/#/d/BdkVRy)
  - [API 文件連結](https://app.swaggerhub.com/apis-docs/Richie-Yang/simpleTwitter/1.0.0-oas3)

<br>
<br>

## <strong>功能描述</strong>

> ### 登入註冊
>> - 一般使用者註冊
>> - 一般使用者登入
>> - 管理者登入

> ### 推文功能
>> - 新增推文、或是回覆推文資訊
>> - 查詢推文、以及推文回覆資訊
>> - 可對推文點讚、收回點讚動作

> ### 使用者功能
>> - 可修改自己的帳號密碼、或大頭貼、封面和簡介
>> - 查詢使用者的詳細資料
>> - 查詢使用者的推文歷史
>> - 查詢使用者的按讚歷史
>> - 查詢使用者的追蹤與被追隨名單

> ### 追隨功能
>> - 可對其他使用者進行追隨
>> - 可對其他使用者取消追隨

> ### 後台功能
>> - 顯示所有使用者清單
>> - 顯示所有推文清單
>> - 刪除推文資訊

<br>
<br>

## <strong>環境建置需求</strong>
- Git
  - [下載連結](https://git-scm.com/downloads) 
- Node.js 14.16.X
  - [下載連結](https://nodejs.org/dist/v14.16.0/)
- 終端機工具 Terminal、CMD、Git Bash
  - <span style="color: red">注意:</span> `只需要上述的終端機工具項目其中一個即可`
  - [Git Bash下載連結](https://gitforwindows.org/)
- MySQL Community Server 8.0.15
  - [下載連結](https://downloads.mysql.com/archives/installer/)
- MySQL Workbench 8.0.15 
  - <span style="color: red">注意:</span> `安裝 MySQL Community Server 時選擇同時安裝 Workbench`
- Imgur 第三方雲端圖片分享服務商的 API Client ID 
  - [官方網站連結](https://imgur.com/) 
  - [申請 API 步驟](https://apidocs.imgur.com/)

<br>
<br>

## <strong>安裝步驟</strong>
<br>

> 1. 請先確認本機<strong style="color: red">已經達到環境建置需求</strong>裡面的所有需求項目。

<br>

> 2. 打開終端機或是 Git Bash，下載Github的專案到本地主機。
```text
git clone https://github.com/Richie-Yang/twitter-api-2020.git
```

<br>

> 3. 進入本地專案資料夾。
```text
cd twitter-api-2020
```

<br>

> 4. 位於本地專案資料夾裡面，執行以下指令安裝必須套件。
```
npm install
```

<br>

> 5. 位於本地專案資料夾裡面，建立 .env 檔案，以下提供兩種方式進行 .env  檔案設定:
>> <ol>5-1. 方法一，本地測試可以直接使用 .env.example 內容進行 .env 檔案設定，但是IMGUR_CLIENT_ID 還是要自行補上資料。</ol>
>> <ol>5-1. 方法二，或是參考下方檔案內容的環境變數說明，進行 .env 檔案的客製化。</ol>
```text
PORT=<輸入指定伺服器通訊埠>
JWT_SECRET=<輸入自訂的加密使用私鑰>
IMGUR_CLIENT_ID=<輸入 Imgur 第三方圖片服務的 Client ID>
```

<br>

> 6. 核對專案質料夾裡面的 config 資料夾，該資料夾裡面的 config.json 檔案，裡面有寫下本專案需要連接資料庫時的必要資訊，請核對以下資訊:
>> <ol>6-1. 連線的 MySQL 資料庫 password 是否為 `"password"`，如果不是，請在以下的 password 欄位修改密碼。</ol>
>> <ol>6-2. 連線的 MySQL 資料庫 IP address 是否為 `"127.0.0.1"`，如果不是，請在以下的 host 欄位修改 IP address。</ol>
```json
{
  "development": {
    "username": "root",
    "password": "password",
    "database": "ac_twitter_workspace",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
  ...
}
```

<br>

> 7. 在 MySQL Workbench 裡面先行建立資料庫。
>> <ol>7-1. 須先確定 MySQL 服務已經啟動，並且透過 MySQL Workbench 成功登入資料庫。</ol>
>> <ol>7-2. 輸入以下 SQL 指令，並且點擊閃電圖示直接執行 SQL 指令。</ol>
```sql
CREATE DATABASE ac_twitter_workspace;
```

<br>

> 8. 執行資料庫的遷徙檔案。
```text
npx sequelize db:migrate
```

<br>

> 9. 執行資料庫的種子檔案。
```text
npx sequelize db:seed:all
```

<br>
<br>


## <strong>啟動伺服器步驟</strong>

> 1. 執行專案。 ( 伺服器啟動後會顯示 `Example app listening on port ...` )
```text
npm run start
```

> 2. 在到前台的頁面之前，請先確認以下的項目。
>> <ol>2-1. 前台如果還沒建立，記得先到我們<a href="https://github.com/ChiaLine/Simple-Twitter" target="_blank">前台的 Github Repo 連結</a>，依照前台 README.md 提供的步驟建立前台網站。</ol>
>> <ol>2-2. 如果，你的前台和後台都是建立在同一台本機上，前台需要確定界接的 API 網址是否為 127.0.0.1:<指定伺服器通訊埠></ol>
>> <ol>2-3. 如果，你的前台和後台都是建立不同的主機上面，前台需要確定界接的 API 網址是否為 <後台主機 IP address>:<指定伺服器通訊埠></ol>
>> <ol>2-4. 承接 2-3 的情境，如果前台後台分別在不同主機上面，需要確認後台所屬主機的防火牆是否允許前台存取。</ol>

> 3. 接著可以來到前台的頁面，使用以下種子帳號進行登入。

<br>
<br>

## <strong>種子資料</strong>
> 1. root (這個帳號只能使用於後台)
```text
account : root
password : 12345678
```

> 2. user1 (這個帳號只能使用於前台)
```text
account : user1
password : 12345678
```

<br>
<br>

## <strong>停止伺服器步驟</strong>
> 1. 如果要終止 API server 運作，可以位於鍵盤上面同時按壓 Ctrl + c 連續兩下。

<br>
<br>

## <strong>感謝，參與此次專案的協作者們，大家辛苦了!</strong>
| 組員 | 負責範圍 | 個人 Github 連結 |
| --- | --- | --- | 
| Egg | 前端 | https://github.com/ChiaLine |
| 罐子 Kuan | 前端 | https://github.com/Kanmurio406 |
| Christine | 前端 | https://github.com/Christinnne |
| 靜易 | 後端 | https://github.com/z88243310 |
| Richie | 後端 | https://github.com/Richie-Yang |

<br>
<br>

<p style="font-size: 1.2em">更新時間 : 2021.03.03</p>