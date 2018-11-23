class Provider {
    constructor() {
        // Proxy that passes method calls to the provider's client object
        return new Proxy(this, {
            get(obj, field) {
                if (field in obj) return obj[field];
                return obj.client[field];
            }
        });
    }
}

export default Provider;