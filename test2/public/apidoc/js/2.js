/**
 * 
 * @api {get} /category/get 门票分类管理
 * @apiName  get
 * @apiGroup category
 * @apiVersion  1.0.0
 * 
 * 
 * @apiParam  {string} keyword 所要搜索的内容
 * 
 * @apiSuccess (请求成功状态200) {boolean} success 是否请求成功
 * @apiSuccess (请求成功状态200) {string} message 提示信息
 * 
 * @apiSuccess (请求成功设置Cookie) {set-cookie} node_auth 设置cookie，值是签名过的用户名
 *
 * 
 * @apiParamExample  {json} 请求示例:
 * {
 *     "keyword" : "" ,
 * }
 * 
 * @apiSuccessExample {json} 响应示例:
 * {
 *     "success" : true,
 *     "message" : "登录成功"
 * }
 * 
 */