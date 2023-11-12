# twitter-api-2020
ALPHA Camp | 學期 3 | Simple Twitter | 自動化測試檔 (前後分離組) 

採用前後分離的開發模式
此專案為後端API 

功能
---------------
帳號註冊與登入
使用者可以瀏覽,回覆,按讚貼文
使用者可以追蹤其他使用者,亦可取追蹤
使用者可以瀏覽其他使用者的個人頁面
使用者可以編輯個人資料或帳號資料
後台管理者可以瀏覽推文清單,也可刪除推文
後台管理者可以瀏覽使用者名單

安裝與執行專案
--------------
1. 確認已安裝node.js與npm
2. 下載此專案
```
   git clone https://github.com/Antarctic-penguin/twitter-api-2020.git
```
3. 在專案路徑下安裝套件
```
   npm install
```
4. 參考 .env.example 檔案，建立 .env 檔案並設定相關環境變數
5. 檢查/config/config.json  ,設定對應的資料庫連線資訊
6. 建立資料表
```
   npx sequelize db:migrate
```
7. 建立種子資料
```
  npx sequelize db:seed:all
```
8.啟動專案
```
  nodemon app.js
```




