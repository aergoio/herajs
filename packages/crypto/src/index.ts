export {
    encodeAddress,
    decodeAddress,
    encodePrivateKey,
    decodePrivateKey,
    encodeTxHash,
    decodeTxHash,
} from './encoding';

export {
    createIdentity,
    identityFromPrivateKey as identifyFromPrivateKey, // DEPRECATED (legacy typo)
    identityFromPrivateKey,
    addressFromPublicKey,
    publicKeyFromAddress,
    decryptPrivateKey,
    encryptPrivateKey,
} from './keys';

export {
    signMessage,
    signTransaction,
    verifySignature,
    verifyTxSignature,
    encodeSignature,
} from './signing';

export {
    hash,
    hashTransaction,
} from './hashing';

export {
    generateMnemonic,
    mnemonicToSeed,
    privateKeyFromSeed,
    privateKeysFromSeed,
    privateKeyFromMnemonic,
    privateKeysFromMnemonic,
    validateMnemonic,
} from './seed';

export {
    identityFromKeystore,
    keystoreFromPrivateKey,
} from './keystore';