const express = require('express');
const memcached = require('../../../Databases/Memcache');
const { checkCode, sendCode } = require('../Utils/2FA');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require("../../../config.json");
const { checkAuth, TcCheck } = require('../Utils/Authtenticate');
const client = require('../../../Databases/Cassandra');
const bcrypt = require('bcrypt');
const { CreateCard } = require('../Utils/Cards');

//Auth

router.post('/auth',function(req,res){
    if(req.body.phone == undefined || req.body.password)return res.send({message:'Invalid Form.'});
    if(!typeof req.body.phone == 'number' || typeof req.body.password == 'string')return res.send({message: 'Invalid form.'});

    var auth = checkAuth(req.body.phone, req.body.password);
    if(auth == false){
        return res.status(403).send({message: 'Access denied.'});
    }else if(auth == true){
        sendCode(req.body.phone);
        return res.status(200).send({message:'OK'});
    }
});

router.post('/2fa',function(req,res){
    if(req.body.phone == undefined){return res.status(400).send({message: 'Invalid form.'});};
    if(typeof req.body.phone != 'number')return res.status(400).send({message: 'Invalid form.'});
    var cc = checkCode(req.body.phone);
    if(cc == undefined)return res.status(404).send({message: 'Code invalid, request failed.'});

    if(cc == true){
        client.execute('SELECT * FROM Users WHERE phone = ?',[req.body.phone]).then((results) => {
            var payload = {
                user: {
                    id: results[0].id,
                    firstname: results[0].firstname,
                    lastname: results[0].lastname,
                    phone: req.body.phone,
                    roleLevel: results[0].roleLevel
                }
            }
            var token = jwt.sign(payload, config['hash-secret']['password-hash-key'],{algorithm: 'HS256'})
            return res.send({token: token});
        });
    }
});

//High Perrmision Level

router.post('/account/register',(req,res) => {
    /*var userPayload = jwt.decode(req.headers.authorization,{complete:true})
    if (userPayload === null) {return res.status(403).send({message: 'Access denied.'});}
    if(userPayload.user.roleLevel < 5)return res.send({message: 'Access denied.'});
    if(req.body.tck == undefined || req.body.firstname == undefined || req.body.lastname == undefined || req.body.phone == undefined)return res.send(400).send({message: 'Access denied.'});
    var password = Math.floor(Math.random()*Math.pow(10,6));
    if(!TcCheck(req.body.tck))return res.send({message:'Invalid TCK Number.'});
    var hashPassword = bcrypt.hash(password, 15);
    client.execute('INSERT INTO users (tck,firstname,lastname,phone,password) VALUES (?,?,?,?,?)',[req.body.tck,req.body.firstname,req.body.lastname,req.body.phone,hashPassword]);
    */

    client.execute('INSERT INTO log (staff,event,date) VALUES("test","test","test")')
});


router.post('/account/create/card',(req,res) => {
    var userPayload = jwt.decode(req.headers.authorization,{complete:true})
    if (userPayload === null) {return res.status(403).send({message: 'Access denied.'});}
    if(userPayload.user.roleLevel < 5)return res.send({message: 'Access denied.'});
    if(req.body.customer_id == undefined)return res.send(400).send({message: 'Access denied.'});
    var card = CreateCard();
    client.execute('INSERT INTO cards (number,cvv,expriesYear,expriesMonth)')
});

//Default Permission


module.exports = router;