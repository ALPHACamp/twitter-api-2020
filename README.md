# Simple Twitter API
本專案為前、後端分離之團隊開發專案，模擬簡易社群網站之開發，此部分Repository專為處理使用者發送之請求、依據需求回傳資料庫內的相關JSON格式資料。


## Features 產品功能
* 使用者能註冊/登入帳戶（帳號、信箱不可重複）
* 使用者需輸入帳號、密碼，進行登入
* 使用者可修改帳號資料、照片、背景及自我介紹
* 使用者能檢視所有推文/回覆
* 使用者可新增推文/回覆指定推文
* 使用者能追隨/取消追隨另一位使用者
* 使用者可以喜歡/取消喜歡一則推文
* 使用者能檢視所有使用者資訊
* 管理者可查看/刪除貼文、瀏覽所有使用者

## Environment Setup 環境建置
* Node.js
* express
* mysql2
* sequelize
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

5. 使用MySQL介面程式，建立資料庫，並設定資料庫相關資訊與config/config.json一致
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
npm run start
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

user3
  account: user3
  password: 12345678

user4
  account: user4
  password: 12345678

user5
  account: user5
  password: 12345678
```

## Related Links 相關連結
### 前端
[Github](https://github.com/Joy-Chang-2021/Twitter_project.git) <br>
[Github Page](https://joy-chang-2021.github.io/Twitter_project/) <br>

### API佈署網站

[Heroku](https://thawing-citadel-19528.herokuapp.com/)


## Contributor 專案開發人員
[Joy-Chang](https://github.com/Joy-Chang-2021)<br>
[MuChuan-Hung](https://github.com/muchuanhung)<br>
[Lun](https://github.com/zheRoom)<br>
[Lena](https://github.com/hmrvc) <br>
[deansyue](https://github.com/deansyue)