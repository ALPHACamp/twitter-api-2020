<h1 align="center">
  <img  src="https://i.imgur.com/cZjfegs.png?1" >
</h1>

<h1 align="center"><a href="https://jackjackhuo.github.io/twitter-vue/#/login">Live Demo</a></h1>
  
<p align="center">
  
  <img src="https://img.shields.io/github/v/release/navendu-pottekkat/awesome-readme?include_prereleases" >
  
  <img src="https://img.shields.io/github/last-commit/rayray1010/twitter-api-2020" >

  <img src="https://img.shields.io/badge/express-4.16.4-green.svg" >
  
  <img src="https://img.shields.io/badge/Database-MYSQL-yellowgreen.svg">
  
  <img src="https://img.shields.io/github/issues-pr-closed/rayray1010/twitter-api-2020">

  </p>



# Simple-twitter
參考Twitter開發的小型專案，提供前端開發者API。(包含瀏覽貼文、創建推文、修改基本資料...，並提供互相追蹤的功能)
(<a href="https://twitter101.herokuapp.com/">線上API連結</a>)



# 目錄
- [功能介紹](#功能介紹)
- [使用方式](#使用方式)
- [安裝流程](#安裝流程)
- [種子資料](#種子資料)
- [相關資料](#相關資料)
- [共同開發者](#共同開發者)



# 功能介紹
  * 提供使用者登入、登出及註冊帳號功能
    * 網站具備JWT驗證功能 
    * 使用者無法註冊管理員帳號
  * 提供瀏覽資訊
    * 全部推文、使用者追蹤人數、推文的留言及LIKE數量...
    * 提供使用者裡追蹤人數最高的TOP10
  * 提供使用者功能
    * 使用者可以修改個人資料(account、email、password...)
    * 新增、回覆、LIKE推文
    * 使用者互相追蹤功能 
  * 提供後臺管理員功能
    * 可以瀏覽所有使用者資訊(tweet數量、like數量...)
    * 可以刪除特定貼文



# 使用方式

  請先下載<a href="https://drive.google.com/file/d/1DUylRjruDhiZ_F1q0kbgpphFfZZHBy-z/view?usp=sharing">Postman設定檔</a>，檔案提供所有路由及回傳的資料形式。

<table>
  <tr>
    <td vlign="center"><img src="https://cdn.discordapp.com/attachments/899218006926831670/918564399332077618/unknown.png"></td>
  </tr>
</table>



# 安裝流程

* `後端部分(Express)`: 
  * 利用終端機(Terminal)，Clone專案至目標位置
    ```
    git clone https://github.com/rayray1010/twitter-api-2020
    ```

  * 進入專案資料夾後，安裝 npm packages
    ```
    npm install
    ```
    
  * 將環境變數載入
    ```
    將資料夾內'.env.example'檔案名稱改為'.env'
    ```
    
  * 請在MySQL Workbench，建立SQL資料庫
    ```
    create database ac_twitter_workspace
    ```
    
  * 載入model
    ```
    npx sequelize db:migrate
    ```
    
  * 載入種子資料
    ```
    npx sequelize db:seed:all
    ```

  * 開啟伺服器
    ```
    npm run dev
    ```


    
# 種子資料
  ```
  account: root
  email: root@example.com
  password: 12345678
  role: admin
  ```

  ```
  account: user1
  email: user1@example.com
  password: 12345678
  role: user
  ```
  
  
  
# 相關資料
  * `前端Front-end(Vue框架):`
    <a href="https://github.com/LuciusPook/twitter-vue">GitHub</a> / 
    <a href="https://jackjackhuo.github.io/twitter-vue/#/main">線上DEMO</a>
  * `後端Back-end(Express框架):`
    <a href="https://github.com/rayray1010/twitter-api-2020">GitHub</a> / 
    <a href="https://twitter101.herokuapp.com/">線上API</a>
  
  
# 共同開發者
<table>
  <tr>
    <td align="center"><a href="https://github.com/rayray1010"><img src="https://avatars.githubusercontent.com/u/83641396?v=4" width="100px;" alt=""/><br /><sub><b>rayray1010🤔</b></sub></td> 
    <td align="center"><a href="https://github.com/TimZXJ"><img src="https://avatars.githubusercontent.com/u/87890303?s=400&u=aa66beac57ab89e4914f98a73909df78d4469d4e&v=4" width="100px;" alt=""/><br /><sub><b>TimZXJ🤔</b></sub></td> 
    <td align="center"><a href="https://github.com/JackJackHuo"><img src="https://avatars.githubusercontent.com/u/86769801?v=4" width="100px;" alt=""/><br /><sub><b>JackJackHuo🤔</b></sub></td>
    <td align="center"><a href="https://github.com/LuciusPook"><img src="https://avatars.githubusercontent.com/u/86637886?v=4" width="100px;" alt=""/><br /><sub><b>LuciusPook🤔</b></sub></td>
  </tr>
</table>
 
