import * as crypto from 'crypto';
import { Keypair } from '@stellar/stellar-sdk';
import { Buffer } from 'buffer';

export function sha256(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

export function signData(data: string, keyPair: Keypair): string {
  return keyPair.sign(Buffer.from(data, 'utf8')).toString('hex');
}

export function verifyData(data: string, signature: string, keyPair: Keypair): boolean {
  return keyPair.verify(Buffer.from(data, 'utf8'), Buffer.from(signature, 'hex'));
}
