'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var typedEventEmitter = require('@elderapo/typed-event-emitter');
var client = require('@herajs/client');
var crypto = require('@herajs/crypto');
var idb = require('idb');

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

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

var Middleware = function Middleware() {
  _classCallCheck(this, Middleware);
};

function isMiddlewareConstructor(arg) {
  return typeof arg === 'function';
}

var MiddlewareConsumer =
/*#__PURE__*/
function () {
  function MiddlewareConsumer() {
    _classCallCheck(this, MiddlewareConsumer);

    _defineProperty(this, "middlewares", []);
  }

  _createClass(MiddlewareConsumer, [{
    key: "use",
    value: function use(middleware) {
      if (isMiddlewareConstructor(middleware)) {
        middleware = new middleware();
      }

      this.middlewares.push(middleware);
    }
  }, {
    key: "applyMiddlewares",
    value: function applyMiddlewares(functionName) {
      var _this = this;

      return function (next) {
        var fn;

        if (typeof next === 'undefined') {
          fn = function fn() {
            throw new Error("Method ".concat(functionName, " has no fallback implementation. Did you forget to load a middleware?"));
          };
        } else {
          fn = next;
        }

        if (_this.middlewares) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = _this.middlewares[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var middleware = _step.value;

              if (typeof middleware[functionName] === 'function') {
                fn = middleware[functionName](_this)(fn);
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }

        return fn;
      };
    }
  }]);

  return MiddlewareConsumer;
}();

/**
 * A Record is a basic object that only contains a key and data as primitive types, arrays, and objects.
 * The data field is serializable and should be compatabile with any kind of storage.
 * Sub-classes can add non-serializable fields.
 */
var Record = function Record(key, data) {
  _classCallCheck(this, Record);

  _defineProperty(this, "key", void 0);

  _defineProperty(this, "data", void 0);

  this.key = key;
  this.data = data;
};

var Status;

(function (Status) {
  Status["Pending"] = "pending";
  Status["Confirmed"] = "confirmed";
  Status["Error"] = "error";
  Status["Timeout"] = "timeout";
})(Status || (Status = {}));

var Transaction =
/*#__PURE__*/
function (_Record) {
  _inherits(Transaction, _Record);

  function Transaction(key, data, txBody) {
    var _this;

    _classCallCheck(this, Transaction);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Transaction).call(this, key, data));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "txBody", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_unsignedHash", void 0);

    _this.txBody = txBody;
    return _this;
  }

  _createClass(Transaction, [{
    key: "getUnsignedHash",

    /**
     * Calculate the hash excluding any signature
     */
    value: function getUnsignedHash() {
      // TODO calc hash
      return '';
    }
  }, {
    key: "unsignedHash",
    get: function get() {
      if (typeof this._unsignedHash === 'undefined') {
        this._unsignedHash = this.getUnsignedHash();
      }

      return this._unsignedHash;
    }
  }, {
    key: "amount",
    get: function get() {
      return new client.Amount(this.data.amount);
    }
  }]);

  return Transaction;
}(Record);

_defineProperty(Transaction, "Status", Status);

var SignedTransaction =
/*#__PURE__*/
function (_Transaction) {
  _inherits(SignedTransaction, _Transaction);

  function SignedTransaction(key, data, txBody, signature) {
    var _this2;

    _classCallCheck(this, SignedTransaction);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(SignedTransaction).call(this, key, data));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this2)), "_signedHash", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this2)), "signature", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this2)), "txBody", void 0);

    _this2.txBody = txBody;

    if (_this2.data.hash !== null) {
      _this2._signedHash = _this2.data.hash;
    }

    _this2.signature = signature;
    return _this2;
  }

  _createClass(SignedTransaction, [{
    key: "getHash",

    /**
     * Calculate the hash, including all present body
     */
    value: function () {
      var _getHash = _asyncToGenerator(function* () {
        if (typeof this.txBody.nonce !== 'number') {
          throw new Error('missing required parameter `nonce`');
        }

        var hash = yield crypto.hashTransaction(_objectSpread({}, this.txBody, {
          nonce: this.txBody.nonce || 0
        }), 'base58');
        this._signedHash = hash;
        return hash;
      });

      function getHash() {
        return _getHash.apply(this, arguments);
      }

      return getHash;
    }()
  }, {
    key: "status",
    get: function get() {
      return this.data.status;
    }
  }, {
    key: "isPending",
    get: function get() {
      return this.status === Transaction.Status.Pending;
    }
  }, {
    key: "isConfirmed",
    get: function get() {
      return this.status === Transaction.Status.Confirmed;
    }
  }, {
    key: "hash",
    get: function get() {
      if (typeof this._signedHash === 'undefined') throw new Error('transaction is missing hash, either supply or compute with getHash()');
      return this._signedHash;
    }
  }], [{
    key: "fromTxBody",
    value: function fromTxBody(txBody, chainId) {
      return new SignedTransaction(txBody.hash ? txBody.hash : '', {
        chainId: chainId,
        from: '' + txBody.from,
        to: '' + txBody.to,
        hash: '' + txBody.hash,
        ts: '',
        blockhash: null,
        blockno: null,
        amount: '' + txBody.amount,
        type: txBody.type ? txBody.type : 0,
        status: Transaction.Status.Confirmed
      }, txBody, txBody.sign ? txBody.sign : '');
    }
  }]);

  return SignedTransaction;
}(Transaction);

var Key =
/*#__PURE__*/
function (_Record) {
  _inherits(Key, _Record);

  function Key() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, Key);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Key)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_keyPair", void 0);

    return _this;
  }

  _createClass(Key, [{
    key: "signTransaction",
    value: function () {
      var _signTransaction2 = _asyncToGenerator(function* (tx) {
        if (typeof tx.txBody === 'undefined') {
          throw new Error('cannot sign transaction without txBody. Did you use prepareTransaction?');
        }

        var signature = yield crypto.signTransaction(_objectSpread({}, tx.txBody), this.keyPair);
        var signedTx = new SignedTransaction(tx.key, tx.data, _objectSpread({}, tx.txBody), signature);
        signedTx.txBody.sign = signature;
        signedTx.txBody.hash = yield signedTx.getHash();
        return signedTx;
      });

      function signTransaction(_x) {
        return _signTransaction2.apply(this, arguments);
      }

      return signTransaction;
    }()
  }, {
    key: "signMessage",
    value: function () {
      var _signMessage2 = _asyncToGenerator(function* (message) {
        var enc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'hex';
        return yield crypto.signMessage(message, this.keyPair, enc);
      });

      function signMessage(_x2) {
        return _signMessage2.apply(this, arguments);
      }

      return signMessage;
    }()
  }, {
    key: "keyPair",
    get: function get() {
      if (!this._keyPair) {
        var identity = crypto.identifyFromPrivateKey(Uint8Array.from(this.data.privateKey));
        this._keyPair = identity.keyPair;
      }

      return this._keyPair;
    }
  }], [{
    key: "fromRecord",
    value: function fromRecord(record) {
      return new Key(record.key, record.data);
    }
  }]);

  return Key;
}(Record);

var EncryptedIdSetting =
/*#__PURE__*/
function (_Record) {
  _inherits(EncryptedIdSetting, _Record);

  function EncryptedIdSetting() {
    _classCallCheck(this, EncryptedIdSetting);

    return _possibleConstructorReturn(this, _getPrototypeOf(EncryptedIdSetting).apply(this, arguments));
  }

  return EncryptedIdSetting;
}(Record);

/**
 * Returns the next interval to use for exponential backoff.
 * This curve yields every value 4 times before doubling in the next step.
 * The intervals reach ca. 1 minute (total time elapsed ca. 4 minutes) after step 24,
 * so it is advised to declare a timeout after a certain number of steps.
 * @param n step on the interval curve
 */

function backoffIntervalStep(n) {
  var multiplier = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;
  return multiplier * Math.pow(2, Math.floor(n / 4));
}
function serializeAccountSpec(accountSpec) {
  var chainId = typeof accountSpec.chainId === 'undefined' ? '' : accountSpec.chainId;
  return "".concat(chainId, "/").concat(accountSpec.address);
}
/**
 * A simple extension of the native Map using stringified objects as keys.
 * The order of object properties matters.
 */

var HashMap =
/*#__PURE__*/
function () {
  function HashMap() {
    _classCallCheck(this, HashMap);

    _defineProperty(this, "map", new Map());
  }

  _createClass(HashMap, [{
    key: "hash",
    value: function hash(key) {
      return typeof key === 'string' ? key : JSON.stringify(key);
    }
  }, {
    key: "set",
    value: function set(key, value) {
      this.map.set(this.hash(key), value);
      return this;
    }
  }, {
    key: "get",
    value: function get(key) {
      return this.map.get(this.hash(key));
    }
  }, {
    key: "has",
    value: function has(key) {
      return this.map.has(this.hash(key));
    }
  }, {
    key: "values",
    value: function values() {
      return this.map.values();
    }
  }, {
    key: "keys",
    value: function keys() {
      return this.map.keys();
    }
  }, {
    key: "size",
    get: function get() {
      return this.map.size;
    }
  }]);

  return HashMap;
}();
var PausableTypedEventEmitter =
/*#__PURE__*/
function (_TypedEventEmitter) {
  _inherits(PausableTypedEventEmitter, _TypedEventEmitter);

  function PausableTypedEventEmitter() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, PausableTypedEventEmitter);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(PausableTypedEventEmitter)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "paused", true);

    return _this;
  }

  _createClass(PausableTypedEventEmitter, [{
    key: "resume",
    value: function resume() {
      if (!this.paused) return;
      this.paused = false;
    }
  }, {
    key: "pause",
    value: function pause() {
      if (this.paused) return;
      this.paused = true;
    }
  }]);

  return PausableTypedEventEmitter;
}(typedEventEmitter.TypedEventEmitter);
function isConstructor(arg) {
  return typeof arg === 'function';
}

/**
 * KeyManager manages and tracks keys for accounts
 */
var KeyManager =
/*#__PURE__*/
function (_TypedEventEmitter) {
  _inherits(KeyManager, _TypedEventEmitter);

  function KeyManager(wallet) {
    var _this;

    _classCallCheck(this, KeyManager);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(KeyManager).call(this));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "wallet", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "keys", new HashMap());

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "masterPassphrase", void 0);

    _this.wallet = wallet;
    return _this;
  }

  _createClass(KeyManager, [{
    key: "addKey",
    value: function addKey(account, privateKey) {
      var address = account.data.spec.address; // TODO: encryption

      var key = new Key(address, {
        privateKey: Array.from(privateKey),
        address: address
      });
      this.keys.set(address, key);
      this.wallet.keystore && this.wallet.keystore.getIndex('keys').put(key);
      return key;
    }
  }, {
    key: "getKey",
    value: function () {
      var _getKey = _asyncToGenerator(function* (account) {
        var address = account.data.spec.address;

        if (!this.keys.has(address) && this.wallet.keystore) {
          try {
            var keyRecord = yield this.wallet.keystore.getIndex('keys').get(address);
            var key = Key.fromRecord(keyRecord);
            this.keys.set(address, key);
            return key;
          } catch (e) {
            throw new Error("missing key for account ".concat(address));
          }
        }

        return this.keys.get(address);
      });

      function getKey(_x) {
        return _getKey.apply(this, arguments);
      }

      return getKey;
    }()
  }, {
    key: "signTransaction",
    value: function () {
      var _signTransaction = _asyncToGenerator(function* (account, transaction) {
        var key = yield this.getKey(account);
        return key.signTransaction(transaction);
      });

      function signTransaction(_x2, _x3) {
        return _signTransaction.apply(this, arguments);
      }

      return signTransaction;
    }()
  }, {
    key: "signMessage",
    value: function () {
      var _signMessage = _asyncToGenerator(function* (account, message) {
        var enc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'hex';
        var key = yield this.getKey(account);
        return yield key.signMessage(message, enc);
      });

      function signMessage(_x4, _x5) {
        return _signMessage.apply(this, arguments);
      }

      return signMessage;
    }()
  }, {
    key: "importKey",
    value: function () {
      var _importKey = _asyncToGenerator(function* (importSpec) {
        var rawKey = new Uint8Array([]);

        if (typeof importSpec.b58encrypted === 'string' && typeof importSpec.password === 'string') {
          var encryptedKey = crypto.decodePrivateKey(importSpec.b58encrypted);
          rawKey = yield crypto.decryptPrivateKey(encryptedKey, importSpec.password);
        }

        if (typeof importSpec.privateKey !== 'undefined') {
          rawKey = importSpec.privateKey;
        }

        if (!rawKey.length) throw new Error('no key provided. Supply b58encrypted and password or privateKey');
        return this.addKey(importSpec.account, rawKey);
      });

      function importKey(_x6) {
        return _importKey.apply(this, arguments);
      }

      return importKey;
    }()
    /*
    import
     export
    */

  }, {
    key: "unlock",
    value: function () {
      var _unlock = _asyncToGenerator(function* (passphrase) {
        if (!this.wallet.datastore) throw new Error('configure storage before accessing keystore');
        var encryptedId = yield this.wallet.datastore.getIndex('settings').get('encryptedId');

        try {
          yield crypto.decryptPrivateKey(Uint8Array.from(encryptedId.data.value), passphrase);
        } catch (e) {
          throw new Error('invalid passphrase');
        }

        this.masterPassphrase = passphrase;
        this.emit('unlock', null);
      });

      function unlock(_x7) {
        return _unlock.apply(this, arguments);
      }

      return unlock;
    }()
  }, {
    key: "setupAndUnlock",
    value: function () {
      var _setupAndUnlock = _asyncToGenerator(function* (appId, passphrase) {
        if (!this.wallet.datastore) throw new Error('configure storage before accessing keystore'); // save extension id encrypted using password for a quick check if passphrase is correct later

        var encryptedId = new EncryptedIdSetting('encryptedId', {
          value: Array.from((yield crypto.encryptPrivateKey(Buffer.from(appId), passphrase)))
        });
        yield this.wallet.datastore.getIndex('settings').put(encryptedId);
        yield this.unlock(passphrase);
      });

      function setupAndUnlock(_x8, _x9) {
        return _setupAndUnlock.apply(this, arguments);
      }

      return setupAndUnlock;
    }()
  }, {
    key: "lock",
    value: function lock() {
      this.masterPassphrase = undefined;
      this.emit('lock', null);
    }
  }, {
    key: "unlocked",
    get: function get() {
      return typeof this.masterPassphrase !== 'undefined';
    }
  }]);

  return KeyManager;
}(typedEventEmitter.TypedEventEmitter);

var Account =
/*#__PURE__*/
function (_Record) {
  _inherits(Account, _Record);

  function Account() {
    _classCallCheck(this, Account);

    return _possibleConstructorReturn(this, _getPrototypeOf(Account).apply(this, arguments));
  }

  _createClass(Account, [{
    key: "balance",
    get: function get() {
      return new client.Amount(this.data.balance);
    }
  }, {
    key: "nonce",
    get: function get() {
      return this.data.nonce;
    }
  }, {
    key: "address",
    get: function get() {
      return new client.Address(this.data.spec.address);
    }
  }]);

  return Account;
}(Record);

var DEFAULT_CHAIN = 'testnet.aergo.io';
var ACCOUNT_UPDATE_INTERVAL = 10000;

var AccountTracker =
/*#__PURE__*/
function (_PausableTypedEventEm) {
  _inherits(AccountTracker, _PausableTypedEventEm);

  function AccountTracker(manager, account) {
    var _this;

    _classCallCheck(this, AccountTracker);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AccountTracker).call(this));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "manager", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "intervalId", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "account", void 0);

    _this.manager = manager;
    _this.account = account;
    return _this;
  }

  _createClass(AccountTracker, [{
    key: "load",
    value: function () {
      var _load = _asyncToGenerator(function* () {
        var client = this.manager.wallet.getClient(this.account.data.spec.chainId);
        var state = yield client.getState(this.account.data.spec.address);
        this.account.data.balance = state.balance.toString();
        this.account.data.nonce = state.nonce;
        this.emit('update', this.account);
        this.manager.wallet.datastore && this.manager.wallet.datastore.getIndex('accounts').put(this.account);
        return this.account;
      });

      function load() {
        return _load.apply(this, arguments);
      }

      return load;
    }()
  }, {
    key: "resume",
    value: function resume() {
      var _this2 = this;

      this.load();
      this.pause();
      this.intervalId = setInterval(function () {
        _this2.load();
      }, ACCOUNT_UPDATE_INTERVAL);
    }
  }, {
    key: "pause",
    value: function pause() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
    }
  }]);

  return AccountTracker;
}(PausableTypedEventEmitter);
/**
 * AccountManager manages and tracks single accounts
 */


var AccountManager =
/*#__PURE__*/
function (_PausableTypedEventEm2) {
  _inherits(AccountManager, _PausableTypedEventEm2);

  function AccountManager(wallet) {
    var _this3;

    _classCallCheck(this, AccountManager);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(AccountManager).call(this));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this3)), "wallet", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this3)), "accounts", new HashMap());

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this3)), "trackers", new HashMap());

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this3)), "loadedFromStore", false);

    _this3.wallet = wallet;
    return _this3;
  }

  _createClass(AccountManager, [{
    key: "resume",
    value: function resume() {
      if (!this.paused) return;
      this.paused = false;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.trackers.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var tracker = _step.value;
          tracker.resume();
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: "pause",
    value: function pause() {
      if (this.paused) return;
      this.paused = true;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.trackers.values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var tracker = _step2.value;
          tracker.pause();
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }, {
    key: "getCompleteAccountSpec",
    value: function getCompleteAccountSpec(accountSpec) {
      var chainId = typeof accountSpec.chainId !== 'undefined' ? accountSpec.chainId : this.wallet.defaultChainId;
      return {
        address: accountSpec.address,
        chainId: chainId
      };
    }
  }, {
    key: "addAccount",
    value: function addAccount(accountSpec) {
      var _this4 = this;

      var completeAccountSpec = this.getCompleteAccountSpec(accountSpec);

      if (this.accounts.has(completeAccountSpec)) {
        throw new Error('Account has already been added.');
      } // console.log('addAccount', completeAccountSpec);


      var accountPromise = this.loadAccount(completeAccountSpec);
      this.accounts.set(completeAccountSpec, accountPromise);
      accountPromise.then(function (account) {
        _this4.wallet.datastore && _this4.wallet.datastore.getIndex('accounts').put(account);
      });
      return accountPromise;
    }
  }, {
    key: "createAccount",
    value: function () {
      var _createAccount = _asyncToGenerator(function* (chainId) {
        var identity = crypto.createIdentity();
        var address = identity.address;
        var account = yield this.addAccount({
          address: address,
          chainId: chainId
        });
        yield this.wallet.keyManager.importKey({
          account: account,
          privateKey: identity.privateKey
        });
        return account;
      });

      function createAccount(_x) {
        return _createAccount.apply(this, arguments);
      }

      return createAccount;
    }()
  }, {
    key: "getAccounts",
    value: function () {
      var _getAccounts = _asyncToGenerator(function* () {
        if (!this.loadedFromStore && this.wallet.datastore) {
          var records = Array.from((yield this.wallet.datastore.getIndex('accounts').getAll()));
          var accounts = records.map(function (record) {
            return new Account(record.key, record.data);
          });
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = accounts[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var account = _step3.value;
              this.accounts.set(this.getCompleteAccountSpec(account.data.spec), Promise.resolve(account));
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }

          this.loadedFromStore = true;
          return accounts;
        }

        var promises = yield this.accounts.values();
        return Promise.all(promises);
      });

      function getAccounts() {
        return _getAccounts.apply(this, arguments);
      }

      return getAccounts;
    }()
  }, {
    key: "getOrAddAccount",
    value: function () {
      var _getOrAddAccount = _asyncToGenerator(function* (accountSpec) {
        var completeAccountSpec = this.getCompleteAccountSpec(accountSpec);
        var account;

        if (!this.accounts.has(completeAccountSpec)) {
          account = yield this.addAccount(completeAccountSpec);
        } else {
          account = yield this.accounts.get(completeAccountSpec);
        }

        return account;
      });

      function getOrAddAccount(_x2) {
        return _getOrAddAccount.apply(this, arguments);
      }

      return getOrAddAccount;
    }()
  }, {
    key: "trackAccount",
    value: function () {
      var _trackAccount = _asyncToGenerator(function* (accountOrSpec) {
        var account;

        if (!accountOrSpec.data) {
          account = yield this.getOrAddAccount(accountOrSpec);
        } else {
          account = accountOrSpec;
        }

        this.resume();

        if (this.trackers.has(account.data.spec)) {
          return this.trackers.get(account.data.spec);
        }

        console.log('[accountManager] track account', account.data.spec);
        var tracker = new AccountTracker(this, account);
        tracker.resume();
        this.trackers.set(account.data.spec, tracker);
        return tracker;
      });

      function trackAccount(_x3) {
        return _trackAccount.apply(this, arguments);
      }

      return trackAccount;
    }()
  }, {
    key: "loadAccount",
    value: function () {
      var _loadAccount = _asyncToGenerator(function* (accountSpec) {
        if (this.wallet.datastore) {
          try {
            var record = yield this.wallet.datastore.getIndex('accounts').get(serializeAccountSpec(accountSpec));
            return new Account(record.key, record.data);
          } catch (e) {// not found
          }
        }

        return new Account(serializeAccountSpec(accountSpec), {
          spec: {
            chainId: accountSpec.chainId,
            address: accountSpec.address.toString()
          },
          privateKey: [],
          publicKey: [],
          balance: '',
          nonce: 0,
          name: '',
          lastSync: null
        });
      });

      function loadAccount(_x4) {
        return _loadAccount.apply(this, arguments);
      }

      return loadAccount;
    }()
  }, {
    key: "getNonceForAccount",
    value: function () {
      var _getNonceForAccount = _asyncToGenerator(function* (account) {
        // TODO: smart caching
        var client = this.wallet.getClient(account.data.spec.chainId);
        return 1 + (yield client.getNonce(account.data.spec.address));
      });

      function getNonceForAccount(_x5) {
        return _getNonceForAccount.apply(this, arguments);
      }

      return getNonceForAccount;
    }()
  }, {
    key: "getChainIdHashForAccount",
    value: function () {
      var _getChainIdHashForAccount = _asyncToGenerator(function* (account) {
        // TODO: smart caching
        return yield this.wallet.getClient(account.data.spec.chainId).getChainIdHash('base58');
      });

      function getChainIdHashForAccount(_x6) {
        return _getChainIdHashForAccount.apply(this, arguments);
      }

      return getChainIdHashForAccount;
    }()
    /**
     * Calculates nonce and converts transaction body into tx ready for signing
     * @param account 
     * @param tx 
     */

  }, {
    key: "prepareTransaction",
    value: function () {
      var _prepareTransaction = _asyncToGenerator(function* (account, tx) {
        if (!tx.from) throw new Error('missing required transaction parameter `from` (address or name)');
        if (!new client.Address(account.data.spec.address).equal(tx.from)) throw new Error('transaction parameter `from` does not match account address');
        if (typeof tx.to === 'undefined') throw new Error('missing required transaction parameter `to` (address, name, or explicit null)');
        if (typeof tx.amount === 'undefined') throw new Error('missing required transaction parameter amount');
        tx.amount = new client.Amount(tx.amount).toUnit('aer').toString();

        if (typeof tx.payload === 'string') {
          tx.payload = Uint8Array.from(Buffer.from(tx.payload));
        } else {
          tx.payload = Uint8Array.from(tx.payload || []);
        }

        if (typeof tx.nonce === 'undefined') {
          tx.nonce = yield this.getNonceForAccount(account);
        }

        if (typeof tx.chainIdHash === 'undefined') {
          tx.chainIdHash = yield this.getChainIdHashForAccount(account);
        }

        return new Transaction('', {
          chainId: account.data.spec.chainId,
          from: tx.from.toString(),
          to: tx.to ? tx.to.toString() : '',
          hash: '',
          ts: new Date().toISOString(),
          blockhash: null,
          blockno: null,
          amount: new client.Amount(tx.amount).toString(),
          type: 0,
          status: Transaction.Status.Pending
        }, tx);
      });

      function prepareTransaction(_x7, _x8) {
        return _prepareTransaction.apply(this, arguments);
      }

      return prepareTransaction;
    }()
  }]);

  return AccountManager;
}(PausableTypedEventEmitter);

var TransactionTracker =
/*#__PURE__*/
function (_PausableTypedEventEm) {
  _inherits(TransactionTracker, _PausableTypedEventEm);

  function TransactionTracker(manager, transaction) {
    var _this;

    _classCallCheck(this, TransactionTracker);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TransactionTracker).call(this));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "transaction", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "manager", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "timeoutId", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "retryCount", 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "maxRetryCount", 10);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "started", void 0);

    _this.manager = manager;
    _this.transaction = transaction;
    _this.started = new Date();

    _this.retryLoad();

    return _this;
  }

  _createClass(TransactionTracker, [{
    key: "retryLoad",
    value: function retryLoad() {
      var _this2 = this;

      if (this.retryCount >= this.maxRetryCount) {
        this.transaction.data.status = Transaction.Status.Timeout;
        var elapsed = Math.round((+new Date() - +this.started) / 1000);
        this.emit('timeout', new Error("timeout after ".concat(elapsed, "s")));
        return;
      }

      var interval = backoffIntervalStep(this.retryCount++);
      this.timeoutId = setTimeout(function () {
        _this2.load();
      }, interval);
    }
    /**
     * Attempt to retrieve transaction data from node.
     * Emits events according to changed status.
     */

  }, {
    key: "load",
    value: function () {
      var _load = _asyncToGenerator(function* () {
        var _this3 = this;

        console.log('[transactionManager] load', this.transaction.data.chainId, this.transaction.data.hash);
        var client = this.manager.wallet.getClient(this.transaction.data.chainId);

        try {
          var _result = yield client.getTransaction(this.transaction.data.hash);

          if (typeof _result.block !== 'undefined') {
            this.transaction.data.status = Transaction.Status.Confirmed;
            this.transaction.data.blockhash = _result.block.hash;
            this.manager.addTransaction(this.transaction);
            this.emit('block', this.transaction);

            if (this.listeners('receipt').length) {
              client.getTransactionReceipt(this.transaction.data.hash).then(function (receipt) {
                _this3.emit('receipt', receipt);
              });
            }

            this.cancel();
            return;
          }
        } catch (e) {
          this.emit('error', e);
          this.cancel();
          return;
        }

        this.retryLoad();
      });

      function load() {
        return _load.apply(this, arguments);
      }

      return load;
    }()
  }, {
    key: "getReceipt",
    value: function () {
      var _getReceipt = _asyncToGenerator(function* () {
        var _this4 = this;

        return new Promise(function (resolve, reject) {
          _this4.once('receipt', resolve);

          _this4.once('error', reject);

          _this4.once('timeout', reject);
        });
      });

      function getReceipt() {
        return _getReceipt.apply(this, arguments);
      }

      return getReceipt;
    }()
  }, {
    key: "cancel",
    value: function cancel() {
      if (typeof this.timeoutId === 'undefined') return;
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
  }, {
    key: "hash",
    get: function get() {
      return this.transaction.hash;
    }
  }]);

  return TransactionTracker;
}(PausableTypedEventEmitter);

var AccountTransactionTracker =
/*#__PURE__*/
function (_PausableTypedEventEm2) {
  _inherits(AccountTransactionTracker, _PausableTypedEventEm2);

  function AccountTransactionTracker(manager, account) {
    var _this5;

    _classCallCheck(this, AccountTransactionTracker);

    _this5 = _possibleConstructorReturn(this, _getPrototypeOf(AccountTransactionTracker).call(this));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this5)), "manager", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this5)), "intervalId", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this5)), "account", void 0);

    _this5.manager = manager;
    _this5.account = account;
    return _this5;
  }

  _createClass(AccountTransactionTracker, [{
    key: "load",
    value: function () {
      var _load2 = _asyncToGenerator(function* () {
        var client = this.manager.wallet.getClient(this.account.data.spec.chainId);
        var lastSyncBlockno = this.account.data.lastSync ? this.account.data.lastSync.blockno + 1 : 0;

        var _ref = yield client.blockchain(),
            bestHeight = _ref.bestHeight;

        if (lastSyncBlockno >= bestHeight) return this.account; // console.log(`[track] sync from block ${lastSyncBlockno} .. ${bestHeight}`);

        var transactions = yield this.manager.fetchAccountTransactionsAfter(this.account, lastSyncBlockno, bestHeight);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = transactions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _tx = _step.value;
            this.emit('transaction', _tx);
            this.manager.addTransaction(_tx);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        if (transactions.length) {
          this.emit('transactions', transactions);
        }

        this.account.data.lastSync = {
          blockno: bestHeight,
          timestamp: +new Date()
        };
        return this.account;
      });

      function load() {
        return _load2.apply(this, arguments);
      }

      return load;
    }()
  }, {
    key: "resume",
    value: function resume() {
      var _this6 = this;

      this.load();
      this.intervalId = setInterval(function () {
        _this6.load();
      }, ACCOUNT_UPDATE_INTERVAL);
    }
  }, {
    key: "pause",
    value: function pause() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
    }
  }]);

  return AccountTransactionTracker;
}(PausableTypedEventEmitter);
/**
 * TransactionManager manages and tracks single transactions
 */


var TransactionManager =
/*#__PURE__*/
function (_PausableTypedEventEm3) {
  _inherits(TransactionManager, _PausableTypedEventEm3);

  function TransactionManager(wallet) {
    var _this7;

    _classCallCheck(this, TransactionManager);

    _this7 = _possibleConstructorReturn(this, _getPrototypeOf(TransactionManager).call(this));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this7)), "wallet", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this7)), "accountTxTrackers", new HashMap());

    _this7.wallet = wallet;
    return _this7;
  }

  _createClass(TransactionManager, [{
    key: "addTransaction",
    value: function () {
      var _addTransaction = _asyncToGenerator(function* (transaction) {
        if (this.wallet.datastore) {
          yield this.wallet.datastore.getIndex('transactions').put(transaction);
        }
      });

      function addTransaction(_x) {
        return _addTransaction.apply(this, arguments);
      }

      return addTransaction;
    }()
  }, {
    key: "trackTransaction",
    value: function () {
      var _trackTransaction = _asyncToGenerator(function* (transaction) {
        return new TransactionTracker(this, transaction);
      });

      function trackTransaction(_x2) {
        return _trackTransaction.apply(this, arguments);
      }

      return trackTransaction;
    }()
  }, {
    key: "resume",
    value: function resume() {
      if (!this.paused) return;
      this.paused = false;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.accountTxTrackers.values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var tracker = _step2.value;
          tracker.resume();
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }, {
    key: "pause",
    value: function pause() {
      if (this.paused) return;
      this.paused = true;
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.accountTxTrackers.values()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var tracker = _step3.value;
          tracker.pause();
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
    /**
     * Track transactions for account.
     * There is no default implementation for this. The only generally available
     * method would be to scan the entire blockchain which is highly inefficient.
     * If you want that, use your own full node and add the data source using
     * wallet.use(NodeTransactionScanner);
     * @param account 
     */

  }, {
    key: "trackAccount",
    value: function trackAccount(account) {
      this.resume();

      if (this.accountTxTrackers.has(account.data.spec)) {
        return this.accountTxTrackers.get(account.data.spec);
      }

      var tracker = new AccountTransactionTracker(this, account);
      tracker.resume();
      this.accountTxTrackers.set(account.data.spec, tracker);
      return tracker;
    }
  }, {
    key: "fetchAccountTransactions",
    value: function () {
      var _fetchAccountTransactions = _asyncToGenerator(function* (account) {
        return yield this.wallet.applyMiddlewares('fetchAccountTransactions')(function () {
          throw new Error('no data source for account transactions. Please configure a data source such as NodeTransactionScanner.');
        })(account);
      });

      function fetchAccountTransactions(_x3) {
        return _fetchAccountTransactions.apply(this, arguments);
      }

      return fetchAccountTransactions;
    }()
  }, {
    key: "fetchAccountTransactionsAfter",
    value: function () {
      var _fetchAccountTransactionsAfter = _asyncToGenerator(function* (account, blockno, limit) {
        return yield this.wallet.applyMiddlewares('fetchAccountTransactionsAfter')(function () {
          throw new Error('no data source for account transactions. Please configure a data source such as NodeTransactionScanner.');
        })({
          account: account,
          blockno: blockno,
          limit: limit
        });
      });

      function fetchAccountTransactionsAfter(_x4, _x5, _x6) {
        return _fetchAccountTransactionsAfter.apply(this, arguments);
      }

      return fetchAccountTransactionsAfter;
    }()
  }, {
    key: "fetchAccountTransactionsBefore",
    value: function () {
      var _fetchAccountTransactionsBefore = _asyncToGenerator(function* (account, blockno, limit) {
        return yield this.wallet.applyMiddlewares('fetchAccountTransactionsBefore')(function () {
          throw new Error('no data source for account transactions. Please configure a data source such as NodeTransactionScanner.');
        })({
          account: account,
          blockno: blockno,
          limit: limit
        });
      });

      function fetchAccountTransactionsBefore(_x7, _x8, _x9) {
        return _fetchAccountTransactionsBefore.apply(this, arguments);
      }

      return fetchAccountTransactionsBefore;
    }()
    /**
     * Returns transactions stored for an account
     * @param account 
     */

  }, {
    key: "getAccountTransactions",
    value: function () {
      var _getAccountTransactions = _asyncToGenerator(function* (accountOrSpec) {
        if (!this.wallet.datastore) throw new Error('configure storage before accessing transactions');
        var account;

        if (!accountOrSpec.data) {
          account = yield this.wallet.accountManager.getOrAddAccount(accountOrSpec);
        } else {
          account = accountOrSpec;
        }

        console.log('txManager.getAccountTransactions', account);
        var index = this.wallet.datastore.getIndex('transactions');
        var txsFrom = Array.from((yield index.getAll(account.address.toString(), 'from')));
        var txsTo = Array.from((yield index.getAll(account.address.toString(), 'to'))); // unique txs by hash

        var hashSet = new Set();
        var allTxs = txsFrom.concat(txsTo);
        var txs = allTxs.filter(function (o) {
          return hashSet.has(o.data.hash) ? false : !!hashSet.add(o.data.hash);
        });
        return txs;
      });

      function getAccountTransactions(_x10) {
        return _getAccountTransactions.apply(this, arguments);
      }

      return getAccountTransactions;
    }()
  }, {
    key: "sendTransaction",
    value: function () {
      var _sendTransaction = _asyncToGenerator(function* (transaction) {
        // implicit send, add, and track
        var client = this.wallet.getClient(transaction.data.chainId);
        var txhash = yield client.sendSignedTransaction(transaction.txBody);
        transaction.key = txhash;
        transaction.data.hash = txhash;
        this.addTransaction(transaction);
        return this.trackTransaction(transaction);
      });

      function sendTransaction(_x11) {
        return _sendTransaction.apply(this, arguments);
      }

      return sendTransaction;
    }()
  }]);

  return TransactionManager;
}(PausableTypedEventEmitter);

var DB_VERSION = 1;
var Wallet =
/*#__PURE__*/
function (_MiddlewareConsumer) {
  _inherits(Wallet, _MiddlewareConsumer);

  function Wallet(config) {
    var _this;

    _classCallCheck(this, Wallet);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Wallet).call(this));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "defaultChainId", DEFAULT_CHAIN);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "chainConfigs", new HashMap());

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "keyManager", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "transactionManager", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "accountManager", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "config", {
      appName: 'herajs-wallet',
      appVersion: 1,
      instanceId: ''
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "datastore", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "keystore", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "clients", new Map());

    _this.keyManager = new KeyManager(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.transactionManager = new TransactionManager(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.accountManager = new AccountManager(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.config = _objectSpread({}, _this.config, config);
    return _this;
  }

  _createClass(Wallet, [{
    key: "set",
    value: function set(configKey, value) {
      this.config[configKey] = value;
    }
    /**
     * Add a chain configuration.
     * Sets new chain as default if first to be added and default chain was unchanged.
     * @param chainConfig 
     */

  }, {
    key: "useChain",
    value: function useChain(chainConfig) {
      if (typeof chainConfig.provider === 'undefined') {
        chainConfig.provider = client.AergoClient.defaultProviderClass;
      }

      if (typeof chainConfig.provider === 'function' && typeof chainConfig.nodeUrl === 'undefined') {
        throw new Error('supply nodeUrl in chain config or instantiate provider manually');
      }

      this.chainConfigs.set(chainConfig.chainId, chainConfig);

      if (this.chainConfigs.size === 1 && this.defaultChainId === DEFAULT_CHAIN && chainConfig.chainId !== DEFAULT_CHAIN) {
        this.setDefaultChain(chainConfig.chainId);
      }
    }
    /**
     * Set the default chain for subsequent actions.
     * @param chainId 
     */

  }, {
    key: "setDefaultChain",
    value: function setDefaultChain(chainId) {
      if (!this.chainConfigs.has(chainId)) {
        throw new Error("configure chain ".concat(chainId, " using useChain() before setting it as default"));
      }

      this.defaultChainId = chainId;
    }
    /**
     * Get AergoClient for chainId.
     * If called the first time, create AergoClient instance.
     * @param chainId optional chainId, use default chainId when undefined
     */

  }, {
    key: "getClient",
    value: function getClient(chainId) {
      if (typeof chainId === 'undefined') {
        chainId = this.defaultChainId;
      }

      if (!this.chainConfigs.has(chainId)) {
        throw new Error("trying to use not configured chainId ".concat(chainId));
      }

      var chainConfig = this.chainConfigs.get(chainId);

      if (!this.clients.has(chainId)) {
        var _provider = chainConfig.provider;

        if (typeof _provider === 'function') {
          _provider = new _provider({
            url: chainConfig.nodeUrl
          });
        }

        var client$1 = new client.AergoClient({}, _provider);
        this.clients.set(chainId, client$1);
        return client$1;
      }

      return this.clients.get(chainId);
    }
    /**
     * Prepare a transaction from given account specified by simple TxBody.
     * @param account 
     * @param transaction 
     */

  }, {
    key: "prepareTransaction",
    value: function () {
      var _prepareTransaction = _asyncToGenerator(function* (account, transaction) {
        if (!account.data) account = yield this.accountManager.getOrAddAccount(account);
        var preparedTx = yield this.accountManager.prepareTransaction(account, transaction);
        var signedTx = yield this.keyManager.signTransaction(account, preparedTx);
        return signedTx;
      });

      function prepareTransaction(_x, _x2) {
        return _prepareTransaction.apply(this, arguments);
      }

      return prepareTransaction;
    }()
    /**
     * Send a transaction to the network using the specified account.
     * Prepares TxBody if not already prepared.
     * @param account 
     * @param transaction 
     */

  }, {
    key: "sendTransaction",
    value: function () {
      var _sendTransaction = _asyncToGenerator(function* (account, transaction) {
        var signedTransaction;

        if (transaction instanceof SignedTransaction) {
          signedTransaction = transaction;
        } else {
          signedTransaction = yield this.prepareTransaction(account, transaction);
        }

        return this.transactionManager.sendTransaction(signedTransaction);
      });

      function sendTransaction(_x3, _x4) {
        return _sendTransaction.apply(this, arguments);
      }

      return sendTransaction;
    }()
  }, {
    key: "useStorage",
    value: function useStorage(classOrInstance) {
      return Promise.all([this.useKeyStorage(classOrInstance), this.useDataStorage(classOrInstance)]);
    }
  }, {
    key: "useKeyStorage",
    value: function useKeyStorage(classOrInstance) {
      if (isConstructor(classOrInstance)) {
        this.keystore = new classOrInstance('keystore', DB_VERSION);
      } else {
        this.keystore = classOrInstance;
      }

      return this.keystore.open();
    }
  }, {
    key: "useDataStorage",
    value: function useDataStorage(classOrInstance) {
      if (isConstructor(classOrInstance)) {
        this.datastore = new classOrInstance('datastore', DB_VERSION);
      } else {
        this.datastore = classOrInstance;
      }

      return this.datastore.open();
    }
  }, {
    key: "close",
    value: function () {
      var _close = _asyncToGenerator(function* () {
        this.datastore && (yield this.datastore.close());
        this.keystore && (yield this.keystore.close());
      });

      function close() {
        return _close.apply(this, arguments);
      }

      return close;
    }()
  }, {
    key: "unlock",
    value: function () {
      var _unlock = _asyncToGenerator(function* (passphrase) {
        return this.keyManager.unlock(passphrase);
      });

      function unlock(_x5) {
        return _unlock.apply(this, arguments);
      }

      return unlock;
    }()
  }, {
    key: "setupAndUnlock",
    value: function () {
      var _setupAndUnlock = _asyncToGenerator(function* (passphrase) {
        return this.keyManager.setupAndUnlock("id-".concat(this.config.instanceId), passphrase);
      });

      function setupAndUnlock(_x6) {
        return _setupAndUnlock.apply(this, arguments);
      }

      return setupAndUnlock;
    }()
  }, {
    key: "lock",
    value: function lock() {
      this.keyManager.lock();
    }
  }, {
    key: "unlocked",
    get: function get() {
      return this.keyManager.unlocked;
    }
  }]);

  return Wallet;
}(MiddlewareConsumer);
/*

wallet.accountManager -> tracks balances and nonces
wallet.transactionManager -> tracks txs
wallet.keyManager -> signs/verifies, keeps keys


const key = await this.keystore.get(account);
//tx.hash -> getter that calculates hash when necessary
//tx.unsignedHash
const signedTx = key.signTransaction(tx);

this.keystore.put(account);

this.datastore.transactions.get(hash)
this.datastore.transactions.put(tx);
this.datastore.transactions.filterIndex(['from', 'to'], address)

wallet.transactionManager.trackAccount(account)
-> Error: no data source for account transactions. Please configure a data source such as AergoNodeSource.

// maybe add this inefficient data source?
wallet.use(new AergoNodeSource(chainId => wallet.getClient(chainId)));
wallet.transactionManager.trackAccount(account)
-> tracking transactions for account by reading blockchain. inefficient.

wallet.use(new AergoscanIndexSource((chainId) => `https://api.aergoscan.io/${chainId}`));
wallet.transactionManager.trackAccount(account)
-> tracking transactions for account by reading API. more efficient

*/

/**
 * This is a data source for transactionManager.getAccountTransactions.
 * It is a very inefficient way, but the only one generally available.
 * Please only use with local fullnodes as this can consume considerable bandwidth.
 * What it does is go backwards in time to scan the whole blockchain until it finds the
 * all transactions of an account. This uses the account's nonce to be smart about that:
 * When we reached nonce 1 and balance 0, we assume to have all txs.
 */
var NodeTransactionScanner =
/*#__PURE__*/
function (_Middleware) {
  _inherits(NodeTransactionScanner, _Middleware);

  function NodeTransactionScanner() {
    _classCallCheck(this, NodeTransactionScanner);

    return _possibleConstructorReturn(this, _getPrototypeOf(NodeTransactionScanner).apply(this, arguments));
  }

  _createClass(NodeTransactionScanner, [{
    key: "fetchAccountTransactionsBefore",
    value: function fetchAccountTransactionsBefore(wallet) {
      return function () {
        return (
          /*#__PURE__*/
          function () {
            var _ref2 = _asyncToGenerator(function* (_ref) {
              var account = _ref.account,
                  blockno = _ref.blockno,
                  limit = _ref.limit;
              var accountSpec = wallet.accountManager.getCompleteAccountSpec(account.data.spec);
              var client$1 = wallet.getClient(accountSpec.chainId);
              var address = new client.Address(accountSpec.address);

              var _ref3 = yield client$1.getState(address),
                  nonce = _ref3.nonce,
                  balance = _ref3.balance; // Check for unused account
              // Note: on dev chain, balance can be non-0, so this check always fails


              if (nonce === 0 && balance.compare(0) === 0) {
                return [];
              }

              if (!limit) {
                limit = 0;
              }

              var blockNumber = blockno;
              var results = []; // Traverse back blockchain until reaching block 0 or nonce 0 and balance 0
              // Note: on dev chain, final balance can be less than 0

              while (blockNumber > limit && (nonce > 1 || balance.compare(0) > 0)) {
                var block = yield client$1.getBlock(blockNumber--);
                if (!block.body || !block.body.txsList.length) continue; //console.log(`[scan] block ${blockNumber}`);

                var ownTxs = block.body.txsList.filter(function (tx) {
                  return address.equal(tx.from) || address.equal(tx.to);
                });
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                  for (var _iterator = ownTxs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var tx = _step.value;
                    var txObj = SignedTransaction.fromTxBody(tx, accountSpec.chainId);
                    txObj.data.blockhash = block.hash;
                    txObj.data.blockno = block.header ? block.header.blockno : null;
                    results.push(txObj);

                    if (address.equal(tx.from)) {
                      balance = balance.add(tx.amount);
                      nonce = tx.nonce;
                    } else {
                      balance = balance.sub(tx.amount);
                    }
                  } //if (ownTxs.length) console.log(`[scan] new state ${nonce}, ${balance}`);

                } catch (err) {
                  _didIteratorError = true;
                  _iteratorError = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                      _iterator.return();
                    }
                  } finally {
                    if (_didIteratorError) {
                      throw _iteratorError;
                    }
                  }
                }
              }

              return results;
            });

            return function (_x) {
              return _ref2.apply(this, arguments);
            };
          }()
        );
      };
    }
  }, {
    key: "fetchAccountTransactionsAfter",
    value: function fetchAccountTransactionsAfter(wallet) {
      return function () {
        return (
          /*#__PURE__*/
          function () {
            var _ref5 = _asyncToGenerator(function* (_ref4) {
              var account = _ref4.account,
                  blockno = _ref4.blockno,
                  limit = _ref4.limit;
              var accountSpec = wallet.accountManager.getCompleteAccountSpec(account.data.spec);
              var client$1 = wallet.getClient(accountSpec.chainId);

              if (!limit) {
                var _ref6 = yield client$1.blockchain(),
                    bestHeight = _ref6.bestHeight;

                limit = bestHeight;
              }

              var maxBlockNo = limit;
              var address = new client.Address(accountSpec.address);

              var _ref7 = yield client$1.getState(address),
                  nonce = _ref7.nonce,
                  balance = _ref7.balance; // Check for unused account
              // Note: on dev chain, balance can be non-0, so this check always fails


              if (nonce === 0 && balance.compare(0) === 0) {
                return [];
              }

              var blockNumber = blockno;
              var results = []; // Traverse forward blockchain until reaching current block

              while (blockNumber <= maxBlockNo) {
                var block = yield client$1.getBlock(blockNumber++);
                if (!block.body || !block.body.txsList.length) continue; //console.log(`[scan] block ${blockNumber}`);

                var ownTxs = block.body.txsList.filter(function (tx) {
                  return address.equal(tx.from) || address.equal(tx.to);
                });
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                  for (var _iterator2 = ownTxs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var tx = _step2.value;
                    var txObj = SignedTransaction.fromTxBody(tx, accountSpec.chainId);
                    txObj.data.blockhash = block.hash;
                    txObj.data.blockno = block.header ? block.header.blockno : null;
                    results.push(txObj);
                  }
                } catch (err) {
                  _didIteratorError2 = true;
                  _iteratorError2 = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                      _iterator2.return();
                    }
                  } finally {
                    if (_didIteratorError2) {
                      throw _iteratorError2;
                    }
                  }
                }
              }

              return results;
            });

            return function (_x2) {
              return _ref5.apply(this, arguments);
            };
          }()
        );
      };
    }
  }, {
    key: "fetchAccountTransactions",
    value: function fetchAccountTransactions(wallet) {
      var _this = this;

      return function () {
        return (
          /*#__PURE__*/
          function () {
            var _ref8 = _asyncToGenerator(function* (account) {
              var accountSpec = wallet.accountManager.getCompleteAccountSpec(account.data.spec);

              var _ref9 = yield wallet.getClient(accountSpec.chainId).blockchain(),
                  bestHeight = _ref9.bestHeight;

              return _this.fetchAccountTransactionsBefore(wallet)(
              /*#__PURE__*/
              _asyncToGenerator(function* () {
                return [];
              }))({
                account: account,
                blockno: bestHeight
              });
            });

            return function (_x3) {
              return _ref8.apply(this, arguments);
            };
          }()
        );
      };
    }
  }]);

  return NodeTransactionScanner;
}(Middleware);

var Index = function Index() {
  _classCallCheck(this, Index);
};
var Storage = function Storage() {
  _classCallCheck(this, Storage);
};

var IDBIndex =
/*#__PURE__*/
function (_Index) {
  _inherits(IDBIndex, _Index);

  function IDBIndex(storage, name) {
    var _this;

    _classCallCheck(this, IDBIndex);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(IDBIndex).call(this));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "storage", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "name", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "db", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "keyPath", 'key');

    _this.storage = storage;
    _this.name = name;

    if (typeof storage.db === 'undefined') {
      throw new Error('open storage before accessing index');
    }

    _this.db = storage.db;
    return _this;
  }

  _createClass(IDBIndex, [{
    key: "get",
    value: function () {
      var _get = _asyncToGenerator(function* (key) {
        var record = yield this.db.transaction(this.name).objectStore(this.name).get(key);
        if (!record) throw new Error('not found');
        return record;
      });

      function get(_x) {
        return _get.apply(this, arguments);
      }

      return get;
    }()
  }, {
    key: "getAll",
    value: function () {
      var _getAll = _asyncToGenerator(function* (indexValue, indexName) {
        var q = typeof indexValue !== 'undefined' ? IDBKeyRange.only(indexValue) : undefined;

        if (this.name === 'transactions' && typeof indexName !== 'undefined') {
          indexName = indexName;

          if (['from', 'to'].indexOf(indexName) !== -1) {
            // @ts-ignore: not sure why this does not type-check
            var _records = yield this.db.transaction(this.name).objectStore(this.name).index(indexName).getAll(q);

            return _records[Symbol.iterator]();
          }
        }

        var records = yield this.db.transaction(this.name).objectStore(this.name).getAll(q);
        return records[Symbol.iterator]();
      });

      function getAll(_x2, _x3) {
        return _getAll.apply(this, arguments);
      }

      return getAll;
    }()
  }, {
    key: "put",
    value: function () {
      var _put = _asyncToGenerator(function* (record) {
        var tx = this.db.transaction(this.name, 'readwrite');
        var validKey = yield tx.objectStore(this.name).put(record);
        return validKey.toString();
      });

      function put(_x4) {
        return _put.apply(this, arguments);
      }

      return put;
    }()
  }, {
    key: "delete",
    value: function _delete(key) {
      return this.db.transaction(this.name, 'readwrite').objectStore(this.name).delete(key);
    }
  }, {
    key: "clear",
    value: function clear() {
      return this.db.transaction(this.name, 'readwrite').objectStore(this.name).clear();
    }
  }]);

  return IDBIndex;
}(Index);

var IndexedDbStorage =
/*#__PURE__*/
function (_Storage) {
  _inherits(IndexedDbStorage, _Storage);

  function IndexedDbStorage(name, version) {
    var _this2;

    _classCallCheck(this, IndexedDbStorage);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(IndexedDbStorage).call(this));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this2)), "name", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this2)), "version", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this2)), "db", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this2)), "indices", new Map());

    _this2.name = name;
    _this2.version = version;
    return _this2;
  }

  _createClass(IndexedDbStorage, [{
    key: "open",
    value: function () {
      var _open = _asyncToGenerator(function* () {
        if (typeof this.db !== 'undefined') return this;

        function upgrade(db, oldVersion) {
          switch (oldVersion) {
            case 0:
              {
                var txOS = db.createObjectStore('transactions', {
                  keyPath: 'key'
                });
                txOS.createIndex('from', 'data.from', {
                  unique: false
                });
                txOS.createIndex('to', 'data.to', {
                  unique: false
                });
                db.createObjectStore('accounts', {
                  keyPath: 'key'
                });
                db.createObjectStore('settings', {
                  keyPath: 'key'
                });
                db.createObjectStore('keys', {
                  keyPath: 'key'
                });
              }
          }
        }

        this.db = yield idb.openDB(this.name, this.version, {
          upgrade: upgrade
        });
        return this;
      });

      function open() {
        return _open.apply(this, arguments);
      }

      return open;
    }()
  }, {
    key: "close",
    value: function () {
      var _close = _asyncToGenerator(function* () {
        return;
      });

      function close() {
        return _close.apply(this, arguments);
      }

      return close;
    }()
  }, {
    key: "getIndex",
    value: function getIndex(name) {
      if (this.indices.has(name)) {
        return this.indices.get(name);
      }

      var index = new IDBIndex(this, name);
      this.indices.set(name, index);
      return index;
    }
  }]);

  return IndexedDbStorage;
}(Storage);

var MemoryIndex =
/*#__PURE__*/
function (_Index) {
  _inherits(MemoryIndex, _Index);

  function MemoryIndex(storage, name) {
    var _this;

    _classCallCheck(this, MemoryIndex);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MemoryIndex).call(this));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "storage", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "name", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "data", new Map());

    _this.storage = storage;
    _this.name = name;
    return _this;
  }

  _createClass(MemoryIndex, [{
    key: "get",
    value: function () {
      var _get = _asyncToGenerator(function* (key) {
        var record = this.data.get(key);
        if (!record) throw new Error('not found');
        return record;
      });

      function get(_x) {
        return _get.apply(this, arguments);
      }

      return get;
    }()
  }, {
    key: "getAll",
    value: function () {
      var _getAll = _asyncToGenerator(function* (indexValue, indexName) {
        if (indexName && indexValue) {
          return Array.from(this.data.values()).reverse().filter(function (record) {
            return record.data[indexName] === indexValue;
          })[Symbol.iterator]();
        }

        return this.data.values();
      });

      function getAll(_x2, _x3) {
        return _getAll.apply(this, arguments);
      }

      return getAll;
    }()
  }, {
    key: "put",
    value: function () {
      var _put = _asyncToGenerator(function* (data) {
        this.data.set(data.key, data);
        return data.key;
      });

      function put(_x4) {
        return _put.apply(this, arguments);
      }

      return put;
    }()
  }, {
    key: "delete",
    value: function () {
      var _delete2 = _asyncToGenerator(function* (key) {
        this.data.delete(key);
      });

      function _delete(_x5) {
        return _delete2.apply(this, arguments);
      }

      return _delete;
    }()
  }, {
    key: "clear",
    value: function () {
      var _clear = _asyncToGenerator(function* () {
        this.data.clear();
      });

      function clear() {
        return _clear.apply(this, arguments);
      }

      return clear;
    }()
  }]);

  return MemoryIndex;
}(Index);

var MemoryStorage =
/*#__PURE__*/
function (_Storage) {
  _inherits(MemoryStorage, _Storage);

  function MemoryStorage(name, version) {
    var _this2;

    _classCallCheck(this, MemoryStorage);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(MemoryStorage).call(this));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this2)), "name", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this2)), "version", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this2)), "indices", new Map());

    _this2.name = name;
    _this2.version = version;
    return _this2;
  }

  _createClass(MemoryStorage, [{
    key: "open",
    value: function () {
      var _open = _asyncToGenerator(function* () {
        return this;
      });

      function open() {
        return _open.apply(this, arguments);
      }

      return open;
    }()
  }, {
    key: "close",
    value: function () {
      var _close = _asyncToGenerator(function* () {
        return;
      });

      function close() {
        return _close.apply(this, arguments);
      }

      return close;
    }()
  }, {
    key: "getIndex",
    value: function getIndex(name) {
      if (this.indices.has(name)) {
        return this.indices.get(name);
      }

      var index = new MemoryIndex(this, name);
      this.indices.set(name, index);
      return index;
    }
  }]);

  return MemoryStorage;
}(Storage);

exports.Account = Account;
exports.IndexedDbStorage = IndexedDbStorage;
exports.Key = Key;
exports.MemoryStorage = MemoryStorage;
exports.NodeTransactionScanner = NodeTransactionScanner;
exports.Transaction = Transaction;
exports.Wallet = Wallet;
