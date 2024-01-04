const starkbank = require('../../index.js');
const random = require('./random.js');
const check = require('core-node').check;
const generateExampleBoletosJson = require('./boleto').generateExampleBoletosJson;

exports.generateExampleBoletoPaymentsJson = async function (n, schedule = true) {
    
    let exampleBoletoPayment = {
        taxId: '20.018.183/0001-80',
        line: '34191.09008 61713.957308 71444.640008 2 83430000984732',
        description: 'loading a random account',
    };

    let boletos = generateExampleBoletosJson(n);
    let lines = [];
    let amounts = [];
    boletos = await starkbank.boleto.create(boletos);
    for (let i = 0; i < n; i++) {
        lines.push(boletos[i].line);
        amounts.push(boletos[i].amount);
    }

    let payments = [];
    for (let i = 0; i < n; i++) {
        exampleBoletoPayment.line = lines[i];
        exampleBoletoPayment.description = `Pagamento ${amounts[i]}`;
        if(schedule)
            exampleBoletoPayment.scheduled = check.date(random.futureDate(7));
        payments.push(new starkbank.BoletoPayment(exampleBoletoPayment));
    }
    return payments;
};
