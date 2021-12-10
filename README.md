# twitter-api-2020 (BackEnd)
本專案為[前端專案](https://github.com/VinceLee9527/twitter-front-end-vue)提供API

## Live DEMO
請點[此處](https://vincelee9527.github.io/twitter-front-end-vue/#/signin)前往  

![image](https://github.com/Emily81926/twitter-api-2020/blob/e3bb73328ab01ac4d01ab319cf2e02810c0d735b/public/home%20page.png)

## API文件
本份API文件是利用Apiary撰寫而成，請點[此處](https://simpletwitterapi3.docs.apiary.io/#reference)前往  

![image](https://github.com/Emily81926/twitter-api-2020/blob/e3bb73328ab01ac4d01ab319cf2e02810c0d735b/public/API%20document.png)

## 專案設定(利用終端機)
1. 下載本專案到本地
```
git clone https://github.com/Emily81926/twitter-api-2020.git
```
2. 進入本專案資料夾
```
cd twitter-api-2020
```
3. 安裝所需套件
```
 npm install
```
4. 創建資料庫(利用MySQLＷorkbench)
```
create database ac_twitter_workspace;
```
5. 建立table
```
 npx sequelize db:migrate
```
6. 建立種子資料
```
npx sequelize db:seed:all
```
7. 建立`.env`檔案並設定環境參數(`.env.example`檔案內有實例)
8. 啟動伺服器
```
npm run dev
```
9. 若看到以下字串即代表成功啟動
`Example app listening on port 3000!`

## 執行測試(利用終端機)
1. 創建測試所需資料庫(利用MySQLＷorkbench)
```
create database ac_twitter_workspace_test;
```
2. 切換環境
```
export NODE_ENV=test
```
3. 建立table
```
 npx sequelize db:migrate
```
4. 建立種子資料
```
npx sequelize db:seed:all
```
5. 測試
```
npm run test
```
## 測試帳號
* 管理員帳號： root  
  管理員密碼： 12345678
* 一般使用者帳號： user1  
  一般使用者密碼： 12345678

## 開發人員
### 後端
* Emily (email: emily81926@gmail.com)
* Kerwin (email: tkoleo84119@gmail.com)
### 前端
* Chaco (email: chacowang0125@gmail.com)
* Vince (email: vlee9527@gmail.com)
