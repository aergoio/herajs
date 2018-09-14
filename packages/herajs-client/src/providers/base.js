class Provider {
    constructor(config) {
        this.config = {
            ...this.defaultConfig,
            ...config
        };

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