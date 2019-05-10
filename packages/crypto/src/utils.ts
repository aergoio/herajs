export function padStart(input: string, targetLength: number, padString: string): string {
    targetLength = targetLength >> 0; //truncate if number, or convert non-number to 0;
    padString = String(typeof padString !== 'undefined' ? padString : ' ');
    if (input.length >= targetLength) {
        return String(input);
    } else {
        targetLength = targetLength - input.length;
        if (targetLength > padString.length) {
            padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
        }
        return padString.slice(0, targetLength) + String(input);
    }
}