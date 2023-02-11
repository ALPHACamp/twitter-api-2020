# Simple Twitter API
* Simple Twitter 是復刻 Twitter 的練習專案，使用者可以在平台上發表自己的意見並與其他使用者互動。
* 專案的開發方式為前後分離，此 Repo 為後端的 Web API
* [前端 Repo](https://github.com/kignite/simple-twitter-frontend)
<br />

## 安裝與使用
1. Clone 此專案至本機電腦，打開 terminal 至欲存放專案之資料夾，輸入：
```
git clone https://github.com/HowardWu5566/twitter-api
```
2. 進入專案資料夾，請在終端機輸入：
```
cd twitter-api
```
3. 安裝 npm 套件，請在終端機輸入：
```
npm install
```
4. 依據 .env.example 建立 .env 檔案
<br>

5. 到 MySQL Workbench 建立專案資料庫  
```
create database ac_twitter_workspace character set utf8mb4 collate utf8mb4_unicode_ci;
create database ac_twitter_workspace_test character set utf8mb4 collate utf8mb4_unicode_ci;
```
6. 在資料庫建立 tables，請在終端機輸入：
```
npx sequelize db:migrate
```
7. (非必要) 新增種子資料：
```
npm run seed
```
8. 啟動專案，請在終端機輸入：
```
npm run dev
```
9. 輸入下列代碼於**網址列**即可使用
```
localhost:3000
```
10. 要停止專案請在終端機按 Ctrl+C
<br />

## 功能
若您有執行上述步驟 7.新增種子資料，可使用以下帳號登入
| 身分 | 帳號 | 密碼 |
| - | - | - |
| 一般使用者 | user1 | 12345678 |
| 後台管理者 | root | 12345678 |

### 一般使用者
* 可以註冊、登入、登出  
* 註冊時可設定帳號、名稱、email 和密碼  
* 登入後能：
  * 在首頁瀏覽所有的推文
  * 新增推文
  * 回覆推文
  * 查看推文內容及回覆
  * 對推文按 Like / Unlike
  * 查看任意使用者：
    * 新增的推文
    * 回覆過的推文
    * 按 like 的推文
    * 關注清單
    * 跟隨者清單
  * 追蹤 / 取消追蹤其他使用者
  * 查看追蹤數最高的 10 位使用者
  * 修改自己的名稱、自我介紹、大頭照與個人頁橫幅背景
  * 修改自己的帳號、名稱、email 與密碼 

### 後台管理者
* 可以登入網站後台
* 可以在後台瀏覽全站推文的部分內容
* 管理者可以在清單上直接刪除任何人的推文
* 管理者可以瀏覽站內所有使用者的清單，清單的資訊包括使用者社群活躍數據：  
  * 推文數量
  * 推文被 like 的數量
  * 關注人數
  * 跟隨者人數
<br />

## API文件
[文件連結](https://howhowchen.docs.apiary.io/#reference/0/user)
<br />

## 開發者
後端 <br>
[Howhow Chen](https://github.com/HowhowChen) <br>
Howard Wu <br>
<br>
前端 <br>
[Peggy](https://github.com/Peggy8422) <br>
[Leo](https://github.com/kignite)