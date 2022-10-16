<h1 align="center">Alphitter</h1>

<div align="center"><a href="https://imgur.com/Ji23uG2"><img src="https://i.imgur.com/Ji23uG2.gif" title="source: imgur.com" width="800"/></a></div>

<h2>介紹</h2>  

1. 這是一個使用 Node.js、Express 框架、JWT token 驗證，並連接 MySQL 資料庫的 Simple Twitter 專案，是讓使用者可以發表想法和與其他使用者交流互動的社群平台。
( <a href="https://m790101.github.io/twitter-project-v1-/#/logIn" target="_blank">Alphitter 網站入口</a> )

2. 操作角色可以分為：　　

【 一般使用者 】  
* 使用者可以註冊/登入/登出  
* 註冊時，使用者可以設定 帳號、名稱、email 和密碼  
* 使用者能編輯自己的名稱、自我介紹、大頭照與個人頁橫幅背景  
* 使用者能在首頁瀏覽所有的推文
* 使用者能回覆別人的推文
* 使用者能新增推文
* 使用者能對別人的推文按 Like/Unlike
* 使用者能瀏覽自己的關注清單
* 使用者能瀏覽自己的跟隨者清單
* 使用者能瀏覽自己的 like 過的推文清單
* 使用者能在首頁的側邊欄，看見跟隨者數量排列前 10 的推薦跟隨名單


【 後台管理者 】
* 管理者可從專門的後台登入頁面進入網站後台
* 管理者帳號不可登入前台
* 管理者可以瀏覽全站的推文清單
* 管理者可以直接在清單上快覽推文內容
* 管理者可以在清單上直接刪除任何人的推文
* 管理者可以瀏覽站內所有使用者的清單，清單的資訊包括使用者社群活躍數據：  
1. 推文數量
2. 關注人數
3. 跟隨者人數
4. 推文被 like 的數量


<h2>API</h2>
<a href="https://www.notion.so/API-GitHub-README-a22124ee91864b25a11263cd1e8f92eb" target="_blank">API 文件</a>

<h2>下載安裝</h2>

1. 開啟終端機 (Terminal)，clone 此專案至本機電腦  
```git clone https://github.com/LiyLi1122/twitter-api-2022.git```  

2. cd 到存放專案本機位置  
```cd twitter-api-2022```

3. 安裝 npm 套件   
```npm install```

4. 確認資料庫的帳號、密碼以及名稱設定在 config/config.json 檔案裡
```
"development": {
    "username": "root",
    "password": "password",
    "database": "ac_twitter_workspace",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
"test": {
    "username": "root",
    "password": "password",
    "database": "ac_twitter_workspace_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging": false
  }
 ```

5. 到 MySQL Workbench 建立專案資料庫  
```create database ac_twitter_workspace character set utf8mb4 collate utf8mb4_unicode_ci;```   
```create database ac_twitter_workspace_test character set utf8mb4 collate utf8mb4_unicode_ci;```

6. 建立資料表  
```npx sequelize db:migrate```

7. 建立種子資料  
```npx sequelize db:seed:all```

8. 建立 .env 檔案設定環境變數   
```參考 .env.example 設定```

9. 啟動本地伺服器，輸入指令顯示 Example app listening on port 3000! 即成功開啟  
```npm run dev```

<h2>執行測試</h2>

1. 切換到測試環境  
```export NODE_ENV=test```   

2. 建立資料表  
```npx sequelize db:migrate```  

3. 執行測試檔   
```npm run test```  

<h2>測試帳號</h2>

【 前台測試帳號 】  
account：user1  
email: user1@example.com  
password: 12345678  

【 後台測試帳號 】  
account：root  
email：root@example.com  
password：12345678  

<h3>使用工具</h3>

【 主要環境 】  
node v14.16.0   
express 4.16.4   

【 資料庫 】  
mysql2 2.1.0  
sequelize 5.21.13  
sequelize-cli 5.5.1   

【 其他 】  
passport 0.4.0  
bcryptjs 2.4.3  
body-parser 1.18.3  
chai 4.2.0   
connect-flash 0.1.1  
cors 2.8.5   
dayjs 1.10.6    
dotenv 16.0.3  
faker 4.1.0    
imgur 1.0.2    
jsonwebtoken 8.5.1   
method-override 3.0.0    
mocha 6.0.2   
multer 1.4.3   
passport-jwt 4.0.0  
passport-local 1.0.0   
sinon 10.0.0   
sinon-chai  3.3.0   

<h2>作者</h2>
Lily | youjhen
