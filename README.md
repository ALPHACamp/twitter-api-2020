# twitter-api-2020 (BackEnd)
本專案為[前端專案](https://github.com/VinceLee9527/twitter-front-end-vue)提供API

## Live DEMO
請點此處前往

## API文件
本份API是利用Apiary撰寫而成，請點[此處](https://simpletwitterapi3.docs.apiary.io/#reference)前往

## 專案設定(利用終端機)
1. 下載本專案到本地
```
git colone https://github.com/Emily81926/twitter-api-2020.git
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
create database create database ac_twitter_workspace_test;
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
## 開發人員
* Emily (email: emily81926@gmail.com)
* Kerwin (email: tkoleo84119@gmail.com)
