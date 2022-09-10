const wbm = require('wbm');
const memcached = require('../../../Databases/Memcache');

function sendCode(phone){
    var code = Math.floor(Math.random()*999999);
    
    wbm.start().then(async () => {
        const phones = [phone];
        const message = `Your secret access code is ${code}, do not share it with anyone, including bank customer service.`;
        await wbm.send(phones, message);
        await wbm.end();
    }).catch(err => console.log(err));
    memcached.set(`${phone}_code`,code,30,function(err){console.log(err)});
}

function checkCode(phone,code){
    var d;
    memcached.get(`${phone}_code`,function(err,data) {
        if(err)return d = undefined;

        if(data == code){
            d = true;
        }else{
            d = false;
        }
    })
    return d;
};

module.exports = {sendCode, checkCode}