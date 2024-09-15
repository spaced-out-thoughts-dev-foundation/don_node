"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const signature_1 = require("../../src/Consensus/signature");
const stellar_sdk_1 = require("@stellar/stellar-sdk");
test('given some data, hashes it, signs it, verifies hash', () => {
    const keypair = stellar_sdk_1.Keypair.random();
    const data = 'hello world';
    const hashedData = (0, signature_1.sha256)(data);
    const signature = (0, signature_1.signData)(hashedData, keypair);
    // fails if not the actual signed data
    expect((0, signature_1.verifyData)(data, signature, keypair)).toBe(false);
    // passes if signed data
    expect((0, signature_1.verifyData)(hashedData, signature, keypair)).toBe(true);
});
