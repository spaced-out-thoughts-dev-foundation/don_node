import { sha256, signData, verifyData } from '../../src/Consensus/signature';
import { Keypair } from '@stellar/stellar-sdk';

test('given some data, hashes it, signs it, verifies hash', () => {
  const keypair = Keypair.random();
  const data = 'hello world';
  const hashedData = sha256(data);
  const signature = signData(hashedData, keypair);

  // fails if not the actual signed data
  expect(verifyData(data, signature, keypair)).toBe(false);
  // passes if signed data
  expect(verifyData(hashedData, signature, keypair)).toBe(true);
});
