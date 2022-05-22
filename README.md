# Simple Twitter
* 復刻twitter而開發的一個迷你版社群平台，使用者可以發布推文、回覆推文、對貼文按like；也可跟隨其他使用者、瀏覽平台中最多人跟隨的popular users、和瀏覽其他使用者的個人頁面；也可編輯自己的個人頁面，像是更換頭像、封面照片，或是修改自己的個人資訊。

* 本專案採前後分離模式，此repo為後端的Web API。
  * [前端repo](https://github.com/Ansticefish/simple-twitter-front-end)
  * 前端夥伴：曉榆、Zoe
  
* 此repo包含自動化測試檔案，詳見下方使用說明。


<br />

## Live demo
* [專案連結:https://ansticefish.github.io/simple-twitter-front-end/#/signin](https://ansticefish.github.io/simple-twitter-front-end/#/home)
<br />

* 前台demo<br />
![demo1](https://media.giphy.com/media/XWshA2PiwIuLAmtEhw/giphy.gif)
<br />
<br />

* 後台demo<br />
![demo2](https://media.giphy.com/media/spdG3r7Vk33KKbzNZ3/giphy.gif)

<br />
測試帳號

|          |  account  | password  |
| ---------| --------- |:---------:|
|  使用者   |   user1   | 12345678  |
|  管理者   |   root    | 12345678  |


<br />

## 功能
- 使用者可以註冊帳號，登入、登出。
- 使用者可以發布推文、回覆推文及對推文按like。
- 使用者可以跟隨其他使用者、瀏覽平台內跟隨者最多的使用者清單。
- 使用者可以編輯自己的個人資訊、頭像、封面照片。更改自己的名稱、帳號、email及密碼。
- 使用者可以瀏覽其他使用者的個人頁面，內容包含該使用者的各項資訊：
    - 推文清單
    - 回覆清單
    - 按過like的推文清單
    - 跟隨者清單
    - 正在跟隨清單
- 只有管理者身份可以登入後台。
- 管理者可以：
  - 瀏覽所有推文、刪除推文。
  - 瀏覽所有使用者的社群活躍數據：
    - 推文數量
    - 正在跟隨人數
    - 跟隨者人數
    - 推文被like的數量



<br />

## 安裝與使用
1. 使用終端機(terminal)，使用以下指令將專案clone至本機：
```
git clone https://github.com/AngelaC123/twitter-api-2020.git
```

2. 進入專案資料夾
```
 cd twitter-api-2020
```
3.安裝專案所使用的套件：
```
npm install
```
4. 連結MySQL資料庫：
  - 在/config/config.json資料夾中，寫入正確的username、password及資料庫連線資訊。
  - 再至所使用的MySQL資料庫圖形介面軟體，使用以下指令建立兩個本專案所需之資料庫：
  
  ```
create database ac_twitter_workspace;
create database ac_twitter_workspace_test;
```
5. 成功建立資料庫後，回到終端機使用以下指令在資料庫建立tables：
```
npx sequelize db:migrate
```

6. 新增種子資料：
```
npx sequelize db:seed:all
```
7. 參照.env.exapmle，建立.env檔案：
```
JWT_SECRET=SKIP
IMGUR_CLIENT_ID=SKIP
```
8. 完成以上設定後，即可在開發模式下執行專案：
```
npm run dev
```
9. 當終端機出現以下訊息，代表執行成功：
```
Example app listening on port ${指定的port}!
```

10. 若要終止，請按下`ctrl + C`


<br />

## 測試檔使用
1. 在終端機中輸入以下指令，切換至test模式：
```
export NODE_ENV=test
```
2. 在資料庫中建立tables：
```
npx sequelize db:migrate
```

3. 新增種子資料：
```
npx sequelize db:seed:all
```

4. 執行測試檔：
```
npm run test
```

5. 在終端機中即可看見所有測試結果。

6. 若想執行單一測試檔，可使用以下指令：
```
npx mocha 測試檔路徑/.../...  --exit
```

<br />

## API 文件
* #### **[API文件](https://www.notion.so/API-Document-084c0ffd040f4ae497d4051f58a83e41)**

<br />

## 使用工具
* ### 環境與框架
"node.js":"16.14.2"<br />
"express": "^4.16.4"

* ### 資料庫
"mysql2": "^1.6.4"<br />
"sequelize": "^6.18.0"<br />
"sequelize-cli": "^5.5.0"

* ### 使用者驗證
"passport": "^0.4.0"<br />
"passport-jwt": "^4.0.0"<br />
"passport-local": "^1.0.0"<br />
"jsonwebtoken": "^8.5.1"

* ### 其它套件
"bcryptjs": "^2.4.3"<br />
"faker": "^4.1.0"<br />
"imgur": "^1.0.2"<br />
"method-override": "^3.0.0"<br />
"body-parser": "^1.18.3"<br />
"cors": "^2.8.5"<br />
"dotenv": "^10.0.0"<br />
"mocha": "^6.0.2"<br />
"multer": "^1.4.3"<br />
"chai": "^4.2.0"<br />
"sinon": "^10.0.0"<br />
"sinon-chai": "^3.3.0"

<br />

## 後端協作者
|    name  | GitHub                           | 
|----------|--------------------------------- |
|  Angela  |  https://github.com/AngelaC123   | 
|  Charles |  https://github.com/Kaminoikari  | 
