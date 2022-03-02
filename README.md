
# Simple-twitter
模擬Twitter開發的專案，提供前端開發者API。


[![Framework](https://img.shields.io/badge/express-4.16.4-yellow.svg)](https://www.npmjs.com/package/express)
[![Database](https://img.shields.io/badge/Database-MYSQL-yellow.svg)](https://www.npmjs.com/package/mysql)

(<a href="https://dzbr-alphatwitter.herokuapp.com">API連結</a>)
(<a href="https://basalt-nerve-0ff.notion.site/API-44c1f841134341c59846c42eab049329">API文件</a>)
(<a href="https://basalt-nerve-0ff.notion.site/postman-export-9ebbca32f21b4bfb84f833cba5a5dfcd">POSTMAN JSON檔案</a>)

## 功能介紹
  * 提供使用者登入、登出及註冊帳號功能
    * 網站具備JWT驗證功能 
    * 後台無法自行註冊
  * 提供瀏覽資訊
    * 全部推文、使用者追蹤人數、推文的留言及喜歡等資訊
    * 提供追蹤人數最高的TOP10使用者
  * 提供使用者功能
    * 使用者可以修改個人資料(account, email, password, introudction)
    * 上傳個人頭像及封面照片(透過imgur)
    * 可以新增、回覆、LIKE推文
    * 使用者互相追蹤功能 
  * 提供後台管理員功能
    * 可以瀏覽所有使用者資訊(tweet數量、like數量及追蹤數)
    * 可以瀏覽所有貼文
    * 可以刪除貼文

## 安裝

1.開啟終端機(Terminal)cd 到存放專案本機位置並執行:

```
git clone https://github.com/RonnyChiang/twitter-api-2020.git
```

2.初始

```
cd twitter-api-2020 //切至專案資料夾
```

```
npm install  //安裝套件
```

```
npm install nodemon   // 另行安裝nodemon
``` 

```
將資料夾內'.env.example'檔案名稱改為'.env'
```


3.請在MySQL Workbench，建立SQL資料庫

```
create database ac_twitter_workspace
```

```
npx sequelize db:migrate   // 載入模組
```

```
npx sequelize db:seed:all  // 載入種子資料 
```

4.開啟程式

```
npm run dev
```
當終端機(terminal)出現以下文字，代表伺服器已啟動
```
Example app listening on port 3000!
```
若要暫停使用
```
ctrl + c
```
## 種子資料資訊
1.後台帳號
  ```
  account: root
  email: root@example.com
  password: 12345678
  role: admin
  ```
2.前台帳號
  ```
  account: user1
  email: user1@example.com
  password: 12345678
  role: user
  ```

環境變數請參閱 env.example

# 專案開發人員
[熊熊](https://github.com/ReoNaBear),
[Ronny Chiang](https://github.com/RonnyChiang)

## Screen Photo

## 版本更新 

## 使用工具
請參閱package.json
