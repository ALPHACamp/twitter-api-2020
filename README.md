# Simple Twitter API
一個以node.js搭配express與MySQL，採用RESTful API 風格建置之專案，提供使用者進行API串接。  
<br/>
可參考：  
[網站連結]()  
[API文件](https://www.notion.so/Twitter-API-_0326-eadf8aa7fd9442deb89ea7fef45f1cfe)  
[Simple Twitter 前端專案](https://github.com/EastonTsai/Twitter) &ensp;(By&ensp;[EastonTsai](https://github.com/EastonTsai)、[becky](https://github.com/beckyyyyy))
<br/>
### 所需工具與版本
[nvm](https://github.com/nvm-sh/nvm)  
node 16.19.1  
[MySQL 8.0以上版本](https://downloads.mysql.com/archives/installer/)  
[MySQL Workbench 8.0以上版本](https://downloads.mysql.com/archives/workbench/)  
### 安裝與執行步驟
1. 打開終端機(Terminal)，將專案clone至本機位置
```
$ git clone https://github.com/cayangtuu/twitter-api.git
```
2. 進入專案資料夾
```
$ cd twitter-api
```
3. 安裝專案所需npm套件
```
$ npm install
```
4. 建立.env檔案並新增變數，可參考.env.example檔案
```
JWT_SECRET=
IMGUR_CLIENT_ID=
```
5. 修改config/config.json中開發環境(development)的資料庫設定
```
"development": {
    "username": <username>,  //修改使用者名稱
    "password": <password>,  //修改使用者密碼
    "database": "ac_twitter_workspace",  
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
```
5. 建立MySQL資料庫，於MySQl Workbench中輸入並執行以下指令：
```
create database ac_twitter_workspace;
```
6. 建立資料表與種子資料，於終端機(Terminal)輸入以下指令：
```
$ npx sequelize db:migrate
$ npx sequelize db:seed:all
```
若沒跳出錯誤訊息，即代表資料建置完成。另可至MySQl Workbench中的database做確認。

7. 切換至開發環境，並啟動伺服器
```
$ export NODE_ENV=development
$ npm run dev
```
終端機出現```Example app listening on port 3000!```字樣即代表伺服器正常啟動

8. 開啟任一瀏覽器並於網址列中輸入以下網址+API路由，即可使用伺服器對應功能
```
http://localhost:3000/ +API路由  
```

### 測試帳號
```
管理者，只可進入後台
account:root
password:12345678  

一般使用者，只可進入前台
account:user1
password:12345678
```

### 作者
[Doranne](https://github.com/cayangtuu)、[Ellen-ho](https://github.com/Ellen-ho)
