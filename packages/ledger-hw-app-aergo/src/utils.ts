
const HARDENED = 0x80000000;
  
export function pathToBuffer(path: string): Buffer {
    let text = path;
    if (/^m\//i.test(text)) {
        text = text.slice(2);
    }
    
    const numbers: number[] = text.split('/').map((str: string) => {
        const parts = /(\d+)([hH']?)/.exec(str);
        if (!parts) {
            throw new Error('invalid input');
        }
        const number = parseInt(parts[1]);
        const harden = parts[2] === 'h' || parts[2] === 'H' || parts[2] === '\'';
        if (harden) return number + HARDENED;
        return number;
    });

    const data = Buffer.alloc(4 * numbers.length);
    for (let i = 0; i < numbers.length; i++) {
        data.writeUInt32BE(numbers[i], i * 4);
    }
    return data;
}

const sum = (arr: number[]): number => arr.reduce((x, y) => x + y, 0);

export function chunkBy(data: Buffer, chunkLengths: number[]): Buffer[] {
    let offset = 0;
    const result = [];
    const restLength = data.length - sum(chunkLengths);
    for (const c of [...chunkLengths, restLength]) {
        result.push(data.slice(offset, offset + c));
        offset += c;
    }
    return result;
}