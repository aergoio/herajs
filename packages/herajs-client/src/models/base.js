/**
 * Basically just a named struct that can be extended
 */
export default class BaseModel {
    constructor(data) {
        for (const key in data) {
            this[key] = data[key];
        }
    }
    static fromGrpc(grpcObject) {
        return grpcObject.toObject();
    }
    toGrpc() {
        throw new Error('not implemented');
    }
}