# twitter-api-2020

Simple Twitter是一個迷你的社群平台，使用者可以追蹤且訂閱其他的使用者、發布推文、對推文進行回覆及按下喜歡，並對以上活動發出通知給對方使用者。
此外設有公開聊天室可和在線使用者進行聊天，亦能使用私訊功能進行一對一聊天，使用者也能在上線時，收到未觀看的私訊數及與個別使用者聊天未讀的訊息數量。

## Live demo

[連結](https://ryanhsun.github.io/simple-twitter-frontend/#/)

![demo](https://i.imgur.com/ZzFWk1n.gif)

DEMO 帳號

|    role    | account                | password |
| ---------- | -------                | -------- |
| user       |   user5@example.com    | 12346578 |
| admin      |    root@example.com    | 12345678 |
## 前端repo
+ 前端成員: Daisey 、 阿勳  
+ [repo連結](https://github.com/RyanHsun/simple-twitter-frontend)
## 功能

+ 使用者可建立個人帳戶
+ 使用者可發佈推文及回覆推文
+ 使用者可對推文按下喜歡
+ 使用者可追蹤、訂閱其它使用者
+ 使用者可收到訂閱者的發文通知
+ 當其他使用者對該使用者訂閱、追蹤、回覆推文、喜歡推文時，該使用者可收到通知
+ 使用者可進入公開聊天室聊天
+ 使用者可使用私訊功能，進行聊天

## 環境設置

### 開發與框架
```
 "express": "^4.16.4"
```
### 資料庫

````
"sequelize": "^4.42.0"
"sequelize-cli": "^5.5.0"
"mysql2": "^1.6.4"
"mySQL":"8.0.25"
````

### 使用者驗證

````
"passport": "^0.4.0"
"passport-jwt": "^4.0.0"
"jsonwebtoken": "^8.5.1",
````

### 聊天室與通知
````
"socket.io": "^4.1.3"
````
### 圖床與上傳

````
"imgur-node-api": "^0.1.0"
"multer": "^1.4.2"
````
## 安裝與使用  
1. 使用終端機，clone專案到local
```
git clone  https://github.com/AlphaCamp-ZHIH/twitter-api-2020.git
```
2. 進入專案資料夾
```
 cd twitter-api-2020
```
3. 安裝套件
```
npm install
```
4. 安裝MySQL 及建立資料庫
+ 需要與 config/config.json 一致
````
create database ac_twitter_workspace;
create database ac_twitter_workspace_test;
````
5. 資料庫內新增Table 與其關聯
````
npx sequelize db:migrate
````
6. 新增種子資料
````
npx sequelize db:seed:all
````
7. 建立env
````
PORT=3000 // Port號
IMGUR_CLIENT_ID=SKIP //圖片圖床 imgur 請至imgur申請
JWT_SECRET=SKIP 
SESSION_SECRET=SKIP 
````
8. 開發模式下執行
```
npm run dev
```
測試使用
----
1. 切換至test模式
```
 export NODE_ENV=test
```
2. 資料庫內新增Table 與其關聯

````
npx sequelize db:migrate
````
3. 新增種子資料

````
npx sequelize db:seed:all
````
4. 執行測試檔

```
npm run test
```


## API 文件

+ [API文件](https://app.swaggerhub.com/apis-docs/jennesy.dai/twitter-project-2021/1.0.0-oas3)  
+ [socket文件](https://www.notion.so/923ccf47dadb480ca55929cac862cd1a)


## API 簡介說明
___
admin(管理)
----
| 方法    | 事件名稱      | 內容|
| ---------- | -------   | ---|
|POST|​/api​/admin​/login|後台登入|
|GET| ​/api​/admin​/users|取得所有使用者資料|
|GET|​/api​/admin​/tweets|取得所有推文資料|
|DELETE|​/api​/admin​/tweets​/{id}|刪除指定推文|

Users(使用者)
----
| 方法    | 事件名稱      | 內容|
| ---------- | -------   | ---|
|POST|​/api​/users​/login|使用者登入|
|GET|​/api​/users|取得所有尚未追蹤的使用者|
|POST|​/api​/users|註冊新使用者資料|
|GET|​/api​/users​/current_user|取得指定使用者資料|
|GET|​/api​/users​/{id}|取得指定使用者資料|
|PUT|​/api​/users​/{id}|修改指定使用者資料|
|GET|​/api​/users​/{id}​/tweets|取得指定使用者發出的所有推文|
|GET|​/api​/users​/{id}​/replied_tweets|取得指定使用者有回復的所有推文|
|GET|​/api​/users​/{id}​/likes|取得指定使用者喜歡的所有堆文|
|GET|​/api​/users​/{id}​/followings|取得指定使用者追隨中的使用者|
|GET|​/api​/users​/{id}​/followers|取得追隨指定使用者的所有使用者|

tweet(推特)
----
| 方法    | 事件名稱      | 內容|
| ---------- | -------   | ---|
|GET|​/api​/tweets|取得所有推文|
|POST|​/api​/tweets|發布推文|
|GET|​/api​/tweets​/{id}|取得指定推文的資料|
|GET|​/api​/tweets​/{id}​/replies|取得指定推文的所有留言|
|POST|​/api​/tweets​/{id}​/replies|回覆指定貼文|
|GET|​/api​/tweets​/{id}​/like|取得喜歡指定推文的所有使用者|

like (喜歡 or 不喜歡推文)
----
| 方法    | 事件名稱      | 內容|
| ---------- | -------   | ---|
|POST|​/api​/tweets​/{id}​/like|喜歡推文|
|POST|​/api​/tweets​/{id}​/unlike|取消喜歡推文|

Followships (追蹤 or 不追蹤 使用者)
----
| 方法    | 事件名稱      | 內容|
| ---------- | -------   | ---|
|POST|​/api​/followships|追蹤指定使用者|
|DELETE|​/api​/followships​/{id}|取消追蹤使用者|
____
## scoket 事件
### 公開聊天室
|    事件名稱    | 方法                | 內容|
| ---------- | -------                | ---|
|join_public_room|emit|加入公開聊天室  |
|get_public_history|emit|取得公開聊天室歷史紀錄  |
|online_users|on|取得在線在公開聊天室的所有使用者 | 
|post_public_msg|emit|公開聊天室傳送聊天訊息|  
|get_public_msg|on|接收公開聊天室的訊息  |
|new_join|on|接收剛進入公開聊天室的使用者  |
|user_leave|on|接收剛離開公開聊天室的使用者  |
|leave_public_room|emit|傳送離開工聊天室的訊息  |
### 私人聊天室
|    事件名稱    | 方法                | 內容|
| ---------- | -------                | ---|
|join_private_page	|emit| 進入私人訊息頁面|
| join_private_room	|emit| 傳送 加入與對象使用者的私人聊天室通知|
|join_private_room	|on|  接收 加入與對象使用者的私人聊天室通知|
|get_private_rooms	|emit| 取得使用者曾加入過聊過天的聊天室|
|get_private_history|	emit| 傳送指定聊天室的歷史訊息|
|post_private_msg	|emit| 傳送訊息到只釣私人聊天室|
|get_private_msg	|on| 接收私人聊天室訊息 |
| leave_private_page|	emit| 離開私人訊息頁面|
### 通知
|    事件名稱    | 方法                | 內容|
| ---------- | -------                | ---|
|get_msg_notice [常開]	|on| 接收未看的私訊人數|
| get_msg_notice_details	|on| 接收各個聊天室未看未讀的情形|
| update_msg_notice_details|	on| 接收新私訊的聊天室詳細資料|
| get_timeline_notice 	|on| 接收未察看的通知數量|
| update_timeline_notice[常開]	|on| 接收新傳送過來的通知|
| get_timeline_notice_details	|emit| 取得歷史通知的詳細內容|
| update_timeline_notice_detail	|on	|接收新傳送過來的通知詳細內容|
| join_timeline_page|	emit|傳送進入通頁頁面訊息|
| read_timeline 	|emit| 傳送已讀取該通知訊息|
| post_timeline	|emit|傳送通知|
|leave_timeline_page|	emit| 傳送離開通知頁面訊息|

### 後端協作者
|    name    | account                |
| ---------- | -------                | 
| ZHIH       | fufong79570@gmail.com  |
| Tailess    | https://github.com/Jennesy  |
