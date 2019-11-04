/**
 *
 * @api {get} /admin2/get  用户管理
 * @apiName get
 * @apiGroup admin2
 * @apiVersion  1.0.0
 *
 *
 * @apiParam  {string} keyword 所要搜索的内容
 *
 * @apiSuccess (请求成功状态200) {boolean} success 是否请求成功
 * @apiSuccess (请求成功状态200) {string} message 提示信息
 *
 *
 * @apiParamExample  {json} :
 * {
 *     "keyword" : "" ,
 * }
 *
 *
 * @apiSuccessExample {json} 响应示例:
 * {
 *
 *     "success" : true,
 *     "message" : "请求成功"
 * }
 *
 *
 */