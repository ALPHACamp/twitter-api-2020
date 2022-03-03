# Simple Twitter API
此專案為處理前端使用者所傳送過來的Request，並回傳所需的Twitter資料庫的相關JSON格式資料


## Features 產品功能
* 使用者能註冊/登入帳戶
* 使用者能檢視所有推文/回覆
* 使用者能追隨/取消追隨另一位使用者
* 使用者可以喜歡/取消喜歡一則推文
* 使用者能檢視另一位使用者資訊
* 管理者可查看/刪除貼文、瀏覽所有使用者

## Environment Setup 環境建置
* Node.js
* Express
* MySQL
* Sequelize
* passport-jwt

## Installing 專案安裝流程
1. 打開您的終端機(terminal)，複製(clone)專案至本機
```
git clone https://github.com/hmrvc/twitter-api-2020.git
```

2. 進入存放此專案資料夾
```
cd twitter-api-2020
```

3. 安裝npm套件
```
npm install
```

4. 將.env.example 改為.env，並設定為自己的資料
```
JWT_SECRET=SKIP
IMGUR_CLIENT_ID=SKIP
```

5. 使用SQL應用程式，建立資料庫，並設定資料庫相關資訊與config/config.json一致
```
create database ac_twitter_workspace;
```

6. 建立資料表
```
npx sequelize db:migrate
```

7. 創建種子資料
```
npx sequelize db:seed:all
```

8. 使用腳本，即可啟動伺服器
```
npm run dev
```

9. 當終端機(terminal)出現以下文字，代表伺服器已啟動
```
Example app listening on port !
```

## 種子資料使用者
可使用種子資料新增的使用者操作本專案

### 後台帳號：
```
admin
  account: root
  password: 12345678
```

### 前台帳號：
```
user1
  account: user1
  password: 12345678

user2
  account: user2
  password: 12345678
```

## Contributor 專案開發人員
[Lena](https://github.com/hmrvc) <br>
[deansyue](https://github.com/deansyue)