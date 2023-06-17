# Simple Twitter API
* 本專案是採用 RESTful 理念設計 的 API，讓使用者可以透過 API 在平台上發表意見與跟其他使用者互動。
* 本專案的開發方式為前後分離，而本專案是一個 API 伺服器
* [前端 Repo](https://github.com/JUJUCW/simple_twitter)
<br />

## 安裝與使用
1.  打開 terminal，本專案 clone 至本地
```
git clone https://github.com/jiawu777/twitter-api-2020.git
```

2. 進入專案資料夾，請在終端機輸入：
```
cd twitter-api-2023
```

3. 安裝所需套件
```
npm install
```
4. 用 Visual Studio Code 打開本專案
```
code .
```

5. 將本地資料庫的 username、password 與 /config/config.json 中的 development 的參數設定一致。
```
"development": {
  "username": "root", // 設定此項
  "password": "password", // 設定此項
  "database": "ac_twitter_workspace",
  "host": "127.0.0.1",
  "dialect": "mysql"
}
```

6. 建立資料庫 [ 在 MySQL Workbench 的 Query 介面輸入 ]
```
create database ac_twitter_workspace;
create database ac_twitter_workspace_test;
```
7. 建立資料表 
```
npx sequelize db:migrate
```
8. 建立種子資料
```
npx sequelize db:seed:all
```
9. 建立檔案 .env 並設定環境變數，參考 .env.example
```
IMGUR_CLIENT_ID=
JWT_SECRET=
```
10. 啟動伺服器
```
npm run dev
```
顯示 ```Simple Twitter app listening on port 3000!```，表示啟動成功。

11. 輸入下列代碼於**網址列**即可使用
```
localhost:3000
```
12. 若要停止專案請在終端機按 Ctrl+C
<br />

## 測試帳號
```
管理者
Account: root
Password: 12345678

一般使用者
Account: user1
Password: 12345678
```

## API 文件
[文件連結](https://reurl.cc/GAAz7y)
<br />

## 網站連結
[網站連結](https://jujucw.github.io/simple_twitter/)

## 專案開發人員
### 前端： [Hank](https://github.com/HankHsuABoo), [Ju](https://github.com/JUJUCW)
### 後端： [YGJ](https://github.com/etandmouse), [忠全](https://github.com/popojk)