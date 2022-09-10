const wbm = require('wbm');

function SendMessage(phone,msg){
    wbm.start().then(async () => {
        const phones = [phone];
        const message = msg;
        await wbm.send(phones, message);
        await wbm.end();
    }).catch(err => console.log(err));

}