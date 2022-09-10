var generator = require('creditcard-generator')

function CreateCard(){
    const month = () => {
        var n; 
        if(new Date().getMonth().toString().length <= 1){
            n = "0"+new Date().getMonth().toString()
        }
        return n;
    };
    var CardNumber = generator.GenCC("Mastercard", 1 ,Math.random)
    var CardConfig = {
        number: CardNumber[0],
        cvv: String(Math.floor(Math.random()*Math.pow(10,3))),
        expriesYear: String(Number(new Date().getFullYear().toString().slice(2))+8),
        expriesMonth: month()
    }
    return CardConfig;
}

module.exports = {CreateCard};