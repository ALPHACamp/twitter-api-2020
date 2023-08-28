# Simple Twitter API

* 一個簡易的twitter專案，提供使用者發文、回覆，以及喜歡和追蹤等和其他使用者互動的方式，並提供後台管理功能。
* 本專案為後端API部份，和Simple Twitter React[前端專案](https://github.com/u88872625/simple-twitter)共同使用才是完整專案。

## 功能說明

* 提供個人帳密註冊、登入、登出。
* 使用者可以維護個人基本資料、並可上傳自訂的頭貼和背景。
* 使用者可以發表推文以及回覆。
* 使用者可以追蹤其他使用者，也可以對其他使用者的推文按喜歡。
* 查看其他使用者資訊、發表的推文、回覆、追蹤中和追隨中的人等
* 提供推薦的使用者名單
* 後台管理功能：瀏覽全站使用者、瀏覽及刪除全站推文。


## 安裝與執行

1. 請先確認安裝有node.js及npm
2. 開啟終端機，進入專案目錄，並從github下載資料

```bash
> git clone https://github.com/AlanChiangg/twitter-api-2020.git
```

3. 安裝套件

```bash
> cd twitter-api-2020
> npm install
```

4. 設定環境變數: 在專案資料夾下的.env.example檔案名稱修改為.env，並填入你的JWT暗碼及IMGUR應用程式資料
```
SESSION_SECRET=<SESSION的暗碼>
JWT_SECRET=<JWT的暗碼>

# IMGUR相關
IMGUR_CLIENT_ID=<IMGUR應用程式的的ID>
IMGUR_CLIENT_SECRET=<IMGUR應用程式的的SECRET>
IMGUR_CLIENT_REFRESH_TOKEN=<IMGUR應用程式的的REFRESH_TOKEN>
IMGUR_ALBUM_ID=<自有IMGUR相簿的ID>
```

5. 設定資料庫：設定連線資訊。如果是開發環境，可直接在config.json中做設定，如果是佈署的情況，要設定對應的環境變數。
```
MYSQL_DATABASE_URL=<MySQL連線字串>
```
6. 如果是新資料庫，需要重新產生資料表結構
```bash
> npx sequelize db:migrate
```

5. 設定種子資料: 在終端機執行底下指令，匯入種子資料到資料庫裡
```bash
> npm run seed

```

6. 執行程式，啟動監聽

```
> npm run start
```

7. 啟動程式後，API即開始進行監聽。

## 提供的API列表

| 項次 |                 路由                 |                 功能                 |
|:---- |:------------------------------------|:------------------------------------ |
|      | 和sign up/sign in相關                |                                      |
| 1    | POST /api/users                      | 註冊帳號                             |
| 2    | POST /api/users/signin               | 登入前台帳號                         |
|      | 和User相關                           |                                      |
| 3    | GET /api/users/:id                   | 查看某使用者的資料                   |
| 4    | GET /api/users/:id/tweets            | 查看某使用者發過的推文               |
| 5    | GET /api/users/:id/replied_tweets    | 查看某使用者發過的回覆               |
| 6    | GET /api/users/:id/likes             | 查看某使用者點過like的推文           |
| 7    | GET /api/users/:id/followings        | 查看某使用者追蹤中的人               |
| 8    | GET /api/users/:id/followers         | 查看某使用者的追隨者                 |
| 9    | GET /api/users? {limit=10}           | 查看跟隨者數量排名(前10)的使用者資料 |
| 10   | PUT /api/users/:id                   | 編輯使用者資料                       |
|      | 和Followship相關                     |                                      |
| 11   | POST /api/followships                | 追蹤一個使用者                       |
| 12   | DELETE /api/followships/:followingId | 取消追蹤一個使用者                   |
|      | 和Tweet相關                          |                                      |
| 13   | GET /api/tweets                      | 查看所有的推文                       |
| 14   | GET /api/tweets/:id                  | 查看某一則貼文                       |
| 15   | POST /api/tweets                     | 發布一則推文                         |
|      | 和Reply相關                          |                                      |
| 16   | POST /api/tweets/:id/replies         | 發佈一則回覆                         |
| 17   | GET /api/tweets/:id/replies          | 查看某一則貼文的所有回文             |
|      | 和Like相關                           |                                      |
| 18   | POST /api/tweets/:id/like            | 喜歡一則推文                         |
| 19   | POST /api/tweets/:id/unlike          | 取消喜歡一則推文                     |
|      | 和後台管理相關                       |                                      |
| 20   | POST /api/admin/signin               | 登入後台帳號                         |
| 21   | GET /api/admin/users                 | 取得所有使用者清單                   |
| 22   | GET /api/admin/tweets                | 取得所有推文清單                     |
| 23   | DELETE /api/admin/tweets/:id         | 刪除特定推文                         |



## 開發環境與主要套件

* VS Code - 編程環境
* node.js / express.js@4.16.4 - 後端框架
* mysql2@1.6.4 / sequelize@6.18.0 - 資料庫管理
* jsonwebtoken@8.5.1 - 認證策略
* dayjs@1.11.9 - 時間格式化
* multer@1.4.5-lts.1 / imgur - 圖檔上傳

底下為開發中使用
* dotenv@16.0.3 - 管理環境變數
* eslint@8.36.0 - 代碼風格

## 作者

* [**江祐敏**](https://github.com/AlanChiangg)
* [**Eric Huang**](https://github.com/erikku54) 
* 前端專案： [**葉明荃**](https://github.com/u88872625)、[**YunJong**](https://github.com/Yunj0ng)