# Simple Twitter API

前後端分離開發的Simple Twitter專案中使用的後端Restful API，使用Node.js, Express, MySQL開發。 

# Base URL

[https://pacific-mountain-24114.herokuapp.com/api](https://pacific-mountain-24114.herokuapp.com/api)


種子帳戶資料
```
  Admin
  Account: root
  Password: 12345678

  User
  Account: user1
  Password: 12345678
```

# How to Install API

###　需先安裝
* Git
* Node.js
* MySQL
* MySQL Workbench

### Clone專案到本地端
```
  $git clone https://github.com/naivelove0822/twitter-api-2020.git
```

### 安裝套件
```
  npm install
```

### 設定環境變數
請新增一個.env檔案，填入以下資訊，以確保API能順利運行。
```
  JWT_SECRET = <your_jwt_secret>;
  IMGUR_CLIENT_ID = <your_imgur_client_id>;
```

### 設定資料庫
1. 請在config資料夾的config.json填入資料庫資訊
```
  {
    "development": {
      "username": "root",
      "password": "<your_mysql_workbench_password>",
      "database": "forum",
      "host": "127.0.0.1",
      "dialect": "mysql"
    },
    "test": {
      "username": "root",
      "password": "<your_mysql_workbench_password>",
      "database": "forum_test",
      "host": "127.0.0.1",
      "dialect": "mysql",
      "logging": false
  }
```

2. 在MySQL Workbench中創建開發與測試用資料庫
```
  drop database if exists ac_twitter_workspace;
  create database ac_twitter_workspace;
  drop database if exists ac_twitter_workspace_test;
  create database ac_twitter_workspace_test;
```

3. 將專案裡的資料表設定傳送到MySQL Workbench
```
  npx sequelize db:migrate
```

### 設定種子資料
```
  npx sequelize db:seed:all
```
### 運行API
```
  npm run dev
```
出現此行文字 App listening on port 3000! 
代表運行成功

# 開發工具

* bcryptjs 2.4.3
* cors 2.8.5
* cross-env 7.0.3
* dotenv 10.0.0
* express 4.16.4
* express-session 1.15.6
* faker 5.5.3
* imgur 1.0.2
* jsonwebtoken 8.5.1
* method-override 3.0.0
* multer 1.4.4
* mysql2 1.6.4
* passport 0.4.1
* passport-jwt 4.0.0
* passport-local 1.0.0
* sequelize 6.18.0
* sequelize-cli 5.5.0

## 開發人員

* [Nathan](https://github.com/naivelove0822)
* [Hitomi](https://github.com/HitomiHuang)