# Simple Twitter Clone API專案


### 安裝所需軟體及版本
  - node: v14.16.0 *必須
  - MySQL: 8.0.27 *必須
  - MySQL Workbench (方便用圖形化介面操作mysql)
---
### 執行步驟
1. 打開你的 terminal，Clone 此專案至本機電腦
`git clone git@github.com:dream184/twitter-api-2020.git`
2. 開啟終端機(Terminal)，進入存放此專案的資料夾
`cd twitter-api-2020`
3. 在 Terminal 輸入 `npm install` 指令，安裝專案所需套件
4. 確定`config/config.json`內，development和test所使用root帳號的密碼與安裝MySQL時相符  
若不相符則須更改成安裝MySQL時所設定的password
```
  "development": {
    "username": "root",
    "password": /*你的root帳號的密碼*/,
    "database": "ac_twitter_workspace",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": /*你的root帳號的密碼*/,
    "database": "ac_twitter_workspace_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging": false
  },
```
5. Terminal 輸入 `npx sequelize db:create` 來建立資料庫(database)
6. 接著輸入`npx sequelize db:migrate` 建立資料表(table)
6. 在資料庫裡面建立種子資料
`npx sequelize db:seed:all`
7. 設定環境變數
將根目錄的`.env.example`改成`.env`，並填入相對應的環境變數
```
JWT_SECRET=/*輸入你的環境變數*/
IMGUR_CLIENT_ID=/*輸入你的環境變數*/
DB_DIALECT=/*輸入你的環境變數*/
DB_HOST=/*輸入你的環境變數*/
DB_USERNAME=/*輸入你的環境變數*/
DB_PASSWORD=/*輸入你的環境變數*/
DB_DATABASE=/*輸入你的環境變數*/
```
8. 啟動伺服器，執行 app.js 檔案
在 Terminal 輸入 `npm run start` 指令可啟動專案
9. 當 terminal 出現以下字樣，表示伺服器與資料庫已啟動並成功連結
`Example app listening on 3000!`
10. 若要進入開發者模式，則可輸入`npm run dev`
---
### 種子帳號
使用者可利用下述帳號來啟用對應權限的功能：
##### 後台管理者帳號：
```
    account: 'root'
    email: 'root@example.com'
    password: '12345678'

```
  - 後台管理者無法進入前台頁面  
##### 前台使用者帳號：
```
    account: 'user1'
    email: 'user1@example.com'
    password: '12345678'

```
  - 前台使用者無法進入後台管理者頁面

### 參考文件
[API總覽](https://hackmd.io/@2dhQHQ8YT6CgER4nMYe_tQ/SJxXby-lq#)  
[前端Repo](https://github.com/Freya-Jheng/twitter) 

### 共同開發者

前端: [Anson](https://github.com/huanmingchang), [Freya](https://github.com/Freya-Jheng)  
後端: [Paul](https://github.com/dream184), [Howard](https://github.com/asakura4)