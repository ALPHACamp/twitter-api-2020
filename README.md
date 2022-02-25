### 執行步驟
1. 打開你的 terminal，Clone 此專案至本機電腦
`git clone git@github.com:dream184/twitter-api-2020.git`
2. 開啟終端機(Terminal)，進入存放此專案的資料夾
`cd twitter-api-2020`
3. 切換 development 分支
`git checkout origin/development`
4. 安裝 npm 套件
`在 Terminal 輸入 npm install 指令`
5. 完成建立資料庫，並完成資料庫遷移
`在 Terminal 輸入 npx sequelize db:create`
`接著輸入 npx sequelize db:migrate`
6. 設定環境變數
`將根目錄的.env.example改成.env，並填入環境變數`
7. 建立種子資料
`npm run seed`
8. 啟動伺服器，執行 app.js 檔案
`在 Terminal 輸入 npm run dev 指令`
9. 當 terminal 出現以下字樣，表示伺服器與資料庫已啟動並成功連結
`Express is listening on http://localhost:3000`
10. 輸入 SEED_USER 帳號密碼即可登入
```
    account: 'root'
    email: 'root@example.com'
    password: '12345678'

```