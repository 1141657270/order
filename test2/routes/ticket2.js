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
    var size = parseInt(req.query.size || 5);
    var keyword = "%" + (req.query.keyword || "") + "%"
    db.query(`select t.* 
    from tb_category as c inner join tb_ticket as t 
    on c.Id = t.CategoryId 
    where (c.Name like ? or t.Title like ? or t.ShopName like ? or t.ShopAddress like ? or t.ShopPhone like ? or t.Content like ?) and t.SortNum<100  
    order by c.SortNum,CategoryId limit ?,?`, [keyword, keyword, keyword, keyword, keyword, keyword, (page - 1) * size, size], function (err, result) {
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
                    rows: result,
                })
            }
        })
});
router.get('/get2', function (req, res) {
    var page = parseInt(req.query.page || 1);
    var size = parseInt(req.query.size || 5);
    var keyword = "%" + (req.query.keyword || "") + "%"
    console.log(req.query.id)
    db.query(`select t.* 
    from tb_category as c inner join tb_ticket as t 
    on c.Id = t.CategoryId 
    where (c.Name like ? or t.Title like ? or t.ShopName like ? or t.ShopAddress like ? or t.ShopPhone like ? or t.Content like ?) and t.SortNum<100&&t.CategoryId=?  
    order by c.SortNum,CategoryId limit ?,?`, [keyword, keyword, keyword, keyword, keyword, keyword,req.query.id, (page - 1) * size, size], function (err, result) {
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
                    rows: result,
                })
            }
        })
});
router.get('/get3', function (req, res) {
    var page = parseInt(req.query.page || 1);
    var size = parseInt(req.query.size || 5);
    var keyword = "%" + (req.query.keyword || "") + "%"
    console.log(req.query.id)
    db.query(`select t.* 
    from tb_category as c inner join tb_ticket as t 
    on c.Id = t.CategoryId 
    where (c.Name like ? or t.Title like ? or t.ShopName like ? or t.ShopAddress like ? or t.ShopPhone like ? or t.Content like ?) and t.SortNum<100&&t.Id=?  
    order by c.SortNum,CategoryId limit ?,?`, [keyword, keyword, keyword, keyword, keyword, keyword,req.query.id, (page - 1) * size, size], function (err, result) {
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
                    rows: result,
                })
            }
        })
});
module.exports = router;