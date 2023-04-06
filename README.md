# Simple Twitter API
此專案提供 API 給 [Simple Twitter](https://gino-hsu.github.io/simple-twitter/) 使用。

您可以使用以下帳戶登入:
| system     | account | password |
| ---------- | ------- | -------- |
| 後台       | root    | 12345678 |
| 前台       | user1   | 12345678 |

- 查看 [ 前端 Repo](https://github.com/Gino-Hsu/simple-twitter)。

## 產品功能

### 後台（管理者）
- 登入後可查看所有使用者資訊
- 查看所有推文，並刪除推文

### 前台（一般使用者）
- 註冊並登入
- 編輯使用者個人帳戶設定，以及個人資料
- 新增推文、回覆
- 瀏覽全部推文
- 瀏覽一則推文中的全部回覆
- 可以 like / unlike 單則推文
- 可以 follow / unfollow 其他使用者
- 取得使用者個人介面：查看該使用者所有推文、回覆、喜歡的推文，以及跟隨者、關注者名單
- 查看推薦跟隨的前十大名單 

## 安裝流程

0. 安裝 Node.js@14.16.0 、 npm、 及 MySQL

1. Clone 專案至本機電腦

```
git clone https://github.com/seanlin1125/twitter-api-2022.git
```

2. 安裝專案套件

```
npm install
```

3. 安裝 nodemon 

```
npm install nodemon
```

4. 根據 .env.example 設定環境變數在新增的 .env 檔案 

```
touch .env
```

5. 在 config.json 中設定自己的 MySQL 配置

```
"development": {
    "username": "<使用者名稱>",
    "password": "<使用者密碼>",
    "database": "<資料庫名稱>",
    "host": "127.0.0.1",
    "dialect": "mysql"
}
```

6. 建立資料庫後執行migration創建資料表。並導入種子資料(若需要)

```
npx sequelize db:migrate
npx sequelize db:seed:all
```

7. 執行專案

```
npm run dev
```

8. 看到以下訊息表示執行成功！

```
Example app listening on port 3000!
```

## Routes Table and API Doc
- [完整 API 文件](https://www.notion.so/API-97143e51c9b942e581c492980639f125)。
 
| Feature                       | Method | Route                                          |
| ----------------------------- | ------ | ---------------------------------------------- |
| **Admin**                     |        |                                                |
| 後台使用者登入                  | POST   | /api/admin/signin                              |
| 取得所有使用者的資料             | GET    | /api/admin/users                               |
| 取得所有貼文                    | GET    | /api/admin/tweets                              |
| 刪除特定推文                    | DELETE | /api/admin/tweets/:id                          |
| **User**                      |        |                                                |
| 前台使用者註冊                  | POST   | /api/users                                     |
| 前台使用者登入                  | POST   | /api/users/signin                              |
| 取得當前登入使用者的資料          | GET    | /api/current_user                              |
| 取得特定使用者個人資料            | GET    | /api/users/:id                                 |
| 取得使用者發過的所有推文          | GET    | /api/users/:id/tweets                          |
| 取得使用者發過的所有回覆          | GET    | /api/users/:id/replied_tweets                  |
| 取得使用者喜歡的推文             | GET    | /api/users/:id/likes                            |
| 取得使用者正在跟隨的名單          | GET    | /api/users/:id/followings                       |
| 取得正在跟隨使用者的名單          | GET    | /api/users/:id/followers                        |
| 修改個人資料                    | PUT    | /api/users/:id                                  |
| 修改個人帳號設定                 | PUT    | /api/users/:id/setting                          |
| 移除使用者封面照片               | PATCH  | /api/users/:id/cover                            |
| **Tweet**                     |        |                                                 |
| 新增推文                       | POST   | /api/tweets                                     |
| 取得所有推文                    | GET    | /api/tweets                                     |
| 取得特定推文                    | GET    | /api/tweets/:tweet_id                                 |
| **Reply**                     |        |                                                 |
| 在特定推文新增回覆               | POST   | /api/tweets/:tweet_id/replies                   |
| 取得特定推文的所有回覆            | GET    | /api/tweets/:tweet_id/replies                   |
| **Like**                      |        |                                                 |
| 將推文加入喜歡                  | POST   | /api/tweets/:id/like                            |
| 將推文移除喜歡                  | POST   | /api/tweets/:id/unlike                          |
| **Followship**                |        |                                                 |
| 新增跟隨                       | POST   | /api/followships                                 |
| 取消跟隨                       | DELETE | /api/followships/:followingId                    |
| 推薦跟隨名單                    | GET    | /api/followships/top                             |
