import base58check from 'base58check';

const prefix = 0x42;
console.log('Account addresses', prefix.toString(16));
for (let i = 0; i < 20; i++) {
    const bytes = Array.from({length: 33}, () => Math.floor(Math.random() * 256)); // X
    const data = Buffer.from([...bytes]);
    const encoded = base58check.encode(data, prefix.toString(16));
    console.log(data, encoded, encoded.length);
}

const bytes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
const data = Buffer.from([...bytes]);
const encoded = base58check.encode(data, prefix.toString(16));
console.log(data, encoded, encoded.length);


/*

const sign = 0x2 + Math.round(Math.random()); // 0x2 for even, 0x3 for odd Y
const pubkey = Array.from({length: 20}, () => Math.floor(Math.random() * 256)); // X
const data = Buffer.from([...pubkey, sign]);
const encoded = base58check.encode(data, prefix.toString(16));
console.log('Contract addresses for account ', encoded);
//prefix = '11'; // 0x11 for contracts

for (let i = 237; i < 241; i++) {
    const data = Buffer.from([i, ...pubkey, sign]);
    const encoded = base58check.encode(data, ''+prefix.toString(16));
    console.log(i, data, encoded, encoded.length);
    //console.log(base58check.decode(encoded));
}

*/