# twitter-api-2023
ALPHA Camp | 學期 3 | Simple Twitter | 自動化測試檔 (前後分離組) 

# Environment - 開發環境
node v14.16.0
nodemon

#Installation and Execution - 安裝與執行步驟
1. 創建資料夾
2. 安裝所需packages。指令`npm i`
3. 建立SQL資料庫。指令 `create database ac_twitter_workspace`
4. 建立資料表。指令 `npx sequelize db:migrate`
5. 建立種子檔。指令 `npx sequelize db:seed:all`
6. 建立環境參數(請參考.env.example)。
7. 啟動伺服器。指令`npm run dev`

# Note:
#管理者帳號:
account: root
password: 12345678

#使用者帳號:
account: user1
password: 12345678
