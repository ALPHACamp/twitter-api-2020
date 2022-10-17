# twitter-api-2020
ALPHA Camp | 學期 3 | Simple Twitter | 自動化測試檔 (前後分離組) 

前端頁面:https://github.com/yoyo030/simple-twitter

## 前置步驟
請先確認Node環境是否安裝正確，專案使用版本為![v14.16.0](https://nodejs.org/zh-tw/download/releases/)
確認方式
```bash
node -v
```
正確情況下會出現以下畫面:
```bash
v14.16.0
```

## 安裝步驟

1.下載專案至本地端
```bash
git clone https://github.com/Berutorion/twitter-api-2020.git
```

2.安裝專案所需套件
```bash
npm install
```
3.建立資料庫
於本地端創建好資料庫後在config/confing.json中輸入建好的資料庫資訊
(以開發環境為例)
```bash
 "development": {
    "username": <YourDataBaseUserName>,
    "password": <YourDataBasePassword>,
    "database": <YourDataBaseName>,
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
```
4.建立資料庫中的Table
```bash
npm run table
```
出現以下畫面表示成功:
```bash
Sequelize CLI [Node: 14.16.0, CLI: 5.5.1, ORM: 6.24.0]

Loaded configuration file "config\config.json".
Using environment "development".
== 20190115071418-create-followship: migrating =======
== 20190115071418-create-followship: migrated (0.047s)

== 20190115071419-create-like: migrating =======
== 20190115071419-create-like: migrated (0.024s)

== 20190115071420-create-reply: migrating =======
== 20190115071420-create-reply: migrated (0.024s)

== 20190115071420-create-tweet: migrating =======
== 20190115071420-create-tweet: migrated (0.022s)

== 20190115071421-create-user: migrating =======
== 20190115071421-create-user: migrated (0.024s)
```
5.建立種子資料
```bash 
npm run seed
``` 
出現以下畫面表示成功:
```bash
Sequelize CLI [Node: 14.16.0, CLI: 5.5.1, ORM: 6.24.0]

Loaded configuration file "config\config.json".
Using environment "development".
== 20221005102538-User-seeder: migrating =======
== 20221005102538-User-seeder: migrated (1.380s)

== 20221005104233-Tweet-seeder: migrating =======
== 20221005104233-Tweet-seeder: migrated (4.823s)

== 20221005114927-Reply-seeder: migrating =======
== 20221005114927-Reply-seeder: migrated (0.052s)
```

6.輸入環境變數(.env)
```bash 
IMGUR_CLIENT=<YourImgurClientID> 
JWT_SECRET=<YourJWTSecret>
CORS_ORIGIN_OPTION=<YourCrosOriginURL> //only allow string
``` 

7.執行伺服器
```bash
npm run start
```
出現以下畫面表示成功:
```bash
Example app listening on port 3000!
```
