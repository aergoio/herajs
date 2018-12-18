export const ADDRESS_PREFIXES = {
    ACCOUNT: 0x42,
    CONTRACT: 0xC0
};

export const ACCOUNT_NAME_LENGTH = 12;

export const UNITS = {
    NATIVE_TOKEN: {
        baseLabel: 'Aergo',
        baseLabelShort: 'ARG',
        baseDigits: 18,

        subUnits: [
            { e: 0, label: 'aer' },
            { e: 18, label: 'aergo' }
        ],

        unitSize: {
            'aergo': 18,
            'gaer': 9,
            'aer': 0
        }
    }
};

export default {
    ADDRESS_PREFIXES,
    UNITS,
    ACCOUNT_NAME_LENGTH
};