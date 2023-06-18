# Simple Twitter API

## API URL

[https://twitter-azx79115.herokuapp.com/api]

## 功能

- 使用者可以註冊/登入帳號
- 使用者可以檢視特定使用者個人資訊及其推文/留言/喜歡的推文
- 使用者可以編輯個人及帳號資訊
- 使用者可以檢視所有推文
- 使用者可以新增/留言/喜歡/收回喜歡一則推文
- 使用者可以追蹤/取消追蹤一則推文
- 後台帳號可以瀏覽全部推文及所有使用者
- 後台帳號可以刪除一則推文

## 測試種子資料

- 可使用下方帳號分別登入前台及後台

### User account

```
{
  "account": "user1",
  "password": "12345678"
}
{
  "account": "user2",
  "password": "12345678"
}
{
  "account": "user3",
  "password": "12345678"
}
{
  "account": "user4",
  "password": "12345678"
}
{
  "account": "user5",
  "password": "12345678"
}
```

### Admin account

```
{
  "account": "root",
  "password": "12345678"
}
```

## 本地端專案建置

1. 使用終端機將專案 clone 至本地

2. 進入專案資料夾(twitter-api-2020)

3. 安裝相關套件

4. 建立.env 並參考.env.example，放入環境變數

5. 開啟./config/config.json 檔案，修改成本地使用的帳號密碼

```
{
  "development": {
    "username": "<your_mysql_workbench_name>",
    "password": "<your_mysql_workbench_password>",
    "database": "ac_twitter_workspace",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "<your_mysql_workbench_name>",
    "password": "<your_mysql_workbench_password>",
    "database": "ac_twitter_workspace_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging": false
  },
  ...
}
```

6. 使用 MySQL Workbench 建立資料庫

```
drop database if exists ac_twitter_workspace;
create database ac_twitter_workspace;
drop database if exists ac_twitter_workspace_test; //測試檔用
create database ac_twitter_workspace_test;
```

7. 建立資料庫模型

```
npx sequelize db:migrate
```

8. 建立種子資料

```
npx sequelize db:seed:all
```

9. 啟動伺服器

```
npm run dev
```

10. 在終端機看到以下字串代表伺服器建立成功

```
Example app listening on port 3000!
```

## 自動化測試

1. 更改環境名稱

```
export NODE_ENV=test
```

2. 執行自動化測試(所有檔案)

```
npm run test
```

3. 執行自動化測試(特定檔案)，例如：

```
npx mocha test/models/User.spec.js --exit
```
