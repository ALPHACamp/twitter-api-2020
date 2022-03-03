# Simple-Twitter API

這是一個簡易版的推特(Twitter)專案，主要功能分別提供：
* 前台使用者
  1.發佈、瀏覽、回覆、喜歡推文(Tweet)
  2.追蹤其他使用者
  3.編輯個人資料
* 後台使用者
  1.看見所有使用者清單
  2.看見所有推文
  3.刪除使用者推文   

本專案主要技術包含：Node.js, Express, bcryptjs, passport, Sequelize, JWT，相關資訊請見以下：

## 使用流程
#### 複製專案到本機
git clone https://github.com/lcy101u/twitter-api-2020 
#### 進入專案資料夾
cd twitter-api-2020 
#### 安裝相關套件
npm install
#### 環境設定
依照 .env.example 中資訊範例設立 .env
#### 資料庫
create database ac_twitter_workspace
create database ac_twitter_workspace_test
npx sequelize db:migrate
npx sequelize db:seed:all

#### 啟動本地端伺服器
npm run dev

#### 測試帳號
* 後台 admin 
account: root
password: 12345678
* 一般使用者
account: user1
password: 12345678

## 環境建置
* Node.js(v16.14.0)
* Express
* MySQL
* sequelize
* sequelize-cli
* .env

## 相關資訊
[前端元件圖](https://docs.google.com/spreadsheets/d/1EgFcej3ymy3WLrhQAI4U8qpoZr4-kWYOJj0-q5Q8E34/edit#gid=2012444158)
[API 文件](https://hackmd.io/zzv3xsJ4Rpaj4evqL5Mezg?view)
[系統架構](https://docs.google.com/spreadsheets/d/1EgFcej3ymy3WLrhQAI4U8qpoZr4-kWYOJj0-q5Q8E34/edit#gid=1226065534)


## 本次專案人員
Abbie 前端
Miki  前端
Rain  後端
Kemal 後端

