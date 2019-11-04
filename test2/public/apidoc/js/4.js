/**
 *
 * @api {get} /ticket/get  门票管理
 * @apiName get
 * @apiGroup ticket
 * @apiVersion  1.0.0
 *
 *
 * @apiParam  {string} keyword 所要搜索的内容
 * @apiParam  {string} size 数据数量
 * @apiParam  {string} page 分页条数
 *
 * @apiSuccess (请求成功状态200) {boolean} success 是否请求成功
 * @apiSuccess (请求成功状态200) {string} message 提示信息
 *
 *
 * @apiParamExample  {json} :
 * {
 *     "keyword" : "" ,
 *     "size":"",
 *     "page":""
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