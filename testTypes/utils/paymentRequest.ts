const random = require('./random.js') ;
const transfer = require('./transfer');
const transaction = require('./transaction');
const boleto = require('./boletoPayment');
const utilityPayment = require('./utilityPayment');
const brcodePayment = require('./brcodePayment');
import starkbank,{ Transaction } from 'starkbank';

function chooseType() {
    let randomNumber = random.randomInt(0, 4);
    switch (randomNumber) {
        case 0:
            return 'transfer';
        case 1:
            return 'transaction';
        case 2:
            return 'boleto-payment';
        case 3:
            return 'utility-payment';
        case 4:
            return 'brcode-payment';
        default:
            throw new Error('Bad random number ' + randomNumber);
    }
}

async function createPayments(type: string, n: number) {
    switch (type) {
        case 'transfer':
            return transfer.generateExampleTransfersJson(n, null, true);
        case 'transaction':
            return transaction.generateExampleTransactionsJson(n);
        case 'boleto-payment':
            return await boleto.generateExampleBoletoPaymentsJson(n, true);
        case 'utility-payment':
            return utilityPayment.generateExampleUtilityPaymentsJson(n, true);
        case 'brcode-payment':
            return brcodePayment.generateExampleBrcodePaymentsJson(n, true);
        default:
            throw new Error('Bad type ' + type);
    }
}

export async function generateExamplePaymentRequestJson(n = 1) {
    let types: { [key: string]: number } = {
        'transfer': 0,
        'transaction': 0,
        'boleto-payment': 0,
        'utility-payment': 0,
        'brcode-payment': 0,
    };
    for (let i = 0; i < n; i++) {
        types[chooseType()]++;
    }
    let payments: starkbank.PaymentRequest[] = [];
    for (var type in types) {
        if (types[type] === 0)
            continue;
        payments = payments.concat(await createPayments(type, types[type]));
    }

    let requests: starkbank.PaymentRequest[] = [];
    for (let payment of payments) {
        requests.push(new starkbank.PaymentRequest({
            centerId: process.env.SANDBOX_CENTER_ID as string,
            payment: payment,
        }));
    }

    return requests;
}
