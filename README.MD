# Simple Twitter API

### Demo 網址
[Simple-Twitter-Demo](https://chlin13.github.io/twitter-front-end)

### API URL
https://thawing-taiga-98720.herokuapp.com/api

### Demo 帳號
使用者可以使用以下帳號分別登入系統前台、後台。

## 前台測試帳號：
```
帳號: user1
email: user1@example.com
密碼: 12345678
```
## 後台測試帳號：

```
帳號: root
email: root@example.com
密碼: 12345678
```
## Installing-本地端專案建置
1. 請在終端機輸入

```
git clone https://github.com/CHLin13/twitter-api-2020.git
cd twitter-api-2020
npm install
```

2. 建立.env

```
PORT='3000'
JWT_SECRET=alphacamp
SESSION_SECRET=SECRET
IMGUR_CLIENT_ID=YOUR ID
```


3. 使用 MySQL Workbench 建立資料庫

```
create database ac_twitter_workspace;
```

4. 在終端機輸入以下指令，進行資料庫遷移、種子資料初始化

```
npx sequelize db:migrate
npx sequelize db:seed:all
```

5. 在終端機輸入以下指令，啟動後端專案
```
npm run dev
```

### 開發人員

> 後端
* [Lin CH](https://github.com/CHLin13)
* [Will](https://github.com/Will413028)

> 前端
* [minhsiung](https://github.com/mhsiungw)
* [DanLin](https://github.com/iita71737)
