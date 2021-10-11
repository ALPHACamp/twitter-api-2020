# Simple Twitter API
此為前後端分離的專案：
[live demo](https://tzynwang.github.io/simple-twitter-frontend/)
# 專案畫面
![](https://i.imgur.com/xDaAxkB.jpg)
![](https://i.imgur.com/jXgvG67.jpg)
![](https://i.imgur.com/mcgrbEz.png)
![](https://i.imgur.com/tzIlhGr.png)

# 功能
前台：

* 使用者能新增推文、回覆推文、喜歡推文
* 使用者能追蹤其他使用者
* 使用者能編輯個人資料（上傳背景及大頭照）
* 公開聊天室
* 私人聊天室

後台：

* 管理員能刪除推文
* 管理員能看見所有推文
* 管理員能看見所有使用者數據
# 測試帳號
密碼皆為
```
12345678
```

admin:
```
root
```
user:(到user5)
```
user1
```

# MySQL設定
1.為了能正確group資料，請先至SQL workbranch將ONLY_FULL_GROUP_BY限制移除
查看是否有ONLY_FULL_GROUP_BY
```
SELECT @@sql_mode; 
```
如果有就移除：
```
SET @@SESSION.sql_mode="STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION";
```
---
2.因為專案有設定unique constarin，如有跳出index column size too large錯誤
請至SQL workbranch將Character Set改為utf8 （如下圖）

![](https://i.imgur.com/SUPtoKt.png)

3.於SQL workbranch建立schema，如要命名其他記得到config/config.js更改
```
ac_twitter_workspace //development
ac_twitter_workspace_test //test
```

# 啟動專案
下載專案到本地
```
git clone https://github.com/JHIH-LEI/twitter-api-2020
```
開啟終端機(Terminal)，進入存放此專案的資料夾
```
cd twitter-api-2020
```
下載套件
```
npm install
```

將.env.example改為.env

初始化資料庫
```
npx sequelize db:migrate
npm sequelize db:seed:all
```

啟動伺服器
```
npm run dev
```
在終端機看到以下字串代表伺服器建立成功：

Example app listening on port 3000!

測試
```
npm test
```

如需使用imgur，請先[註冊應用程式](https://api.imgur.com/oauth2/addclient)

[API文檔](https://app.apiary.io/twitter33)
