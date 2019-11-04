var router = require("express").Router();
var db = require('../db');

var multer = require('multer');
var path = require('path');
var storage = multer.diskStorage({

    destination: function (req, file, cb) {
        //指定存储路径
        cb(null, "./public/upload")
    },
    filename: function (req, file, cb) {
        console.log(file)
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});
var upload = multer({ storage: storage });
router.get('/get', function (req, res) {
    var keyword = req.query.keyword || "";

    db.query('select * from tb_category where Name like ? order by SortNum',
        ['%' + keyword + "%"],
        function (err, result) {
            if (err) {
                console.log(err);
                res.send({
                    success: false,
                    message: "服务内部错误"
                });
            } else {
                res.send({
                    success: true,
                    message: "请求成功",
                    rows: result
                })
            }
        })
});
module.exports = router;