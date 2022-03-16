
# Simple-twitter
 4 人團隊採前後分離的開發模式，在兩週內打造的簡易社群平台。


[![Framework](https://img.shields.io/badge/express-4.16.4-yellow.svg)](https://www.npmjs.com/package/express)
[![Database](https://img.shields.io/badge/Database-MYSQL-yellow.svg)](https://www.npmjs.com/package/mysql)

API URL: https://dzbr-alphatwitter.herokuapp.com
| <a href="https://basalt-nerve-0ff.notion.site/API-44c1f841134341c59846c42eab049329">API文件</a> 
| <a href="https://basalt-nerve-0ff.notion.site/postman-export-9ebbca32f21b4bfb84f833cba5a5dfcd">POSTMAN JSON檔案</a> 
  
  <a href="https://github.com/jj280385/Twitter-by-ALPHA-Camp">前端repo</a> 
 | <a href="https://jj280385.github.io/Twitter-by-ALPHA-Camp">demo</a> 
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
npm install  //安裝套件
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
後端：
[熊熊](https://github.com/ReoNaBear),
[Ronny Chiang](https://github.com/RonnyChiang)
  
 前端：
[ZORA CHEN](https://github.com/jj280385),
[Davis](https://github.com/Pudding1989)
## Screen Photo
<img width="1270" alt="截圖 2022-03-04 上午11 40 37" src="https://user-images.githubusercontent.com/43169057/158582265-9f216648-755b-4ebe-b78c-ccc122d0cd35.png">

## 版本更新 

## 使用工具
請參閱package.json
