# Simple Twitter Clone API專案

### 執行步驟
1. 打開你的 terminal，Clone 此專案至本機電腦
`git clone git@github.com:dream184/twitter-api-2020.git`
2. 開啟終端機(Terminal)，進入存放此專案的資料夾
`cd twitter-api-2020`
3. 安裝 npm 套件
在 Terminal 輸入 `npm install` 指令
4. 完成建立資料庫，並完成資料庫遷移  
在 Terminal 輸入 `npx sequelize db:create`  
接著輸入`npx sequelize db:migrate`
5. 在資料庫裡面建立種子資料
`npx sequelize db:seed:all`
6. 設定環境變數
將根目錄的`.env.example`改成`.env`，並填入相對應的環境變數
7. 啟動伺服器，執行 app.js 檔案
`在 Terminal 輸入 npm run dev 指令`
8. 當 terminal 出現以下字樣，表示伺服器與資料庫已啟動並成功連結
`Example app listening on 3000`
9. 輸入下列帳號密碼即可登入  
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