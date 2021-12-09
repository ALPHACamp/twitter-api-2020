/**
* @api {POST} /api/users 一般使用者註冊
* @apiGroup User
* @apiVersion 1.0.0
* @apiDescription 一般使用者註冊
*
*@apiParam (參數) {String} account 登入帳號
*@apiParam (參數) {String} password 登入密碼
*@apiParam (參數) {String} name 登入姓名
*@apiParam (參數) {String} password 登入密碼
*@apiParam (參數) {String} checkPassword確認密碼
*@apiSuccessExample {json} Success-Response:
*{
*  "status": "success",
*  "message": "成功註冊!"
*}
*@apiSuccessExample {json} Error-Response1(任一欄位未填):
*{
* "status": "error",
* "message": "請輸入必填欄位!"
*}
*@apiSuccessExample {json} Error-Response1(email重複):
*{
* "status": "error",
* "message": "email已重覆註冊！!"
*}
*@apiSuccessExample {json} Error-Response1(account重複):
*{
* "status": "error",
* "message": "account已重覆註冊！!"
*}
*@apiSuccessExample {json} Error-Response1(確認密碼錯誤):
*{
* "status": "error",
* "message": "確認密碼輸入錯誤!"
*}
*/

/**
* @api {POST} /api/users/signin 一般使用者登入
* @apiGroup User
* @apiVersion 1.0.0
* @apiDescription 一般使用者登入
*
*@apiParam (參數) {String} account 登入帳號
*@apiParam (參數) {String} password 登入密碼
*@apiSuccessExample {json} Success-Response:
*{
* "status": "success",
* "message": "OK",
* "token": "token",
* "user": {
*     "id":Number(PK),
*     "name":string,
*     "account":string,
*     "email":string,
*     "role": Boolean
*          }
*}
*@apiSuccessExample {json} Error-Response1(帳號或密碼未填):
*{
* "status": "error",
* "message": "請輸入必填欄位!"
*}
*@apiSuccessExample {json} Error-Response1(未註冊帳號):
*{
* "status": "error",
*"message": "帳號不存在!"
*}
*/
