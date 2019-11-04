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

// router.post('/add', upload.fields([{ name: "file", maxCount: 1 }, { name: "file2", maxCount: 1 }]), function (req, res, next) {
//     // upload.single('file')
//     console.log(req.body);
//     console.log(req.file);
//     res.end();
// });
// router.post('/add', function (req, res, next) {
//     console.log("处理环节1");
//     next()
// }, function (req, res, next) {
//     console.log("处理环节2")
//     next();
// }, function (req, res, next) {
//     console.log(req.body);
//     res.end();
// });//validator.valid({type:'post',rules:[{required:true,prop:'Src',min:5,prop:'Src',max:64,prop:'Src'}]}),
router.post('/add',
    upload.single('file'), // 加入的处理环节
    function (req, res, next) {
        if (req.file) {

            db.query(
                'insert into tb_category (`Name`,`SortNum`,`Enable`,`Src`) values (?,?,?,?)',
                [req.body.name, req.body.sortnum, req.body.enable, "/upload/" + req.file.filename],
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
        } else {
            res.send({
                success: false,
                message: "添加分类时必须上传图片"
            })
        }
    });

router.post('/edit', upload.single('file'),
    function (req, res, next) {
        if (req.file) {
            db.query('update tb_category set `Name`=?,`SortNum`=?,`Enable`=?,Src=? where `Id`=? ',

                [req.body.name, req.body.sortnum, req.body.enable, "/upload/" + req.file.filename, parseInt(req.body.id)],
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
            db.query('update tb_category set `Name`=?,`SortNum`=?,`Enable`=? where `Id`=? ',
            
                [req.body.name, req.body.sortnum, req.body.enable, parseInt(req.body.id)],
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
router.post('/edit2', upload.single('file'),

    function (req, res, next) {
        console.log(req.body)
        if (req.body.status==1) {
            db.query('update tb_customer set `Status`=? where `Id`=? ',
                [0,req.body.id],
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
            db.query('update tb_customer set `status`=? where `Id`=? ',
            [1, parseInt(req.body.id)],
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
router.get('/get2', function (req, res) {
    var keyword2 = req.query.keyword2 || "";
    var page=req.query.page|| 1;
    var size=req.query.size|| 10;
    db.query('select * from tb_customer where AppOpenId like ? order by Sex',
        ['%' + keyword2 + "%",'%' + keyword2 + "%",'%' + keyword2 + "%",'%' + keyword2 + "%"],
        function (err, result) {
            if (err) {
                console.log(err);
                res.send({
                    success: false,
                    message: "服务内部错误"
                });
            } else {
                var total=result[0].count;
                res.send({
                    success: true,
                    message: "请求成功",
                    rows: result
                })

            }
        })
});
// router.get('/get3', function (req, res) {
//     var keyword3 = req.query.keyword3 || "";
//     db.query('select * from tb_category where Name like ? order by SortNum',
//         ['%' + keyword3 + "%"],
//         function (err, result) {
//             if (err) {
//                 console.log(err);
//                 res.send({
//                     success: false,
//                     message: "服务内部错误"
//                 });
//             } else {
//                 res.send({
//                     success: true,
//                     message: "请求成功",
//                     rows: result
//                 })
//             }
//         })
// });
router.post('/delete', function (req, res) {
    if (req.body.id) {
        db.query('delete from tb_category where Id=?', [req.body.id], function (err, result) {
            if (err) {
                console.log(err);
                res.send({
                    success: false,
                    message: "服务器内部错误"
                })
            } else {
                if (result.affectedRows > 0) {
                    //受影响行数>0
                    res.send({
                        success: true,
                        message: "删除成功"
                    })
                } else {
                    res.send({
                        success: false,
                        message: "找不到要删除的数据"
                    })
                }

            }
        })
    } else {
        res.send({
            success: false,
            message: "缺少id参数"
        })
    }
})

module.exports = router;