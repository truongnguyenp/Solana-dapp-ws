import * as bs58 from 'bs58';

export function getPrivateKey(privateKey: string): Uint8Array {
    const _privateKey = bs58.decode(privateKey);
    return new Uint8Array(_privateKey.buffer, _privateKey.byteOffset, _privateKey.byteLength / Uint8Array.BYTES_PER_ELEMENT);
}