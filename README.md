# Simple Twitter API
***
此專案為使用node.js、Express作為後端語言及框架，搭配 MySQL 關連式資料庫，打造的 API 伺服器
[按此查看API文件](https://mjcjtwitterproject.docs.apiary.io/#)

### Getting start
***
#### Prerequisites - 環境建置
1. [Node.js](https://nodejs.org/en/)
2. [npm](https://www.npmjs.com/)
3. [Nodemon](https://www.npmjs.com/package/nodemon)
4. [Express](https://www.npmjs.com/package/express)


#### Installing - 安裝流程
1. 打開你的 terminal，Clone 此專案至本機電腦
          
           $ git clone https://github.com/dinsky21/twitter-api-2020.git
    
2. 開啟終端機(Terminal)，進入存放此專案的資料夾

            $ cd twitter-api-2020
3. 執行 

           $ npm install
           
4. 打開 VS code

            $ code .
    
 
5. 確認資料庫連線，本地資料庫的username、password以及database 名稱 和 config/config.json 檔案內設置的一樣
6. 在 MySQL Workbench 建立資料庫

          create database ac_twitter_workspace;
          
7. 在資料庫內建立資料表

          在 Terminal 輸入  $ npx sequelize db:migrate
          
8. 在資料表內建立種子資料

         在 Terminal 輸入  $ npx sequelize db:seed:all
    
9. 設置.env檔案，放入環境變數(.env.example裡的變數)
 
         在 Terminal 輸入  $ touch .env
         
10. 啟動伺服器，執行 app.js 檔案

          在 Terminal 輸入  $ npm run dev
    
11. 當 terminal 出現以下字樣，表示本機伺服器已啟動並成功連結

           Example app listening on port 3000!

12. 若要暫停

          按下ctrl+c
          
現在在瀏覽器網址列輸入 http://localhost:3000/ +欲使用的 API 路由 即可使用特定功能

### API文件
***
[按此查看API文件](https://mjcjtwitterproject.docs.apiary.io/#)
裡面提供API文件的描述、用途、功能、接口 URL，包含請求方式，請求參數，及成功回傳與錯誤回傳資訊與代碼

#### Built With - 使用工具
***
* [Visual Studio Code](https://visualstudio.microsoft.com/zh-hant/) - 開發環境
* [Node.js](https://nodejs.org/en/)  v14.16.0
* [Express](https://www.npmjs.com/package/express)  4.16.4- 應用程式架構
* [mysql2](https://www.npmjs.com/package/mysql2)  1.6.4
* [sequelize](https://www.npmjs.com/package/sequelize)  6.18.0
* [sequelize-cli](https://www.npmjs.com/package/sequelize-cli)  6.2.0
* [dotenv](https://www.npmjs.com/package/dotenv)  10.0.0
* [method override](https://www.npmjs.com/package/method-override)  3.0.0
* [express-session](https://www.npmjs.com/package/express-session)  1.15.6
* [passport](http://www.passportjs.org/)  0.4.0
* [passport-jwt](http://www.passportjs.org/packages/passport-jwt/)  4.0.0
* [passport-local](http://www.passportjs.org/packages/passport-local/)  1.0.0
* [bcryptjs](https://www.npmjs.com/package/bcryptjs)  2.4.3
* [faker](https://fakerjs.dev/guide/)  4.1.0
* [imgur](https://www.npmjs.com/package/imgur)  1.0.2
* [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)  8.5.1
#### Contributor - 專案開發人員
---
[Chloe905](https://github.com/Chloe905)
[dinsky21](https://github.com/dinsky21)
