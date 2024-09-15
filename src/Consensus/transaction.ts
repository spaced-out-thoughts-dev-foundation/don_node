import {
  Keypair,
  Contract,
  TransactionBuilder,
  Networks,
  BASE_FEE,
  Transaction,
  Memo,
  MemoType,
  Operation,
  nativeToScVal,
  Account
} from "@stellar/stellar-sdk";

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
export function createTransactionPayload(sourceAccount: Account, contractAddress: string): Transaction {
  const contract = new Contract(contractAddress);

  const builtTransaction = new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase: Networks.PUBLIC,
  }).addOperation(
    contract.call(
      "foobar",
      nativeToScVal("some data"),
    ),
  ).setTimeout(30).build();

  return builtTransaction;
}

export function signTransaction(
  builtTransaction: Transaction<Memo<MemoType>, Operation[]>,
  sourceKeypair: Keypair,
) {
  // builtTransaction.addSignature(sourceKeypair.publicKey(), signData(builtTransaction.signatureBase().toString('utf8'), sourceKeypair));
  builtTransaction.sign(sourceKeypair);

  return builtTransaction.toEnvelope().toXDR().toString('base64');
}
