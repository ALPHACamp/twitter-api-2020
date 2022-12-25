# README

專案使用前後端分離為開發方式，做為社群網站Simple Twitter之API伺服器，API設計採用 RESTful 風格，提供前端需要之資料。

### 《API文件》<a href="https://docs.google.com/document/d/1ZPWK4DC5clLwaztv7IsGnENtYoDlPLDM93h_HO-Yat8/edit#heading=h.b6hco155xfw">API文件資料格式連結</a>

<p>&nbsp;</p>

# 專案使用方式

### 預設環境：
<ul>
<li>確認node安裝</li>
<li>確認Sequelize-Cli安裝</li>
<li>確認Sequelize安裝</li>
<li>確認mysql2安裝</li>
</ul>

<p>&nbsp;</p>

## 一、下載複製專案

[clone 專案]

```
$ git clone https://github.com/weizi0328/twitter-api-2020.git
```

## 二、初始化

### [Initialize]

```
npm install
```

### [設定資料庫]
《需要與 config/config.json 一致》

### [在MYSQL設定新增資料庫]
```
create database ac_twitter_workspace;
```

### [資料表建立]
```
$ npx sequelize-cli db:migrate
```

### [種子資料建立]
```
$ npx sequelize db:seed:undo:all
```

### [設定環境變數]
根據.env.example設定環境數變數


## 三、運行
```
npm run dev
```

## 測試帳號
[以下 2 組測試帳號]
* 第一組帳號為 admin 權限：
  * email: root@example.com
  * password: 12345678
* 第二組帳號為 user 權限：
  * email: user1@example.com
  * password: 12345678
