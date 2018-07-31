const fromHexString = hexString => new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

const toHexString = bytes => bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

const fromNumber = (d) => {
    const arr = new Uint8Array(8);
    for (let i=0, j=1; i<8; i++, j *= 0x100) {
        arr[i] = (d / j) & 0xff;
    }
    return arr;
};

export {
    fromHexString,
    toHexString,
    fromNumber
};