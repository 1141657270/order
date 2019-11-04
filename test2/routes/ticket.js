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
    var page = parseInt(req.query.page || 1);
    var size = parseInt(req.query.size || 10);
    var keyword = "%" + (req.query.keyword || "") + "%"
    db.query(`select t.* 
    from tb_category as c inner join tb_ticket as t 
    on c.Id = t.CategoryId 
    where c.Name like ? or t.Title like ? or t.ShopName like ? or t.ShopAddress like ? or t.ShopPhone like ? or t.Content like ?  
    order by c.SortNum,CategoryId,SortNum limit ?,?`, [keyword, keyword, keyword, keyword, keyword, keyword, (page - 1) * size, size], function (err, result) {
        if (err) {
            console.log(err);
            res.send({
                success: false,
                message: "查询失败"
            })
        } else {
            var data = [];
            var catids = [];
            result.forEach(row => {
                //补全catids
                if (!catids.some(s => s == row.CategoryId)) {
                    catids.push(row.CategoryId)
                }
            })
            db.query(`select * from tb_category where Id in (?) order by SortNum`, [catids],
                function (err, result2) {
                    if (err) {
                        console.log(err);
                        res.send({
                            success: false,
                            message: "查询失败"
                        })
                    } else {
                        result2.forEach(cat => {
                            cat.Id = -cat.Id;
                            cat.children = [];
                            data.push(cat);
                        })
                        result.forEach(row => {
                            var cat = data.find(item => item.Id == -row.CategoryId);
                            cat.children.push(row)
                        })

                        db.query(`select count(*) as count
                    from tb_category as c inner join tb_ticket as t 
                    on c.Id = t.CategoryId 
                    where c.Name like ? or t.Title like ? or t.ShopName like ? or t.ShopAddress like ? or t.ShopPhone like ? or t.Content like ?  `, [keyword, keyword, keyword, keyword, keyword, keyword], function (err, result) {
                            if (err) {
                                console.log(err);
                                res.send({
                                    success: false,
                                    message: "查询失败"
                                })
                            } else {

                                res.send({
                                    success: true,
                                    message: "查询成功",
                                    rows: data,
                                    total: result[0].count
                                })
                            }
                        })
                    }
                })
        }
    })
});
router.post('/add',
    upload.single('file'), // 加入的处理环节
    function (req, res, next) {
        console.log(req.body)
        if (true) {
            db.query(
                'insert into tb_ticket (`Title`,`Price`,`Stock`,`Content`,`ShopAddress`,`ShopName`,`ShopPhone`,`CategoryId`,`Enable`,`SortNum`,`Long`,`Lat`) values (?,?,?,?,?,?,?,?,?,?,?,?)',
                [req.body.title, req.body.price, req.body.stock,req.body.content, req.body.shopaddress, req.body.shopname, req.body.shopphone,req.body.categoryid, req.body.enable, req.body.sortnum,req.body.lng, req.body.lat,],
                function (err, result) {
                    if (err) {
                        console.log(err)
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
        // else {
        //     res.send({
        //         success: false,
        //         message: "xxx"
        //     })
        // }
    });

router.post('/edit', upload.single('file'),
    function (req, res, next) {
        console.log(req.body)

        if (req.file) {
            db.query('update tb_ticket set `Title`=?,`Price`=?,`Stock`=?, `Content`=?,`ShopAddress`=?,`ShopName`=?, `ShopPhone`=?,`CategoryId`=?,`Enable`=?,`SortNum`=?,`Src`=?,`Long`=?,`Lat`=? where `Id`=? ',

                [req.body.title, req.body.price, req.body.stock, req.body.content, req.body.shopaddress, req.body.shopname, req.body.shopPhone, req.body.categoryid, req.body.enable, req.body.sortnum, "/upload/" + req.file.filename,req.body.lng, req.body.lat,parseInt(req.body.id)],
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
            db.query('update tb_ticket set `Title`=?,`Price`=?,`Stock`=?, `Content`=?,`ShopAddress`=?,`ShopName`=?, `ShopPhone`=?,`CategoryId`=?,`Enable`=?,`SortNum`=?,`Long`=?,`Lat`=? where `Id`=?',

                [req.body.title, req.body.price, req.body.stock, req.body.content, req.body.shopaddress, req.body.shopname, req.body.shopPhone, req.body.categoryid, req.body.enable, req.body.sortnum,req.body.lng, req.body.lat, req.body.id],
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
router.post('/delete', function (req, res) {

    if (req.body.id) {
        db.query('delete from tb_ticket where Id=?', [req.body.id], function (err, result) {
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