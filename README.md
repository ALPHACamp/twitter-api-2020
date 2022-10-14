
<img src="https://media.giphy.com/media/vFKqnCdLPN/OKc/giphy.gif" width="40" height="40" />
![Alt Text](https://media.giphy.com/media/vFKqnCdLPNOKc/giphy.gif)

<h3>介紹</h3>
這是一個 
JWT token 驗證

【 一般使用者 】
註冊/登入/登出
除了註冊和登入頁，使用者一定要登入才能使用網站
註冊時，使用者可以設定 account、name、email 和 password

【 後台管理者 】

account：如 ellenlee，必須是獨一無二的，在設計稿上看到的 @ellenlee 的前綴 @ 為 前端自動生成，非資料的一部分。用意是在前端版面上呈現 name/account 的差異 (圖解)
name：平常顯示的暱稱，如 Ellen Lee，上限 50 字
使用者能編輯自己的 account、name、email 和 password

註冊/編輯時，account 和 email 不能與其他人重複，若有重複會跳出錯誤提示

錯誤提示文案：「account 已重複註冊！」或「email 已重複註冊！」
頁面重新整理後顯示錯誤提示（後端驗證）
使用者能編輯自己的名稱、自我介紹、個人頭像與封面

自我介紹數字上限 160 字、暱稱上限 50 字

錯誤提示文案：字數超出上限！
直接防止表單送出（前端驗證）
錯誤提示樣式請參考設計稿中，Basic Element 的頁面
種子資料設計
種子帳號（含指定測試帳號）：

Admin （必須包括登入帳號 account: root, email: root@example.com, password: 12345678）
至少提供 5 個一般使用者（其中必須包括登入帳號 account: user1, email: user1@example.com, password: 12345678）

每個使用者有 10 篇 tweet

每篇 tweet 有隨機 3 個留言者，每個人有 1 則留言

貼文留言
使用者能在首頁瀏覽所有的推文 (tweet)

所有 Tweets 依 create 日期排序，最新的在前
點擊貼文方塊時，能查看貼文與回覆串

使用者能回覆別人的推文

回覆文字不能為空白

錯誤提示文案：內容不可空白
直接防止表單送出（前端驗證）
若不符合規定，會跳回同一頁並顯示錯誤訊息

使用者無法回覆他人回覆，也無法針對他人的按 Like/Unlike

點擊貼文中使用者頭像時，能瀏覽該使用者的個人資料及推文

使用者能新增推文

推文字數限制在 140 以內

錯誤提示文案：內容不可空白
直接防止表單送出（前端驗證）
推文不能為空白（文案與樣式請參考設計稿）

使用者互動
使用者可以追蹤/取消追蹤其他使用者 (不能追蹤自己)
使用者能對別人的推文按 Like/Unlike
使用者能編輯自己的名稱、介紹、大頭照和個人頁橫幅背景

個人頁面橫幅背景預設為設計稿中的山景圖
數據摘要
任何登入使用者都可以瀏覽特定使用者的以下資料：

推文 (Tweets)：排序依日期，最新的在前
推文與回覆：使用者回覆過的內容，排序依日期，最新的在前
跟隨中 (Following)：該使用者的關注清單，排序依照追蹤紀錄成立的時間，愈新的在愈前面
跟隨者 (Follower)：該使用者的跟隨者清單，排序依照追蹤紀錄成立的時間，愈新的在愈前面
喜歡的內容 (Like)：該使用者 like 過的推文清單，排序依 like 紀錄成立的時間，愈新的在愈前面
使用者能在首頁的側邊欄，看見跟隨者 (followers) 數量排列前 10 的推薦跟隨名單

後台
管理者可從專門的後台登入頁面進入網站後台

管理者帳號不可登入前台，詳見【角色權限】單元說明
若使用管理帳號登入前台，或使用一般使用者帳號登入後台，等同於「帳號不存在」
管理者可以瀏覽全站的 Tweet 清單

可以直接在清單上快覽 Tweet 的前 50 個字
可以在清單上直接刪除任何人的推文
管理者可以瀏覽站內所有的使用者清單 (參照圖片)，清單的資訊包括

使用者社群活躍數據，包括

推文數量（指使用者的 Tweet 累積總量）
關注人數
跟隨者人數
推文被 like 的數量（指使用者的 Tweet 獲得 like 的累積總量）
使用者清單預設按推文數排序，由多至少



<h3>API</h3>
[API 文件] : https://github.com/readthedocs/recommonmark/issues/108

<h3>下載安裝</h3>
1.開啟終端機 (Terminal)，clone 此專案至本機電腦  
```git clone https://github.com/LiyLi1122/twitter-api-2022.git```

2. cd 到存放專案本機位置並執行  
```cd twitter-api-2022```

3. 安裝 npm 套件   
```npm install```

4. 到 MySQL Workbench 建立專案資料庫  
```create database ac_twitter_workspace character set utf8mb4 collate utf8mb4_unicode_ci;```   
```create database ac_twitter_workspace_test character set utf8mb4 collate utf8mb4_unicode_ci;```

5. 建立資料表  
```npx sequelize db:migrate```

6. 建立種子資料  
```npx sequelize db:seed:all```

7. 建立 .env 檔案設定環境變數  
```參考 .env.example 設定```

8. 啟動本地伺服器，顯示 Example app listening on port 3000! 即成功開啟
```npm run dev```


<h3>測試</h3>
1.前台測試帳號
account: user1
email: user1@example.com
password: 12345678
2.後台測試帳號
account: root
email: root@example.com
password: 12345678

<h3>使用工具</h3>
主要環境
node v14.16.0
express 4.16.4

資料庫
mysql2 2.1.0
sequelize 5.21.13
"sequelize-cli": "^5.5.1",

其他
passport 0.4.0
"bcryptjs": "^2.4.3",
"body-parser": "^1.18.3",
"chai": "^4.2.0",
"connect-flash": "^0.1.1",
"cors": "^2.8.5",
"dayjs": "^1.10.6",
"dotenv": "^16.0.3",
"faker": "^4.1.0",
"imgur": "^1.0.2",
"jsonwebtoken": "^8.5.1",
"method-override": "^3.0.0",
"mocha": "^6.0.2",
"multer": "^1.4.3",
"passport-jwt": "^4.0.0",
"passport-local": "^1.0.0",
"sinon": "^10.0.0",
"sinon-chai": "^3.3.0"

<h2>作者</h2>
Lily
youjhen
