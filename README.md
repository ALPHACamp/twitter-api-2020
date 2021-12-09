# AC3-Twitter-API (後端API)
本專案為AC3-Twitter-API

## 專案設定(利用終端機)
1. 下載本專案到本地
```
*git clone https://github.com/smilingfroggy/AC3-Twitter-API.git
```
2. 進入本專案資料夾
```
*cd AC3-Twitter-API
```
3. 安裝所需套件
```
*npm install
```
4. 開啟資料庫
```
*create database ac_twitter_workspace;
```
5. 建立資料表
```
*npx sequelize db:migrate
```
6. 建立種子資料
```
*npx sequelize db:seed:all
```
7. 建立`.env`檔案並設定環境參數

8. 啟動伺服器
```
*npm run dev
```
9. 成功啟動後終端機顯示
*`Example app listening on port 3000!`

## 執行測試(利用終端機)
1. 創建測試所需資料庫
```
*create database ac_twitter_workspace_test;
```
2. 切換到測試環境
```
*export NODE_ENV=test
```
3. 建立測試環境資料表
```
*npx sequelize db:migrate
```
4. 建立種子資料
```
*npx sequelize db:seed:all
```

5. 確認config.json中test是否設定為本地資料庫username and password

6. 測試
```
*npm run test
```
## 測試帳號
* 管理員帳號： root  
  管理員密碼： 12345678
* 一般使用者帳號1： user1  
  一般使用者密碼： 12345678

* 一般使用者帳號2： user2  
  一般使用者密碼： 12345678

* 一般使用者帳號3： user3  
  一般使用者密碼： 12345678

* 一般使用者帳號4： user4  
  一般使用者密碼： 12345678

* 一般使用者帳號5： user5  
  一般使用者密碼： 12345678

## 使用API需注意事項:
* 1. 註冊時, 需填入所有欄位。
* 2. 使用者帳號無法登入及瀏覽後台
* 3. 管理者帳號無法登入及瀏覽前台
* 4. 本API使用JWT Token




