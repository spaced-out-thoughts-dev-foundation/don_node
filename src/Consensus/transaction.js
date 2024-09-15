"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransactionPayload = createTransactionPayload;
exports.signTransaction = signTransaction;
const stellar_sdk_1 = require("@stellar/stellar-sdk");
// Idea here:
//  low threshold: 0
//  medium threshold: 0
//  high threshold: (N / 2) + 1
//
// Users
//  master key weight: 1
//  user 1: 1
//  ...
//  user N: 1
function createTransactionPayload(sourceAccount, contractAddress) {
    const contract = new stellar_sdk_1.Contract(contractAddress);
    const builtTransaction = new stellar_sdk_1.TransactionBuilder(sourceAccount, {
        fee: stellar_sdk_1.BASE_FEE,
        networkPassphrase: stellar_sdk_1.Networks.PUBLIC,
    }).addOperation(contract.call("foobar", (0, stellar_sdk_1.nativeToScVal)("some data"))).setTimeout(30).build();
    return builtTransaction;
}
function signTransaction(builtTransaction, sourceKeypair) {
    // builtTransaction.addSignature(sourceKeypair.publicKey(), signData(builtTransaction.signatureBase().toString('utf8'), sourceKeypair));
    builtTransaction.sign(sourceKeypair);
    return builtTransaction.toEnvelope().toXDR().toString('base64');
}
