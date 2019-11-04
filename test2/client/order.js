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
    db.query('select * from tb_order where ContactName like ?',
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

router.post('/add',
    upload.single('file'), // 加入的处理环节
    function (req, res, next) {
        // console.log(req.body)
        if (true) {
            db.query(
                'insert into tb_order (`CustomerId`,`TicketId`,`Price`,`Quantity`,`Total`,`Mobile`,`ContactName`,`UseDate`,`Status`) values (?,?,?,?,?,?,?,?,?)',
                [req.loginId, req.body.id, req.body.price, req.body.number, req.body.total, req.body.mobile, req.body.name, req.body.date, "0"],
                function (err, result) {
                    if (err) {
                        res.send({
                            success: false,
                            message: "添加失败"
                        })
                    } else {
                        res.send({
                            success: true,
                            message: "添加成功"
                        })
                    }
                }

            );
         }
    });
module.exports = router;