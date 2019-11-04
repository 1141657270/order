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
console.log(req.query)
console.log(req.loginId)
var keyword = "%" + (req.query.keyword || "") + "%"
    db.query('select y.Id,y.CustomerId,x.Title,y.Price,x.Src,y.Quantity,y.ContactName,y.Total,y.Mobile,y.UseDate, y.Status from tb_order as y inner join tb_ticket as x on  y.TicketId=x.Id where y.Status=? and y.CustomerId=?',
     [req.query.index,req.loginId],
      function (err, result) {
            if (err) {
                console.log(err);
                res.send({
                    success: false,
                    message: "查询失败"
                })
            } else {
                console.log(result)
                res.send({
                    success: true,
                    message: "查询成功",
                    rows: result,
                })
            }
        })
});
router.get('/get2', function (req, res) {
    console.log(req.query.id)
    // console.log(req.body.TextRow)
    // console.log(req.loginId)
    var keyword = "%" + (req.query.keyword || "") + "%"
        db.query('select y.Id,y.CustomerId,x.Title,x.ShopName,y.Price,x.Src,y.Quantity,y.ContactName,y.Total,y.Mobile,y.UseDate, y.Status from tb_order as y inner join tb_ticket as x on  y.TicketId=x.Id where y.Id=? and y.CustomerId=?',
         [req.query.id,req.loginId],
          function (err, result) {
                if (err) {
                    console.log(err);
                    res.send({
                        success: false,
                        message: "查询失败"
                    })
                } else {
                    console.log(result)
                    res.send({
                        success: true,
                        message: "查询成功",
                        rows: result,
                    })
                }
            })
    });
module.exports = router;