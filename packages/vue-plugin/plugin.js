export default {
    install (Vue, options) {
        console.log('installing herajs', options);
        Vue.prototype.$aergo = function() {
            console.log('hello aergo in vue');
        };
    }
}