
import { Record, Data } from './record';

export interface NameSpec {
    name: string;
    chainId?: string;
}

export interface CompleteNameSpec extends NameSpec {
    chainId: string;
}

export interface NameData extends Data {
    spec: {
        name: string;
        chainId: string;
    };
    accountKey: string;
    added: string | null;
    destination: string;
    owner: string;
    lastSync: {
        blockno: number;
        timestamp: number;
    } | null;
}

export class Name extends Record<NameData> {
    static getDefaultData(extraData?: Partial<NameData>): NameData {
        return {
            spec: {
                name: '',
                chainId: '',
            },
            accountKey: '',
            destination: '',
            owner: '',
            lastSync: null,
            added: new Date().toISOString(),
            ...extraData,
        };
    }
}
