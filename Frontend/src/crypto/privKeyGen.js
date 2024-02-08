import { mnemonicToSeedSync } from 'ethereum-cryptography/bip39';
import { BIP32Factory } from 'bip32';
import * as ecc from 'tiny-secp256k1';
import { Buffer } from 'buffer';



const bip32 = BIP32Factory(ecc);

export function generatePrivateKeys(mnemonic) {
    if (!mnemonic) {
        throw new Error('Mnemonic is required');
    }

    const seed = mnemonicToSeedSync(mnemonic);
    
    const seedBuffer = Buffer.from(seed.buffer);

    const root = bip32.fromSeed(seedBuffer);
    console.log("1")
   

    // Standard derivation paths for Ethereum (change these paths according to your requirements)
    const path1 = "m/44'/60'/0'/0/0"; 
    const path2 = "m/44'/60'/0'/0/1";

    const child1 = root.derivePath(path1);
    const child2 = root.derivePath(path2);
    console.log("2")
    return {
        privateKey1: child1.privateKey.toString('hex'),
        publicKey1: child1.publicKey.toString('hex'),
        privateKey2: child2.privateKey.toString('hex'),
        publicKey2: child2.publicKey.toString('hex')
    };
}