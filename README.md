Twitter專案API
====
使用node.js + express並使用Mysql作為資料庫的推特網站API

Features - 產品功能
-----
#### Admin(需要管理員權限):

1.使用者可以使用後台登入功能(登入取得管理員權限)。

2.使用者可以取得資料庫中所有推文資料。

3.使用者可以刪除任何存在的推文資料。

4.使用者可以取得資料庫中所有使用者資料。

#### Tweets(需要會員權限):

1.使用者可以取得所有推文資料。

2.使用者可以取得特定id推文的所有回覆資料。

3.使用者可以對特定id推文使用回覆功能。

4.使用者可以新增推文。

5.使用者可以對特定id推文進行收藏功能。

6.使用者可以對特定id推文進行刪除收藏功能。

7.使用者可以取得特定id推文。

#### Users(需要會員權限):

1.使用者可以對帳號進行token檢查。

2.使用者可以使用登入前台功能。

3.使用者可以使用註冊帳號功能。

4.使用者能使用編輯使用者資料功能。

5.使用者能取得特定id使用者資料。

6.使用者能取得特定id使用者的所有推文資料。

7.使用者能取得特定id使用者所有回覆過的推文資料。

8.使用者能取得特定id使用者正在追蹤的所有使用者資料。

9.使用者能取得正在追蹤特定id使用者的使用者資料。

10.使用者能取得特定id使用者收藏的所有推文資料。

11.使用者能取得追蹤數量預設排名前10的使用者資料，並可根據top這個querystring去彈性決定要取出幾筆資料。

#### Followships(需要會員權限):

1.使用者可以使用追蹤使用者功能。

2.使用者可以使用刪除追蹤使用者功能。

Environment SetUp - 環境建置
-----
1. [Node.js](https://nodejs.org/en/)
2. [Mysql](https://www.mysql.com/)

Installing - 專案安裝流程
----
1.打開你的 terminal，Clone 此專案至本機電腦

    git clone https://github.com/CHUCHUDAN/twitter-api-2020.git
    
2.開啟終端機(Terminal)，進入存放此專案的資料夾

    cd twitter-api-2020
    
3.安裝 express 套件版本建議4.17.1

    在 Terminal 輸入 npm i express@4.17.1 指令
    
4.安裝nodemon套件
    
    在 Terminal 輸入 npm install nodemon 指令
    
5.請自行新增.env檔案放置與檔案相關的敏感資訊可參考.env.example檔案內容

    JWT_SECRET="你的jwt secret"
    IMGUR_CLIENT_ID="你的imgur client_id"(非必要)
    GITHUB_PAGE="你的指定前端網域"
    SESSION_SECRET="你的 session secret"

6.mysql資料庫設定

    請參考專案資料夾中的config/config.json設定，可以照著裡面的設定或自行建立設定本地mysql資料庫。

7.資料庫遷移

    在 Terminal 輸入 npx sequelize db:migrate 指令  
    
8.啟動伺服器
  
    在 Terminal 輸入 npm run dev 指令
    
9.當 terminal 出現以下字樣，表示伺服器啟動成功並與資料庫連線成功

    Example app listening on port 3000!

10.如需使用種子資料請輸入指令

    在 Terminal 輸入 npx sequelize db:seed:all 指令
    本專案種子預設有登入帳號
    管理者
    帳號 root
    密碼 12345678

    使用者
    帳號 user1
    密碼 12345678
    
Contributor - 專案開發人員
-----
[阿嘉](https://github.com/CHUCHUDAN)
[Chou jason](https://github.com/pleasesailas)
