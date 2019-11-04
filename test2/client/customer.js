var router = require("express").Router();
var db = require("../db");
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
    db.query('select * from tb_customer where Id like ?',
        [req.loginId],
        function (err, result) {
            console.log(result)
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
                    rows: result,
                    lid: req.loginId,
                    
                })
            }
        })
});
router.get('/get2', function (req, res) {
    db.query('select * from tb_customer where Id like ?',
        [req.loginId],
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
                    lid: req.loginId,
                    rows: result
                })
            }
        })
});
router.post('/edit', upload.single('file'),
    function (req, res, next) {
       console.log(req.body) 
        if (req.file) {
            db.query('update tb_customer set `Province`=?,`City`=?,AvatarUrl=? where `Id`=? ',

                [req.body.province, req.body.cityname, "/upload/" + req.file.filename, req.loginId],
                function (err, result) {
                    if (err) {
                        console.log(err);
                        res.send({
                            success: false,
                            message: "修改失败"
                        });
                    } else {
                        if (result.affectedRows > 0) {
                            res.send({
                                success: true,
                                message: "修改成功",
                            })
                        } else {
                            res.send({
                                success: false,
                                message: "没有找到要修改的数据",
                            })
                        }
                    }
                }
            )
        } else {
            db.query('update tb_customer set `NickName`=?,`Province`=?,`City`=? where `Id`=? ',           
                [req.body.name, req.body.province, req.body.cityname, req.loginId],
                function (err, result) {
                    if (err) {
                        console.log(err);
                        res.send({
                            success: false,
                            message: "修改失败"
                        });
                    } else {
                        if (result.affectedRows > 0) {
                            res.send({
                                success: true,
                                message: "修改成功",
                            })
                        } else {
                            res.send({
                                success: false,
                                message: "没有找到要修改的数据",    
                            })
                        }
                    }
                }
            )
        }
    }
);
module.exports = router;