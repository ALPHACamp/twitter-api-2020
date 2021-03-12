## Simple Twitter
---

## 專案功能介紹
---
待補


## 專案初始化
---
##### 1.先下載專案至本地 並 下載套件
```
    git clone https://github.com/a9540907/twitter-api-2020.git
    npm install
```
#####  2.設定MySQL資料庫(需要與 config/config.json 一致) 與 種子資料，並執行以下項目:
```
   npx sequelize db：migrate 
   npx sequelize db：seed：all  (載入種子資料)
```

#####  3.新增.env檔
```
   JWT_SECRET=your_JWT_SECRET
   IMGUR_CLIENT_ID=your_client_id
```
##### 4. 執行專案
```
   npm run dev
```
## 測試帳號
- Account: user1 ~ user5
- Password: 12345678


## 共同開發人員
---
- [Stan_wang](https://github.com/a9540907)
- [Goater1095](https://github.com/Goater1095)