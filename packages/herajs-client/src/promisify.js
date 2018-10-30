const getOwnPropertyDescriptors = originalObject => Object.getOwnPropertyNames(originalObject).reduce(
    (descriptors, name) => {
        descriptors[name] = Object.getOwnPropertyDescriptor(originalObject, name);
        return descriptors;
    }, {});

const kCustomPromisifiedSymbol = Symbol('util.promisify.custom');

export default function promisify(original, context) {
    if (typeof context === 'undefined') {
        context = this;
    }
    if (typeof original !== 'function') {
        throw new Error('original', 'Function', original);
    }

    function fn(...args) {
        return new Promise((resolve, reject) => {
            original.call(context, ...args, (err, value) => {
                if (err) {
                    return reject(err);
                }
                resolve(value);
            });
        });
    }
  
    Object.setPrototypeOf(fn, Object.getPrototypeOf(original));
  
    Object.defineProperty(fn, kCustomPromisifiedSymbol, {
        value: fn, enumerable: false, writable: false, configurable: true
    });
    return Object.defineProperties(
        fn,
        (Object.getOwnPropertyDescriptors || getOwnPropertyDescriptors)(original)
    );
}