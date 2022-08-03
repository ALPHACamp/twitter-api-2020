## 介紹
- 以 twitter 規格發想的簡易 simple twitter 專案。  
- 前端使用 Vue.js 打造前端使用者介面，後端使用 Node.js 搭配 Express 框架建構，使-用關聯式資料庫 MySQL 做為 database。  
- 使用者在此專案可以發布貼推文、在推文中留言、推文案讚、使用者追蹤，而管理者能在後台管理所有使用者以及發言。  
- 本專案為後端開發之專案。  
## 產品功能
1. 使用者可以註冊個人帳號，並使用個人帳號登入，編輯個人資料，包括名稱、帳號、密碼、email、介紹、個人顯示圖片與背景圖片。  
2. 使用者可以發布自己的文字推文訊息。  
3. 使用者可以瀏覽其他使用者或取消追蹤。  
4. 使用者可以追蹤其他使用者或取消追蹤。  
5. 使用者可以瀏覽其他使用者個人介紹頁面，瀏覽對方的歷史推文、留言、按讚的內容、追蹤中的使用者及追蹤該名使用者的清單。  
6. 後台管理者可以瀏覽所有使用者以及所有發布的推文，並且管理者能夠刪除推文。  
7. 所有使用者的帳號密碼經過雜湊處理存入資料庫，以提高安全性。  
## Heroku 部屬
[Simple Twitter](https://young-springs-47906.herokuapp.com)  
## 專案開發人員
[JasonChou](https://github.com/JasonChou524)  
[Snow](https://github.com/SnowWuChiKuo)  
## 前端專案
[前端repo](https://github.com/william8815/simple-twitter)
## 專案本地安裝流程
1. 請確認電腦已經安裝 Node.js 、 npm 與 Mysql Workbench  
2. 打開終端機，輸入以下指令將此專案 clone 到本地  
```
git clone https://github.com/JasonChou524/SimpleTwitter 
``` 
3. 終端機移動至專案資料夾，輸入指令安裝套件  
```
cd 專案資料夾  
npm install  
```
4. 安裝完畢後，請開啟 Mysql Workbench
```  
CREATE DATABASE ac-twitter_workspace;  
```
5. 打開 config 資料夾內的 config.json 檔案，確認 development 資料庫環境設定與本機資料相符 
``` 
"development": {  
    "username": "資料庫使用者帳號",  
    "password": "資料庫密碼",  
    "database": "ac_twitter_workspace",  
    // ...  
  },
```  
6. 在終端機輸入以下內容，建立相關資料表以及種子資料  
```
npx sequelize db:migrate  
npx sequelize db:seed:all  
```
7. 新增 .env 檔案，根據 .env.example 補足所需變數設定  
```
JWT_SECRET=  
```
8. 當種子資料建立完畢後，請依照使用的電腦系統輸入以下內容啟動後端伺服器  
```
Mac: npm run dev  
windows: npm run win_dev  
```
9. 若跑出以下內容，代表後端伺服器已經成功運行了
```  
Example app listening on port 3000!  
```
10. 使用帳號登入  
```
一般帳號 user1@example.com  
密碼 12345678  
```
```
管理員帳號 root@example.com  
密碼 12345678  
```
## 後端開發工具
bcrypt-nodejs: v0.0.3  
bcryptjs: v2.4.3  
body-parser: v1.18.3  
chai: v4.2.0  
connect-flash: v0.1.1  
cors: v2.8.5  
dotenv: v16.0.1  
express: v4.16.4  
express-session: v1.15.6  
faker: v4.1.0  
jsonwebtoken": v8.5.1  
method-override: v3.0.0  
mocha: v8.2.0  
mysql2: v1.6.4  
passport: v0.4.0  
passport-jwt: v4.0.0  
passport-local: v1.0.0  
sequelize: v6.18.0  
sequelize-cli": v5.5.0  
sinon: v9.2.0  
sinon-chai: v3.3.0  
eslint: v7.32.0  
eslint-config-standard: v16.0.3  
eslint-plugin-import: v2.23.4  
eslint-plugin-node: v11.1.0  
eslint-plugin-promise: v5.1.0  