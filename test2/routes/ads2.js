var router = require("express").Router();
var db = require("../db");
var validator=require("../validator")
router.get('/get', function (req, res) {
    var keyword= req.query.keyword || "";
    //一共多少条数据
    //当页的数据
    db.query(`select * from tb_ads where Src like ?`,
        ['%' + keyword + "%"],
        function (err, result) {
            if (err) {
                console.log(err);
                res.send({
                    success: false,
                    message: "服务器内部错误"
                })
            } else {
                res.send({
                    success: true,
                    message: "请求成功",
                    rows: result,
                })
            }
        })

});

module.exports = router;