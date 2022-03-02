# twitter-api-2022

<div id="top"></div>
<p>
  <a href="https://github.com/Prysline/S2A1_restaurant" target="_blank">
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  </a>
  <a href="https://github.com/Prysline/S2A1_restaurant/blob/main/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/Prysline/S2A1_restaurant.svg" />
  </a>
</p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>目錄 Table of Contents</summary>
  <ol>
    <li><a href="#建置環境-built-with">建置環境 Built With</a></li>
    <li>
      <a href="#入門-getting-started">入門 Getting Started</a>
      <ul>
        <li><a href="#前置-prerequisites">前置 Prerequisites</a></li>
        <li><a href="#安裝-installation">安裝 Installation</a></li>
      </ul>
    </li>
    <li><a href="#致謝-acknowledgments">致謝 Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## 建置環境 Built With

- [Node.js](https://nodejs.org/) (v14.17.0)
- [Express](https://expressjs.com/)
- [nodemon](https://www.npmjs.com/package/nodemon)
- [MySQL](https://downloads.mysql.com/archives/installer/) (v8.0.15)
- [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) (v8.0.15)
- [mysql2](https://www.npmjs.com/package/mysql2) (v1.6.4)
- [sequelize](https://sequelize.org/)
- [sequelize-cli](https://github.com/sequelize/cli)
- .env（環境變數設定檔案）

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->
## 入門 Getting Started

### 前置 Prerequisites

如果要使用 `npm run dev` 的指令，需先安裝 [nodemon](https://www.npmjs.com/package/nodemon)。

- nodemon

  ```sh
  npm install -g nodemon
  ```

所有新增、編輯、移除等關於資料庫的功能，均建立在使用 [mysql2](https://www.npmjs.com/package/mysql2) + [sequelize](https://sequelize.org/) 的環境下。

### 安裝 Installation

1. 在要安裝的位置開啟終端機(terminal) clone 專案檔案

   ```sh
   git clone https://github.com/xnubber/twitter-api-2020
   ```

2. 進入專案資料夾

   ```sh
   cd twitter-api-2020
   ```

3. 安裝所需套件

   ```sh
   npm install
   ```

4. 於 `/twitter-api-2020` 建立 `.env` 檔案，可複製 `.env.example` 加以修改，或是參考以下內容設定：

   ```
   PORT=3000
   JWT_SECRET=可自訂任意文字
   TOKEN_EXPIRES=1d    // 帳號登入後，token 自動無效化的時長
   IMGUR_CLIENT_ID=SKIP
   CALLBACK = http://localhost:3000/auth/facebook/callback
   ```
<details style="margin-left:2em;">
  <summary>沒有 IMGUR_CLIENT_ID ?</summary>
  <ol>
    <li>前往 <a href="https://api.imgur.com/oauth2/addclient">imgur - Register an Application</a> 填寫資訊</li>
    <li>於 <code>Authorization type:</code> 請選擇 <code>OAuth 2 authorization without a callback URL</code></li>
    <li>點選 <code>submit</code> 便可取得 <code>Client ID</code> 與 <code>Client Secret</code>
    </li>
  </ol>
  <p style="margin-left:2em; color: yellow;">※ 一旦關閉便無法再次檢視資訊，請務必紀錄後再關閉頁面</p>
</details>

5. 建立種子資料（需先連線 MySQL Server）

   ```sh
   npx sequelize db:seed:all
   ```

6. 使用 Node.js 執行 Express 伺服器（更新檔案時需要另外 ctrl+C 退出 Node.js 環境並重新啟動）

   ```sh
   npm run start
   ```

   或是使用 nodemon 執行 Express 伺服器（會在檔案變更時自動重啟伺服器，需安裝 nodemon）

   ```sh
   npm run dev
   ```

7. 所有 API 皆為 `http://localhost:3000/api/` 開頭

   細節可參考 [API文件](https://hackmd.io/@Boochu/r1Qn2AWl5/%2Fj2ROblOoSXyQ6IRTeX1luQ)

8. 可使用測試帳號登入

   ```
   #root
   account : root
   password : 12345678
   ```

   ```
   #user1
   email : user1
   password : 12345678
   ```

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->
## 致謝 Acknowledgments

- [ALPHAcamp](https://tw.alphacamp.co/)
- [Best-README-Template](https://github.com/othneildrew/Best-README-Template)
- [shields IO](https://shields.io/)

<p align="right">(<a href="#top">back to top</a>)</p>
