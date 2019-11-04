var router = require('express').Router();
var db = require('../db')
/** 登录
 * /login
 */
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
router.post('/edit',
    upload.single('file'),
    function (req, res) {
        // if (loginname != undefined && password != undefined) {
        //验证用户名密码
        db.query(
            'select * from tb_admin where LoginName=? and `Password`=md5(?)',
            [req.body.loginname, req.body.password],
            function (err, result) {
                if (err) {
                    res.send({
                        success: false,
                        message: "数据访问异常"
                    })
                } else {
                    if (result.length > 0) {
                        //大于0，说明有查到记录，登录成功
                        if (req.file) {
                            db.query('update tb_admin set `Password`=md5(?),Src=? where `LoginName`=? ',

                                [req.body.password1, "/upload/" + req.file.filename, req.body.loginname],
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
                            db.query('update tb_admin set `Password`=md5(?) where `LoginName`=?',

                                [req.body.password1, req.body.loginname],
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
                        };
                        res.send({
                            success: true,
                            message: "修改成功"
                        })
                    } else {
                        res.send({
                            success: false,
                            message: "用户名或密码有误"
                        })
                    }
                }
            }
        )
    }
    // else {
    //         res.send({
    //             success: false,
    //             message: "用户或密码格式不正确"
    //         })
    //     }

    // }
);
router.post('/reset',
    upload.single('file'),
    function (req, res) {
        if (req.file) {
            db.query('update tb_admin set `Password`=md5(123456),Src=? where `LoginName`=? ',

                [req.body.password1, "/upload/" + req.file.filename, req.body.loginname],
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
            db.query('update tb_admin set `Password`=md5(123456) where `LoginName`=?',

                [req.body.password1, req.body.loginname],
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
        };
    });
module.exports = router;