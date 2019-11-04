var router = require('express').Router();
var db = require('../db');
var request = require("request");
var WXBizDataCrypt = require('../WXBizDataCrypt')
var cryptoJs=require('crypto-js')
router.post('/', function (req, res) {
    // console.log(11111111111111111)
    var code = req.body.code;
    var encryptedData = req.body.encryptedData;
    var iv = req.body.iv;
    //https://api.weixin.qq.com/sns/jscode2session?appid=wx163547d801c41c12&secret=c6801904df7756ee23813e4d0dc6e3fb&js_code=JSCODE&grant_type=authorization_code
    request.get("https://api.weixin.qq.com/sns/jscode2session?appid=wx7b27379cbd5d13ee&secret=5f8f33a155fbc1d2a808942fdf69ac6f&js_code=" + code + "&grant_type=authorization_code", function (err, response, body) {
        console.log(body)
        var seession_key = JSON.parse(body).session_key;
        var pc = new WXBizDataCrypt("wx7b27379cbd5d13ee", seession_key);
        var data;
        try {
            data = pc.decryptData(encryptedData, iv);
        } catch (error) {
            res.send({
                success: false,
                message: "非法请求"
            });
        }
        if (data) {
            // console.log("data：")
            // console.log(data);
            var openid = data.openId;
            db.query('select * from tb_customer where AppOpenId like ?',
                [openid],
                function (err, result) {
                    if (err) {
                       
                        res.send({
                            success: false,
                            message: "服务内部错误"
                        });
                    } else {
                        console.log(result)
                        if (result == "") {
                            db.query('insert into tb_customer (`AppOpenId`,`NickName`,`AvatarUrl`,`Sex`,`Country`,`Province`,`City`,`Account`,`Status`,`RowVersion`) values (?,?,?,?,?,?,?,?,?,?)',
                                [data.openId, data.nickName, data.avatarUrl, data.gender, data.country, data.province, data.city, "0", "1", "1"],
                                function (err, result) {
                                    if (err) {
                                      
                                        res.send({
                                            success: false,
                                            message: "服务内部错误"
                                        });
                                    } else {
                                        res.send({
                                            success: true,
                                            message: "成功注册，已为您自动登录",
                                            token: id
                                        })
                                    }
                                })
                        }
                        else {
                            var id=result[0].Id.toString();
                            var enc=cryptoJs.AES.encrypt(id,'jssnwjsjdmsajssnsn',{iv:'515s5slkslsksskk'}).toString();
                            res.send({
                                success: true,
                                message: "登录成功",
                                // token: result[0].Id
                                token:enc
                            })
                        }
                    }
                })
            //根据openid查询数据库,没有用户就注册，有就返回登录信息

           
        }

    })
});

module.exports = router;