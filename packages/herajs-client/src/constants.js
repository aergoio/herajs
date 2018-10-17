export const ADDRESS_PREFIXES = {
    ACCOUNT: 0x42,
    CONTRACT: 0xC0
};

export const UNITS = {
    NATIVE_TOKEN: {
        baseLabel: 'Aergo',
        baseLabelShort: 'ARG',
        baseDigits: 9,

        subUnits: [
            { e: 0, label: 'aer' },
            { e: 9, label: 'ARG' }
        ]
    }
};

export default {
    ADDRESS_PREFIXES,
    UNITS
};