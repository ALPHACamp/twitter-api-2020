# Alphitter
# 專案名稱 Alphitter
Alphitter is a platform  for user to share their life with their friends
Alphitter 是一個模擬Twitter的社交媒體平台，使用者可以於平台中，和自己的朋友分享生活。

## Feature

you can login to this platform  from  user login and admin login page
you can set up your user access with account, name, email, password
if you need a admin access, we only allow to set it up from  database

## 功能介紹
此平台分為前台登入與後台登入，使用者可透過註冊個人帳號登入前台，而後台為具備管理員身分做登入，一般使用者帳號不可以登入後台，管理員帳號不可登入於前台。
使用者可以註冊一個帳號內容包含：專屬個人帳號、個人信箱、名稱、及專屬密碼。
後台管理員帳號為工程師指定，無法透過註冊登入。


As a user, you should be able to 


- set up your personal profile including account, name, upload your cover photo and avatar and give an short introduction about yourself
- you can like/unlike a post
- you can follow the account you find interested in
- you can navigate to others profile and check all of their post and their following and followers
- on the landing page, you can see the top 10 user which have most followers 
- you can view all of your tweets, replies, liked post in one page

一般使用你可以


- 設定個人介面包含帳號、名稱、上傳個人的大頭照與背景圖示，可以修改自己的自我介紹
- 對任意一篇推文按下喜歡或是取消喜歡
- 追蹤一個你有興趣的使用者或是取消追蹤一個使用者
- 隨意導覽任何一個使用者的個人簡介，包含其使用者的所有推文及被追蹤的總數字和正在追蹤別人的總數字
- 進入首頁使用者可以看見系統推薦的排名前10位的跟隨者名單
- 進入首頁使用者可以看見所有的推文，其推文的回覆內容和是否被按下喜歡
- 任意發出一篇推文，其推文可以被該使用者或其他使用者觀看且回覆和按下喜歡或取消喜歡


As a admin user, you should be able to 

- monitor user activities on the platform including how many followers they have and how many likes they received on their posts
- view and delete a tweet

擁有管理者權限

- 可以在後台觀察所有使用者活動的數據分析，包含該名使用者的追蹤總數量、推文總數量、其推文收到的喜歡總數量
- 可以觀看目前平台的所有推文，可以刪除任一篇推文。

## Getting Started

Clone repository https://github.com/paulchnag0801/twitter-api-2020.git

    git clone 

Install Dependancies

    npm install

Spin up server

**if you have nodemon**

    npm run dev

**if you dont have nodemon**

    npm run start

The website should start running on

    http://localhost:3000/

Set up .env file

    please change .env.example to .env and change the SKIP parameter to your own credentials

## Set up data base

In this project, we use MySQL

Create database in MySQL

`create database ac_twitter_workspace;`

Set up data base

    npx seqeulize db:migrate

Set up seed 

    npx sequelize db:seed:all

## User login

we provide both user and admin access. Please use below login to test user and admin feature
我們提供已經註冊好的使用者帳號及密碼，及後台管理員的帳號和密碼。

| Role | User account | Password |
| ----------- | ----------- | ----------- |
| Admin | root | 12345678 |
| User | user1 | 1 |

## Author

Heidi Chen
Paul Chang
白白
Weikai