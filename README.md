# Simple Twitter API
一個使用 Node.js + Express 作為後端語言及框架，搭配 MySQL 關連式資料庫，打造的 API 伺服器

Simple Twitter [作品連結](https://ywcheng1207.github.io/Twitter/login)
## 使用說明
1. 請先確認有安裝 Node.js 與 npm
2. 打開終端機 (Terminal)，並複製 (Clone) 此專案至本機電腦
```
git clone https://github.com/tschiang23/twitter-api-2020.git
```
3. 進入專案資料夾
```
cd twitter-api-2020
```
4. 安裝所需套件
```
npm install
```
5. 確認本地資料庫的帳號、密碼以及名稱設定和 config/config.json 檔案內設置的相同
6. 在 MySQL Workbench 建立資料庫
```
drop database if exists ac_twitter_workspace;
create database ac_twitter_workspace;
```
7. 在資料庫內建立資料表
```
npx sequelize db:migrate
```
8. 產生種子資料給資料庫
```
$ npx sequelize db:seed:all
```
9. 建立一個存放環境變數的 .env 檔：
```
touch .env
```
並在裡面設置環境變數
```
IMGUR_CLIENT_ID= xxxx
JWT_SECRET= xxx
```
10. 快速啟動（如果要進入開發者模式，請輸入：npm run dev，請先確保有安裝nodemon)
```
npm run start
``` 
11. 在終端機看到以下字串，代表伺服器已成功建立：

```
Example app listening on port 3000!
```

12. 伺服器將在 http://localhost:3000/ 上啟動運行

13. 若要暫停使用伺服器，請在終端機按下 `Ctrl + C` (macOS: `Command + C`)

## 路由列表
請參考[API文件說明](https://www.notion.so/API-7208e32ecbe34cbe945813ead050aab3)以獲得詳細的路由清單、必要參數和回傳格式

在瀏覽器網址列輸入 `http://localhost:3000/api/`，接著加上想要測試的路由，例如：
```
http://localhost:3000/api/signin
```
## 測試帳號
前台：
```
Account: user1
Password: 12345678
```
後台：
```
Account: root
Password: 12345678
```

## 開發工具
- Node.js 14.16.0
- Express 4.16.4
- mysql2 1.6.4
- sequelize 6.18.0
- sequelize-cli 5.5.0
- bcryptjs 2.4.3
- passport 0.4.0
- passport-local 1.0.0
- passport-jwt 4.0.0
- jsonwebtoken 8.5.1
- imgur 1.0.2
- faker 5.5.3