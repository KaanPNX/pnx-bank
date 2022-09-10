const bcrypt = require('bcrypt');
const client = require('../../../Databases/Cassandra');
var jwt = require('jsonwebtoken');

function checkAuth(phone,password){
    var c;
    client.execute('SELECT * FROM Users WHERE phone= ?',[phone]).then(results => {
        var hashPas = results[0].password;
        var check = bcrypt.compare(password, hashPas, (err, data) => {
            if(err) return c = false;
            if(data) return c = true;
        });
    });
    return c;
};

function TcCheck(TCNO){
    var tek = 0,
    cift = 0,
    sonuc = 0,
    TCToplam = 0,
    i = 0,
    hatali = [11111111110, 22222222220, 33333333330, 44444444440, 55555555550, 66666666660, 7777777770, 88888888880, 99999999990];;

  if (TCNO.length != 11) return false;
  if (isNaN(TCNO)) return false;
  if (TCNO[0] == 0) return false;

  tek = parseInt(TCNO[0]) + parseInt(TCNO[2]) + parseInt(TCNO[4]) + parseInt(TCNO[6]) + parseInt(TCNO[8]);
  cift = parseInt(TCNO[1]) + parseInt(TCNO[3]) + parseInt(TCNO[5]) + parseInt(TCNO[7]);

  tek = tek * 7;
  sonuc = Math.abs(tek - cift);
  if (sonuc % 10 != TCNO[9]) return false;

  for (var i = 0; i < 10; i++) {
    TCToplam += parseInt(TCNO[i]);
  }

  if (TCToplam % 10 != TCNO[10]) return false;

  if (hatali.toString().indexOf(TCNO) != -1) return false;

  return true;
}

module.exports = {checkAuth,TcCheck};