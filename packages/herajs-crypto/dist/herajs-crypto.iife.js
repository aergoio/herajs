var HerajsCrypto = (function (exports, crypto$1, buffer, util) {
  'use strict';

  crypto$1 = crypto$1 && crypto$1.hasOwnProperty('default') ? crypto$1['default'] : crypto$1;
  buffer = buffer && buffer.hasOwnProperty('default') ? buffer['default'] : buffer;
  util = util && util.hasOwnProperty('default') ? util['default'] : util;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  var createHash = crypto$1.createHash;

  var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  function getCjsExportFromNamespace (n) {
  	return n && n.default || n;
  }

  var safeBuffer = createCommonjsModule(function (module, exports) {
  /* eslint-disable node/no-deprecated-api */

  var Buffer = buffer.Buffer;

  // alternative to using Object.keys for old browsers
  function copyProps (src, dst) {
    for (var key in src) {
      dst[key] = src[key];
    }
  }
  if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
    module.exports = buffer;
  } else {
    // Copy properties from require('buffer')
    copyProps(buffer, exports);
    exports.Buffer = SafeBuffer;
  }

  function SafeBuffer (arg, encodingOrOffset, length) {
    return Buffer(arg, encodingOrOffset, length)
  }

  // Copy static methods from Buffer
  copyProps(Buffer, SafeBuffer);

  SafeBuffer.from = function (arg, encodingOrOffset, length) {
    if (typeof arg === 'number') {
      throw new TypeError('Argument must not be a number')
    }
    return Buffer(arg, encodingOrOffset, length)
  };

  SafeBuffer.alloc = function (size, fill, encoding) {
    if (typeof size !== 'number') {
      throw new TypeError('Argument must be a number')
    }
    var buf = Buffer(size);
    if (fill !== undefined) {
      if (typeof encoding === 'string') {
        buf.fill(fill, encoding);
      } else {
        buf.fill(fill);
      }
    } else {
      buf.fill(0);
    }
    return buf
  };

  SafeBuffer.allocUnsafe = function (size) {
    if (typeof size !== 'number') {
      throw new TypeError('Argument must be a number')
    }
    return Buffer(size)
  };

  SafeBuffer.allocUnsafeSlow = function (size) {
    if (typeof size !== 'number') {
      throw new TypeError('Argument must be a number')
    }
    return buffer.SlowBuffer(size)
  };
  });
  var safeBuffer_1 = safeBuffer.Buffer;

  // base-x encoding
  // Forked from https://github.com/cryptocoinjs/bs58
  // Originally written by Mike Hearn for BitcoinJ
  // Copyright (c) 2011 Google Inc
  // Ported to JavaScript by Stefan Thomas
  // Merged Buffer refactorings from base58-native by Stephen Pair
  // Copyright (c) 2013 BitPay Inc

  var Buffer$1 = safeBuffer.Buffer;

  var baseX = function base (ALPHABET) {
    var ALPHABET_MAP = {};
    var BASE = ALPHABET.length;
    var LEADER = ALPHABET.charAt(0);

    // pre-compute lookup table
    for (var z = 0; z < ALPHABET.length; z++) {
      var x = ALPHABET.charAt(z);

      if (ALPHABET_MAP[x] !== undefined) throw new TypeError(x + ' is ambiguous')
      ALPHABET_MAP[x] = z;
    }

    function encode (source) {
      if (source.length === 0) return ''

      var digits = [0];
      for (var i = 0; i < source.length; ++i) {
        for (var j = 0, carry = source[i]; j < digits.length; ++j) {
          carry += digits[j] << 8;
          digits[j] = carry % BASE;
          carry = (carry / BASE) | 0;
        }

        while (carry > 0) {
          digits.push(carry % BASE);
          carry = (carry / BASE) | 0;
        }
      }

      var string = '';

      // deal with leading zeros
      for (var k = 0; source[k] === 0 && k < source.length - 1; ++k) string += LEADER;
      // convert digits to a string
      for (var q = digits.length - 1; q >= 0; --q) string += ALPHABET[digits[q]];

      return string
    }

    function decodeUnsafe (string) {
      if (typeof string !== 'string') throw new TypeError('Expected String')
      if (string.length === 0) return Buffer$1.allocUnsafe(0)

      var bytes = [0];
      for (var i = 0; i < string.length; i++) {
        var value = ALPHABET_MAP[string[i]];
        if (value === undefined) return

        for (var j = 0, carry = value; j < bytes.length; ++j) {
          carry += bytes[j] * BASE;
          bytes[j] = carry & 0xff;
          carry >>= 8;
        }

        while (carry > 0) {
          bytes.push(carry & 0xff);
          carry >>= 8;
        }
      }

      // deal with leading zeros
      for (var k = 0; string[k] === LEADER && k < string.length - 1; ++k) {
        bytes.push(0);
      }

      return Buffer$1.from(bytes.reverse())
    }

    function decode (string) {
      var buffer = decodeUnsafe(string);
      if (buffer) return buffer

      throw new Error('Non-base' + BASE + ' character')
    }

    return {
      encode: encode,
      decodeUnsafe: decodeUnsafe,
      decode: decode
    }
  };

  var ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

  var bs58 = baseX(ALPHABET);

  var Buffer$2 = safeBuffer.Buffer;

  var base = function (checksumFn) {
    // Encode a buffer as a base58-check encoded string
    function encode (payload) {
      var checksum = checksumFn(payload);

      return bs58.encode(Buffer$2.concat([
        payload,
        checksum
      ], payload.length + 4))
    }

    function decodeRaw (buffer) {
      var payload = buffer.slice(0, -4);
      var checksum = buffer.slice(-4);
      var newChecksum = checksumFn(payload);

      if (checksum[0] ^ newChecksum[0] |
          checksum[1] ^ newChecksum[1] |
          checksum[2] ^ newChecksum[2] |
          checksum[3] ^ newChecksum[3]) return

      return payload
    }

    // Decode a base58-check encoded string to a buffer, no result if checksum is wrong
    function decodeUnsafe (string) {
      var buffer = bs58.decodeUnsafe(string);
      if (!buffer) return

      return decodeRaw(buffer)
    }

    function decode (string) {
      var buffer = bs58.decode(string);
      var payload = decodeRaw(buffer, checksumFn);
      if (!payload) throw new Error('Invalid checksum')
      return payload
    }

    return {
      encode: encode,
      decode: decode,
      decodeUnsafe: decodeUnsafe
    }
  };

  // SHA256(SHA256(buffer))
  function sha256x2 (buffer) {
    var tmp = createHash('sha256').update(buffer).digest();
    return createHash('sha256').update(tmp).digest()
  }

  var bs58check = base(sha256x2);

  var ADDRESS_PREFIXES = {
    ACCOUNT: 0x42,
    PRIVATE_KEY: 0xAA
  };
  var ACCOUNT_NAME_LENGTH = 12;

  class JSBI extends Array{constructor(a,b){if(a>JSBI.__kMaxLength)throw new RangeError("Maximum BigInt size exceeded");super(a),this.sign=b;}static BigInt(a){var b=Math.floor,c=Number.isFinite;if("number"==typeof a){if(0===a)return JSBI.__zero();if((0|a)===a)return 0>a?JSBI.__oneDigit(-a,!0):JSBI.__oneDigit(a,!1);if(!c(a)||b(a)!==a)throw new RangeError("The number "+a+" cannot be converted to BigInt because it is not an integer");return JSBI.__fromDouble(a)}if("string"==typeof a){const b=JSBI.__fromString(a);if(null===b)throw new SyntaxError("Cannot convert "+a+" to a BigInt");return b}if("boolean"==typeof a)return !0===a?JSBI.__oneDigit(1,!1):JSBI.__zero();if("object"==typeof a){if(a.constructor===JSBI)return a;const b=JSBI.__toPrimitive(a);return JSBI.BigInt(b)}throw new TypeError("Cannot convert "+a+" to a BigInt")}toDebugString(){const a=["BigInt["];for(const b of this)a.push((b?(b>>>0).toString(16):b)+", ");return a.push("]"),a.join("")}toString(a=10){if(2>a||36<a)throw new RangeError("toString() radix argument must be between 2 and 36");return 0===this.length?"0":0==(a&a-1)?JSBI.__toStringBasePowerOfTwo(this,a):JSBI.__toStringGeneric(this,a,!1)}static toNumber(a){var b=Math.clz32;const c=a.length;if(0===c)return 0;if(1===c){const b=a.__unsignedDigit(0);return a.sign?-b:b}const d=a.__digit(c-1),e=b(d),f=32*c-e;if(1024<f)return a.sign?-Infinity:1/0;let g=f-1,h=d,i=c-1;const j=e+1;let k=32===j?0:h<<j;k>>>=12;const l=j-12;let m=12<=j?0:h<<20+j,n=20+j;0<l&&0<i&&(i--,h=a.__digit(i),k|=h>>>32-l,m=h<<l,n=l),0<n&&0<i&&(i--,h=a.__digit(i),m|=h>>>32-n,n-=32);const o=JSBI.__decideRounding(a,n,i,h);if((1===o||0===o&&1==(1&m))&&(m=m+1>>>0,0==m&&(k++,0!=k>>>20&&(k=0,g++,1023<g))))return a.sign?-Infinity:1/0;const p=a.sign?-2147483648:0;return g=g+1023<<20,JSBI.__kBitConversionInts[1]=p|g|k,JSBI.__kBitConversionInts[0]=m,JSBI.__kBitConversionDouble[0]}static unaryMinus(a){if(0===a.length)return a;const b=a.__copy();return b.sign=!a.sign,b}static bitwiseNot(a){return a.sign?JSBI.__absoluteSubOne(a).__trim():JSBI.__absoluteAddOne(a,!0)}static exponentiate(a,b){if(b.sign)throw new RangeError("Exponent must be positive");if(0===b.length)return JSBI.__oneDigit(1,!1);if(0===a.length)return a;if(1===a.length&&1===a.__digit(0))return a.sign&&0==(1&b.__digit(0))?JSBI.unaryMinus(a):a;if(1<b.length)throw new RangeError("BigInt too big");let c=b.__unsignedDigit(0);if(1===c)return a;if(c>=JSBI.__kMaxLengthBits)throw new RangeError("BigInt too big");if(1===a.length&&2===a.__digit(0)){const b=1+(c>>>5),d=a.sign&&0!=(1&c),e=new JSBI(b,d);e.__initializeDigits();const f=1<<(31&c);return e.__setDigit(b-1,f),e}let d=null,e=a;for(0!=(1&c)&&(d=a),c>>=1;0!==c;c>>=1)e=JSBI.multiply(e,e),0!=(1&c)&&(null===d?d=e:d=JSBI.multiply(d,e));return d}static multiply(a,b){if(0===a.length)return a;if(0===b.length)return b;let c=a.length+b.length;32<=a.__clzmsd()+b.__clzmsd()&&c--;const d=new JSBI(c,a.sign!==b.sign);d.__initializeDigits();for(let c=0;c<a.length;c++)JSBI.__multiplyAccumulate(b,a.__digit(c),d,c);return d.__trim()}static divide(a,b){if(0===b.length)throw new RangeError("Division by zero");if(0>JSBI.__absoluteCompare(a,b))return JSBI.__zero();const c=a.sign!==b.sign,d=b.__unsignedDigit(0);let e;if(1===b.length&&65535>=d){if(1===d)return c===a.sign?a:JSBI.unaryMinus(a);e=JSBI.__absoluteDivSmall(a,d,null);}else e=JSBI.__absoluteDivLarge(a,b,!0,!1);return e.sign=c,e.__trim()}static remainder(a,b){if(0===b.length)throw new RangeError("Division by zero");if(0>JSBI.__absoluteCompare(a,b))return a;const c=b.__unsignedDigit(0);if(1===b.length&&65535>=c){if(1===c)return JSBI.__zero();const b=JSBI.__absoluteModSmall(a,c);return 0===b?JSBI.__zero():JSBI.__oneDigit(b,a.sign)}const d=JSBI.__absoluteDivLarge(a,b,!1,!0);return d.sign=a.sign,d.__trim()}static add(a,b){const c=a.sign;return c===b.sign?JSBI.__absoluteAdd(a,b,c):0<=JSBI.__absoluteCompare(a,b)?JSBI.__absoluteSub(a,b,c):JSBI.__absoluteSub(b,a,!c)}static subtract(a,b){const c=a.sign;return c===b.sign?0<=JSBI.__absoluteCompare(a,b)?JSBI.__absoluteSub(a,b,c):JSBI.__absoluteSub(b,a,!c):JSBI.__absoluteAdd(a,b,c)}static leftShift(a,b){return 0===b.length||0===a.length?a:b.sign?JSBI.__rightShiftByAbsolute(a,b):JSBI.__leftShiftByAbsolute(a,b)}static signedRightShift(a,b){return 0===b.length||0===a.length?a:b.sign?JSBI.__leftShiftByAbsolute(a,b):JSBI.__rightShiftByAbsolute(a,b)}static unsignedRightShift(){throw new TypeError("BigInts have no unsigned right shift; use >> instead")}static lessThan(a,b){return 0>JSBI.__compareToBigInt(a,b)}static lessThanOrEqual(a,b){return 0>=JSBI.__compareToBigInt(a,b)}static greaterThan(a,b){return 0<JSBI.__compareToBigInt(a,b)}static greaterThanOrEqual(a,b){return 0<=JSBI.__compareToBigInt(a,b)}static equal(a,b){if(a.sign!==b.sign)return !1;if(a.length!==b.length)return !1;for(let c=0;c<a.length;c++)if(a.__digit(c)!==b.__digit(c))return !1;return !0}static bitwiseAnd(a,b){var c=Math.max;if(!a.sign&&!b.sign)return JSBI.__absoluteAnd(a,b).__trim();if(a.sign&&b.sign){const d=c(a.length,b.length)+1;let e=JSBI.__absoluteSubOne(a,d);const f=JSBI.__absoluteSubOne(b);return e=JSBI.__absoluteOr(e,f,e),JSBI.__absoluteAddOne(e,!0,e).__trim()}return a.sign&&([a,b]=[b,a]),JSBI.__absoluteAndNot(a,JSBI.__absoluteSubOne(b)).__trim()}static bitwiseXor(a,b){var c=Math.max;if(!a.sign&&!b.sign)return JSBI.__absoluteXor(a,b).__trim();if(a.sign&&b.sign){const d=c(a.length,b.length),e=JSBI.__absoluteSubOne(a,d),f=JSBI.__absoluteSubOne(b);return JSBI.__absoluteXor(e,f,e).__trim()}const d=c(a.length,b.length)+1;a.sign&&([a,b]=[b,a]);let e=JSBI.__absoluteSubOne(b,d);return e=JSBI.__absoluteXor(e,a,e),JSBI.__absoluteAddOne(e,!0,e).__trim()}static bitwiseOr(a,b){var c=Math.max;const d=c(a.length,b.length);if(!a.sign&&!b.sign)return JSBI.__absoluteOr(a,b).__trim();if(a.sign&&b.sign){let c=JSBI.__absoluteSubOne(a,d);const e=JSBI.__absoluteSubOne(b);return c=JSBI.__absoluteAnd(c,e,c),JSBI.__absoluteAddOne(c,!0,c).__trim()}a.sign&&([a,b]=[b,a]);let e=JSBI.__absoluteSubOne(b,d);return e=JSBI.__absoluteAndNot(e,a,e),JSBI.__absoluteAddOne(e,!0,e).__trim()}static ADD(a,b){if(a=JSBI.__toPrimitive(a),b=JSBI.__toPrimitive(b),"string"==typeof a)return "string"!=typeof b&&(b=b.toString()),a+b;if("string"==typeof b)return a.toString()+b;if(a=JSBI.__toNumeric(a),b=JSBI.__toNumeric(b),JSBI.__isBigInt(a)&&JSBI.__isBigInt(b))return JSBI.add(a,b);if("number"==typeof a&&"number"==typeof b)return a+b;throw new TypeError("Cannot mix BigInt and other types, use explicit conversions")}static LT(a,b){return JSBI.__compare(a,b,0)}static LE(a,b){return JSBI.__compare(a,b,1)}static GT(a,b){return JSBI.__compare(a,b,2)}static GE(a,b){return JSBI.__compare(a,b,3)}static EQ(a,b){for(;;){if(JSBI.__isBigInt(a))return JSBI.__isBigInt(b)?JSBI.equal(a,b):JSBI.EQ(b,a);if("number"==typeof a){if(JSBI.__isBigInt(b))return JSBI.__equalToNumber(b,a);if("object"!=typeof b)return a==b;b=JSBI.__toPrimitive(b);}else if("string"==typeof a){if(JSBI.__isBigInt(b))return a=JSBI.__fromString(a),null!==a&&JSBI.equal(a,b);if("object"!=typeof b)return a==b;b=JSBI.__toPrimitive(b);}else if("boolean"==typeof a){if(JSBI.__isBigInt(b))return JSBI.__equalToNumber(b,+a);if("object"!=typeof b)return a==b;b=JSBI.__toPrimitive(b);}else if("symbol"==typeof a){if(JSBI.__isBigInt(b))return !1;if("object"!=typeof b)return a==b;b=JSBI.__toPrimitive(b);}else if("object"==typeof a){if("object"==typeof b&&b.constructor!==JSBI)return a==b;a=JSBI.__toPrimitive(a);}else return a==b}}static __zero(){return new JSBI(0,!1)}static __oneDigit(a,b){const c=new JSBI(1,b);return c.__setDigit(0,a),c}__copy(){const a=new JSBI(this.length,this.sign);for(let b=0;b<this.length;b++)a[b]=this[b];return a}__trim(){let a=this.length,b=this[a-1];for(;0===b;)a--,b=this[a-1],this.pop();return 0===a&&(this.sign=!1),this}__initializeDigits(){for(let a=0;a<this.length;a++)this[a]=0;}static __decideRounding(a,b,c,d){if(0<b)return -1;let e;if(0>b)e=-b-1;else{if(0===c)return -1;c--,d=a.__digit(c),e=31;}let f=1<<e;if(0==(d&f))return -1;if(f-=1,0!=(d&f))return 1;for(;0<c;)if(c--,0!==a.__digit(c))return 1;return 0}static __fromDouble(a){JSBI.__kBitConversionDouble[0]=a;const b=2047&JSBI.__kBitConversionInts[1]>>>20,c=b-1023,d=(c>>>5)+1,e=new JSBI(d,0>a);let f=1048575&JSBI.__kBitConversionInts[1]|1048576,g=JSBI.__kBitConversionInts[0];const h=20,i=31&c;let j,k=0;if(i<20){const a=h-i;k=a+32,j=f>>>a,f=f<<32-a|g>>>a,g<<=32-a;}else if(i===20)k=32,j=f,f=g;else{const a=i-h;k=32-a,j=f<<a|g>>>32-a,f=g<<a;}e.__setDigit(d-1,j);for(let b=d-2;0<=b;b--)0<k?(k-=32,j=f,f=g):j=0,e.__setDigit(b,j);return e.__trim()}static __isWhitespace(a){return !!(13>=a&&9<=a)||(159>=a?32==a:131071>=a?160==a||5760==a:196607>=a?(a&=131071,10>=a||40==a||41==a||47==a||95==a||4096==a):65279==a)}static __fromString(a,b=0){let c=0;const e=a.length;let f=0;if(f===e)return JSBI.__zero();let g=a.charCodeAt(f);for(;JSBI.__isWhitespace(g);){if(++f===e)return JSBI.__zero();g=a.charCodeAt(f);}if(43===g){if(++f===e)return null;g=a.charCodeAt(f),c=1;}else if(45===g){if(++f===e)return null;g=a.charCodeAt(f),c=-1;}if(0===b){if(b=10,48===g){if(++f===e)return JSBI.__zero();if(g=a.charCodeAt(f),88===g||120===g){if(b=16,++f===e)return null;g=a.charCodeAt(f);}else if(79===g||111===g){if(b=8,++f===e)return null;g=a.charCodeAt(f);}else if(66===g||98===g){if(b=2,++f===e)return null;g=a.charCodeAt(f);}}}else if(16===b&&48===g){if(++f===e)return JSBI.__zero();if(g=a.charCodeAt(f),88===g||120===g){if(++f===e)return null;g=a.charCodeAt(f);}}for(;48===g;){if(++f===e)return JSBI.__zero();g=a.charCodeAt(f);}const h=e-f;let i=JSBI.__kMaxBitsPerChar[b],j=JSBI.__kBitsPerCharTableMultiplier-1;if(h>1073741824/i)return null;const k=i*h+j>>>JSBI.__kBitsPerCharTableShift,l=new JSBI(k+31>>>5,!1),n=10>b?b:10,o=10<b?b-10:0;if(0==(b&b-1)){i>>=JSBI.__kBitsPerCharTableShift;const b=[],c=[];let d=!1;do{let h=0,j=0;for(;;){let b;if(g-48>>>0<n)b=g-48;else if((32|g)-97>>>0<o)b=(32|g)-87;else{d=!0;break}if(j+=i,h=h<<i|b,++f===e){d=!0;break}if(g=a.charCodeAt(f),32<j+i)break}b.push(h),c.push(j);}while(!d);JSBI.__fillFromParts(l,b,c);}else{l.__initializeDigits();let c=!1,h=0;do{let k=0,p=1;for(;;){let i;if(g-48>>>0<n)i=g-48;else if((32|g)-97>>>0<o)i=(32|g)-87;else{c=!0;break}const d=p*b;if(4294967295<d)break;if(p=d,k=k*b+i,h++,++f===e){c=!0;break}g=a.charCodeAt(f);}j=32*JSBI.__kBitsPerCharTableMultiplier-1;const q=i*h+j>>>JSBI.__kBitsPerCharTableShift+5;l.__inplaceMultiplyAdd(p,k,q);}while(!c)}for(;f!==e;){if(!JSBI.__isWhitespace(g))return null;g=a.charCodeAt(f++);}return 0!=c&&10!==b?null:(l.sign=-1==c,l.__trim())}static __fillFromParts(a,b,c){let d=0,e=0,f=0;for(let g=b.length-1;0<=g;g--){const h=b[g],i=c[g];e|=h<<f,f+=i,32===f?(a.__setDigit(d++,e),f=0,e=0):32<f&&(a.__setDigit(d++,e),f-=32,e=h>>>i-f);}if(0!==e){if(d>=a.length)throw new Error("implementation bug");a.__setDigit(d++,e);}for(;d<a.length;d++)a.__setDigit(d,0);}static __toStringBasePowerOfTwo(a,b){var c=Math.clz32;const d=a.length;let e=b-1;e=(85&e>>>1)+(85&e),e=(51&e>>>2)+(51&e),e=(15&e>>>4)+(15&e);const f=e,g=b-1,h=a.__digit(d-1),i=c(h);let j=0|(32*d-i+f-1)/f;if(a.sign&&j++,268435456<j)throw new Error("string too long");const k=Array(j);let l=j-1,m=0,n=0;for(let c=0;c<d-1;c++){const b=a.__digit(c),d=(m|b<<n)&g;k[l--]=JSBI.__kConversionChars[d];const e=f-n;for(m=b>>>e,n=32-e;n>=f;)k[l--]=JSBI.__kConversionChars[m&g],m>>>=f,n-=f;}const o=(m|h<<n)&g;for(k[l--]=JSBI.__kConversionChars[o],m=h>>>f-n;0!==m;)k[l--]=JSBI.__kConversionChars[m&g],m>>>=f;if(a.sign&&(k[l--]="-"),-1!=l)throw new Error("implementation bug");return k.join("")}static __toStringGeneric(a,b,c){var d=Math.clz32;const e=a.length;if(0===e)return "";if(1===e){let d=a.__unsignedDigit(0).toString(b);return !1===c&&a.sign&&(d="-"+d),d}const f=32*e-d(a.__digit(e-1)),g=JSBI.__kMaxBitsPerChar[b],h=g-1;let i=f*JSBI.__kBitsPerCharTableMultiplier;i+=h-1,i=0|i/h;const j=i+1>>1,k=JSBI.exponentiate(JSBI.__oneDigit(b,!1),JSBI.__oneDigit(j,!1));let l,m;const n=k.__unsignedDigit(0);if(1===k.length&&65535>=n){l=new JSBI(a.length,!1),l.__initializeDigits();let c=0;for(let b=2*a.length-1;0<=b;b--){const d=c<<16|a.__halfDigit(b);l.__setHalfDigit(b,0|d/n),c=0|d%n;}m=c.toString(b);}else{const c=JSBI.__absoluteDivLarge(a,k,!0,!0);l=c.quotient;const d=c.remainder.__trim();m=JSBI.__toStringGeneric(d,b,!0);}l.__trim();let o=JSBI.__toStringGeneric(l,b,!0);for(;m.length<j;)m="0"+m;return !1===c&&a.sign&&(o="-"+o),o+m}static __unequalSign(a){return a?-1:1}static __absoluteGreater(a){return a?-1:1}static __absoluteLess(a){return a?1:-1}static __compareToBigInt(a,b){const c=a.sign;if(c!==b.sign)return JSBI.__unequalSign(c);const d=JSBI.__absoluteCompare(a,b);return 0<d?JSBI.__absoluteGreater(c):0>d?JSBI.__absoluteLess(c):0}static __compareToNumber(a,b){if(b|!0){const c=a.sign,d=0>b;if(c!==d)return JSBI.__unequalSign(c);if(0===a.length){if(d)throw new Error("implementation bug");return 0===b?0:-1}if(1<a.length)return JSBI.__absoluteGreater(c);const e=Math.abs(b),f=a.__unsignedDigit(0);return f>e?JSBI.__absoluteGreater(c):f<e?JSBI.__absoluteLess(c):0}return JSBI.__compareToDouble(a,b)}static __compareToDouble(a,b){var c=Math.clz32;if(b!==b)return b;if(b===1/0)return -1;if(b===-Infinity)return 1;const d=a.sign;if(d!==0>b)return JSBI.__unequalSign(d);if(0===b)throw new Error("implementation bug: should be handled elsewhere");if(0===a.length)return -1;JSBI.__kBitConversionDouble[0]=b;const e=2047&JSBI.__kBitConversionInts[1]>>>20;if(2047==e)throw new Error("implementation bug: handled elsewhere");const f=e-1023;if(0>f)return JSBI.__absoluteGreater(d);const g=a.length;let h=a.__digit(g-1);const i=c(h),j=32*g-i,k=f+1;if(j<k)return JSBI.__absoluteLess(d);if(j>k)return JSBI.__absoluteGreater(d);let l=1048576|1048575&JSBI.__kBitConversionInts[1],m=JSBI.__kBitConversionInts[0];const n=20,o=31-i;if(o!==(j-1)%31)throw new Error("implementation bug");let p,q=0;if(20>o){const a=n-o;q=a+32,p=l>>>a,l=l<<32-a|m>>>a,m<<=32-a;}else if(20===o)q=32,p=l,l=m;else{const a=o-n;q=32-a,p=l<<a|m>>>32-a,l=m<<a;}if(h>>>=0,p>>>=0,h>p)return JSBI.__absoluteGreater(d);if(h<p)return JSBI.__absoluteLess(d);for(let c=g-2;0<=c;c--){0<q?(q-=32,p=l>>>0,l=m,m=0):p=0;const b=a.__unsignedDigit(c);if(b>p)return JSBI.__absoluteGreater(d);if(b<p)return JSBI.__absoluteLess(d)}if(0!==l||0!==m){if(0===q)throw new Error("implementation bug");return JSBI.__absoluteLess(d)}return 0}static __equalToNumber(a,b){var c=Math.abs;return b|0===b?0===b?0===a.length:1===a.length&&a.sign===0>b&&a.__unsignedDigit(0)===c(b):0===JSBI.__compareToDouble(a,b)}static __comparisonResultToBool(a,b){switch(b){case 0:return 0>a;case 1:return 0>=a;case 2:return 0<a;case 3:return 0<=a;}throw new Error("unreachable")}static __compare(a,b,c){if(a=JSBI.__toPrimitive(a),b=JSBI.__toPrimitive(b),"string"==typeof a&&"string"==typeof b)switch(c){case 0:return a<b;case 1:return a<=b;case 2:return a>b;case 3:return a>=b;}if(JSBI.__isBigInt(a)&&"string"==typeof b)return b=JSBI.__fromString(b),null!==b&&JSBI.__comparisonResultToBool(JSBI.__compareToBigInt(a,b),c);if("string"==typeof a&&JSBI.__isBigInt(b))return a=JSBI.__fromString(a),null!==a&&JSBI.__comparisonResultToBool(JSBI.__compareToBigInt(a,b),c);if(a=JSBI.__toNumeric(a),b=JSBI.__toNumeric(b),JSBI.__isBigInt(a)){if(JSBI.__isBigInt(b))return JSBI.__comparisonResultToBool(JSBI.__compareToBigInt(a,b),c);if("number"!=typeof b)throw new Error("implementation bug");return JSBI.__comparisonResultToBool(JSBI.__compareToNumber(a,b),c)}if("number"!=typeof a)throw new Error("implementation bug");if(JSBI.__isBigInt(b))return JSBI.__comparisonResultToBool(JSBI.__compareToNumber(b,a),2^c);if("number"!=typeof b)throw new Error("implementation bug");return 0===c?a<b:1===c?a<=b:2===c?a>b:3===c?a>=b:void 0}__clzmsd(){return Math.clz32(this[this.length-1])}static __absoluteAdd(a,b,c){if(a.length<b.length)return JSBI.__absoluteAdd(b,a,c);if(0===a.length)return a;if(0===b.length)return a.sign===c?a:JSBI.unaryMinus(a);let d=a.length;(0===a.__clzmsd()||b.length===a.length&&0===b.__clzmsd())&&d++;const e=new JSBI(d,c);let f=0,g=0;for(;g<b.length;g++){const c=b.__digit(g),d=a.__digit(g),h=(65535&d)+(65535&c)+f,i=(d>>>16)+(c>>>16)+(h>>>16);f=i>>>16,e.__setDigit(g,65535&h|i<<16);}for(;g<a.length;g++){const b=a.__digit(g),c=(65535&b)+f,d=(b>>>16)+(c>>>16);f=d>>>16,e.__setDigit(g,65535&c|d<<16);}return g<e.length&&e.__setDigit(g,f),e.__trim()}static __absoluteSub(a,b,c){if(0===a.length)return a;if(0===b.length)return a.sign===c?a:JSBI.unaryMinus(a);const d=new JSBI(a.length,c);let e=0,f=0;for(;f<b.length;f++){const c=a.__digit(f),g=b.__digit(f),h=(65535&c)-(65535&g)-e;e=1&h>>>16;const i=(c>>>16)-(g>>>16)-e;e=1&i>>>16,d.__setDigit(f,65535&h|i<<16);}for(;f<a.length;f++){const b=a.__digit(f),c=(65535&b)-e;e=1&c>>>16;const g=(b>>>16)-e;e=1&g>>>16,d.__setDigit(f,65535&c|g<<16);}return d.__trim()}static __absoluteAddOne(a,b,c=null){const d=a.length;null===c?c=new JSBI(d,b):c.sign=b;let e=!0;for(let f,g=0;g<d;g++){f=a.__digit(g);const b=-1===f;e&&(f=0|f+1),e=b,c.__setDigit(g,f);}return e&&c.__setDigitGrow(d,1),c}static __absoluteSubOne(a,b){const c=a.length;b=b||c;const d=new JSBI(b,!1);let e=!0;for(let f,g=0;g<c;g++){f=a.__digit(g);const b=0===f;e&&(f=0|f-1),e=b,d.__setDigit(g,f);}for(let e=c;e<b;e++)d.__setDigit(e,0);return d}static __absoluteAnd(a,b,c=null){let d=a.length,e=b.length,f=e;if(d<e){f=d;const c=a,g=d;a=b,d=e,b=c,e=g;}let g=f;null===c?c=new JSBI(g,!1):g=c.length;let h=0;for(;h<f;h++)c.__setDigit(h,a.__digit(h)&b.__digit(h));for(;h<g;h++)c.__setDigit(h,0);return c}static __absoluteAndNot(a,b,c=null){const d=a.length,e=b.length;let f=e;d<e&&(f=d);let g=d;null===c?c=new JSBI(g,!1):g=c.length;let h=0;for(;h<f;h++)c.__setDigit(h,a.__digit(h)&~b.__digit(h));for(;h<d;h++)c.__setDigit(h,a.__digit(h));for(;h<g;h++)c.__setDigit(h,0);return c}static __absoluteOr(a,b,c=null){let d=a.length,e=b.length,f=e;if(d<e){f=d;const c=a,g=d;a=b,d=e,b=c,e=g;}let g=d;null===c?c=new JSBI(g,!1):g=c.length;let h=0;for(;h<f;h++)c.__setDigit(h,a.__digit(h)|b.__digit(h));for(;h<d;h++)c.__setDigit(h,a.__digit(h));for(;h<g;h++)c.__setDigit(h,0);return c}static __absoluteXor(a,b,c=null){let d=a.length,e=b.length,f=e;if(d<e){f=d;const c=a,g=d;a=b,d=e,b=c,e=g;}let g=d;null===c?c=new JSBI(g,!1):g=c.length;let h=0;for(;h<f;h++)c.__setDigit(h,a.__digit(h)^b.__digit(h));for(;h<d;h++)c.__setDigit(h,a.__digit(h));for(;h<g;h++)c.__setDigit(h,0);return c}static __absoluteCompare(a,b){const c=a.length-b.length;if(0!=c)return c;let d=a.length-1;for(;0<=d&&a.__digit(d)===b.__digit(d);)d--;return 0>d?0:a.__unsignedDigit(d)>b.__unsignedDigit(d)?1:-1}static __multiplyAccumulate(a,b,c,d){var e=Math.imul;if(0===b)return;const f=65535&b,g=b>>>16;let h=0,j=0,k=0;for(let l=0;l<a.length;l++,d++){let b=c.__digit(d),i=65535&b,m=b>>>16;const n=a.__digit(l),o=65535&n,p=n>>>16,q=e(o,f),r=e(o,g),s=e(p,f),t=e(p,g);i+=j+(65535&q),m+=k+h+(i>>>16)+(q>>>16)+(65535&r)+(65535&s),h=m>>>16,j=(r>>>16)+(s>>>16)+(65535&t)+h,h=j>>>16,j&=65535,k=t>>>16,b=65535&i|m<<16,c.__setDigit(d,b);}for(;0!=h||0!==j||0!==k;d++){let a=c.__digit(d);const b=(65535&a)+j,e=(a>>>16)+(b>>>16)+k+h;j=0,k=0,h=e>>>16,a=65535&b|e<<16,c.__setDigit(d,a);}}static __internalMultiplyAdd(a,b,c,d,e){var f=Math.imul;let g=c,h=0;for(let j=0;j<d;j++){const c=a.__digit(j),d=f(65535&c,b),i=(65535&d)+h+g;g=i>>>16;const k=f(c>>>16,b),l=(65535&k)+(d>>>16)+g;g=l>>>16,h=k>>>16,e.__setDigit(j,l<<16|65535&i);}if(e.length>d)for(e.__setDigit(d++,g+h);d<e.length;)e.__setDigit(d++,0);else if(0!==g+h)throw new Error("implementation bug")}__inplaceMultiplyAdd(a,b,c){var e=Math.imul;c>this.length&&(c=this.length);const f=65535&a,g=a>>>16;let h=0,j=65535&b,k=b>>>16;for(let l=0;l<c;l++){const a=this.__digit(l),b=65535&a,c=a>>>16,d=e(b,f),i=e(b,g),m=e(c,f),n=e(c,g),o=j+(65535&d),p=k+h+(o>>>16)+(d>>>16)+(65535&i)+(65535&m);j=(i>>>16)+(m>>>16)+(65535&n)+(p>>>16),h=j>>>16,j&=65535,k=n>>>16;this.__setDigit(l,65535&o|p<<16);}if(0!=h||0!==j||0!==k)throw new Error("implementation bug")}static __absoluteDivSmall(a,b,c){null===c&&(c=new JSBI(a.length,!1));let d=0;for(let e,f=2*a.length-1;0<=f;f-=2){e=(d<<16|a.__halfDigit(f))>>>0;const g=0|e/b;d=0|e%b,e=(d<<16|a.__halfDigit(f-1))>>>0;const h=0|e/b;d=0|e%b,c.__setDigit(f>>>1,g<<16|h);}return c}static __absoluteModSmall(a,b){let c=0;for(let d=2*a.length-1;0<=d;d--){const e=(c<<16|a.__halfDigit(d))>>>0;c=0|e%b;}return c}static __absoluteDivLarge(a,b,d,e){var f=Math.imul;const g=b.__halfDigitLength(),h=b.length,c=a.__halfDigitLength()-g;let i=null;d&&(i=new JSBI(c+2>>>1,!1),i.__initializeDigits());const k=new JSBI(g+2>>>1,!1);k.__initializeDigits();const l=JSBI.__clz16(b.__halfDigit(g-1));0<l&&(b=JSBI.__specialLeftShift(b,l,0));const m=JSBI.__specialLeftShift(a,l,1),n=b.__halfDigit(g-1);let o=0;for(let l,p=c;0<=p;p--){l=65535;const a=m.__halfDigit(p+g);if(a!==n){const c=(a<<16|m.__halfDigit(p+g-1))>>>0;l=0|c/n;let d=0|c%n;const e=b.__halfDigit(g-2),h=m.__halfDigit(p+g-2);for(;f(l,e)>>>0>(d<<16|h)>>>0&&(l--,d+=n,!(65535<d)););}JSBI.__internalMultiplyAdd(b,l,0,h,k);let e=m.__inplaceSub(k,p,g+1);0!==e&&(e=m.__inplaceAdd(b,p,g),m.__setHalfDigit(p+g,m.__halfDigit(p+g)+e),l--),d&&(1&p?o=l<<16:i.__setDigit(p>>>1,o|l));}return e?(m.__inplaceRightShift(l),d?{quotient:i,remainder:m}:m):d?i:void 0}static __clz16(a){return Math.clz32(a)-16}__inplaceAdd(a,b,c){let d=0;for(let e=0;e<c;e++){const c=this.__halfDigit(b+e)+a.__halfDigit(e)+d;d=c>>>16,this.__setHalfDigit(b+e,c);}return d}__inplaceSub(a,b,c){let d=0;if(1&b){b>>=1;let e=this.__digit(b),f=65535&e,g=0;for(;g<c-1>>>1;g++){const c=a.__digit(g),h=(e>>>16)-(65535&c)-d;d=1&h>>>16,this.__setDigit(b+g,h<<16|65535&f),e=this.__digit(b+g+1),f=(65535&e)-(c>>>16)-d,d=1&f>>>16;}const h=a.__digit(g),i=(e>>>16)-(65535&h)-d;d=1&i>>>16,this.__setDigit(b+g,i<<16|65535&f);if(b+g+1>=this.length)throw new RangeError("out of bounds");0==(1&c)&&(e=this.__digit(b+g+1),f=(65535&e)-(h>>>16)-d,d=1&f>>>16,this.__setDigit(b+a.length,4294901760&e|65535&f));}else{b>>=1;let e=0;for(;e<a.length-1;e++){const c=this.__digit(b+e),f=a.__digit(e),g=(65535&c)-(65535&f)-d;d=1&g>>>16;const h=(c>>>16)-(f>>>16)-d;d=1&h>>>16,this.__setDigit(b+e,h<<16|65535&g);}const f=this.__digit(b+e),g=a.__digit(e),h=(65535&f)-(65535&g)-d;d=1&h>>>16;let i=0;0==(1&c)&&(i=(f>>>16)-(g>>>16)-d,d=1&i>>>16),this.__setDigit(b+e,i<<16|65535&h);}return d}__inplaceRightShift(a){if(0===a)return;let b=this.__digit(0)>>>a;const c=this.length-1;for(let e=0;e<c;e++){const c=this.__digit(e+1);this.__setDigit(e,c<<32-a|b),b=c>>>a;}this.__setDigit(c,b);}static __specialLeftShift(a,b,c){const d=a.length,e=new JSBI(d+c,!1);if(0===b){for(let b=0;b<d;b++)e.__setDigit(b,a.__digit(b));return 0<c&&e.__setDigit(d,0),e}let f=0;for(let g=0;g<d;g++){const c=a.__digit(g);e.__setDigit(g,c<<b|f),f=c>>>32-b;}return 0<c&&e.__setDigit(d,f),e}static __leftShiftByAbsolute(a,b){const c=JSBI.__toShiftAmount(b);if(0>c)throw new RangeError("BigInt too big");const e=c>>>5,f=31&c,g=a.length,h=0!==f&&0!=a.__digit(g-1)>>>32-f,j=g+e+(h?1:0),k=new JSBI(j,a.sign);if(0===f){let b=0;for(;b<e;b++)k.__setDigit(b,0);for(;b<j;b++)k.__setDigit(b,a.__digit(b-e));}else{let b=0;for(let a=0;a<e;a++)k.__setDigit(a,0);for(let c=0;c<g;c++){const g=a.__digit(c);k.__setDigit(c+e,g<<f|b),b=g>>>32-f;}if(h)k.__setDigit(g+e,b);else if(0!=b)throw new Error("implementation bug")}return k.__trim()}static __rightShiftByAbsolute(a,b){const c=a.length,d=a.sign,e=JSBI.__toShiftAmount(b);if(0>e)return JSBI.__rightShiftByMaximum(d);const f=e>>>5,g=31&e;let h=c-f;if(0>=h)return JSBI.__rightShiftByMaximum(d);let i=!1;if(d){if(0!=(a.__digit(f)&(1<<g)-1))i=!0;else for(let b=0;b<f;b++)if(0!==a.__digit(b)){i=!0;break}}if(i&&0===g){const b=a.__digit(c-1);0==~b&&h++;}let j=new JSBI(h,d);if(0===g)for(let b=f;b<c;b++)j.__setDigit(b-f,a.__digit(b));else{let b=a.__digit(f)>>>g;const d=c-f-1;for(let c=0;c<d;c++){const e=a.__digit(c+f+1);j.__setDigit(c,e<<32-g|b),b=e>>>g;}j.__setDigit(d,b);}return i&&(j=JSBI.__absoluteAddOne(j,!0,j)),j.__trim()}static __rightShiftByMaximum(a){return a?JSBI.__oneDigit(1,!0):JSBI.__zero()}static __toShiftAmount(a){if(1<a.length)return -1;const b=a.__unsignedDigit(0);return b>JSBI.__kMaxLengthBits?-1:b}static __toPrimitive(a,b="default"){if("object"!=typeof a)return a;if(a.constructor===JSBI)return a;const c=a[Symbol.toPrimitive];if(c){const a=c(b);if("object"!=typeof a)return a;throw new TypeError("Cannot convert object to primitive value")}const d=a.valueOf;if(d){const b=d.call(a);if("object"!=typeof b)return b}const e=a.toString;if(e){const b=e.call(a);if("object"!=typeof b)return b}throw new TypeError("Cannot convert object to primitive value")}static __toNumeric(a){return JSBI.__isBigInt(a)?a:+a}static __isBigInt(a){return "object"==typeof a&&a.constructor===JSBI}__digit(a){return this[a]}__unsignedDigit(a){return this[a]>>>0}__setDigit(a,b){this[a]=0|b;}__setDigitGrow(a,b){this[a]=0|b;}__halfDigitLength(){const a=this.length;return 65535>=this.__unsignedDigit(a-1)?2*a-1:2*a}__halfDigit(a){return 65535&this[a>>>1]>>>((1&a)<<4)}__setHalfDigit(a,b){const c=a>>>1,d=this.__digit(c),e=1&a?65535&d|b<<16:4294901760&d|65535&b;this.__setDigit(c,e);}static __digitPow(a,b){let c=1;for(;0<b;)1&b&&(c*=a),b>>>=1,a*=a;return c}}JSBI.__kMaxLength=33554432,JSBI.__kMaxLengthBits=JSBI.__kMaxLength<<5,JSBI.__kMaxBitsPerChar=[0,0,32,51,64,75,83,90,96,102,107,111,115,119,122,126,128,131,134,136,139,141,143,145,147,149,151,153,154,156,158,159,160,162,163,165,166],JSBI.__kBitsPerCharTableShift=5,JSBI.__kBitsPerCharTableMultiplier=1<<JSBI.__kBitsPerCharTableShift,JSBI.__kConversionChars=["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"],JSBI.__kBitConversionBuffer=new ArrayBuffer(8),JSBI.__kBitConversionDouble=new Float64Array(JSBI.__kBitConversionBuffer),JSBI.__kBitConversionInts=new Int32Array(JSBI.__kBitConversionBuffer);

  /**
   * Convert Uint8 array to hex string
   * @param {string} hexString
   * @return {Uint8Array} 
   */

  var fromHexString = function fromHexString(hexString) {
    if (hexString.length % 2 === 1) hexString = '0' + hexString;
    var m = hexString.match(/.{1,2}/g);
    if (!m) return new Uint8Array([]);
    return new Uint8Array(m.map(function (byte) {
      return parseInt(byte, 16);
    }));
  };
  /**
   * Convert number to Uint8 array
   * @param {number} d 
   * @param {number} bitLength default 64, can also use 32
   */


  var fromNumber = function fromNumber(d) {
    var bitLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 64;
    var bytes = bitLength / 8;

    if (d >= Math.pow(2, bitLength)) {
      throw new Error('Number exeeds uint64 range');
    }

    var arr = new Uint8Array(bytes);

    for (var i = 0, j = 1; i < bytes; i++, j *= 0x100) {
      arr[i] = d / j & 0xff;
    }

    return arr;
  };
  /**
   * Convert BigInt to Uint8 array
   * @param {JSBI} d 
   */


  var fromBigInt = function fromBigInt(d) {
    return fromHexString(JSBI.BigInt(d).toString(16));
  };
  /**
   * Encodes address form byte array to string.
   * @param {number[]} byteArray 
   * @param {string} address
   */


  var encodeAddress = function encodeAddress(byteArray) {
    if (byteArray.length <= ACCOUNT_NAME_LENGTH) {
      return Buffer.from(byteArray).toString();
    }

    var buf = Buffer.from([ADDRESS_PREFIXES.ACCOUNT].concat(_toConsumableArray(byteArray)));
    return bs58check.encode(buf);
  };
  /**
   * Decodes address from string to byte array.
   * @param {string} address base58check encoded address or name
   * @return {number[]} byte array
   */


  var decodeAddress = function decodeAddress(address) {
    if (address.length <= ACCOUNT_NAME_LENGTH) {
      return Buffer.from(address);
    }

    return bs58check.decode(address).slice(1);
  };
  /**
   * Encodes address form byte array to string.
   * @param {number[]} byteArray 
   * @param {string} address
   */


  var encodePrivateKey = function encodePrivateKey(byteArray) {
    var buf = Buffer.from([ADDRESS_PREFIXES.PRIVATE_KEY].concat(_toConsumableArray(byteArray)));
    return bs58check.encode(buf);
  };
  /**
   * Decodes address from string to byte array.
   * @param {string} address base58check encoded privkey 
   * @return {number[]} byte array
   */


  var decodePrivateKey = function decodePrivateKey(key) {
    return bs58check.decode(key).slice(1);
  };

  function encodeTxHash(bytes) {
    return bs58.encode(Buffer.from(Uint8Array.from(bytes)));
  }

  var _args = [
  	[
  		"elliptic@6.4.1",
  		"/Users/paulgrau/projects/aergo/herajs-crypto"
  	]
  ];
  var _development = true;
  var _from = "elliptic@6.4.1";
  var _id = "elliptic@6.4.1";
  var _inBundle = false;
  var _integrity = "sha512-BsXLz5sqX8OHcsh7CqBMztyXARmGQ3LWPtGjJi6DiJHq5C/qvi9P3OqgswKSDftbu8+IoI/QDTAm2fFnQ9SZSQ==";
  var _location = "/elliptic";
  var _phantomChildren = {
  };
  var _requested = {
  	type: "version",
  	registry: true,
  	raw: "elliptic@6.4.1",
  	name: "elliptic",
  	escapedName: "elliptic",
  	rawSpec: "6.4.1",
  	saveSpec: null,
  	fetchSpec: "6.4.1"
  };
  var _requiredBy = [
  	"#DEV:/",
  	"/browserify-sign",
  	"/create-ecdh"
  ];
  var _resolved = "https://registry.npmjs.org/elliptic/-/elliptic-6.4.1.tgz";
  var _spec = "6.4.1";
  var _where = "/Users/paulgrau/projects/aergo/herajs-crypto";
  var author = {
  	name: "Fedor Indutny",
  	email: "fedor@indutny.com"
  };
  var bugs = {
  	url: "https://github.com/indutny/elliptic/issues"
  };
  var dependencies = {
  	"bn.js": "^4.4.0",
  	brorand: "^1.0.1",
  	"hash.js": "^1.0.0",
  	"hmac-drbg": "^1.0.0",
  	inherits: "^2.0.1",
  	"minimalistic-assert": "^1.0.0",
  	"minimalistic-crypto-utils": "^1.0.0"
  };
  var description = "EC cryptography";
  var devDependencies = {
  	brfs: "^1.4.3",
  	coveralls: "^2.11.3",
  	grunt: "^0.4.5",
  	"grunt-browserify": "^5.0.0",
  	"grunt-cli": "^1.2.0",
  	"grunt-contrib-connect": "^1.0.0",
  	"grunt-contrib-copy": "^1.0.0",
  	"grunt-contrib-uglify": "^1.0.1",
  	"grunt-mocha-istanbul": "^3.0.1",
  	"grunt-saucelabs": "^8.6.2",
  	istanbul: "^0.4.2",
  	jscs: "^2.9.0",
  	jshint: "^2.6.0",
  	mocha: "^2.1.0"
  };
  var files = [
  	"lib"
  ];
  var homepage = "https://github.com/indutny/elliptic";
  var keywords = [
  	"EC",
  	"Elliptic",
  	"curve",
  	"Cryptography"
  ];
  var license = "MIT";
  var main = "lib/elliptic.js";
  var name = "elliptic";
  var repository = {
  	type: "git",
  	url: "git+ssh://git@github.com/indutny/elliptic.git"
  };
  var scripts = {
  	jscs: "jscs benchmarks/*.js lib/*.js lib/**/*.js lib/**/**/*.js test/index.js",
  	jshint: "jscs benchmarks/*.js lib/*.js lib/**/*.js lib/**/**/*.js test/index.js",
  	lint: "npm run jscs && npm run jshint",
  	test: "npm run lint && npm run unit",
  	unit: "istanbul test _mocha --reporter=spec test/index.js",
  	version: "grunt dist && git add dist/"
  };
  var version = "6.4.1";
  var _package = {
  	_args: _args,
  	_development: _development,
  	_from: _from,
  	_id: _id,
  	_inBundle: _inBundle,
  	_integrity: _integrity,
  	_location: _location,
  	_phantomChildren: _phantomChildren,
  	_requested: _requested,
  	_requiredBy: _requiredBy,
  	_resolved: _resolved,
  	_spec: _spec,
  	_where: _where,
  	author: author,
  	bugs: bugs,
  	dependencies: dependencies,
  	description: description,
  	devDependencies: devDependencies,
  	files: files,
  	homepage: homepage,
  	keywords: keywords,
  	license: license,
  	main: main,
  	name: name,
  	repository: repository,
  	scripts: scripts,
  	version: version
  };

  var _package$1 = /*#__PURE__*/Object.freeze({
    _args: _args,
    _development: _development,
    _from: _from,
    _id: _id,
    _inBundle: _inBundle,
    _integrity: _integrity,
    _location: _location,
    _phantomChildren: _phantomChildren,
    _requested: _requested,
    _requiredBy: _requiredBy,
    _resolved: _resolved,
    _spec: _spec,
    _where: _where,
    author: author,
    bugs: bugs,
    dependencies: dependencies,
    description: description,
    devDependencies: devDependencies,
    files: files,
    homepage: homepage,
    keywords: keywords,
    license: license,
    main: main,
    name: name,
    repository: repository,
    scripts: scripts,
    version: version,
    default: _package
  });

  var bn = createCommonjsModule(function (module) {
  (function (module, exports) {

    // Utils
    function assert (val, msg) {
      if (!val) throw new Error(msg || 'Assertion failed');
    }

    // Could use `inherits` module, but don't want to move from single file
    // architecture yet.
    function inherits (ctor, superCtor) {
      ctor.super_ = superCtor;
      var TempCtor = function () {};
      TempCtor.prototype = superCtor.prototype;
      ctor.prototype = new TempCtor();
      ctor.prototype.constructor = ctor;
    }

    // BN

    function BN (number, base, endian) {
      if (BN.isBN(number)) {
        return number;
      }

      this.negative = 0;
      this.words = null;
      this.length = 0;

      // Reduction context
      this.red = null;

      if (number !== null) {
        if (base === 'le' || base === 'be') {
          endian = base;
          base = 10;
        }

        this._init(number || 0, base || 10, endian || 'be');
      }
    }
    if (typeof module === 'object') {
      module.exports = BN;
    } else {
      exports.BN = BN;
    }

    BN.BN = BN;
    BN.wordSize = 26;

    var Buffer;
    try {
      Buffer = buffer.Buffer;
    } catch (e) {
    }

    BN.isBN = function isBN (num) {
      if (num instanceof BN) {
        return true;
      }

      return num !== null && typeof num === 'object' &&
        num.constructor.wordSize === BN.wordSize && Array.isArray(num.words);
    };

    BN.max = function max (left, right) {
      if (left.cmp(right) > 0) return left;
      return right;
    };

    BN.min = function min (left, right) {
      if (left.cmp(right) < 0) return left;
      return right;
    };

    BN.prototype._init = function init (number, base, endian) {
      if (typeof number === 'number') {
        return this._initNumber(number, base, endian);
      }

      if (typeof number === 'object') {
        return this._initArray(number, base, endian);
      }

      if (base === 'hex') {
        base = 16;
      }
      assert(base === (base | 0) && base >= 2 && base <= 36);

      number = number.toString().replace(/\s+/g, '');
      var start = 0;
      if (number[0] === '-') {
        start++;
      }

      if (base === 16) {
        this._parseHex(number, start);
      } else {
        this._parseBase(number, base, start);
      }

      if (number[0] === '-') {
        this.negative = 1;
      }

      this.strip();

      if (endian !== 'le') return;

      this._initArray(this.toArray(), base, endian);
    };

    BN.prototype._initNumber = function _initNumber (number, base, endian) {
      if (number < 0) {
        this.negative = 1;
        number = -number;
      }
      if (number < 0x4000000) {
        this.words = [ number & 0x3ffffff ];
        this.length = 1;
      } else if (number < 0x10000000000000) {
        this.words = [
          number & 0x3ffffff,
          (number / 0x4000000) & 0x3ffffff
        ];
        this.length = 2;
      } else {
        assert(number < 0x20000000000000); // 2 ^ 53 (unsafe)
        this.words = [
          number & 0x3ffffff,
          (number / 0x4000000) & 0x3ffffff,
          1
        ];
        this.length = 3;
      }

      if (endian !== 'le') return;

      // Reverse the bytes
      this._initArray(this.toArray(), base, endian);
    };

    BN.prototype._initArray = function _initArray (number, base, endian) {
      // Perhaps a Uint8Array
      assert(typeof number.length === 'number');
      if (number.length <= 0) {
        this.words = [ 0 ];
        this.length = 1;
        return this;
      }

      this.length = Math.ceil(number.length / 3);
      this.words = new Array(this.length);
      for (var i = 0; i < this.length; i++) {
        this.words[i] = 0;
      }

      var j, w;
      var off = 0;
      if (endian === 'be') {
        for (i = number.length - 1, j = 0; i >= 0; i -= 3) {
          w = number[i] | (number[i - 1] << 8) | (number[i - 2] << 16);
          this.words[j] |= (w << off) & 0x3ffffff;
          this.words[j + 1] = (w >>> (26 - off)) & 0x3ffffff;
          off += 24;
          if (off >= 26) {
            off -= 26;
            j++;
          }
        }
      } else if (endian === 'le') {
        for (i = 0, j = 0; i < number.length; i += 3) {
          w = number[i] | (number[i + 1] << 8) | (number[i + 2] << 16);
          this.words[j] |= (w << off) & 0x3ffffff;
          this.words[j + 1] = (w >>> (26 - off)) & 0x3ffffff;
          off += 24;
          if (off >= 26) {
            off -= 26;
            j++;
          }
        }
      }
      return this.strip();
    };

    function parseHex (str, start, end) {
      var r = 0;
      var len = Math.min(str.length, end);
      for (var i = start; i < len; i++) {
        var c = str.charCodeAt(i) - 48;

        r <<= 4;

        // 'a' - 'f'
        if (c >= 49 && c <= 54) {
          r |= c - 49 + 0xa;

        // 'A' - 'F'
        } else if (c >= 17 && c <= 22) {
          r |= c - 17 + 0xa;

        // '0' - '9'
        } else {
          r |= c & 0xf;
        }
      }
      return r;
    }

    BN.prototype._parseHex = function _parseHex (number, start) {
      // Create possibly bigger array to ensure that it fits the number
      this.length = Math.ceil((number.length - start) / 6);
      this.words = new Array(this.length);
      for (var i = 0; i < this.length; i++) {
        this.words[i] = 0;
      }

      var j, w;
      // Scan 24-bit chunks and add them to the number
      var off = 0;
      for (i = number.length - 6, j = 0; i >= start; i -= 6) {
        w = parseHex(number, i, i + 6);
        this.words[j] |= (w << off) & 0x3ffffff;
        // NOTE: `0x3fffff` is intentional here, 26bits max shift + 24bit hex limb
        this.words[j + 1] |= w >>> (26 - off) & 0x3fffff;
        off += 24;
        if (off >= 26) {
          off -= 26;
          j++;
        }
      }
      if (i + 6 !== start) {
        w = parseHex(number, start, i + 6);
        this.words[j] |= (w << off) & 0x3ffffff;
        this.words[j + 1] |= w >>> (26 - off) & 0x3fffff;
      }
      this.strip();
    };

    function parseBase (str, start, end, mul) {
      var r = 0;
      var len = Math.min(str.length, end);
      for (var i = start; i < len; i++) {
        var c = str.charCodeAt(i) - 48;

        r *= mul;

        // 'a'
        if (c >= 49) {
          r += c - 49 + 0xa;

        // 'A'
        } else if (c >= 17) {
          r += c - 17 + 0xa;

        // '0' - '9'
        } else {
          r += c;
        }
      }
      return r;
    }

    BN.prototype._parseBase = function _parseBase (number, base, start) {
      // Initialize as zero
      this.words = [ 0 ];
      this.length = 1;

      // Find length of limb in base
      for (var limbLen = 0, limbPow = 1; limbPow <= 0x3ffffff; limbPow *= base) {
        limbLen++;
      }
      limbLen--;
      limbPow = (limbPow / base) | 0;

      var total = number.length - start;
      var mod = total % limbLen;
      var end = Math.min(total, total - mod) + start;

      var word = 0;
      for (var i = start; i < end; i += limbLen) {
        word = parseBase(number, i, i + limbLen, base);

        this.imuln(limbPow);
        if (this.words[0] + word < 0x4000000) {
          this.words[0] += word;
        } else {
          this._iaddn(word);
        }
      }

      if (mod !== 0) {
        var pow = 1;
        word = parseBase(number, i, number.length, base);

        for (i = 0; i < mod; i++) {
          pow *= base;
        }

        this.imuln(pow);
        if (this.words[0] + word < 0x4000000) {
          this.words[0] += word;
        } else {
          this._iaddn(word);
        }
      }
    };

    BN.prototype.copy = function copy (dest) {
      dest.words = new Array(this.length);
      for (var i = 0; i < this.length; i++) {
        dest.words[i] = this.words[i];
      }
      dest.length = this.length;
      dest.negative = this.negative;
      dest.red = this.red;
    };

    BN.prototype.clone = function clone () {
      var r = new BN(null);
      this.copy(r);
      return r;
    };

    BN.prototype._expand = function _expand (size) {
      while (this.length < size) {
        this.words[this.length++] = 0;
      }
      return this;
    };

    // Remove leading `0` from `this`
    BN.prototype.strip = function strip () {
      while (this.length > 1 && this.words[this.length - 1] === 0) {
        this.length--;
      }
      return this._normSign();
    };

    BN.prototype._normSign = function _normSign () {
      // -0 = 0
      if (this.length === 1 && this.words[0] === 0) {
        this.negative = 0;
      }
      return this;
    };

    BN.prototype.inspect = function inspect () {
      return (this.red ? '<BN-R: ' : '<BN: ') + this.toString(16) + '>';
    };

    /*

    var zeros = [];
    var groupSizes = [];
    var groupBases = [];

    var s = '';
    var i = -1;
    while (++i < BN.wordSize) {
      zeros[i] = s;
      s += '0';
    }
    groupSizes[0] = 0;
    groupSizes[1] = 0;
    groupBases[0] = 0;
    groupBases[1] = 0;
    var base = 2 - 1;
    while (++base < 36 + 1) {
      var groupSize = 0;
      var groupBase = 1;
      while (groupBase < (1 << BN.wordSize) / base) {
        groupBase *= base;
        groupSize += 1;
      }
      groupSizes[base] = groupSize;
      groupBases[base] = groupBase;
    }

    */

    var zeros = [
      '',
      '0',
      '00',
      '000',
      '0000',
      '00000',
      '000000',
      '0000000',
      '00000000',
      '000000000',
      '0000000000',
      '00000000000',
      '000000000000',
      '0000000000000',
      '00000000000000',
      '000000000000000',
      '0000000000000000',
      '00000000000000000',
      '000000000000000000',
      '0000000000000000000',
      '00000000000000000000',
      '000000000000000000000',
      '0000000000000000000000',
      '00000000000000000000000',
      '000000000000000000000000',
      '0000000000000000000000000'
    ];

    var groupSizes = [
      0, 0,
      25, 16, 12, 11, 10, 9, 8,
      8, 7, 7, 7, 7, 6, 6,
      6, 6, 6, 6, 6, 5, 5,
      5, 5, 5, 5, 5, 5, 5,
      5, 5, 5, 5, 5, 5, 5
    ];

    var groupBases = [
      0, 0,
      33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216,
      43046721, 10000000, 19487171, 35831808, 62748517, 7529536, 11390625,
      16777216, 24137569, 34012224, 47045881, 64000000, 4084101, 5153632,
      6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149,
      24300000, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176
    ];

    BN.prototype.toString = function toString (base, padding) {
      base = base || 10;
      padding = padding | 0 || 1;

      var out;
      if (base === 16 || base === 'hex') {
        out = '';
        var off = 0;
        var carry = 0;
        for (var i = 0; i < this.length; i++) {
          var w = this.words[i];
          var word = (((w << off) | carry) & 0xffffff).toString(16);
          carry = (w >>> (24 - off)) & 0xffffff;
          if (carry !== 0 || i !== this.length - 1) {
            out = zeros[6 - word.length] + word + out;
          } else {
            out = word + out;
          }
          off += 2;
          if (off >= 26) {
            off -= 26;
            i--;
          }
        }
        if (carry !== 0) {
          out = carry.toString(16) + out;
        }
        while (out.length % padding !== 0) {
          out = '0' + out;
        }
        if (this.negative !== 0) {
          out = '-' + out;
        }
        return out;
      }

      if (base === (base | 0) && base >= 2 && base <= 36) {
        // var groupSize = Math.floor(BN.wordSize * Math.LN2 / Math.log(base));
        var groupSize = groupSizes[base];
        // var groupBase = Math.pow(base, groupSize);
        var groupBase = groupBases[base];
        out = '';
        var c = this.clone();
        c.negative = 0;
        while (!c.isZero()) {
          var r = c.modn(groupBase).toString(base);
          c = c.idivn(groupBase);

          if (!c.isZero()) {
            out = zeros[groupSize - r.length] + r + out;
          } else {
            out = r + out;
          }
        }
        if (this.isZero()) {
          out = '0' + out;
        }
        while (out.length % padding !== 0) {
          out = '0' + out;
        }
        if (this.negative !== 0) {
          out = '-' + out;
        }
        return out;
      }

      assert(false, 'Base should be between 2 and 36');
    };

    BN.prototype.toNumber = function toNumber () {
      var ret = this.words[0];
      if (this.length === 2) {
        ret += this.words[1] * 0x4000000;
      } else if (this.length === 3 && this.words[2] === 0x01) {
        // NOTE: at this stage it is known that the top bit is set
        ret += 0x10000000000000 + (this.words[1] * 0x4000000);
      } else if (this.length > 2) {
        assert(false, 'Number can only safely store up to 53 bits');
      }
      return (this.negative !== 0) ? -ret : ret;
    };

    BN.prototype.toJSON = function toJSON () {
      return this.toString(16);
    };

    BN.prototype.toBuffer = function toBuffer (endian, length) {
      assert(typeof Buffer !== 'undefined');
      return this.toArrayLike(Buffer, endian, length);
    };

    BN.prototype.toArray = function toArray (endian, length) {
      return this.toArrayLike(Array, endian, length);
    };

    BN.prototype.toArrayLike = function toArrayLike (ArrayType, endian, length) {
      var byteLength = this.byteLength();
      var reqLength = length || Math.max(1, byteLength);
      assert(byteLength <= reqLength, 'byte array longer than desired length');
      assert(reqLength > 0, 'Requested array length <= 0');

      this.strip();
      var littleEndian = endian === 'le';
      var res = new ArrayType(reqLength);

      var b, i;
      var q = this.clone();
      if (!littleEndian) {
        // Assume big-endian
        for (i = 0; i < reqLength - byteLength; i++) {
          res[i] = 0;
        }

        for (i = 0; !q.isZero(); i++) {
          b = q.andln(0xff);
          q.iushrn(8);

          res[reqLength - i - 1] = b;
        }
      } else {
        for (i = 0; !q.isZero(); i++) {
          b = q.andln(0xff);
          q.iushrn(8);

          res[i] = b;
        }

        for (; i < reqLength; i++) {
          res[i] = 0;
        }
      }

      return res;
    };

    if (Math.clz32) {
      BN.prototype._countBits = function _countBits (w) {
        return 32 - Math.clz32(w);
      };
    } else {
      BN.prototype._countBits = function _countBits (w) {
        var t = w;
        var r = 0;
        if (t >= 0x1000) {
          r += 13;
          t >>>= 13;
        }
        if (t >= 0x40) {
          r += 7;
          t >>>= 7;
        }
        if (t >= 0x8) {
          r += 4;
          t >>>= 4;
        }
        if (t >= 0x02) {
          r += 2;
          t >>>= 2;
        }
        return r + t;
      };
    }

    BN.prototype._zeroBits = function _zeroBits (w) {
      // Short-cut
      if (w === 0) return 26;

      var t = w;
      var r = 0;
      if ((t & 0x1fff) === 0) {
        r += 13;
        t >>>= 13;
      }
      if ((t & 0x7f) === 0) {
        r += 7;
        t >>>= 7;
      }
      if ((t & 0xf) === 0) {
        r += 4;
        t >>>= 4;
      }
      if ((t & 0x3) === 0) {
        r += 2;
        t >>>= 2;
      }
      if ((t & 0x1) === 0) {
        r++;
      }
      return r;
    };

    // Return number of used bits in a BN
    BN.prototype.bitLength = function bitLength () {
      var w = this.words[this.length - 1];
      var hi = this._countBits(w);
      return (this.length - 1) * 26 + hi;
    };

    function toBitArray (num) {
      var w = new Array(num.bitLength());

      for (var bit = 0; bit < w.length; bit++) {
        var off = (bit / 26) | 0;
        var wbit = bit % 26;

        w[bit] = (num.words[off] & (1 << wbit)) >>> wbit;
      }

      return w;
    }

    // Number of trailing zero bits
    BN.prototype.zeroBits = function zeroBits () {
      if (this.isZero()) return 0;

      var r = 0;
      for (var i = 0; i < this.length; i++) {
        var b = this._zeroBits(this.words[i]);
        r += b;
        if (b !== 26) break;
      }
      return r;
    };

    BN.prototype.byteLength = function byteLength () {
      return Math.ceil(this.bitLength() / 8);
    };

    BN.prototype.toTwos = function toTwos (width) {
      if (this.negative !== 0) {
        return this.abs().inotn(width).iaddn(1);
      }
      return this.clone();
    };

    BN.prototype.fromTwos = function fromTwos (width) {
      if (this.testn(width - 1)) {
        return this.notn(width).iaddn(1).ineg();
      }
      return this.clone();
    };

    BN.prototype.isNeg = function isNeg () {
      return this.negative !== 0;
    };

    // Return negative clone of `this`
    BN.prototype.neg = function neg () {
      return this.clone().ineg();
    };

    BN.prototype.ineg = function ineg () {
      if (!this.isZero()) {
        this.negative ^= 1;
      }

      return this;
    };

    // Or `num` with `this` in-place
    BN.prototype.iuor = function iuor (num) {
      while (this.length < num.length) {
        this.words[this.length++] = 0;
      }

      for (var i = 0; i < num.length; i++) {
        this.words[i] = this.words[i] | num.words[i];
      }

      return this.strip();
    };

    BN.prototype.ior = function ior (num) {
      assert((this.negative | num.negative) === 0);
      return this.iuor(num);
    };

    // Or `num` with `this`
    BN.prototype.or = function or (num) {
      if (this.length > num.length) return this.clone().ior(num);
      return num.clone().ior(this);
    };

    BN.prototype.uor = function uor (num) {
      if (this.length > num.length) return this.clone().iuor(num);
      return num.clone().iuor(this);
    };

    // And `num` with `this` in-place
    BN.prototype.iuand = function iuand (num) {
      // b = min-length(num, this)
      var b;
      if (this.length > num.length) {
        b = num;
      } else {
        b = this;
      }

      for (var i = 0; i < b.length; i++) {
        this.words[i] = this.words[i] & num.words[i];
      }

      this.length = b.length;

      return this.strip();
    };

    BN.prototype.iand = function iand (num) {
      assert((this.negative | num.negative) === 0);
      return this.iuand(num);
    };

    // And `num` with `this`
    BN.prototype.and = function and (num) {
      if (this.length > num.length) return this.clone().iand(num);
      return num.clone().iand(this);
    };

    BN.prototype.uand = function uand (num) {
      if (this.length > num.length) return this.clone().iuand(num);
      return num.clone().iuand(this);
    };

    // Xor `num` with `this` in-place
    BN.prototype.iuxor = function iuxor (num) {
      // a.length > b.length
      var a;
      var b;
      if (this.length > num.length) {
        a = this;
        b = num;
      } else {
        a = num;
        b = this;
      }

      for (var i = 0; i < b.length; i++) {
        this.words[i] = a.words[i] ^ b.words[i];
      }

      if (this !== a) {
        for (; i < a.length; i++) {
          this.words[i] = a.words[i];
        }
      }

      this.length = a.length;

      return this.strip();
    };

    BN.prototype.ixor = function ixor (num) {
      assert((this.negative | num.negative) === 0);
      return this.iuxor(num);
    };

    // Xor `num` with `this`
    BN.prototype.xor = function xor (num) {
      if (this.length > num.length) return this.clone().ixor(num);
      return num.clone().ixor(this);
    };

    BN.prototype.uxor = function uxor (num) {
      if (this.length > num.length) return this.clone().iuxor(num);
      return num.clone().iuxor(this);
    };

    // Not ``this`` with ``width`` bitwidth
    BN.prototype.inotn = function inotn (width) {
      assert(typeof width === 'number' && width >= 0);

      var bytesNeeded = Math.ceil(width / 26) | 0;
      var bitsLeft = width % 26;

      // Extend the buffer with leading zeroes
      this._expand(bytesNeeded);

      if (bitsLeft > 0) {
        bytesNeeded--;
      }

      // Handle complete words
      for (var i = 0; i < bytesNeeded; i++) {
        this.words[i] = ~this.words[i] & 0x3ffffff;
      }

      // Handle the residue
      if (bitsLeft > 0) {
        this.words[i] = ~this.words[i] & (0x3ffffff >> (26 - bitsLeft));
      }

      // And remove leading zeroes
      return this.strip();
    };

    BN.prototype.notn = function notn (width) {
      return this.clone().inotn(width);
    };

    // Set `bit` of `this`
    BN.prototype.setn = function setn (bit, val) {
      assert(typeof bit === 'number' && bit >= 0);

      var off = (bit / 26) | 0;
      var wbit = bit % 26;

      this._expand(off + 1);

      if (val) {
        this.words[off] = this.words[off] | (1 << wbit);
      } else {
        this.words[off] = this.words[off] & ~(1 << wbit);
      }

      return this.strip();
    };

    // Add `num` to `this` in-place
    BN.prototype.iadd = function iadd (num) {
      var r;

      // negative + positive
      if (this.negative !== 0 && num.negative === 0) {
        this.negative = 0;
        r = this.isub(num);
        this.negative ^= 1;
        return this._normSign();

      // positive + negative
      } else if (this.negative === 0 && num.negative !== 0) {
        num.negative = 0;
        r = this.isub(num);
        num.negative = 1;
        return r._normSign();
      }

      // a.length > b.length
      var a, b;
      if (this.length > num.length) {
        a = this;
        b = num;
      } else {
        a = num;
        b = this;
      }

      var carry = 0;
      for (var i = 0; i < b.length; i++) {
        r = (a.words[i] | 0) + (b.words[i] | 0) + carry;
        this.words[i] = r & 0x3ffffff;
        carry = r >>> 26;
      }
      for (; carry !== 0 && i < a.length; i++) {
        r = (a.words[i] | 0) + carry;
        this.words[i] = r & 0x3ffffff;
        carry = r >>> 26;
      }

      this.length = a.length;
      if (carry !== 0) {
        this.words[this.length] = carry;
        this.length++;
      // Copy the rest of the words
      } else if (a !== this) {
        for (; i < a.length; i++) {
          this.words[i] = a.words[i];
        }
      }

      return this;
    };

    // Add `num` to `this`
    BN.prototype.add = function add (num) {
      var res;
      if (num.negative !== 0 && this.negative === 0) {
        num.negative = 0;
        res = this.sub(num);
        num.negative ^= 1;
        return res;
      } else if (num.negative === 0 && this.negative !== 0) {
        this.negative = 0;
        res = num.sub(this);
        this.negative = 1;
        return res;
      }

      if (this.length > num.length) return this.clone().iadd(num);

      return num.clone().iadd(this);
    };

    // Subtract `num` from `this` in-place
    BN.prototype.isub = function isub (num) {
      // this - (-num) = this + num
      if (num.negative !== 0) {
        num.negative = 0;
        var r = this.iadd(num);
        num.negative = 1;
        return r._normSign();

      // -this - num = -(this + num)
      } else if (this.negative !== 0) {
        this.negative = 0;
        this.iadd(num);
        this.negative = 1;
        return this._normSign();
      }

      // At this point both numbers are positive
      var cmp = this.cmp(num);

      // Optimization - zeroify
      if (cmp === 0) {
        this.negative = 0;
        this.length = 1;
        this.words[0] = 0;
        return this;
      }

      // a > b
      var a, b;
      if (cmp > 0) {
        a = this;
        b = num;
      } else {
        a = num;
        b = this;
      }

      var carry = 0;
      for (var i = 0; i < b.length; i++) {
        r = (a.words[i] | 0) - (b.words[i] | 0) + carry;
        carry = r >> 26;
        this.words[i] = r & 0x3ffffff;
      }
      for (; carry !== 0 && i < a.length; i++) {
        r = (a.words[i] | 0) + carry;
        carry = r >> 26;
        this.words[i] = r & 0x3ffffff;
      }

      // Copy rest of the words
      if (carry === 0 && i < a.length && a !== this) {
        for (; i < a.length; i++) {
          this.words[i] = a.words[i];
        }
      }

      this.length = Math.max(this.length, i);

      if (a !== this) {
        this.negative = 1;
      }

      return this.strip();
    };

    // Subtract `num` from `this`
    BN.prototype.sub = function sub (num) {
      return this.clone().isub(num);
    };

    function smallMulTo (self, num, out) {
      out.negative = num.negative ^ self.negative;
      var len = (self.length + num.length) | 0;
      out.length = len;
      len = (len - 1) | 0;

      // Peel one iteration (compiler can't do it, because of code complexity)
      var a = self.words[0] | 0;
      var b = num.words[0] | 0;
      var r = a * b;

      var lo = r & 0x3ffffff;
      var carry = (r / 0x4000000) | 0;
      out.words[0] = lo;

      for (var k = 1; k < len; k++) {
        // Sum all words with the same `i + j = k` and accumulate `ncarry`,
        // note that ncarry could be >= 0x3ffffff
        var ncarry = carry >>> 26;
        var rword = carry & 0x3ffffff;
        var maxJ = Math.min(k, num.length - 1);
        for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
          var i = (k - j) | 0;
          a = self.words[i] | 0;
          b = num.words[j] | 0;
          r = a * b + rword;
          ncarry += (r / 0x4000000) | 0;
          rword = r & 0x3ffffff;
        }
        out.words[k] = rword | 0;
        carry = ncarry | 0;
      }
      if (carry !== 0) {
        out.words[k] = carry | 0;
      } else {
        out.length--;
      }

      return out.strip();
    }

    // TODO(indutny): it may be reasonable to omit it for users who don't need
    // to work with 256-bit numbers, otherwise it gives 20% improvement for 256-bit
    // multiplication (like elliptic secp256k1).
    var comb10MulTo = function comb10MulTo (self, num, out) {
      var a = self.words;
      var b = num.words;
      var o = out.words;
      var c = 0;
      var lo;
      var mid;
      var hi;
      var a0 = a[0] | 0;
      var al0 = a0 & 0x1fff;
      var ah0 = a0 >>> 13;
      var a1 = a[1] | 0;
      var al1 = a1 & 0x1fff;
      var ah1 = a1 >>> 13;
      var a2 = a[2] | 0;
      var al2 = a2 & 0x1fff;
      var ah2 = a2 >>> 13;
      var a3 = a[3] | 0;
      var al3 = a3 & 0x1fff;
      var ah3 = a3 >>> 13;
      var a4 = a[4] | 0;
      var al4 = a4 & 0x1fff;
      var ah4 = a4 >>> 13;
      var a5 = a[5] | 0;
      var al5 = a5 & 0x1fff;
      var ah5 = a5 >>> 13;
      var a6 = a[6] | 0;
      var al6 = a6 & 0x1fff;
      var ah6 = a6 >>> 13;
      var a7 = a[7] | 0;
      var al7 = a7 & 0x1fff;
      var ah7 = a7 >>> 13;
      var a8 = a[8] | 0;
      var al8 = a8 & 0x1fff;
      var ah8 = a8 >>> 13;
      var a9 = a[9] | 0;
      var al9 = a9 & 0x1fff;
      var ah9 = a9 >>> 13;
      var b0 = b[0] | 0;
      var bl0 = b0 & 0x1fff;
      var bh0 = b0 >>> 13;
      var b1 = b[1] | 0;
      var bl1 = b1 & 0x1fff;
      var bh1 = b1 >>> 13;
      var b2 = b[2] | 0;
      var bl2 = b2 & 0x1fff;
      var bh2 = b2 >>> 13;
      var b3 = b[3] | 0;
      var bl3 = b3 & 0x1fff;
      var bh3 = b3 >>> 13;
      var b4 = b[4] | 0;
      var bl4 = b4 & 0x1fff;
      var bh4 = b4 >>> 13;
      var b5 = b[5] | 0;
      var bl5 = b5 & 0x1fff;
      var bh5 = b5 >>> 13;
      var b6 = b[6] | 0;
      var bl6 = b6 & 0x1fff;
      var bh6 = b6 >>> 13;
      var b7 = b[7] | 0;
      var bl7 = b7 & 0x1fff;
      var bh7 = b7 >>> 13;
      var b8 = b[8] | 0;
      var bl8 = b8 & 0x1fff;
      var bh8 = b8 >>> 13;
      var b9 = b[9] | 0;
      var bl9 = b9 & 0x1fff;
      var bh9 = b9 >>> 13;

      out.negative = self.negative ^ num.negative;
      out.length = 19;
      /* k = 0 */
      lo = Math.imul(al0, bl0);
      mid = Math.imul(al0, bh0);
      mid = (mid + Math.imul(ah0, bl0)) | 0;
      hi = Math.imul(ah0, bh0);
      var w0 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w0 >>> 26)) | 0;
      w0 &= 0x3ffffff;
      /* k = 1 */
      lo = Math.imul(al1, bl0);
      mid = Math.imul(al1, bh0);
      mid = (mid + Math.imul(ah1, bl0)) | 0;
      hi = Math.imul(ah1, bh0);
      lo = (lo + Math.imul(al0, bl1)) | 0;
      mid = (mid + Math.imul(al0, bh1)) | 0;
      mid = (mid + Math.imul(ah0, bl1)) | 0;
      hi = (hi + Math.imul(ah0, bh1)) | 0;
      var w1 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w1 >>> 26)) | 0;
      w1 &= 0x3ffffff;
      /* k = 2 */
      lo = Math.imul(al2, bl0);
      mid = Math.imul(al2, bh0);
      mid = (mid + Math.imul(ah2, bl0)) | 0;
      hi = Math.imul(ah2, bh0);
      lo = (lo + Math.imul(al1, bl1)) | 0;
      mid = (mid + Math.imul(al1, bh1)) | 0;
      mid = (mid + Math.imul(ah1, bl1)) | 0;
      hi = (hi + Math.imul(ah1, bh1)) | 0;
      lo = (lo + Math.imul(al0, bl2)) | 0;
      mid = (mid + Math.imul(al0, bh2)) | 0;
      mid = (mid + Math.imul(ah0, bl2)) | 0;
      hi = (hi + Math.imul(ah0, bh2)) | 0;
      var w2 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w2 >>> 26)) | 0;
      w2 &= 0x3ffffff;
      /* k = 3 */
      lo = Math.imul(al3, bl0);
      mid = Math.imul(al3, bh0);
      mid = (mid + Math.imul(ah3, bl0)) | 0;
      hi = Math.imul(ah3, bh0);
      lo = (lo + Math.imul(al2, bl1)) | 0;
      mid = (mid + Math.imul(al2, bh1)) | 0;
      mid = (mid + Math.imul(ah2, bl1)) | 0;
      hi = (hi + Math.imul(ah2, bh1)) | 0;
      lo = (lo + Math.imul(al1, bl2)) | 0;
      mid = (mid + Math.imul(al1, bh2)) | 0;
      mid = (mid + Math.imul(ah1, bl2)) | 0;
      hi = (hi + Math.imul(ah1, bh2)) | 0;
      lo = (lo + Math.imul(al0, bl3)) | 0;
      mid = (mid + Math.imul(al0, bh3)) | 0;
      mid = (mid + Math.imul(ah0, bl3)) | 0;
      hi = (hi + Math.imul(ah0, bh3)) | 0;
      var w3 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w3 >>> 26)) | 0;
      w3 &= 0x3ffffff;
      /* k = 4 */
      lo = Math.imul(al4, bl0);
      mid = Math.imul(al4, bh0);
      mid = (mid + Math.imul(ah4, bl0)) | 0;
      hi = Math.imul(ah4, bh0);
      lo = (lo + Math.imul(al3, bl1)) | 0;
      mid = (mid + Math.imul(al3, bh1)) | 0;
      mid = (mid + Math.imul(ah3, bl1)) | 0;
      hi = (hi + Math.imul(ah3, bh1)) | 0;
      lo = (lo + Math.imul(al2, bl2)) | 0;
      mid = (mid + Math.imul(al2, bh2)) | 0;
      mid = (mid + Math.imul(ah2, bl2)) | 0;
      hi = (hi + Math.imul(ah2, bh2)) | 0;
      lo = (lo + Math.imul(al1, bl3)) | 0;
      mid = (mid + Math.imul(al1, bh3)) | 0;
      mid = (mid + Math.imul(ah1, bl3)) | 0;
      hi = (hi + Math.imul(ah1, bh3)) | 0;
      lo = (lo + Math.imul(al0, bl4)) | 0;
      mid = (mid + Math.imul(al0, bh4)) | 0;
      mid = (mid + Math.imul(ah0, bl4)) | 0;
      hi = (hi + Math.imul(ah0, bh4)) | 0;
      var w4 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w4 >>> 26)) | 0;
      w4 &= 0x3ffffff;
      /* k = 5 */
      lo = Math.imul(al5, bl0);
      mid = Math.imul(al5, bh0);
      mid = (mid + Math.imul(ah5, bl0)) | 0;
      hi = Math.imul(ah5, bh0);
      lo = (lo + Math.imul(al4, bl1)) | 0;
      mid = (mid + Math.imul(al4, bh1)) | 0;
      mid = (mid + Math.imul(ah4, bl1)) | 0;
      hi = (hi + Math.imul(ah4, bh1)) | 0;
      lo = (lo + Math.imul(al3, bl2)) | 0;
      mid = (mid + Math.imul(al3, bh2)) | 0;
      mid = (mid + Math.imul(ah3, bl2)) | 0;
      hi = (hi + Math.imul(ah3, bh2)) | 0;
      lo = (lo + Math.imul(al2, bl3)) | 0;
      mid = (mid + Math.imul(al2, bh3)) | 0;
      mid = (mid + Math.imul(ah2, bl3)) | 0;
      hi = (hi + Math.imul(ah2, bh3)) | 0;
      lo = (lo + Math.imul(al1, bl4)) | 0;
      mid = (mid + Math.imul(al1, bh4)) | 0;
      mid = (mid + Math.imul(ah1, bl4)) | 0;
      hi = (hi + Math.imul(ah1, bh4)) | 0;
      lo = (lo + Math.imul(al0, bl5)) | 0;
      mid = (mid + Math.imul(al0, bh5)) | 0;
      mid = (mid + Math.imul(ah0, bl5)) | 0;
      hi = (hi + Math.imul(ah0, bh5)) | 0;
      var w5 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w5 >>> 26)) | 0;
      w5 &= 0x3ffffff;
      /* k = 6 */
      lo = Math.imul(al6, bl0);
      mid = Math.imul(al6, bh0);
      mid = (mid + Math.imul(ah6, bl0)) | 0;
      hi = Math.imul(ah6, bh0);
      lo = (lo + Math.imul(al5, bl1)) | 0;
      mid = (mid + Math.imul(al5, bh1)) | 0;
      mid = (mid + Math.imul(ah5, bl1)) | 0;
      hi = (hi + Math.imul(ah5, bh1)) | 0;
      lo = (lo + Math.imul(al4, bl2)) | 0;
      mid = (mid + Math.imul(al4, bh2)) | 0;
      mid = (mid + Math.imul(ah4, bl2)) | 0;
      hi = (hi + Math.imul(ah4, bh2)) | 0;
      lo = (lo + Math.imul(al3, bl3)) | 0;
      mid = (mid + Math.imul(al3, bh3)) | 0;
      mid = (mid + Math.imul(ah3, bl3)) | 0;
      hi = (hi + Math.imul(ah3, bh3)) | 0;
      lo = (lo + Math.imul(al2, bl4)) | 0;
      mid = (mid + Math.imul(al2, bh4)) | 0;
      mid = (mid + Math.imul(ah2, bl4)) | 0;
      hi = (hi + Math.imul(ah2, bh4)) | 0;
      lo = (lo + Math.imul(al1, bl5)) | 0;
      mid = (mid + Math.imul(al1, bh5)) | 0;
      mid = (mid + Math.imul(ah1, bl5)) | 0;
      hi = (hi + Math.imul(ah1, bh5)) | 0;
      lo = (lo + Math.imul(al0, bl6)) | 0;
      mid = (mid + Math.imul(al0, bh6)) | 0;
      mid = (mid + Math.imul(ah0, bl6)) | 0;
      hi = (hi + Math.imul(ah0, bh6)) | 0;
      var w6 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w6 >>> 26)) | 0;
      w6 &= 0x3ffffff;
      /* k = 7 */
      lo = Math.imul(al7, bl0);
      mid = Math.imul(al7, bh0);
      mid = (mid + Math.imul(ah7, bl0)) | 0;
      hi = Math.imul(ah7, bh0);
      lo = (lo + Math.imul(al6, bl1)) | 0;
      mid = (mid + Math.imul(al6, bh1)) | 0;
      mid = (mid + Math.imul(ah6, bl1)) | 0;
      hi = (hi + Math.imul(ah6, bh1)) | 0;
      lo = (lo + Math.imul(al5, bl2)) | 0;
      mid = (mid + Math.imul(al5, bh2)) | 0;
      mid = (mid + Math.imul(ah5, bl2)) | 0;
      hi = (hi + Math.imul(ah5, bh2)) | 0;
      lo = (lo + Math.imul(al4, bl3)) | 0;
      mid = (mid + Math.imul(al4, bh3)) | 0;
      mid = (mid + Math.imul(ah4, bl3)) | 0;
      hi = (hi + Math.imul(ah4, bh3)) | 0;
      lo = (lo + Math.imul(al3, bl4)) | 0;
      mid = (mid + Math.imul(al3, bh4)) | 0;
      mid = (mid + Math.imul(ah3, bl4)) | 0;
      hi = (hi + Math.imul(ah3, bh4)) | 0;
      lo = (lo + Math.imul(al2, bl5)) | 0;
      mid = (mid + Math.imul(al2, bh5)) | 0;
      mid = (mid + Math.imul(ah2, bl5)) | 0;
      hi = (hi + Math.imul(ah2, bh5)) | 0;
      lo = (lo + Math.imul(al1, bl6)) | 0;
      mid = (mid + Math.imul(al1, bh6)) | 0;
      mid = (mid + Math.imul(ah1, bl6)) | 0;
      hi = (hi + Math.imul(ah1, bh6)) | 0;
      lo = (lo + Math.imul(al0, bl7)) | 0;
      mid = (mid + Math.imul(al0, bh7)) | 0;
      mid = (mid + Math.imul(ah0, bl7)) | 0;
      hi = (hi + Math.imul(ah0, bh7)) | 0;
      var w7 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w7 >>> 26)) | 0;
      w7 &= 0x3ffffff;
      /* k = 8 */
      lo = Math.imul(al8, bl0);
      mid = Math.imul(al8, bh0);
      mid = (mid + Math.imul(ah8, bl0)) | 0;
      hi = Math.imul(ah8, bh0);
      lo = (lo + Math.imul(al7, bl1)) | 0;
      mid = (mid + Math.imul(al7, bh1)) | 0;
      mid = (mid + Math.imul(ah7, bl1)) | 0;
      hi = (hi + Math.imul(ah7, bh1)) | 0;
      lo = (lo + Math.imul(al6, bl2)) | 0;
      mid = (mid + Math.imul(al6, bh2)) | 0;
      mid = (mid + Math.imul(ah6, bl2)) | 0;
      hi = (hi + Math.imul(ah6, bh2)) | 0;
      lo = (lo + Math.imul(al5, bl3)) | 0;
      mid = (mid + Math.imul(al5, bh3)) | 0;
      mid = (mid + Math.imul(ah5, bl3)) | 0;
      hi = (hi + Math.imul(ah5, bh3)) | 0;
      lo = (lo + Math.imul(al4, bl4)) | 0;
      mid = (mid + Math.imul(al4, bh4)) | 0;
      mid = (mid + Math.imul(ah4, bl4)) | 0;
      hi = (hi + Math.imul(ah4, bh4)) | 0;
      lo = (lo + Math.imul(al3, bl5)) | 0;
      mid = (mid + Math.imul(al3, bh5)) | 0;
      mid = (mid + Math.imul(ah3, bl5)) | 0;
      hi = (hi + Math.imul(ah3, bh5)) | 0;
      lo = (lo + Math.imul(al2, bl6)) | 0;
      mid = (mid + Math.imul(al2, bh6)) | 0;
      mid = (mid + Math.imul(ah2, bl6)) | 0;
      hi = (hi + Math.imul(ah2, bh6)) | 0;
      lo = (lo + Math.imul(al1, bl7)) | 0;
      mid = (mid + Math.imul(al1, bh7)) | 0;
      mid = (mid + Math.imul(ah1, bl7)) | 0;
      hi = (hi + Math.imul(ah1, bh7)) | 0;
      lo = (lo + Math.imul(al0, bl8)) | 0;
      mid = (mid + Math.imul(al0, bh8)) | 0;
      mid = (mid + Math.imul(ah0, bl8)) | 0;
      hi = (hi + Math.imul(ah0, bh8)) | 0;
      var w8 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w8 >>> 26)) | 0;
      w8 &= 0x3ffffff;
      /* k = 9 */
      lo = Math.imul(al9, bl0);
      mid = Math.imul(al9, bh0);
      mid = (mid + Math.imul(ah9, bl0)) | 0;
      hi = Math.imul(ah9, bh0);
      lo = (lo + Math.imul(al8, bl1)) | 0;
      mid = (mid + Math.imul(al8, bh1)) | 0;
      mid = (mid + Math.imul(ah8, bl1)) | 0;
      hi = (hi + Math.imul(ah8, bh1)) | 0;
      lo = (lo + Math.imul(al7, bl2)) | 0;
      mid = (mid + Math.imul(al7, bh2)) | 0;
      mid = (mid + Math.imul(ah7, bl2)) | 0;
      hi = (hi + Math.imul(ah7, bh2)) | 0;
      lo = (lo + Math.imul(al6, bl3)) | 0;
      mid = (mid + Math.imul(al6, bh3)) | 0;
      mid = (mid + Math.imul(ah6, bl3)) | 0;
      hi = (hi + Math.imul(ah6, bh3)) | 0;
      lo = (lo + Math.imul(al5, bl4)) | 0;
      mid = (mid + Math.imul(al5, bh4)) | 0;
      mid = (mid + Math.imul(ah5, bl4)) | 0;
      hi = (hi + Math.imul(ah5, bh4)) | 0;
      lo = (lo + Math.imul(al4, bl5)) | 0;
      mid = (mid + Math.imul(al4, bh5)) | 0;
      mid = (mid + Math.imul(ah4, bl5)) | 0;
      hi = (hi + Math.imul(ah4, bh5)) | 0;
      lo = (lo + Math.imul(al3, bl6)) | 0;
      mid = (mid + Math.imul(al3, bh6)) | 0;
      mid = (mid + Math.imul(ah3, bl6)) | 0;
      hi = (hi + Math.imul(ah3, bh6)) | 0;
      lo = (lo + Math.imul(al2, bl7)) | 0;
      mid = (mid + Math.imul(al2, bh7)) | 0;
      mid = (mid + Math.imul(ah2, bl7)) | 0;
      hi = (hi + Math.imul(ah2, bh7)) | 0;
      lo = (lo + Math.imul(al1, bl8)) | 0;
      mid = (mid + Math.imul(al1, bh8)) | 0;
      mid = (mid + Math.imul(ah1, bl8)) | 0;
      hi = (hi + Math.imul(ah1, bh8)) | 0;
      lo = (lo + Math.imul(al0, bl9)) | 0;
      mid = (mid + Math.imul(al0, bh9)) | 0;
      mid = (mid + Math.imul(ah0, bl9)) | 0;
      hi = (hi + Math.imul(ah0, bh9)) | 0;
      var w9 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w9 >>> 26)) | 0;
      w9 &= 0x3ffffff;
      /* k = 10 */
      lo = Math.imul(al9, bl1);
      mid = Math.imul(al9, bh1);
      mid = (mid + Math.imul(ah9, bl1)) | 0;
      hi = Math.imul(ah9, bh1);
      lo = (lo + Math.imul(al8, bl2)) | 0;
      mid = (mid + Math.imul(al8, bh2)) | 0;
      mid = (mid + Math.imul(ah8, bl2)) | 0;
      hi = (hi + Math.imul(ah8, bh2)) | 0;
      lo = (lo + Math.imul(al7, bl3)) | 0;
      mid = (mid + Math.imul(al7, bh3)) | 0;
      mid = (mid + Math.imul(ah7, bl3)) | 0;
      hi = (hi + Math.imul(ah7, bh3)) | 0;
      lo = (lo + Math.imul(al6, bl4)) | 0;
      mid = (mid + Math.imul(al6, bh4)) | 0;
      mid = (mid + Math.imul(ah6, bl4)) | 0;
      hi = (hi + Math.imul(ah6, bh4)) | 0;
      lo = (lo + Math.imul(al5, bl5)) | 0;
      mid = (mid + Math.imul(al5, bh5)) | 0;
      mid = (mid + Math.imul(ah5, bl5)) | 0;
      hi = (hi + Math.imul(ah5, bh5)) | 0;
      lo = (lo + Math.imul(al4, bl6)) | 0;
      mid = (mid + Math.imul(al4, bh6)) | 0;
      mid = (mid + Math.imul(ah4, bl6)) | 0;
      hi = (hi + Math.imul(ah4, bh6)) | 0;
      lo = (lo + Math.imul(al3, bl7)) | 0;
      mid = (mid + Math.imul(al3, bh7)) | 0;
      mid = (mid + Math.imul(ah3, bl7)) | 0;
      hi = (hi + Math.imul(ah3, bh7)) | 0;
      lo = (lo + Math.imul(al2, bl8)) | 0;
      mid = (mid + Math.imul(al2, bh8)) | 0;
      mid = (mid + Math.imul(ah2, bl8)) | 0;
      hi = (hi + Math.imul(ah2, bh8)) | 0;
      lo = (lo + Math.imul(al1, bl9)) | 0;
      mid = (mid + Math.imul(al1, bh9)) | 0;
      mid = (mid + Math.imul(ah1, bl9)) | 0;
      hi = (hi + Math.imul(ah1, bh9)) | 0;
      var w10 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w10 >>> 26)) | 0;
      w10 &= 0x3ffffff;
      /* k = 11 */
      lo = Math.imul(al9, bl2);
      mid = Math.imul(al9, bh2);
      mid = (mid + Math.imul(ah9, bl2)) | 0;
      hi = Math.imul(ah9, bh2);
      lo = (lo + Math.imul(al8, bl3)) | 0;
      mid = (mid + Math.imul(al8, bh3)) | 0;
      mid = (mid + Math.imul(ah8, bl3)) | 0;
      hi = (hi + Math.imul(ah8, bh3)) | 0;
      lo = (lo + Math.imul(al7, bl4)) | 0;
      mid = (mid + Math.imul(al7, bh4)) | 0;
      mid = (mid + Math.imul(ah7, bl4)) | 0;
      hi = (hi + Math.imul(ah7, bh4)) | 0;
      lo = (lo + Math.imul(al6, bl5)) | 0;
      mid = (mid + Math.imul(al6, bh5)) | 0;
      mid = (mid + Math.imul(ah6, bl5)) | 0;
      hi = (hi + Math.imul(ah6, bh5)) | 0;
      lo = (lo + Math.imul(al5, bl6)) | 0;
      mid = (mid + Math.imul(al5, bh6)) | 0;
      mid = (mid + Math.imul(ah5, bl6)) | 0;
      hi = (hi + Math.imul(ah5, bh6)) | 0;
      lo = (lo + Math.imul(al4, bl7)) | 0;
      mid = (mid + Math.imul(al4, bh7)) | 0;
      mid = (mid + Math.imul(ah4, bl7)) | 0;
      hi = (hi + Math.imul(ah4, bh7)) | 0;
      lo = (lo + Math.imul(al3, bl8)) | 0;
      mid = (mid + Math.imul(al3, bh8)) | 0;
      mid = (mid + Math.imul(ah3, bl8)) | 0;
      hi = (hi + Math.imul(ah3, bh8)) | 0;
      lo = (lo + Math.imul(al2, bl9)) | 0;
      mid = (mid + Math.imul(al2, bh9)) | 0;
      mid = (mid + Math.imul(ah2, bl9)) | 0;
      hi = (hi + Math.imul(ah2, bh9)) | 0;
      var w11 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w11 >>> 26)) | 0;
      w11 &= 0x3ffffff;
      /* k = 12 */
      lo = Math.imul(al9, bl3);
      mid = Math.imul(al9, bh3);
      mid = (mid + Math.imul(ah9, bl3)) | 0;
      hi = Math.imul(ah9, bh3);
      lo = (lo + Math.imul(al8, bl4)) | 0;
      mid = (mid + Math.imul(al8, bh4)) | 0;
      mid = (mid + Math.imul(ah8, bl4)) | 0;
      hi = (hi + Math.imul(ah8, bh4)) | 0;
      lo = (lo + Math.imul(al7, bl5)) | 0;
      mid = (mid + Math.imul(al7, bh5)) | 0;
      mid = (mid + Math.imul(ah7, bl5)) | 0;
      hi = (hi + Math.imul(ah7, bh5)) | 0;
      lo = (lo + Math.imul(al6, bl6)) | 0;
      mid = (mid + Math.imul(al6, bh6)) | 0;
      mid = (mid + Math.imul(ah6, bl6)) | 0;
      hi = (hi + Math.imul(ah6, bh6)) | 0;
      lo = (lo + Math.imul(al5, bl7)) | 0;
      mid = (mid + Math.imul(al5, bh7)) | 0;
      mid = (mid + Math.imul(ah5, bl7)) | 0;
      hi = (hi + Math.imul(ah5, bh7)) | 0;
      lo = (lo + Math.imul(al4, bl8)) | 0;
      mid = (mid + Math.imul(al4, bh8)) | 0;
      mid = (mid + Math.imul(ah4, bl8)) | 0;
      hi = (hi + Math.imul(ah4, bh8)) | 0;
      lo = (lo + Math.imul(al3, bl9)) | 0;
      mid = (mid + Math.imul(al3, bh9)) | 0;
      mid = (mid + Math.imul(ah3, bl9)) | 0;
      hi = (hi + Math.imul(ah3, bh9)) | 0;
      var w12 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w12 >>> 26)) | 0;
      w12 &= 0x3ffffff;
      /* k = 13 */
      lo = Math.imul(al9, bl4);
      mid = Math.imul(al9, bh4);
      mid = (mid + Math.imul(ah9, bl4)) | 0;
      hi = Math.imul(ah9, bh4);
      lo = (lo + Math.imul(al8, bl5)) | 0;
      mid = (mid + Math.imul(al8, bh5)) | 0;
      mid = (mid + Math.imul(ah8, bl5)) | 0;
      hi = (hi + Math.imul(ah8, bh5)) | 0;
      lo = (lo + Math.imul(al7, bl6)) | 0;
      mid = (mid + Math.imul(al7, bh6)) | 0;
      mid = (mid + Math.imul(ah7, bl6)) | 0;
      hi = (hi + Math.imul(ah7, bh6)) | 0;
      lo = (lo + Math.imul(al6, bl7)) | 0;
      mid = (mid + Math.imul(al6, bh7)) | 0;
      mid = (mid + Math.imul(ah6, bl7)) | 0;
      hi = (hi + Math.imul(ah6, bh7)) | 0;
      lo = (lo + Math.imul(al5, bl8)) | 0;
      mid = (mid + Math.imul(al5, bh8)) | 0;
      mid = (mid + Math.imul(ah5, bl8)) | 0;
      hi = (hi + Math.imul(ah5, bh8)) | 0;
      lo = (lo + Math.imul(al4, bl9)) | 0;
      mid = (mid + Math.imul(al4, bh9)) | 0;
      mid = (mid + Math.imul(ah4, bl9)) | 0;
      hi = (hi + Math.imul(ah4, bh9)) | 0;
      var w13 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w13 >>> 26)) | 0;
      w13 &= 0x3ffffff;
      /* k = 14 */
      lo = Math.imul(al9, bl5);
      mid = Math.imul(al9, bh5);
      mid = (mid + Math.imul(ah9, bl5)) | 0;
      hi = Math.imul(ah9, bh5);
      lo = (lo + Math.imul(al8, bl6)) | 0;
      mid = (mid + Math.imul(al8, bh6)) | 0;
      mid = (mid + Math.imul(ah8, bl6)) | 0;
      hi = (hi + Math.imul(ah8, bh6)) | 0;
      lo = (lo + Math.imul(al7, bl7)) | 0;
      mid = (mid + Math.imul(al7, bh7)) | 0;
      mid = (mid + Math.imul(ah7, bl7)) | 0;
      hi = (hi + Math.imul(ah7, bh7)) | 0;
      lo = (lo + Math.imul(al6, bl8)) | 0;
      mid = (mid + Math.imul(al6, bh8)) | 0;
      mid = (mid + Math.imul(ah6, bl8)) | 0;
      hi = (hi + Math.imul(ah6, bh8)) | 0;
      lo = (lo + Math.imul(al5, bl9)) | 0;
      mid = (mid + Math.imul(al5, bh9)) | 0;
      mid = (mid + Math.imul(ah5, bl9)) | 0;
      hi = (hi + Math.imul(ah5, bh9)) | 0;
      var w14 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w14 >>> 26)) | 0;
      w14 &= 0x3ffffff;
      /* k = 15 */
      lo = Math.imul(al9, bl6);
      mid = Math.imul(al9, bh6);
      mid = (mid + Math.imul(ah9, bl6)) | 0;
      hi = Math.imul(ah9, bh6);
      lo = (lo + Math.imul(al8, bl7)) | 0;
      mid = (mid + Math.imul(al8, bh7)) | 0;
      mid = (mid + Math.imul(ah8, bl7)) | 0;
      hi = (hi + Math.imul(ah8, bh7)) | 0;
      lo = (lo + Math.imul(al7, bl8)) | 0;
      mid = (mid + Math.imul(al7, bh8)) | 0;
      mid = (mid + Math.imul(ah7, bl8)) | 0;
      hi = (hi + Math.imul(ah7, bh8)) | 0;
      lo = (lo + Math.imul(al6, bl9)) | 0;
      mid = (mid + Math.imul(al6, bh9)) | 0;
      mid = (mid + Math.imul(ah6, bl9)) | 0;
      hi = (hi + Math.imul(ah6, bh9)) | 0;
      var w15 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w15 >>> 26)) | 0;
      w15 &= 0x3ffffff;
      /* k = 16 */
      lo = Math.imul(al9, bl7);
      mid = Math.imul(al9, bh7);
      mid = (mid + Math.imul(ah9, bl7)) | 0;
      hi = Math.imul(ah9, bh7);
      lo = (lo + Math.imul(al8, bl8)) | 0;
      mid = (mid + Math.imul(al8, bh8)) | 0;
      mid = (mid + Math.imul(ah8, bl8)) | 0;
      hi = (hi + Math.imul(ah8, bh8)) | 0;
      lo = (lo + Math.imul(al7, bl9)) | 0;
      mid = (mid + Math.imul(al7, bh9)) | 0;
      mid = (mid + Math.imul(ah7, bl9)) | 0;
      hi = (hi + Math.imul(ah7, bh9)) | 0;
      var w16 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w16 >>> 26)) | 0;
      w16 &= 0x3ffffff;
      /* k = 17 */
      lo = Math.imul(al9, bl8);
      mid = Math.imul(al9, bh8);
      mid = (mid + Math.imul(ah9, bl8)) | 0;
      hi = Math.imul(ah9, bh8);
      lo = (lo + Math.imul(al8, bl9)) | 0;
      mid = (mid + Math.imul(al8, bh9)) | 0;
      mid = (mid + Math.imul(ah8, bl9)) | 0;
      hi = (hi + Math.imul(ah8, bh9)) | 0;
      var w17 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w17 >>> 26)) | 0;
      w17 &= 0x3ffffff;
      /* k = 18 */
      lo = Math.imul(al9, bl9);
      mid = Math.imul(al9, bh9);
      mid = (mid + Math.imul(ah9, bl9)) | 0;
      hi = Math.imul(ah9, bh9);
      var w18 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w18 >>> 26)) | 0;
      w18 &= 0x3ffffff;
      o[0] = w0;
      o[1] = w1;
      o[2] = w2;
      o[3] = w3;
      o[4] = w4;
      o[5] = w5;
      o[6] = w6;
      o[7] = w7;
      o[8] = w8;
      o[9] = w9;
      o[10] = w10;
      o[11] = w11;
      o[12] = w12;
      o[13] = w13;
      o[14] = w14;
      o[15] = w15;
      o[16] = w16;
      o[17] = w17;
      o[18] = w18;
      if (c !== 0) {
        o[19] = c;
        out.length++;
      }
      return out;
    };

    // Polyfill comb
    if (!Math.imul) {
      comb10MulTo = smallMulTo;
    }

    function bigMulTo (self, num, out) {
      out.negative = num.negative ^ self.negative;
      out.length = self.length + num.length;

      var carry = 0;
      var hncarry = 0;
      for (var k = 0; k < out.length - 1; k++) {
        // Sum all words with the same `i + j = k` and accumulate `ncarry`,
        // note that ncarry could be >= 0x3ffffff
        var ncarry = hncarry;
        hncarry = 0;
        var rword = carry & 0x3ffffff;
        var maxJ = Math.min(k, num.length - 1);
        for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
          var i = k - j;
          var a = self.words[i] | 0;
          var b = num.words[j] | 0;
          var r = a * b;

          var lo = r & 0x3ffffff;
          ncarry = (ncarry + ((r / 0x4000000) | 0)) | 0;
          lo = (lo + rword) | 0;
          rword = lo & 0x3ffffff;
          ncarry = (ncarry + (lo >>> 26)) | 0;

          hncarry += ncarry >>> 26;
          ncarry &= 0x3ffffff;
        }
        out.words[k] = rword;
        carry = ncarry;
        ncarry = hncarry;
      }
      if (carry !== 0) {
        out.words[k] = carry;
      } else {
        out.length--;
      }

      return out.strip();
    }

    function jumboMulTo (self, num, out) {
      var fftm = new FFTM();
      return fftm.mulp(self, num, out);
    }

    BN.prototype.mulTo = function mulTo (num, out) {
      var res;
      var len = this.length + num.length;
      if (this.length === 10 && num.length === 10) {
        res = comb10MulTo(this, num, out);
      } else if (len < 63) {
        res = smallMulTo(this, num, out);
      } else if (len < 1024) {
        res = bigMulTo(this, num, out);
      } else {
        res = jumboMulTo(this, num, out);
      }

      return res;
    };

    // Cooley-Tukey algorithm for FFT
    // slightly revisited to rely on looping instead of recursion

    function FFTM (x, y) {
      this.x = x;
      this.y = y;
    }

    FFTM.prototype.makeRBT = function makeRBT (N) {
      var t = new Array(N);
      var l = BN.prototype._countBits(N) - 1;
      for (var i = 0; i < N; i++) {
        t[i] = this.revBin(i, l, N);
      }

      return t;
    };

    // Returns binary-reversed representation of `x`
    FFTM.prototype.revBin = function revBin (x, l, N) {
      if (x === 0 || x === N - 1) return x;

      var rb = 0;
      for (var i = 0; i < l; i++) {
        rb |= (x & 1) << (l - i - 1);
        x >>= 1;
      }

      return rb;
    };

    // Performs "tweedling" phase, therefore 'emulating'
    // behaviour of the recursive algorithm
    FFTM.prototype.permute = function permute (rbt, rws, iws, rtws, itws, N) {
      for (var i = 0; i < N; i++) {
        rtws[i] = rws[rbt[i]];
        itws[i] = iws[rbt[i]];
      }
    };

    FFTM.prototype.transform = function transform (rws, iws, rtws, itws, N, rbt) {
      this.permute(rbt, rws, iws, rtws, itws, N);

      for (var s = 1; s < N; s <<= 1) {
        var l = s << 1;

        var rtwdf = Math.cos(2 * Math.PI / l);
        var itwdf = Math.sin(2 * Math.PI / l);

        for (var p = 0; p < N; p += l) {
          var rtwdf_ = rtwdf;
          var itwdf_ = itwdf;

          for (var j = 0; j < s; j++) {
            var re = rtws[p + j];
            var ie = itws[p + j];

            var ro = rtws[p + j + s];
            var io = itws[p + j + s];

            var rx = rtwdf_ * ro - itwdf_ * io;

            io = rtwdf_ * io + itwdf_ * ro;
            ro = rx;

            rtws[p + j] = re + ro;
            itws[p + j] = ie + io;

            rtws[p + j + s] = re - ro;
            itws[p + j + s] = ie - io;

            /* jshint maxdepth : false */
            if (j !== l) {
              rx = rtwdf * rtwdf_ - itwdf * itwdf_;

              itwdf_ = rtwdf * itwdf_ + itwdf * rtwdf_;
              rtwdf_ = rx;
            }
          }
        }
      }
    };

    FFTM.prototype.guessLen13b = function guessLen13b (n, m) {
      var N = Math.max(m, n) | 1;
      var odd = N & 1;
      var i = 0;
      for (N = N / 2 | 0; N; N = N >>> 1) {
        i++;
      }

      return 1 << i + 1 + odd;
    };

    FFTM.prototype.conjugate = function conjugate (rws, iws, N) {
      if (N <= 1) return;

      for (var i = 0; i < N / 2; i++) {
        var t = rws[i];

        rws[i] = rws[N - i - 1];
        rws[N - i - 1] = t;

        t = iws[i];

        iws[i] = -iws[N - i - 1];
        iws[N - i - 1] = -t;
      }
    };

    FFTM.prototype.normalize13b = function normalize13b (ws, N) {
      var carry = 0;
      for (var i = 0; i < N / 2; i++) {
        var w = Math.round(ws[2 * i + 1] / N) * 0x2000 +
          Math.round(ws[2 * i] / N) +
          carry;

        ws[i] = w & 0x3ffffff;

        if (w < 0x4000000) {
          carry = 0;
        } else {
          carry = w / 0x4000000 | 0;
        }
      }

      return ws;
    };

    FFTM.prototype.convert13b = function convert13b (ws, len, rws, N) {
      var carry = 0;
      for (var i = 0; i < len; i++) {
        carry = carry + (ws[i] | 0);

        rws[2 * i] = carry & 0x1fff; carry = carry >>> 13;
        rws[2 * i + 1] = carry & 0x1fff; carry = carry >>> 13;
      }

      // Pad with zeroes
      for (i = 2 * len; i < N; ++i) {
        rws[i] = 0;
      }

      assert(carry === 0);
      assert((carry & ~0x1fff) === 0);
    };

    FFTM.prototype.stub = function stub (N) {
      var ph = new Array(N);
      for (var i = 0; i < N; i++) {
        ph[i] = 0;
      }

      return ph;
    };

    FFTM.prototype.mulp = function mulp (x, y, out) {
      var N = 2 * this.guessLen13b(x.length, y.length);

      var rbt = this.makeRBT(N);

      var _ = this.stub(N);

      var rws = new Array(N);
      var rwst = new Array(N);
      var iwst = new Array(N);

      var nrws = new Array(N);
      var nrwst = new Array(N);
      var niwst = new Array(N);

      var rmws = out.words;
      rmws.length = N;

      this.convert13b(x.words, x.length, rws, N);
      this.convert13b(y.words, y.length, nrws, N);

      this.transform(rws, _, rwst, iwst, N, rbt);
      this.transform(nrws, _, nrwst, niwst, N, rbt);

      for (var i = 0; i < N; i++) {
        var rx = rwst[i] * nrwst[i] - iwst[i] * niwst[i];
        iwst[i] = rwst[i] * niwst[i] + iwst[i] * nrwst[i];
        rwst[i] = rx;
      }

      this.conjugate(rwst, iwst, N);
      this.transform(rwst, iwst, rmws, _, N, rbt);
      this.conjugate(rmws, _, N);
      this.normalize13b(rmws, N);

      out.negative = x.negative ^ y.negative;
      out.length = x.length + y.length;
      return out.strip();
    };

    // Multiply `this` by `num`
    BN.prototype.mul = function mul (num) {
      var out = new BN(null);
      out.words = new Array(this.length + num.length);
      return this.mulTo(num, out);
    };

    // Multiply employing FFT
    BN.prototype.mulf = function mulf (num) {
      var out = new BN(null);
      out.words = new Array(this.length + num.length);
      return jumboMulTo(this, num, out);
    };

    // In-place Multiplication
    BN.prototype.imul = function imul (num) {
      return this.clone().mulTo(num, this);
    };

    BN.prototype.imuln = function imuln (num) {
      assert(typeof num === 'number');
      assert(num < 0x4000000);

      // Carry
      var carry = 0;
      for (var i = 0; i < this.length; i++) {
        var w = (this.words[i] | 0) * num;
        var lo = (w & 0x3ffffff) + (carry & 0x3ffffff);
        carry >>= 26;
        carry += (w / 0x4000000) | 0;
        // NOTE: lo is 27bit maximum
        carry += lo >>> 26;
        this.words[i] = lo & 0x3ffffff;
      }

      if (carry !== 0) {
        this.words[i] = carry;
        this.length++;
      }

      return this;
    };

    BN.prototype.muln = function muln (num) {
      return this.clone().imuln(num);
    };

    // `this` * `this`
    BN.prototype.sqr = function sqr () {
      return this.mul(this);
    };

    // `this` * `this` in-place
    BN.prototype.isqr = function isqr () {
      return this.imul(this.clone());
    };

    // Math.pow(`this`, `num`)
    BN.prototype.pow = function pow (num) {
      var w = toBitArray(num);
      if (w.length === 0) return new BN(1);

      // Skip leading zeroes
      var res = this;
      for (var i = 0; i < w.length; i++, res = res.sqr()) {
        if (w[i] !== 0) break;
      }

      if (++i < w.length) {
        for (var q = res.sqr(); i < w.length; i++, q = q.sqr()) {
          if (w[i] === 0) continue;

          res = res.mul(q);
        }
      }

      return res;
    };

    // Shift-left in-place
    BN.prototype.iushln = function iushln (bits) {
      assert(typeof bits === 'number' && bits >= 0);
      var r = bits % 26;
      var s = (bits - r) / 26;
      var carryMask = (0x3ffffff >>> (26 - r)) << (26 - r);
      var i;

      if (r !== 0) {
        var carry = 0;

        for (i = 0; i < this.length; i++) {
          var newCarry = this.words[i] & carryMask;
          var c = ((this.words[i] | 0) - newCarry) << r;
          this.words[i] = c | carry;
          carry = newCarry >>> (26 - r);
        }

        if (carry) {
          this.words[i] = carry;
          this.length++;
        }
      }

      if (s !== 0) {
        for (i = this.length - 1; i >= 0; i--) {
          this.words[i + s] = this.words[i];
        }

        for (i = 0; i < s; i++) {
          this.words[i] = 0;
        }

        this.length += s;
      }

      return this.strip();
    };

    BN.prototype.ishln = function ishln (bits) {
      // TODO(indutny): implement me
      assert(this.negative === 0);
      return this.iushln(bits);
    };

    // Shift-right in-place
    // NOTE: `hint` is a lowest bit before trailing zeroes
    // NOTE: if `extended` is present - it will be filled with destroyed bits
    BN.prototype.iushrn = function iushrn (bits, hint, extended) {
      assert(typeof bits === 'number' && bits >= 0);
      var h;
      if (hint) {
        h = (hint - (hint % 26)) / 26;
      } else {
        h = 0;
      }

      var r = bits % 26;
      var s = Math.min((bits - r) / 26, this.length);
      var mask = 0x3ffffff ^ ((0x3ffffff >>> r) << r);
      var maskedWords = extended;

      h -= s;
      h = Math.max(0, h);

      // Extended mode, copy masked part
      if (maskedWords) {
        for (var i = 0; i < s; i++) {
          maskedWords.words[i] = this.words[i];
        }
        maskedWords.length = s;
      }

      if (s === 0) ; else if (this.length > s) {
        this.length -= s;
        for (i = 0; i < this.length; i++) {
          this.words[i] = this.words[i + s];
        }
      } else {
        this.words[0] = 0;
        this.length = 1;
      }

      var carry = 0;
      for (i = this.length - 1; i >= 0 && (carry !== 0 || i >= h); i--) {
        var word = this.words[i] | 0;
        this.words[i] = (carry << (26 - r)) | (word >>> r);
        carry = word & mask;
      }

      // Push carried bits as a mask
      if (maskedWords && carry !== 0) {
        maskedWords.words[maskedWords.length++] = carry;
      }

      if (this.length === 0) {
        this.words[0] = 0;
        this.length = 1;
      }

      return this.strip();
    };

    BN.prototype.ishrn = function ishrn (bits, hint, extended) {
      // TODO(indutny): implement me
      assert(this.negative === 0);
      return this.iushrn(bits, hint, extended);
    };

    // Shift-left
    BN.prototype.shln = function shln (bits) {
      return this.clone().ishln(bits);
    };

    BN.prototype.ushln = function ushln (bits) {
      return this.clone().iushln(bits);
    };

    // Shift-right
    BN.prototype.shrn = function shrn (bits) {
      return this.clone().ishrn(bits);
    };

    BN.prototype.ushrn = function ushrn (bits) {
      return this.clone().iushrn(bits);
    };

    // Test if n bit is set
    BN.prototype.testn = function testn (bit) {
      assert(typeof bit === 'number' && bit >= 0);
      var r = bit % 26;
      var s = (bit - r) / 26;
      var q = 1 << r;

      // Fast case: bit is much higher than all existing words
      if (this.length <= s) return false;

      // Check bit and return
      var w = this.words[s];

      return !!(w & q);
    };

    // Return only lowers bits of number (in-place)
    BN.prototype.imaskn = function imaskn (bits) {
      assert(typeof bits === 'number' && bits >= 0);
      var r = bits % 26;
      var s = (bits - r) / 26;

      assert(this.negative === 0, 'imaskn works only with positive numbers');

      if (this.length <= s) {
        return this;
      }

      if (r !== 0) {
        s++;
      }
      this.length = Math.min(s, this.length);

      if (r !== 0) {
        var mask = 0x3ffffff ^ ((0x3ffffff >>> r) << r);
        this.words[this.length - 1] &= mask;
      }

      return this.strip();
    };

    // Return only lowers bits of number
    BN.prototype.maskn = function maskn (bits) {
      return this.clone().imaskn(bits);
    };

    // Add plain number `num` to `this`
    BN.prototype.iaddn = function iaddn (num) {
      assert(typeof num === 'number');
      assert(num < 0x4000000);
      if (num < 0) return this.isubn(-num);

      // Possible sign change
      if (this.negative !== 0) {
        if (this.length === 1 && (this.words[0] | 0) < num) {
          this.words[0] = num - (this.words[0] | 0);
          this.negative = 0;
          return this;
        }

        this.negative = 0;
        this.isubn(num);
        this.negative = 1;
        return this;
      }

      // Add without checks
      return this._iaddn(num);
    };

    BN.prototype._iaddn = function _iaddn (num) {
      this.words[0] += num;

      // Carry
      for (var i = 0; i < this.length && this.words[i] >= 0x4000000; i++) {
        this.words[i] -= 0x4000000;
        if (i === this.length - 1) {
          this.words[i + 1] = 1;
        } else {
          this.words[i + 1]++;
        }
      }
      this.length = Math.max(this.length, i + 1);

      return this;
    };

    // Subtract plain number `num` from `this`
    BN.prototype.isubn = function isubn (num) {
      assert(typeof num === 'number');
      assert(num < 0x4000000);
      if (num < 0) return this.iaddn(-num);

      if (this.negative !== 0) {
        this.negative = 0;
        this.iaddn(num);
        this.negative = 1;
        return this;
      }

      this.words[0] -= num;

      if (this.length === 1 && this.words[0] < 0) {
        this.words[0] = -this.words[0];
        this.negative = 1;
      } else {
        // Carry
        for (var i = 0; i < this.length && this.words[i] < 0; i++) {
          this.words[i] += 0x4000000;
          this.words[i + 1] -= 1;
        }
      }

      return this.strip();
    };

    BN.prototype.addn = function addn (num) {
      return this.clone().iaddn(num);
    };

    BN.prototype.subn = function subn (num) {
      return this.clone().isubn(num);
    };

    BN.prototype.iabs = function iabs () {
      this.negative = 0;

      return this;
    };

    BN.prototype.abs = function abs () {
      return this.clone().iabs();
    };

    BN.prototype._ishlnsubmul = function _ishlnsubmul (num, mul, shift) {
      var len = num.length + shift;
      var i;

      this._expand(len);

      var w;
      var carry = 0;
      for (i = 0; i < num.length; i++) {
        w = (this.words[i + shift] | 0) + carry;
        var right = (num.words[i] | 0) * mul;
        w -= right & 0x3ffffff;
        carry = (w >> 26) - ((right / 0x4000000) | 0);
        this.words[i + shift] = w & 0x3ffffff;
      }
      for (; i < this.length - shift; i++) {
        w = (this.words[i + shift] | 0) + carry;
        carry = w >> 26;
        this.words[i + shift] = w & 0x3ffffff;
      }

      if (carry === 0) return this.strip();

      // Subtraction overflow
      assert(carry === -1);
      carry = 0;
      for (i = 0; i < this.length; i++) {
        w = -(this.words[i] | 0) + carry;
        carry = w >> 26;
        this.words[i] = w & 0x3ffffff;
      }
      this.negative = 1;

      return this.strip();
    };

    BN.prototype._wordDiv = function _wordDiv (num, mode) {
      var shift = this.length - num.length;

      var a = this.clone();
      var b = num;

      // Normalize
      var bhi = b.words[b.length - 1] | 0;
      var bhiBits = this._countBits(bhi);
      shift = 26 - bhiBits;
      if (shift !== 0) {
        b = b.ushln(shift);
        a.iushln(shift);
        bhi = b.words[b.length - 1] | 0;
      }

      // Initialize quotient
      var m = a.length - b.length;
      var q;

      if (mode !== 'mod') {
        q = new BN(null);
        q.length = m + 1;
        q.words = new Array(q.length);
        for (var i = 0; i < q.length; i++) {
          q.words[i] = 0;
        }
      }

      var diff = a.clone()._ishlnsubmul(b, 1, m);
      if (diff.negative === 0) {
        a = diff;
        if (q) {
          q.words[m] = 1;
        }
      }

      for (var j = m - 1; j >= 0; j--) {
        var qj = (a.words[b.length + j] | 0) * 0x4000000 +
          (a.words[b.length + j - 1] | 0);

        // NOTE: (qj / bhi) is (0x3ffffff * 0x4000000 + 0x3ffffff) / 0x2000000 max
        // (0x7ffffff)
        qj = Math.min((qj / bhi) | 0, 0x3ffffff);

        a._ishlnsubmul(b, qj, j);
        while (a.negative !== 0) {
          qj--;
          a.negative = 0;
          a._ishlnsubmul(b, 1, j);
          if (!a.isZero()) {
            a.negative ^= 1;
          }
        }
        if (q) {
          q.words[j] = qj;
        }
      }
      if (q) {
        q.strip();
      }
      a.strip();

      // Denormalize
      if (mode !== 'div' && shift !== 0) {
        a.iushrn(shift);
      }

      return {
        div: q || null,
        mod: a
      };
    };

    // NOTE: 1) `mode` can be set to `mod` to request mod only,
    //       to `div` to request div only, or be absent to
    //       request both div & mod
    //       2) `positive` is true if unsigned mod is requested
    BN.prototype.divmod = function divmod (num, mode, positive) {
      assert(!num.isZero());

      if (this.isZero()) {
        return {
          div: new BN(0),
          mod: new BN(0)
        };
      }

      var div, mod, res;
      if (this.negative !== 0 && num.negative === 0) {
        res = this.neg().divmod(num, mode);

        if (mode !== 'mod') {
          div = res.div.neg();
        }

        if (mode !== 'div') {
          mod = res.mod.neg();
          if (positive && mod.negative !== 0) {
            mod.iadd(num);
          }
        }

        return {
          div: div,
          mod: mod
        };
      }

      if (this.negative === 0 && num.negative !== 0) {
        res = this.divmod(num.neg(), mode);

        if (mode !== 'mod') {
          div = res.div.neg();
        }

        return {
          div: div,
          mod: res.mod
        };
      }

      if ((this.negative & num.negative) !== 0) {
        res = this.neg().divmod(num.neg(), mode);

        if (mode !== 'div') {
          mod = res.mod.neg();
          if (positive && mod.negative !== 0) {
            mod.isub(num);
          }
        }

        return {
          div: res.div,
          mod: mod
        };
      }

      // Both numbers are positive at this point

      // Strip both numbers to approximate shift value
      if (num.length > this.length || this.cmp(num) < 0) {
        return {
          div: new BN(0),
          mod: this
        };
      }

      // Very short reduction
      if (num.length === 1) {
        if (mode === 'div') {
          return {
            div: this.divn(num.words[0]),
            mod: null
          };
        }

        if (mode === 'mod') {
          return {
            div: null,
            mod: new BN(this.modn(num.words[0]))
          };
        }

        return {
          div: this.divn(num.words[0]),
          mod: new BN(this.modn(num.words[0]))
        };
      }

      return this._wordDiv(num, mode);
    };

    // Find `this` / `num`
    BN.prototype.div = function div (num) {
      return this.divmod(num, 'div', false).div;
    };

    // Find `this` % `num`
    BN.prototype.mod = function mod (num) {
      return this.divmod(num, 'mod', false).mod;
    };

    BN.prototype.umod = function umod (num) {
      return this.divmod(num, 'mod', true).mod;
    };

    // Find Round(`this` / `num`)
    BN.prototype.divRound = function divRound (num) {
      var dm = this.divmod(num);

      // Fast case - exact division
      if (dm.mod.isZero()) return dm.div;

      var mod = dm.div.negative !== 0 ? dm.mod.isub(num) : dm.mod;

      var half = num.ushrn(1);
      var r2 = num.andln(1);
      var cmp = mod.cmp(half);

      // Round down
      if (cmp < 0 || r2 === 1 && cmp === 0) return dm.div;

      // Round up
      return dm.div.negative !== 0 ? dm.div.isubn(1) : dm.div.iaddn(1);
    };

    BN.prototype.modn = function modn (num) {
      assert(num <= 0x3ffffff);
      var p = (1 << 26) % num;

      var acc = 0;
      for (var i = this.length - 1; i >= 0; i--) {
        acc = (p * acc + (this.words[i] | 0)) % num;
      }

      return acc;
    };

    // In-place division by number
    BN.prototype.idivn = function idivn (num) {
      assert(num <= 0x3ffffff);

      var carry = 0;
      for (var i = this.length - 1; i >= 0; i--) {
        var w = (this.words[i] | 0) + carry * 0x4000000;
        this.words[i] = (w / num) | 0;
        carry = w % num;
      }

      return this.strip();
    };

    BN.prototype.divn = function divn (num) {
      return this.clone().idivn(num);
    };

    BN.prototype.egcd = function egcd (p) {
      assert(p.negative === 0);
      assert(!p.isZero());

      var x = this;
      var y = p.clone();

      if (x.negative !== 0) {
        x = x.umod(p);
      } else {
        x = x.clone();
      }

      // A * x + B * y = x
      var A = new BN(1);
      var B = new BN(0);

      // C * x + D * y = y
      var C = new BN(0);
      var D = new BN(1);

      var g = 0;

      while (x.isEven() && y.isEven()) {
        x.iushrn(1);
        y.iushrn(1);
        ++g;
      }

      var yp = y.clone();
      var xp = x.clone();

      while (!x.isZero()) {
        for (var i = 0, im = 1; (x.words[0] & im) === 0 && i < 26; ++i, im <<= 1);
        if (i > 0) {
          x.iushrn(i);
          while (i-- > 0) {
            if (A.isOdd() || B.isOdd()) {
              A.iadd(yp);
              B.isub(xp);
            }

            A.iushrn(1);
            B.iushrn(1);
          }
        }

        for (var j = 0, jm = 1; (y.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1);
        if (j > 0) {
          y.iushrn(j);
          while (j-- > 0) {
            if (C.isOdd() || D.isOdd()) {
              C.iadd(yp);
              D.isub(xp);
            }

            C.iushrn(1);
            D.iushrn(1);
          }
        }

        if (x.cmp(y) >= 0) {
          x.isub(y);
          A.isub(C);
          B.isub(D);
        } else {
          y.isub(x);
          C.isub(A);
          D.isub(B);
        }
      }

      return {
        a: C,
        b: D,
        gcd: y.iushln(g)
      };
    };

    // This is reduced incarnation of the binary EEA
    // above, designated to invert members of the
    // _prime_ fields F(p) at a maximal speed
    BN.prototype._invmp = function _invmp (p) {
      assert(p.negative === 0);
      assert(!p.isZero());

      var a = this;
      var b = p.clone();

      if (a.negative !== 0) {
        a = a.umod(p);
      } else {
        a = a.clone();
      }

      var x1 = new BN(1);
      var x2 = new BN(0);

      var delta = b.clone();

      while (a.cmpn(1) > 0 && b.cmpn(1) > 0) {
        for (var i = 0, im = 1; (a.words[0] & im) === 0 && i < 26; ++i, im <<= 1);
        if (i > 0) {
          a.iushrn(i);
          while (i-- > 0) {
            if (x1.isOdd()) {
              x1.iadd(delta);
            }

            x1.iushrn(1);
          }
        }

        for (var j = 0, jm = 1; (b.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1);
        if (j > 0) {
          b.iushrn(j);
          while (j-- > 0) {
            if (x2.isOdd()) {
              x2.iadd(delta);
            }

            x2.iushrn(1);
          }
        }

        if (a.cmp(b) >= 0) {
          a.isub(b);
          x1.isub(x2);
        } else {
          b.isub(a);
          x2.isub(x1);
        }
      }

      var res;
      if (a.cmpn(1) === 0) {
        res = x1;
      } else {
        res = x2;
      }

      if (res.cmpn(0) < 0) {
        res.iadd(p);
      }

      return res;
    };

    BN.prototype.gcd = function gcd (num) {
      if (this.isZero()) return num.abs();
      if (num.isZero()) return this.abs();

      var a = this.clone();
      var b = num.clone();
      a.negative = 0;
      b.negative = 0;

      // Remove common factor of two
      for (var shift = 0; a.isEven() && b.isEven(); shift++) {
        a.iushrn(1);
        b.iushrn(1);
      }

      do {
        while (a.isEven()) {
          a.iushrn(1);
        }
        while (b.isEven()) {
          b.iushrn(1);
        }

        var r = a.cmp(b);
        if (r < 0) {
          // Swap `a` and `b` to make `a` always bigger than `b`
          var t = a;
          a = b;
          b = t;
        } else if (r === 0 || b.cmpn(1) === 0) {
          break;
        }

        a.isub(b);
      } while (true);

      return b.iushln(shift);
    };

    // Invert number in the field F(num)
    BN.prototype.invm = function invm (num) {
      return this.egcd(num).a.umod(num);
    };

    BN.prototype.isEven = function isEven () {
      return (this.words[0] & 1) === 0;
    };

    BN.prototype.isOdd = function isOdd () {
      return (this.words[0] & 1) === 1;
    };

    // And first word and num
    BN.prototype.andln = function andln (num) {
      return this.words[0] & num;
    };

    // Increment at the bit position in-line
    BN.prototype.bincn = function bincn (bit) {
      assert(typeof bit === 'number');
      var r = bit % 26;
      var s = (bit - r) / 26;
      var q = 1 << r;

      // Fast case: bit is much higher than all existing words
      if (this.length <= s) {
        this._expand(s + 1);
        this.words[s] |= q;
        return this;
      }

      // Add bit and propagate, if needed
      var carry = q;
      for (var i = s; carry !== 0 && i < this.length; i++) {
        var w = this.words[i] | 0;
        w += carry;
        carry = w >>> 26;
        w &= 0x3ffffff;
        this.words[i] = w;
      }
      if (carry !== 0) {
        this.words[i] = carry;
        this.length++;
      }
      return this;
    };

    BN.prototype.isZero = function isZero () {
      return this.length === 1 && this.words[0] === 0;
    };

    BN.prototype.cmpn = function cmpn (num) {
      var negative = num < 0;

      if (this.negative !== 0 && !negative) return -1;
      if (this.negative === 0 && negative) return 1;

      this.strip();

      var res;
      if (this.length > 1) {
        res = 1;
      } else {
        if (negative) {
          num = -num;
        }

        assert(num <= 0x3ffffff, 'Number is too big');

        var w = this.words[0] | 0;
        res = w === num ? 0 : w < num ? -1 : 1;
      }
      if (this.negative !== 0) return -res | 0;
      return res;
    };

    // Compare two numbers and return:
    // 1 - if `this` > `num`
    // 0 - if `this` == `num`
    // -1 - if `this` < `num`
    BN.prototype.cmp = function cmp (num) {
      if (this.negative !== 0 && num.negative === 0) return -1;
      if (this.negative === 0 && num.negative !== 0) return 1;

      var res = this.ucmp(num);
      if (this.negative !== 0) return -res | 0;
      return res;
    };

    // Unsigned comparison
    BN.prototype.ucmp = function ucmp (num) {
      // At this point both numbers have the same sign
      if (this.length > num.length) return 1;
      if (this.length < num.length) return -1;

      var res = 0;
      for (var i = this.length - 1; i >= 0; i--) {
        var a = this.words[i] | 0;
        var b = num.words[i] | 0;

        if (a === b) continue;
        if (a < b) {
          res = -1;
        } else if (a > b) {
          res = 1;
        }
        break;
      }
      return res;
    };

    BN.prototype.gtn = function gtn (num) {
      return this.cmpn(num) === 1;
    };

    BN.prototype.gt = function gt (num) {
      return this.cmp(num) === 1;
    };

    BN.prototype.gten = function gten (num) {
      return this.cmpn(num) >= 0;
    };

    BN.prototype.gte = function gte (num) {
      return this.cmp(num) >= 0;
    };

    BN.prototype.ltn = function ltn (num) {
      return this.cmpn(num) === -1;
    };

    BN.prototype.lt = function lt (num) {
      return this.cmp(num) === -1;
    };

    BN.prototype.lten = function lten (num) {
      return this.cmpn(num) <= 0;
    };

    BN.prototype.lte = function lte (num) {
      return this.cmp(num) <= 0;
    };

    BN.prototype.eqn = function eqn (num) {
      return this.cmpn(num) === 0;
    };

    BN.prototype.eq = function eq (num) {
      return this.cmp(num) === 0;
    };

    //
    // A reduce context, could be using montgomery or something better, depending
    // on the `m` itself.
    //
    BN.red = function red (num) {
      return new Red(num);
    };

    BN.prototype.toRed = function toRed (ctx) {
      assert(!this.red, 'Already a number in reduction context');
      assert(this.negative === 0, 'red works only with positives');
      return ctx.convertTo(this)._forceRed(ctx);
    };

    BN.prototype.fromRed = function fromRed () {
      assert(this.red, 'fromRed works only with numbers in reduction context');
      return this.red.convertFrom(this);
    };

    BN.prototype._forceRed = function _forceRed (ctx) {
      this.red = ctx;
      return this;
    };

    BN.prototype.forceRed = function forceRed (ctx) {
      assert(!this.red, 'Already a number in reduction context');
      return this._forceRed(ctx);
    };

    BN.prototype.redAdd = function redAdd (num) {
      assert(this.red, 'redAdd works only with red numbers');
      return this.red.add(this, num);
    };

    BN.prototype.redIAdd = function redIAdd (num) {
      assert(this.red, 'redIAdd works only with red numbers');
      return this.red.iadd(this, num);
    };

    BN.prototype.redSub = function redSub (num) {
      assert(this.red, 'redSub works only with red numbers');
      return this.red.sub(this, num);
    };

    BN.prototype.redISub = function redISub (num) {
      assert(this.red, 'redISub works only with red numbers');
      return this.red.isub(this, num);
    };

    BN.prototype.redShl = function redShl (num) {
      assert(this.red, 'redShl works only with red numbers');
      return this.red.shl(this, num);
    };

    BN.prototype.redMul = function redMul (num) {
      assert(this.red, 'redMul works only with red numbers');
      this.red._verify2(this, num);
      return this.red.mul(this, num);
    };

    BN.prototype.redIMul = function redIMul (num) {
      assert(this.red, 'redMul works only with red numbers');
      this.red._verify2(this, num);
      return this.red.imul(this, num);
    };

    BN.prototype.redSqr = function redSqr () {
      assert(this.red, 'redSqr works only with red numbers');
      this.red._verify1(this);
      return this.red.sqr(this);
    };

    BN.prototype.redISqr = function redISqr () {
      assert(this.red, 'redISqr works only with red numbers');
      this.red._verify1(this);
      return this.red.isqr(this);
    };

    // Square root over p
    BN.prototype.redSqrt = function redSqrt () {
      assert(this.red, 'redSqrt works only with red numbers');
      this.red._verify1(this);
      return this.red.sqrt(this);
    };

    BN.prototype.redInvm = function redInvm () {
      assert(this.red, 'redInvm works only with red numbers');
      this.red._verify1(this);
      return this.red.invm(this);
    };

    // Return negative clone of `this` % `red modulo`
    BN.prototype.redNeg = function redNeg () {
      assert(this.red, 'redNeg works only with red numbers');
      this.red._verify1(this);
      return this.red.neg(this);
    };

    BN.prototype.redPow = function redPow (num) {
      assert(this.red && !num.red, 'redPow(normalNum)');
      this.red._verify1(this);
      return this.red.pow(this, num);
    };

    // Prime numbers with efficient reduction
    var primes = {
      k256: null,
      p224: null,
      p192: null,
      p25519: null
    };

    // Pseudo-Mersenne prime
    function MPrime (name, p) {
      // P = 2 ^ N - K
      this.name = name;
      this.p = new BN(p, 16);
      this.n = this.p.bitLength();
      this.k = new BN(1).iushln(this.n).isub(this.p);

      this.tmp = this._tmp();
    }

    MPrime.prototype._tmp = function _tmp () {
      var tmp = new BN(null);
      tmp.words = new Array(Math.ceil(this.n / 13));
      return tmp;
    };

    MPrime.prototype.ireduce = function ireduce (num) {
      // Assumes that `num` is less than `P^2`
      // num = HI * (2 ^ N - K) + HI * K + LO = HI * K + LO (mod P)
      var r = num;
      var rlen;

      do {
        this.split(r, this.tmp);
        r = this.imulK(r);
        r = r.iadd(this.tmp);
        rlen = r.bitLength();
      } while (rlen > this.n);

      var cmp = rlen < this.n ? -1 : r.ucmp(this.p);
      if (cmp === 0) {
        r.words[0] = 0;
        r.length = 1;
      } else if (cmp > 0) {
        r.isub(this.p);
      } else {
        r.strip();
      }

      return r;
    };

    MPrime.prototype.split = function split (input, out) {
      input.iushrn(this.n, 0, out);
    };

    MPrime.prototype.imulK = function imulK (num) {
      return num.imul(this.k);
    };

    function K256 () {
      MPrime.call(
        this,
        'k256',
        'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f');
    }
    inherits(K256, MPrime);

    K256.prototype.split = function split (input, output) {
      // 256 = 9 * 26 + 22
      var mask = 0x3fffff;

      var outLen = Math.min(input.length, 9);
      for (var i = 0; i < outLen; i++) {
        output.words[i] = input.words[i];
      }
      output.length = outLen;

      if (input.length <= 9) {
        input.words[0] = 0;
        input.length = 1;
        return;
      }

      // Shift by 9 limbs
      var prev = input.words[9];
      output.words[output.length++] = prev & mask;

      for (i = 10; i < input.length; i++) {
        var next = input.words[i] | 0;
        input.words[i - 10] = ((next & mask) << 4) | (prev >>> 22);
        prev = next;
      }
      prev >>>= 22;
      input.words[i - 10] = prev;
      if (prev === 0 && input.length > 10) {
        input.length -= 10;
      } else {
        input.length -= 9;
      }
    };

    K256.prototype.imulK = function imulK (num) {
      // K = 0x1000003d1 = [ 0x40, 0x3d1 ]
      num.words[num.length] = 0;
      num.words[num.length + 1] = 0;
      num.length += 2;

      // bounded at: 0x40 * 0x3ffffff + 0x3d0 = 0x100000390
      var lo = 0;
      for (var i = 0; i < num.length; i++) {
        var w = num.words[i] | 0;
        lo += w * 0x3d1;
        num.words[i] = lo & 0x3ffffff;
        lo = w * 0x40 + ((lo / 0x4000000) | 0);
      }

      // Fast length reduction
      if (num.words[num.length - 1] === 0) {
        num.length--;
        if (num.words[num.length - 1] === 0) {
          num.length--;
        }
      }
      return num;
    };

    function P224 () {
      MPrime.call(
        this,
        'p224',
        'ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001');
    }
    inherits(P224, MPrime);

    function P192 () {
      MPrime.call(
        this,
        'p192',
        'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff');
    }
    inherits(P192, MPrime);

    function P25519 () {
      // 2 ^ 255 - 19
      MPrime.call(
        this,
        '25519',
        '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed');
    }
    inherits(P25519, MPrime);

    P25519.prototype.imulK = function imulK (num) {
      // K = 0x13
      var carry = 0;
      for (var i = 0; i < num.length; i++) {
        var hi = (num.words[i] | 0) * 0x13 + carry;
        var lo = hi & 0x3ffffff;
        hi >>>= 26;

        num.words[i] = lo;
        carry = hi;
      }
      if (carry !== 0) {
        num.words[num.length++] = carry;
      }
      return num;
    };

    // Exported mostly for testing purposes, use plain name instead
    BN._prime = function prime (name) {
      // Cached version of prime
      if (primes[name]) return primes[name];

      var prime;
      if (name === 'k256') {
        prime = new K256();
      } else if (name === 'p224') {
        prime = new P224();
      } else if (name === 'p192') {
        prime = new P192();
      } else if (name === 'p25519') {
        prime = new P25519();
      } else {
        throw new Error('Unknown prime ' + name);
      }
      primes[name] = prime;

      return prime;
    };

    //
    // Base reduction engine
    //
    function Red (m) {
      if (typeof m === 'string') {
        var prime = BN._prime(m);
        this.m = prime.p;
        this.prime = prime;
      } else {
        assert(m.gtn(1), 'modulus must be greater than 1');
        this.m = m;
        this.prime = null;
      }
    }

    Red.prototype._verify1 = function _verify1 (a) {
      assert(a.negative === 0, 'red works only with positives');
      assert(a.red, 'red works only with red numbers');
    };

    Red.prototype._verify2 = function _verify2 (a, b) {
      assert((a.negative | b.negative) === 0, 'red works only with positives');
      assert(a.red && a.red === b.red,
        'red works only with red numbers');
    };

    Red.prototype.imod = function imod (a) {
      if (this.prime) return this.prime.ireduce(a)._forceRed(this);
      return a.umod(this.m)._forceRed(this);
    };

    Red.prototype.neg = function neg (a) {
      if (a.isZero()) {
        return a.clone();
      }

      return this.m.sub(a)._forceRed(this);
    };

    Red.prototype.add = function add (a, b) {
      this._verify2(a, b);

      var res = a.add(b);
      if (res.cmp(this.m) >= 0) {
        res.isub(this.m);
      }
      return res._forceRed(this);
    };

    Red.prototype.iadd = function iadd (a, b) {
      this._verify2(a, b);

      var res = a.iadd(b);
      if (res.cmp(this.m) >= 0) {
        res.isub(this.m);
      }
      return res;
    };

    Red.prototype.sub = function sub (a, b) {
      this._verify2(a, b);

      var res = a.sub(b);
      if (res.cmpn(0) < 0) {
        res.iadd(this.m);
      }
      return res._forceRed(this);
    };

    Red.prototype.isub = function isub (a, b) {
      this._verify2(a, b);

      var res = a.isub(b);
      if (res.cmpn(0) < 0) {
        res.iadd(this.m);
      }
      return res;
    };

    Red.prototype.shl = function shl (a, num) {
      this._verify1(a);
      return this.imod(a.ushln(num));
    };

    Red.prototype.imul = function imul (a, b) {
      this._verify2(a, b);
      return this.imod(a.imul(b));
    };

    Red.prototype.mul = function mul (a, b) {
      this._verify2(a, b);
      return this.imod(a.mul(b));
    };

    Red.prototype.isqr = function isqr (a) {
      return this.imul(a, a.clone());
    };

    Red.prototype.sqr = function sqr (a) {
      return this.mul(a, a);
    };

    Red.prototype.sqrt = function sqrt (a) {
      if (a.isZero()) return a.clone();

      var mod3 = this.m.andln(3);
      assert(mod3 % 2 === 1);

      // Fast case
      if (mod3 === 3) {
        var pow = this.m.add(new BN(1)).iushrn(2);
        return this.pow(a, pow);
      }

      // Tonelli-Shanks algorithm (Totally unoptimized and slow)
      //
      // Find Q and S, that Q * 2 ^ S = (P - 1)
      var q = this.m.subn(1);
      var s = 0;
      while (!q.isZero() && q.andln(1) === 0) {
        s++;
        q.iushrn(1);
      }
      assert(!q.isZero());

      var one = new BN(1).toRed(this);
      var nOne = one.redNeg();

      // Find quadratic non-residue
      // NOTE: Max is such because of generalized Riemann hypothesis.
      var lpow = this.m.subn(1).iushrn(1);
      var z = this.m.bitLength();
      z = new BN(2 * z * z).toRed(this);

      while (this.pow(z, lpow).cmp(nOne) !== 0) {
        z.redIAdd(nOne);
      }

      var c = this.pow(z, q);
      var r = this.pow(a, q.addn(1).iushrn(1));
      var t = this.pow(a, q);
      var m = s;
      while (t.cmp(one) !== 0) {
        var tmp = t;
        for (var i = 0; tmp.cmp(one) !== 0; i++) {
          tmp = tmp.redSqr();
        }
        assert(i < m);
        var b = this.pow(c, new BN(1).iushln(m - i - 1));

        r = r.redMul(b);
        c = b.redSqr();
        t = t.redMul(c);
        m = i;
      }

      return r;
    };

    Red.prototype.invm = function invm (a) {
      var inv = a._invmp(this.m);
      if (inv.negative !== 0) {
        inv.negative = 0;
        return this.imod(inv).redNeg();
      } else {
        return this.imod(inv);
      }
    };

    Red.prototype.pow = function pow (a, num) {
      if (num.isZero()) return new BN(1).toRed(this);
      if (num.cmpn(1) === 0) return a.clone();

      var windowSize = 4;
      var wnd = new Array(1 << windowSize);
      wnd[0] = new BN(1).toRed(this);
      wnd[1] = a;
      for (var i = 2; i < wnd.length; i++) {
        wnd[i] = this.mul(wnd[i - 1], a);
      }

      var res = wnd[0];
      var current = 0;
      var currentLen = 0;
      var start = num.bitLength() % 26;
      if (start === 0) {
        start = 26;
      }

      for (i = num.length - 1; i >= 0; i--) {
        var word = num.words[i];
        for (var j = start - 1; j >= 0; j--) {
          var bit = (word >> j) & 1;
          if (res !== wnd[0]) {
            res = this.sqr(res);
          }

          if (bit === 0 && current === 0) {
            currentLen = 0;
            continue;
          }

          current <<= 1;
          current |= bit;
          currentLen++;
          if (currentLen !== windowSize && (i !== 0 || j !== 0)) continue;

          res = this.mul(res, wnd[current]);
          currentLen = 0;
          current = 0;
        }
        start = 26;
      }

      return res;
    };

    Red.prototype.convertTo = function convertTo (num) {
      var r = num.umod(this.m);

      return r === num ? r.clone() : r;
    };

    Red.prototype.convertFrom = function convertFrom (num) {
      var res = num.clone();
      res.red = null;
      return res;
    };

    //
    // Montgomery method engine
    //

    BN.mont = function mont (num) {
      return new Mont(num);
    };

    function Mont (m) {
      Red.call(this, m);

      this.shift = this.m.bitLength();
      if (this.shift % 26 !== 0) {
        this.shift += 26 - (this.shift % 26);
      }

      this.r = new BN(1).iushln(this.shift);
      this.r2 = this.imod(this.r.sqr());
      this.rinv = this.r._invmp(this.m);

      this.minv = this.rinv.mul(this.r).isubn(1).div(this.m);
      this.minv = this.minv.umod(this.r);
      this.minv = this.r.sub(this.minv);
    }
    inherits(Mont, Red);

    Mont.prototype.convertTo = function convertTo (num) {
      return this.imod(num.ushln(this.shift));
    };

    Mont.prototype.convertFrom = function convertFrom (num) {
      var r = this.imod(num.mul(this.rinv));
      r.red = null;
      return r;
    };

    Mont.prototype.imul = function imul (a, b) {
      if (a.isZero() || b.isZero()) {
        a.words[0] = 0;
        a.length = 1;
        return a;
      }

      var t = a.imul(b);
      var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
      var u = t.isub(c).iushrn(this.shift);
      var res = u;

      if (u.cmp(this.m) >= 0) {
        res = u.isub(this.m);
      } else if (u.cmpn(0) < 0) {
        res = u.iadd(this.m);
      }

      return res._forceRed(this);
    };

    Mont.prototype.mul = function mul (a, b) {
      if (a.isZero() || b.isZero()) return new BN(0)._forceRed(this);

      var t = a.mul(b);
      var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
      var u = t.isub(c).iushrn(this.shift);
      var res = u;
      if (u.cmp(this.m) >= 0) {
        res = u.isub(this.m);
      } else if (u.cmpn(0) < 0) {
        res = u.iadd(this.m);
      }

      return res._forceRed(this);
    };

    Mont.prototype.invm = function invm (a) {
      // (AR)^-1 * R^2 = (A^-1 * R^-1) * R^2 = A^-1 * R
      var res = this.imod(a._invmp(this.m).mul(this.r2));
      return res._forceRed(this);
    };
  })(module, commonjsGlobal);
  });

  var minimalisticAssert = assert;

  function assert(val, msg) {
    if (!val)
      throw new Error(msg || 'Assertion failed');
  }

  assert.equal = function assertEqual(l, r, msg) {
    if (l != r)
      throw new Error(msg || ('Assertion failed: ' + l + ' != ' + r));
  };

  var utils_1 = createCommonjsModule(function (module, exports) {

  var utils = exports;

  function toArray(msg, enc) {
    if (Array.isArray(msg))
      return msg.slice();
    if (!msg)
      return [];
    var res = [];
    if (typeof msg !== 'string') {
      for (var i = 0; i < msg.length; i++)
        res[i] = msg[i] | 0;
      return res;
    }
    if (enc === 'hex') {
      msg = msg.replace(/[^a-z0-9]+/ig, '');
      if (msg.length % 2 !== 0)
        msg = '0' + msg;
      for (var i = 0; i < msg.length; i += 2)
        res.push(parseInt(msg[i] + msg[i + 1], 16));
    } else {
      for (var i = 0; i < msg.length; i++) {
        var c = msg.charCodeAt(i);
        var hi = c >> 8;
        var lo = c & 0xff;
        if (hi)
          res.push(hi, lo);
        else
          res.push(lo);
      }
    }
    return res;
  }
  utils.toArray = toArray;

  function zero2(word) {
    if (word.length === 1)
      return '0' + word;
    else
      return word;
  }
  utils.zero2 = zero2;

  function toHex(msg) {
    var res = '';
    for (var i = 0; i < msg.length; i++)
      res += zero2(msg[i].toString(16));
    return res;
  }
  utils.toHex = toHex;

  utils.encode = function encode(arr, enc) {
    if (enc === 'hex')
      return toHex(arr);
    else
      return arr;
  };
  });

  var utils_1$1 = createCommonjsModule(function (module, exports) {

  var utils = exports;




  utils.assert = minimalisticAssert;
  utils.toArray = utils_1.toArray;
  utils.zero2 = utils_1.zero2;
  utils.toHex = utils_1.toHex;
  utils.encode = utils_1.encode;

  // Represent num in a w-NAF form
  function getNAF(num, w) {
    var naf = [];
    var ws = 1 << (w + 1);
    var k = num.clone();
    while (k.cmpn(1) >= 0) {
      var z;
      if (k.isOdd()) {
        var mod = k.andln(ws - 1);
        if (mod > (ws >> 1) - 1)
          z = (ws >> 1) - mod;
        else
          z = mod;
        k.isubn(z);
      } else {
        z = 0;
      }
      naf.push(z);

      // Optimization, shift by word if possible
      var shift = (k.cmpn(0) !== 0 && k.andln(ws - 1) === 0) ? (w + 1) : 1;
      for (var i = 1; i < shift; i++)
        naf.push(0);
      k.iushrn(shift);
    }

    return naf;
  }
  utils.getNAF = getNAF;

  // Represent k1, k2 in a Joint Sparse Form
  function getJSF(k1, k2) {
    var jsf = [
      [],
      []
    ];

    k1 = k1.clone();
    k2 = k2.clone();
    var d1 = 0;
    var d2 = 0;
    while (k1.cmpn(-d1) > 0 || k2.cmpn(-d2) > 0) {

      // First phase
      var m14 = (k1.andln(3) + d1) & 3;
      var m24 = (k2.andln(3) + d2) & 3;
      if (m14 === 3)
        m14 = -1;
      if (m24 === 3)
        m24 = -1;
      var u1;
      if ((m14 & 1) === 0) {
        u1 = 0;
      } else {
        var m8 = (k1.andln(7) + d1) & 7;
        if ((m8 === 3 || m8 === 5) && m24 === 2)
          u1 = -m14;
        else
          u1 = m14;
      }
      jsf[0].push(u1);

      var u2;
      if ((m24 & 1) === 0) {
        u2 = 0;
      } else {
        var m8 = (k2.andln(7) + d2) & 7;
        if ((m8 === 3 || m8 === 5) && m14 === 2)
          u2 = -m24;
        else
          u2 = m24;
      }
      jsf[1].push(u2);

      // Second phase
      if (2 * d1 === u1 + 1)
        d1 = 1 - d1;
      if (2 * d2 === u2 + 1)
        d2 = 1 - d2;
      k1.iushrn(1);
      k2.iushrn(1);
    }

    return jsf;
  }
  utils.getJSF = getJSF;

  function cachedProperty(obj, name, computer) {
    var key = '_' + name;
    obj.prototype[name] = function cachedProperty() {
      return this[key] !== undefined ? this[key] :
             this[key] = computer.call(this);
    };
  }
  utils.cachedProperty = cachedProperty;

  function parseBytes(bytes) {
    return typeof bytes === 'string' ? utils.toArray(bytes, 'hex') :
                                       bytes;
  }
  utils.parseBytes = parseBytes;

  function intFromLE(bytes) {
    return new bn(bytes, 'hex', 'le');
  }
  utils.intFromLE = intFromLE;
  });

  var r;

  var brorand = function rand(len) {
    if (!r)
      r = new Rand(null);

    return r.generate(len);
  };

  function Rand(rand) {
    this.rand = rand;
  }
  var Rand_1 = Rand;

  Rand.prototype.generate = function generate(len) {
    return this._rand(len);
  };

  // Emulate crypto API using randy
  Rand.prototype._rand = function _rand(n) {
    if (this.rand.getBytes)
      return this.rand.getBytes(n);

    var res = new Uint8Array(n);
    for (var i = 0; i < res.length; i++)
      res[i] = this.rand.getByte();
    return res;
  };

  if (typeof self === 'object') {
    if (self.crypto && self.crypto.getRandomValues) {
      // Modern browsers
      Rand.prototype._rand = function _rand(n) {
        var arr = new Uint8Array(n);
        self.crypto.getRandomValues(arr);
        return arr;
      };
    } else if (self.msCrypto && self.msCrypto.getRandomValues) {
      // IE
      Rand.prototype._rand = function _rand(n) {
        var arr = new Uint8Array(n);
        self.msCrypto.getRandomValues(arr);
        return arr;
      };

    // Safari's WebWorkers do not have `crypto`
    } else if (typeof window === 'object') {
      // Old junk
      Rand.prototype._rand = function() {
        throw new Error('Not implemented yet');
      };
    }
  } else {
    // Node.js or Web worker with no crypto support
    try {
      var crypto = crypto$1;
      if (typeof crypto.randomBytes !== 'function')
        throw new Error('Not supported');

      Rand.prototype._rand = function _rand(n) {
        return crypto.randomBytes(n);
      };
    } catch (e) {
    }
  }
  brorand.Rand = Rand_1;

  var utils = elliptic_1.utils;
  var getNAF = utils.getNAF;
  var getJSF = utils.getJSF;
  var assert$1 = utils.assert;

  function BaseCurve(type, conf) {
    this.type = type;
    this.p = new bn(conf.p, 16);

    // Use Montgomery, when there is no fast reduction for the prime
    this.red = conf.prime ? bn.red(conf.prime) : bn.mont(this.p);

    // Useful for many curves
    this.zero = new bn(0).toRed(this.red);
    this.one = new bn(1).toRed(this.red);
    this.two = new bn(2).toRed(this.red);

    // Curve configuration, optional
    this.n = conf.n && new bn(conf.n, 16);
    this.g = conf.g && this.pointFromJSON(conf.g, conf.gRed);

    // Temporary arrays
    this._wnafT1 = new Array(4);
    this._wnafT2 = new Array(4);
    this._wnafT3 = new Array(4);
    this._wnafT4 = new Array(4);

    // Generalized Greg Maxwell's trick
    var adjustCount = this.n && this.p.div(this.n);
    if (!adjustCount || adjustCount.cmpn(100) > 0) {
      this.redN = null;
    } else {
      this._maxwellTrick = true;
      this.redN = this.n.toRed(this.red);
    }
  }
  var base$1 = BaseCurve;

  BaseCurve.prototype.point = function point() {
    throw new Error('Not implemented');
  };

  BaseCurve.prototype.validate = function validate() {
    throw new Error('Not implemented');
  };

  BaseCurve.prototype._fixedNafMul = function _fixedNafMul(p, k) {
    assert$1(p.precomputed);
    var doubles = p._getDoubles();

    var naf = getNAF(k, 1);
    var I = (1 << (doubles.step + 1)) - (doubles.step % 2 === 0 ? 2 : 1);
    I /= 3;

    // Translate into more windowed form
    var repr = [];
    for (var j = 0; j < naf.length; j += doubles.step) {
      var nafW = 0;
      for (var k = j + doubles.step - 1; k >= j; k--)
        nafW = (nafW << 1) + naf[k];
      repr.push(nafW);
    }

    var a = this.jpoint(null, null, null);
    var b = this.jpoint(null, null, null);
    for (var i = I; i > 0; i--) {
      for (var j = 0; j < repr.length; j++) {
        var nafW = repr[j];
        if (nafW === i)
          b = b.mixedAdd(doubles.points[j]);
        else if (nafW === -i)
          b = b.mixedAdd(doubles.points[j].neg());
      }
      a = a.add(b);
    }
    return a.toP();
  };

  BaseCurve.prototype._wnafMul = function _wnafMul(p, k) {
    var w = 4;

    // Precompute window
    var nafPoints = p._getNAFPoints(w);
    w = nafPoints.wnd;
    var wnd = nafPoints.points;

    // Get NAF form
    var naf = getNAF(k, w);

    // Add `this`*(N+1) for every w-NAF index
    var acc = this.jpoint(null, null, null);
    for (var i = naf.length - 1; i >= 0; i--) {
      // Count zeroes
      for (var k = 0; i >= 0 && naf[i] === 0; i--)
        k++;
      if (i >= 0)
        k++;
      acc = acc.dblp(k);

      if (i < 0)
        break;
      var z = naf[i];
      assert$1(z !== 0);
      if (p.type === 'affine') {
        // J +- P
        if (z > 0)
          acc = acc.mixedAdd(wnd[(z - 1) >> 1]);
        else
          acc = acc.mixedAdd(wnd[(-z - 1) >> 1].neg());
      } else {
        // J +- J
        if (z > 0)
          acc = acc.add(wnd[(z - 1) >> 1]);
        else
          acc = acc.add(wnd[(-z - 1) >> 1].neg());
      }
    }
    return p.type === 'affine' ? acc.toP() : acc;
  };

  BaseCurve.prototype._wnafMulAdd = function _wnafMulAdd(defW,
                                                         points,
                                                         coeffs,
                                                         len,
                                                         jacobianResult) {
    var wndWidth = this._wnafT1;
    var wnd = this._wnafT2;
    var naf = this._wnafT3;

    // Fill all arrays
    var max = 0;
    for (var i = 0; i < len; i++) {
      var p = points[i];
      var nafPoints = p._getNAFPoints(defW);
      wndWidth[i] = nafPoints.wnd;
      wnd[i] = nafPoints.points;
    }

    // Comb small window NAFs
    for (var i = len - 1; i >= 1; i -= 2) {
      var a = i - 1;
      var b = i;
      if (wndWidth[a] !== 1 || wndWidth[b] !== 1) {
        naf[a] = getNAF(coeffs[a], wndWidth[a]);
        naf[b] = getNAF(coeffs[b], wndWidth[b]);
        max = Math.max(naf[a].length, max);
        max = Math.max(naf[b].length, max);
        continue;
      }

      var comb = [
        points[a], /* 1 */
        null, /* 3 */
        null, /* 5 */
        points[b] /* 7 */
      ];

      // Try to avoid Projective points, if possible
      if (points[a].y.cmp(points[b].y) === 0) {
        comb[1] = points[a].add(points[b]);
        comb[2] = points[a].toJ().mixedAdd(points[b].neg());
      } else if (points[a].y.cmp(points[b].y.redNeg()) === 0) {
        comb[1] = points[a].toJ().mixedAdd(points[b]);
        comb[2] = points[a].add(points[b].neg());
      } else {
        comb[1] = points[a].toJ().mixedAdd(points[b]);
        comb[2] = points[a].toJ().mixedAdd(points[b].neg());
      }

      var index = [
        -3, /* -1 -1 */
        -1, /* -1 0 */
        -5, /* -1 1 */
        -7, /* 0 -1 */
        0, /* 0 0 */
        7, /* 0 1 */
        5, /* 1 -1 */
        1, /* 1 0 */
        3  /* 1 1 */
      ];

      var jsf = getJSF(coeffs[a], coeffs[b]);
      max = Math.max(jsf[0].length, max);
      naf[a] = new Array(max);
      naf[b] = new Array(max);
      for (var j = 0; j < max; j++) {
        var ja = jsf[0][j] | 0;
        var jb = jsf[1][j] | 0;

        naf[a][j] = index[(ja + 1) * 3 + (jb + 1)];
        naf[b][j] = 0;
        wnd[a] = comb;
      }
    }

    var acc = this.jpoint(null, null, null);
    var tmp = this._wnafT4;
    for (var i = max; i >= 0; i--) {
      var k = 0;

      while (i >= 0) {
        var zero = true;
        for (var j = 0; j < len; j++) {
          tmp[j] = naf[j][i] | 0;
          if (tmp[j] !== 0)
            zero = false;
        }
        if (!zero)
          break;
        k++;
        i--;
      }
      if (i >= 0)
        k++;
      acc = acc.dblp(k);
      if (i < 0)
        break;

      for (var j = 0; j < len; j++) {
        var z = tmp[j];
        var p;
        if (z === 0)
          continue;
        else if (z > 0)
          p = wnd[j][(z - 1) >> 1];
        else if (z < 0)
          p = wnd[j][(-z - 1) >> 1].neg();

        if (p.type === 'affine')
          acc = acc.mixedAdd(p);
        else
          acc = acc.add(p);
      }
    }
    // Zeroify references
    for (var i = 0; i < len; i++)
      wnd[i] = null;

    if (jacobianResult)
      return acc;
    else
      return acc.toP();
  };

  function BasePoint(curve, type) {
    this.curve = curve;
    this.type = type;
    this.precomputed = null;
  }
  BaseCurve.BasePoint = BasePoint;

  BasePoint.prototype.eq = function eq(/*other*/) {
    throw new Error('Not implemented');
  };

  BasePoint.prototype.validate = function validate() {
    return this.curve.validate(this);
  };

  BaseCurve.prototype.decodePoint = function decodePoint(bytes, enc) {
    bytes = utils.toArray(bytes, enc);

    var len = this.p.byteLength();

    // uncompressed, hybrid-odd, hybrid-even
    if ((bytes[0] === 0x04 || bytes[0] === 0x06 || bytes[0] === 0x07) &&
        bytes.length - 1 === 2 * len) {
      if (bytes[0] === 0x06)
        assert$1(bytes[bytes.length - 1] % 2 === 0);
      else if (bytes[0] === 0x07)
        assert$1(bytes[bytes.length - 1] % 2 === 1);

      var res =  this.point(bytes.slice(1, 1 + len),
                            bytes.slice(1 + len, 1 + 2 * len));

      return res;
    } else if ((bytes[0] === 0x02 || bytes[0] === 0x03) &&
                bytes.length - 1 === len) {
      return this.pointFromX(bytes.slice(1, 1 + len), bytes[0] === 0x03);
    }
    throw new Error('Unknown point format');
  };

  BasePoint.prototype.encodeCompressed = function encodeCompressed(enc) {
    return this.encode(enc, true);
  };

  BasePoint.prototype._encode = function _encode(compact) {
    var len = this.curve.p.byteLength();
    var x = this.getX().toArray('be', len);

    if (compact)
      return [ this.getY().isEven() ? 0x02 : 0x03 ].concat(x);

    return [ 0x04 ].concat(x, this.getY().toArray('be', len)) ;
  };

  BasePoint.prototype.encode = function encode(enc, compact) {
    return utils.encode(this._encode(compact), enc);
  };

  BasePoint.prototype.precompute = function precompute(power) {
    if (this.precomputed)
      return this;

    var precomputed = {
      doubles: null,
      naf: null,
      beta: null
    };
    precomputed.naf = this._getNAFPoints(8);
    precomputed.doubles = this._getDoubles(4, power);
    precomputed.beta = this._getBeta();
    this.precomputed = precomputed;

    return this;
  };

  BasePoint.prototype._hasDoubles = function _hasDoubles(k) {
    if (!this.precomputed)
      return false;

    var doubles = this.precomputed.doubles;
    if (!doubles)
      return false;

    return doubles.points.length >= Math.ceil((k.bitLength() + 1) / doubles.step);
  };

  BasePoint.prototype._getDoubles = function _getDoubles(step, power) {
    if (this.precomputed && this.precomputed.doubles)
      return this.precomputed.doubles;

    var doubles = [ this ];
    var acc = this;
    for (var i = 0; i < power; i += step) {
      for (var j = 0; j < step; j++)
        acc = acc.dbl();
      doubles.push(acc);
    }
    return {
      step: step,
      points: doubles
    };
  };

  BasePoint.prototype._getNAFPoints = function _getNAFPoints(wnd) {
    if (this.precomputed && this.precomputed.naf)
      return this.precomputed.naf;

    var res = [ this ];
    var max = (1 << wnd) - 1;
    var dbl = max === 1 ? null : this.dbl();
    for (var i = 1; i < max; i++)
      res[i] = res[i - 1].add(dbl);
    return {
      wnd: wnd,
      points: res
    };
  };

  BasePoint.prototype._getBeta = function _getBeta() {
    return null;
  };

  BasePoint.prototype.dblp = function dblp(k) {
    var r = this;
    for (var i = 0; i < k; i++)
      r = r.dbl();
    return r;
  };

  var inherits_browser = createCommonjsModule(function (module) {
  if (typeof Object.create === 'function') {
    // implementation from standard node.js 'util' module
    module.exports = function inherits(ctor, superCtor) {
      ctor.super_ = superCtor;
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
    };
  } else {
    // old school shim for old browsers
    module.exports = function inherits(ctor, superCtor) {
      ctor.super_ = superCtor;
      var TempCtor = function () {};
      TempCtor.prototype = superCtor.prototype;
      ctor.prototype = new TempCtor();
      ctor.prototype.constructor = ctor;
    };
  }
  });

  var inherits = createCommonjsModule(function (module) {
  try {
    var util$1 = util;
    if (typeof util$1.inherits !== 'function') throw '';
    module.exports = util$1.inherits;
  } catch (e) {
    module.exports = inherits_browser;
  }
  });

  var Base = curve_1.base;

  var assert$2 = elliptic_1.utils.assert;

  function ShortCurve(conf) {
    Base.call(this, 'short', conf);

    this.a = new bn(conf.a, 16).toRed(this.red);
    this.b = new bn(conf.b, 16).toRed(this.red);
    this.tinv = this.two.redInvm();

    this.zeroA = this.a.fromRed().cmpn(0) === 0;
    this.threeA = this.a.fromRed().sub(this.p).cmpn(-3) === 0;

    // If the curve is endomorphic, precalculate beta and lambda
    this.endo = this._getEndomorphism(conf);
    this._endoWnafT1 = new Array(4);
    this._endoWnafT2 = new Array(4);
  }
  inherits(ShortCurve, Base);
  var short_1 = ShortCurve;

  ShortCurve.prototype._getEndomorphism = function _getEndomorphism(conf) {
    // No efficient endomorphism
    if (!this.zeroA || !this.g || !this.n || this.p.modn(3) !== 1)
      return;

    // Compute beta and lambda, that lambda * P = (beta * Px; Py)
    var beta;
    var lambda;
    if (conf.beta) {
      beta = new bn(conf.beta, 16).toRed(this.red);
    } else {
      var betas = this._getEndoRoots(this.p);
      // Choose the smallest beta
      beta = betas[0].cmp(betas[1]) < 0 ? betas[0] : betas[1];
      beta = beta.toRed(this.red);
    }
    if (conf.lambda) {
      lambda = new bn(conf.lambda, 16);
    } else {
      // Choose the lambda that is matching selected beta
      var lambdas = this._getEndoRoots(this.n);
      if (this.g.mul(lambdas[0]).x.cmp(this.g.x.redMul(beta)) === 0) {
        lambda = lambdas[0];
      } else {
        lambda = lambdas[1];
        assert$2(this.g.mul(lambda).x.cmp(this.g.x.redMul(beta)) === 0);
      }
    }

    // Get basis vectors, used for balanced length-two representation
    var basis;
    if (conf.basis) {
      basis = conf.basis.map(function(vec) {
        return {
          a: new bn(vec.a, 16),
          b: new bn(vec.b, 16)
        };
      });
    } else {
      basis = this._getEndoBasis(lambda);
    }

    return {
      beta: beta,
      lambda: lambda,
      basis: basis
    };
  };

  ShortCurve.prototype._getEndoRoots = function _getEndoRoots(num) {
    // Find roots of for x^2 + x + 1 in F
    // Root = (-1 +- Sqrt(-3)) / 2
    //
    var red = num === this.p ? this.red : bn.mont(num);
    var tinv = new bn(2).toRed(red).redInvm();
    var ntinv = tinv.redNeg();

    var s = new bn(3).toRed(red).redNeg().redSqrt().redMul(tinv);

    var l1 = ntinv.redAdd(s).fromRed();
    var l2 = ntinv.redSub(s).fromRed();
    return [ l1, l2 ];
  };

  ShortCurve.prototype._getEndoBasis = function _getEndoBasis(lambda) {
    // aprxSqrt >= sqrt(this.n)
    var aprxSqrt = this.n.ushrn(Math.floor(this.n.bitLength() / 2));

    // 3.74
    // Run EGCD, until r(L + 1) < aprxSqrt
    var u = lambda;
    var v = this.n.clone();
    var x1 = new bn(1);
    var y1 = new bn(0);
    var x2 = new bn(0);
    var y2 = new bn(1);

    // NOTE: all vectors are roots of: a + b * lambda = 0 (mod n)
    var a0;
    var b0;
    // First vector
    var a1;
    var b1;
    // Second vector
    var a2;
    var b2;

    var prevR;
    var i = 0;
    var r;
    var x;
    while (u.cmpn(0) !== 0) {
      var q = v.div(u);
      r = v.sub(q.mul(u));
      x = x2.sub(q.mul(x1));
      var y = y2.sub(q.mul(y1));

      if (!a1 && r.cmp(aprxSqrt) < 0) {
        a0 = prevR.neg();
        b0 = x1;
        a1 = r.neg();
        b1 = x;
      } else if (a1 && ++i === 2) {
        break;
      }
      prevR = r;

      v = u;
      u = r;
      x2 = x1;
      x1 = x;
      y2 = y1;
      y1 = y;
    }
    a2 = r.neg();
    b2 = x;

    var len1 = a1.sqr().add(b1.sqr());
    var len2 = a2.sqr().add(b2.sqr());
    if (len2.cmp(len1) >= 0) {
      a2 = a0;
      b2 = b0;
    }

    // Normalize signs
    if (a1.negative) {
      a1 = a1.neg();
      b1 = b1.neg();
    }
    if (a2.negative) {
      a2 = a2.neg();
      b2 = b2.neg();
    }

    return [
      { a: a1, b: b1 },
      { a: a2, b: b2 }
    ];
  };

  ShortCurve.prototype._endoSplit = function _endoSplit(k) {
    var basis = this.endo.basis;
    var v1 = basis[0];
    var v2 = basis[1];

    var c1 = v2.b.mul(k).divRound(this.n);
    var c2 = v1.b.neg().mul(k).divRound(this.n);

    var p1 = c1.mul(v1.a);
    var p2 = c2.mul(v2.a);
    var q1 = c1.mul(v1.b);
    var q2 = c2.mul(v2.b);

    // Calculate answer
    var k1 = k.sub(p1).sub(p2);
    var k2 = q1.add(q2).neg();
    return { k1: k1, k2: k2 };
  };

  ShortCurve.prototype.pointFromX = function pointFromX(x, odd) {
    x = new bn(x, 16);
    if (!x.red)
      x = x.toRed(this.red);

    var y2 = x.redSqr().redMul(x).redIAdd(x.redMul(this.a)).redIAdd(this.b);
    var y = y2.redSqrt();
    if (y.redSqr().redSub(y2).cmp(this.zero) !== 0)
      throw new Error('invalid point');

    // XXX Is there any way to tell if the number is odd without converting it
    // to non-red form?
    var isOdd = y.fromRed().isOdd();
    if (odd && !isOdd || !odd && isOdd)
      y = y.redNeg();

    return this.point(x, y);
  };

  ShortCurve.prototype.validate = function validate(point) {
    if (point.inf)
      return true;

    var x = point.x;
    var y = point.y;

    var ax = this.a.redMul(x);
    var rhs = x.redSqr().redMul(x).redIAdd(ax).redIAdd(this.b);
    return y.redSqr().redISub(rhs).cmpn(0) === 0;
  };

  ShortCurve.prototype._endoWnafMulAdd =
      function _endoWnafMulAdd(points, coeffs, jacobianResult) {
    var npoints = this._endoWnafT1;
    var ncoeffs = this._endoWnafT2;
    for (var i = 0; i < points.length; i++) {
      var split = this._endoSplit(coeffs[i]);
      var p = points[i];
      var beta = p._getBeta();

      if (split.k1.negative) {
        split.k1.ineg();
        p = p.neg(true);
      }
      if (split.k2.negative) {
        split.k2.ineg();
        beta = beta.neg(true);
      }

      npoints[i * 2] = p;
      npoints[i * 2 + 1] = beta;
      ncoeffs[i * 2] = split.k1;
      ncoeffs[i * 2 + 1] = split.k2;
    }
    var res = this._wnafMulAdd(1, npoints, ncoeffs, i * 2, jacobianResult);

    // Clean-up references to points and coefficients
    for (var j = 0; j < i * 2; j++) {
      npoints[j] = null;
      ncoeffs[j] = null;
    }
    return res;
  };

  function Point(curve, x, y, isRed) {
    Base.BasePoint.call(this, curve, 'affine');
    if (x === null && y === null) {
      this.x = null;
      this.y = null;
      this.inf = true;
    } else {
      this.x = new bn(x, 16);
      this.y = new bn(y, 16);
      // Force redgomery representation when loading from JSON
      if (isRed) {
        this.x.forceRed(this.curve.red);
        this.y.forceRed(this.curve.red);
      }
      if (!this.x.red)
        this.x = this.x.toRed(this.curve.red);
      if (!this.y.red)
        this.y = this.y.toRed(this.curve.red);
      this.inf = false;
    }
  }
  inherits(Point, Base.BasePoint);

  ShortCurve.prototype.point = function point(x, y, isRed) {
    return new Point(this, x, y, isRed);
  };

  ShortCurve.prototype.pointFromJSON = function pointFromJSON(obj, red) {
    return Point.fromJSON(this, obj, red);
  };

  Point.prototype._getBeta = function _getBeta() {
    if (!this.curve.endo)
      return;

    var pre = this.precomputed;
    if (pre && pre.beta)
      return pre.beta;

    var beta = this.curve.point(this.x.redMul(this.curve.endo.beta), this.y);
    if (pre) {
      var curve = this.curve;
      var endoMul = function(p) {
        return curve.point(p.x.redMul(curve.endo.beta), p.y);
      };
      pre.beta = beta;
      beta.precomputed = {
        beta: null,
        naf: pre.naf && {
          wnd: pre.naf.wnd,
          points: pre.naf.points.map(endoMul)
        },
        doubles: pre.doubles && {
          step: pre.doubles.step,
          points: pre.doubles.points.map(endoMul)
        }
      };
    }
    return beta;
  };

  Point.prototype.toJSON = function toJSON() {
    if (!this.precomputed)
      return [ this.x, this.y ];

    return [ this.x, this.y, this.precomputed && {
      doubles: this.precomputed.doubles && {
        step: this.precomputed.doubles.step,
        points: this.precomputed.doubles.points.slice(1)
      },
      naf: this.precomputed.naf && {
        wnd: this.precomputed.naf.wnd,
        points: this.precomputed.naf.points.slice(1)
      }
    } ];
  };

  Point.fromJSON = function fromJSON(curve, obj, red) {
    if (typeof obj === 'string')
      obj = JSON.parse(obj);
    var res = curve.point(obj[0], obj[1], red);
    if (!obj[2])
      return res;

    function obj2point(obj) {
      return curve.point(obj[0], obj[1], red);
    }

    var pre = obj[2];
    res.precomputed = {
      beta: null,
      doubles: pre.doubles && {
        step: pre.doubles.step,
        points: [ res ].concat(pre.doubles.points.map(obj2point))
      },
      naf: pre.naf && {
        wnd: pre.naf.wnd,
        points: [ res ].concat(pre.naf.points.map(obj2point))
      }
    };
    return res;
  };

  Point.prototype.inspect = function inspect() {
    if (this.isInfinity())
      return '<EC Point Infinity>';
    return '<EC Point x: ' + this.x.fromRed().toString(16, 2) +
        ' y: ' + this.y.fromRed().toString(16, 2) + '>';
  };

  Point.prototype.isInfinity = function isInfinity() {
    return this.inf;
  };

  Point.prototype.add = function add(p) {
    // O + P = P
    if (this.inf)
      return p;

    // P + O = P
    if (p.inf)
      return this;

    // P + P = 2P
    if (this.eq(p))
      return this.dbl();

    // P + (-P) = O
    if (this.neg().eq(p))
      return this.curve.point(null, null);

    // P + Q = O
    if (this.x.cmp(p.x) === 0)
      return this.curve.point(null, null);

    var c = this.y.redSub(p.y);
    if (c.cmpn(0) !== 0)
      c = c.redMul(this.x.redSub(p.x).redInvm());
    var nx = c.redSqr().redISub(this.x).redISub(p.x);
    var ny = c.redMul(this.x.redSub(nx)).redISub(this.y);
    return this.curve.point(nx, ny);
  };

  Point.prototype.dbl = function dbl() {
    if (this.inf)
      return this;

    // 2P = O
    var ys1 = this.y.redAdd(this.y);
    if (ys1.cmpn(0) === 0)
      return this.curve.point(null, null);

    var a = this.curve.a;

    var x2 = this.x.redSqr();
    var dyinv = ys1.redInvm();
    var c = x2.redAdd(x2).redIAdd(x2).redIAdd(a).redMul(dyinv);

    var nx = c.redSqr().redISub(this.x.redAdd(this.x));
    var ny = c.redMul(this.x.redSub(nx)).redISub(this.y);
    return this.curve.point(nx, ny);
  };

  Point.prototype.getX = function getX() {
    return this.x.fromRed();
  };

  Point.prototype.getY = function getY() {
    return this.y.fromRed();
  };

  Point.prototype.mul = function mul(k) {
    k = new bn(k, 16);

    if (this._hasDoubles(k))
      return this.curve._fixedNafMul(this, k);
    else if (this.curve.endo)
      return this.curve._endoWnafMulAdd([ this ], [ k ]);
    else
      return this.curve._wnafMul(this, k);
  };

  Point.prototype.mulAdd = function mulAdd(k1, p2, k2) {
    var points = [ this, p2 ];
    var coeffs = [ k1, k2 ];
    if (this.curve.endo)
      return this.curve._endoWnafMulAdd(points, coeffs);
    else
      return this.curve._wnafMulAdd(1, points, coeffs, 2);
  };

  Point.prototype.jmulAdd = function jmulAdd(k1, p2, k2) {
    var points = [ this, p2 ];
    var coeffs = [ k1, k2 ];
    if (this.curve.endo)
      return this.curve._endoWnafMulAdd(points, coeffs, true);
    else
      return this.curve._wnafMulAdd(1, points, coeffs, 2, true);
  };

  Point.prototype.eq = function eq(p) {
    return this === p ||
           this.inf === p.inf &&
               (this.inf || this.x.cmp(p.x) === 0 && this.y.cmp(p.y) === 0);
  };

  Point.prototype.neg = function neg(_precompute) {
    if (this.inf)
      return this;

    var res = this.curve.point(this.x, this.y.redNeg());
    if (_precompute && this.precomputed) {
      var pre = this.precomputed;
      var negate = function(p) {
        return p.neg();
      };
      res.precomputed = {
        naf: pre.naf && {
          wnd: pre.naf.wnd,
          points: pre.naf.points.map(negate)
        },
        doubles: pre.doubles && {
          step: pre.doubles.step,
          points: pre.doubles.points.map(negate)
        }
      };
    }
    return res;
  };

  Point.prototype.toJ = function toJ() {
    if (this.inf)
      return this.curve.jpoint(null, null, null);

    var res = this.curve.jpoint(this.x, this.y, this.curve.one);
    return res;
  };

  function JPoint(curve, x, y, z) {
    Base.BasePoint.call(this, curve, 'jacobian');
    if (x === null && y === null && z === null) {
      this.x = this.curve.one;
      this.y = this.curve.one;
      this.z = new bn(0);
    } else {
      this.x = new bn(x, 16);
      this.y = new bn(y, 16);
      this.z = new bn(z, 16);
    }
    if (!this.x.red)
      this.x = this.x.toRed(this.curve.red);
    if (!this.y.red)
      this.y = this.y.toRed(this.curve.red);
    if (!this.z.red)
      this.z = this.z.toRed(this.curve.red);

    this.zOne = this.z === this.curve.one;
  }
  inherits(JPoint, Base.BasePoint);

  ShortCurve.prototype.jpoint = function jpoint(x, y, z) {
    return new JPoint(this, x, y, z);
  };

  JPoint.prototype.toP = function toP() {
    if (this.isInfinity())
      return this.curve.point(null, null);

    var zinv = this.z.redInvm();
    var zinv2 = zinv.redSqr();
    var ax = this.x.redMul(zinv2);
    var ay = this.y.redMul(zinv2).redMul(zinv);

    return this.curve.point(ax, ay);
  };

  JPoint.prototype.neg = function neg() {
    return this.curve.jpoint(this.x, this.y.redNeg(), this.z);
  };

  JPoint.prototype.add = function add(p) {
    // O + P = P
    if (this.isInfinity())
      return p;

    // P + O = P
    if (p.isInfinity())
      return this;

    // 12M + 4S + 7A
    var pz2 = p.z.redSqr();
    var z2 = this.z.redSqr();
    var u1 = this.x.redMul(pz2);
    var u2 = p.x.redMul(z2);
    var s1 = this.y.redMul(pz2.redMul(p.z));
    var s2 = p.y.redMul(z2.redMul(this.z));

    var h = u1.redSub(u2);
    var r = s1.redSub(s2);
    if (h.cmpn(0) === 0) {
      if (r.cmpn(0) !== 0)
        return this.curve.jpoint(null, null, null);
      else
        return this.dbl();
    }

    var h2 = h.redSqr();
    var h3 = h2.redMul(h);
    var v = u1.redMul(h2);

    var nx = r.redSqr().redIAdd(h3).redISub(v).redISub(v);
    var ny = r.redMul(v.redISub(nx)).redISub(s1.redMul(h3));
    var nz = this.z.redMul(p.z).redMul(h);

    return this.curve.jpoint(nx, ny, nz);
  };

  JPoint.prototype.mixedAdd = function mixedAdd(p) {
    // O + P = P
    if (this.isInfinity())
      return p.toJ();

    // P + O = P
    if (p.isInfinity())
      return this;

    // 8M + 3S + 7A
    var z2 = this.z.redSqr();
    var u1 = this.x;
    var u2 = p.x.redMul(z2);
    var s1 = this.y;
    var s2 = p.y.redMul(z2).redMul(this.z);

    var h = u1.redSub(u2);
    var r = s1.redSub(s2);
    if (h.cmpn(0) === 0) {
      if (r.cmpn(0) !== 0)
        return this.curve.jpoint(null, null, null);
      else
        return this.dbl();
    }

    var h2 = h.redSqr();
    var h3 = h2.redMul(h);
    var v = u1.redMul(h2);

    var nx = r.redSqr().redIAdd(h3).redISub(v).redISub(v);
    var ny = r.redMul(v.redISub(nx)).redISub(s1.redMul(h3));
    var nz = this.z.redMul(h);

    return this.curve.jpoint(nx, ny, nz);
  };

  JPoint.prototype.dblp = function dblp(pow) {
    if (pow === 0)
      return this;
    if (this.isInfinity())
      return this;
    if (!pow)
      return this.dbl();

    if (this.curve.zeroA || this.curve.threeA) {
      var r = this;
      for (var i = 0; i < pow; i++)
        r = r.dbl();
      return r;
    }

    // 1M + 2S + 1A + N * (4S + 5M + 8A)
    // N = 1 => 6M + 6S + 9A
    var a = this.curve.a;
    var tinv = this.curve.tinv;

    var jx = this.x;
    var jy = this.y;
    var jz = this.z;
    var jz4 = jz.redSqr().redSqr();

    // Reuse results
    var jyd = jy.redAdd(jy);
    for (var i = 0; i < pow; i++) {
      var jx2 = jx.redSqr();
      var jyd2 = jyd.redSqr();
      var jyd4 = jyd2.redSqr();
      var c = jx2.redAdd(jx2).redIAdd(jx2).redIAdd(a.redMul(jz4));

      var t1 = jx.redMul(jyd2);
      var nx = c.redSqr().redISub(t1.redAdd(t1));
      var t2 = t1.redISub(nx);
      var dny = c.redMul(t2);
      dny = dny.redIAdd(dny).redISub(jyd4);
      var nz = jyd.redMul(jz);
      if (i + 1 < pow)
        jz4 = jz4.redMul(jyd4);

      jx = nx;
      jz = nz;
      jyd = dny;
    }

    return this.curve.jpoint(jx, jyd.redMul(tinv), jz);
  };

  JPoint.prototype.dbl = function dbl() {
    if (this.isInfinity())
      return this;

    if (this.curve.zeroA)
      return this._zeroDbl();
    else if (this.curve.threeA)
      return this._threeDbl();
    else
      return this._dbl();
  };

  JPoint.prototype._zeroDbl = function _zeroDbl() {
    var nx;
    var ny;
    var nz;
    // Z = 1
    if (this.zOne) {
      // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-0.html
      //     #doubling-mdbl-2007-bl
      // 1M + 5S + 14A

      // XX = X1^2
      var xx = this.x.redSqr();
      // YY = Y1^2
      var yy = this.y.redSqr();
      // YYYY = YY^2
      var yyyy = yy.redSqr();
      // S = 2 * ((X1 + YY)^2 - XX - YYYY)
      var s = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
      s = s.redIAdd(s);
      // M = 3 * XX + a; a = 0
      var m = xx.redAdd(xx).redIAdd(xx);
      // T = M ^ 2 - 2*S
      var t = m.redSqr().redISub(s).redISub(s);

      // 8 * YYYY
      var yyyy8 = yyyy.redIAdd(yyyy);
      yyyy8 = yyyy8.redIAdd(yyyy8);
      yyyy8 = yyyy8.redIAdd(yyyy8);

      // X3 = T
      nx = t;
      // Y3 = M * (S - T) - 8 * YYYY
      ny = m.redMul(s.redISub(t)).redISub(yyyy8);
      // Z3 = 2*Y1
      nz = this.y.redAdd(this.y);
    } else {
      // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-0.html
      //     #doubling-dbl-2009-l
      // 2M + 5S + 13A

      // A = X1^2
      var a = this.x.redSqr();
      // B = Y1^2
      var b = this.y.redSqr();
      // C = B^2
      var c = b.redSqr();
      // D = 2 * ((X1 + B)^2 - A - C)
      var d = this.x.redAdd(b).redSqr().redISub(a).redISub(c);
      d = d.redIAdd(d);
      // E = 3 * A
      var e = a.redAdd(a).redIAdd(a);
      // F = E^2
      var f = e.redSqr();

      // 8 * C
      var c8 = c.redIAdd(c);
      c8 = c8.redIAdd(c8);
      c8 = c8.redIAdd(c8);

      // X3 = F - 2 * D
      nx = f.redISub(d).redISub(d);
      // Y3 = E * (D - X3) - 8 * C
      ny = e.redMul(d.redISub(nx)).redISub(c8);
      // Z3 = 2 * Y1 * Z1
      nz = this.y.redMul(this.z);
      nz = nz.redIAdd(nz);
    }

    return this.curve.jpoint(nx, ny, nz);
  };

  JPoint.prototype._threeDbl = function _threeDbl() {
    var nx;
    var ny;
    var nz;
    // Z = 1
    if (this.zOne) {
      // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-3.html
      //     #doubling-mdbl-2007-bl
      // 1M + 5S + 15A

      // XX = X1^2
      var xx = this.x.redSqr();
      // YY = Y1^2
      var yy = this.y.redSqr();
      // YYYY = YY^2
      var yyyy = yy.redSqr();
      // S = 2 * ((X1 + YY)^2 - XX - YYYY)
      var s = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
      s = s.redIAdd(s);
      // M = 3 * XX + a
      var m = xx.redAdd(xx).redIAdd(xx).redIAdd(this.curve.a);
      // T = M^2 - 2 * S
      var t = m.redSqr().redISub(s).redISub(s);
      // X3 = T
      nx = t;
      // Y3 = M * (S - T) - 8 * YYYY
      var yyyy8 = yyyy.redIAdd(yyyy);
      yyyy8 = yyyy8.redIAdd(yyyy8);
      yyyy8 = yyyy8.redIAdd(yyyy8);
      ny = m.redMul(s.redISub(t)).redISub(yyyy8);
      // Z3 = 2 * Y1
      nz = this.y.redAdd(this.y);
    } else {
      // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-3.html#doubling-dbl-2001-b
      // 3M + 5S

      // delta = Z1^2
      var delta = this.z.redSqr();
      // gamma = Y1^2
      var gamma = this.y.redSqr();
      // beta = X1 * gamma
      var beta = this.x.redMul(gamma);
      // alpha = 3 * (X1 - delta) * (X1 + delta)
      var alpha = this.x.redSub(delta).redMul(this.x.redAdd(delta));
      alpha = alpha.redAdd(alpha).redIAdd(alpha);
      // X3 = alpha^2 - 8 * beta
      var beta4 = beta.redIAdd(beta);
      beta4 = beta4.redIAdd(beta4);
      var beta8 = beta4.redAdd(beta4);
      nx = alpha.redSqr().redISub(beta8);
      // Z3 = (Y1 + Z1)^2 - gamma - delta
      nz = this.y.redAdd(this.z).redSqr().redISub(gamma).redISub(delta);
      // Y3 = alpha * (4 * beta - X3) - 8 * gamma^2
      var ggamma8 = gamma.redSqr();
      ggamma8 = ggamma8.redIAdd(ggamma8);
      ggamma8 = ggamma8.redIAdd(ggamma8);
      ggamma8 = ggamma8.redIAdd(ggamma8);
      ny = alpha.redMul(beta4.redISub(nx)).redISub(ggamma8);
    }

    return this.curve.jpoint(nx, ny, nz);
  };

  JPoint.prototype._dbl = function _dbl() {
    var a = this.curve.a;

    // 4M + 6S + 10A
    var jx = this.x;
    var jy = this.y;
    var jz = this.z;
    var jz4 = jz.redSqr().redSqr();

    var jx2 = jx.redSqr();
    var jy2 = jy.redSqr();

    var c = jx2.redAdd(jx2).redIAdd(jx2).redIAdd(a.redMul(jz4));

    var jxd4 = jx.redAdd(jx);
    jxd4 = jxd4.redIAdd(jxd4);
    var t1 = jxd4.redMul(jy2);
    var nx = c.redSqr().redISub(t1.redAdd(t1));
    var t2 = t1.redISub(nx);

    var jyd8 = jy2.redSqr();
    jyd8 = jyd8.redIAdd(jyd8);
    jyd8 = jyd8.redIAdd(jyd8);
    jyd8 = jyd8.redIAdd(jyd8);
    var ny = c.redMul(t2).redISub(jyd8);
    var nz = jy.redAdd(jy).redMul(jz);

    return this.curve.jpoint(nx, ny, nz);
  };

  JPoint.prototype.trpl = function trpl() {
    if (!this.curve.zeroA)
      return this.dbl().add(this);

    // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-0.html#tripling-tpl-2007-bl
    // 5M + 10S + ...

    // XX = X1^2
    var xx = this.x.redSqr();
    // YY = Y1^2
    var yy = this.y.redSqr();
    // ZZ = Z1^2
    var zz = this.z.redSqr();
    // YYYY = YY^2
    var yyyy = yy.redSqr();
    // M = 3 * XX + a * ZZ2; a = 0
    var m = xx.redAdd(xx).redIAdd(xx);
    // MM = M^2
    var mm = m.redSqr();
    // E = 6 * ((X1 + YY)^2 - XX - YYYY) - MM
    var e = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
    e = e.redIAdd(e);
    e = e.redAdd(e).redIAdd(e);
    e = e.redISub(mm);
    // EE = E^2
    var ee = e.redSqr();
    // T = 16*YYYY
    var t = yyyy.redIAdd(yyyy);
    t = t.redIAdd(t);
    t = t.redIAdd(t);
    t = t.redIAdd(t);
    // U = (M + E)^2 - MM - EE - T
    var u = m.redIAdd(e).redSqr().redISub(mm).redISub(ee).redISub(t);
    // X3 = 4 * (X1 * EE - 4 * YY * U)
    var yyu4 = yy.redMul(u);
    yyu4 = yyu4.redIAdd(yyu4);
    yyu4 = yyu4.redIAdd(yyu4);
    var nx = this.x.redMul(ee).redISub(yyu4);
    nx = nx.redIAdd(nx);
    nx = nx.redIAdd(nx);
    // Y3 = 8 * Y1 * (U * (T - U) - E * EE)
    var ny = this.y.redMul(u.redMul(t.redISub(u)).redISub(e.redMul(ee)));
    ny = ny.redIAdd(ny);
    ny = ny.redIAdd(ny);
    ny = ny.redIAdd(ny);
    // Z3 = (Z1 + E)^2 - ZZ - EE
    var nz = this.z.redAdd(e).redSqr().redISub(zz).redISub(ee);

    return this.curve.jpoint(nx, ny, nz);
  };

  JPoint.prototype.mul = function mul(k, kbase) {
    k = new bn(k, kbase);

    return this.curve._wnafMul(this, k);
  };

  JPoint.prototype.eq = function eq(p) {
    if (p.type === 'affine')
      return this.eq(p.toJ());

    if (this === p)
      return true;

    // x1 * z2^2 == x2 * z1^2
    var z2 = this.z.redSqr();
    var pz2 = p.z.redSqr();
    if (this.x.redMul(pz2).redISub(p.x.redMul(z2)).cmpn(0) !== 0)
      return false;

    // y1 * z2^3 == y2 * z1^3
    var z3 = z2.redMul(this.z);
    var pz3 = pz2.redMul(p.z);
    return this.y.redMul(pz3).redISub(p.y.redMul(z3)).cmpn(0) === 0;
  };

  JPoint.prototype.eqXToP = function eqXToP(x) {
    var zs = this.z.redSqr();
    var rx = x.toRed(this.curve.red).redMul(zs);
    if (this.x.cmp(rx) === 0)
      return true;

    var xc = x.clone();
    var t = this.curve.redN.redMul(zs);
    for (;;) {
      xc.iadd(this.curve.n);
      if (xc.cmp(this.curve.p) >= 0)
        return false;

      rx.redIAdd(t);
      if (this.x.cmp(rx) === 0)
        return true;
    }
  };

  JPoint.prototype.inspect = function inspect() {
    if (this.isInfinity())
      return '<EC JPoint Infinity>';
    return '<EC JPoint x: ' + this.x.toString(16, 2) +
        ' y: ' + this.y.toString(16, 2) +
        ' z: ' + this.z.toString(16, 2) + '>';
  };

  JPoint.prototype.isInfinity = function isInfinity() {
    // XXX This code assumes that zero is always zero in red
    return this.z.cmpn(0) === 0;
  };

  var Base$1 = curve_1.base;


  var utils$1 = elliptic_1.utils;

  function MontCurve(conf) {
    Base$1.call(this, 'mont', conf);

    this.a = new bn(conf.a, 16).toRed(this.red);
    this.b = new bn(conf.b, 16).toRed(this.red);
    this.i4 = new bn(4).toRed(this.red).redInvm();
    this.two = new bn(2).toRed(this.red);
    this.a24 = this.i4.redMul(this.a.redAdd(this.two));
  }
  inherits(MontCurve, Base$1);
  var mont = MontCurve;

  MontCurve.prototype.validate = function validate(point) {
    var x = point.normalize().x;
    var x2 = x.redSqr();
    var rhs = x2.redMul(x).redAdd(x2.redMul(this.a)).redAdd(x);
    var y = rhs.redSqrt();

    return y.redSqr().cmp(rhs) === 0;
  };

  function Point$1(curve, x, z) {
    Base$1.BasePoint.call(this, curve, 'projective');
    if (x === null && z === null) {
      this.x = this.curve.one;
      this.z = this.curve.zero;
    } else {
      this.x = new bn(x, 16);
      this.z = new bn(z, 16);
      if (!this.x.red)
        this.x = this.x.toRed(this.curve.red);
      if (!this.z.red)
        this.z = this.z.toRed(this.curve.red);
    }
  }
  inherits(Point$1, Base$1.BasePoint);

  MontCurve.prototype.decodePoint = function decodePoint(bytes, enc) {
    return this.point(utils$1.toArray(bytes, enc), 1);
  };

  MontCurve.prototype.point = function point(x, z) {
    return new Point$1(this, x, z);
  };

  MontCurve.prototype.pointFromJSON = function pointFromJSON(obj) {
    return Point$1.fromJSON(this, obj);
  };

  Point$1.prototype.precompute = function precompute() {
    // No-op
  };

  Point$1.prototype._encode = function _encode() {
    return this.getX().toArray('be', this.curve.p.byteLength());
  };

  Point$1.fromJSON = function fromJSON(curve, obj) {
    return new Point$1(curve, obj[0], obj[1] || curve.one);
  };

  Point$1.prototype.inspect = function inspect() {
    if (this.isInfinity())
      return '<EC Point Infinity>';
    return '<EC Point x: ' + this.x.fromRed().toString(16, 2) +
        ' z: ' + this.z.fromRed().toString(16, 2) + '>';
  };

  Point$1.prototype.isInfinity = function isInfinity() {
    // XXX This code assumes that zero is always zero in red
    return this.z.cmpn(0) === 0;
  };

  Point$1.prototype.dbl = function dbl() {
    // http://hyperelliptic.org/EFD/g1p/auto-montgom-xz.html#doubling-dbl-1987-m-3
    // 2M + 2S + 4A

    // A = X1 + Z1
    var a = this.x.redAdd(this.z);
    // AA = A^2
    var aa = a.redSqr();
    // B = X1 - Z1
    var b = this.x.redSub(this.z);
    // BB = B^2
    var bb = b.redSqr();
    // C = AA - BB
    var c = aa.redSub(bb);
    // X3 = AA * BB
    var nx = aa.redMul(bb);
    // Z3 = C * (BB + A24 * C)
    var nz = c.redMul(bb.redAdd(this.curve.a24.redMul(c)));
    return this.curve.point(nx, nz);
  };

  Point$1.prototype.add = function add() {
    throw new Error('Not supported on Montgomery curve');
  };

  Point$1.prototype.diffAdd = function diffAdd(p, diff) {
    // http://hyperelliptic.org/EFD/g1p/auto-montgom-xz.html#diffadd-dadd-1987-m-3
    // 4M + 2S + 6A

    // A = X2 + Z2
    var a = this.x.redAdd(this.z);
    // B = X2 - Z2
    var b = this.x.redSub(this.z);
    // C = X3 + Z3
    var c = p.x.redAdd(p.z);
    // D = X3 - Z3
    var d = p.x.redSub(p.z);
    // DA = D * A
    var da = d.redMul(a);
    // CB = C * B
    var cb = c.redMul(b);
    // X5 = Z1 * (DA + CB)^2
    var nx = diff.z.redMul(da.redAdd(cb).redSqr());
    // Z5 = X1 * (DA - CB)^2
    var nz = diff.x.redMul(da.redISub(cb).redSqr());
    return this.curve.point(nx, nz);
  };

  Point$1.prototype.mul = function mul(k) {
    var t = k.clone();
    var a = this; // (N / 2) * Q + Q
    var b = this.curve.point(null, null); // (N / 2) * Q
    var c = this; // Q

    for (var bits = []; t.cmpn(0) !== 0; t.iushrn(1))
      bits.push(t.andln(1));

    for (var i = bits.length - 1; i >= 0; i--) {
      if (bits[i] === 0) {
        // N * Q + Q = ((N / 2) * Q + Q)) + (N / 2) * Q
        a = a.diffAdd(b, c);
        // N * Q = 2 * ((N / 2) * Q + Q))
        b = b.dbl();
      } else {
        // N * Q = ((N / 2) * Q + Q) + ((N / 2) * Q)
        b = a.diffAdd(b, c);
        // N * Q + Q = 2 * ((N / 2) * Q + Q)
        a = a.dbl();
      }
    }
    return b;
  };

  Point$1.prototype.mulAdd = function mulAdd() {
    throw new Error('Not supported on Montgomery curve');
  };

  Point$1.prototype.jumlAdd = function jumlAdd() {
    throw new Error('Not supported on Montgomery curve');
  };

  Point$1.prototype.eq = function eq(other) {
    return this.getX().cmp(other.getX()) === 0;
  };

  Point$1.prototype.normalize = function normalize() {
    this.x = this.x.redMul(this.z.redInvm());
    this.z = this.curve.one;
    return this;
  };

  Point$1.prototype.getX = function getX() {
    // Normalize coordinates
    this.normalize();

    return this.x.fromRed();
  };

  var Base$2 = curve_1.base;

  var assert$3 = elliptic_1.utils.assert;

  function EdwardsCurve(conf) {
    // NOTE: Important as we are creating point in Base.call()
    this.twisted = (conf.a | 0) !== 1;
    this.mOneA = this.twisted && (conf.a | 0) === -1;
    this.extended = this.mOneA;

    Base$2.call(this, 'edwards', conf);

    this.a = new bn(conf.a, 16).umod(this.red.m);
    this.a = this.a.toRed(this.red);
    this.c = new bn(conf.c, 16).toRed(this.red);
    this.c2 = this.c.redSqr();
    this.d = new bn(conf.d, 16).toRed(this.red);
    this.dd = this.d.redAdd(this.d);

    assert$3(!this.twisted || this.c.fromRed().cmpn(1) === 0);
    this.oneC = (conf.c | 0) === 1;
  }
  inherits(EdwardsCurve, Base$2);
  var edwards = EdwardsCurve;

  EdwardsCurve.prototype._mulA = function _mulA(num) {
    if (this.mOneA)
      return num.redNeg();
    else
      return this.a.redMul(num);
  };

  EdwardsCurve.prototype._mulC = function _mulC(num) {
    if (this.oneC)
      return num;
    else
      return this.c.redMul(num);
  };

  // Just for compatibility with Short curve
  EdwardsCurve.prototype.jpoint = function jpoint(x, y, z, t) {
    return this.point(x, y, z, t);
  };

  EdwardsCurve.prototype.pointFromX = function pointFromX(x, odd) {
    x = new bn(x, 16);
    if (!x.red)
      x = x.toRed(this.red);

    var x2 = x.redSqr();
    var rhs = this.c2.redSub(this.a.redMul(x2));
    var lhs = this.one.redSub(this.c2.redMul(this.d).redMul(x2));

    var y2 = rhs.redMul(lhs.redInvm());
    var y = y2.redSqrt();
    if (y.redSqr().redSub(y2).cmp(this.zero) !== 0)
      throw new Error('invalid point');

    var isOdd = y.fromRed().isOdd();
    if (odd && !isOdd || !odd && isOdd)
      y = y.redNeg();

    return this.point(x, y);
  };

  EdwardsCurve.prototype.pointFromY = function pointFromY(y, odd) {
    y = new bn(y, 16);
    if (!y.red)
      y = y.toRed(this.red);

    // x^2 = (y^2 - c^2) / (c^2 d y^2 - a)
    var y2 = y.redSqr();
    var lhs = y2.redSub(this.c2);
    var rhs = y2.redMul(this.d).redMul(this.c2).redSub(this.a);
    var x2 = lhs.redMul(rhs.redInvm());

    if (x2.cmp(this.zero) === 0) {
      if (odd)
        throw new Error('invalid point');
      else
        return this.point(this.zero, y);
    }

    var x = x2.redSqrt();
    if (x.redSqr().redSub(x2).cmp(this.zero) !== 0)
      throw new Error('invalid point');

    if (x.fromRed().isOdd() !== odd)
      x = x.redNeg();

    return this.point(x, y);
  };

  EdwardsCurve.prototype.validate = function validate(point) {
    if (point.isInfinity())
      return true;

    // Curve: A * X^2 + Y^2 = C^2 * (1 + D * X^2 * Y^2)
    point.normalize();

    var x2 = point.x.redSqr();
    var y2 = point.y.redSqr();
    var lhs = x2.redMul(this.a).redAdd(y2);
    var rhs = this.c2.redMul(this.one.redAdd(this.d.redMul(x2).redMul(y2)));

    return lhs.cmp(rhs) === 0;
  };

  function Point$2(curve, x, y, z, t) {
    Base$2.BasePoint.call(this, curve, 'projective');
    if (x === null && y === null && z === null) {
      this.x = this.curve.zero;
      this.y = this.curve.one;
      this.z = this.curve.one;
      this.t = this.curve.zero;
      this.zOne = true;
    } else {
      this.x = new bn(x, 16);
      this.y = new bn(y, 16);
      this.z = z ? new bn(z, 16) : this.curve.one;
      this.t = t && new bn(t, 16);
      if (!this.x.red)
        this.x = this.x.toRed(this.curve.red);
      if (!this.y.red)
        this.y = this.y.toRed(this.curve.red);
      if (!this.z.red)
        this.z = this.z.toRed(this.curve.red);
      if (this.t && !this.t.red)
        this.t = this.t.toRed(this.curve.red);
      this.zOne = this.z === this.curve.one;

      // Use extended coordinates
      if (this.curve.extended && !this.t) {
        this.t = this.x.redMul(this.y);
        if (!this.zOne)
          this.t = this.t.redMul(this.z.redInvm());
      }
    }
  }
  inherits(Point$2, Base$2.BasePoint);

  EdwardsCurve.prototype.pointFromJSON = function pointFromJSON(obj) {
    return Point$2.fromJSON(this, obj);
  };

  EdwardsCurve.prototype.point = function point(x, y, z, t) {
    return new Point$2(this, x, y, z, t);
  };

  Point$2.fromJSON = function fromJSON(curve, obj) {
    return new Point$2(curve, obj[0], obj[1], obj[2]);
  };

  Point$2.prototype.inspect = function inspect() {
    if (this.isInfinity())
      return '<EC Point Infinity>';
    return '<EC Point x: ' + this.x.fromRed().toString(16, 2) +
        ' y: ' + this.y.fromRed().toString(16, 2) +
        ' z: ' + this.z.fromRed().toString(16, 2) + '>';
  };

  Point$2.prototype.isInfinity = function isInfinity() {
    // XXX This code assumes that zero is always zero in red
    return this.x.cmpn(0) === 0 &&
      (this.y.cmp(this.z) === 0 ||
      (this.zOne && this.y.cmp(this.curve.c) === 0));
  };

  Point$2.prototype._extDbl = function _extDbl() {
    // hyperelliptic.org/EFD/g1p/auto-twisted-extended-1.html
    //     #doubling-dbl-2008-hwcd
    // 4M + 4S

    // A = X1^2
    var a = this.x.redSqr();
    // B = Y1^2
    var b = this.y.redSqr();
    // C = 2 * Z1^2
    var c = this.z.redSqr();
    c = c.redIAdd(c);
    // D = a * A
    var d = this.curve._mulA(a);
    // E = (X1 + Y1)^2 - A - B
    var e = this.x.redAdd(this.y).redSqr().redISub(a).redISub(b);
    // G = D + B
    var g = d.redAdd(b);
    // F = G - C
    var f = g.redSub(c);
    // H = D - B
    var h = d.redSub(b);
    // X3 = E * F
    var nx = e.redMul(f);
    // Y3 = G * H
    var ny = g.redMul(h);
    // T3 = E * H
    var nt = e.redMul(h);
    // Z3 = F * G
    var nz = f.redMul(g);
    return this.curve.point(nx, ny, nz, nt);
  };

  Point$2.prototype._projDbl = function _projDbl() {
    // hyperelliptic.org/EFD/g1p/auto-twisted-projective.html
    //     #doubling-dbl-2008-bbjlp
    //     #doubling-dbl-2007-bl
    // and others
    // Generally 3M + 4S or 2M + 4S

    // B = (X1 + Y1)^2
    var b = this.x.redAdd(this.y).redSqr();
    // C = X1^2
    var c = this.x.redSqr();
    // D = Y1^2
    var d = this.y.redSqr();

    var nx;
    var ny;
    var nz;
    if (this.curve.twisted) {
      // E = a * C
      var e = this.curve._mulA(c);
      // F = E + D
      var f = e.redAdd(d);
      if (this.zOne) {
        // X3 = (B - C - D) * (F - 2)
        nx = b.redSub(c).redSub(d).redMul(f.redSub(this.curve.two));
        // Y3 = F * (E - D)
        ny = f.redMul(e.redSub(d));
        // Z3 = F^2 - 2 * F
        nz = f.redSqr().redSub(f).redSub(f);
      } else {
        // H = Z1^2
        var h = this.z.redSqr();
        // J = F - 2 * H
        var j = f.redSub(h).redISub(h);
        // X3 = (B-C-D)*J
        nx = b.redSub(c).redISub(d).redMul(j);
        // Y3 = F * (E - D)
        ny = f.redMul(e.redSub(d));
        // Z3 = F * J
        nz = f.redMul(j);
      }
    } else {
      // E = C + D
      var e = c.redAdd(d);
      // H = (c * Z1)^2
      var h = this.curve._mulC(this.z).redSqr();
      // J = E - 2 * H
      var j = e.redSub(h).redSub(h);
      // X3 = c * (B - E) * J
      nx = this.curve._mulC(b.redISub(e)).redMul(j);
      // Y3 = c * E * (C - D)
      ny = this.curve._mulC(e).redMul(c.redISub(d));
      // Z3 = E * J
      nz = e.redMul(j);
    }
    return this.curve.point(nx, ny, nz);
  };

  Point$2.prototype.dbl = function dbl() {
    if (this.isInfinity())
      return this;

    // Double in extended coordinates
    if (this.curve.extended)
      return this._extDbl();
    else
      return this._projDbl();
  };

  Point$2.prototype._extAdd = function _extAdd(p) {
    // hyperelliptic.org/EFD/g1p/auto-twisted-extended-1.html
    //     #addition-add-2008-hwcd-3
    // 8M

    // A = (Y1 - X1) * (Y2 - X2)
    var a = this.y.redSub(this.x).redMul(p.y.redSub(p.x));
    // B = (Y1 + X1) * (Y2 + X2)
    var b = this.y.redAdd(this.x).redMul(p.y.redAdd(p.x));
    // C = T1 * k * T2
    var c = this.t.redMul(this.curve.dd).redMul(p.t);
    // D = Z1 * 2 * Z2
    var d = this.z.redMul(p.z.redAdd(p.z));
    // E = B - A
    var e = b.redSub(a);
    // F = D - C
    var f = d.redSub(c);
    // G = D + C
    var g = d.redAdd(c);
    // H = B + A
    var h = b.redAdd(a);
    // X3 = E * F
    var nx = e.redMul(f);
    // Y3 = G * H
    var ny = g.redMul(h);
    // T3 = E * H
    var nt = e.redMul(h);
    // Z3 = F * G
    var nz = f.redMul(g);
    return this.curve.point(nx, ny, nz, nt);
  };

  Point$2.prototype._projAdd = function _projAdd(p) {
    // hyperelliptic.org/EFD/g1p/auto-twisted-projective.html
    //     #addition-add-2008-bbjlp
    //     #addition-add-2007-bl
    // 10M + 1S

    // A = Z1 * Z2
    var a = this.z.redMul(p.z);
    // B = A^2
    var b = a.redSqr();
    // C = X1 * X2
    var c = this.x.redMul(p.x);
    // D = Y1 * Y2
    var d = this.y.redMul(p.y);
    // E = d * C * D
    var e = this.curve.d.redMul(c).redMul(d);
    // F = B - E
    var f = b.redSub(e);
    // G = B + E
    var g = b.redAdd(e);
    // X3 = A * F * ((X1 + Y1) * (X2 + Y2) - C - D)
    var tmp = this.x.redAdd(this.y).redMul(p.x.redAdd(p.y)).redISub(c).redISub(d);
    var nx = a.redMul(f).redMul(tmp);
    var ny;
    var nz;
    if (this.curve.twisted) {
      // Y3 = A * G * (D - a * C)
      ny = a.redMul(g).redMul(d.redSub(this.curve._mulA(c)));
      // Z3 = F * G
      nz = f.redMul(g);
    } else {
      // Y3 = A * G * (D - C)
      ny = a.redMul(g).redMul(d.redSub(c));
      // Z3 = c * F * G
      nz = this.curve._mulC(f).redMul(g);
    }
    return this.curve.point(nx, ny, nz);
  };

  Point$2.prototype.add = function add(p) {
    if (this.isInfinity())
      return p;
    if (p.isInfinity())
      return this;

    if (this.curve.extended)
      return this._extAdd(p);
    else
      return this._projAdd(p);
  };

  Point$2.prototype.mul = function mul(k) {
    if (this._hasDoubles(k))
      return this.curve._fixedNafMul(this, k);
    else
      return this.curve._wnafMul(this, k);
  };

  Point$2.prototype.mulAdd = function mulAdd(k1, p, k2) {
    return this.curve._wnafMulAdd(1, [ this, p ], [ k1, k2 ], 2, false);
  };

  Point$2.prototype.jmulAdd = function jmulAdd(k1, p, k2) {
    return this.curve._wnafMulAdd(1, [ this, p ], [ k1, k2 ], 2, true);
  };

  Point$2.prototype.normalize = function normalize() {
    if (this.zOne)
      return this;

    // Normalize coordinates
    var zi = this.z.redInvm();
    this.x = this.x.redMul(zi);
    this.y = this.y.redMul(zi);
    if (this.t)
      this.t = this.t.redMul(zi);
    this.z = this.curve.one;
    this.zOne = true;
    return this;
  };

  Point$2.prototype.neg = function neg() {
    return this.curve.point(this.x.redNeg(),
                            this.y,
                            this.z,
                            this.t && this.t.redNeg());
  };

  Point$2.prototype.getX = function getX() {
    this.normalize();
    return this.x.fromRed();
  };

  Point$2.prototype.getY = function getY() {
    this.normalize();
    return this.y.fromRed();
  };

  Point$2.prototype.eq = function eq(other) {
    return this === other ||
           this.getX().cmp(other.getX()) === 0 &&
           this.getY().cmp(other.getY()) === 0;
  };

  Point$2.prototype.eqXToP = function eqXToP(x) {
    var rx = x.toRed(this.curve.red).redMul(this.z);
    if (this.x.cmp(rx) === 0)
      return true;

    var xc = x.clone();
    var t = this.curve.redN.redMul(this.z);
    for (;;) {
      xc.iadd(this.curve.n);
      if (xc.cmp(this.curve.p) >= 0)
        return false;

      rx.redIAdd(t);
      if (this.x.cmp(rx) === 0)
        return true;
    }
  };

  // Compatibility with BaseCurve
  Point$2.prototype.toP = Point$2.prototype.normalize;
  Point$2.prototype.mixedAdd = Point$2.prototype.add;

  var curve_1 = createCommonjsModule(function (module, exports) {

  var curve = exports;

  curve.base = base$1;
  curve.short = short_1;
  curve.mont = mont;
  curve.edwards = edwards;
  });

  var inherits_1 = inherits;

  function toArray(msg, enc) {
    if (Array.isArray(msg))
      return msg.slice();
    if (!msg)
      return [];
    var res = [];
    if (typeof msg === 'string') {
      if (!enc) {
        for (var i = 0; i < msg.length; i++) {
          var c = msg.charCodeAt(i);
          var hi = c >> 8;
          var lo = c & 0xff;
          if (hi)
            res.push(hi, lo);
          else
            res.push(lo);
        }
      } else if (enc === 'hex') {
        msg = msg.replace(/[^a-z0-9]+/ig, '');
        if (msg.length % 2 !== 0)
          msg = '0' + msg;
        for (i = 0; i < msg.length; i += 2)
          res.push(parseInt(msg[i] + msg[i + 1], 16));
      }
    } else {
      for (i = 0; i < msg.length; i++)
        res[i] = msg[i] | 0;
    }
    return res;
  }
  var toArray_1 = toArray;

  function toHex(msg) {
    var res = '';
    for (var i = 0; i < msg.length; i++)
      res += zero2(msg[i].toString(16));
    return res;
  }
  var toHex_1 = toHex;

  function htonl(w) {
    var res = (w >>> 24) |
              ((w >>> 8) & 0xff00) |
              ((w << 8) & 0xff0000) |
              ((w & 0xff) << 24);
    return res >>> 0;
  }
  var htonl_1 = htonl;

  function toHex32(msg, endian) {
    var res = '';
    for (var i = 0; i < msg.length; i++) {
      var w = msg[i];
      if (endian === 'little')
        w = htonl(w);
      res += zero8(w.toString(16));
    }
    return res;
  }
  var toHex32_1 = toHex32;

  function zero2(word) {
    if (word.length === 1)
      return '0' + word;
    else
      return word;
  }
  var zero2_1 = zero2;

  function zero8(word) {
    if (word.length === 7)
      return '0' + word;
    else if (word.length === 6)
      return '00' + word;
    else if (word.length === 5)
      return '000' + word;
    else if (word.length === 4)
      return '0000' + word;
    else if (word.length === 3)
      return '00000' + word;
    else if (word.length === 2)
      return '000000' + word;
    else if (word.length === 1)
      return '0000000' + word;
    else
      return word;
  }
  var zero8_1 = zero8;

  function join32(msg, start, end, endian) {
    var len = end - start;
    minimalisticAssert(len % 4 === 0);
    var res = new Array(len / 4);
    for (var i = 0, k = start; i < res.length; i++, k += 4) {
      var w;
      if (endian === 'big')
        w = (msg[k] << 24) | (msg[k + 1] << 16) | (msg[k + 2] << 8) | msg[k + 3];
      else
        w = (msg[k + 3] << 24) | (msg[k + 2] << 16) | (msg[k + 1] << 8) | msg[k];
      res[i] = w >>> 0;
    }
    return res;
  }
  var join32_1 = join32;

  function split32(msg, endian) {
    var res = new Array(msg.length * 4);
    for (var i = 0, k = 0; i < msg.length; i++, k += 4) {
      var m = msg[i];
      if (endian === 'big') {
        res[k] = m >>> 24;
        res[k + 1] = (m >>> 16) & 0xff;
        res[k + 2] = (m >>> 8) & 0xff;
        res[k + 3] = m & 0xff;
      } else {
        res[k + 3] = m >>> 24;
        res[k + 2] = (m >>> 16) & 0xff;
        res[k + 1] = (m >>> 8) & 0xff;
        res[k] = m & 0xff;
      }
    }
    return res;
  }
  var split32_1 = split32;

  function rotr32(w, b) {
    return (w >>> b) | (w << (32 - b));
  }
  var rotr32_1 = rotr32;

  function rotl32(w, b) {
    return (w << b) | (w >>> (32 - b));
  }
  var rotl32_1 = rotl32;

  function sum32(a, b) {
    return (a + b) >>> 0;
  }
  var sum32_1 = sum32;

  function sum32_3(a, b, c) {
    return (a + b + c) >>> 0;
  }
  var sum32_3_1 = sum32_3;

  function sum32_4(a, b, c, d) {
    return (a + b + c + d) >>> 0;
  }
  var sum32_4_1 = sum32_4;

  function sum32_5(a, b, c, d, e) {
    return (a + b + c + d + e) >>> 0;
  }
  var sum32_5_1 = sum32_5;

  function sum64(buf, pos, ah, al) {
    var bh = buf[pos];
    var bl = buf[pos + 1];

    var lo = (al + bl) >>> 0;
    var hi = (lo < al ? 1 : 0) + ah + bh;
    buf[pos] = hi >>> 0;
    buf[pos + 1] = lo;
  }
  var sum64_1 = sum64;

  function sum64_hi(ah, al, bh, bl) {
    var lo = (al + bl) >>> 0;
    var hi = (lo < al ? 1 : 0) + ah + bh;
    return hi >>> 0;
  }
  var sum64_hi_1 = sum64_hi;

  function sum64_lo(ah, al, bh, bl) {
    var lo = al + bl;
    return lo >>> 0;
  }
  var sum64_lo_1 = sum64_lo;

  function sum64_4_hi(ah, al, bh, bl, ch, cl, dh, dl) {
    var carry = 0;
    var lo = al;
    lo = (lo + bl) >>> 0;
    carry += lo < al ? 1 : 0;
    lo = (lo + cl) >>> 0;
    carry += lo < cl ? 1 : 0;
    lo = (lo + dl) >>> 0;
    carry += lo < dl ? 1 : 0;

    var hi = ah + bh + ch + dh + carry;
    return hi >>> 0;
  }
  var sum64_4_hi_1 = sum64_4_hi;

  function sum64_4_lo(ah, al, bh, bl, ch, cl, dh, dl) {
    var lo = al + bl + cl + dl;
    return lo >>> 0;
  }
  var sum64_4_lo_1 = sum64_4_lo;

  function sum64_5_hi(ah, al, bh, bl, ch, cl, dh, dl, eh, el) {
    var carry = 0;
    var lo = al;
    lo = (lo + bl) >>> 0;
    carry += lo < al ? 1 : 0;
    lo = (lo + cl) >>> 0;
    carry += lo < cl ? 1 : 0;
    lo = (lo + dl) >>> 0;
    carry += lo < dl ? 1 : 0;
    lo = (lo + el) >>> 0;
    carry += lo < el ? 1 : 0;

    var hi = ah + bh + ch + dh + eh + carry;
    return hi >>> 0;
  }
  var sum64_5_hi_1 = sum64_5_hi;

  function sum64_5_lo(ah, al, bh, bl, ch, cl, dh, dl, eh, el) {
    var lo = al + bl + cl + dl + el;

    return lo >>> 0;
  }
  var sum64_5_lo_1 = sum64_5_lo;

  function rotr64_hi(ah, al, num) {
    var r = (al << (32 - num)) | (ah >>> num);
    return r >>> 0;
  }
  var rotr64_hi_1 = rotr64_hi;

  function rotr64_lo(ah, al, num) {
    var r = (ah << (32 - num)) | (al >>> num);
    return r >>> 0;
  }
  var rotr64_lo_1 = rotr64_lo;

  function shr64_hi(ah, al, num) {
    return ah >>> num;
  }
  var shr64_hi_1 = shr64_hi;

  function shr64_lo(ah, al, num) {
    var r = (ah << (32 - num)) | (al >>> num);
    return r >>> 0;
  }
  var shr64_lo_1 = shr64_lo;

  var utils$2 = {
  	inherits: inherits_1,
  	toArray: toArray_1,
  	toHex: toHex_1,
  	htonl: htonl_1,
  	toHex32: toHex32_1,
  	zero2: zero2_1,
  	zero8: zero8_1,
  	join32: join32_1,
  	split32: split32_1,
  	rotr32: rotr32_1,
  	rotl32: rotl32_1,
  	sum32: sum32_1,
  	sum32_3: sum32_3_1,
  	sum32_4: sum32_4_1,
  	sum32_5: sum32_5_1,
  	sum64: sum64_1,
  	sum64_hi: sum64_hi_1,
  	sum64_lo: sum64_lo_1,
  	sum64_4_hi: sum64_4_hi_1,
  	sum64_4_lo: sum64_4_lo_1,
  	sum64_5_hi: sum64_5_hi_1,
  	sum64_5_lo: sum64_5_lo_1,
  	rotr64_hi: rotr64_hi_1,
  	rotr64_lo: rotr64_lo_1,
  	shr64_hi: shr64_hi_1,
  	shr64_lo: shr64_lo_1
  };

  function BlockHash() {
    this.pending = null;
    this.pendingTotal = 0;
    this.blockSize = this.constructor.blockSize;
    this.outSize = this.constructor.outSize;
    this.hmacStrength = this.constructor.hmacStrength;
    this.padLength = this.constructor.padLength / 8;
    this.endian = 'big';

    this._delta8 = this.blockSize / 8;
    this._delta32 = this.blockSize / 32;
  }
  var BlockHash_1 = BlockHash;

  BlockHash.prototype.update = function update(msg, enc) {
    // Convert message to array, pad it, and join into 32bit blocks
    msg = utils$2.toArray(msg, enc);
    if (!this.pending)
      this.pending = msg;
    else
      this.pending = this.pending.concat(msg);
    this.pendingTotal += msg.length;

    // Enough data, try updating
    if (this.pending.length >= this._delta8) {
      msg = this.pending;

      // Process pending data in blocks
      var r = msg.length % this._delta8;
      this.pending = msg.slice(msg.length - r, msg.length);
      if (this.pending.length === 0)
        this.pending = null;

      msg = utils$2.join32(msg, 0, msg.length - r, this.endian);
      for (var i = 0; i < msg.length; i += this._delta32)
        this._update(msg, i, i + this._delta32);
    }

    return this;
  };

  BlockHash.prototype.digest = function digest(enc) {
    this.update(this._pad());
    minimalisticAssert(this.pending === null);

    return this._digest(enc);
  };

  BlockHash.prototype._pad = function pad() {
    var len = this.pendingTotal;
    var bytes = this._delta8;
    var k = bytes - ((len + this.padLength) % bytes);
    var res = new Array(k + this.padLength);
    res[0] = 0x80;
    for (var i = 1; i < k; i++)
      res[i] = 0;

    // Append length
    len <<= 3;
    if (this.endian === 'big') {
      for (var t = 8; t < this.padLength; t++)
        res[i++] = 0;

      res[i++] = 0;
      res[i++] = 0;
      res[i++] = 0;
      res[i++] = 0;
      res[i++] = (len >>> 24) & 0xff;
      res[i++] = (len >>> 16) & 0xff;
      res[i++] = (len >>> 8) & 0xff;
      res[i++] = len & 0xff;
    } else {
      res[i++] = len & 0xff;
      res[i++] = (len >>> 8) & 0xff;
      res[i++] = (len >>> 16) & 0xff;
      res[i++] = (len >>> 24) & 0xff;
      res[i++] = 0;
      res[i++] = 0;
      res[i++] = 0;
      res[i++] = 0;

      for (t = 8; t < this.padLength; t++)
        res[i++] = 0;
    }

    return res;
  };

  var common = {
  	BlockHash: BlockHash_1
  };

  var rotr32$1 = utils$2.rotr32;

  function ft_1(s, x, y, z) {
    if (s === 0)
      return ch32(x, y, z);
    if (s === 1 || s === 3)
      return p32(x, y, z);
    if (s === 2)
      return maj32(x, y, z);
  }
  var ft_1_1 = ft_1;

  function ch32(x, y, z) {
    return (x & y) ^ ((~x) & z);
  }
  var ch32_1 = ch32;

  function maj32(x, y, z) {
    return (x & y) ^ (x & z) ^ (y & z);
  }
  var maj32_1 = maj32;

  function p32(x, y, z) {
    return x ^ y ^ z;
  }
  var p32_1 = p32;

  function s0_256(x) {
    return rotr32$1(x, 2) ^ rotr32$1(x, 13) ^ rotr32$1(x, 22);
  }
  var s0_256_1 = s0_256;

  function s1_256(x) {
    return rotr32$1(x, 6) ^ rotr32$1(x, 11) ^ rotr32$1(x, 25);
  }
  var s1_256_1 = s1_256;

  function g0_256(x) {
    return rotr32$1(x, 7) ^ rotr32$1(x, 18) ^ (x >>> 3);
  }
  var g0_256_1 = g0_256;

  function g1_256(x) {
    return rotr32$1(x, 17) ^ rotr32$1(x, 19) ^ (x >>> 10);
  }
  var g1_256_1 = g1_256;

  var common$1 = {
  	ft_1: ft_1_1,
  	ch32: ch32_1,
  	maj32: maj32_1,
  	p32: p32_1,
  	s0_256: s0_256_1,
  	s1_256: s1_256_1,
  	g0_256: g0_256_1,
  	g1_256: g1_256_1
  };

  var rotl32$1 = utils$2.rotl32;
  var sum32$1 = utils$2.sum32;
  var sum32_5$1 = utils$2.sum32_5;
  var ft_1$1 = common$1.ft_1;
  var BlockHash$1 = common.BlockHash;

  var sha1_K = [
    0x5A827999, 0x6ED9EBA1,
    0x8F1BBCDC, 0xCA62C1D6
  ];

  function SHA1() {
    if (!(this instanceof SHA1))
      return new SHA1();

    BlockHash$1.call(this);
    this.h = [
      0x67452301, 0xefcdab89, 0x98badcfe,
      0x10325476, 0xc3d2e1f0 ];
    this.W = new Array(80);
  }

  utils$2.inherits(SHA1, BlockHash$1);
  var _1 = SHA1;

  SHA1.blockSize = 512;
  SHA1.outSize = 160;
  SHA1.hmacStrength = 80;
  SHA1.padLength = 64;

  SHA1.prototype._update = function _update(msg, start) {
    var W = this.W;

    for (var i = 0; i < 16; i++)
      W[i] = msg[start + i];

    for(; i < W.length; i++)
      W[i] = rotl32$1(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);

    var a = this.h[0];
    var b = this.h[1];
    var c = this.h[2];
    var d = this.h[3];
    var e = this.h[4];

    for (i = 0; i < W.length; i++) {
      var s = ~~(i / 20);
      var t = sum32_5$1(rotl32$1(a, 5), ft_1$1(s, b, c, d), e, W[i], sha1_K[s]);
      e = d;
      d = c;
      c = rotl32$1(b, 30);
      b = a;
      a = t;
    }

    this.h[0] = sum32$1(this.h[0], a);
    this.h[1] = sum32$1(this.h[1], b);
    this.h[2] = sum32$1(this.h[2], c);
    this.h[3] = sum32$1(this.h[3], d);
    this.h[4] = sum32$1(this.h[4], e);
  };

  SHA1.prototype._digest = function digest(enc) {
    if (enc === 'hex')
      return utils$2.toHex32(this.h, 'big');
    else
      return utils$2.split32(this.h, 'big');
  };

  var sum32$2 = utils$2.sum32;
  var sum32_4$1 = utils$2.sum32_4;
  var sum32_5$2 = utils$2.sum32_5;
  var ch32$1 = common$1.ch32;
  var maj32$1 = common$1.maj32;
  var s0_256$1 = common$1.s0_256;
  var s1_256$1 = common$1.s1_256;
  var g0_256$1 = common$1.g0_256;
  var g1_256$1 = common$1.g1_256;

  var BlockHash$2 = common.BlockHash;

  var sha256_K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
    0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
    0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
    0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
    0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
    0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
    0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
    0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  function SHA256() {
    if (!(this instanceof SHA256))
      return new SHA256();

    BlockHash$2.call(this);
    this.h = [
      0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
      0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ];
    this.k = sha256_K;
    this.W = new Array(64);
  }
  utils$2.inherits(SHA256, BlockHash$2);
  var _256 = SHA256;

  SHA256.blockSize = 512;
  SHA256.outSize = 256;
  SHA256.hmacStrength = 192;
  SHA256.padLength = 64;

  SHA256.prototype._update = function _update(msg, start) {
    var W = this.W;

    for (var i = 0; i < 16; i++)
      W[i] = msg[start + i];
    for (; i < W.length; i++)
      W[i] = sum32_4$1(g1_256$1(W[i - 2]), W[i - 7], g0_256$1(W[i - 15]), W[i - 16]);

    var a = this.h[0];
    var b = this.h[1];
    var c = this.h[2];
    var d = this.h[3];
    var e = this.h[4];
    var f = this.h[5];
    var g = this.h[6];
    var h = this.h[7];

    minimalisticAssert(this.k.length === W.length);
    for (i = 0; i < W.length; i++) {
      var T1 = sum32_5$2(h, s1_256$1(e), ch32$1(e, f, g), this.k[i], W[i]);
      var T2 = sum32$2(s0_256$1(a), maj32$1(a, b, c));
      h = g;
      g = f;
      f = e;
      e = sum32$2(d, T1);
      d = c;
      c = b;
      b = a;
      a = sum32$2(T1, T2);
    }

    this.h[0] = sum32$2(this.h[0], a);
    this.h[1] = sum32$2(this.h[1], b);
    this.h[2] = sum32$2(this.h[2], c);
    this.h[3] = sum32$2(this.h[3], d);
    this.h[4] = sum32$2(this.h[4], e);
    this.h[5] = sum32$2(this.h[5], f);
    this.h[6] = sum32$2(this.h[6], g);
    this.h[7] = sum32$2(this.h[7], h);
  };

  SHA256.prototype._digest = function digest(enc) {
    if (enc === 'hex')
      return utils$2.toHex32(this.h, 'big');
    else
      return utils$2.split32(this.h, 'big');
  };

  function SHA224() {
    if (!(this instanceof SHA224))
      return new SHA224();

    _256.call(this);
    this.h = [
      0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939,
      0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4 ];
  }
  utils$2.inherits(SHA224, _256);
  var _224 = SHA224;

  SHA224.blockSize = 512;
  SHA224.outSize = 224;
  SHA224.hmacStrength = 192;
  SHA224.padLength = 64;

  SHA224.prototype._digest = function digest(enc) {
    // Just truncate output
    if (enc === 'hex')
      return utils$2.toHex32(this.h.slice(0, 7), 'big');
    else
      return utils$2.split32(this.h.slice(0, 7), 'big');
  };

  var rotr64_hi$1 = utils$2.rotr64_hi;
  var rotr64_lo$1 = utils$2.rotr64_lo;
  var shr64_hi$1 = utils$2.shr64_hi;
  var shr64_lo$1 = utils$2.shr64_lo;
  var sum64$1 = utils$2.sum64;
  var sum64_hi$1 = utils$2.sum64_hi;
  var sum64_lo$1 = utils$2.sum64_lo;
  var sum64_4_hi$1 = utils$2.sum64_4_hi;
  var sum64_4_lo$1 = utils$2.sum64_4_lo;
  var sum64_5_hi$1 = utils$2.sum64_5_hi;
  var sum64_5_lo$1 = utils$2.sum64_5_lo;

  var BlockHash$3 = common.BlockHash;

  var sha512_K = [
    0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd,
    0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc,
    0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019,
    0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118,
    0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe,
    0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2,
    0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1,
    0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694,
    0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3,
    0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65,
    0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483,
    0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5,
    0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210,
    0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4,
    0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725,
    0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70,
    0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926,
    0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df,
    0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8,
    0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b,
    0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001,
    0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30,
    0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910,
    0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8,
    0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53,
    0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8,
    0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb,
    0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3,
    0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60,
    0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
    0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9,
    0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b,
    0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207,
    0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178,
    0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6,
    0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b,
    0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493,
    0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c,
    0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a,
    0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817
  ];

  function SHA512() {
    if (!(this instanceof SHA512))
      return new SHA512();

    BlockHash$3.call(this);
    this.h = [
      0x6a09e667, 0xf3bcc908,
      0xbb67ae85, 0x84caa73b,
      0x3c6ef372, 0xfe94f82b,
      0xa54ff53a, 0x5f1d36f1,
      0x510e527f, 0xade682d1,
      0x9b05688c, 0x2b3e6c1f,
      0x1f83d9ab, 0xfb41bd6b,
      0x5be0cd19, 0x137e2179 ];
    this.k = sha512_K;
    this.W = new Array(160);
  }
  utils$2.inherits(SHA512, BlockHash$3);
  var _512 = SHA512;

  SHA512.blockSize = 1024;
  SHA512.outSize = 512;
  SHA512.hmacStrength = 192;
  SHA512.padLength = 128;

  SHA512.prototype._prepareBlock = function _prepareBlock(msg, start) {
    var W = this.W;

    // 32 x 32bit words
    for (var i = 0; i < 32; i++)
      W[i] = msg[start + i];
    for (; i < W.length; i += 2) {
      var c0_hi = g1_512_hi(W[i - 4], W[i - 3]);  // i - 2
      var c0_lo = g1_512_lo(W[i - 4], W[i - 3]);
      var c1_hi = W[i - 14];  // i - 7
      var c1_lo = W[i - 13];
      var c2_hi = g0_512_hi(W[i - 30], W[i - 29]);  // i - 15
      var c2_lo = g0_512_lo(W[i - 30], W[i - 29]);
      var c3_hi = W[i - 32];  // i - 16
      var c3_lo = W[i - 31];

      W[i] = sum64_4_hi$1(
        c0_hi, c0_lo,
        c1_hi, c1_lo,
        c2_hi, c2_lo,
        c3_hi, c3_lo);
      W[i + 1] = sum64_4_lo$1(
        c0_hi, c0_lo,
        c1_hi, c1_lo,
        c2_hi, c2_lo,
        c3_hi, c3_lo);
    }
  };

  SHA512.prototype._update = function _update(msg, start) {
    this._prepareBlock(msg, start);

    var W = this.W;

    var ah = this.h[0];
    var al = this.h[1];
    var bh = this.h[2];
    var bl = this.h[3];
    var ch = this.h[4];
    var cl = this.h[5];
    var dh = this.h[6];
    var dl = this.h[7];
    var eh = this.h[8];
    var el = this.h[9];
    var fh = this.h[10];
    var fl = this.h[11];
    var gh = this.h[12];
    var gl = this.h[13];
    var hh = this.h[14];
    var hl = this.h[15];

    minimalisticAssert(this.k.length === W.length);
    for (var i = 0; i < W.length; i += 2) {
      var c0_hi = hh;
      var c0_lo = hl;
      var c1_hi = s1_512_hi(eh, el);
      var c1_lo = s1_512_lo(eh, el);
      var c2_hi = ch64_hi(eh, el, fh, fl, gh, gl);
      var c2_lo = ch64_lo(eh, el, fh, fl, gh, gl);
      var c3_hi = this.k[i];
      var c3_lo = this.k[i + 1];
      var c4_hi = W[i];
      var c4_lo = W[i + 1];

      var T1_hi = sum64_5_hi$1(
        c0_hi, c0_lo,
        c1_hi, c1_lo,
        c2_hi, c2_lo,
        c3_hi, c3_lo,
        c4_hi, c4_lo);
      var T1_lo = sum64_5_lo$1(
        c0_hi, c0_lo,
        c1_hi, c1_lo,
        c2_hi, c2_lo,
        c3_hi, c3_lo,
        c4_hi, c4_lo);

      c0_hi = s0_512_hi(ah, al);
      c0_lo = s0_512_lo(ah, al);
      c1_hi = maj64_hi(ah, al, bh, bl, ch, cl);
      c1_lo = maj64_lo(ah, al, bh, bl, ch, cl);

      var T2_hi = sum64_hi$1(c0_hi, c0_lo, c1_hi, c1_lo);
      var T2_lo = sum64_lo$1(c0_hi, c0_lo, c1_hi, c1_lo);

      hh = gh;
      hl = gl;

      gh = fh;
      gl = fl;

      fh = eh;
      fl = el;

      eh = sum64_hi$1(dh, dl, T1_hi, T1_lo);
      el = sum64_lo$1(dl, dl, T1_hi, T1_lo);

      dh = ch;
      dl = cl;

      ch = bh;
      cl = bl;

      bh = ah;
      bl = al;

      ah = sum64_hi$1(T1_hi, T1_lo, T2_hi, T2_lo);
      al = sum64_lo$1(T1_hi, T1_lo, T2_hi, T2_lo);
    }

    sum64$1(this.h, 0, ah, al);
    sum64$1(this.h, 2, bh, bl);
    sum64$1(this.h, 4, ch, cl);
    sum64$1(this.h, 6, dh, dl);
    sum64$1(this.h, 8, eh, el);
    sum64$1(this.h, 10, fh, fl);
    sum64$1(this.h, 12, gh, gl);
    sum64$1(this.h, 14, hh, hl);
  };

  SHA512.prototype._digest = function digest(enc) {
    if (enc === 'hex')
      return utils$2.toHex32(this.h, 'big');
    else
      return utils$2.split32(this.h, 'big');
  };

  function ch64_hi(xh, xl, yh, yl, zh) {
    var r = (xh & yh) ^ ((~xh) & zh);
    if (r < 0)
      r += 0x100000000;
    return r;
  }

  function ch64_lo(xh, xl, yh, yl, zh, zl) {
    var r = (xl & yl) ^ ((~xl) & zl);
    if (r < 0)
      r += 0x100000000;
    return r;
  }

  function maj64_hi(xh, xl, yh, yl, zh) {
    var r = (xh & yh) ^ (xh & zh) ^ (yh & zh);
    if (r < 0)
      r += 0x100000000;
    return r;
  }

  function maj64_lo(xh, xl, yh, yl, zh, zl) {
    var r = (xl & yl) ^ (xl & zl) ^ (yl & zl);
    if (r < 0)
      r += 0x100000000;
    return r;
  }

  function s0_512_hi(xh, xl) {
    var c0_hi = rotr64_hi$1(xh, xl, 28);
    var c1_hi = rotr64_hi$1(xl, xh, 2);  // 34
    var c2_hi = rotr64_hi$1(xl, xh, 7);  // 39

    var r = c0_hi ^ c1_hi ^ c2_hi;
    if (r < 0)
      r += 0x100000000;
    return r;
  }

  function s0_512_lo(xh, xl) {
    var c0_lo = rotr64_lo$1(xh, xl, 28);
    var c1_lo = rotr64_lo$1(xl, xh, 2);  // 34
    var c2_lo = rotr64_lo$1(xl, xh, 7);  // 39

    var r = c0_lo ^ c1_lo ^ c2_lo;
    if (r < 0)
      r += 0x100000000;
    return r;
  }

  function s1_512_hi(xh, xl) {
    var c0_hi = rotr64_hi$1(xh, xl, 14);
    var c1_hi = rotr64_hi$1(xh, xl, 18);
    var c2_hi = rotr64_hi$1(xl, xh, 9);  // 41

    var r = c0_hi ^ c1_hi ^ c2_hi;
    if (r < 0)
      r += 0x100000000;
    return r;
  }

  function s1_512_lo(xh, xl) {
    var c0_lo = rotr64_lo$1(xh, xl, 14);
    var c1_lo = rotr64_lo$1(xh, xl, 18);
    var c2_lo = rotr64_lo$1(xl, xh, 9);  // 41

    var r = c0_lo ^ c1_lo ^ c2_lo;
    if (r < 0)
      r += 0x100000000;
    return r;
  }

  function g0_512_hi(xh, xl) {
    var c0_hi = rotr64_hi$1(xh, xl, 1);
    var c1_hi = rotr64_hi$1(xh, xl, 8);
    var c2_hi = shr64_hi$1(xh, xl, 7);

    var r = c0_hi ^ c1_hi ^ c2_hi;
    if (r < 0)
      r += 0x100000000;
    return r;
  }

  function g0_512_lo(xh, xl) {
    var c0_lo = rotr64_lo$1(xh, xl, 1);
    var c1_lo = rotr64_lo$1(xh, xl, 8);
    var c2_lo = shr64_lo$1(xh, xl, 7);

    var r = c0_lo ^ c1_lo ^ c2_lo;
    if (r < 0)
      r += 0x100000000;
    return r;
  }

  function g1_512_hi(xh, xl) {
    var c0_hi = rotr64_hi$1(xh, xl, 19);
    var c1_hi = rotr64_hi$1(xl, xh, 29);  // 61
    var c2_hi = shr64_hi$1(xh, xl, 6);

    var r = c0_hi ^ c1_hi ^ c2_hi;
    if (r < 0)
      r += 0x100000000;
    return r;
  }

  function g1_512_lo(xh, xl) {
    var c0_lo = rotr64_lo$1(xh, xl, 19);
    var c1_lo = rotr64_lo$1(xl, xh, 29);  // 61
    var c2_lo = shr64_lo$1(xh, xl, 6);

    var r = c0_lo ^ c1_lo ^ c2_lo;
    if (r < 0)
      r += 0x100000000;
    return r;
  }

  function SHA384() {
    if (!(this instanceof SHA384))
      return new SHA384();

    _512.call(this);
    this.h = [
      0xcbbb9d5d, 0xc1059ed8,
      0x629a292a, 0x367cd507,
      0x9159015a, 0x3070dd17,
      0x152fecd8, 0xf70e5939,
      0x67332667, 0xffc00b31,
      0x8eb44a87, 0x68581511,
      0xdb0c2e0d, 0x64f98fa7,
      0x47b5481d, 0xbefa4fa4 ];
  }
  utils$2.inherits(SHA384, _512);
  var _384 = SHA384;

  SHA384.blockSize = 1024;
  SHA384.outSize = 384;
  SHA384.hmacStrength = 192;
  SHA384.padLength = 128;

  SHA384.prototype._digest = function digest(enc) {
    if (enc === 'hex')
      return utils$2.toHex32(this.h.slice(0, 12), 'big');
    else
      return utils$2.split32(this.h.slice(0, 12), 'big');
  };

  var sha1 = _1;
  var sha224 = _224;
  var sha256 = _256;
  var sha384 = _384;
  var sha512 = _512;

  var sha = {
  	sha1: sha1,
  	sha224: sha224,
  	sha256: sha256,
  	sha384: sha384,
  	sha512: sha512
  };

  var rotl32$2 = utils$2.rotl32;
  var sum32$3 = utils$2.sum32;
  var sum32_3$1 = utils$2.sum32_3;
  var sum32_4$2 = utils$2.sum32_4;
  var BlockHash$4 = common.BlockHash;

  function RIPEMD160() {
    if (!(this instanceof RIPEMD160))
      return new RIPEMD160();

    BlockHash$4.call(this);

    this.h = [ 0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0 ];
    this.endian = 'little';
  }
  utils$2.inherits(RIPEMD160, BlockHash$4);
  var ripemd160 = RIPEMD160;

  RIPEMD160.blockSize = 512;
  RIPEMD160.outSize = 160;
  RIPEMD160.hmacStrength = 192;
  RIPEMD160.padLength = 64;

  RIPEMD160.prototype._update = function update(msg, start) {
    var A = this.h[0];
    var B = this.h[1];
    var C = this.h[2];
    var D = this.h[3];
    var E = this.h[4];
    var Ah = A;
    var Bh = B;
    var Ch = C;
    var Dh = D;
    var Eh = E;
    for (var j = 0; j < 80; j++) {
      var T = sum32$3(
        rotl32$2(
          sum32_4$2(A, f(j, B, C, D), msg[r$1[j] + start], K(j)),
          s[j]),
        E);
      A = E;
      E = D;
      D = rotl32$2(C, 10);
      C = B;
      B = T;
      T = sum32$3(
        rotl32$2(
          sum32_4$2(Ah, f(79 - j, Bh, Ch, Dh), msg[rh[j] + start], Kh(j)),
          sh[j]),
        Eh);
      Ah = Eh;
      Eh = Dh;
      Dh = rotl32$2(Ch, 10);
      Ch = Bh;
      Bh = T;
    }
    T = sum32_3$1(this.h[1], C, Dh);
    this.h[1] = sum32_3$1(this.h[2], D, Eh);
    this.h[2] = sum32_3$1(this.h[3], E, Ah);
    this.h[3] = sum32_3$1(this.h[4], A, Bh);
    this.h[4] = sum32_3$1(this.h[0], B, Ch);
    this.h[0] = T;
  };

  RIPEMD160.prototype._digest = function digest(enc) {
    if (enc === 'hex')
      return utils$2.toHex32(this.h, 'little');
    else
      return utils$2.split32(this.h, 'little');
  };

  function f(j, x, y, z) {
    if (j <= 15)
      return x ^ y ^ z;
    else if (j <= 31)
      return (x & y) | ((~x) & z);
    else if (j <= 47)
      return (x | (~y)) ^ z;
    else if (j <= 63)
      return (x & z) | (y & (~z));
    else
      return x ^ (y | (~z));
  }

  function K(j) {
    if (j <= 15)
      return 0x00000000;
    else if (j <= 31)
      return 0x5a827999;
    else if (j <= 47)
      return 0x6ed9eba1;
    else if (j <= 63)
      return 0x8f1bbcdc;
    else
      return 0xa953fd4e;
  }

  function Kh(j) {
    if (j <= 15)
      return 0x50a28be6;
    else if (j <= 31)
      return 0x5c4dd124;
    else if (j <= 47)
      return 0x6d703ef3;
    else if (j <= 63)
      return 0x7a6d76e9;
    else
      return 0x00000000;
  }

  var r$1 = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
    7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8,
    3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12,
    1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2,
    4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13
  ];

  var rh = [
    5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12,
    6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2,
    15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13,
    8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14,
    12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11
  ];

  var s = [
    11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8,
    7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12,
    11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5,
    11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12,
    9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6
  ];

  var sh = [
    8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6,
    9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11,
    9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5,
    15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8,
    8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11
  ];

  var ripemd = {
  	ripemd160: ripemd160
  };

  function Hmac(hash, key, enc) {
    if (!(this instanceof Hmac))
      return new Hmac(hash, key, enc);
    this.Hash = hash;
    this.blockSize = hash.blockSize / 8;
    this.outSize = hash.outSize / 8;
    this.inner = null;
    this.outer = null;

    this._init(utils$2.toArray(key, enc));
  }
  var hmac = Hmac;

  Hmac.prototype._init = function init(key) {
    // Shorten key, if needed
    if (key.length > this.blockSize)
      key = new this.Hash().update(key).digest();
    minimalisticAssert(key.length <= this.blockSize);

    // Add padding to key
    for (var i = key.length; i < this.blockSize; i++)
      key.push(0);

    for (i = 0; i < key.length; i++)
      key[i] ^= 0x36;
    this.inner = new this.Hash().update(key);

    // 0x36 ^ 0x5c = 0x6a
    for (i = 0; i < key.length; i++)
      key[i] ^= 0x6a;
    this.outer = new this.Hash().update(key);
  };

  Hmac.prototype.update = function update(msg, enc) {
    this.inner.update(msg, enc);
    return this;
  };

  Hmac.prototype.digest = function digest(enc) {
    this.outer.update(this.inner.digest());
    return this.outer.digest(enc);
  };

  var hash_1 = createCommonjsModule(function (module, exports) {
  var hash = exports;

  hash.utils = utils$2;
  hash.common = common;
  hash.sha = sha;
  hash.ripemd = ripemd;
  hash.hmac = hmac;

  // Proxy hash functions to the main object
  hash.sha1 = hash.sha.sha1;
  hash.sha256 = hash.sha.sha256;
  hash.sha224 = hash.sha.sha224;
  hash.sha384 = hash.sha.sha384;
  hash.sha512 = hash.sha.sha512;
  hash.ripemd160 = hash.ripemd.ripemd160;
  });

  var secp256k1 = {
    doubles: {
      step: 4,
      points: [
        [
          'e60fce93b59e9ec53011aabc21c23e97b2a31369b87a5ae9c44ee89e2a6dec0a',
          'f7e3507399e595929db99f34f57937101296891e44d23f0be1f32cce69616821'
        ],
        [
          '8282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508',
          '11f8a8098557dfe45e8256e830b60ace62d613ac2f7b17bed31b6eaff6e26caf'
        ],
        [
          '175e159f728b865a72f99cc6c6fc846de0b93833fd2222ed73fce5b551e5b739',
          'd3506e0d9e3c79eba4ef97a51ff71f5eacb5955add24345c6efa6ffee9fed695'
        ],
        [
          '363d90d447b00c9c99ceac05b6262ee053441c7e55552ffe526bad8f83ff4640',
          '4e273adfc732221953b445397f3363145b9a89008199ecb62003c7f3bee9de9'
        ],
        [
          '8b4b5f165df3c2be8c6244b5b745638843e4a781a15bcd1b69f79a55dffdf80c',
          '4aad0a6f68d308b4b3fbd7813ab0da04f9e336546162ee56b3eff0c65fd4fd36'
        ],
        [
          '723cbaa6e5db996d6bf771c00bd548c7b700dbffa6c0e77bcb6115925232fcda',
          '96e867b5595cc498a921137488824d6e2660a0653779494801dc069d9eb39f5f'
        ],
        [
          'eebfa4d493bebf98ba5feec812c2d3b50947961237a919839a533eca0e7dd7fa',
          '5d9a8ca3970ef0f269ee7edaf178089d9ae4cdc3a711f712ddfd4fdae1de8999'
        ],
        [
          '100f44da696e71672791d0a09b7bde459f1215a29b3c03bfefd7835b39a48db0',
          'cdd9e13192a00b772ec8f3300c090666b7ff4a18ff5195ac0fbd5cd62bc65a09'
        ],
        [
          'e1031be262c7ed1b1dc9227a4a04c017a77f8d4464f3b3852c8acde6e534fd2d',
          '9d7061928940405e6bb6a4176597535af292dd419e1ced79a44f18f29456a00d'
        ],
        [
          'feea6cae46d55b530ac2839f143bd7ec5cf8b266a41d6af52d5e688d9094696d',
          'e57c6b6c97dce1bab06e4e12bf3ecd5c981c8957cc41442d3155debf18090088'
        ],
        [
          'da67a91d91049cdcb367be4be6ffca3cfeed657d808583de33fa978bc1ec6cb1',
          '9bacaa35481642bc41f463f7ec9780e5dec7adc508f740a17e9ea8e27a68be1d'
        ],
        [
          '53904faa0b334cdda6e000935ef22151ec08d0f7bb11069f57545ccc1a37b7c0',
          '5bc087d0bc80106d88c9eccac20d3c1c13999981e14434699dcb096b022771c8'
        ],
        [
          '8e7bcd0bd35983a7719cca7764ca906779b53a043a9b8bcaeff959f43ad86047',
          '10b7770b2a3da4b3940310420ca9514579e88e2e47fd68b3ea10047e8460372a'
        ],
        [
          '385eed34c1cdff21e6d0818689b81bde71a7f4f18397e6690a841e1599c43862',
          '283bebc3e8ea23f56701de19e9ebf4576b304eec2086dc8cc0458fe5542e5453'
        ],
        [
          '6f9d9b803ecf191637c73a4413dfa180fddf84a5947fbc9c606ed86c3fac3a7',
          '7c80c68e603059ba69b8e2a30e45c4d47ea4dd2f5c281002d86890603a842160'
        ],
        [
          '3322d401243c4e2582a2147c104d6ecbf774d163db0f5e5313b7e0e742d0e6bd',
          '56e70797e9664ef5bfb019bc4ddaf9b72805f63ea2873af624f3a2e96c28b2a0'
        ],
        [
          '85672c7d2de0b7da2bd1770d89665868741b3f9af7643397721d74d28134ab83',
          '7c481b9b5b43b2eb6374049bfa62c2e5e77f17fcc5298f44c8e3094f790313a6'
        ],
        [
          '948bf809b1988a46b06c9f1919413b10f9226c60f668832ffd959af60c82a0a',
          '53a562856dcb6646dc6b74c5d1c3418c6d4dff08c97cd2bed4cb7f88d8c8e589'
        ],
        [
          '6260ce7f461801c34f067ce0f02873a8f1b0e44dfc69752accecd819f38fd8e8',
          'bc2da82b6fa5b571a7f09049776a1ef7ecd292238051c198c1a84e95b2b4ae17'
        ],
        [
          'e5037de0afc1d8d43d8348414bbf4103043ec8f575bfdc432953cc8d2037fa2d',
          '4571534baa94d3b5f9f98d09fb990bddbd5f5b03ec481f10e0e5dc841d755bda'
        ],
        [
          'e06372b0f4a207adf5ea905e8f1771b4e7e8dbd1c6a6c5b725866a0ae4fce725',
          '7a908974bce18cfe12a27bb2ad5a488cd7484a7787104870b27034f94eee31dd'
        ],
        [
          '213c7a715cd5d45358d0bbf9dc0ce02204b10bdde2a3f58540ad6908d0559754',
          '4b6dad0b5ae462507013ad06245ba190bb4850f5f36a7eeddff2c27534b458f2'
        ],
        [
          '4e7c272a7af4b34e8dbb9352a5419a87e2838c70adc62cddf0cc3a3b08fbd53c',
          '17749c766c9d0b18e16fd09f6def681b530b9614bff7dd33e0b3941817dcaae6'
        ],
        [
          'fea74e3dbe778b1b10f238ad61686aa5c76e3db2be43057632427e2840fb27b6',
          '6e0568db9b0b13297cf674deccb6af93126b596b973f7b77701d3db7f23cb96f'
        ],
        [
          '76e64113f677cf0e10a2570d599968d31544e179b760432952c02a4417bdde39',
          'c90ddf8dee4e95cf577066d70681f0d35e2a33d2b56d2032b4b1752d1901ac01'
        ],
        [
          'c738c56b03b2abe1e8281baa743f8f9a8f7cc643df26cbee3ab150242bcbb891',
          '893fb578951ad2537f718f2eacbfbbbb82314eef7880cfe917e735d9699a84c3'
        ],
        [
          'd895626548b65b81e264c7637c972877d1d72e5f3a925014372e9f6588f6c14b',
          'febfaa38f2bc7eae728ec60818c340eb03428d632bb067e179363ed75d7d991f'
        ],
        [
          'b8da94032a957518eb0f6433571e8761ceffc73693e84edd49150a564f676e03',
          '2804dfa44805a1e4d7c99cc9762808b092cc584d95ff3b511488e4e74efdf6e7'
        ],
        [
          'e80fea14441fb33a7d8adab9475d7fab2019effb5156a792f1a11778e3c0df5d',
          'eed1de7f638e00771e89768ca3ca94472d155e80af322ea9fcb4291b6ac9ec78'
        ],
        [
          'a301697bdfcd704313ba48e51d567543f2a182031efd6915ddc07bbcc4e16070',
          '7370f91cfb67e4f5081809fa25d40f9b1735dbf7c0a11a130c0d1a041e177ea1'
        ],
        [
          '90ad85b389d6b936463f9d0512678de208cc330b11307fffab7ac63e3fb04ed4',
          'e507a3620a38261affdcbd9427222b839aefabe1582894d991d4d48cb6ef150'
        ],
        [
          '8f68b9d2f63b5f339239c1ad981f162ee88c5678723ea3351b7b444c9ec4c0da',
          '662a9f2dba063986de1d90c2b6be215dbbea2cfe95510bfdf23cbf79501fff82'
        ],
        [
          'e4f3fb0176af85d65ff99ff9198c36091f48e86503681e3e6686fd5053231e11',
          '1e63633ad0ef4f1c1661a6d0ea02b7286cc7e74ec951d1c9822c38576feb73bc'
        ],
        [
          '8c00fa9b18ebf331eb961537a45a4266c7034f2f0d4e1d0716fb6eae20eae29e',
          'efa47267fea521a1a9dc343a3736c974c2fadafa81e36c54e7d2a4c66702414b'
        ],
        [
          'e7a26ce69dd4829f3e10cec0a9e98ed3143d084f308b92c0997fddfc60cb3e41',
          '2a758e300fa7984b471b006a1aafbb18d0a6b2c0420e83e20e8a9421cf2cfd51'
        ],
        [
          'b6459e0ee3662ec8d23540c223bcbdc571cbcb967d79424f3cf29eb3de6b80ef',
          '67c876d06f3e06de1dadf16e5661db3c4b3ae6d48e35b2ff30bf0b61a71ba45'
        ],
        [
          'd68a80c8280bb840793234aa118f06231d6f1fc67e73c5a5deda0f5b496943e8',
          'db8ba9fff4b586d00c4b1f9177b0e28b5b0e7b8f7845295a294c84266b133120'
        ],
        [
          '324aed7df65c804252dc0270907a30b09612aeb973449cea4095980fc28d3d5d',
          '648a365774b61f2ff130c0c35aec1f4f19213b0c7e332843967224af96ab7c84'
        ],
        [
          '4df9c14919cde61f6d51dfdbe5fee5dceec4143ba8d1ca888e8bd373fd054c96',
          '35ec51092d8728050974c23a1d85d4b5d506cdc288490192ebac06cad10d5d'
        ],
        [
          '9c3919a84a474870faed8a9c1cc66021523489054d7f0308cbfc99c8ac1f98cd',
          'ddb84f0f4a4ddd57584f044bf260e641905326f76c64c8e6be7e5e03d4fc599d'
        ],
        [
          '6057170b1dd12fdf8de05f281d8e06bb91e1493a8b91d4cc5a21382120a959e5',
          '9a1af0b26a6a4807add9a2daf71df262465152bc3ee24c65e899be932385a2a8'
        ],
        [
          'a576df8e23a08411421439a4518da31880cef0fba7d4df12b1a6973eecb94266',
          '40a6bf20e76640b2c92b97afe58cd82c432e10a7f514d9f3ee8be11ae1b28ec8'
        ],
        [
          '7778a78c28dec3e30a05fe9629de8c38bb30d1f5cf9a3a208f763889be58ad71',
          '34626d9ab5a5b22ff7098e12f2ff580087b38411ff24ac563b513fc1fd9f43ac'
        ],
        [
          '928955ee637a84463729fd30e7afd2ed5f96274e5ad7e5cb09eda9c06d903ac',
          'c25621003d3f42a827b78a13093a95eeac3d26efa8a8d83fc5180e935bcd091f'
        ],
        [
          '85d0fef3ec6db109399064f3a0e3b2855645b4a907ad354527aae75163d82751',
          '1f03648413a38c0be29d496e582cf5663e8751e96877331582c237a24eb1f962'
        ],
        [
          'ff2b0dce97eece97c1c9b6041798b85dfdfb6d8882da20308f5404824526087e',
          '493d13fef524ba188af4c4dc54d07936c7b7ed6fb90e2ceb2c951e01f0c29907'
        ],
        [
          '827fbbe4b1e880ea9ed2b2e6301b212b57f1ee148cd6dd28780e5e2cf856e241',
          'c60f9c923c727b0b71bef2c67d1d12687ff7a63186903166d605b68baec293ec'
        ],
        [
          'eaa649f21f51bdbae7be4ae34ce6e5217a58fdce7f47f9aa7f3b58fa2120e2b3',
          'be3279ed5bbbb03ac69a80f89879aa5a01a6b965f13f7e59d47a5305ba5ad93d'
        ],
        [
          'e4a42d43c5cf169d9391df6decf42ee541b6d8f0c9a137401e23632dda34d24f',
          '4d9f92e716d1c73526fc99ccfb8ad34ce886eedfa8d8e4f13a7f7131deba9414'
        ],
        [
          '1ec80fef360cbdd954160fadab352b6b92b53576a88fea4947173b9d4300bf19',
          'aeefe93756b5340d2f3a4958a7abbf5e0146e77f6295a07b671cdc1cc107cefd'
        ],
        [
          '146a778c04670c2f91b00af4680dfa8bce3490717d58ba889ddb5928366642be',
          'b318e0ec3354028add669827f9d4b2870aaa971d2f7e5ed1d0b297483d83efd0'
        ],
        [
          'fa50c0f61d22e5f07e3acebb1aa07b128d0012209a28b9776d76a8793180eef9',
          '6b84c6922397eba9b72cd2872281a68a5e683293a57a213b38cd8d7d3f4f2811'
        ],
        [
          'da1d61d0ca721a11b1a5bf6b7d88e8421a288ab5d5bba5220e53d32b5f067ec2',
          '8157f55a7c99306c79c0766161c91e2966a73899d279b48a655fba0f1ad836f1'
        ],
        [
          'a8e282ff0c9706907215ff98e8fd416615311de0446f1e062a73b0610d064e13',
          '7f97355b8db81c09abfb7f3c5b2515888b679a3e50dd6bd6cef7c73111f4cc0c'
        ],
        [
          '174a53b9c9a285872d39e56e6913cab15d59b1fa512508c022f382de8319497c',
          'ccc9dc37abfc9c1657b4155f2c47f9e6646b3a1d8cb9854383da13ac079afa73'
        ],
        [
          '959396981943785c3d3e57edf5018cdbe039e730e4918b3d884fdff09475b7ba',
          '2e7e552888c331dd8ba0386a4b9cd6849c653f64c8709385e9b8abf87524f2fd'
        ],
        [
          'd2a63a50ae401e56d645a1153b109a8fcca0a43d561fba2dbb51340c9d82b151',
          'e82d86fb6443fcb7565aee58b2948220a70f750af484ca52d4142174dcf89405'
        ],
        [
          '64587e2335471eb890ee7896d7cfdc866bacbdbd3839317b3436f9b45617e073',
          'd99fcdd5bf6902e2ae96dd6447c299a185b90a39133aeab358299e5e9faf6589'
        ],
        [
          '8481bde0e4e4d885b3a546d3e549de042f0aa6cea250e7fd358d6c86dd45e458',
          '38ee7b8cba5404dd84a25bf39cecb2ca900a79c42b262e556d64b1b59779057e'
        ],
        [
          '13464a57a78102aa62b6979ae817f4637ffcfed3c4b1ce30bcd6303f6caf666b',
          '69be159004614580ef7e433453ccb0ca48f300a81d0942e13f495a907f6ecc27'
        ],
        [
          'bc4a9df5b713fe2e9aef430bcc1dc97a0cd9ccede2f28588cada3a0d2d83f366',
          'd3a81ca6e785c06383937adf4b798caa6e8a9fbfa547b16d758d666581f33c1'
        ],
        [
          '8c28a97bf8298bc0d23d8c749452a32e694b65e30a9472a3954ab30fe5324caa',
          '40a30463a3305193378fedf31f7cc0eb7ae784f0451cb9459e71dc73cbef9482'
        ],
        [
          '8ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0',
          '620efabbc8ee2782e24e7c0cfb95c5d735b783be9cf0f8e955af34a30e62b945'
        ],
        [
          'dd3625faef5ba06074669716bbd3788d89bdde815959968092f76cc4eb9a9787',
          '7a188fa3520e30d461da2501045731ca941461982883395937f68d00c644a573'
        ],
        [
          'f710d79d9eb962297e4f6232b40e8f7feb2bc63814614d692c12de752408221e',
          'ea98e67232d3b3295d3b535532115ccac8612c721851617526ae47a9c77bfc82'
        ]
      ]
    },
    naf: {
      wnd: 7,
      points: [
        [
          'f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9',
          '388f7b0f632de8140fe337e62a37f3566500a99934c2231b6cb9fd7584b8e672'
        ],
        [
          '2f8bde4d1a07209355b4a7250a5c5128e88b84bddc619ab7cba8d569b240efe4',
          'd8ac222636e5e3d6d4dba9dda6c9c426f788271bab0d6840dca87d3aa6ac62d6'
        ],
        [
          '5cbdf0646e5db4eaa398f365f2ea7a0e3d419b7e0330e39ce92bddedcac4f9bc',
          '6aebca40ba255960a3178d6d861a54dba813d0b813fde7b5a5082628087264da'
        ],
        [
          'acd484e2f0c7f65309ad178a9f559abde09796974c57e714c35f110dfc27ccbe',
          'cc338921b0a7d9fd64380971763b61e9add888a4375f8e0f05cc262ac64f9c37'
        ],
        [
          '774ae7f858a9411e5ef4246b70c65aac5649980be5c17891bbec17895da008cb',
          'd984a032eb6b5e190243dd56d7b7b365372db1e2dff9d6a8301d74c9c953c61b'
        ],
        [
          'f28773c2d975288bc7d1d205c3748651b075fbc6610e58cddeeddf8f19405aa8',
          'ab0902e8d880a89758212eb65cdaf473a1a06da521fa91f29b5cb52db03ed81'
        ],
        [
          'd7924d4f7d43ea965a465ae3095ff41131e5946f3c85f79e44adbcf8e27e080e',
          '581e2872a86c72a683842ec228cc6defea40af2bd896d3a5c504dc9ff6a26b58'
        ],
        [
          'defdea4cdb677750a420fee807eacf21eb9898ae79b9768766e4faa04a2d4a34',
          '4211ab0694635168e997b0ead2a93daeced1f4a04a95c0f6cfb199f69e56eb77'
        ],
        [
          '2b4ea0a797a443d293ef5cff444f4979f06acfebd7e86d277475656138385b6c',
          '85e89bc037945d93b343083b5a1c86131a01f60c50269763b570c854e5c09b7a'
        ],
        [
          '352bbf4a4cdd12564f93fa332ce333301d9ad40271f8107181340aef25be59d5',
          '321eb4075348f534d59c18259dda3e1f4a1b3b2e71b1039c67bd3d8bcf81998c'
        ],
        [
          '2fa2104d6b38d11b0230010559879124e42ab8dfeff5ff29dc9cdadd4ecacc3f',
          '2de1068295dd865b64569335bd5dd80181d70ecfc882648423ba76b532b7d67'
        ],
        [
          '9248279b09b4d68dab21a9b066edda83263c3d84e09572e269ca0cd7f5453714',
          '73016f7bf234aade5d1aa71bdea2b1ff3fc0de2a887912ffe54a32ce97cb3402'
        ],
        [
          'daed4f2be3a8bf278e70132fb0beb7522f570e144bf615c07e996d443dee8729',
          'a69dce4a7d6c98e8d4a1aca87ef8d7003f83c230f3afa726ab40e52290be1c55'
        ],
        [
          'c44d12c7065d812e8acf28d7cbb19f9011ecd9e9fdf281b0e6a3b5e87d22e7db',
          '2119a460ce326cdc76c45926c982fdac0e106e861edf61c5a039063f0e0e6482'
        ],
        [
          '6a245bf6dc698504c89a20cfded60853152b695336c28063b61c65cbd269e6b4',
          'e022cf42c2bd4a708b3f5126f16a24ad8b33ba48d0423b6efd5e6348100d8a82'
        ],
        [
          '1697ffa6fd9de627c077e3d2fe541084ce13300b0bec1146f95ae57f0d0bd6a5',
          'b9c398f186806f5d27561506e4557433a2cf15009e498ae7adee9d63d01b2396'
        ],
        [
          '605bdb019981718b986d0f07e834cb0d9deb8360ffb7f61df982345ef27a7479',
          '2972d2de4f8d20681a78d93ec96fe23c26bfae84fb14db43b01e1e9056b8c49'
        ],
        [
          '62d14dab4150bf497402fdc45a215e10dcb01c354959b10cfe31c7e9d87ff33d',
          '80fc06bd8cc5b01098088a1950eed0db01aa132967ab472235f5642483b25eaf'
        ],
        [
          '80c60ad0040f27dade5b4b06c408e56b2c50e9f56b9b8b425e555c2f86308b6f',
          '1c38303f1cc5c30f26e66bad7fe72f70a65eed4cbe7024eb1aa01f56430bd57a'
        ],
        [
          '7a9375ad6167ad54aa74c6348cc54d344cc5dc9487d847049d5eabb0fa03c8fb',
          'd0e3fa9eca8726909559e0d79269046bdc59ea10c70ce2b02d499ec224dc7f7'
        ],
        [
          'd528ecd9b696b54c907a9ed045447a79bb408ec39b68df504bb51f459bc3ffc9',
          'eecf41253136e5f99966f21881fd656ebc4345405c520dbc063465b521409933'
        ],
        [
          '49370a4b5f43412ea25f514e8ecdad05266115e4a7ecb1387231808f8b45963',
          '758f3f41afd6ed428b3081b0512fd62a54c3f3afbb5b6764b653052a12949c9a'
        ],
        [
          '77f230936ee88cbbd73df930d64702ef881d811e0e1498e2f1c13eb1fc345d74',
          '958ef42a7886b6400a08266e9ba1b37896c95330d97077cbbe8eb3c7671c60d6'
        ],
        [
          'f2dac991cc4ce4b9ea44887e5c7c0bce58c80074ab9d4dbaeb28531b7739f530',
          'e0dedc9b3b2f8dad4da1f32dec2531df9eb5fbeb0598e4fd1a117dba703a3c37'
        ],
        [
          '463b3d9f662621fb1b4be8fbbe2520125a216cdfc9dae3debcba4850c690d45b',
          '5ed430d78c296c3543114306dd8622d7c622e27c970a1de31cb377b01af7307e'
        ],
        [
          'f16f804244e46e2a09232d4aff3b59976b98fac14328a2d1a32496b49998f247',
          'cedabd9b82203f7e13d206fcdf4e33d92a6c53c26e5cce26d6579962c4e31df6'
        ],
        [
          'caf754272dc84563b0352b7a14311af55d245315ace27c65369e15f7151d41d1',
          'cb474660ef35f5f2a41b643fa5e460575f4fa9b7962232a5c32f908318a04476'
        ],
        [
          '2600ca4b282cb986f85d0f1709979d8b44a09c07cb86d7c124497bc86f082120',
          '4119b88753c15bd6a693b03fcddbb45d5ac6be74ab5f0ef44b0be9475a7e4b40'
        ],
        [
          '7635ca72d7e8432c338ec53cd12220bc01c48685e24f7dc8c602a7746998e435',
          '91b649609489d613d1d5e590f78e6d74ecfc061d57048bad9e76f302c5b9c61'
        ],
        [
          '754e3239f325570cdbbf4a87deee8a66b7f2b33479d468fbc1a50743bf56cc18',
          '673fb86e5bda30fb3cd0ed304ea49a023ee33d0197a695d0c5d98093c536683'
        ],
        [
          'e3e6bd1071a1e96aff57859c82d570f0330800661d1c952f9fe2694691d9b9e8',
          '59c9e0bba394e76f40c0aa58379a3cb6a5a2283993e90c4167002af4920e37f5'
        ],
        [
          '186b483d056a033826ae73d88f732985c4ccb1f32ba35f4b4cc47fdcf04aa6eb',
          '3b952d32c67cf77e2e17446e204180ab21fb8090895138b4a4a797f86e80888b'
        ],
        [
          'df9d70a6b9876ce544c98561f4be4f725442e6d2b737d9c91a8321724ce0963f',
          '55eb2dafd84d6ccd5f862b785dc39d4ab157222720ef9da217b8c45cf2ba2417'
        ],
        [
          '5edd5cc23c51e87a497ca815d5dce0f8ab52554f849ed8995de64c5f34ce7143',
          'efae9c8dbc14130661e8cec030c89ad0c13c66c0d17a2905cdc706ab7399a868'
        ],
        [
          '290798c2b6476830da12fe02287e9e777aa3fba1c355b17a722d362f84614fba',
          'e38da76dcd440621988d00bcf79af25d5b29c094db2a23146d003afd41943e7a'
        ],
        [
          'af3c423a95d9f5b3054754efa150ac39cd29552fe360257362dfdecef4053b45',
          'f98a3fd831eb2b749a93b0e6f35cfb40c8cd5aa667a15581bc2feded498fd9c6'
        ],
        [
          '766dbb24d134e745cccaa28c99bf274906bb66b26dcf98df8d2fed50d884249a',
          '744b1152eacbe5e38dcc887980da38b897584a65fa06cedd2c924f97cbac5996'
        ],
        [
          '59dbf46f8c94759ba21277c33784f41645f7b44f6c596a58ce92e666191abe3e',
          'c534ad44175fbc300f4ea6ce648309a042ce739a7919798cd85e216c4a307f6e'
        ],
        [
          'f13ada95103c4537305e691e74e9a4a8dd647e711a95e73cb62dc6018cfd87b8',
          'e13817b44ee14de663bf4bc808341f326949e21a6a75c2570778419bdaf5733d'
        ],
        [
          '7754b4fa0e8aced06d4167a2c59cca4cda1869c06ebadfb6488550015a88522c',
          '30e93e864e669d82224b967c3020b8fa8d1e4e350b6cbcc537a48b57841163a2'
        ],
        [
          '948dcadf5990e048aa3874d46abef9d701858f95de8041d2a6828c99e2262519',
          'e491a42537f6e597d5d28a3224b1bc25df9154efbd2ef1d2cbba2cae5347d57e'
        ],
        [
          '7962414450c76c1689c7b48f8202ec37fb224cf5ac0bfa1570328a8a3d7c77ab',
          '100b610ec4ffb4760d5c1fc133ef6f6b12507a051f04ac5760afa5b29db83437'
        ],
        [
          '3514087834964b54b15b160644d915485a16977225b8847bb0dd085137ec47ca',
          'ef0afbb2056205448e1652c48e8127fc6039e77c15c2378b7e7d15a0de293311'
        ],
        [
          'd3cc30ad6b483e4bc79ce2c9dd8bc54993e947eb8df787b442943d3f7b527eaf',
          '8b378a22d827278d89c5e9be8f9508ae3c2ad46290358630afb34db04eede0a4'
        ],
        [
          '1624d84780732860ce1c78fcbfefe08b2b29823db913f6493975ba0ff4847610',
          '68651cf9b6da903e0914448c6cd9d4ca896878f5282be4c8cc06e2a404078575'
        ],
        [
          '733ce80da955a8a26902c95633e62a985192474b5af207da6df7b4fd5fc61cd4',
          'f5435a2bd2badf7d485a4d8b8db9fcce3e1ef8e0201e4578c54673bc1dc5ea1d'
        ],
        [
          '15d9441254945064cf1a1c33bbd3b49f8966c5092171e699ef258dfab81c045c',
          'd56eb30b69463e7234f5137b73b84177434800bacebfc685fc37bbe9efe4070d'
        ],
        [
          'a1d0fcf2ec9de675b612136e5ce70d271c21417c9d2b8aaaac138599d0717940',
          'edd77f50bcb5a3cab2e90737309667f2641462a54070f3d519212d39c197a629'
        ],
        [
          'e22fbe15c0af8ccc5780c0735f84dbe9a790badee8245c06c7ca37331cb36980',
          'a855babad5cd60c88b430a69f53a1a7a38289154964799be43d06d77d31da06'
        ],
        [
          '311091dd9860e8e20ee13473c1155f5f69635e394704eaa74009452246cfa9b3',
          '66db656f87d1f04fffd1f04788c06830871ec5a64feee685bd80f0b1286d8374'
        ],
        [
          '34c1fd04d301be89b31c0442d3e6ac24883928b45a9340781867d4232ec2dbdf',
          '9414685e97b1b5954bd46f730174136d57f1ceeb487443dc5321857ba73abee'
        ],
        [
          'f219ea5d6b54701c1c14de5b557eb42a8d13f3abbcd08affcc2a5e6b049b8d63',
          '4cb95957e83d40b0f73af4544cccf6b1f4b08d3c07b27fb8d8c2962a400766d1'
        ],
        [
          'd7b8740f74a8fbaab1f683db8f45de26543a5490bca627087236912469a0b448',
          'fa77968128d9c92ee1010f337ad4717eff15db5ed3c049b3411e0315eaa4593b'
        ],
        [
          '32d31c222f8f6f0ef86f7c98d3a3335ead5bcd32abdd94289fe4d3091aa824bf',
          '5f3032f5892156e39ccd3d7915b9e1da2e6dac9e6f26e961118d14b8462e1661'
        ],
        [
          '7461f371914ab32671045a155d9831ea8793d77cd59592c4340f86cbc18347b5',
          '8ec0ba238b96bec0cbdddcae0aa442542eee1ff50c986ea6b39847b3cc092ff6'
        ],
        [
          'ee079adb1df1860074356a25aa38206a6d716b2c3e67453d287698bad7b2b2d6',
          '8dc2412aafe3be5c4c5f37e0ecc5f9f6a446989af04c4e25ebaac479ec1c8c1e'
        ],
        [
          '16ec93e447ec83f0467b18302ee620f7e65de331874c9dc72bfd8616ba9da6b5',
          '5e4631150e62fb40d0e8c2a7ca5804a39d58186a50e497139626778e25b0674d'
        ],
        [
          'eaa5f980c245f6f038978290afa70b6bd8855897f98b6aa485b96065d537bd99',
          'f65f5d3e292c2e0819a528391c994624d784869d7e6ea67fb18041024edc07dc'
        ],
        [
          '78c9407544ac132692ee1910a02439958ae04877151342ea96c4b6b35a49f51',
          'f3e0319169eb9b85d5404795539a5e68fa1fbd583c064d2462b675f194a3ddb4'
        ],
        [
          '494f4be219a1a77016dcd838431aea0001cdc8ae7a6fc688726578d9702857a5',
          '42242a969283a5f339ba7f075e36ba2af925ce30d767ed6e55f4b031880d562c'
        ],
        [
          'a598a8030da6d86c6bc7f2f5144ea549d28211ea58faa70ebf4c1e665c1fe9b5',
          '204b5d6f84822c307e4b4a7140737aec23fc63b65b35f86a10026dbd2d864e6b'
        ],
        [
          'c41916365abb2b5d09192f5f2dbeafec208f020f12570a184dbadc3e58595997',
          '4f14351d0087efa49d245b328984989d5caf9450f34bfc0ed16e96b58fa9913'
        ],
        [
          '841d6063a586fa475a724604da03bc5b92a2e0d2e0a36acfe4c73a5514742881',
          '73867f59c0659e81904f9a1c7543698e62562d6744c169ce7a36de01a8d6154'
        ],
        [
          '5e95bb399a6971d376026947f89bde2f282b33810928be4ded112ac4d70e20d5',
          '39f23f366809085beebfc71181313775a99c9aed7d8ba38b161384c746012865'
        ],
        [
          '36e4641a53948fd476c39f8a99fd974e5ec07564b5315d8bf99471bca0ef2f66',
          'd2424b1b1abe4eb8164227b085c9aa9456ea13493fd563e06fd51cf5694c78fc'
        ],
        [
          '336581ea7bfbbb290c191a2f507a41cf5643842170e914faeab27c2c579f726',
          'ead12168595fe1be99252129b6e56b3391f7ab1410cd1e0ef3dcdcabd2fda224'
        ],
        [
          '8ab89816dadfd6b6a1f2634fcf00ec8403781025ed6890c4849742706bd43ede',
          '6fdcef09f2f6d0a044e654aef624136f503d459c3e89845858a47a9129cdd24e'
        ],
        [
          '1e33f1a746c9c5778133344d9299fcaa20b0938e8acff2544bb40284b8c5fb94',
          '60660257dd11b3aa9c8ed618d24edff2306d320f1d03010e33a7d2057f3b3b6'
        ],
        [
          '85b7c1dcb3cec1b7ee7f30ded79dd20a0ed1f4cc18cbcfcfa410361fd8f08f31',
          '3d98a9cdd026dd43f39048f25a8847f4fcafad1895d7a633c6fed3c35e999511'
        ],
        [
          '29df9fbd8d9e46509275f4b125d6d45d7fbe9a3b878a7af872a2800661ac5f51',
          'b4c4fe99c775a606e2d8862179139ffda61dc861c019e55cd2876eb2a27d84b'
        ],
        [
          'a0b1cae06b0a847a3fea6e671aaf8adfdfe58ca2f768105c8082b2e449fce252',
          'ae434102edde0958ec4b19d917a6a28e6b72da1834aff0e650f049503a296cf2'
        ],
        [
          '4e8ceafb9b3e9a136dc7ff67e840295b499dfb3b2133e4ba113f2e4c0e121e5',
          'cf2174118c8b6d7a4b48f6d534ce5c79422c086a63460502b827ce62a326683c'
        ],
        [
          'd24a44e047e19b6f5afb81c7ca2f69080a5076689a010919f42725c2b789a33b',
          '6fb8d5591b466f8fc63db50f1c0f1c69013f996887b8244d2cdec417afea8fa3'
        ],
        [
          'ea01606a7a6c9cdd249fdfcfacb99584001edd28abbab77b5104e98e8e3b35d4',
          '322af4908c7312b0cfbfe369f7a7b3cdb7d4494bc2823700cfd652188a3ea98d'
        ],
        [
          'af8addbf2b661c8a6c6328655eb96651252007d8c5ea31be4ad196de8ce2131f',
          '6749e67c029b85f52a034eafd096836b2520818680e26ac8f3dfbcdb71749700'
        ],
        [
          'e3ae1974566ca06cc516d47e0fb165a674a3dabcfca15e722f0e3450f45889',
          '2aeabe7e4531510116217f07bf4d07300de97e4874f81f533420a72eeb0bd6a4'
        ],
        [
          '591ee355313d99721cf6993ffed1e3e301993ff3ed258802075ea8ced397e246',
          'b0ea558a113c30bea60fc4775460c7901ff0b053d25ca2bdeee98f1a4be5d196'
        ],
        [
          '11396d55fda54c49f19aa97318d8da61fa8584e47b084945077cf03255b52984',
          '998c74a8cd45ac01289d5833a7beb4744ff536b01b257be4c5767bea93ea57a4'
        ],
        [
          '3c5d2a1ba39c5a1790000738c9e0c40b8dcdfd5468754b6405540157e017aa7a',
          'b2284279995a34e2f9d4de7396fc18b80f9b8b9fdd270f6661f79ca4c81bd257'
        ],
        [
          'cc8704b8a60a0defa3a99a7299f2e9c3fbc395afb04ac078425ef8a1793cc030',
          'bdd46039feed17881d1e0862db347f8cf395b74fc4bcdc4e940b74e3ac1f1b13'
        ],
        [
          'c533e4f7ea8555aacd9777ac5cad29b97dd4defccc53ee7ea204119b2889b197',
          '6f0a256bc5efdf429a2fb6242f1a43a2d9b925bb4a4b3a26bb8e0f45eb596096'
        ],
        [
          'c14f8f2ccb27d6f109f6d08d03cc96a69ba8c34eec07bbcf566d48e33da6593',
          'c359d6923bb398f7fd4473e16fe1c28475b740dd098075e6c0e8649113dc3a38'
        ],
        [
          'a6cbc3046bc6a450bac24789fa17115a4c9739ed75f8f21ce441f72e0b90e6ef',
          '21ae7f4680e889bb130619e2c0f95a360ceb573c70603139862afd617fa9b9f'
        ],
        [
          '347d6d9a02c48927ebfb86c1359b1caf130a3c0267d11ce6344b39f99d43cc38',
          '60ea7f61a353524d1c987f6ecec92f086d565ab687870cb12689ff1e31c74448'
        ],
        [
          'da6545d2181db8d983f7dcb375ef5866d47c67b1bf31c8cf855ef7437b72656a',
          '49b96715ab6878a79e78f07ce5680c5d6673051b4935bd897fea824b77dc208a'
        ],
        [
          'c40747cc9d012cb1a13b8148309c6de7ec25d6945d657146b9d5994b8feb1111',
          '5ca560753be2a12fc6de6caf2cb489565db936156b9514e1bb5e83037e0fa2d4'
        ],
        [
          '4e42c8ec82c99798ccf3a610be870e78338c7f713348bd34c8203ef4037f3502',
          '7571d74ee5e0fb92a7a8b33a07783341a5492144cc54bcc40a94473693606437'
        ],
        [
          '3775ab7089bc6af823aba2e1af70b236d251cadb0c86743287522a1b3b0dedea',
          'be52d107bcfa09d8bcb9736a828cfa7fac8db17bf7a76a2c42ad961409018cf7'
        ],
        [
          'cee31cbf7e34ec379d94fb814d3d775ad954595d1314ba8846959e3e82f74e26',
          '8fd64a14c06b589c26b947ae2bcf6bfa0149ef0be14ed4d80f448a01c43b1c6d'
        ],
        [
          'b4f9eaea09b6917619f6ea6a4eb5464efddb58fd45b1ebefcdc1a01d08b47986',
          '39e5c9925b5a54b07433a4f18c61726f8bb131c012ca542eb24a8ac07200682a'
        ],
        [
          'd4263dfc3d2df923a0179a48966d30ce84e2515afc3dccc1b77907792ebcc60e',
          '62dfaf07a0f78feb30e30d6295853ce189e127760ad6cf7fae164e122a208d54'
        ],
        [
          '48457524820fa65a4f8d35eb6930857c0032acc0a4a2de422233eeda897612c4',
          '25a748ab367979d98733c38a1fa1c2e7dc6cc07db2d60a9ae7a76aaa49bd0f77'
        ],
        [
          'dfeeef1881101f2cb11644f3a2afdfc2045e19919152923f367a1767c11cceda',
          'ecfb7056cf1de042f9420bab396793c0c390bde74b4bbdff16a83ae09a9a7517'
        ],
        [
          '6d7ef6b17543f8373c573f44e1f389835d89bcbc6062ced36c82df83b8fae859',
          'cd450ec335438986dfefa10c57fea9bcc521a0959b2d80bbf74b190dca712d10'
        ],
        [
          'e75605d59102a5a2684500d3b991f2e3f3c88b93225547035af25af66e04541f',
          'f5c54754a8f71ee540b9b48728473e314f729ac5308b06938360990e2bfad125'
        ],
        [
          'eb98660f4c4dfaa06a2be453d5020bc99a0c2e60abe388457dd43fefb1ed620c',
          '6cb9a8876d9cb8520609af3add26cd20a0a7cd8a9411131ce85f44100099223e'
        ],
        [
          '13e87b027d8514d35939f2e6892b19922154596941888336dc3563e3b8dba942',
          'fef5a3c68059a6dec5d624114bf1e91aac2b9da568d6abeb2570d55646b8adf1'
        ],
        [
          'ee163026e9fd6fe017c38f06a5be6fc125424b371ce2708e7bf4491691e5764a',
          '1acb250f255dd61c43d94ccc670d0f58f49ae3fa15b96623e5430da0ad6c62b2'
        ],
        [
          'b268f5ef9ad51e4d78de3a750c2dc89b1e626d43505867999932e5db33af3d80',
          '5f310d4b3c99b9ebb19f77d41c1dee018cf0d34fd4191614003e945a1216e423'
        ],
        [
          'ff07f3118a9df035e9fad85eb6c7bfe42b02f01ca99ceea3bf7ffdba93c4750d',
          '438136d603e858a3a5c440c38eccbaddc1d2942114e2eddd4740d098ced1f0d8'
        ],
        [
          '8d8b9855c7c052a34146fd20ffb658bea4b9f69e0d825ebec16e8c3ce2b526a1',
          'cdb559eedc2d79f926baf44fb84ea4d44bcf50fee51d7ceb30e2e7f463036758'
        ],
        [
          '52db0b5384dfbf05bfa9d472d7ae26dfe4b851ceca91b1eba54263180da32b63',
          'c3b997d050ee5d423ebaf66a6db9f57b3180c902875679de924b69d84a7b375'
        ],
        [
          'e62f9490d3d51da6395efd24e80919cc7d0f29c3f3fa48c6fff543becbd43352',
          '6d89ad7ba4876b0b22c2ca280c682862f342c8591f1daf5170e07bfd9ccafa7d'
        ],
        [
          '7f30ea2476b399b4957509c88f77d0191afa2ff5cb7b14fd6d8e7d65aaab1193',
          'ca5ef7d4b231c94c3b15389a5f6311e9daff7bb67b103e9880ef4bff637acaec'
        ],
        [
          '5098ff1e1d9f14fb46a210fada6c903fef0fb7b4a1dd1d9ac60a0361800b7a00',
          '9731141d81fc8f8084d37c6e7542006b3ee1b40d60dfe5362a5b132fd17ddc0'
        ],
        [
          '32b78c7de9ee512a72895be6b9cbefa6e2f3c4ccce445c96b9f2c81e2778ad58',
          'ee1849f513df71e32efc3896ee28260c73bb80547ae2275ba497237794c8753c'
        ],
        [
          'e2cb74fddc8e9fbcd076eef2a7c72b0ce37d50f08269dfc074b581550547a4f7',
          'd3aa2ed71c9dd2247a62df062736eb0baddea9e36122d2be8641abcb005cc4a4'
        ],
        [
          '8438447566d4d7bedadc299496ab357426009a35f235cb141be0d99cd10ae3a8',
          'c4e1020916980a4da5d01ac5e6ad330734ef0d7906631c4f2390426b2edd791f'
        ],
        [
          '4162d488b89402039b584c6fc6c308870587d9c46f660b878ab65c82c711d67e',
          '67163e903236289f776f22c25fb8a3afc1732f2b84b4e95dbda47ae5a0852649'
        ],
        [
          '3fad3fa84caf0f34f0f89bfd2dcf54fc175d767aec3e50684f3ba4a4bf5f683d',
          'cd1bc7cb6cc407bb2f0ca647c718a730cf71872e7d0d2a53fa20efcdfe61826'
        ],
        [
          '674f2600a3007a00568c1a7ce05d0816c1fb84bf1370798f1c69532faeb1a86b',
          '299d21f9413f33b3edf43b257004580b70db57da0b182259e09eecc69e0d38a5'
        ],
        [
          'd32f4da54ade74abb81b815ad1fb3b263d82d6c692714bcff87d29bd5ee9f08f',
          'f9429e738b8e53b968e99016c059707782e14f4535359d582fc416910b3eea87'
        ],
        [
          '30e4e670435385556e593657135845d36fbb6931f72b08cb1ed954f1e3ce3ff6',
          '462f9bce619898638499350113bbc9b10a878d35da70740dc695a559eb88db7b'
        ],
        [
          'be2062003c51cc3004682904330e4dee7f3dcd10b01e580bf1971b04d4cad297',
          '62188bc49d61e5428573d48a74e1c655b1c61090905682a0d5558ed72dccb9bc'
        ],
        [
          '93144423ace3451ed29e0fb9ac2af211cb6e84a601df5993c419859fff5df04a',
          '7c10dfb164c3425f5c71a3f9d7992038f1065224f72bb9d1d902a6d13037b47c'
        ],
        [
          'b015f8044f5fcbdcf21ca26d6c34fb8197829205c7b7d2a7cb66418c157b112c',
          'ab8c1e086d04e813744a655b2df8d5f83b3cdc6faa3088c1d3aea1454e3a1d5f'
        ],
        [
          'd5e9e1da649d97d89e4868117a465a3a4f8a18de57a140d36b3f2af341a21b52',
          '4cb04437f391ed73111a13cc1d4dd0db1693465c2240480d8955e8592f27447a'
        ],
        [
          'd3ae41047dd7ca065dbf8ed77b992439983005cd72e16d6f996a5316d36966bb',
          'bd1aeb21ad22ebb22a10f0303417c6d964f8cdd7df0aca614b10dc14d125ac46'
        ],
        [
          '463e2763d885f958fc66cdd22800f0a487197d0a82e377b49f80af87c897b065',
          'bfefacdb0e5d0fd7df3a311a94de062b26b80c61fbc97508b79992671ef7ca7f'
        ],
        [
          '7985fdfd127c0567c6f53ec1bb63ec3158e597c40bfe747c83cddfc910641917',
          '603c12daf3d9862ef2b25fe1de289aed24ed291e0ec6708703a5bd567f32ed03'
        ],
        [
          '74a1ad6b5f76e39db2dd249410eac7f99e74c59cb83d2d0ed5ff1543da7703e9',
          'cc6157ef18c9c63cd6193d83631bbea0093e0968942e8c33d5737fd790e0db08'
        ],
        [
          '30682a50703375f602d416664ba19b7fc9bab42c72747463a71d0896b22f6da3',
          '553e04f6b018b4fa6c8f39e7f311d3176290d0e0f19ca73f17714d9977a22ff8'
        ],
        [
          '9e2158f0d7c0d5f26c3791efefa79597654e7a2b2464f52b1ee6c1347769ef57',
          '712fcdd1b9053f09003a3481fa7762e9ffd7c8ef35a38509e2fbf2629008373'
        ],
        [
          '176e26989a43c9cfeba4029c202538c28172e566e3c4fce7322857f3be327d66',
          'ed8cc9d04b29eb877d270b4878dc43c19aefd31f4eee09ee7b47834c1fa4b1c3'
        ],
        [
          '75d46efea3771e6e68abb89a13ad747ecf1892393dfc4f1b7004788c50374da8',
          '9852390a99507679fd0b86fd2b39a868d7efc22151346e1a3ca4726586a6bed8'
        ],
        [
          '809a20c67d64900ffb698c4c825f6d5f2310fb0451c869345b7319f645605721',
          '9e994980d9917e22b76b061927fa04143d096ccc54963e6a5ebfa5f3f8e286c1'
        ],
        [
          '1b38903a43f7f114ed4500b4eac7083fdefece1cf29c63528d563446f972c180',
          '4036edc931a60ae889353f77fd53de4a2708b26b6f5da72ad3394119daf408f9'
        ]
      ]
    }
  };

  var curves_1 = createCommonjsModule(function (module, exports) {

  var curves = exports;




  var assert = elliptic_1.utils.assert;

  function PresetCurve(options) {
    if (options.type === 'short')
      this.curve = new elliptic_1.curve.short(options);
    else if (options.type === 'edwards')
      this.curve = new elliptic_1.curve.edwards(options);
    else
      this.curve = new elliptic_1.curve.mont(options);
    this.g = this.curve.g;
    this.n = this.curve.n;
    this.hash = options.hash;

    assert(this.g.validate(), 'Invalid curve');
    assert(this.g.mul(this.n).isInfinity(), 'Invalid curve, G*N != O');
  }
  curves.PresetCurve = PresetCurve;

  function defineCurve(name, options) {
    Object.defineProperty(curves, name, {
      configurable: true,
      enumerable: true,
      get: function() {
        var curve = new PresetCurve(options);
        Object.defineProperty(curves, name, {
          configurable: true,
          enumerable: true,
          value: curve
        });
        return curve;
      }
    });
  }

  defineCurve('p192', {
    type: 'short',
    prime: 'p192',
    p: 'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff',
    a: 'ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc',
    b: '64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1',
    n: 'ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831',
    hash: hash_1.sha256,
    gRed: false,
    g: [
      '188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012',
      '07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811'
    ]
  });

  defineCurve('p224', {
    type: 'short',
    prime: 'p224',
    p: 'ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001',
    a: 'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe',
    b: 'b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4',
    n: 'ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d',
    hash: hash_1.sha256,
    gRed: false,
    g: [
      'b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21',
      'bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34'
    ]
  });

  defineCurve('p256', {
    type: 'short',
    prime: null,
    p: 'ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff',
    a: 'ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc',
    b: '5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b',
    n: 'ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551',
    hash: hash_1.sha256,
    gRed: false,
    g: [
      '6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296',
      '4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5'
    ]
  });

  defineCurve('p384', {
    type: 'short',
    prime: null,
    p: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
       'fffffffe ffffffff 00000000 00000000 ffffffff',
    a: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
       'fffffffe ffffffff 00000000 00000000 fffffffc',
    b: 'b3312fa7 e23ee7e4 988e056b e3f82d19 181d9c6e fe814112 0314088f ' +
       '5013875a c656398d 8a2ed19d 2a85c8ed d3ec2aef',
    n: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff c7634d81 ' +
       'f4372ddf 581a0db2 48b0a77a ecec196a ccc52973',
    hash: hash_1.sha384,
    gRed: false,
    g: [
      'aa87ca22 be8b0537 8eb1c71e f320ad74 6e1d3b62 8ba79b98 59f741e0 82542a38 ' +
      '5502f25d bf55296c 3a545e38 72760ab7',
      '3617de4a 96262c6f 5d9e98bf 9292dc29 f8f41dbd 289a147c e9da3113 b5f0b8c0 ' +
      '0a60b1ce 1d7e819d 7a431d7c 90ea0e5f'
    ]
  });

  defineCurve('p521', {
    type: 'short',
    prime: null,
    p: '000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
       'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
       'ffffffff ffffffff ffffffff ffffffff ffffffff',
    a: '000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
       'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
       'ffffffff ffffffff ffffffff ffffffff fffffffc',
    b: '00000051 953eb961 8e1c9a1f 929a21a0 b68540ee a2da725b ' +
       '99b315f3 b8b48991 8ef109e1 56193951 ec7e937b 1652c0bd ' +
       '3bb1bf07 3573df88 3d2c34f1 ef451fd4 6b503f00',
    n: '000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
       'ffffffff ffffffff fffffffa 51868783 bf2f966b 7fcc0148 ' +
       'f709a5d0 3bb5c9b8 899c47ae bb6fb71e 91386409',
    hash: hash_1.sha512,
    gRed: false,
    g: [
      '000000c6 858e06b7 0404e9cd 9e3ecb66 2395b442 9c648139 ' +
      '053fb521 f828af60 6b4d3dba a14b5e77 efe75928 fe1dc127 ' +
      'a2ffa8de 3348b3c1 856a429b f97e7e31 c2e5bd66',
      '00000118 39296a78 9a3bc004 5c8a5fb4 2c7d1bd9 98f54449 ' +
      '579b4468 17afbd17 273e662c 97ee7299 5ef42640 c550b901 ' +
      '3fad0761 353c7086 a272c240 88be9476 9fd16650'
    ]
  });

  defineCurve('curve25519', {
    type: 'mont',
    prime: 'p25519',
    p: '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed',
    a: '76d06',
    b: '1',
    n: '1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed',
    hash: hash_1.sha256,
    gRed: false,
    g: [
      '9'
    ]
  });

  defineCurve('ed25519', {
    type: 'edwards',
    prime: 'p25519',
    p: '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed',
    a: '-1',
    c: '1',
    // -121665 * (121666^(-1)) (mod P)
    d: '52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3',
    n: '1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed',
    hash: hash_1.sha256,
    gRed: false,
    g: [
      '216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a',

      // 4/5
      '6666666666666666666666666666666666666666666666666666666666666658'
    ]
  });

  var pre;
  try {
    pre = secp256k1;
  } catch (e) {
    pre = undefined;
  }

  defineCurve('secp256k1', {
    type: 'short',
    prime: 'k256',
    p: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f',
    a: '0',
    b: '7',
    n: 'ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141',
    h: '1',
    hash: hash_1.sha256,

    // Precomputed endomorphism
    beta: '7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee',
    lambda: '5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72',
    basis: [
      {
        a: '3086d221a7d46bcde86c90e49284eb15',
        b: '-e4437ed6010e88286f547fa90abfe4c3'
      },
      {
        a: '114ca50f7a8e2f3f657c1108d9d44cfd8',
        b: '3086d221a7d46bcde86c90e49284eb15'
      }
    ],

    gRed: false,
    g: [
      '79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798',
      '483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8',
      pre
    ]
  });
  });

  function HmacDRBG(options) {
    if (!(this instanceof HmacDRBG))
      return new HmacDRBG(options);
    this.hash = options.hash;
    this.predResist = !!options.predResist;

    this.outLen = this.hash.outSize;
    this.minEntropy = options.minEntropy || this.hash.hmacStrength;

    this._reseed = null;
    this.reseedInterval = null;
    this.K = null;
    this.V = null;

    var entropy = utils_1.toArray(options.entropy, options.entropyEnc || 'hex');
    var nonce = utils_1.toArray(options.nonce, options.nonceEnc || 'hex');
    var pers = utils_1.toArray(options.pers, options.persEnc || 'hex');
    minimalisticAssert(entropy.length >= (this.minEntropy / 8),
           'Not enough entropy. Minimum is: ' + this.minEntropy + ' bits');
    this._init(entropy, nonce, pers);
  }
  var hmacDrbg = HmacDRBG;

  HmacDRBG.prototype._init = function init(entropy, nonce, pers) {
    var seed = entropy.concat(nonce).concat(pers);

    this.K = new Array(this.outLen / 8);
    this.V = new Array(this.outLen / 8);
    for (var i = 0; i < this.V.length; i++) {
      this.K[i] = 0x00;
      this.V[i] = 0x01;
    }

    this._update(seed);
    this._reseed = 1;
    this.reseedInterval = 0x1000000000000;  // 2^48
  };

  HmacDRBG.prototype._hmac = function hmac() {
    return new hash_1.hmac(this.hash, this.K);
  };

  HmacDRBG.prototype._update = function update(seed) {
    var kmac = this._hmac()
                   .update(this.V)
                   .update([ 0x00 ]);
    if (seed)
      kmac = kmac.update(seed);
    this.K = kmac.digest();
    this.V = this._hmac().update(this.V).digest();
    if (!seed)
      return;

    this.K = this._hmac()
                 .update(this.V)
                 .update([ 0x01 ])
                 .update(seed)
                 .digest();
    this.V = this._hmac().update(this.V).digest();
  };

  HmacDRBG.prototype.reseed = function reseed(entropy, entropyEnc, add, addEnc) {
    // Optional entropy enc
    if (typeof entropyEnc !== 'string') {
      addEnc = add;
      add = entropyEnc;
      entropyEnc = null;
    }

    entropy = utils_1.toArray(entropy, entropyEnc);
    add = utils_1.toArray(add, addEnc);

    minimalisticAssert(entropy.length >= (this.minEntropy / 8),
           'Not enough entropy. Minimum is: ' + this.minEntropy + ' bits');

    this._update(entropy.concat(add || []));
    this._reseed = 1;
  };

  HmacDRBG.prototype.generate = function generate(len, enc, add, addEnc) {
    if (this._reseed > this.reseedInterval)
      throw new Error('Reseed is required');

    // Optional encoding
    if (typeof enc !== 'string') {
      addEnc = add;
      add = enc;
      enc = null;
    }

    // Optional additional data
    if (add) {
      add = utils_1.toArray(add, addEnc || 'hex');
      this._update(add);
    }

    var temp = [];
    while (temp.length < len) {
      this.V = this._hmac().update(this.V).digest();
      temp = temp.concat(this.V);
    }

    var res = temp.slice(0, len);
    this._update(add);
    this._reseed++;
    return utils_1.encode(res, enc);
  };

  var utils$3 = elliptic_1.utils;
  var assert$4 = utils$3.assert;

  function KeyPair(ec, options) {
    this.ec = ec;
    this.priv = null;
    this.pub = null;

    // KeyPair(ec, { priv: ..., pub: ... })
    if (options.priv)
      this._importPrivate(options.priv, options.privEnc);
    if (options.pub)
      this._importPublic(options.pub, options.pubEnc);
  }
  var key = KeyPair;

  KeyPair.fromPublic = function fromPublic(ec, pub, enc) {
    if (pub instanceof KeyPair)
      return pub;

    return new KeyPair(ec, {
      pub: pub,
      pubEnc: enc
    });
  };

  KeyPair.fromPrivate = function fromPrivate(ec, priv, enc) {
    if (priv instanceof KeyPair)
      return priv;

    return new KeyPair(ec, {
      priv: priv,
      privEnc: enc
    });
  };

  KeyPair.prototype.validate = function validate() {
    var pub = this.getPublic();

    if (pub.isInfinity())
      return { result: false, reason: 'Invalid public key' };
    if (!pub.validate())
      return { result: false, reason: 'Public key is not a point' };
    if (!pub.mul(this.ec.curve.n).isInfinity())
      return { result: false, reason: 'Public key * N != O' };

    return { result: true, reason: null };
  };

  KeyPair.prototype.getPublic = function getPublic(compact, enc) {
    // compact is optional argument
    if (typeof compact === 'string') {
      enc = compact;
      compact = null;
    }

    if (!this.pub)
      this.pub = this.ec.g.mul(this.priv);

    if (!enc)
      return this.pub;

    return this.pub.encode(enc, compact);
  };

  KeyPair.prototype.getPrivate = function getPrivate(enc) {
    if (enc === 'hex')
      return this.priv.toString(16, 2);
    else
      return this.priv;
  };

  KeyPair.prototype._importPrivate = function _importPrivate(key, enc) {
    this.priv = new bn(key, enc || 16);

    // Ensure that the priv won't be bigger than n, otherwise we may fail
    // in fixed multiplication method
    this.priv = this.priv.umod(this.ec.curve.n);
  };

  KeyPair.prototype._importPublic = function _importPublic(key, enc) {
    if (key.x || key.y) {
      // Montgomery points only have an `x` coordinate.
      // Weierstrass/Edwards points on the other hand have both `x` and
      // `y` coordinates.
      if (this.ec.curve.type === 'mont') {
        assert$4(key.x, 'Need x coordinate');
      } else if (this.ec.curve.type === 'short' ||
                 this.ec.curve.type === 'edwards') {
        assert$4(key.x && key.y, 'Need both x and y coordinate');
      }
      this.pub = this.ec.curve.point(key.x, key.y);
      return;
    }
    this.pub = this.ec.curve.decodePoint(key, enc);
  };

  // ECDH
  KeyPair.prototype.derive = function derive(pub) {
    return pub.mul(this.priv).getX();
  };

  // ECDSA
  KeyPair.prototype.sign = function sign(msg, enc, options) {
    return this.ec.sign(msg, this, enc, options);
  };

  KeyPair.prototype.verify = function verify(msg, signature) {
    return this.ec.verify(msg, signature, this);
  };

  KeyPair.prototype.inspect = function inspect() {
    return '<Key priv: ' + (this.priv && this.priv.toString(16, 2)) +
           ' pub: ' + (this.pub && this.pub.inspect()) + ' >';
  };

  var utils$4 = elliptic_1.utils;
  var assert$5 = utils$4.assert;

  function Signature(options, enc) {
    if (options instanceof Signature)
      return options;

    if (this._importDER(options, enc))
      return;

    assert$5(options.r && options.s, 'Signature without r or s');
    this.r = new bn(options.r, 16);
    this.s = new bn(options.s, 16);
    if (options.recoveryParam === undefined)
      this.recoveryParam = null;
    else
      this.recoveryParam = options.recoveryParam;
  }
  var signature = Signature;

  function Position() {
    this.place = 0;
  }

  function getLength(buf, p) {
    var initial = buf[p.place++];
    if (!(initial & 0x80)) {
      return initial;
    }
    var octetLen = initial & 0xf;
    var val = 0;
    for (var i = 0, off = p.place; i < octetLen; i++, off++) {
      val <<= 8;
      val |= buf[off];
    }
    p.place = off;
    return val;
  }

  function rmPadding(buf) {
    var i = 0;
    var len = buf.length - 1;
    while (!buf[i] && !(buf[i + 1] & 0x80) && i < len) {
      i++;
    }
    if (i === 0) {
      return buf;
    }
    return buf.slice(i);
  }

  Signature.prototype._importDER = function _importDER(data, enc) {
    data = utils$4.toArray(data, enc);
    var p = new Position();
    if (data[p.place++] !== 0x30) {
      return false;
    }
    var len = getLength(data, p);
    if ((len + p.place) !== data.length) {
      return false;
    }
    if (data[p.place++] !== 0x02) {
      return false;
    }
    var rlen = getLength(data, p);
    var r = data.slice(p.place, rlen + p.place);
    p.place += rlen;
    if (data[p.place++] !== 0x02) {
      return false;
    }
    var slen = getLength(data, p);
    if (data.length !== slen + p.place) {
      return false;
    }
    var s = data.slice(p.place, slen + p.place);
    if (r[0] === 0 && (r[1] & 0x80)) {
      r = r.slice(1);
    }
    if (s[0] === 0 && (s[1] & 0x80)) {
      s = s.slice(1);
    }

    this.r = new bn(r);
    this.s = new bn(s);
    this.recoveryParam = null;

    return true;
  };

  function constructLength(arr, len) {
    if (len < 0x80) {
      arr.push(len);
      return;
    }
    var octets = 1 + (Math.log(len) / Math.LN2 >>> 3);
    arr.push(octets | 0x80);
    while (--octets) {
      arr.push((len >>> (octets << 3)) & 0xff);
    }
    arr.push(len);
  }

  Signature.prototype.toDER = function toDER(enc) {
    var r = this.r.toArray();
    var s = this.s.toArray();

    // Pad values
    if (r[0] & 0x80)
      r = [ 0 ].concat(r);
    // Pad values
    if (s[0] & 0x80)
      s = [ 0 ].concat(s);

    r = rmPadding(r);
    s = rmPadding(s);

    while (!s[0] && !(s[1] & 0x80)) {
      s = s.slice(1);
    }
    var arr = [ 0x02 ];
    constructLength(arr, r.length);
    arr = arr.concat(r);
    arr.push(0x02);
    constructLength(arr, s.length);
    var backHalf = arr.concat(s);
    var res = [ 0x30 ];
    constructLength(res, backHalf.length);
    res = res.concat(backHalf);
    return utils$4.encode(res, enc);
  };

  var utils$5 = elliptic_1.utils;
  var assert$6 = utils$5.assert;




  function EC(options) {
    if (!(this instanceof EC))
      return new EC(options);

    // Shortcut `elliptic.ec(curve-name)`
    if (typeof options === 'string') {
      assert$6(elliptic_1.curves.hasOwnProperty(options), 'Unknown curve ' + options);

      options = elliptic_1.curves[options];
    }

    // Shortcut for `elliptic.ec(elliptic.curves.curveName)`
    if (options instanceof elliptic_1.curves.PresetCurve)
      options = { curve: options };

    this.curve = options.curve.curve;
    this.n = this.curve.n;
    this.nh = this.n.ushrn(1);
    this.g = this.curve.g;

    // Point on curve
    this.g = options.curve.g;
    this.g.precompute(options.curve.n.bitLength() + 1);

    // Hash for function for DRBG
    this.hash = options.hash || options.curve.hash;
  }
  var ec = EC;

  EC.prototype.keyPair = function keyPair(options) {
    return new key(this, options);
  };

  EC.prototype.keyFromPrivate = function keyFromPrivate(priv, enc) {
    return key.fromPrivate(this, priv, enc);
  };

  EC.prototype.keyFromPublic = function keyFromPublic(pub, enc) {
    return key.fromPublic(this, pub, enc);
  };

  EC.prototype.genKeyPair = function genKeyPair(options) {
    if (!options)
      options = {};

    // Instantiate Hmac_DRBG
    var drbg = new hmacDrbg({
      hash: this.hash,
      pers: options.pers,
      persEnc: options.persEnc || 'utf8',
      entropy: options.entropy || elliptic_1.rand(this.hash.hmacStrength),
      entropyEnc: options.entropy && options.entropyEnc || 'utf8',
      nonce: this.n.toArray()
    });

    var bytes = this.n.byteLength();
    var ns2 = this.n.sub(new bn(2));
    do {
      var priv = new bn(drbg.generate(bytes));
      if (priv.cmp(ns2) > 0)
        continue;

      priv.iaddn(1);
      return this.keyFromPrivate(priv);
    } while (true);
  };

  EC.prototype._truncateToN = function truncateToN(msg, truncOnly) {
    var delta = msg.byteLength() * 8 - this.n.bitLength();
    if (delta > 0)
      msg = msg.ushrn(delta);
    if (!truncOnly && msg.cmp(this.n) >= 0)
      return msg.sub(this.n);
    else
      return msg;
  };

  EC.prototype.sign = function sign(msg, key, enc, options) {
    if (typeof enc === 'object') {
      options = enc;
      enc = null;
    }
    if (!options)
      options = {};

    key = this.keyFromPrivate(key, enc);
    msg = this._truncateToN(new bn(msg, 16));

    // Zero-extend key to provide enough entropy
    var bytes = this.n.byteLength();
    var bkey = key.getPrivate().toArray('be', bytes);

    // Zero-extend nonce to have the same byte size as N
    var nonce = msg.toArray('be', bytes);

    // Instantiate Hmac_DRBG
    var drbg = new hmacDrbg({
      hash: this.hash,
      entropy: bkey,
      nonce: nonce,
      pers: options.pers,
      persEnc: options.persEnc || 'utf8'
    });

    // Number of bytes to generate
    var ns1 = this.n.sub(new bn(1));

    for (var iter = 0; true; iter++) {
      var k = options.k ?
          options.k(iter) :
          new bn(drbg.generate(this.n.byteLength()));
      k = this._truncateToN(k, true);
      if (k.cmpn(1) <= 0 || k.cmp(ns1) >= 0)
        continue;

      var kp = this.g.mul(k);
      if (kp.isInfinity())
        continue;

      var kpX = kp.getX();
      var r = kpX.umod(this.n);
      if (r.cmpn(0) === 0)
        continue;

      var s = k.invm(this.n).mul(r.mul(key.getPrivate()).iadd(msg));
      s = s.umod(this.n);
      if (s.cmpn(0) === 0)
        continue;

      var recoveryParam = (kp.getY().isOdd() ? 1 : 0) |
                          (kpX.cmp(r) !== 0 ? 2 : 0);

      // Use complement of `s`, if it is > `n / 2`
      if (options.canonical && s.cmp(this.nh) > 0) {
        s = this.n.sub(s);
        recoveryParam ^= 1;
      }

      return new signature({ r: r, s: s, recoveryParam: recoveryParam });
    }
  };

  EC.prototype.verify = function verify(msg, signature$1, key, enc) {
    msg = this._truncateToN(new bn(msg, 16));
    key = this.keyFromPublic(key, enc);
    signature$1 = new signature(signature$1, 'hex');

    // Perform primitive values validation
    var r = signature$1.r;
    var s = signature$1.s;
    if (r.cmpn(1) < 0 || r.cmp(this.n) >= 0)
      return false;
    if (s.cmpn(1) < 0 || s.cmp(this.n) >= 0)
      return false;

    // Validate signature
    var sinv = s.invm(this.n);
    var u1 = sinv.mul(msg).umod(this.n);
    var u2 = sinv.mul(r).umod(this.n);

    if (!this.curve._maxwellTrick) {
      var p = this.g.mulAdd(u1, key.getPublic(), u2);
      if (p.isInfinity())
        return false;

      return p.getX().umod(this.n).cmp(r) === 0;
    }

    // NOTE: Greg Maxwell's trick, inspired by:
    // https://git.io/vad3K

    var p = this.g.jmulAdd(u1, key.getPublic(), u2);
    if (p.isInfinity())
      return false;

    // Compare `p.x` of Jacobian point with `r`,
    // this will do `p.x == r * p.z^2` instead of multiplying `p.x` by the
    // inverse of `p.z^2`
    return p.eqXToP(r);
  };

  EC.prototype.recoverPubKey = function(msg, signature$1, j, enc) {
    assert$6((3 & j) === j, 'The recovery param is more than two bits');
    signature$1 = new signature(signature$1, enc);

    var n = this.n;
    var e = new bn(msg);
    var r = signature$1.r;
    var s = signature$1.s;

    // A set LSB signifies that the y-coordinate is odd
    var isYOdd = j & 1;
    var isSecondKey = j >> 1;
    if (r.cmp(this.curve.p.umod(this.curve.n)) >= 0 && isSecondKey)
      throw new Error('Unable to find sencond key candinate');

    // 1.1. Let x = r + jn.
    if (isSecondKey)
      r = this.curve.pointFromX(r.add(this.curve.n), isYOdd);
    else
      r = this.curve.pointFromX(r, isYOdd);

    var rInv = signature$1.r.invm(n);
    var s1 = n.sub(e).mul(rInv).umod(n);
    var s2 = s.mul(rInv).umod(n);

    // 1.6.1 Compute Q = r^-1 (sR -  eG)
    //               Q = r^-1 (sR + -eG)
    return this.g.mulAdd(s1, r, s2);
  };

  EC.prototype.getKeyRecoveryParam = function(e, signature$1, Q, enc) {
    signature$1 = new signature(signature$1, enc);
    if (signature$1.recoveryParam !== null)
      return signature$1.recoveryParam;

    for (var i = 0; i < 4; i++) {
      var Qprime;
      try {
        Qprime = this.recoverPubKey(e, signature$1, i);
      } catch (e) {
        continue;
      }

      if (Qprime.eq(Q))
        return i;
    }
    throw new Error('Unable to find valid recovery factor');
  };

  var utils$6 = elliptic_1.utils;
  var assert$7 = utils$6.assert;
  var parseBytes = utils$6.parseBytes;
  var cachedProperty = utils$6.cachedProperty;

  /**
  * @param {EDDSA} eddsa - instance
  * @param {Object} params - public/private key parameters
  *
  * @param {Array<Byte>} [params.secret] - secret seed bytes
  * @param {Point} [params.pub] - public key point (aka `A` in eddsa terms)
  * @param {Array<Byte>} [params.pub] - public key point encoded as bytes
  *
  */
  function KeyPair$1(eddsa, params) {
    this.eddsa = eddsa;
    this._secret = parseBytes(params.secret);
    if (eddsa.isPoint(params.pub))
      this._pub = params.pub;
    else
      this._pubBytes = parseBytes(params.pub);
  }

  KeyPair$1.fromPublic = function fromPublic(eddsa, pub) {
    if (pub instanceof KeyPair$1)
      return pub;
    return new KeyPair$1(eddsa, { pub: pub });
  };

  KeyPair$1.fromSecret = function fromSecret(eddsa, secret) {
    if (secret instanceof KeyPair$1)
      return secret;
    return new KeyPair$1(eddsa, { secret: secret });
  };

  KeyPair$1.prototype.secret = function secret() {
    return this._secret;
  };

  cachedProperty(KeyPair$1, 'pubBytes', function pubBytes() {
    return this.eddsa.encodePoint(this.pub());
  });

  cachedProperty(KeyPair$1, 'pub', function pub() {
    if (this._pubBytes)
      return this.eddsa.decodePoint(this._pubBytes);
    return this.eddsa.g.mul(this.priv());
  });

  cachedProperty(KeyPair$1, 'privBytes', function privBytes() {
    var eddsa = this.eddsa;
    var hash = this.hash();
    var lastIx = eddsa.encodingLength - 1;

    var a = hash.slice(0, eddsa.encodingLength);
    a[0] &= 248;
    a[lastIx] &= 127;
    a[lastIx] |= 64;

    return a;
  });

  cachedProperty(KeyPair$1, 'priv', function priv() {
    return this.eddsa.decodeInt(this.privBytes());
  });

  cachedProperty(KeyPair$1, 'hash', function hash() {
    return this.eddsa.hash().update(this.secret()).digest();
  });

  cachedProperty(KeyPair$1, 'messagePrefix', function messagePrefix() {
    return this.hash().slice(this.eddsa.encodingLength);
  });

  KeyPair$1.prototype.sign = function sign(message) {
    assert$7(this._secret, 'KeyPair can only verify');
    return this.eddsa.sign(message, this);
  };

  KeyPair$1.prototype.verify = function verify(message, sig) {
    return this.eddsa.verify(message, sig, this);
  };

  KeyPair$1.prototype.getSecret = function getSecret(enc) {
    assert$7(this._secret, 'KeyPair is public only');
    return utils$6.encode(this.secret(), enc);
  };

  KeyPair$1.prototype.getPublic = function getPublic(enc) {
    return utils$6.encode(this.pubBytes(), enc);
  };

  var key$1 = KeyPair$1;

  var utils$7 = elliptic_1.utils;
  var assert$8 = utils$7.assert;
  var cachedProperty$1 = utils$7.cachedProperty;
  var parseBytes$1 = utils$7.parseBytes;

  /**
  * @param {EDDSA} eddsa - eddsa instance
  * @param {Array<Bytes>|Object} sig -
  * @param {Array<Bytes>|Point} [sig.R] - R point as Point or bytes
  * @param {Array<Bytes>|bn} [sig.S] - S scalar as bn or bytes
  * @param {Array<Bytes>} [sig.Rencoded] - R point encoded
  * @param {Array<Bytes>} [sig.Sencoded] - S scalar encoded
  */
  function Signature$1(eddsa, sig) {
    this.eddsa = eddsa;

    if (typeof sig !== 'object')
      sig = parseBytes$1(sig);

    if (Array.isArray(sig)) {
      sig = {
        R: sig.slice(0, eddsa.encodingLength),
        S: sig.slice(eddsa.encodingLength)
      };
    }

    assert$8(sig.R && sig.S, 'Signature without R or S');

    if (eddsa.isPoint(sig.R))
      this._R = sig.R;
    if (sig.S instanceof bn)
      this._S = sig.S;

    this._Rencoded = Array.isArray(sig.R) ? sig.R : sig.Rencoded;
    this._Sencoded = Array.isArray(sig.S) ? sig.S : sig.Sencoded;
  }

  cachedProperty$1(Signature$1, 'S', function S() {
    return this.eddsa.decodeInt(this.Sencoded());
  });

  cachedProperty$1(Signature$1, 'R', function R() {
    return this.eddsa.decodePoint(this.Rencoded());
  });

  cachedProperty$1(Signature$1, 'Rencoded', function Rencoded() {
    return this.eddsa.encodePoint(this.R());
  });

  cachedProperty$1(Signature$1, 'Sencoded', function Sencoded() {
    return this.eddsa.encodeInt(this.S());
  });

  Signature$1.prototype.toBytes = function toBytes() {
    return this.Rencoded().concat(this.Sencoded());
  };

  Signature$1.prototype.toHex = function toHex() {
    return utils$7.encode(this.toBytes(), 'hex').toUpperCase();
  };

  var signature$1 = Signature$1;

  var utils$8 = elliptic_1.utils;
  var assert$9 = utils$8.assert;
  var parseBytes$2 = utils$8.parseBytes;



  function EDDSA(curve) {
    assert$9(curve === 'ed25519', 'only tested with ed25519 so far');

    if (!(this instanceof EDDSA))
      return new EDDSA(curve);

    var curve = elliptic_1.curves[curve].curve;
    this.curve = curve;
    this.g = curve.g;
    this.g.precompute(curve.n.bitLength() + 1);

    this.pointClass = curve.point().constructor;
    this.encodingLength = Math.ceil(curve.n.bitLength() / 8);
    this.hash = hash_1.sha512;
  }

  var eddsa = EDDSA;

  /**
  * @param {Array|String} message - message bytes
  * @param {Array|String|KeyPair} secret - secret bytes or a keypair
  * @returns {Signature} - signature
  */
  EDDSA.prototype.sign = function sign(message, secret) {
    message = parseBytes$2(message);
    var key = this.keyFromSecret(secret);
    var r = this.hashInt(key.messagePrefix(), message);
    var R = this.g.mul(r);
    var Rencoded = this.encodePoint(R);
    var s_ = this.hashInt(Rencoded, key.pubBytes(), message)
                 .mul(key.priv());
    var S = r.add(s_).umod(this.curve.n);
    return this.makeSignature({ R: R, S: S, Rencoded: Rencoded });
  };

  /**
  * @param {Array} message - message bytes
  * @param {Array|String|Signature} sig - sig bytes
  * @param {Array|String|Point|KeyPair} pub - public key
  * @returns {Boolean} - true if public key matches sig of message
  */
  EDDSA.prototype.verify = function verify(message, sig, pub) {
    message = parseBytes$2(message);
    sig = this.makeSignature(sig);
    var key = this.keyFromPublic(pub);
    var h = this.hashInt(sig.Rencoded(), key.pubBytes(), message);
    var SG = this.g.mul(sig.S());
    var RplusAh = sig.R().add(key.pub().mul(h));
    return RplusAh.eq(SG);
  };

  EDDSA.prototype.hashInt = function hashInt() {
    var hash = this.hash();
    for (var i = 0; i < arguments.length; i++)
      hash.update(arguments[i]);
    return utils$8.intFromLE(hash.digest()).umod(this.curve.n);
  };

  EDDSA.prototype.keyFromPublic = function keyFromPublic(pub) {
    return key$1.fromPublic(this, pub);
  };

  EDDSA.prototype.keyFromSecret = function keyFromSecret(secret) {
    return key$1.fromSecret(this, secret);
  };

  EDDSA.prototype.makeSignature = function makeSignature(sig) {
    if (sig instanceof signature$1)
      return sig;
    return new signature$1(this, sig);
  };

  /**
  * * https://tools.ietf.org/html/draft-josefsson-eddsa-ed25519-03#section-5.2
  *
  * EDDSA defines methods for encoding and decoding points and integers. These are
  * helper convenience methods, that pass along to utility functions implied
  * parameters.
  *
  */
  EDDSA.prototype.encodePoint = function encodePoint(point) {
    var enc = point.getY().toArray('le', this.encodingLength);
    enc[this.encodingLength - 1] |= point.getX().isOdd() ? 0x80 : 0;
    return enc;
  };

  EDDSA.prototype.decodePoint = function decodePoint(bytes) {
    bytes = utils$8.parseBytes(bytes);

    var lastIx = bytes.length - 1;
    var normed = bytes.slice(0, lastIx).concat(bytes[lastIx] & ~0x80);
    var xIsOdd = (bytes[lastIx] & 0x80) !== 0;

    var y = utils$8.intFromLE(normed);
    return this.curve.pointFromY(y, xIsOdd);
  };

  EDDSA.prototype.encodeInt = function encodeInt(num) {
    return num.toArray('le', this.encodingLength);
  };

  EDDSA.prototype.decodeInt = function decodeInt(bytes) {
    return utils$8.intFromLE(bytes);
  };

  EDDSA.prototype.isPoint = function isPoint(val) {
    return val instanceof this.pointClass;
  };

  var require$$0 = getCjsExportFromNamespace(_package$1);

  var elliptic_1 = createCommonjsModule(function (module, exports) {

  var elliptic = exports;

  elliptic.version = require$$0.version;
  elliptic.utils = utils_1$1;
  elliptic.rand = brorand;
  elliptic.curve = curve_1;
  elliptic.curves = curves_1;

  // Protocols
  elliptic.ec = ec;
  elliptic.eddsa = eddsa;
  });
  var elliptic_2 = elliptic_1.ec;

  function string_to_bytes(str, utf8 = false) {
      var len = str.length, bytes = new Uint8Array(utf8 ? 4 * len : len);
      for (var i = 0, j = 0; i < len; i++) {
          var c = str.charCodeAt(i);
          if (utf8 && 0xd800 <= c && c <= 0xdbff) {
              if (++i >= len)
                  throw new Error('Malformed string, low surrogate expected at position ' + i);
              c = ((c ^ 0xd800) << 10) | 0x10000 | (str.charCodeAt(i) ^ 0xdc00);
          }
          else if (!utf8 && c >>> 8) {
              throw new Error('Wide characters are not allowed.');
          }
          if (!utf8 || c <= 0x7f) {
              bytes[j++] = c;
          }
          else if (c <= 0x7ff) {
              bytes[j++] = 0xc0 | (c >> 6);
              bytes[j++] = 0x80 | (c & 0x3f);
          }
          else if (c <= 0xffff) {
              bytes[j++] = 0xe0 | (c >> 12);
              bytes[j++] = 0x80 | ((c >> 6) & 0x3f);
              bytes[j++] = 0x80 | (c & 0x3f);
          }
          else {
              bytes[j++] = 0xf0 | (c >> 18);
              bytes[j++] = 0x80 | ((c >> 12) & 0x3f);
              bytes[j++] = 0x80 | ((c >> 6) & 0x3f);
              bytes[j++] = 0x80 | (c & 0x3f);
          }
      }
      return bytes.subarray(0, j);
  }
  function is_bytes(a) {
      return a instanceof Uint8Array;
  }
  function _heap_init(heap, heapSize) {
      const size = heap ? heap.byteLength : heapSize || 65536;
      if (size & 0xfff || size <= 0)
          throw new Error('heap size must be a positive integer and a multiple of 4096');
      heap = heap || new Uint8Array(new ArrayBuffer(size));
      return heap;
  }
  function _heap_write(heap, hpos, data, dpos, dlen) {
      const hlen = heap.length - hpos;
      const wlen = hlen < dlen ? hlen : dlen;
      heap.set(data.subarray(dpos, dpos + wlen), hpos);
      return wlen;
  }

  /**
   * Util exports
   */

  class IllegalStateError extends Error {
      constructor(...args) {
          super(...args);
      }
  }
  class IllegalArgumentError extends Error {
      constructor(...args) {
          super(...args);
      }
  }
  class SecurityError extends Error {
      constructor(...args) {
          super(...args);
      }
  }

  /**
   * @file {@link http://asmjs.org Asm.js} implementation of the {@link https://en.wikipedia.org/wiki/Advanced_Encryption_Standard Advanced Encryption Standard}.
   * @author Artem S Vybornov <vybornov@gmail.com>
   * @license MIT
   */
  var AES_asm = function () {

    /**
     * Galois Field stuff init flag
     */
    var ginit_done = false;

    /**
     * Galois Field exponentiation and logarithm tables for 3 (the generator)
     */
    var gexp3, glog3;

    /**
     * Init Galois Field tables
     */
    function ginit() {
      gexp3 = [],
        glog3 = [];

      var a = 1, c, d;
      for (c = 0; c < 255; c++) {
        gexp3[c] = a;

        // Multiply by three
        d = a & 0x80, a <<= 1, a &= 255;
        if (d === 0x80) a ^= 0x1b;
        a ^= gexp3[c];

        // Set the log table value
        glog3[gexp3[c]] = c;
      }
      gexp3[255] = gexp3[0];
      glog3[0] = 0;

      ginit_done = true;
    }

    /**
     * Galois Field multiplication
     * @param {number} a
     * @param {number} b
     * @return {number}
     */
    function gmul(a, b) {
      var c = gexp3[(glog3[a] + glog3[b]) % 255];
      if (a === 0 || b === 0) c = 0;
      return c;
    }

    /**
     * Galois Field reciprocal
     * @param {number} a
     * @return {number}
     */
    function ginv(a) {
      var i = gexp3[255 - glog3[a]];
      if (a === 0) i = 0;
      return i;
    }

    /**
     * AES stuff init flag
     */
    var aes_init_done = false;

    /**
     * Encryption, Decryption, S-Box and KeyTransform tables
     *
     * @type {number[]}
     */
    var aes_sbox;

    /**
     * @type {number[]}
     */
    var aes_sinv;

    /**
     * @type {number[][]}
     */
    var aes_enc;

    /**
     * @type {number[][]}
     */
    var aes_dec;

    /**
     * Init AES tables
     */
    function aes_init() {
      if (!ginit_done) ginit();

      // Calculates AES S-Box value
      function _s(a) {
        var c, s, x;
        s = x = ginv(a);
        for (c = 0; c < 4; c++) {
          s = ((s << 1) | (s >>> 7)) & 255;
          x ^= s;
        }
        x ^= 99;
        return x;
      }

      // Tables
      aes_sbox = [],
        aes_sinv = [],
        aes_enc = [[], [], [], []],
        aes_dec = [[], [], [], []];

      for (var i = 0; i < 256; i++) {
        var s = _s(i);

        // S-Box and its inverse
        aes_sbox[i] = s;
        aes_sinv[s] = i;

        // Ecryption and Decryption tables
        aes_enc[0][i] = (gmul(2, s) << 24) | (s << 16) | (s << 8) | gmul(3, s);
        aes_dec[0][s] = (gmul(14, i) << 24) | (gmul(9, i) << 16) | (gmul(13, i) << 8) | gmul(11, i);
        // Rotate tables
        for (var t = 1; t < 4; t++) {
          aes_enc[t][i] = (aes_enc[t - 1][i] >>> 8) | (aes_enc[t - 1][i] << 24);
          aes_dec[t][s] = (aes_dec[t - 1][s] >>> 8) | (aes_dec[t - 1][s] << 24);
        }
      }

      aes_init_done = true;
    }

    /**
     * Asm.js module constructor.
     *
     * <p>
     * Heap buffer layout by offset:
     * <pre>
     * 0x0000   encryption key schedule
     * 0x0400   decryption key schedule
     * 0x0800   sbox
     * 0x0c00   inv sbox
     * 0x1000   encryption tables
     * 0x2000   decryption tables
     * 0x3000   reserved (future GCM multiplication lookup table)
     * 0x4000   data
     * </pre>
     * Don't touch anything before <code>0x400</code>.
     * </p>
     *
     * @alias AES_asm
     * @class
     * @param foreign - <i>ignored</i>
     * @param buffer - heap buffer to link with
     */
    var wrapper = function (foreign, buffer) {
      // Init AES stuff for the first time
      if (!aes_init_done) aes_init();

      // Fill up AES tables
      var heap = new Uint32Array(buffer);
      heap.set(aes_sbox, 0x0800 >> 2);
      heap.set(aes_sinv, 0x0c00 >> 2);
      for (var i = 0; i < 4; i++) {
        heap.set(aes_enc[i], (0x1000 + 0x400 * i) >> 2);
        heap.set(aes_dec[i], (0x2000 + 0x400 * i) >> 2);
      }

      /**
       * Calculate AES key schedules.
       * @instance
       * @memberof AES_asm
       * @param {number} ks - key size, 4/6/8 (for 128/192/256-bit key correspondingly)
       * @param {number} k0 - key vector components
       * @param {number} k1 - key vector components
       * @param {number} k2 - key vector components
       * @param {number} k3 - key vector components
       * @param {number} k4 - key vector components
       * @param {number} k5 - key vector components
       * @param {number} k6 - key vector components
       * @param {number} k7 - key vector components
       */
      function set_key(ks, k0, k1, k2, k3, k4, k5, k6, k7) {
        var ekeys = heap.subarray(0x000, 60),
          dkeys = heap.subarray(0x100, 0x100 + 60);

        // Encryption key schedule
        ekeys.set([k0, k1, k2, k3, k4, k5, k6, k7]);
        for (var i = ks, rcon = 1; i < 4 * ks + 28; i++) {
          var k = ekeys[i - 1];
          if ((i % ks === 0) || (ks === 8 && i % ks === 4)) {
            k = aes_sbox[k >>> 24] << 24 ^ aes_sbox[k >>> 16 & 255] << 16 ^ aes_sbox[k >>> 8 & 255] << 8 ^ aes_sbox[k & 255];
          }
          if (i % ks === 0) {
            k = (k << 8) ^ (k >>> 24) ^ (rcon << 24);
            rcon = (rcon << 1) ^ ((rcon & 0x80) ? 0x1b : 0);
          }
          ekeys[i] = ekeys[i - ks] ^ k;
        }

        // Decryption key schedule
        for (var j = 0; j < i; j += 4) {
          for (var jj = 0; jj < 4; jj++) {
            var k = ekeys[i - (4 + j) + (4 - jj) % 4];
            if (j < 4 || j >= i - 4) {
              dkeys[j + jj] = k;
            } else {
              dkeys[j + jj] = aes_dec[0][aes_sbox[k >>> 24]]
                ^ aes_dec[1][aes_sbox[k >>> 16 & 255]]
                ^ aes_dec[2][aes_sbox[k >>> 8 & 255]]
                ^ aes_dec[3][aes_sbox[k & 255]];
            }
          }
        }

        // Set rounds number
        asm.set_rounds(ks + 5);
      }

      // create library object with necessary properties
      var stdlib = {Uint8Array: Uint8Array, Uint32Array: Uint32Array};

      var asm = function (stdlib, foreign, buffer) {
        "use asm";

        var S0 = 0, S1 = 0, S2 = 0, S3 = 0,
          I0 = 0, I1 = 0, I2 = 0, I3 = 0,
          N0 = 0, N1 = 0, N2 = 0, N3 = 0,
          M0 = 0, M1 = 0, M2 = 0, M3 = 0,
          H0 = 0, H1 = 0, H2 = 0, H3 = 0,
          R = 0;

        var HEAP = new stdlib.Uint32Array(buffer),
          DATA = new stdlib.Uint8Array(buffer);

        /**
         * AES core
         * @param {number} k - precomputed key schedule offset
         * @param {number} s - precomputed sbox table offset
         * @param {number} t - precomputed round table offset
         * @param {number} r - number of inner rounds to perform
         * @param {number} x0 - 128-bit input block vector
         * @param {number} x1 - 128-bit input block vector
         * @param {number} x2 - 128-bit input block vector
         * @param {number} x3 - 128-bit input block vector
         */
        function _core(k, s, t, r, x0, x1, x2, x3) {
          k = k | 0;
          s = s | 0;
          t = t | 0;
          r = r | 0;
          x0 = x0 | 0;
          x1 = x1 | 0;
          x2 = x2 | 0;
          x3 = x3 | 0;

          var t1 = 0, t2 = 0, t3 = 0,
            y0 = 0, y1 = 0, y2 = 0, y3 = 0,
            i = 0;

          t1 = t | 0x400, t2 = t | 0x800, t3 = t | 0xc00;

          // round 0
          x0 = x0 ^ HEAP[(k | 0) >> 2],
            x1 = x1 ^ HEAP[(k | 4) >> 2],
            x2 = x2 ^ HEAP[(k | 8) >> 2],
            x3 = x3 ^ HEAP[(k | 12) >> 2];

          // round 1..r
          for (i = 16; (i | 0) <= (r << 4); i = (i + 16) | 0) {
            y0 = HEAP[(t | x0 >> 22 & 1020) >> 2] ^ HEAP[(t1 | x1 >> 14 & 1020) >> 2] ^ HEAP[(t2 | x2 >> 6 & 1020) >> 2] ^ HEAP[(t3 | x3 << 2 & 1020) >> 2] ^ HEAP[(k | i | 0) >> 2],
              y1 = HEAP[(t | x1 >> 22 & 1020) >> 2] ^ HEAP[(t1 | x2 >> 14 & 1020) >> 2] ^ HEAP[(t2 | x3 >> 6 & 1020) >> 2] ^ HEAP[(t3 | x0 << 2 & 1020) >> 2] ^ HEAP[(k | i | 4) >> 2],
              y2 = HEAP[(t | x2 >> 22 & 1020) >> 2] ^ HEAP[(t1 | x3 >> 14 & 1020) >> 2] ^ HEAP[(t2 | x0 >> 6 & 1020) >> 2] ^ HEAP[(t3 | x1 << 2 & 1020) >> 2] ^ HEAP[(k | i | 8) >> 2],
              y3 = HEAP[(t | x3 >> 22 & 1020) >> 2] ^ HEAP[(t1 | x0 >> 14 & 1020) >> 2] ^ HEAP[(t2 | x1 >> 6 & 1020) >> 2] ^ HEAP[(t3 | x2 << 2 & 1020) >> 2] ^ HEAP[(k | i | 12) >> 2];
            x0 = y0, x1 = y1, x2 = y2, x3 = y3;
          }

          // final round
          S0 = HEAP[(s | x0 >> 22 & 1020) >> 2] << 24 ^ HEAP[(s | x1 >> 14 & 1020) >> 2] << 16 ^ HEAP[(s | x2 >> 6 & 1020) >> 2] << 8 ^ HEAP[(s | x3 << 2 & 1020) >> 2] ^ HEAP[(k | i | 0) >> 2],
            S1 = HEAP[(s | x1 >> 22 & 1020) >> 2] << 24 ^ HEAP[(s | x2 >> 14 & 1020) >> 2] << 16 ^ HEAP[(s | x3 >> 6 & 1020) >> 2] << 8 ^ HEAP[(s | x0 << 2 & 1020) >> 2] ^ HEAP[(k | i | 4) >> 2],
            S2 = HEAP[(s | x2 >> 22 & 1020) >> 2] << 24 ^ HEAP[(s | x3 >> 14 & 1020) >> 2] << 16 ^ HEAP[(s | x0 >> 6 & 1020) >> 2] << 8 ^ HEAP[(s | x1 << 2 & 1020) >> 2] ^ HEAP[(k | i | 8) >> 2],
            S3 = HEAP[(s | x3 >> 22 & 1020) >> 2] << 24 ^ HEAP[(s | x0 >> 14 & 1020) >> 2] << 16 ^ HEAP[(s | x1 >> 6 & 1020) >> 2] << 8 ^ HEAP[(s | x2 << 2 & 1020) >> 2] ^ HEAP[(k | i | 12) >> 2];
        }

        /**
         * ECB mode encryption
         * @param {number} x0 - 128-bit input block vector
         * @param {number} x1 - 128-bit input block vector
         * @param {number} x2 - 128-bit input block vector
         * @param {number} x3 - 128-bit input block vector
         */
        function _ecb_enc(x0, x1, x2, x3) {
          x0 = x0 | 0;
          x1 = x1 | 0;
          x2 = x2 | 0;
          x3 = x3 | 0;

          _core(
            0x0000, 0x0800, 0x1000,
            R,
            x0,
            x1,
            x2,
            x3
          );
        }

        /**
         * ECB mode decryption
         * @param {number} x0 - 128-bit input block vector
         * @param {number} x1 - 128-bit input block vector
         * @param {number} x2 - 128-bit input block vector
         * @param {number} x3 - 128-bit input block vector
         */
        function _ecb_dec(x0, x1, x2, x3) {
          x0 = x0 | 0;
          x1 = x1 | 0;
          x2 = x2 | 0;
          x3 = x3 | 0;

          var t = 0;

          _core(
            0x0400, 0x0c00, 0x2000,
            R,
            x0,
            x3,
            x2,
            x1
          );

          t = S1, S1 = S3, S3 = t;
        }


        /**
         * CBC mode encryption
         * @param {number} x0 - 128-bit input block vector
         * @param {number} x1 - 128-bit input block vector
         * @param {number} x2 - 128-bit input block vector
         * @param {number} x3 - 128-bit input block vector
         */
        function _cbc_enc(x0, x1, x2, x3) {
          x0 = x0 | 0;
          x1 = x1 | 0;
          x2 = x2 | 0;
          x3 = x3 | 0;

          _core(
            0x0000, 0x0800, 0x1000,
            R,
            I0 ^ x0,
            I1 ^ x1,
            I2 ^ x2,
            I3 ^ x3
          );

          I0 = S0,
            I1 = S1,
            I2 = S2,
            I3 = S3;
        }

        /**
         * CBC mode decryption
         * @param {number} x0 - 128-bit input block vector
         * @param {number} x1 - 128-bit input block vector
         * @param {number} x2 - 128-bit input block vector
         * @param {number} x3 - 128-bit input block vector
         */
        function _cbc_dec(x0, x1, x2, x3) {
          x0 = x0 | 0;
          x1 = x1 | 0;
          x2 = x2 | 0;
          x3 = x3 | 0;

          var t = 0;

          _core(
            0x0400, 0x0c00, 0x2000,
            R,
            x0,
            x3,
            x2,
            x1
          );

          t = S1, S1 = S3, S3 = t;

          S0 = S0 ^ I0,
            S1 = S1 ^ I1,
            S2 = S2 ^ I2,
            S3 = S3 ^ I3;

          I0 = x0,
            I1 = x1,
            I2 = x2,
            I3 = x3;
        }

        /**
         * CFB mode encryption
         * @param {number} x0 - 128-bit input block vector
         * @param {number} x1 - 128-bit input block vector
         * @param {number} x2 - 128-bit input block vector
         * @param {number} x3 - 128-bit input block vector
         */
        function _cfb_enc(x0, x1, x2, x3) {
          x0 = x0 | 0;
          x1 = x1 | 0;
          x2 = x2 | 0;
          x3 = x3 | 0;

          _core(
            0x0000, 0x0800, 0x1000,
            R,
            I0,
            I1,
            I2,
            I3
          );

          I0 = S0 = S0 ^ x0,
            I1 = S1 = S1 ^ x1,
            I2 = S2 = S2 ^ x2,
            I3 = S3 = S3 ^ x3;
        }


        /**
         * CFB mode decryption
         * @param {number} x0 - 128-bit input block vector
         * @param {number} x1 - 128-bit input block vector
         * @param {number} x2 - 128-bit input block vector
         * @param {number} x3 - 128-bit input block vector
         */
        function _cfb_dec(x0, x1, x2, x3) {
          x0 = x0 | 0;
          x1 = x1 | 0;
          x2 = x2 | 0;
          x3 = x3 | 0;

          _core(
            0x0000, 0x0800, 0x1000,
            R,
            I0,
            I1,
            I2,
            I3
          );

          S0 = S0 ^ x0,
            S1 = S1 ^ x1,
            S2 = S2 ^ x2,
            S3 = S3 ^ x3;

          I0 = x0,
            I1 = x1,
            I2 = x2,
            I3 = x3;
        }

        /**
         * OFB mode encryption / decryption
         * @param {number} x0 - 128-bit input block vector
         * @param {number} x1 - 128-bit input block vector
         * @param {number} x2 - 128-bit input block vector
         * @param {number} x3 - 128-bit input block vector
         */
        function _ofb(x0, x1, x2, x3) {
          x0 = x0 | 0;
          x1 = x1 | 0;
          x2 = x2 | 0;
          x3 = x3 | 0;

          _core(
            0x0000, 0x0800, 0x1000,
            R,
            I0,
            I1,
            I2,
            I3
          );

          I0 = S0,
            I1 = S1,
            I2 = S2,
            I3 = S3;

          S0 = S0 ^ x0,
            S1 = S1 ^ x1,
            S2 = S2 ^ x2,
            S3 = S3 ^ x3;
        }

        /**
         * CTR mode encryption / decryption
         * @param {number} x0 - 128-bit input block vector
         * @param {number} x1 - 128-bit input block vector
         * @param {number} x2 - 128-bit input block vector
         * @param {number} x3 - 128-bit input block vector
         */
        function _ctr(x0, x1, x2, x3) {
          x0 = x0 | 0;
          x1 = x1 | 0;
          x2 = x2 | 0;
          x3 = x3 | 0;

          _core(
            0x0000, 0x0800, 0x1000,
            R,
            N0,
            N1,
            N2,
            N3
          );

          N3 = (~M3 & N3) | M3 & (N3 + 1);
            N2 = (~M2 & N2) | M2 & (N2 + ((N3 | 0) == 0));
            N1 = (~M1 & N1) | M1 & (N1 + ((N2 | 0) == 0));
            N0 = (~M0 & N0) | M0 & (N0 + ((N1 | 0) == 0));

          S0 = S0 ^ x0;
            S1 = S1 ^ x1;
            S2 = S2 ^ x2;
            S3 = S3 ^ x3;
        }

        /**
         * GCM mode MAC calculation
         * @param {number} x0 - 128-bit input block vector
         * @param {number} x1 - 128-bit input block vector
         * @param {number} x2 - 128-bit input block vector
         * @param {number} x3 - 128-bit input block vector
         */
        function _gcm_mac(x0, x1, x2, x3) {
          x0 = x0 | 0;
          x1 = x1 | 0;
          x2 = x2 | 0;
          x3 = x3 | 0;

          var y0 = 0, y1 = 0, y2 = 0, y3 = 0,
            z0 = 0, z1 = 0, z2 = 0, z3 = 0,
            i = 0, c = 0;

          x0 = x0 ^ I0,
            x1 = x1 ^ I1,
            x2 = x2 ^ I2,
            x3 = x3 ^ I3;

          y0 = H0 | 0,
            y1 = H1 | 0,
            y2 = H2 | 0,
            y3 = H3 | 0;

          for (; (i | 0) < 128; i = (i + 1) | 0) {
            if (y0 >>> 31) {
              z0 = z0 ^ x0,
                z1 = z1 ^ x1,
                z2 = z2 ^ x2,
                z3 = z3 ^ x3;
            }

            y0 = (y0 << 1) | (y1 >>> 31),
              y1 = (y1 << 1) | (y2 >>> 31),
              y2 = (y2 << 1) | (y3 >>> 31),
              y3 = (y3 << 1);

            c = x3 & 1;

            x3 = (x3 >>> 1) | (x2 << 31),
              x2 = (x2 >>> 1) | (x1 << 31),
              x1 = (x1 >>> 1) | (x0 << 31),
              x0 = (x0 >>> 1);

            if (c) x0 = x0 ^ 0xe1000000;
          }

          I0 = z0,
            I1 = z1,
            I2 = z2,
            I3 = z3;
        }

        /**
         * Set the internal rounds number.
         * @instance
         * @memberof AES_asm
         * @param {number} r - number if inner AES rounds
         */
        function set_rounds(r) {
          r = r | 0;
          R = r;
        }

        /**
         * Populate the internal state of the module.
         * @instance
         * @memberof AES_asm
         * @param {number} s0 - state vector
         * @param {number} s1 - state vector
         * @param {number} s2 - state vector
         * @param {number} s3 - state vector
         */
        function set_state(s0, s1, s2, s3) {
          s0 = s0 | 0;
          s1 = s1 | 0;
          s2 = s2 | 0;
          s3 = s3 | 0;

          S0 = s0,
            S1 = s1,
            S2 = s2,
            S3 = s3;
        }

        /**
         * Populate the internal iv of the module.
         * @instance
         * @memberof AES_asm
         * @param {number} i0 - iv vector
         * @param {number} i1 - iv vector
         * @param {number} i2 - iv vector
         * @param {number} i3 - iv vector
         */
        function set_iv(i0, i1, i2, i3) {
          i0 = i0 | 0;
          i1 = i1 | 0;
          i2 = i2 | 0;
          i3 = i3 | 0;

          I0 = i0,
            I1 = i1,
            I2 = i2,
            I3 = i3;
        }

        /**
         * Set nonce for CTR-family modes.
         * @instance
         * @memberof AES_asm
         * @param {number} n0 - nonce vector
         * @param {number} n1 - nonce vector
         * @param {number} n2 - nonce vector
         * @param {number} n3 - nonce vector
         */
        function set_nonce(n0, n1, n2, n3) {
          n0 = n0 | 0;
          n1 = n1 | 0;
          n2 = n2 | 0;
          n3 = n3 | 0;

          N0 = n0,
            N1 = n1,
            N2 = n2,
            N3 = n3;
        }

        /**
         * Set counter mask for CTR-family modes.
         * @instance
         * @memberof AES_asm
         * @param {number} m0 - counter mask vector
         * @param {number} m1 - counter mask vector
         * @param {number} m2 - counter mask vector
         * @param {number} m3 - counter mask vector
         */
        function set_mask(m0, m1, m2, m3) {
          m0 = m0 | 0;
          m1 = m1 | 0;
          m2 = m2 | 0;
          m3 = m3 | 0;

          M0 = m0,
            M1 = m1,
            M2 = m2,
            M3 = m3;
        }

        /**
         * Set counter for CTR-family modes.
         * @instance
         * @memberof AES_asm
         * @param {number} c0 - counter vector
         * @param {number} c1 - counter vector
         * @param {number} c2 - counter vector
         * @param {number} c3 - counter vector
         */
        function set_counter(c0, c1, c2, c3) {
          c0 = c0 | 0;
          c1 = c1 | 0;
          c2 = c2 | 0;
          c3 = c3 | 0;

          N3 = (~M3 & N3) | M3 & c3,
            N2 = (~M2 & N2) | M2 & c2,
            N1 = (~M1 & N1) | M1 & c1,
            N0 = (~M0 & N0) | M0 & c0;
        }

        /**
         * Store the internal state vector into the heap.
         * @instance
         * @memberof AES_asm
         * @param {number} pos - offset where to put the data
         * @return {number} The number of bytes have been written into the heap, always 16.
         */
        function get_state(pos) {
          pos = pos | 0;

          if (pos & 15) return -1;

          DATA[pos | 0] = S0 >>> 24,
            DATA[pos | 1] = S0 >>> 16 & 255,
            DATA[pos | 2] = S0 >>> 8 & 255,
            DATA[pos | 3] = S0 & 255,
            DATA[pos | 4] = S1 >>> 24,
            DATA[pos | 5] = S1 >>> 16 & 255,
            DATA[pos | 6] = S1 >>> 8 & 255,
            DATA[pos | 7] = S1 & 255,
            DATA[pos | 8] = S2 >>> 24,
            DATA[pos | 9] = S2 >>> 16 & 255,
            DATA[pos | 10] = S2 >>> 8 & 255,
            DATA[pos | 11] = S2 & 255,
            DATA[pos | 12] = S3 >>> 24,
            DATA[pos | 13] = S3 >>> 16 & 255,
            DATA[pos | 14] = S3 >>> 8 & 255,
            DATA[pos | 15] = S3 & 255;

          return 16;
        }

        /**
         * Store the internal iv vector into the heap.
         * @instance
         * @memberof AES_asm
         * @param {number} pos - offset where to put the data
         * @return {number} The number of bytes have been written into the heap, always 16.
         */
        function get_iv(pos) {
          pos = pos | 0;

          if (pos & 15) return -1;

          DATA[pos | 0] = I0 >>> 24,
            DATA[pos | 1] = I0 >>> 16 & 255,
            DATA[pos | 2] = I0 >>> 8 & 255,
            DATA[pos | 3] = I0 & 255,
            DATA[pos | 4] = I1 >>> 24,
            DATA[pos | 5] = I1 >>> 16 & 255,
            DATA[pos | 6] = I1 >>> 8 & 255,
            DATA[pos | 7] = I1 & 255,
            DATA[pos | 8] = I2 >>> 24,
            DATA[pos | 9] = I2 >>> 16 & 255,
            DATA[pos | 10] = I2 >>> 8 & 255,
            DATA[pos | 11] = I2 & 255,
            DATA[pos | 12] = I3 >>> 24,
            DATA[pos | 13] = I3 >>> 16 & 255,
            DATA[pos | 14] = I3 >>> 8 & 255,
            DATA[pos | 15] = I3 & 255;

          return 16;
        }

        /**
         * GCM initialization.
         * @instance
         * @memberof AES_asm
         */
        function gcm_init() {
          _ecb_enc(0, 0, 0, 0);
          H0 = S0,
            H1 = S1,
            H2 = S2,
            H3 = S3;
        }

        /**
         * Perform ciphering operation on the supplied data.
         * @instance
         * @memberof AES_asm
         * @param {number} mode - block cipher mode (see {@link AES_asm} mode constants)
         * @param {number} pos - offset of the data being processed
         * @param {number} len - length of the data being processed
         * @return {number} Actual amount of data have been processed.
         */
        function cipher(mode, pos, len) {
          mode = mode | 0;
          pos = pos | 0;
          len = len | 0;

          var ret = 0;

          if (pos & 15) return -1;

          while ((len | 0) >= 16) {
            _cipher_modes[mode & 7](
              DATA[pos | 0] << 24 | DATA[pos | 1] << 16 | DATA[pos | 2] << 8 | DATA[pos | 3],
              DATA[pos | 4] << 24 | DATA[pos | 5] << 16 | DATA[pos | 6] << 8 | DATA[pos | 7],
              DATA[pos | 8] << 24 | DATA[pos | 9] << 16 | DATA[pos | 10] << 8 | DATA[pos | 11],
              DATA[pos | 12] << 24 | DATA[pos | 13] << 16 | DATA[pos | 14] << 8 | DATA[pos | 15]
            );

            DATA[pos | 0] = S0 >>> 24,
              DATA[pos | 1] = S0 >>> 16 & 255,
              DATA[pos | 2] = S0 >>> 8 & 255,
              DATA[pos | 3] = S0 & 255,
              DATA[pos | 4] = S1 >>> 24,
              DATA[pos | 5] = S1 >>> 16 & 255,
              DATA[pos | 6] = S1 >>> 8 & 255,
              DATA[pos | 7] = S1 & 255,
              DATA[pos | 8] = S2 >>> 24,
              DATA[pos | 9] = S2 >>> 16 & 255,
              DATA[pos | 10] = S2 >>> 8 & 255,
              DATA[pos | 11] = S2 & 255,
              DATA[pos | 12] = S3 >>> 24,
              DATA[pos | 13] = S3 >>> 16 & 255,
              DATA[pos | 14] = S3 >>> 8 & 255,
              DATA[pos | 15] = S3 & 255;

            ret = (ret + 16) | 0,
              pos = (pos + 16) | 0,
              len = (len - 16) | 0;
          }

          return ret | 0;
        }

        /**
         * Calculates MAC of the supplied data.
         * @instance
         * @memberof AES_asm
         * @param {number} mode - block cipher mode (see {@link AES_asm} mode constants)
         * @param {number} pos - offset of the data being processed
         * @param {number} len - length of the data being processed
         * @return {number} Actual amount of data have been processed.
         */
        function mac(mode, pos, len) {
          mode = mode | 0;
          pos = pos | 0;
          len = len | 0;

          var ret = 0;

          if (pos & 15) return -1;

          while ((len | 0) >= 16) {
            _mac_modes[mode & 1](
              DATA[pos | 0] << 24 | DATA[pos | 1] << 16 | DATA[pos | 2] << 8 | DATA[pos | 3],
              DATA[pos | 4] << 24 | DATA[pos | 5] << 16 | DATA[pos | 6] << 8 | DATA[pos | 7],
              DATA[pos | 8] << 24 | DATA[pos | 9] << 16 | DATA[pos | 10] << 8 | DATA[pos | 11],
              DATA[pos | 12] << 24 | DATA[pos | 13] << 16 | DATA[pos | 14] << 8 | DATA[pos | 15]
            );

            ret = (ret + 16) | 0,
              pos = (pos + 16) | 0,
              len = (len - 16) | 0;
          }

          return ret | 0;
        }

        /**
         * AES cipher modes table (virual methods)
         */
        var _cipher_modes = [_ecb_enc, _ecb_dec, _cbc_enc, _cbc_dec, _cfb_enc, _cfb_dec, _ofb, _ctr];

        /**
         * AES MAC modes table (virual methods)
         */
        var _mac_modes = [_cbc_enc, _gcm_mac];

        /**
         * Asm.js module exports
         */
        return {
          set_rounds: set_rounds,
          set_state: set_state,
          set_iv: set_iv,
          set_nonce: set_nonce,
          set_mask: set_mask,
          set_counter: set_counter,
          get_state: get_state,
          get_iv: get_iv,
          gcm_init: gcm_init,
          cipher: cipher,
          mac: mac,
        };
      }(stdlib, foreign, buffer);

      asm.set_key = set_key;

      return asm;
    };

    /**
     * AES enciphering mode constants
     * @enum {number}
     * @const
     */
    wrapper.ENC = {
      ECB: 0,
      CBC: 2,
      CFB: 4,
      OFB: 6,
      CTR: 7,
    },

      /**
       * AES deciphering mode constants
       * @enum {number}
       * @const
       */
      wrapper.DEC = {
        ECB: 1,
        CBC: 3,
        CFB: 5,
        OFB: 6,
        CTR: 7,
      },

      /**
       * AES MAC mode constants
       * @enum {number}
       * @const
       */
      wrapper.MAC = {
        CBC: 0,
        GCM: 1,
      };

    /**
     * Heap data offset
     * @type {number}
     * @const
     */
    wrapper.HEAP_DATA = 0x4000;

    return wrapper;
  }();

  class AES {
      constructor(key, iv, padding = true, mode) {
          this.pos = 0;
          this.len = 0;
          this.mode = mode;
          // The AES "worker"
          this.heap = _heap_init().subarray(AES_asm.HEAP_DATA);
          this.asm = new AES_asm(null, this.heap.buffer);
          // The AES object state
          this.pos = 0;
          this.len = 0;
          // Key
          const keylen = key.length;
          if (keylen !== 16 && keylen !== 24 && keylen !== 32)
              throw new IllegalArgumentError('illegal key size');
          const keyview = new DataView(key.buffer, key.byteOffset, key.byteLength);
          this.asm.set_key(keylen >> 2, keyview.getUint32(0), keyview.getUint32(4), keyview.getUint32(8), keyview.getUint32(12), keylen > 16 ? keyview.getUint32(16) : 0, keylen > 16 ? keyview.getUint32(20) : 0, keylen > 24 ? keyview.getUint32(24) : 0, keylen > 24 ? keyview.getUint32(28) : 0);
          // IV
          if (iv !== undefined) {
              if (iv.length !== 16)
                  throw new IllegalArgumentError('illegal iv size');
              let ivview = new DataView(iv.buffer, iv.byteOffset, iv.byteLength);
              this.asm.set_iv(ivview.getUint32(0), ivview.getUint32(4), ivview.getUint32(8), ivview.getUint32(12));
          }
          else {
              this.asm.set_iv(0, 0, 0, 0);
          }
          this.padding = padding;
      }
      AES_Encrypt_process(data) {
          if (!is_bytes(data))
              throw new TypeError("data isn't of expected type");
          let asm = this.asm;
          let heap = this.heap;
          let amode = AES_asm.ENC[this.mode];
          let hpos = AES_asm.HEAP_DATA;
          let pos = this.pos;
          let len = this.len;
          let dpos = 0;
          let dlen = data.length || 0;
          let rpos = 0;
          let rlen = (len + dlen) & -16;
          let wlen = 0;
          let result = new Uint8Array(rlen);
          while (dlen > 0) {
              wlen = _heap_write(heap, pos + len, data, dpos, dlen);
              len += wlen;
              dpos += wlen;
              dlen -= wlen;
              wlen = asm.cipher(amode, hpos + pos, len);
              if (wlen)
                  result.set(heap.subarray(pos, pos + wlen), rpos);
              rpos += wlen;
              if (wlen < len) {
                  pos += wlen;
                  len -= wlen;
              }
              else {
                  pos = 0;
                  len = 0;
              }
          }
          this.pos = pos;
          this.len = len;
          return result;
      }
      AES_Encrypt_finish() {
          let asm = this.asm;
          let heap = this.heap;
          let amode = AES_asm.ENC[this.mode];
          let hpos = AES_asm.HEAP_DATA;
          let pos = this.pos;
          let len = this.len;
          let plen = 16 - (len % 16);
          let rlen = len;
          if (this.hasOwnProperty('padding')) {
              if (this.padding) {
                  for (let p = 0; p < plen; ++p) {
                      heap[pos + len + p] = plen;
                  }
                  len += plen;
                  rlen = len;
              }
              else if (len % 16) {
                  throw new IllegalArgumentError('data length must be a multiple of the block size');
              }
          }
          else {
              len += plen;
          }
          const result = new Uint8Array(rlen);
          if (len)
              asm.cipher(amode, hpos + pos, len);
          if (rlen)
              result.set(heap.subarray(pos, pos + rlen));
          this.pos = 0;
          this.len = 0;
          return result;
      }
      AES_Decrypt_process(data) {
          if (!is_bytes(data))
              throw new TypeError("data isn't of expected type");
          let asm = this.asm;
          let heap = this.heap;
          let amode = AES_asm.DEC[this.mode];
          let hpos = AES_asm.HEAP_DATA;
          let pos = this.pos;
          let len = this.len;
          let dpos = 0;
          let dlen = data.length || 0;
          let rpos = 0;
          let rlen = (len + dlen) & -16;
          let plen = 0;
          let wlen = 0;
          if (this.padding) {
              plen = len + dlen - rlen || 16;
              rlen -= plen;
          }
          const result = new Uint8Array(rlen);
          while (dlen > 0) {
              wlen = _heap_write(heap, pos + len, data, dpos, dlen);
              len += wlen;
              dpos += wlen;
              dlen -= wlen;
              wlen = asm.cipher(amode, hpos + pos, len - (!dlen ? plen : 0));
              if (wlen)
                  result.set(heap.subarray(pos, pos + wlen), rpos);
              rpos += wlen;
              if (wlen < len) {
                  pos += wlen;
                  len -= wlen;
              }
              else {
                  pos = 0;
                  len = 0;
              }
          }
          this.pos = pos;
          this.len = len;
          return result;
      }
      AES_Decrypt_finish() {
          let asm = this.asm;
          let heap = this.heap;
          let amode = AES_asm.DEC[this.mode];
          let hpos = AES_asm.HEAP_DATA;
          let pos = this.pos;
          let len = this.len;
          let rlen = len;
          if (len > 0) {
              if (len % 16) {
                  if (this.hasOwnProperty('padding')) {
                      throw new IllegalArgumentError('data length must be a multiple of the block size');
                  }
                  else {
                      len += 16 - (len % 16);
                  }
              }
              asm.cipher(amode, hpos + pos, len);
              if (this.hasOwnProperty('padding') && this.padding) {
                  let pad = heap[pos + rlen - 1];
                  if (pad < 1 || pad > 16 || pad > rlen)
                      throw new SecurityError('bad padding');
                  let pcheck = 0;
                  for (let i = pad; i > 1; i--)
                      pcheck |= pad ^ heap[pos + rlen - i];
                  if (pcheck)
                      throw new SecurityError('bad padding');
                  rlen -= pad;
              }
          }
          const result = new Uint8Array(rlen);
          if (rlen > 0) {
              result.set(heap.subarray(pos, pos + rlen));
          }
          this.pos = 0;
          this.len = 0;
          return result;
      }
  }

  const _AES_GCM_data_maxLength = 68719476704; // 2^36 - 2^5
  class AES_GCM extends AES {
      constructor(key, nonce, adata, tagSize = 16) {
          super(key, undefined, false, 'CTR');
          this.tagSize = tagSize;
          this.gamma0 = 0;
          this.counter = 1;
          // Init GCM
          this.asm.gcm_init();
          // Tag size
          if (this.tagSize < 4 || this.tagSize > 16)
              throw new IllegalArgumentError('illegal tagSize value');
          // Nonce
          const noncelen = nonce.length || 0;
          const noncebuf = new Uint8Array(16);
          if (noncelen !== 12) {
              this._gcm_mac_process(nonce);
              this.heap[0] = 0;
              this.heap[1] = 0;
              this.heap[2] = 0;
              this.heap[3] = 0;
              this.heap[4] = 0;
              this.heap[5] = 0;
              this.heap[6] = 0;
              this.heap[7] = 0;
              this.heap[8] = 0;
              this.heap[9] = 0;
              this.heap[10] = 0;
              this.heap[11] = noncelen >>> 29;
              this.heap[12] = (noncelen >>> 21) & 255;
              this.heap[13] = (noncelen >>> 13) & 255;
              this.heap[14] = (noncelen >>> 5) & 255;
              this.heap[15] = (noncelen << 3) & 255;
              this.asm.mac(AES_asm.MAC.GCM, AES_asm.HEAP_DATA, 16);
              this.asm.get_iv(AES_asm.HEAP_DATA);
              this.asm.set_iv(0, 0, 0, 0);
              noncebuf.set(this.heap.subarray(0, 16));
          }
          else {
              noncebuf.set(nonce);
              noncebuf[15] = 1;
          }
          const nonceview = new DataView(noncebuf.buffer);
          this.gamma0 = nonceview.getUint32(12);
          this.asm.set_nonce(nonceview.getUint32(0), nonceview.getUint32(4), nonceview.getUint32(8), 0);
          this.asm.set_mask(0, 0, 0, 0xffffffff);
          // Associated data
          if (adata !== undefined) {
              if (adata.length > _AES_GCM_data_maxLength)
                  throw new IllegalArgumentError('illegal adata length');
              if (adata.length) {
                  this.adata = adata;
                  this._gcm_mac_process(adata);
              }
              else {
                  this.adata = undefined;
              }
          }
          else {
              this.adata = undefined;
          }
          // Counter
          if (this.counter < 1 || this.counter > 0xffffffff)
              throw new RangeError('counter must be a positive 32-bit integer');
          this.asm.set_counter(0, 0, 0, (this.gamma0 + this.counter) | 0);
      }
      static encrypt(cleartext, key, nonce, adata, tagsize) {
          return new AES_GCM(key, nonce, adata, tagsize).encrypt(cleartext);
      }
      static decrypt(ciphertext, key, nonce, adata, tagsize) {
          return new AES_GCM(key, nonce, adata, tagsize).decrypt(ciphertext);
      }
      encrypt(data) {
          return this.AES_GCM_encrypt(data);
      }
      decrypt(data) {
          return this.AES_GCM_decrypt(data);
      }
      AES_GCM_Encrypt_process(data) {
          let dpos = 0;
          let dlen = data.length || 0;
          let asm = this.asm;
          let heap = this.heap;
          let counter = this.counter;
          let pos = this.pos;
          let len = this.len;
          let rpos = 0;
          let rlen = (len + dlen) & -16;
          let wlen = 0;
          if (((counter - 1) << 4) + len + dlen > _AES_GCM_data_maxLength)
              throw new RangeError('counter overflow');
          const result = new Uint8Array(rlen);
          while (dlen > 0) {
              wlen = _heap_write(heap, pos + len, data, dpos, dlen);
              len += wlen;
              dpos += wlen;
              dlen -= wlen;
              wlen = asm.cipher(AES_asm.ENC.CTR, AES_asm.HEAP_DATA + pos, len);
              wlen = asm.mac(AES_asm.MAC.GCM, AES_asm.HEAP_DATA + pos, wlen);
              if (wlen)
                  result.set(heap.subarray(pos, pos + wlen), rpos);
              counter += wlen >>> 4;
              rpos += wlen;
              if (wlen < len) {
                  pos += wlen;
                  len -= wlen;
              }
              else {
                  pos = 0;
                  len = 0;
              }
          }
          this.counter = counter;
          this.pos = pos;
          this.len = len;
          return result;
      }
      AES_GCM_Encrypt_finish() {
          let asm = this.asm;
          let heap = this.heap;
          let counter = this.counter;
          let tagSize = this.tagSize;
          let adata = this.adata;
          let pos = this.pos;
          let len = this.len;
          const result = new Uint8Array(len + tagSize);
          asm.cipher(AES_asm.ENC.CTR, AES_asm.HEAP_DATA + pos, (len + 15) & -16);
          if (len)
              result.set(heap.subarray(pos, pos + len));
          let i = len;
          for (; i & 15; i++)
              heap[pos + i] = 0;
          asm.mac(AES_asm.MAC.GCM, AES_asm.HEAP_DATA + pos, i);
          const alen = adata !== undefined ? adata.length : 0;
          const clen = ((counter - 1) << 4) + len;
          heap[0] = 0;
          heap[1] = 0;
          heap[2] = 0;
          heap[3] = alen >>> 29;
          heap[4] = alen >>> 21;
          heap[5] = (alen >>> 13) & 255;
          heap[6] = (alen >>> 5) & 255;
          heap[7] = (alen << 3) & 255;
          heap[8] = heap[9] = heap[10] = 0;
          heap[11] = clen >>> 29;
          heap[12] = (clen >>> 21) & 255;
          heap[13] = (clen >>> 13) & 255;
          heap[14] = (clen >>> 5) & 255;
          heap[15] = (clen << 3) & 255;
          asm.mac(AES_asm.MAC.GCM, AES_asm.HEAP_DATA, 16);
          asm.get_iv(AES_asm.HEAP_DATA);
          asm.set_counter(0, 0, 0, this.gamma0);
          asm.cipher(AES_asm.ENC.CTR, AES_asm.HEAP_DATA, 16);
          result.set(heap.subarray(0, tagSize), len);
          this.counter = 1;
          this.pos = 0;
          this.len = 0;
          return result;
      }
      AES_GCM_Decrypt_process(data) {
          let dpos = 0;
          let dlen = data.length || 0;
          let asm = this.asm;
          let heap = this.heap;
          let counter = this.counter;
          let tagSize = this.tagSize;
          let pos = this.pos;
          let len = this.len;
          let rpos = 0;
          let rlen = len + dlen > tagSize ? (len + dlen - tagSize) & -16 : 0;
          let tlen = len + dlen - rlen;
          let wlen = 0;
          if (((counter - 1) << 4) + len + dlen > _AES_GCM_data_maxLength)
              throw new RangeError('counter overflow');
          const result = new Uint8Array(rlen);
          while (dlen > tlen) {
              wlen = _heap_write(heap, pos + len, data, dpos, dlen - tlen);
              len += wlen;
              dpos += wlen;
              dlen -= wlen;
              wlen = asm.mac(AES_asm.MAC.GCM, AES_asm.HEAP_DATA + pos, wlen);
              wlen = asm.cipher(AES_asm.DEC.CTR, AES_asm.HEAP_DATA + pos, wlen);
              if (wlen)
                  result.set(heap.subarray(pos, pos + wlen), rpos);
              counter += wlen >>> 4;
              rpos += wlen;
              pos = 0;
              len = 0;
          }
          if (dlen > 0) {
              len += _heap_write(heap, 0, data, dpos, dlen);
          }
          this.counter = counter;
          this.pos = pos;
          this.len = len;
          return result;
      }
      AES_GCM_Decrypt_finish() {
          let asm = this.asm;
          let heap = this.heap;
          let tagSize = this.tagSize;
          let adata = this.adata;
          let counter = this.counter;
          let pos = this.pos;
          let len = this.len;
          let rlen = len - tagSize;
          if (len < tagSize)
              throw new IllegalStateError('authentication tag not found');
          const result = new Uint8Array(rlen);
          const atag = new Uint8Array(heap.subarray(pos + rlen, pos + len));
          let i = rlen;
          for (; i & 15; i++)
              heap[pos + i] = 0;
          asm.mac(AES_asm.MAC.GCM, AES_asm.HEAP_DATA + pos, i);
          asm.cipher(AES_asm.DEC.CTR, AES_asm.HEAP_DATA + pos, i);
          if (rlen)
              result.set(heap.subarray(pos, pos + rlen));
          const alen = adata !== undefined ? adata.length : 0;
          const clen = ((counter - 1) << 4) + len - tagSize;
          heap[0] = 0;
          heap[1] = 0;
          heap[2] = 0;
          heap[3] = alen >>> 29;
          heap[4] = alen >>> 21;
          heap[5] = (alen >>> 13) & 255;
          heap[6] = (alen >>> 5) & 255;
          heap[7] = (alen << 3) & 255;
          heap[8] = heap[9] = heap[10] = 0;
          heap[11] = clen >>> 29;
          heap[12] = (clen >>> 21) & 255;
          heap[13] = (clen >>> 13) & 255;
          heap[14] = (clen >>> 5) & 255;
          heap[15] = (clen << 3) & 255;
          asm.mac(AES_asm.MAC.GCM, AES_asm.HEAP_DATA, 16);
          asm.get_iv(AES_asm.HEAP_DATA);
          asm.set_counter(0, 0, 0, this.gamma0);
          asm.cipher(AES_asm.ENC.CTR, AES_asm.HEAP_DATA, 16);
          let acheck = 0;
          for (let i = 0; i < tagSize; ++i)
              acheck |= atag[i] ^ heap[i];
          if (acheck)
              throw new SecurityError('data integrity check failed');
          this.counter = 1;
          this.pos = 0;
          this.len = 0;
          return result;
      }
      AES_GCM_decrypt(data) {
          const result1 = this.AES_GCM_Decrypt_process(data);
          const result2 = this.AES_GCM_Decrypt_finish();
          const result = new Uint8Array(result1.length + result2.length);
          if (result1.length)
              result.set(result1);
          if (result2.length)
              result.set(result2, result1.length);
          return result;
      }
      AES_GCM_encrypt(data) {
          const result1 = this.AES_GCM_Encrypt_process(data);
          const result2 = this.AES_GCM_Encrypt_finish();
          const result = new Uint8Array(result1.length + result2.length);
          if (result1.length)
              result.set(result1);
          if (result2.length)
              result.set(result2, result1.length);
          return result;
      }
      _gcm_mac_process(data) {
          const heap = this.heap;
          const asm = this.asm;
          let dpos = 0;
          let dlen = data.length || 0;
          let wlen = 0;
          while (dlen > 0) {
              wlen = _heap_write(heap, 0, data, dpos, dlen);
              dpos += wlen;
              dlen -= wlen;
              while (wlen & 15)
                  heap[wlen++] = 0;
              asm.mac(AES_asm.MAC.GCM, AES_asm.HEAP_DATA, wlen);
          }
      }
  }

  /**
   * Integers are represented as little endian array of 32-bit limbs.
   * Limbs number is a power of 2 and a multiple of 8 (256 bits).
   * Negative values use two's complement representation.
   */
  var bigint_asm = function ( stdlib, foreign, buffer ) {
      "use asm";

      var SP = 0;

      var HEAP32 = new stdlib.Uint32Array(buffer);

      var imul = stdlib.Math.imul;

      /**
       * Simple stack memory allocator
       *
       * Methods:
       *  sreset
       *  salloc
       *  sfree
       */

      function sreset ( p ) {
          p = p|0;
          SP = p = (p + 31) & -32;
          return p|0;
      }

      function salloc ( l ) {
          l = l|0;
          var p = 0; p = SP;
          SP = p + ((l + 31) & -32)|0;
          return p|0;
      }

      function sfree ( l ) {
          l = l|0;
          SP = SP - ((l + 31) & -32)|0;
      }

      /**
       * Utility functions:
       *  cp
       *  z
       */

      function cp ( l, A, B ) {
          l = l|0;
          A = A|0;
          B = B|0;

          var i = 0;

          if ( (A|0) > (B|0) ) {
              for ( ; (i|0) < (l|0); i = (i+4)|0 ) {
                  HEAP32[(B+i)>>2] = HEAP32[(A+i)>>2];
              }
          }
          else {
              for ( i = (l-4)|0; (i|0) >= 0; i = (i-4)|0 ) {
                  HEAP32[(B+i)>>2] = HEAP32[(A+i)>>2];
              }
          }
      }

      function z ( l, z, A ) {
          l = l|0;
          z = z|0;
          A = A|0;

          var i = 0;

          for ( ; (i|0) < (l|0); i = (i+4)|0 ) {
              HEAP32[(A+i)>>2] = z;
          }
      }

      /**
       * Negate the argument
       *
       * Perform two's complement transformation:
       *
       *  -A = ~A + 1
       *
       * @param A offset of the argment being negated, 32-byte aligned
       * @param lA length of the argument, multiple of 32
       *
       * @param R offset where to place the result to, 32-byte aligned
       * @param lR length to truncate the result to, multiple of 32
       */
      function neg ( A, lA, R, lR ) {
          A  =  A|0;
          lA = lA|0;
          R  =  R|0;
          lR = lR|0;

          var a = 0, c = 0, t = 0, r = 0, i = 0;

          if ( (lR|0) <= 0 )
              lR = lA;

          if ( (lR|0) < (lA|0) )
              lA = lR;

          c = 1;
          for ( ; (i|0) < (lA|0); i = (i+4)|0 ) {
              a = ~HEAP32[(A+i)>>2];
              t = (a & 0xffff) + c|0;
              r = (a >>> 16) + (t >>> 16)|0;
              HEAP32[(R+i)>>2] = (r << 16) | (t & 0xffff);
              c = r >>> 16;
          }

          for ( ; (i|0) < (lR|0); i = (i+4)|0 ) {
              HEAP32[(R+i)>>2] = (c-1)|0;
          }

          return c|0;
      }

      function cmp ( A, lA, B, lB ) {
          A  =  A|0;
          lA = lA|0;
          B  =  B|0;
          lB = lB|0;

          var a = 0, b = 0, i = 0;

          if ( (lA|0) > (lB|0) ) {
              for ( i = (lA-4)|0; (i|0) >= (lB|0); i = (i-4)|0 ) {
                  if ( HEAP32[(A+i)>>2]|0 ) return 1;
              }
          }
          else {
              for ( i = (lB-4)|0; (i|0) >= (lA|0); i = (i-4)|0 ) {
                  if ( HEAP32[(B+i)>>2]|0 ) return -1;
              }
          }

          for ( ; (i|0) >= 0; i = (i-4)|0 ) {
              a = HEAP32[(A+i)>>2]|0, b = HEAP32[(B+i)>>2]|0;
              if ( (a>>>0) < (b>>>0) ) return -1;
              if ( (a>>>0) > (b>>>0) ) return 1;
          }

          return 0;
      }

      /**
       * Test the argument
       *
       * Same as `cmp` with zero.
       */
      function tst ( A, lA ) {
          A  =  A|0;
          lA = lA|0;

          var i = 0;

          for ( i = (lA-4)|0; (i|0) >= 0; i = (i-4)|0 ) {
              if ( HEAP32[(A+i)>>2]|0 ) return (i+4)|0;
          }

          return 0;
      }

      /**
       * Conventional addition
       *
       * @param A offset of the first argument, 32-byte aligned
       * @param lA length of the first argument, multiple of 32
       *
       * @param B offset of the second argument, 32-bit aligned
       * @param lB length of the second argument, multiple of 32
       *
       * @param R offset where to place the result to, 32-byte aligned
       * @param lR length to truncate the result to, multiple of 32
       */
      function add ( A, lA, B, lB, R, lR ) {
          A  =  A|0;
          lA = lA|0;
          B  =  B|0;
          lB = lB|0;
          R  =  R|0;
          lR = lR|0;

          var a = 0, b = 0, c = 0, t = 0, r = 0, i = 0;

          if ( (lA|0) < (lB|0) ) {
              t = A, A = B, B = t;
              t = lA, lA = lB, lB = t;
          }

          if ( (lR|0) <= 0 )
              lR = lA+4|0;

          if ( (lR|0) < (lB|0) )
              lA = lB = lR;

          for ( ; (i|0) < (lB|0); i = (i+4)|0 ) {
              a = HEAP32[(A+i)>>2]|0;
              b = HEAP32[(B+i)>>2]|0;
              t = ( (a & 0xffff) + (b & 0xffff)|0 ) + c|0;
              r = ( (a >>> 16) + (b >>> 16)|0 ) + (t >>> 16)|0;
              HEAP32[(R+i)>>2] = (t & 0xffff) | (r << 16);
              c = r >>> 16;
          }

          for ( ; (i|0) < (lA|0); i = (i+4)|0 ) {
              a = HEAP32[(A+i)>>2]|0;
              t = (a & 0xffff) + c|0;
              r = (a >>> 16) + (t >>> 16)|0;
              HEAP32[(R+i)>>2] = (t & 0xffff) | (r << 16);
              c = r >>> 16;
          }

          for ( ; (i|0) < (lR|0); i = (i+4)|0 ) {
              HEAP32[(R+i)>>2] = c|0;
              c = 0;
          }

          return c|0;
      }

     /**
       * Conventional subtraction
       *
       * @param A offset of the first argument, 32-byte aligned
       * @param lA length of the first argument, multiple of 32
       *
       * @param B offset of the second argument, 32-bit aligned
       * @param lB length of the second argument, multiple of 32
       *
       * @param R offset where to place the result to, 32-byte aligned
       * @param lR length to truncate the result to, multiple of 32
       */
      function sub ( A, lA, B, lB, R, lR ) {
          A  =  A|0;
          lA = lA|0;
          B  =  B|0;
          lB = lB|0;
          R  =  R|0;
          lR = lR|0;

          var a = 0, b = 0, c = 0, t = 0, r = 0, i = 0;

          if ( (lR|0) <= 0 )
              lR = (lA|0) > (lB|0) ? lA+4|0 : lB+4|0;

          if ( (lR|0) < (lA|0) )
              lA = lR;

          if ( (lR|0) < (lB|0) )
              lB = lR;

          if ( (lA|0) < (lB|0) ) {
              for ( ; (i|0) < (lA|0); i = (i+4)|0 ) {
                  a = HEAP32[(A+i)>>2]|0;
                  b = HEAP32[(B+i)>>2]|0;
                  t = ( (a & 0xffff) - (b & 0xffff)|0 ) + c|0;
                  r = ( (a >>> 16) - (b >>> 16)|0 ) + (t >> 16)|0;
                  HEAP32[(R+i)>>2] = (t & 0xffff) | (r << 16);
                  c = r >> 16;
              }

              for ( ; (i|0) < (lB|0); i = (i+4)|0 ) {
                  b = HEAP32[(B+i)>>2]|0;
                  t = c - (b & 0xffff)|0;
                  r = (t >> 16) - (b >>> 16)|0;
                  HEAP32[(R+i)>>2] = (t & 0xffff) | (r << 16);
                  c = r >> 16;
              }
          }
          else {
              for ( ; (i|0) < (lB|0); i = (i+4)|0 ) {
                  a = HEAP32[(A+i)>>2]|0;
                  b = HEAP32[(B+i)>>2]|0;
                  t = ( (a & 0xffff) - (b & 0xffff)|0 ) + c|0;
                  r = ( (a >>> 16) - (b >>> 16)|0 ) + (t >> 16)|0;
                  HEAP32[(R+i)>>2] = (t & 0xffff) | (r << 16);
                  c = r >> 16;
              }

              for ( ; (i|0) < (lA|0); i = (i+4)|0 ) {
                  a = HEAP32[(A+i)>>2]|0;
                  t = (a & 0xffff) + c|0;
                  r = (a >>> 16) + (t >> 16)|0;
                  HEAP32[(R+i)>>2] = (t & 0xffff) | (r << 16);
                  c = r >> 16;
              }
          }

          for ( ; (i|0) < (lR|0); i = (i+4)|0 ) {
              HEAP32[(R+i)>>2] = c|0;
          }

          return c|0;
      }

      /**
       * Conventional multiplication
       *
       * TODO implement Karatsuba algorithm for large multiplicands
       *
       * @param A offset of the first argument, 32-byte aligned
       * @param lA length of the first argument, multiple of 32
       *
       * @param B offset of the second argument, 32-byte aligned
       * @param lB length of the second argument, multiple of 32
       *
       * @param R offset where to place the result to, 32-byte aligned
       * @param lR length to truncate the result to, multiple of 32
       */
      function mul ( A, lA, B, lB, R, lR ) {
          A  =  A|0;
          lA = lA|0;
          B  =  B|0;
          lB = lB|0;
          R  =  R|0;
          lR = lR|0;

          var al0 = 0, al1 = 0, al2 = 0, al3 = 0, al4 = 0, al5 = 0, al6 = 0, al7 = 0, ah0 = 0, ah1 = 0, ah2 = 0, ah3 = 0, ah4 = 0, ah5 = 0, ah6 = 0, ah7 = 0,
              bl0 = 0, bl1 = 0, bl2 = 0, bl3 = 0, bl4 = 0, bl5 = 0, bl6 = 0, bl7 = 0, bh0 = 0, bh1 = 0, bh2 = 0, bh3 = 0, bh4 = 0, bh5 = 0, bh6 = 0, bh7 = 0,
              r0 = 0, r1 = 0, r2 = 0, r3 = 0, r4 = 0, r5 = 0, r6 = 0, r7 = 0, r8 = 0, r9 = 0, r10 = 0, r11 = 0, r12 = 0, r13 = 0, r14 = 0, r15 = 0,
              u = 0, v = 0, w = 0, m = 0,
              i = 0, Ai = 0, j = 0, Bj = 0, Rk = 0;

          if ( (lA|0) > (lB|0) ) {
              u = A, v = lA;
              A = B, lA = lB;
              B = u, lB = v;
          }

          m = (lA+lB)|0;
          if ( ( (lR|0) > (m|0) ) | ( (lR|0) <= 0 ) )
              lR = m;

          if ( (lR|0) < (lA|0) )
              lA = lR;

          if ( (lR|0) < (lB|0) )
              lB = lR;

          for ( ; (i|0) < (lA|0); i = (i+32)|0 ) {
              Ai = (A+i)|0;

              ah0 = HEAP32[(Ai|0)>>2]|0,
              ah1 = HEAP32[(Ai|4)>>2]|0,
              ah2 = HEAP32[(Ai|8)>>2]|0,
              ah3 = HEAP32[(Ai|12)>>2]|0,
              ah4 = HEAP32[(Ai|16)>>2]|0,
              ah5 = HEAP32[(Ai|20)>>2]|0,
              ah6 = HEAP32[(Ai|24)>>2]|0,
              ah7 = HEAP32[(Ai|28)>>2]|0,
              al0 = ah0 & 0xffff,
              al1 = ah1 & 0xffff,
              al2 = ah2 & 0xffff,
              al3 = ah3 & 0xffff,
              al4 = ah4 & 0xffff,
              al5 = ah5 & 0xffff,
              al6 = ah6 & 0xffff,
              al7 = ah7 & 0xffff,
              ah0 = ah0 >>> 16,
              ah1 = ah1 >>> 16,
              ah2 = ah2 >>> 16,
              ah3 = ah3 >>> 16,
              ah4 = ah4 >>> 16,
              ah5 = ah5 >>> 16,
              ah6 = ah6 >>> 16,
              ah7 = ah7 >>> 16;

              r8 = r9 = r10 = r11 = r12 = r13 = r14 = r15 = 0;

              for ( j = 0; (j|0) < (lB|0); j = (j+32)|0 ) {
                  Bj = (B+j)|0;
                  Rk = (R+(i+j|0))|0;

                  bh0 = HEAP32[(Bj|0)>>2]|0,
                  bh1 = HEAP32[(Bj|4)>>2]|0,
                  bh2 = HEAP32[(Bj|8)>>2]|0,
                  bh3 = HEAP32[(Bj|12)>>2]|0,
                  bh4 = HEAP32[(Bj|16)>>2]|0,
                  bh5 = HEAP32[(Bj|20)>>2]|0,
                  bh6 = HEAP32[(Bj|24)>>2]|0,
                  bh7 = HEAP32[(Bj|28)>>2]|0,
                  bl0 = bh0 & 0xffff,
                  bl1 = bh1 & 0xffff,
                  bl2 = bh2 & 0xffff,
                  bl3 = bh3 & 0xffff,
                  bl4 = bh4 & 0xffff,
                  bl5 = bh5 & 0xffff,
                  bl6 = bh6 & 0xffff,
                  bl7 = bh7 & 0xffff,
                  bh0 = bh0 >>> 16,
                  bh1 = bh1 >>> 16,
                  bh2 = bh2 >>> 16,
                  bh3 = bh3 >>> 16,
                  bh4 = bh4 >>> 16,
                  bh5 = bh5 >>> 16,
                  bh6 = bh6 >>> 16,
                  bh7 = bh7 >>> 16;

                  r0 = HEAP32[(Rk|0)>>2]|0,
                  r1 = HEAP32[(Rk|4)>>2]|0,
                  r2 = HEAP32[(Rk|8)>>2]|0,
                  r3 = HEAP32[(Rk|12)>>2]|0,
                  r4 = HEAP32[(Rk|16)>>2]|0,
                  r5 = HEAP32[(Rk|20)>>2]|0,
                  r6 = HEAP32[(Rk|24)>>2]|0,
                  r7 = HEAP32[(Rk|28)>>2]|0;

                  u = ((imul(al0, bl0)|0) + (r8 & 0xffff)|0) + (r0 & 0xffff)|0;
                  v = ((imul(ah0, bl0)|0) + (r8 >>> 16)|0) + (r0 >>> 16)|0;
                  w = ((imul(al0, bh0)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah0, bh0)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r0 = (w << 16) | (u & 0xffff);

                  u = ((imul(al0, bl1)|0) + (m & 0xffff)|0) + (r1 & 0xffff)|0;
                  v = ((imul(ah0, bl1)|0) + (m >>> 16)|0) + (r1 >>> 16)|0;
                  w = ((imul(al0, bh1)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah0, bh1)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r1 = (w << 16) | (u & 0xffff);

                  u = ((imul(al0, bl2)|0) + (m & 0xffff)|0) + (r2 & 0xffff)|0;
                  v = ((imul(ah0, bl2)|0) + (m >>> 16)|0) + (r2 >>> 16)|0;
                  w = ((imul(al0, bh2)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah0, bh2)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r2 = (w << 16) | (u & 0xffff);

                  u = ((imul(al0, bl3)|0) + (m & 0xffff)|0) + (r3 & 0xffff)|0;
                  v = ((imul(ah0, bl3)|0) + (m >>> 16)|0) + (r3 >>> 16)|0;
                  w = ((imul(al0, bh3)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah0, bh3)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r3 = (w << 16) | (u & 0xffff);

                  u = ((imul(al0, bl4)|0) + (m & 0xffff)|0) + (r4 & 0xffff)|0;
                  v = ((imul(ah0, bl4)|0) + (m >>> 16)|0) + (r4 >>> 16)|0;
                  w = ((imul(al0, bh4)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah0, bh4)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r4 = (w << 16) | (u & 0xffff);

                  u = ((imul(al0, bl5)|0) + (m & 0xffff)|0) + (r5 & 0xffff)|0;
                  v = ((imul(ah0, bl5)|0) + (m >>> 16)|0) + (r5 >>> 16)|0;
                  w = ((imul(al0, bh5)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah0, bh5)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r5 = (w << 16) | (u & 0xffff);

                  u = ((imul(al0, bl6)|0) + (m & 0xffff)|0) + (r6 & 0xffff)|0;
                  v = ((imul(ah0, bl6)|0) + (m >>> 16)|0) + (r6 >>> 16)|0;
                  w = ((imul(al0, bh6)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah0, bh6)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r6 = (w << 16) | (u & 0xffff);

                  u = ((imul(al0, bl7)|0) + (m & 0xffff)|0) + (r7 & 0xffff)|0;
                  v = ((imul(ah0, bl7)|0) + (m >>> 16)|0) + (r7 >>> 16)|0;
                  w = ((imul(al0, bh7)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah0, bh7)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r7 = (w << 16) | (u & 0xffff);

                  r8 = m;

                  u = ((imul(al1, bl0)|0) + (r9 & 0xffff)|0) + (r1 & 0xffff)|0;
                  v = ((imul(ah1, bl0)|0) + (r9 >>> 16)|0) + (r1 >>> 16)|0;
                  w = ((imul(al1, bh0)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah1, bh0)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r1 = (w << 16) | (u & 0xffff);

                  u = ((imul(al1, bl1)|0) + (m & 0xffff)|0) + (r2 & 0xffff)|0;
                  v = ((imul(ah1, bl1)|0) + (m >>> 16)|0) + (r2 >>> 16)|0;
                  w = ((imul(al1, bh1)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah1, bh1)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r2 = (w << 16) | (u & 0xffff);

                  u = ((imul(al1, bl2)|0) + (m & 0xffff)|0) + (r3 & 0xffff)|0;
                  v = ((imul(ah1, bl2)|0) + (m >>> 16)|0) + (r3 >>> 16)|0;
                  w = ((imul(al1, bh2)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah1, bh2)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r3 = (w << 16) | (u & 0xffff);

                  u = ((imul(al1, bl3)|0) + (m & 0xffff)|0) + (r4 & 0xffff)|0;
                  v = ((imul(ah1, bl3)|0) + (m >>> 16)|0) + (r4 >>> 16)|0;
                  w = ((imul(al1, bh3)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah1, bh3)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r4 = (w << 16) | (u & 0xffff);

                  u = ((imul(al1, bl4)|0) + (m & 0xffff)|0) + (r5 & 0xffff)|0;
                  v = ((imul(ah1, bl4)|0) + (m >>> 16)|0) + (r5 >>> 16)|0;
                  w = ((imul(al1, bh4)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah1, bh4)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r5 = (w << 16) | (u & 0xffff);

                  u = ((imul(al1, bl5)|0) + (m & 0xffff)|0) + (r6 & 0xffff)|0;
                  v = ((imul(ah1, bl5)|0) + (m >>> 16)|0) + (r6 >>> 16)|0;
                  w = ((imul(al1, bh5)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah1, bh5)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r6 = (w << 16) | (u & 0xffff);

                  u = ((imul(al1, bl6)|0) + (m & 0xffff)|0) + (r7 & 0xffff)|0;
                  v = ((imul(ah1, bl6)|0) + (m >>> 16)|0) + (r7 >>> 16)|0;
                  w = ((imul(al1, bh6)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah1, bh6)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r7 = (w << 16) | (u & 0xffff);

                  u = ((imul(al1, bl7)|0) + (m & 0xffff)|0) + (r8 & 0xffff)|0;
                  v = ((imul(ah1, bl7)|0) + (m >>> 16)|0) + (r8 >>> 16)|0;
                  w = ((imul(al1, bh7)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah1, bh7)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r8 = (w << 16) | (u & 0xffff);

                  r9 = m;

                  u = ((imul(al2, bl0)|0) + (r10 & 0xffff)|0) + (r2 & 0xffff)|0;
                  v = ((imul(ah2, bl0)|0) + (r10 >>> 16)|0) + (r2 >>> 16)|0;
                  w = ((imul(al2, bh0)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah2, bh0)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r2 = (w << 16) | (u & 0xffff);

                  u = ((imul(al2, bl1)|0) + (m & 0xffff)|0) + (r3 & 0xffff)|0;
                  v = ((imul(ah2, bl1)|0) + (m >>> 16)|0) + (r3 >>> 16)|0;
                  w = ((imul(al2, bh1)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah2, bh1)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r3 = (w << 16) | (u & 0xffff);

                  u = ((imul(al2, bl2)|0) + (m & 0xffff)|0) + (r4 & 0xffff)|0;
                  v = ((imul(ah2, bl2)|0) + (m >>> 16)|0) + (r4 >>> 16)|0;
                  w = ((imul(al2, bh2)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah2, bh2)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r4 = (w << 16) | (u & 0xffff);

                  u = ((imul(al2, bl3)|0) + (m & 0xffff)|0) + (r5 & 0xffff)|0;
                  v = ((imul(ah2, bl3)|0) + (m >>> 16)|0) + (r5 >>> 16)|0;
                  w = ((imul(al2, bh3)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah2, bh3)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r5 = (w << 16) | (u & 0xffff);

                  u = ((imul(al2, bl4)|0) + (m & 0xffff)|0) + (r6 & 0xffff)|0;
                  v = ((imul(ah2, bl4)|0) + (m >>> 16)|0) + (r6 >>> 16)|0;
                  w = ((imul(al2, bh4)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah2, bh4)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r6 = (w << 16) | (u & 0xffff);

                  u = ((imul(al2, bl5)|0) + (m & 0xffff)|0) + (r7 & 0xffff)|0;
                  v = ((imul(ah2, bl5)|0) + (m >>> 16)|0) + (r7 >>> 16)|0;
                  w = ((imul(al2, bh5)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah2, bh5)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r7 = (w << 16) | (u & 0xffff);

                  u = ((imul(al2, bl6)|0) + (m & 0xffff)|0) + (r8 & 0xffff)|0;
                  v = ((imul(ah2, bl6)|0) + (m >>> 16)|0) + (r8 >>> 16)|0;
                  w = ((imul(al2, bh6)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah2, bh6)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r8 = (w << 16) | (u & 0xffff);

                  u = ((imul(al2, bl7)|0) + (m & 0xffff)|0) + (r9 & 0xffff)|0;
                  v = ((imul(ah2, bl7)|0) + (m >>> 16)|0) + (r9 >>> 16)|0;
                  w = ((imul(al2, bh7)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah2, bh7)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r9 = (w << 16) | (u & 0xffff);

                  r10 = m;

                  u = ((imul(al3, bl0)|0) + (r11 & 0xffff)|0) + (r3 & 0xffff)|0;
                  v = ((imul(ah3, bl0)|0) + (r11 >>> 16)|0) + (r3 >>> 16)|0;
                  w = ((imul(al3, bh0)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah3, bh0)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r3 = (w << 16) | (u & 0xffff);

                  u = ((imul(al3, bl1)|0) + (m & 0xffff)|0) + (r4 & 0xffff)|0;
                  v = ((imul(ah3, bl1)|0) + (m >>> 16)|0) + (r4 >>> 16)|0;
                  w = ((imul(al3, bh1)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah3, bh1)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r4 = (w << 16) | (u & 0xffff);

                  u = ((imul(al3, bl2)|0) + (m & 0xffff)|0) + (r5 & 0xffff)|0;
                  v = ((imul(ah3, bl2)|0) + (m >>> 16)|0) + (r5 >>> 16)|0;
                  w = ((imul(al3, bh2)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah3, bh2)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r5 = (w << 16) | (u & 0xffff);

                  u = ((imul(al3, bl3)|0) + (m & 0xffff)|0) + (r6 & 0xffff)|0;
                  v = ((imul(ah3, bl3)|0) + (m >>> 16)|0) + (r6 >>> 16)|0;
                  w = ((imul(al3, bh3)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah3, bh3)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r6 = (w << 16) | (u & 0xffff);

                  u = ((imul(al3, bl4)|0) + (m & 0xffff)|0) + (r7 & 0xffff)|0;
                  v = ((imul(ah3, bl4)|0) + (m >>> 16)|0) + (r7 >>> 16)|0;
                  w = ((imul(al3, bh4)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah3, bh4)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r7 = (w << 16) | (u & 0xffff);

                  u = ((imul(al3, bl5)|0) + (m & 0xffff)|0) + (r8 & 0xffff)|0;
                  v = ((imul(ah3, bl5)|0) + (m >>> 16)|0) + (r8 >>> 16)|0;
                  w = ((imul(al3, bh5)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah3, bh5)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r8 = (w << 16) | (u & 0xffff);

                  u = ((imul(al3, bl6)|0) + (m & 0xffff)|0) + (r9 & 0xffff)|0;
                  v = ((imul(ah3, bl6)|0) + (m >>> 16)|0) + (r9 >>> 16)|0;
                  w = ((imul(al3, bh6)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah3, bh6)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r9 = (w << 16) | (u & 0xffff);

                  u = ((imul(al3, bl7)|0) + (m & 0xffff)|0) + (r10 & 0xffff)|0;
                  v = ((imul(ah3, bl7)|0) + (m >>> 16)|0) + (r10 >>> 16)|0;
                  w = ((imul(al3, bh7)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah3, bh7)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r10 = (w << 16) | (u & 0xffff);

                  r11 = m;

                  u = ((imul(al4, bl0)|0) + (r12 & 0xffff)|0) + (r4 & 0xffff)|0;
                  v = ((imul(ah4, bl0)|0) + (r12 >>> 16)|0) + (r4 >>> 16)|0;
                  w = ((imul(al4, bh0)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah4, bh0)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r4 = (w << 16) | (u & 0xffff);

                  u = ((imul(al4, bl1)|0) + (m & 0xffff)|0) + (r5 & 0xffff)|0;
                  v = ((imul(ah4, bl1)|0) + (m >>> 16)|0) + (r5 >>> 16)|0;
                  w = ((imul(al4, bh1)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah4, bh1)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r5 = (w << 16) | (u & 0xffff);

                  u = ((imul(al4, bl2)|0) + (m & 0xffff)|0) + (r6 & 0xffff)|0;
                  v = ((imul(ah4, bl2)|0) + (m >>> 16)|0) + (r6 >>> 16)|0;
                  w = ((imul(al4, bh2)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah4, bh2)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r6 = (w << 16) | (u & 0xffff);

                  u = ((imul(al4, bl3)|0) + (m & 0xffff)|0) + (r7 & 0xffff)|0;
                  v = ((imul(ah4, bl3)|0) + (m >>> 16)|0) + (r7 >>> 16)|0;
                  w = ((imul(al4, bh3)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah4, bh3)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r7 = (w << 16) | (u & 0xffff);

                  u = ((imul(al4, bl4)|0) + (m & 0xffff)|0) + (r8 & 0xffff)|0;
                  v = ((imul(ah4, bl4)|0) + (m >>> 16)|0) + (r8 >>> 16)|0;
                  w = ((imul(al4, bh4)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah4, bh4)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r8 = (w << 16) | (u & 0xffff);

                  u = ((imul(al4, bl5)|0) + (m & 0xffff)|0) + (r9 & 0xffff)|0;
                  v = ((imul(ah4, bl5)|0) + (m >>> 16)|0) + (r9 >>> 16)|0;
                  w = ((imul(al4, bh5)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah4, bh5)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r9 = (w << 16) | (u & 0xffff);

                  u = ((imul(al4, bl6)|0) + (m & 0xffff)|0) + (r10 & 0xffff)|0;
                  v = ((imul(ah4, bl6)|0) + (m >>> 16)|0) + (r10 >>> 16)|0;
                  w = ((imul(al4, bh6)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah4, bh6)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r10 = (w << 16) | (u & 0xffff);

                  u = ((imul(al4, bl7)|0) + (m & 0xffff)|0) + (r11 & 0xffff)|0;
                  v = ((imul(ah4, bl7)|0) + (m >>> 16)|0) + (r11 >>> 16)|0;
                  w = ((imul(al4, bh7)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah4, bh7)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r11 = (w << 16) | (u & 0xffff);

                  r12 = m;

                  u = ((imul(al5, bl0)|0) + (r13 & 0xffff)|0) + (r5 & 0xffff)|0;
                  v = ((imul(ah5, bl0)|0) + (r13 >>> 16)|0) + (r5 >>> 16)|0;
                  w = ((imul(al5, bh0)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah5, bh0)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r5 = (w << 16) | (u & 0xffff);

                  u = ((imul(al5, bl1)|0) + (m & 0xffff)|0) + (r6 & 0xffff)|0;
                  v = ((imul(ah5, bl1)|0) + (m >>> 16)|0) + (r6 >>> 16)|0;
                  w = ((imul(al5, bh1)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah5, bh1)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r6 = (w << 16) | (u & 0xffff);

                  u = ((imul(al5, bl2)|0) + (m & 0xffff)|0) + (r7 & 0xffff)|0;
                  v = ((imul(ah5, bl2)|0) + (m >>> 16)|0) + (r7 >>> 16)|0;
                  w = ((imul(al5, bh2)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah5, bh2)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r7 = (w << 16) | (u & 0xffff);

                  u = ((imul(al5, bl3)|0) + (m & 0xffff)|0) + (r8 & 0xffff)|0;
                  v = ((imul(ah5, bl3)|0) + (m >>> 16)|0) + (r8 >>> 16)|0;
                  w = ((imul(al5, bh3)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah5, bh3)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r8 = (w << 16) | (u & 0xffff);

                  u = ((imul(al5, bl4)|0) + (m & 0xffff)|0) + (r9 & 0xffff)|0;
                  v = ((imul(ah5, bl4)|0) + (m >>> 16)|0) + (r9 >>> 16)|0;
                  w = ((imul(al5, bh4)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah5, bh4)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r9 = (w << 16) | (u & 0xffff);

                  u = ((imul(al5, bl5)|0) + (m & 0xffff)|0) + (r10 & 0xffff)|0;
                  v = ((imul(ah5, bl5)|0) + (m >>> 16)|0) + (r10 >>> 16)|0;
                  w = ((imul(al5, bh5)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah5, bh5)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r10 = (w << 16) | (u & 0xffff);

                  u = ((imul(al5, bl6)|0) + (m & 0xffff)|0) + (r11 & 0xffff)|0;
                  v = ((imul(ah5, bl6)|0) + (m >>> 16)|0) + (r11 >>> 16)|0;
                  w = ((imul(al5, bh6)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah5, bh6)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r11 = (w << 16) | (u & 0xffff);

                  u = ((imul(al5, bl7)|0) + (m & 0xffff)|0) + (r12 & 0xffff)|0;
                  v = ((imul(ah5, bl7)|0) + (m >>> 16)|0) + (r12 >>> 16)|0;
                  w = ((imul(al5, bh7)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah5, bh7)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r12 = (w << 16) | (u & 0xffff);

                  r13 = m;

                  u = ((imul(al6, bl0)|0) + (r14 & 0xffff)|0) + (r6 & 0xffff)|0;
                  v = ((imul(ah6, bl0)|0) + (r14 >>> 16)|0) + (r6 >>> 16)|0;
                  w = ((imul(al6, bh0)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah6, bh0)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r6 = (w << 16) | (u & 0xffff);

                  u = ((imul(al6, bl1)|0) + (m & 0xffff)|0) + (r7 & 0xffff)|0;
                  v = ((imul(ah6, bl1)|0) + (m >>> 16)|0) + (r7 >>> 16)|0;
                  w = ((imul(al6, bh1)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah6, bh1)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r7 = (w << 16) | (u & 0xffff);

                  u = ((imul(al6, bl2)|0) + (m & 0xffff)|0) + (r8 & 0xffff)|0;
                  v = ((imul(ah6, bl2)|0) + (m >>> 16)|0) + (r8 >>> 16)|0;
                  w = ((imul(al6, bh2)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah6, bh2)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r8 = (w << 16) | (u & 0xffff);

                  u = ((imul(al6, bl3)|0) + (m & 0xffff)|0) + (r9 & 0xffff)|0;
                  v = ((imul(ah6, bl3)|0) + (m >>> 16)|0) + (r9 >>> 16)|0;
                  w = ((imul(al6, bh3)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah6, bh3)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r9 = (w << 16) | (u & 0xffff);

                  u = ((imul(al6, bl4)|0) + (m & 0xffff)|0) + (r10 & 0xffff)|0;
                  v = ((imul(ah6, bl4)|0) + (m >>> 16)|0) + (r10 >>> 16)|0;
                  w = ((imul(al6, bh4)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah6, bh4)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r10 = (w << 16) | (u & 0xffff);

                  u = ((imul(al6, bl5)|0) + (m & 0xffff)|0) + (r11 & 0xffff)|0;
                  v = ((imul(ah6, bl5)|0) + (m >>> 16)|0) + (r11 >>> 16)|0;
                  w = ((imul(al6, bh5)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah6, bh5)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r11 = (w << 16) | (u & 0xffff);

                  u = ((imul(al6, bl6)|0) + (m & 0xffff)|0) + (r12 & 0xffff)|0;
                  v = ((imul(ah6, bl6)|0) + (m >>> 16)|0) + (r12 >>> 16)|0;
                  w = ((imul(al6, bh6)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah6, bh6)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r12 = (w << 16) | (u & 0xffff);

                  u = ((imul(al6, bl7)|0) + (m & 0xffff)|0) + (r13 & 0xffff)|0;
                  v = ((imul(ah6, bl7)|0) + (m >>> 16)|0) + (r13 >>> 16)|0;
                  w = ((imul(al6, bh7)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah6, bh7)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r13 = (w << 16) | (u & 0xffff);

                  r14 = m;

                  u = ((imul(al7, bl0)|0) + (r15 & 0xffff)|0) + (r7 & 0xffff)|0;
                  v = ((imul(ah7, bl0)|0) + (r15 >>> 16)|0) + (r7 >>> 16)|0;
                  w = ((imul(al7, bh0)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah7, bh0)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r7 = (w << 16) | (u & 0xffff);

                  u = ((imul(al7, bl1)|0) + (m & 0xffff)|0) + (r8 & 0xffff)|0;
                  v = ((imul(ah7, bl1)|0) + (m >>> 16)|0) + (r8 >>> 16)|0;
                  w = ((imul(al7, bh1)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah7, bh1)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r8 = (w << 16) | (u & 0xffff);

                  u = ((imul(al7, bl2)|0) + (m & 0xffff)|0) + (r9 & 0xffff)|0;
                  v = ((imul(ah7, bl2)|0) + (m >>> 16)|0) + (r9 >>> 16)|0;
                  w = ((imul(al7, bh2)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah7, bh2)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r9 = (w << 16) | (u & 0xffff);

                  u = ((imul(al7, bl3)|0) + (m & 0xffff)|0) + (r10 & 0xffff)|0;
                  v = ((imul(ah7, bl3)|0) + (m >>> 16)|0) + (r10 >>> 16)|0;
                  w = ((imul(al7, bh3)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah7, bh3)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r10 = (w << 16) | (u & 0xffff);

                  u = ((imul(al7, bl4)|0) + (m & 0xffff)|0) + (r11 & 0xffff)|0;
                  v = ((imul(ah7, bl4)|0) + (m >>> 16)|0) + (r11 >>> 16)|0;
                  w = ((imul(al7, bh4)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah7, bh4)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r11 = (w << 16) | (u & 0xffff);

                  u = ((imul(al7, bl5)|0) + (m & 0xffff)|0) + (r12 & 0xffff)|0;
                  v = ((imul(ah7, bl5)|0) + (m >>> 16)|0) + (r12 >>> 16)|0;
                  w = ((imul(al7, bh5)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah7, bh5)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r12 = (w << 16) | (u & 0xffff);

                  u = ((imul(al7, bl6)|0) + (m & 0xffff)|0) + (r13 & 0xffff)|0;
                  v = ((imul(ah7, bl6)|0) + (m >>> 16)|0) + (r13 >>> 16)|0;
                  w = ((imul(al7, bh6)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah7, bh6)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r13 = (w << 16) | (u & 0xffff);

                  u = ((imul(al7, bl7)|0) + (m & 0xffff)|0) + (r14 & 0xffff)|0;
                  v = ((imul(ah7, bl7)|0) + (m >>> 16)|0) + (r14 >>> 16)|0;
                  w = ((imul(al7, bh7)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah7, bh7)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r14 = (w << 16) | (u & 0xffff);

                  r15 = m;

                  HEAP32[(Rk|0)>>2] = r0,
                  HEAP32[(Rk|4)>>2] = r1,
                  HEAP32[(Rk|8)>>2] = r2,
                  HEAP32[(Rk|12)>>2] = r3,
                  HEAP32[(Rk|16)>>2] = r4,
                  HEAP32[(Rk|20)>>2] = r5,
                  HEAP32[(Rk|24)>>2] = r6,
                  HEAP32[(Rk|28)>>2] = r7;
              }

              Rk = (R+(i+j|0))|0;
              HEAP32[(Rk|0)>>2] = r8,
              HEAP32[(Rk|4)>>2] = r9,
              HEAP32[(Rk|8)>>2] = r10,
              HEAP32[(Rk|12)>>2] = r11,
              HEAP32[(Rk|16)>>2] = r12,
              HEAP32[(Rk|20)>>2] = r13,
              HEAP32[(Rk|24)>>2] = r14,
              HEAP32[(Rk|28)>>2] = r15;
          }
  /*
          for ( i = lA & -32; (i|0) < (lA|0); i = (i+4)|0 ) {
              Ai = (A+i)|0;

              ah0 = HEAP32[Ai>>2]|0,
              al0 = ah0 & 0xffff,
              ah0 = ah0 >>> 16;

              r1 = 0;

              for ( j = 0; (j|0) < (lB|0); j = (j+4)|0 ) {
                  Bj = (B+j)|0;
                  Rk = (R+(i+j|0))|0;

                  bh0 = HEAP32[Bj>>2]|0,
                  bl0 = bh0 & 0xffff,
                  bh0 = bh0 >>> 16;

                  r0 = HEAP32[Rk>>2]|0;

                  u = ((imul(al0, bl0)|0) + (r1 & 0xffff)|0) + (r0 & 0xffff)|0;
                  v = ((imul(ah0, bl0)|0) + (r1 >>> 16)|0) + (r0 >>> 16)|0;
                  w = ((imul(al0, bh0)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                  m = ((imul(ah0, bh0)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                  r0 = (w << 16) | (u & 0xffff);

                  r1 = m;

                  HEAP32[Rk>>2] = r0;
              }

              Rk = (R+(i+j|0))|0;
              HEAP32[Rk>>2] = r1;
          }
  */
      }

      /**
       * Fast squaring
       *
       * Exploits the fact:
       *
       *  X² = ( X0 + X1*B )² = X0² + 2*X0*X1*B + X1²*B²,
       *
       * where B is a power of 2, so:
       *
       *  2*X0*X1*B = (X0*X1 << 1)*B
       *
       * @param A offset of the argument being squared, 32-byte aligned
       * @param lA length of the argument, multiple of 32
       *
       * @param R offset where to place the result to, 32-byte aligned
       */
      function sqr ( A, lA, R ) {
          A  =  A|0;
          lA = lA|0;
          R  =  R|0;

          var al0 = 0, al1 = 0, al2 = 0, al3 = 0, al4 = 0, al5 = 0, al6 = 0, al7 = 0, ah0 = 0, ah1 = 0, ah2 = 0, ah3 = 0, ah4 = 0, ah5 = 0, ah6 = 0, ah7 = 0,
              bl0 = 0, bl1 = 0, bl2 = 0, bl3 = 0, bl4 = 0, bl5 = 0, bl6 = 0, bl7 = 0, bh0 = 0, bh1 = 0, bh2 = 0, bh3 = 0, bh4 = 0, bh5 = 0, bh6 = 0, bh7 = 0,
              r0 = 0, r1 = 0, r2 = 0, r3 = 0, r4 = 0, r5 = 0, r6 = 0, r7 = 0, r8 = 0, r9 = 0, r10 = 0, r11 = 0, r12 = 0, r13 = 0, r14 = 0, r15 = 0,
              u = 0, v = 0, w = 0, c = 0, h = 0, m = 0, r = 0,
              d = 0, dd = 0, p = 0, i = 0, j = 0, k = 0, Ai = 0, Aj = 0, Rk = 0;

          // prepare for iterations
          for ( ; (i|0) < (lA|0); i = (i+4)|0 ) {
              Rk = R+(i<<1)|0;
              ah0 = HEAP32[(A+i)>>2]|0, al0 = ah0 & 0xffff, ah0 = ah0 >>> 16;
              u = imul(al0,al0)|0;
              v = (imul(al0,ah0)|0) + (u >>> 17)|0;
              w = (imul(ah0,ah0)|0) + (v >>> 15)|0;
              HEAP32[(Rk)>>2] = (v << 17) | (u & 0x1ffff);
              HEAP32[(Rk|4)>>2] = w;
          }

          // unrolled 1st iteration
          for ( p = 0; (p|0) < (lA|0); p = (p+8)|0 ) {
              Ai = A+p|0, Rk = R+(p<<1)|0;

              ah0 = HEAP32[(Ai)>>2]|0, al0 = ah0 & 0xffff, ah0 = ah0 >>> 16;

              bh0 = HEAP32[(Ai|4)>>2]|0, bl0 = bh0 & 0xffff, bh0 = bh0 >>> 16;

              u = imul(al0,bl0)|0;
              v = (imul(al0,bh0)|0) + (u >>> 16)|0;
              w = (imul(ah0,bl0)|0) + (v & 0xffff)|0;
              m = ((imul(ah0,bh0)|0) + (v >>> 16)|0) + (w >>> 16)|0;

              r = HEAP32[(Rk|4)>>2]|0;
              u = (r & 0xffff) + ((u & 0xffff) << 1)|0;
              w = ((r >>> 16) + ((w & 0xffff) << 1)|0) + (u >>> 16)|0;
              HEAP32[(Rk|4)>>2] = (w << 16) | (u & 0xffff);
              c = w >>> 16;

              r = HEAP32[(Rk|8)>>2]|0;
              u = ((r & 0xffff) + ((m & 0xffff) << 1)|0) + c|0;
              w = ((r >>> 16) + ((m >>> 16) << 1)|0) + (u >>> 16)|0;
              HEAP32[(Rk|8)>>2] = (w << 16) | (u & 0xffff);
              c = w >>> 16;

              if ( c ) {
                  r = HEAP32[(Rk|12)>>2]|0;
                  u = (r & 0xffff) + c|0;
                  w = (r >>> 16) + (u >>> 16)|0;
                  HEAP32[(Rk|12)>>2] = (w << 16) | (u & 0xffff);
              }
          }

          // unrolled 2nd iteration
          for ( p = 0; (p|0) < (lA|0); p = (p+16)|0 ) {
              Ai = A+p|0, Rk = R+(p<<1)|0;

              ah0 = HEAP32[(Ai)>>2]|0, al0 = ah0 & 0xffff, ah0 = ah0 >>> 16,
              ah1 = HEAP32[(Ai|4)>>2]|0, al1 = ah1 & 0xffff, ah1 = ah1 >>> 16;

              bh0 = HEAP32[(Ai|8)>>2]|0, bl0 = bh0 & 0xffff, bh0 = bh0 >>> 16,
              bh1 = HEAP32[(Ai|12)>>2]|0, bl1 = bh1 & 0xffff, bh1 = bh1 >>> 16;

              u = imul(al0, bl0)|0;
              v = imul(ah0, bl0)|0;
              w = ((imul(al0, bh0)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
              m = ((imul(ah0, bh0)|0) + (v >>> 16)|0) + (w >>> 16)|0;
              r0 = (w << 16) | (u & 0xffff);

              u = (imul(al0, bl1)|0) + (m & 0xffff)|0;
              v = (imul(ah0, bl1)|0) + (m >>> 16)|0;
              w = ((imul(al0, bh1)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
              m = ((imul(ah0, bh1)|0) + (v >>> 16)|0) + (w >>> 16)|0;
              r1 = (w << 16) | (u & 0xffff);

              r2 = m;

              u = (imul(al1, bl0)|0) + (r1 & 0xffff)|0;
              v = (imul(ah1, bl0)|0) + (r1 >>> 16)|0;
              w = ((imul(al1, bh0)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
              m = ((imul(ah1, bh0)|0) + (v >>> 16)|0) + (w >>> 16)|0;
              r1 = (w << 16) | (u & 0xffff);

              u = ((imul(al1, bl1)|0) + (r2 & 0xffff)|0) + (m & 0xffff)|0;
              v = ((imul(ah1, bl1)|0) + (r2 >>> 16)|0) + (m >>> 16)|0;
              w = ((imul(al1, bh1)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
              m = ((imul(ah1, bh1)|0) + (v >>> 16)|0) + (w >>> 16)|0;
              r2 = (w << 16) | (u & 0xffff);

              r3 = m;

              r = HEAP32[(Rk|8)>>2]|0;
              u = (r & 0xffff) + ((r0 & 0xffff) << 1)|0;
              w = ((r >>> 16) + ((r0 >>> 16) << 1)|0) + (u >>> 16)|0;
              HEAP32[(Rk|8)>>2] = (w << 16) | (u & 0xffff);
              c = w >>> 16;

              r = HEAP32[(Rk|12)>>2]|0;
              u = ((r & 0xffff) + ((r1 & 0xffff) << 1)|0)  + c|0;
              w = ((r >>> 16) + ((r1 >>> 16) << 1)|0) + (u >>> 16)|0;
              HEAP32[(Rk|12)>>2] = (w << 16) | (u & 0xffff);
              c = w >>> 16;

              r = HEAP32[(Rk|16)>>2]|0;
              u = ((r & 0xffff) + ((r2 & 0xffff) << 1)|0) + c|0;
              w = ((r >>> 16) + ((r2 >>> 16) << 1)|0) + (u >>> 16)|0;
              HEAP32[(Rk|16)>>2] = (w << 16) | (u & 0xffff);
              c = w >>> 16;

              r = HEAP32[(Rk|20)>>2]|0;
              u = ((r & 0xffff) + ((r3 & 0xffff) << 1)|0) + c|0;
              w = ((r >>> 16) + ((r3 >>> 16) << 1)|0) + (u >>> 16)|0;
              HEAP32[(Rk|20)>>2] = (w << 16) | (u & 0xffff);
              c = w >>> 16;

              for ( k = 24; !!c & ( (k|0) < 32 ); k = (k+4)|0 ) {
                  r = HEAP32[(Rk|k)>>2]|0;
                  u = (r & 0xffff) + c|0;
                  w = (r >>> 16) + (u >>> 16)|0;
                  HEAP32[(Rk|k)>>2] = (w << 16) | (u & 0xffff);
                  c = w >>> 16;
              }
          }

          // unrolled 3rd iteration
          for ( p = 0; (p|0) < (lA|0); p = (p+32)|0 ) {
              Ai = A+p|0, Rk = R+(p<<1)|0;

              ah0 = HEAP32[(Ai)>>2]|0, al0 = ah0 & 0xffff, ah0 = ah0 >>> 16,
              ah1 = HEAP32[(Ai|4)>>2]|0, al1 = ah1 & 0xffff, ah1 = ah1 >>> 16,
              ah2 = HEAP32[(Ai|8)>>2]|0, al2 = ah2 & 0xffff, ah2 = ah2 >>> 16,
              ah3 = HEAP32[(Ai|12)>>2]|0, al3 = ah3 & 0xffff, ah3 = ah3 >>> 16;

              bh0 = HEAP32[(Ai|16)>>2]|0, bl0 = bh0 & 0xffff, bh0 = bh0 >>> 16,
              bh1 = HEAP32[(Ai|20)>>2]|0, bl1 = bh1 & 0xffff, bh1 = bh1 >>> 16,
              bh2 = HEAP32[(Ai|24)>>2]|0, bl2 = bh2 & 0xffff, bh2 = bh2 >>> 16,
              bh3 = HEAP32[(Ai|28)>>2]|0, bl3 = bh3 & 0xffff, bh3 = bh3 >>> 16;

              u = imul(al0, bl0)|0;
              v = imul(ah0, bl0)|0;
              w = ((imul(al0, bh0)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
              m = ((imul(ah0, bh0)|0) + (v >>> 16)|0) + (w >>> 16)|0;
              r0 = (w << 16) | (u & 0xffff);

              u = (imul(al0, bl1)|0) + (m & 0xffff)|0;
              v = (imul(ah0, bl1)|0) + (m >>> 16)|0;
              w = ((imul(al0, bh1)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
              m = ((imul(ah0, bh1)|0) + (v >>> 16)|0) + (w >>> 16)|0;
              r1 = (w << 16) | (u & 0xffff);

              u = (imul(al0, bl2)|0) + (m & 0xffff)|0;
              v = (imul(ah0, bl2)|0) + (m >>> 16)|0;
              w = ((imul(al0, bh2)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
              m = ((imul(ah0, bh2)|0) + (v >>> 16)|0) + (w >>> 16)|0;
              r2 = (w << 16) | (u & 0xffff);

              u = (imul(al0, bl3)|0) + (m & 0xffff)|0;
              v = (imul(ah0, bl3)|0) + (m >>> 16)|0;
              w = ((imul(al0, bh3)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
              m = ((imul(ah0, bh3)|0) + (v >>> 16)|0) + (w >>> 16)|0;
              r3 = (w << 16) | (u & 0xffff);

              r4 = m;

              u = (imul(al1, bl0)|0) + (r1 & 0xffff)|0;
              v = (imul(ah1, bl0)|0) + (r1 >>> 16)|0;
              w = ((imul(al1, bh0)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
              m = ((imul(ah1, bh0)|0) + (v >>> 16)|0) + (w >>> 16)|0;
              r1 = (w << 16) | (u & 0xffff);

              u = ((imul(al1, bl1)|0) + (r2 & 0xffff)|0) + (m & 0xffff)|0;
              v = ((imul(ah1, bl1)|0) + (r2 >>> 16)|0) + (m >>> 16)|0;
              w = ((imul(al1, bh1)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
              m = ((imul(ah1, bh1)|0) + (v >>> 16)|0) + (w >>> 16)|0;
              r2 = (w << 16) | (u & 0xffff);

              u = ((imul(al1, bl2)|0) + (r3 & 0xffff)|0) + (m & 0xffff)|0;
              v = ((imul(ah1, bl2)|0) + (r3 >>> 16)|0) + (m >>> 16)|0;
              w = ((imul(al1, bh2)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
              m = ((imul(ah1, bh2)|0) + (v >>> 16)|0) + (w >>> 16)|0;
              r3 = (w << 16) | (u & 0xffff);

              u = ((imul(al1, bl3)|0) + (r4 & 0xffff)|0) + (m & 0xffff)|0;
              v = ((imul(ah1, bl3)|0) + (r4 >>> 16)|0) + (m >>> 16)|0;
              w = ((imul(al1, bh3)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
              m = ((imul(ah1, bh3)|0) + (v >>> 16)|0) + (w >>> 16)|0;
              r4 = (w << 16) | (u & 0xffff);

              r5 = m;

              u = (imul(al2, bl0)|0) + (r2 & 0xffff)|0;
              v = (imul(ah2, bl0)|0) + (r2 >>> 16)|0;
              w = ((imul(al2, bh0)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
              m = ((imul(ah2, bh0)|0) + (v >>> 16)|0) + (w >>> 16)|0;
              r2 = (w << 16) | (u & 0xffff);

              u = ((imul(al2, bl1)|0) + (r3 & 0xffff)|0) + (m & 0xffff)|0;
              v = ((imul(ah2, bl1)|0) + (r3 >>> 16)|0) + (m >>> 16)|0;
              w = ((imul(al2, bh1)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
              m = ((imul(ah2, bh1)|0) + (v >>> 16)|0) + (w >>> 16)|0;
              r3 = (w << 16) | (u & 0xffff);

              u = ((imul(al2, bl2)|0) + (r4 & 0xffff)|0) + (m & 0xffff)|0;
              v = ((imul(ah2, bl2)|0) + (r4 >>> 16)|0) + (m >>> 16)|0;
              w = ((imul(al2, bh2)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
              m = ((imul(ah2, bh2)|0) + (v >>> 16)|0) + (w >>> 16)|0;
              r4 = (w << 16) | (u & 0xffff);

              u = ((imul(al2, bl3)|0) + (r5 & 0xffff)|0) + (m & 0xffff)|0;
              v = ((imul(ah2, bl3)|0) + (r5 >>> 16)|0) + (m >>> 16)|0;
              w = ((imul(al2, bh3)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
              m = ((imul(ah2, bh3)|0) + (v >>> 16)|0) + (w >>> 16)|0;
              r5 = (w << 16) | (u & 0xffff);

              r6 = m;

              u = (imul(al3, bl0)|0) + (r3 & 0xffff)|0;
              v = (imul(ah3, bl0)|0) + (r3 >>> 16)|0;
              w = ((imul(al3, bh0)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
              m = ((imul(ah3, bh0)|0) + (v >>> 16)|0) + (w >>> 16)|0;
              r3 = (w << 16) | (u & 0xffff);

              u = ((imul(al3, bl1)|0) + (r4 & 0xffff)|0) + (m & 0xffff)|0;
              v = ((imul(ah3, bl1)|0) + (r4 >>> 16)|0) + (m >>> 16)|0;
              w = ((imul(al3, bh1)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
              m = ((imul(ah3, bh1)|0) + (v >>> 16)|0) + (w >>> 16)|0;
              r4 = (w << 16) | (u & 0xffff);

              u = ((imul(al3, bl2)|0) + (r5 & 0xffff)|0) + (m & 0xffff)|0;
              v = ((imul(ah3, bl2)|0) + (r5 >>> 16)|0) + (m >>> 16)|0;
              w = ((imul(al3, bh2)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
              m = ((imul(ah3, bh2)|0) + (v >>> 16)|0) + (w >>> 16)|0;
              r5 = (w << 16) | (u & 0xffff);

              u = ((imul(al3, bl3)|0) + (r6 & 0xffff)|0) + (m & 0xffff)|0;
              v = ((imul(ah3, bl3)|0) + (r6 >>> 16)|0) + (m >>> 16)|0;
              w = ((imul(al3, bh3)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
              m = ((imul(ah3, bh3)|0) + (v >>> 16)|0) + (w >>> 16)|0;
              r6 = (w << 16) | (u & 0xffff);

              r7 = m;

              r = HEAP32[(Rk|16)>>2]|0;
              u = (r & 0xffff) + ((r0 & 0xffff) << 1)|0;
              w = ((r >>> 16) + ((r0 >>> 16) << 1)|0) + (u >>> 16)|0;
              HEAP32[(Rk|16)>>2] = (w << 16) | (u & 0xffff);
              c = w >>> 16;

              r = HEAP32[(Rk|20)>>2]|0;
              u = ((r & 0xffff) + ((r1 & 0xffff) << 1)|0)  + c|0;
              w = ((r >>> 16) + ((r1 >>> 16) << 1)|0) + (u >>> 16)|0;
              HEAP32[(Rk|20)>>2] = (w << 16) | (u & 0xffff);
              c = w >>> 16;

              r = HEAP32[(Rk|24)>>2]|0;
              u = ((r & 0xffff) + ((r2 & 0xffff) << 1)|0) + c|0;
              w = ((r >>> 16) + ((r2 >>> 16) << 1)|0) + (u >>> 16)|0;
              HEAP32[(Rk|24)>>2] = (w << 16) | (u & 0xffff);
              c = w >>> 16;

              r = HEAP32[(Rk|28)>>2]|0;
              u = ((r & 0xffff) + ((r3 & 0xffff) << 1)|0) + c|0;
              w = ((r >>> 16) + ((r3 >>> 16) << 1)|0) + (u >>> 16)|0;
              HEAP32[(Rk|28)>>2] = (w << 16) | (u & 0xffff);
              c = w >>> 16;

              r = HEAP32[(Rk+32)>>2]|0;
              u = ((r & 0xffff) + ((r4 & 0xffff) << 1)|0) + c|0;
              w = ((r >>> 16) + ((r4 >>> 16) << 1)|0) + (u >>> 16)|0;
              HEAP32[(Rk+32)>>2] = (w << 16) | (u & 0xffff);
              c = w >>> 16;

              r = HEAP32[(Rk+36)>>2]|0;
              u = ((r & 0xffff) + ((r5 & 0xffff) << 1)|0) + c|0;
              w = ((r >>> 16) + ((r5 >>> 16) << 1)|0) + (u >>> 16)|0;
              HEAP32[(Rk+36)>>2] = (w << 16) | (u & 0xffff);
              c = w >>> 16;

              r = HEAP32[(Rk+40)>>2]|0;
              u = ((r & 0xffff) + ((r6 & 0xffff) << 1)|0) + c|0;
              w = ((r >>> 16) + ((r6 >>> 16) << 1)|0) + (u >>> 16)|0;
              HEAP32[(Rk+40)>>2] = (w << 16) | (u & 0xffff);
              c = w >>> 16;

              r = HEAP32[(Rk+44)>>2]|0;
              u = ((r & 0xffff) + ((r7 & 0xffff) << 1)|0) + c|0;
              w = ((r >>> 16) + ((r7 >>> 16) << 1)|0) + (u >>> 16)|0;
              HEAP32[(Rk+44)>>2] = (w << 16) | (u & 0xffff);
              c = w >>> 16;

              for ( k = 48; !!c & ( (k|0) < 64 ); k = (k+4)|0 ) {
                  r = HEAP32[(Rk+k)>>2]|0;
                  u = (r & 0xffff) + c|0;
                  w = (r >>> 16) + (u >>> 16)|0;
                  HEAP32[(Rk+k)>>2] = (w << 16) | (u & 0xffff);
                  c = w >>> 16;
              }
          }

          // perform iterations
          for ( d = 32; (d|0) < (lA|0); d = d << 1 ) { // depth loop
              dd = d << 1;

              for ( p = 0; (p|0) < (lA|0); p = (p+dd)|0 ) { // part loop
                  Rk = R+(p<<1)|0;

                  h = 0;
                  for ( i = 0; (i|0) < (d|0); i = (i+32)|0 ) { // multiply-and-add loop
                      Ai = (A+p|0)+i|0;

                      ah0 = HEAP32[(Ai)>>2]|0, al0 = ah0 & 0xffff, ah0 = ah0 >>> 16,
                      ah1 = HEAP32[(Ai|4)>>2]|0, al1 = ah1 & 0xffff, ah1 = ah1 >>> 16,
                      ah2 = HEAP32[(Ai|8)>>2]|0, al2 = ah2 & 0xffff, ah2 = ah2 >>> 16,
                      ah3 = HEAP32[(Ai|12)>>2]|0, al3 = ah3 & 0xffff, ah3 = ah3 >>> 16,
                      ah4 = HEAP32[(Ai|16)>>2]|0, al4 = ah4 & 0xffff, ah4 = ah4 >>> 16,
                      ah5 = HEAP32[(Ai|20)>>2]|0, al5 = ah5 & 0xffff, ah5 = ah5 >>> 16,
                      ah6 = HEAP32[(Ai|24)>>2]|0, al6 = ah6 & 0xffff, ah6 = ah6 >>> 16,
                      ah7 = HEAP32[(Ai|28)>>2]|0, al7 = ah7 & 0xffff, ah7 = ah7 >>> 16;

                      r8 = r9 = r10 = r11 = r12 = r13 = r14 = r15 = c = 0;

                      for ( j = 0; (j|0) < (d|0); j = (j+32)|0 ) {
                          Aj = ((A+p|0)+d|0)+j|0;

                          bh0 = HEAP32[(Aj)>>2]|0, bl0 = bh0 & 0xffff, bh0 = bh0 >>> 16,
                          bh1 = HEAP32[(Aj|4)>>2]|0, bl1 = bh1 & 0xffff, bh1 = bh1 >>> 16,
                          bh2 = HEAP32[(Aj|8)>>2]|0, bl2 = bh2 & 0xffff, bh2 = bh2 >>> 16,
                          bh3 = HEAP32[(Aj|12)>>2]|0, bl3 = bh3 & 0xffff, bh3 = bh3 >>> 16,
                          bh4 = HEAP32[(Aj|16)>>2]|0, bl4 = bh4 & 0xffff, bh4 = bh4 >>> 16,
                          bh5 = HEAP32[(Aj|20)>>2]|0, bl5 = bh5 & 0xffff, bh5 = bh5 >>> 16,
                          bh6 = HEAP32[(Aj|24)>>2]|0, bl6 = bh6 & 0xffff, bh6 = bh6 >>> 16,
                          bh7 = HEAP32[(Aj|28)>>2]|0, bl7 = bh7 & 0xffff, bh7 = bh7 >>> 16;

                          r0 = r1 = r2 = r3 = r4 = r5 = r6 = r7 = 0;

                          u = ((imul(al0, bl0)|0) + (r0 & 0xffff)|0) + (r8 & 0xffff)|0;
                          v = ((imul(ah0, bl0)|0) + (r0 >>> 16)|0) + (r8 >>> 16)|0;
                          w = ((imul(al0, bh0)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah0, bh0)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r0 = (w << 16) | (u & 0xffff);

                          u = ((imul(al0, bl1)|0) + (r1 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah0, bl1)|0) + (r1 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al0, bh1)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah0, bh1)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r1 = (w << 16) | (u & 0xffff);

                          u = ((imul(al0, bl2)|0) + (r2 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah0, bl2)|0) + (r2 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al0, bh2)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah0, bh2)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r2 = (w << 16) | (u & 0xffff);

                          u = ((imul(al0, bl3)|0) + (r3 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah0, bl3)|0) + (r3 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al0, bh3)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah0, bh3)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r3 = (w << 16) | (u & 0xffff);

                          u = ((imul(al0, bl4)|0) + (r4 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah0, bl4)|0) + (r4 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al0, bh4)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah0, bh4)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r4 = (w << 16) | (u & 0xffff);

                          u = ((imul(al0, bl5)|0) + (r5 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah0, bl5)|0) + (r5 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al0, bh5)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah0, bh5)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r5 = (w << 16) | (u & 0xffff);

                          u = ((imul(al0, bl6)|0) + (r6 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah0, bl6)|0) + (r6 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al0, bh6)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah0, bh6)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r6 = (w << 16) | (u & 0xffff);

                          u = ((imul(al0, bl7)|0) + (r7 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah0, bl7)|0) + (r7 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al0, bh7)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah0, bh7)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r7 = (w << 16) | (u & 0xffff);

                          r8 = m;

                          u = ((imul(al1, bl0)|0) + (r1 & 0xffff)|0) + (r9 & 0xffff)|0;
                          v = ((imul(ah1, bl0)|0) + (r1 >>> 16)|0) + (r9 >>> 16)|0;
                          w = ((imul(al1, bh0)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah1, bh0)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r1 = (w << 16) | (u & 0xffff);

                          u = ((imul(al1, bl1)|0) + (r2 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah1, bl1)|0) + (r2 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al1, bh1)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah1, bh1)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r2 = (w << 16) | (u & 0xffff);

                          u = ((imul(al1, bl2)|0) + (r3 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah1, bl2)|0) + (r3 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al1, bh2)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah1, bh2)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r3 = (w << 16) | (u & 0xffff);

                          u = ((imul(al1, bl3)|0) + (r4 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah1, bl3)|0) + (r4 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al1, bh3)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah1, bh3)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r4 = (w << 16) | (u & 0xffff);

                          u = ((imul(al1, bl4)|0) + (r5 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah1, bl4)|0) + (r5 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al1, bh4)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah1, bh4)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r5 = (w << 16) | (u & 0xffff);

                          u = ((imul(al1, bl5)|0) + (r6 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah1, bl5)|0) + (r6 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al1, bh5)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah1, bh5)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r6 = (w << 16) | (u & 0xffff);

                          u = ((imul(al1, bl6)|0) + (r7 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah1, bl6)|0) + (r7 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al1, bh6)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah1, bh6)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r7 = (w << 16) | (u & 0xffff);

                          u = ((imul(al1, bl7)|0) + (r8 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah1, bl7)|0) + (r8 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al1, bh7)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah1, bh7)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r8 = (w << 16) | (u & 0xffff);

                          r9 = m;

                          u = ((imul(al2, bl0)|0) + (r2 & 0xffff)|0) + (r10 & 0xffff)|0;
                          v = ((imul(ah2, bl0)|0) + (r2 >>> 16)|0) + (r10 >>> 16)|0;
                          w = ((imul(al2, bh0)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah2, bh0)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r2 = (w << 16) | (u & 0xffff);

                          u = ((imul(al2, bl1)|0) + (r3 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah2, bl1)|0) + (r3 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al2, bh1)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah2, bh1)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r3 = (w << 16) | (u & 0xffff);

                          u = ((imul(al2, bl2)|0) + (r4 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah2, bl2)|0) + (r4 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al2, bh2)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah2, bh2)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r4 = (w << 16) | (u & 0xffff);

                          u = ((imul(al2, bl3)|0) + (r5 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah2, bl3)|0) + (r5 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al2, bh3)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah2, bh3)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r5 = (w << 16) | (u & 0xffff);

                          u = ((imul(al2, bl4)|0) + (r6 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah2, bl4)|0) + (r6 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al2, bh4)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah2, bh4)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r6 = (w << 16) | (u & 0xffff);

                          u = ((imul(al2, bl5)|0) + (r7 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah2, bl5)|0) + (r7 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al2, bh5)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah2, bh5)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r7 = (w << 16) | (u & 0xffff);

                          u = ((imul(al2, bl6)|0) + (r8 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah2, bl6)|0) + (r8 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al2, bh6)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah2, bh6)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r8 = (w << 16) | (u & 0xffff);

                          u = ((imul(al2, bl7)|0) + (r9 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah2, bl7)|0) + (r9 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al2, bh7)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah2, bh7)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r9 = (w << 16) | (u & 0xffff);

                          r10 = m;

                          u = ((imul(al3, bl0)|0) + (r3 & 0xffff)|0) + (r11 & 0xffff)|0;
                          v = ((imul(ah3, bl0)|0) + (r3 >>> 16)|0) + (r11 >>> 16)|0;
                          w = ((imul(al3, bh0)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah3, bh0)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r3 = (w << 16) | (u & 0xffff);

                          u = ((imul(al3, bl1)|0) + (r4 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah3, bl1)|0) + (r4 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al3, bh1)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah3, bh1)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r4 = (w << 16) | (u & 0xffff);

                          u = ((imul(al3, bl2)|0) + (r5 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah3, bl2)|0) + (r5 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al3, bh2)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah3, bh2)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r5 = (w << 16) | (u & 0xffff);

                          u = ((imul(al3, bl3)|0) + (r6 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah3, bl3)|0) + (r6 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al3, bh3)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah3, bh3)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r6 = (w << 16) | (u & 0xffff);

                          u = ((imul(al3, bl4)|0) + (r7 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah3, bl4)|0) + (r7 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al3, bh4)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah3, bh4)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r7 = (w << 16) | (u & 0xffff);

                          u = ((imul(al3, bl5)|0) + (r8 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah3, bl5)|0) + (r8 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al3, bh5)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah3, bh5)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r8 = (w << 16) | (u & 0xffff);

                          u = ((imul(al3, bl6)|0) + (r9 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah3, bl6)|0) + (r9 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al3, bh6)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah3, bh6)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r9 = (w << 16) | (u & 0xffff);

                          u = ((imul(al3, bl7)|0) + (r10 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah3, bl7)|0) + (r10 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al3, bh7)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah3, bh7)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r10 = (w << 16) | (u & 0xffff);

                          r11 = m;

                          u = ((imul(al4, bl0)|0) + (r4 & 0xffff)|0) + (r12 & 0xffff)|0;
                          v = ((imul(ah4, bl0)|0) + (r4 >>> 16)|0) + (r12 >>> 16)|0;
                          w = ((imul(al4, bh0)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah4, bh0)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r4 = (w << 16) | (u & 0xffff);

                          u = ((imul(al4, bl1)|0) + (r5 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah4, bl1)|0) + (r5 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al4, bh1)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah4, bh1)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r5 = (w << 16) | (u & 0xffff);

                          u = ((imul(al4, bl2)|0) + (r6 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah4, bl2)|0) + (r6 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al4, bh2)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah4, bh2)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r6 = (w << 16) | (u & 0xffff);

                          u = ((imul(al4, bl3)|0) + (r7 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah4, bl3)|0) + (r7 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al4, bh3)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah4, bh3)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r7 = (w << 16) | (u & 0xffff);

                          u = ((imul(al4, bl4)|0) + (r8 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah4, bl4)|0) + (r8 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al4, bh4)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah4, bh4)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r8 = (w << 16) | (u & 0xffff);

                          u = ((imul(al4, bl5)|0) + (r9 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah4, bl5)|0) + (r9 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al4, bh5)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah4, bh5)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r9 = (w << 16) | (u & 0xffff);

                          u = ((imul(al4, bl6)|0) + (r10 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah4, bl6)|0) + (r10 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al4, bh6)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah4, bh6)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r10 = (w << 16) | (u & 0xffff);

                          u = ((imul(al4, bl7)|0) + (r11 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah4, bl7)|0) + (r11 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al4, bh7)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah4, bh7)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r11 = (w << 16) | (u & 0xffff);

                          r12 = m;

                          u = ((imul(al5, bl0)|0) + (r5 & 0xffff)|0) + (r13 & 0xffff)|0;
                          v = ((imul(ah5, bl0)|0) + (r5 >>> 16)|0) + (r13 >>> 16)|0;
                          w = ((imul(al5, bh0)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah5, bh0)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r5 = (w << 16) | (u & 0xffff);

                          u = ((imul(al5, bl1)|0) + (r6 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah5, bl1)|0) + (r6 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al5, bh1)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah5, bh1)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r6 = (w << 16) | (u & 0xffff);

                          u = ((imul(al5, bl2)|0) + (r7 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah5, bl2)|0) + (r7 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al5, bh2)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah5, bh2)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r7 = (w << 16) | (u & 0xffff);

                          u = ((imul(al5, bl3)|0) + (r8 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah5, bl3)|0) + (r8 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al5, bh3)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah5, bh3)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r8 = (w << 16) | (u & 0xffff);

                          u = ((imul(al5, bl4)|0) + (r9 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah5, bl4)|0) + (r9 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al5, bh4)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah5, bh4)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r9 = (w << 16) | (u & 0xffff);

                          u = ((imul(al5, bl5)|0) + (r10 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah5, bl5)|0) + (r10 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al5, bh5)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah5, bh5)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r10 = (w << 16) | (u & 0xffff);

                          u = ((imul(al5, bl6)|0) + (r11 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah5, bl6)|0) + (r11 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al5, bh6)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah5, bh6)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r11 = (w << 16) | (u & 0xffff);

                          u = ((imul(al5, bl7)|0) + (r12 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah5, bl7)|0) + (r12 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al5, bh7)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah5, bh7)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r12 = (w << 16) | (u & 0xffff);

                          r13 = m;

                          u = ((imul(al6, bl0)|0) + (r6 & 0xffff)|0) + (r14 & 0xffff)|0;
                          v = ((imul(ah6, bl0)|0) + (r6 >>> 16)|0) + (r14 >>> 16)|0;
                          w = ((imul(al6, bh0)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah6, bh0)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r6 = (w << 16) | (u & 0xffff);

                          u = ((imul(al6, bl1)|0) + (r7 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah6, bl1)|0) + (r7 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al6, bh1)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah6, bh1)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r7 = (w << 16) | (u & 0xffff);

                          u = ((imul(al6, bl2)|0) + (r8 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah6, bl2)|0) + (r8 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al6, bh2)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah6, bh2)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r8 = (w << 16) | (u & 0xffff);

                          u = ((imul(al6, bl3)|0) + (r9 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah6, bl3)|0) + (r9 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al6, bh3)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah6, bh3)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r9 = (w << 16) | (u & 0xffff);

                          u = ((imul(al6, bl4)|0) + (r10 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah6, bl4)|0) + (r10 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al6, bh4)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah6, bh4)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r10 = (w << 16) | (u & 0xffff);

                          u = ((imul(al6, bl5)|0) + (r11 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah6, bl5)|0) + (r11 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al6, bh5)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah6, bh5)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r11 = (w << 16) | (u & 0xffff);

                          u = ((imul(al6, bl6)|0) + (r12 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah6, bl6)|0) + (r12 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al6, bh6)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah6, bh6)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r12 = (w << 16) | (u & 0xffff);

                          u = ((imul(al6, bl7)|0) + (r13 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah6, bl7)|0) + (r13 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al6, bh7)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah6, bh7)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r13 = (w << 16) | (u & 0xffff);

                          r14 = m;

                          u = ((imul(al7, bl0)|0) + (r7 & 0xffff)|0) + (r15 & 0xffff)|0;
                          v = ((imul(ah7, bl0)|0) + (r7 >>> 16)|0) + (r15 >>> 16)|0;
                          w = ((imul(al7, bh0)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah7, bh0)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r7 = (w << 16) | (u & 0xffff);

                          u = ((imul(al7, bl1)|0) + (r8 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah7, bl1)|0) + (r8 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al7, bh1)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah7, bh1)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r8 = (w << 16) | (u & 0xffff);

                          u = ((imul(al7, bl2)|0) + (r9 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah7, bl2)|0) + (r9 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al7, bh2)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah7, bh2)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r9 = (w << 16) | (u & 0xffff);

                          u = ((imul(al7, bl3)|0) + (r10 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah7, bl3)|0) + (r10 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al7, bh3)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah7, bh3)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r10 = (w << 16) | (u & 0xffff);

                          u = ((imul(al7, bl4)|0) + (r11 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah7, bl4)|0) + (r11 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al7, bh4)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah7, bh4)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r11 = (w << 16) | (u & 0xffff);

                          u = ((imul(al7, bl5)|0) + (r12 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah7, bl5)|0) + (r12 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al7, bh5)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah7, bh5)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r12 = (w << 16) | (u & 0xffff);

                          u = ((imul(al7, bl6)|0) + (r13 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah7, bl6)|0) + (r13 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al7, bh6)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah7, bh6)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r13 = (w << 16) | (u & 0xffff);

                          u = ((imul(al7, bl7)|0) + (r14 & 0xffff)|0) + (m & 0xffff)|0;
                          v = ((imul(ah7, bl7)|0) + (r14 >>> 16)|0) + (m >>> 16)|0;
                          w = ((imul(al7, bh7)|0) + (v & 0xffff)|0) + (u >>> 16)|0;
                          m = ((imul(ah7, bh7)|0) + (v >>> 16)|0) + (w >>> 16)|0;
                          r14 = (w << 16) | (u & 0xffff);

                          r15 = m;

                          k = d+(i+j|0)|0;
                          r = HEAP32[(Rk+k)>>2]|0;
                          u = ((r & 0xffff) + ((r0 & 0xffff) << 1)|0) + c|0;
                          w = ((r >>> 16) + ((r0 >>> 16) << 1)|0) + (u >>> 16)|0;
                          HEAP32[(Rk+k)>>2] = (w << 16) | (u & 0xffff);
                          c = w >>> 16;

                          k = k+4|0;
                          r = HEAP32[(Rk+k)>>2]|0;
                          u = ((r & 0xffff) + ((r1 & 0xffff) << 1)|0) + c|0;
                          w = ((r >>> 16) + ((r1 >>> 16) << 1)|0) + (u >>> 16)|0;
                          HEAP32[(Rk+k)>>2] = (w << 16) | (u & 0xffff);
                          c = w >>> 16;

                          k = k+4|0;
                          r = HEAP32[(Rk+k)>>2]|0;
                          u = ((r & 0xffff) + ((r2 & 0xffff) << 1)|0) + c|0;
                          w = ((r >>> 16) + ((r2 >>> 16) << 1)|0) + (u >>> 16)|0;
                          HEAP32[(Rk+k)>>2] = (w << 16) | (u & 0xffff);
                          c = w >>> 16;

                          k = k+4|0;
                          r = HEAP32[(Rk+k)>>2]|0;
                          u = ((r & 0xffff) + ((r3 & 0xffff) << 1)|0) + c|0;
                          w = ((r >>> 16) + ((r3 >>> 16) << 1)|0) + (u >>> 16)|0;
                          HEAP32[(Rk+k)>>2] = (w << 16) | (u & 0xffff);
                          c = w >>> 16;

                          k = k+4|0;
                          r = HEAP32[(Rk+k)>>2]|0;
                          u = ((r & 0xffff) + ((r4 & 0xffff) << 1)|0) + c|0;
                          w = ((r >>> 16) + ((r4 >>> 16) << 1)|0) + (u >>> 16)|0;
                          HEAP32[(Rk+k)>>2] = (w << 16) | (u & 0xffff);
                          c = w >>> 16;

                          k = k+4|0;
                          r = HEAP32[(Rk+k)>>2]|0;
                          u = ((r & 0xffff) + ((r5 & 0xffff) << 1)|0) + c|0;
                          w = ((r >>> 16) + ((r5 >>> 16) << 1)|0) + (u >>> 16)|0;
                          HEAP32[(Rk+k)>>2] = (w << 16) | (u & 0xffff);
                          c = w >>> 16;

                          k = k+4|0;
                          r = HEAP32[(Rk+k)>>2]|0;
                          u = ((r & 0xffff) + ((r6 & 0xffff) << 1)|0) + c|0;
                          w = ((r >>> 16) + ((r6 >>> 16) << 1)|0) + (u >>> 16)|0;
                          HEAP32[(Rk+k)>>2] = (w << 16) | (u & 0xffff);
                          c = w >>> 16;

                          k = k+4|0;
                          r = HEAP32[(Rk+k)>>2]|0;
                          u = ((r & 0xffff) + ((r7 & 0xffff) << 1)|0) + c|0;
                          w = ((r >>> 16) + ((r7 >>> 16) << 1)|0) + (u >>> 16)|0;
                          HEAP32[(Rk+k)>>2] = (w << 16) | (u & 0xffff);
                          c = w >>> 16;
                      }

                      k = d+(i+j|0)|0;
                      r = HEAP32[(Rk+k)>>2]|0;
                      u = (((r & 0xffff) + ((r8 & 0xffff) << 1)|0) + c|0) + h|0;
                      w = ((r >>> 16) + ((r8 >>> 16) << 1)|0) + (u >>> 16)|0;
                      HEAP32[(Rk+k)>>2] = (w << 16) | (u & 0xffff);
                      c = w >>> 16;

                      k = k+4|0;
                      r = HEAP32[(Rk+k)>>2]|0;
                      u = ((r & 0xffff) + ((r9 & 0xffff) << 1)|0) + c|0;
                      w = ((r >>> 16) + ((r9 >>> 16) << 1)|0) + (u >>> 16)|0;
                      HEAP32[(Rk+k)>>2] = (w << 16) | (u & 0xffff);
                      c = w >>> 16;

                      k = k+4|0;
                      r = HEAP32[(Rk+k)>>2]|0;
                      u = ((r & 0xffff) + ((r10 & 0xffff) << 1)|0) + c|0;
                      w = ((r >>> 16) + ((r10 >>> 16) << 1)|0) + (u >>> 16)|0;
                      HEAP32[(Rk+k)>>2] = (w << 16) | (u & 0xffff);
                      c = w >>> 16;

                      k = k+4|0;
                      r = HEAP32[(Rk+k)>>2]|0;
                      u = ((r & 0xffff) + ((r11 & 0xffff) << 1)|0) + c|0;
                      w = ((r >>> 16) + ((r11 >>> 16) << 1)|0) + (u >>> 16)|0;
                      HEAP32[(Rk+k)>>2] = (w << 16) | (u & 0xffff);
                      c = w >>> 16;

                      k = k+4|0;
                      r = HEAP32[(Rk+k)>>2]|0;
                      u = ((r & 0xffff) + ((r12 & 0xffff) << 1)|0) + c|0;
                      w = ((r >>> 16) + ((r12 >>> 16) << 1)|0) + (u >>> 16)|0;
                      HEAP32[(Rk+k)>>2] = (w << 16) | (u & 0xffff);
                      c = w >>> 16;

                      k = k+4|0;
                      r = HEAP32[(Rk+k)>>2]|0;
                      u = ((r & 0xffff) + ((r13 & 0xffff) << 1)|0) + c|0;
                      w = ((r >>> 16) + ((r13 >>> 16) << 1)|0) + (u >>> 16)|0;
                      HEAP32[(Rk+k)>>2] = (w << 16) | (u & 0xffff);
                      c = w >>> 16;

                      k = k+4|0;
                      r = HEAP32[(Rk+k)>>2]|0;
                      u = ((r & 0xffff) + ((r14 & 0xffff) << 1)|0) + c|0;
                      w = ((r >>> 16) + ((r14 >>> 16) << 1)|0) + (u >>> 16)|0;
                      HEAP32[(Rk+k)>>2] = (w << 16) | (u & 0xffff);
                      c = w >>> 16;

                      k = k+4|0;
                      r = HEAP32[(Rk+k)>>2]|0;
                      u = ((r & 0xffff) + ((r15 & 0xffff) << 1)|0) + c|0;
                      w = ((r >>> 16) + ((r15 >>> 16) << 1)|0) + (u >>> 16)|0;
                      HEAP32[(Rk+k)>>2] = (w << 16) | (u & 0xffff);
                      h = w >>> 16;
                  }

                  for ( k = k+4|0; !!h & ( (k|0) < (dd<<1) ); k = (k+4)|0 ) { // carry propagation loop
                      r = HEAP32[(Rk+k)>>2]|0;
                      u = (r & 0xffff) + h|0;
                      w = (r >>> 16) + (u >>> 16)|0;
                      HEAP32[(Rk+k)>>2] = (w << 16) | (u & 0xffff);
                      h = w >>> 16;
                  }
              }
          }
      }

      /**
       * Conventional division
       *
       * @param A offset of the numerator, 32-byte aligned
       * @param lA length of the numerator, multiple of 32
       *
       * @param B offset of the divisor, 32-byte aligned
       * @param lB length of the divisor, multiple of 32
       *
       * @param R offset where to place the remainder to, 32-byte aligned
       *
       * @param Q offser where to place the quotient to, 32-byte aligned
       */

      function div ( N, lN, D, lD, Q ) {
          N  =  N|0;
          lN = lN|0;
          D  =  D|0;
          lD = lD|0;
          Q  =  Q|0;

          var n = 0, d = 0, e = 0,
              u1 = 0, u0 = 0,
              v0 = 0, vh = 0, vl = 0,
              qh = 0, ql = 0, rh = 0, rl = 0,
              t1 = 0, t2 = 0, m = 0, c = 0,
              i = 0, j = 0, k = 0;

          // number of significant limbs in `N` (multiplied by 4)
          for ( i = (lN-1) & -4; (i|0) >= 0; i = (i-4)|0 ) {
              n = HEAP32[(N+i)>>2]|0;
              if ( n ) {
                  lN = i;
                  break;
              }
          }

          // number of significant limbs in `D` (multiplied by 4)
          for ( i = (lD-1) & -4; (i|0) >= 0; i = (i-4)|0 ) {
              d = HEAP32[(D+i)>>2]|0;
              if ( d ) {
                  lD = i;
                  break;
              }
          }

          // `D` is zero? WTF?!

          // calculate `e` — the power of 2 of the normalization factor
          while ( (d & 0x80000000) == 0 ) {
              d = d << 1;
              e = e + 1|0;
          }

          // normalize `N` in place
          u0 = HEAP32[(N+lN)>>2]|0;
          if ( e ) {
              u1 = u0>>>(32-e|0);
              for ( i = (lN-4)|0; (i|0) >= 0; i = (i-4)|0 ) {
                  n = HEAP32[(N+i)>>2]|0;
                  HEAP32[(N+i+4)>>2] = (u0 << e) | ( e ? n >>> (32-e|0) : 0 );
                  u0 = n;
              }
              HEAP32[N>>2] = u0 << e;
          }

          // normalize `D` in place
          if ( e ) {
              v0 = HEAP32[(D+lD)>>2]|0;
              for ( i = (lD-4)|0; (i|0) >= 0; i = (i-4)|0 ) {
                  d = HEAP32[(D+i)>>2]|0;
                  HEAP32[(D+i+4)>>2] = (v0 << e) | ( d >>> (32-e|0) );
                  v0 = d;
              }
              HEAP32[D>>2] = v0 << e;
          }

          // divisor parts won't change
          v0 = HEAP32[(D+lD)>>2]|0;
          vh = v0 >>> 16, vl = v0 & 0xffff;

          // perform division
          for ( i = lN; (i|0) >= (lD|0); i = (i-4)|0 ) {
              j = (i-lD)|0;

              // estimate high part of the quotient
              u0 = HEAP32[(N+i)>>2]|0;
              qh = ( (u1>>>0) / (vh>>>0) )|0, rh = ( (u1>>>0) % (vh>>>0) )|0, t1 = imul(qh, vl)|0;
              while ( ( (qh|0) == 0x10000 ) | ( (t1>>>0) > (((rh << 16)|(u0 >>> 16))>>>0) ) ) {
                  qh = (qh-1)|0, rh = (rh+vh)|0, t1 = (t1-vl)|0;
                  if ( (rh|0) >= 0x10000 ) break;
              }

              // bulk multiply-and-subtract
              // m - multiplication carry, c - subtraction carry
              m = 0, c = 0;
              for ( k = 0; (k|0) <= (lD|0); k = (k+4)|0 ) {
                  d = HEAP32[(D+k)>>2]|0;
                  t1 = (imul(qh, d & 0xffff)|0) + (m >>> 16)|0;
                  t2 = (imul(qh, d >>> 16)|0) + (t1 >>> 16)|0;
                  d = (m & 0xffff) | (t1 << 16);
                  m = t2;
                  n = HEAP32[(N+j+k)>>2]|0;
                  t1 = ((n & 0xffff) - (d & 0xffff)|0) + c|0;
                  t2 = ((n >>> 16) - (d >>> 16)|0) + (t1 >> 16)|0;
                  HEAP32[(N+j+k)>>2] = (t2 << 16) | (t1 & 0xffff);
                  c = t2 >> 16;
              }
              t1 = ((u1 & 0xffff) - (m & 0xffff)|0) + c|0;
              t2 = ((u1 >>> 16) - (m >>> 16)|0) + (t1 >> 16)|0;
              u1 = (t2 << 16) | (t1 & 0xffff);
              c = t2 >> 16;

              // add `D` back if got carry-out
              if ( c ) {
                  qh = (qh-1)|0;
                  c = 0;
                  for ( k = 0; (k|0) <= (lD|0); k = (k+4)|0 ) {
                      d = HEAP32[(D+k)>>2]|0;
                      n = HEAP32[(N+j+k)>>2]|0;
                      t1 = (n & 0xffff) + c|0;
                      t2 = (n >>> 16) + d + (t1 >>> 16)|0;
                      HEAP32[(N+j+k)>>2] = (t2 << 16) | (t1 & 0xffff);
                      c = t2 >>> 16;
                  }
                  u1 = (u1+c)|0;
              }

              // estimate low part of the quotient
              u0 = HEAP32[(N+i)>>2]|0;
              n = (u1 << 16) | (u0 >>> 16);
              ql = ( (n>>>0) / (vh>>>0) )|0, rl = ( (n>>>0) % (vh>>>0) )|0, t1 = imul(ql, vl)|0;
              while ( ( (ql|0) == 0x10000 ) | ( (t1>>>0) > (((rl << 16)|(u0 & 0xffff))>>>0) ) ) {
                  ql = (ql-1)|0, rl = (rl+vh)|0, t1 = (t1-vl)|0;
                  if ( (rl|0) >= 0x10000 ) break;
              }

              // bulk multiply-and-subtract
              // m - multiplication carry, c - subtraction carry
              m = 0, c = 0;
              for ( k = 0; (k|0) <= (lD|0); k = (k+4)|0 ) {
                  d = HEAP32[(D+k)>>2]|0;
                  t1 = (imul(ql, d & 0xffff)|0) + (m & 0xffff)|0;
                  t2 = ((imul(ql, d >>> 16)|0) + (t1 >>> 16)|0) + (m >>> 16)|0;
                  d = (t1 & 0xffff) | (t2 << 16);
                  m = t2 >>> 16;
                  n = HEAP32[(N+j+k)>>2]|0;
                  t1 = ((n & 0xffff) - (d & 0xffff)|0) + c|0;
                  t2 = ((n >>> 16) - (d >>> 16)|0) + (t1 >> 16)|0;
                  c = t2 >> 16;
                  HEAP32[(N+j+k)>>2] = (t2 << 16) | (t1 & 0xffff);
              }
              t1 = ((u1 & 0xffff) - (m & 0xffff)|0) + c|0;
              t2 = ((u1 >>> 16) - (m >>> 16)|0) + (t1 >> 16)|0;
              c = t2 >> 16;

              // add `D` back if got carry-out
              if ( c ) {
                  ql = (ql-1)|0;
                  c = 0;
                  for ( k = 0; (k|0) <= (lD|0); k = (k+4)|0 ) {
                      d = HEAP32[(D+k)>>2]|0;
                      n = HEAP32[(N+j+k)>>2]|0;
                      t1 = ((n & 0xffff) + (d & 0xffff)|0) + c|0;
                      t2 = ((n >>> 16) + (d >>> 16)|0) + (t1 >>> 16)|0;
                      c = t2 >>> 16;
                      HEAP32[(N+j+k)>>2] = (t1 & 0xffff) | (t2 << 16);
                  }
              }

              // got quotient limb
              HEAP32[(Q+j)>>2] = (qh << 16) | ql;

              u1 = HEAP32[(N+i)>>2]|0;
          }

          if ( e ) {
              // TODO denormalize `D` in place

              // denormalize `N` in place
              u0 = HEAP32[N>>2]|0;
              for ( i = 4; (i|0) <= (lD|0); i = (i+4)|0 ) {
                  n = HEAP32[(N+i)>>2]|0;
                  HEAP32[(N+i-4)>>2] = ( n << (32-e|0) ) | (u0 >>> e);
                  u0 = n;
              }
              HEAP32[(N+lD)>>2] = u0 >>> e;
          }
      }

      /**
       * Montgomery modular reduction
       *
       * Definition:
       *
       *  MREDC(A) = A × X (mod N),
       *  M × X = N × Y + 1,
       *
       * where M = 2^(32*m) such that N < M and A < N×M
       *
       * Numbers `X` and `Y` can be calculated using Extended Euclidean Algorithm.
       */
      function mredc ( A, lA, N, lN, y, R ) {
          A  =  A|0;
          lA = lA|0;
          N  =  N|0;
          lN = lN|0;
          y  =  y|0;
          R  =  R|0;

          var T = 0,
              c = 0, uh = 0, ul = 0, vl = 0, vh = 0, w0 = 0, w1 = 0, w2 = 0, r0 = 0, r1 = 0,
              i = 0, j = 0, k = 0;

          T = salloc(lN<<1)|0;
          z(lN<<1, 0, T);

          cp( lA, A, T );

          // HAC 14.32
          for ( i = 0; (i|0) < (lN|0); i = (i+4)|0 ) {
              uh = HEAP32[(T+i)>>2]|0, ul = uh & 0xffff, uh = uh >>> 16;
              vh = y >>> 16, vl = y & 0xffff;
              w0 = imul(ul,vl)|0, w1 = ( (imul(ul,vh)|0) + (imul(uh,vl)|0) | 0 ) + (w0 >>> 16) | 0;
              ul = w0 & 0xffff, uh = w1 & 0xffff;
              r1 = 0;
              for ( j = 0; (j|0) < (lN|0); j = (j+4)|0 ) {
                  k = (i+j)|0;
                  vh = HEAP32[(N+j)>>2]|0, vl = vh & 0xffff, vh = vh >>> 16;
                  r0 = HEAP32[(T+k)>>2]|0;
                  w0 = ((imul(ul, vl)|0) + (r1 & 0xffff)|0) + (r0 & 0xffff)|0;
                  w1 = ((imul(ul, vh)|0) + (r1 >>> 16)|0) + (r0 >>> 16)|0;
                  w2 = ((imul(uh, vl)|0) + (w1 & 0xffff)|0) + (w0 >>> 16)|0;
                  r1 = ((imul(uh, vh)|0) + (w2 >>> 16)|0) + (w1 >>> 16)|0;
                  r0 = (w2 << 16) | (w0 & 0xffff);
                  HEAP32[(T+k)>>2] = r0;
              }
              k = (i+j)|0;
              r0 = HEAP32[(T+k)>>2]|0;
              w0 = ((r0 & 0xffff) + (r1 & 0xffff)|0) + c|0;
              w1 = ((r0 >>> 16) + (r1 >>> 16)|0) + (w0 >>> 16)|0;
              HEAP32[(T+k)>>2] = (w1 << 16) | (w0 & 0xffff);
              c = w1 >>> 16;
          }

          cp( lN, (T+lN)|0, R );

          sfree(lN<<1);

          if ( c | ( (cmp( N, lN, R, lN )|0) <= 0 ) ) {
              sub( R, lN, N, lN, R, lN )|0;
          }
      }

      return {
          sreset: sreset,
          salloc: salloc,
          sfree:  sfree,
          z: z,
          tst: tst,
          neg: neg,
          cmp: cmp,
          add: add,
          sub: sub,
          mul: mul,
          sqr: sqr,
          div: div,
          mredc: mredc
      };
  };

  function Number_extGCD(a, b) {
      var sa = a < 0 ? -1 : 1, sb = b < 0 ? -1 : 1, xi = 1, xj = 0, yi = 0, yj = 1, r, q, t, a_cmp_b;
      a *= sa;
      b *= sb;
      a_cmp_b = a < b;
      if (a_cmp_b) {
          t = a;
          (a = b), (b = t);
          t = sa;
          sa = sb;
          sb = t;
      }
      (q = Math.floor(a / b)), (r = a - q * b);
      while (r) {
          (t = xi - q * xj), (xi = xj), (xj = t);
          (t = yi - q * yj), (yi = yj), (yj = t);
          (a = b), (b = r);
          (q = Math.floor(a / b)), (r = a - q * b);
      }
      xj *= sa;
      yj *= sb;
      if (a_cmp_b) {
          t = xj;
          (xj = yj), (yj = t);
      }
      return {
          gcd: b,
          x: xj,
          y: yj,
      };
  }
  function BigNumber_extGCD(a, b) {
      let sa = a.sign;
      let sb = b.sign;
      if (sa < 0)
          a = a.negate();
      if (sb < 0)
          b = b.negate();
      const a_cmp_b = a.compare(b);
      if (a_cmp_b < 0) {
          let t = a;
          (a = b), (b = t);
          let t2 = sa;
          sa = sb;
          sb = t2;
      }
      var xi = BigNumber.ONE, xj = BigNumber.ZERO, lx = b.bitLength, yi = BigNumber.ZERO, yj = BigNumber.ONE, ly = a.bitLength, z, r, q;
      z = a.divide(b);
      while ((r = z.remainder) !== BigNumber.ZERO) {
          q = z.quotient;
          (z = xi.subtract(q.multiply(xj).clamp(lx)).clamp(lx)), (xi = xj), (xj = z);
          (z = yi.subtract(q.multiply(yj).clamp(ly)).clamp(ly)), (yi = yj), (yj = z);
          (a = b), (b = r);
          z = a.divide(b);
      }
      if (sa < 0)
          xj = xj.negate();
      if (sb < 0)
          yj = yj.negate();
      if (a_cmp_b < 0) {
          let t = xj;
          (xj = yj), (yj = t);
      }
      return {
          gcd: b,
          x: xj,
          y: yj,
      };
  }

  function getRandomValues(buf) {
      if (typeof process !== 'undefined') {
          const nodeCrypto = require('crypto');
          const bytes = nodeCrypto.randomBytes(buf.length);
          buf.set(bytes);
          return;
      }
      if (window.crypto && window.crypto.getRandomValues) {
          window.crypto.getRandomValues(buf);
          return;
      }
      if (self.crypto && self.crypto.getRandomValues) {
          self.crypto.getRandomValues(buf);
          return;
      }
      // @ts-ignore
      if (window.msCrypto && window.msCrypto.getRandomValues) {
          // @ts-ignore
          window.msCrypto.getRandomValues(buf);
          return;
      }
      throw new Error('No secure random number generator available.');
  }

  ///////////////////////////////////////////////////////////////////////////////
  const _bigint_stdlib = { Uint32Array: Uint32Array, Math: Math };
  const _bigint_heap = new Uint32Array(0x100000);
  let _bigint_asm;
  function _half_imul(a, b) {
      return (a * b) | 0;
  }
  if (_bigint_stdlib.Math.imul === undefined) {
      _bigint_stdlib.Math.imul = _half_imul;
      _bigint_asm = bigint_asm(_bigint_stdlib, null, _bigint_heap.buffer);
      delete _bigint_stdlib.Math.imul;
  }
  else {
      _bigint_asm = bigint_asm(_bigint_stdlib, null, _bigint_heap.buffer);
  }
  ///////////////////////////////////////////////////////////////////////////////
  const _BigNumber_ZERO_limbs = new Uint32Array(0);
  class BigNumber {
      constructor(num) {
          let limbs = _BigNumber_ZERO_limbs;
          let bitlen = 0;
          let sign = 0;
          if (num === undefined) ;
          else {
              for (var i = 0; !num[i]; i++)
                  ;
              bitlen = (num.length - i) * 8;
              if (!bitlen)
                  return BigNumber.ZERO;
              limbs = new Uint32Array((bitlen + 31) >> 5);
              for (var j = num.length - 4; j >= i; j -= 4) {
                  limbs[(num.length - 4 - j) >> 2] = (num[j] << 24) | (num[j + 1] << 16) | (num[j + 2] << 8) | num[j + 3];
              }
              if (i - j === 3) {
                  limbs[limbs.length - 1] = num[i];
              }
              else if (i - j === 2) {
                  limbs[limbs.length - 1] = (num[i] << 8) | num[i + 1];
              }
              else if (i - j === 1) {
                  limbs[limbs.length - 1] = (num[i] << 16) | (num[i + 1] << 8) | num[i + 2];
              }
              sign = 1;
          }
          this.limbs = limbs;
          this.bitLength = bitlen;
          this.sign = sign;
      }
      static fromString(str) {
          const bytes = string_to_bytes(str);
          return new BigNumber(bytes);
      }
      static fromNumber(num) {
          let limbs = _BigNumber_ZERO_limbs;
          let bitlen = 0;
          let sign = 0;
          var absnum = Math.abs(num);
          if (absnum > 0xffffffff) {
              limbs = new Uint32Array(2);
              limbs[0] = absnum | 0;
              limbs[1] = (absnum / 0x100000000) | 0;
              bitlen = 52;
          }
          else if (absnum > 0) {
              limbs = new Uint32Array(1);
              limbs[0] = absnum;
              bitlen = 32;
          }
          else {
              limbs = _BigNumber_ZERO_limbs;
              bitlen = 0;
          }
          sign = num < 0 ? -1 : 1;
          return BigNumber.fromConfig({ limbs, bitLength: bitlen, sign });
      }
      static fromArrayBuffer(buffer) {
          return new BigNumber(new Uint8Array(buffer));
      }
      static fromConfig(obj) {
          const bn = new BigNumber();
          bn.limbs = new Uint32Array(obj.limbs);
          bn.bitLength = obj.bitLength;
          bn.sign = obj.sign;
          return bn;
      }
      toString(radix) {
          radix = radix || 16;
          const limbs = this.limbs;
          const bitlen = this.bitLength;
          let str = '';
          if (radix === 16) {
              // FIXME clamp last limb to (bitlen % 32)
              for (var i = ((bitlen + 31) >> 5) - 1; i >= 0; i--) {
                  var h = limbs[i].toString(16);
                  str += '00000000'.substr(h.length);
                  str += h;
              }
              str = str.replace(/^0+/, '');
              if (!str.length)
                  str = '0';
          }
          else {
              throw new IllegalArgumentError('bad radix');
          }
          if (this.sign < 0)
              str = '-' + str;
          return str;
      }
      toBytes() {
          const bitlen = this.bitLength;
          const limbs = this.limbs;
          if (bitlen === 0)
              return new Uint8Array(0);
          const bytelen = (bitlen + 7) >> 3;
          const bytes = new Uint8Array(bytelen);
          for (let i = 0; i < bytelen; i++) {
              let j = bytelen - i - 1;
              bytes[i] = limbs[j >> 2] >> ((j & 3) << 3);
          }
          return bytes;
      }
      /**
       * Downgrade to Number
       */
      valueOf() {
          const limbs = this.limbs;
          const bits = this.bitLength;
          const sign = this.sign;
          if (!sign)
              return 0;
          if (bits <= 32)
              return sign * (limbs[0] >>> 0);
          if (bits <= 52)
              return sign * (0x100000000 * (limbs[1] >>> 0) + (limbs[0] >>> 0));
          // normalization
          let i, l, e = 0;
          for (i = limbs.length - 1; i >= 0; i--) {
              if ((l = limbs[i]) === 0)
                  continue;
              while (((l << e) & 0x80000000) === 0)
                  e++;
              break;
          }
          if (i === 0)
              return sign * (limbs[0] >>> 0);
          return (sign *
              (0x100000 * (((limbs[i] << e) | (e ? limbs[i - 1] >>> (32 - e) : 0)) >>> 0) +
                  (((limbs[i - 1] << e) | (e && i > 1 ? limbs[i - 2] >>> (32 - e) : 0)) >>> 12)) *
              Math.pow(2, 32 * i - e - 52));
      }
      clamp(b) {
          const limbs = this.limbs;
          const bitlen = this.bitLength;
          // FIXME check b is number and in a valid range
          if (b >= bitlen)
              return this;
          const clamped = new BigNumber();
          let n = (b + 31) >> 5;
          let k = b % 32;
          clamped.limbs = new Uint32Array(limbs.subarray(0, n));
          clamped.bitLength = b;
          clamped.sign = this.sign;
          if (k)
              clamped.limbs[n - 1] &= -1 >>> (32 - k);
          return clamped;
      }
      slice(f, b) {
          const limbs = this.limbs;
          const bitlen = this.bitLength;
          if (f < 0)
              throw new RangeError('TODO');
          if (f >= bitlen)
              return BigNumber.ZERO;
          if (b === undefined || b > bitlen - f)
              b = bitlen - f;
          const sliced = new BigNumber();
          let n = f >> 5;
          let m = (f + b + 31) >> 5;
          let l = (b + 31) >> 5;
          let t = f % 32;
          let k = b % 32;
          const slimbs = new Uint32Array(l);
          if (t) {
              for (var i = 0; i < m - n - 1; i++) {
                  slimbs[i] = (limbs[n + i] >>> t) | (limbs[n + i + 1] << (32 - t));
              }
              slimbs[i] = limbs[n + i] >>> t;
          }
          else {
              slimbs.set(limbs.subarray(n, m));
          }
          if (k) {
              slimbs[l - 1] &= -1 >>> (32 - k);
          }
          sliced.limbs = slimbs;
          sliced.bitLength = b;
          sliced.sign = this.sign;
          return sliced;
      }
      negate() {
          const negative = new BigNumber();
          negative.limbs = this.limbs;
          negative.bitLength = this.bitLength;
          negative.sign = -1 * this.sign;
          return negative;
      }
      compare(that) {
          var alimbs = this.limbs, alimbcnt = alimbs.length, blimbs = that.limbs, blimbcnt = blimbs.length, z = 0;
          if (this.sign < that.sign)
              return -1;
          if (this.sign > that.sign)
              return 1;
          _bigint_heap.set(alimbs, 0);
          _bigint_heap.set(blimbs, alimbcnt);
          z = _bigint_asm.cmp(0, alimbcnt << 2, alimbcnt << 2, blimbcnt << 2);
          return z * this.sign;
      }
      add(that) {
          if (!this.sign)
              return that;
          if (!that.sign)
              return this;
          var abitlen = this.bitLength, alimbs = this.limbs, alimbcnt = alimbs.length, asign = this.sign, bbitlen = that.bitLength, blimbs = that.limbs, blimbcnt = blimbs.length, bsign = that.sign, rbitlen, rlimbcnt, rsign, rof, result = new BigNumber();
          rbitlen = (abitlen > bbitlen ? abitlen : bbitlen) + (asign * bsign > 0 ? 1 : 0);
          rlimbcnt = (rbitlen + 31) >> 5;
          _bigint_asm.sreset();
          var pA = _bigint_asm.salloc(alimbcnt << 2), pB = _bigint_asm.salloc(blimbcnt << 2), pR = _bigint_asm.salloc(rlimbcnt << 2);
          _bigint_asm.z(pR - pA + (rlimbcnt << 2), 0, pA);
          _bigint_heap.set(alimbs, pA >> 2);
          _bigint_heap.set(blimbs, pB >> 2);
          if (asign * bsign > 0) {
              _bigint_asm.add(pA, alimbcnt << 2, pB, blimbcnt << 2, pR, rlimbcnt << 2);
              rsign = asign;
          }
          else if (asign > bsign) {
              rof = _bigint_asm.sub(pA, alimbcnt << 2, pB, blimbcnt << 2, pR, rlimbcnt << 2);
              rsign = rof ? bsign : asign;
          }
          else {
              rof = _bigint_asm.sub(pB, blimbcnt << 2, pA, alimbcnt << 2, pR, rlimbcnt << 2);
              rsign = rof ? asign : bsign;
          }
          if (rof)
              _bigint_asm.neg(pR, rlimbcnt << 2, pR, rlimbcnt << 2);
          if (_bigint_asm.tst(pR, rlimbcnt << 2) === 0)
              return BigNumber.ZERO;
          result.limbs = new Uint32Array(_bigint_heap.subarray(pR >> 2, (pR >> 2) + rlimbcnt));
          result.bitLength = rbitlen;
          result.sign = rsign;
          return result;
      }
      subtract(that) {
          return this.add(that.negate());
      }
      square() {
          if (!this.sign)
              return BigNumber.ZERO;
          var abitlen = this.bitLength, alimbs = this.limbs, alimbcnt = alimbs.length, rbitlen, rlimbcnt, result = new BigNumber();
          rbitlen = abitlen << 1;
          rlimbcnt = (rbitlen + 31) >> 5;
          _bigint_asm.sreset();
          var pA = _bigint_asm.salloc(alimbcnt << 2), pR = _bigint_asm.salloc(rlimbcnt << 2);
          _bigint_asm.z(pR - pA + (rlimbcnt << 2), 0, pA);
          _bigint_heap.set(alimbs, pA >> 2);
          _bigint_asm.sqr(pA, alimbcnt << 2, pR);
          result.limbs = new Uint32Array(_bigint_heap.subarray(pR >> 2, (pR >> 2) + rlimbcnt));
          result.bitLength = rbitlen;
          result.sign = 1;
          return result;
      }
      divide(that) {
          var abitlen = this.bitLength, alimbs = this.limbs, alimbcnt = alimbs.length, bbitlen = that.bitLength, blimbs = that.limbs, blimbcnt = blimbs.length, qlimbcnt, rlimbcnt, quotient = BigNumber.ZERO, remainder = BigNumber.ZERO;
          _bigint_asm.sreset();
          var pA = _bigint_asm.salloc(alimbcnt << 2), pB = _bigint_asm.salloc(blimbcnt << 2), pQ = _bigint_asm.salloc(alimbcnt << 2);
          _bigint_asm.z(pQ - pA + (alimbcnt << 2), 0, pA);
          _bigint_heap.set(alimbs, pA >> 2);
          _bigint_heap.set(blimbs, pB >> 2);
          _bigint_asm.div(pA, alimbcnt << 2, pB, blimbcnt << 2, pQ);
          qlimbcnt = _bigint_asm.tst(pQ, alimbcnt << 2) >> 2;
          if (qlimbcnt) {
              quotient = new BigNumber();
              quotient.limbs = new Uint32Array(_bigint_heap.subarray(pQ >> 2, (pQ >> 2) + qlimbcnt));
              quotient.bitLength = abitlen < qlimbcnt << 5 ? abitlen : qlimbcnt << 5;
              quotient.sign = this.sign * that.sign;
          }
          rlimbcnt = _bigint_asm.tst(pA, blimbcnt << 2) >> 2;
          if (rlimbcnt) {
              remainder = new BigNumber();
              remainder.limbs = new Uint32Array(_bigint_heap.subarray(pA >> 2, (pA >> 2) + rlimbcnt));
              remainder.bitLength = bbitlen < rlimbcnt << 5 ? bbitlen : rlimbcnt << 5;
              remainder.sign = this.sign;
          }
          return {
              quotient: quotient,
              remainder: remainder,
          };
      }
      multiply(that) {
          if (!this.sign || !that.sign)
              return BigNumber.ZERO;
          var abitlen = this.bitLength, alimbs = this.limbs, alimbcnt = alimbs.length, bbitlen = that.bitLength, blimbs = that.limbs, blimbcnt = blimbs.length, rbitlen, rlimbcnt, result = new BigNumber();
          rbitlen = abitlen + bbitlen;
          rlimbcnt = (rbitlen + 31) >> 5;
          _bigint_asm.sreset();
          var pA = _bigint_asm.salloc(alimbcnt << 2), pB = _bigint_asm.salloc(blimbcnt << 2), pR = _bigint_asm.salloc(rlimbcnt << 2);
          _bigint_asm.z(pR - pA + (rlimbcnt << 2), 0, pA);
          _bigint_heap.set(alimbs, pA >> 2);
          _bigint_heap.set(blimbs, pB >> 2);
          _bigint_asm.mul(pA, alimbcnt << 2, pB, blimbcnt << 2, pR, rlimbcnt << 2);
          result.limbs = new Uint32Array(_bigint_heap.subarray(pR >> 2, (pR >> 2) + rlimbcnt));
          result.sign = this.sign * that.sign;
          result.bitLength = rbitlen;
          return result;
      }
      isMillerRabinProbablePrime(rounds) {
          var t = BigNumber.fromConfig(this), s = 0;
          t.limbs[0] -= 1;
          while (t.limbs[s >> 5] === 0)
              s += 32;
          while (((t.limbs[s >> 5] >> (s & 31)) & 1) === 0)
              s++;
          t = t.slice(s);
          var m = new Modulus(this), m1 = this.subtract(BigNumber.ONE), a = BigNumber.fromConfig(this), l = this.limbs.length - 1;
          while (a.limbs[l] === 0)
              l--;
          while (--rounds >= 0) {
              getRandomValues(a.limbs);
              if (a.limbs[0] < 2)
                  a.limbs[0] += 2;
              while (a.compare(m1) >= 0)
                  a.limbs[l] >>>= 1;
              var x = m.power(a, t);
              if (x.compare(BigNumber.ONE) === 0)
                  continue;
              if (x.compare(m1) === 0)
                  continue;
              var c = s;
              while (--c > 0) {
                  x = x.square().divide(m).remainder;
                  if (x.compare(BigNumber.ONE) === 0)
                      return false;
                  if (x.compare(m1) === 0)
                      break;
              }
              if (c === 0)
                  return false;
          }
          return true;
      }
      isProbablePrime(paranoia = 80) {
          var limbs = this.limbs;
          var i = 0;
          // Oddity test
          // (50% false positive probability)
          if ((limbs[0] & 1) === 0)
              return false;
          if (paranoia <= 1)
              return true;
          // Magic divisors (3, 5, 17) test
          // (~25% false positive probability)
          var s3 = 0, s5 = 0, s17 = 0;
          for (i = 0; i < limbs.length; i++) {
              var l3 = limbs[i];
              while (l3) {
                  s3 += l3 & 3;
                  l3 >>>= 2;
              }
              var l5 = limbs[i];
              while (l5) {
                  s5 += l5 & 3;
                  l5 >>>= 2;
                  s5 -= l5 & 3;
                  l5 >>>= 2;
              }
              var l17 = limbs[i];
              while (l17) {
                  s17 += l17 & 15;
                  l17 >>>= 4;
                  s17 -= l17 & 15;
                  l17 >>>= 4;
              }
          }
          if (!(s3 % 3) || !(s5 % 5) || !(s17 % 17))
              return false;
          if (paranoia <= 2)
              return true;
          // Miller-Rabin test
          // (≤ 4^(-k) false positive probability)
          return this.isMillerRabinProbablePrime(paranoia >>> 1);
      }
  }
  BigNumber.extGCD = BigNumber_extGCD;
  BigNumber.ZERO = BigNumber.fromNumber(0);
  BigNumber.ONE = BigNumber.fromNumber(1);
  class Modulus extends BigNumber {
      constructor(number) {
          super();
          this.limbs = number.limbs;
          this.bitLength = number.bitLength;
          this.sign = number.sign;
          if (this.valueOf() < 1)
              throw new RangeError();
          if (this.bitLength <= 32)
              return;
          let comodulus;
          if (this.limbs[0] & 1) {
              const bitlen = ((this.bitLength + 31) & -32) + 1;
              const limbs = new Uint32Array((bitlen + 31) >> 5);
              limbs[limbs.length - 1] = 1;
              comodulus = new BigNumber();
              comodulus.sign = 1;
              comodulus.bitLength = bitlen;
              comodulus.limbs = limbs;
              const k = Number_extGCD(0x100000000, this.limbs[0]).y;
              this.coefficient = k < 0 ? -k : 0x100000000 - k;
          }
          else {
              /**
               * TODO even modulus reduction
               * Modulus represented as `N = 2^U * V`, where `V` is odd and thus `GCD(2^U, V) = 1`.
               * Calculation `A = TR' mod V` is made as for odd modulo using Montgomery method.
               * Calculation `B = TR' mod 2^U` is easy as modulus is a power of 2.
               * Using Chinese Remainder Theorem and Garner's Algorithm restore `TR' mod N` from `A` and `B`.
               */
              return;
          }
          this.comodulus = comodulus;
          this.comodulusRemainder = comodulus.divide(this).remainder;
          this.comodulusRemainderSquare = comodulus.square().divide(this).remainder;
      }
      /**
       * Modular reduction
       */
      reduce(a) {
          if (a.bitLength <= 32 && this.bitLength <= 32)
              return BigNumber.fromNumber(a.valueOf() % this.valueOf());
          if (a.compare(this) < 0)
              return a;
          return a.divide(this).remainder;
      }
      /**
       * Modular inverse
       */
      inverse(a) {
          a = this.reduce(a);
          const r = BigNumber_extGCD(this, a);
          if (r.gcd.valueOf() !== 1)
              throw new Error('GCD is not 1');
          if (r.y.sign < 0)
              return r.y.add(this).clamp(this.bitLength);
          return r.y;
      }
      /**
       * Modular exponentiation
       */
      power(g, e) {
          // count exponent set bits
          let c = 0;
          for (let i = 0; i < e.limbs.length; i++) {
              let t = e.limbs[i];
              while (t) {
                  if (t & 1)
                      c++;
                  t >>>= 1;
              }
          }
          // window size parameter
          let k = 8;
          if (e.bitLength <= 4536)
              k = 7;
          if (e.bitLength <= 1736)
              k = 6;
          if (e.bitLength <= 630)
              k = 5;
          if (e.bitLength <= 210)
              k = 4;
          if (e.bitLength <= 60)
              k = 3;
          if (e.bitLength <= 12)
              k = 2;
          if (c <= 1 << (k - 1))
              k = 1;
          // montgomerize base
          g = Modulus._Montgomery_reduce(this.reduce(g).multiply(this.comodulusRemainderSquare), this);
          // precompute odd powers
          const g2 = Modulus._Montgomery_reduce(g.square(), this), gn = new Array(1 << (k - 1));
          gn[0] = g;
          gn[1] = Modulus._Montgomery_reduce(g.multiply(g2), this);
          for (let i = 2; i < 1 << (k - 1); i++) {
              gn[i] = Modulus._Montgomery_reduce(gn[i - 1].multiply(g2), this);
          }
          // perform exponentiation
          const u = this.comodulusRemainder;
          let r = u;
          for (let i = e.limbs.length - 1; i >= 0; i--) {
              let t = e.limbs[i];
              for (let j = 32; j > 0;) {
                  if (t & 0x80000000) {
                      let n = t >>> (32 - k), l = k;
                      while ((n & 1) === 0) {
                          n >>>= 1;
                          l--;
                      }
                      var m = gn[n >>> 1];
                      while (n) {
                          n >>>= 1;
                          if (r !== u)
                              r = Modulus._Montgomery_reduce(r.square(), this);
                      }
                      r = r !== u ? Modulus._Montgomery_reduce(r.multiply(m), this) : m;
                      (t <<= l), (j -= l);
                  }
                  else {
                      if (r !== u)
                          r = Modulus._Montgomery_reduce(r.square(), this);
                      (t <<= 1), j--;
                  }
              }
          }
          // de-montgomerize result
          return Modulus._Montgomery_reduce(r, this);
      }
      static _Montgomery_reduce(a, n) {
          const alimbs = a.limbs;
          const alimbcnt = alimbs.length;
          const nlimbs = n.limbs;
          const nlimbcnt = nlimbs.length;
          const y = n.coefficient;
          _bigint_asm.sreset();
          const pA = _bigint_asm.salloc(alimbcnt << 2), pN = _bigint_asm.salloc(nlimbcnt << 2), pR = _bigint_asm.salloc(nlimbcnt << 2);
          _bigint_asm.z(pR - pA + (nlimbcnt << 2), 0, pA);
          _bigint_heap.set(alimbs, pA >> 2);
          _bigint_heap.set(nlimbs, pN >> 2);
          _bigint_asm.mredc(pA, alimbcnt << 2, pN, nlimbcnt << 2, y, pR);
          const result = new BigNumber();
          result.limbs = new Uint32Array(_bigint_heap.subarray(pR >> 2, (pR >> 2) + nlimbcnt));
          result.bitLength = n.bitLength;
          result.sign = 1;
          return result;
      }
  }

  var ecdsa = new elliptic_2('secp256k1');

  /**
   * Encode public key as address
   * @param {ECPoint} publicKey
   * @return {string} base58check encoded address
   */
  function addressFromPublicKey(publicKey) {
    var len = publicKey.curve.p.byteLength();
    var x = publicKey.getX().toArray('be', len);
    var address = Uint8Array.from([publicKey.getY().isEven() ? 0x02 : 0x03].concat(x));
    return encodeAddress(address);
  }
  /**
   * Encodes a key pair into an identity object
   * @param {KeyPair} keyPair 
   * @return {object}
   */

  function encodeIdentity(keyPair) {
    //@ts-ignore
    var privateKey = keyPair.getPrivate().toBuffer();
    var publicKey = keyPair.getPublic();
    var address = addressFromPublicKey(publicKey);
    return {
      address: address,
      publicKey: publicKey,
      privateKey: privateKey,
      keyPair: keyPair
    };
  }
  /**
   * Shortcut function to create a new random private key and
   * return keys and address as encoded strings.
   */

  function createIdentity() {
    var keyPair = ecdsa.genKeyPair();
    return encodeIdentity(keyPair);
  }
  /**
   * Returns identity associated with private key
   * @param {Buffer} privKeyBytes 
   */

  function identifyFromPrivateKey(privKeyBytes) {
    var keyPair = ecdsa.keyFromPrivate(Buffer.from(privKeyBytes));
    return encodeIdentity(keyPair);
  }
  /**
   * Retrieve public key from address
   * @param {ECPoint} publicKey
   * @return {string} base58check encoded address
   */

  function publicKeyFromAddress(address) {
    var pubkey = decodeAddress(address);
    return ecdsa.keyFromPublic(pubkey);
  }

  var _keyAndNonceFromPassword =
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(function* (password) {
      // Make a key from double hashing the password
      var hash = ecdsa.hash();
      hash.update(password);
      var addr = hash.digest();
      var rehash = ecdsa.hash();
      rehash.update(password);
      rehash.update(addr);
      var key = Buffer.from(rehash.digest());
      var nonce = Buffer.from(addr.slice(4, 16));
      return [key, nonce];
    });

    return function _keyAndNonceFromPassword(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  function decryptPrivateKey(_x2, _x3) {
    return _decryptPrivateKey.apply(this, arguments);
  }

  function _decryptPrivateKey() {
    _decryptPrivateKey = _asyncToGenerator(function* (encryptedBytes, password) {
      var _ref2 = yield _keyAndNonceFromPassword(password),
          _ref3 = _slicedToArray(_ref2, 2),
          key = _ref3[0],
          nonce = _ref3[1];

      return AES_GCM.decrypt(Uint8Array.from(encryptedBytes), key, nonce);
    });
    return _decryptPrivateKey.apply(this, arguments);
  }

  function encryptPrivateKey(_x4, _x5) {
    return _encryptPrivateKey.apply(this, arguments);
  }

  function _encryptPrivateKey() {
    _encryptPrivateKey = _asyncToGenerator(function* (clearBytes, password) {
      var _ref4 = yield _keyAndNonceFromPassword(password),
          _ref5 = _slicedToArray(_ref4, 2),
          key = _ref5[0],
          nonce = _ref5[1];

      return AES_GCM.encrypt(Uint8Array.from(clearBytes), key, nonce);
    });
    return _encryptPrivateKey.apply(this, arguments);
  }

  var ecdsa$1 = new elliptic_2('secp256k1');

  function hash(data) {
    var h = ecdsa$1.hash();
    h.update(data);
    return h.digest();
  }
  /**
   * Calculate hash of transaction
   * @param {object} tx Transaction
   * @return {string} transaction hash
   */


  function hashTransaction(_x) {
    return _hashTransaction.apply(this, arguments);
  }

  function _hashTransaction() {
    _hashTransaction = _asyncToGenerator(function* (tx) {
      var encoding = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'base64';
      var includeSign = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      // check amount format
      tx.amount = '' + tx.amount;
      var amountUnit = tx.amount.match(/\s*([^0-9]+)\s*/);

      if (amountUnit && amountUnit[1] !== 'aer') {
        throw Error("Can only hash amounts provided in the base unit (aer), not ".concat(tx.amount, ". Convert to aer or remove unit."));
      }

      tx.amount = tx.amount.replace(/[^0-9]/g, '');
      var data = Buffer.concat([fromNumber(tx.nonce, 64), decodeAddress(tx.from.toString()), tx.to ? decodeAddress(tx.to.toString()) : Buffer.from([]), fromBigInt(tx.amount || 0), Buffer.from(tx.payload), fromNumber(tx.limit, 64), fromBigInt(tx.price || 0), fromNumber(tx.type, 32)]);

      if (includeSign && 'sign' in tx) {
        data = Buffer.concat([data, Buffer.from(tx.sign, 'base64')]);
      }

      var result = hash(data);

      if (encoding == 'base64') {
        return Buffer.from(result).toString('base64');
      } else if (encoding == 'base58') {
        return encodeTxHash(Buffer.from(result));
      } else {
        return result;
      }
    });
    return _hashTransaction.apply(this, arguments);
  }

  /**
   * Returns signature encoded in DER format in base64.
   * @param sig 
   */

  var encodeSignature = function encodeSignature(sig) {
    return Buffer.from(sig.toDER()).toString('base64');
  };
  /**
   * Sign transaction with key.
   * @param {object} tx transaction
   * @param {BN} key key pair or private key
   */


  var signMessage =
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(function* (msgHash, key) {
      var sig = key.sign(msgHash);
      return encodeSignature(sig);
    });

    return function signMessage(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();
  /**
   * Sign transaction with key.
   * @param {object} tx transaction
   * @param {BN} key key pair or private key
   */


  var signTransaction =
  /*#__PURE__*/
  function () {
    var _ref2 = _asyncToGenerator(function* (tx, key) {
      var msgHash = yield hashTransaction(tx, 'bytes', false);
      return signMessage(msgHash, key);
    });

    return function signTransaction(_x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  }();
  /**
   * Verify that a signature for msg was generated by key
   * @param key key pair or public key
   */


  var verifySignature =
  /*#__PURE__*/
  function () {
    var _ref3 = _asyncToGenerator(function* (msg, key, signature) {
      try {
        var sign = Buffer.from(signature, 'base64'); // @ts-ignore: the typedef is wrong, a Buffer is an allowed input

        return key.verify(msg, sign);
      } catch (e) {
        throw Error('could not decode signature: ' + e);
      }
    });

    return function verifySignature(_x5, _x6, _x7) {
      return _ref3.apply(this, arguments);
    };
  }();
  /**
   * Verify that a signature for tx was generated by key
   */


  var verifyTxSignature =
  /*#__PURE__*/
  function () {
    var _ref4 = _asyncToGenerator(function* (tx, key, signature) {
      var msg = yield hashTransaction(tx, 'bytes', false);
      return yield verifySignature(msg, key, signature);
    });

    return function verifyTxSignature(_x8, _x9, _x10) {
      return _ref4.apply(this, arguments);
    };
  }();

  exports.encodeAddress = encodeAddress;
  exports.decodeAddress = decodeAddress;
  exports.encodePrivateKey = encodePrivateKey;
  exports.decodePrivateKey = decodePrivateKey;
  exports.createIdentity = createIdentity;
  exports.identifyFromPrivateKey = identifyFromPrivateKey;
  exports.addressFromPublicKey = addressFromPublicKey;
  exports.publicKeyFromAddress = publicKeyFromAddress;
  exports.decryptPrivateKey = decryptPrivateKey;
  exports.encryptPrivateKey = encryptPrivateKey;
  exports.signMessage = signMessage;
  exports.signTransaction = signTransaction;
  exports.verifySignature = verifySignature;
  exports.verifyTxSignature = verifyTxSignature;
  exports.hashTransaction = hashTransaction;

  return exports;

}({}, crypto, buffer, util));
