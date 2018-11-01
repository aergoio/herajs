/*!
 * herajs v0.1.1
 * (c) 2018 AERGO
 * Released under MIT license.
 */
import jspb from 'google-protobuf';
import bs58 from 'bs58';
import bs58check from 'bs58check';
import grpc from 'grpc';

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var runtime = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!(function(global) {

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = module.exports;

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() {
    return this || (typeof self === "object" && self);
  })() || Function("return this")()
);
});

var global$1 = (typeof global !== "undefined" ? global :
            typeof self !== "undefined" ? self :
            typeof window !== "undefined" ? window : {});

var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
var inited = false;
function init () {
  inited = true;
  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
  }

  revLookup['-'.charCodeAt(0)] = 62;
  revLookup['_'.charCodeAt(0)] = 63;
}

function toByteArray (b64) {
  if (!inited) {
    init();
  }
  var i, j, l, tmp, placeHolders, arr;
  var len = b64.length;

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;

  // base64 is 4/3 + up to two characters of the original data
  arr = new Arr(len * 3 / 4 - placeHolders);

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len;

  var L = 0;

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)];
    arr[L++] = (tmp >> 16) & 0xFF;
    arr[L++] = (tmp >> 8) & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4);
    arr[L++] = tmp & 0xFF;
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2);
    arr[L++] = (tmp >> 8) & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp;
  var output = [];
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
    output.push(tripletToBase64(tmp));
  }
  return output.join('')
}

function fromByteArray (uint8) {
  if (!inited) {
    init();
  }
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
  var output = '';
  var parts = [];
  var maxChunkLength = 16383; // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    output += lookup[tmp >> 2];
    output += lookup[(tmp << 4) & 0x3F];
    output += '==';
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1]);
    output += lookup[tmp >> 10];
    output += lookup[(tmp >> 4) & 0x3F];
    output += lookup[(tmp << 2) & 0x3F];
    output += '=';
  }

  parts.push(output);

  return parts.join('')
}

function read (buffer, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? (nBytes - 1) : 0;
  var d = isLE ? -1 : 1;
  var s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

function write (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0);
  var i = isLE ? 0 : (nBytes - 1);
  var d = isLE ? 1 : -1;
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128;
}

var toString = {}.toString;

var isArray = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

var INSPECT_MAX_BYTES = 50;

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global$1.TYPED_ARRAY_SUPPORT !== undefined
  ? global$1.TYPED_ARRAY_SUPPORT
  : true;

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length);
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length);
    }
    that.length = length;
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192; // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype;
  return arr
};

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
};

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype;
  Buffer.__proto__ = Uint8Array;
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size);
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
};

function allocUnsafe (that, size) {
  assertSize(size);
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0;
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
};
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
};

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8';
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0;
  that = createBuffer(that, length);

  var actual = that.write(string, encoding);

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual);
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0;
  that = createBuffer(that, length);
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255;
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength; // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array);
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset);
  } else {
    array = new Uint8Array(array, byteOffset, length);
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array;
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array);
  }
  return that
}

function fromObject (that, obj) {
  if (internalIsBuffer(obj)) {
    var len = checked(obj.length) | 0;
    that = createBuffer(that, len);

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len);
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}
Buffer.isBuffer = isBuffer;
function internalIsBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!internalIsBuffer(a) || !internalIsBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
};

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
};

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i;
  if (length === undefined) {
    length = 0;
    for (i = 0; i < list.length; ++i) {
      length += list[i].length;
    }
  }

  var buffer = Buffer.allocUnsafe(length);
  var pos = 0;
  for (i = 0; i < list.length; ++i) {
    var buf = list[i];
    if (!internalIsBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos);
    pos += buf.length;
  }
  return buffer
};

function byteLength (string, encoding) {
  if (internalIsBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string;
  }

  var len = string.length;
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
}
Buffer.byteLength = byteLength;

function slowToString (encoding, start, end) {
  var loweredCase = false;

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0;
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length;
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0;
  start >>>= 0;

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8';

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase();
        loweredCase = true;
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true;

function swap (b, n, m) {
  var i = b[n];
  b[n] = b[m];
  b[m] = i;
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length;
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1);
  }
  return this
};

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length;
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3);
    swap(this, i + 1, i + 2);
  }
  return this
};

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length;
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7);
    swap(this, i + 1, i + 6);
    swap(this, i + 2, i + 5);
    swap(this, i + 3, i + 4);
  }
  return this
};

Buffer.prototype.toString = function toString () {
  var length = this.length | 0;
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
};

Buffer.prototype.equals = function equals (b) {
  if (!internalIsBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
};

Buffer.prototype.inspect = function inspect () {
  var str = '';
  var max = INSPECT_MAX_BYTES;
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
    if (this.length > max) str += ' ... ';
  }
  return '<Buffer ' + str + '>'
};

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!internalIsBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0;
  }
  if (end === undefined) {
    end = target ? target.length : 0;
  }
  if (thisStart === undefined) {
    thisStart = 0;
  }
  if (thisEnd === undefined) {
    thisEnd = this.length;
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0;
  end >>>= 0;
  thisStart >>>= 0;
  thisEnd >>>= 0;

  if (this === target) return 0

  var x = thisEnd - thisStart;
  var y = end - start;
  var len = Math.min(x, y);

  var thisCopy = this.slice(thisStart, thisEnd);
  var targetCopy = target.slice(start, end);

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i];
      y = targetCopy[i];
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
};

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset;
    byteOffset = 0;
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff;
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000;
  }
  byteOffset = +byteOffset;  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1);
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1;
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0;
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding);
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (internalIsBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF; // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1;
  var arrLength = arr.length;
  var valLength = val.length;

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase();
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2;
      arrLength /= 2;
      valLength /= 2;
      byteOffset /= 2;
    }
  }

  function read$$1 (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i;
  if (dir) {
    var foundIndex = -1;
    for (i = byteOffset; i < arrLength; i++) {
      if (read$$1(arr, i) === read$$1(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i;
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex;
        foundIndex = -1;
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
    for (i = byteOffset; i >= 0; i--) {
      var found = true;
      for (var j = 0; j < valLength; j++) {
        if (read$$1(arr, i + j) !== read$$1(val, j)) {
          found = false;
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
};

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
};

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
};

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0;
  var remaining = buf.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = Number(length);
    if (length > remaining) {
      length = remaining;
    }
  }

  // must be an even number of digits
  var strLen = string.length;
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed;
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write$$1 (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8';
    length = this.length;
    offset = 0;
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset;
    length = this.length;
    offset = 0;
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0;
    if (isFinite(length)) {
      length = length | 0;
      if (encoding === undefined) encoding = 'utf8';
    } else {
      encoding = length;
      length = undefined;
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset;
  if (length === undefined || length > remaining) length = remaining;

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8';

  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
};

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
};

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return fromByteArray(buf)
  } else {
    return fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end);
  var res = [];

  var i = start;
  while (i < end) {
    var firstByte = buf[i];
    var codePoint = null;
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1;

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint;

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte;
          }
          break
        case 2:
          secondByte = buf[i + 1];
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F);
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint;
            }
          }
          break
        case 3:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F);
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint;
            }
          }
          break
        case 4:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          fourthByte = buf[i + 3];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F);
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint;
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD;
      bytesPerSequence = 1;
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000;
      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
      codePoint = 0xDC00 | codePoint & 0x3FF;
    }

    res.push(codePoint);
    i += bytesPerSequence;
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000;

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length;
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = '';
  var i = 0;
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    );
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F);
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i]);
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length;

  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;

  var out = '';
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i]);
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end);
  var res = '';
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length;
  start = ~~start;
  end = end === undefined ? len : ~~end;

  if (start < 0) {
    start += len;
    if (start < 0) start = 0;
  } else if (start > len) {
    start = len;
  }

  if (end < 0) {
    end += len;
    if (end < 0) end = 0;
  } else if (end > len) {
    end = len;
  }

  if (end < start) end = start;

  var newBuf;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end);
    newBuf.__proto__ = Buffer.prototype;
  } else {
    var sliceLen = end - start;
    newBuf = new Buffer(sliceLen, undefined);
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start];
    }
  }

  return newBuf
};

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }

  return val
};

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length);
  }

  var val = this[offset + --byteLength];
  var mul = 1;
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul;
  }

  return val
};

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  return this[offset]
};

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] | (this[offset + 1] << 8)
};

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return (this[offset] << 8) | this[offset + 1]
};

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
};

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
};

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val
};

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var i = byteLength;
  var mul = 1;
  var val = this[offset + --i];
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val
};

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
};

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset] | (this[offset + 1] << 8);
  return (val & 0x8000) ? val | 0xFFFF0000 : val
};

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset + 1] | (this[offset] << 8);
  return (val & 0x8000) ? val | 0xFFFF0000 : val
};

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
};

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
};

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return read(this, offset, true, 23, 4)
};

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return read(this, offset, false, 23, 4)
};

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return read(this, offset, true, 52, 8)
};

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return read(this, offset, false, 52, 8)
};

function checkInt (buf, value, offset, ext, max, min) {
  if (!internalIsBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var mul = 1;
  var i = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var i = byteLength - 1;
  var mul = 1;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  this[offset] = (value & 0xff);
  return offset + 1
};

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8;
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2
};

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8);
    this[offset + 1] = (value & 0xff);
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2
};

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff;
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24);
    this[offset + 2] = (value >>> 16);
    this[offset + 1] = (value >>> 8);
    this[offset] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4
};

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24);
    this[offset + 1] = (value >>> 16);
    this[offset + 2] = (value >>> 8);
    this[offset + 3] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4
};

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = 0;
  var mul = 1;
  var sub = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = byteLength - 1;
  var mul = 1;
  var sub = 0;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  if (value < 0) value = 0xff + value + 1;
  this[offset] = (value & 0xff);
  return offset + 1
};

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2
};

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8);
    this[offset + 1] = (value & 0xff);
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2
};

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
    this[offset + 2] = (value >>> 16);
    this[offset + 3] = (value >>> 24);
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4
};

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (value < 0) value = 0xffffffff + value + 1;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24);
    this[offset + 1] = (value >>> 16);
    this[offset + 2] = (value >>> 8);
    this[offset + 3] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4
};

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38);
  }
  write(buf, value, offset, littleEndian, 23, 4);
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
};

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
};

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308);
  }
  write(buf, value, offset, littleEndian, 52, 8);
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
};

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
};

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0;
  if (!end && end !== 0) end = this.length;
  if (targetStart >= target.length) targetStart = target.length;
  if (!targetStart) targetStart = 0;
  if (end > 0 && end < start) end = start;

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length;
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start;
  }

  var len = end - start;
  var i;

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start];
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start];
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    );
  }

  return len
};

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start;
      start = 0;
      end = this.length;
    } else if (typeof end === 'string') {
      encoding = end;
      end = this.length;
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0);
      if (code < 256) {
        val = code;
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255;
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0;
  end = end === undefined ? this.length : end >>> 0;

  if (!val) val = 0;

  var i;
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val;
    }
  } else {
    var bytes = internalIsBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString());
    var len = bytes.length;
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len];
    }
  }

  return this
};

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '');
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '=';
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity;
  var codePoint;
  var length = string.length;
  var leadSurrogate = null;
  var bytes = [];

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i);

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue
        }

        // valid lead
        leadSurrogate = codePoint;

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
        leadSurrogate = codePoint;
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
    }

    leadSurrogate = null;

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint);
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      );
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      );
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      );
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF);
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo;
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i);
    hi = c >> 8;
    lo = c % 256;
    byteArray.push(lo);
    byteArray.push(hi);
  }

  return byteArray
}


function base64ToBytes (str) {
  return toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i];
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}


// the following is from is-buffer, also by Feross Aboukhadijeh and with same lisence
// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
function isBuffer(obj) {
  return obj != null && (!!obj._isBuffer || isFastBuffer(obj) || isSlowBuffer(obj))
}

function isFastBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isFastBuffer(obj.slice(0, 0))
}

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

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

var blockchain_pb = createCommonjsModule(function (module, exports) {
  /**
   * @fileoverview
   * @enhanceable
   * @suppress {messageConventions} JS Compiler reports an error if a variable or
   *     field starts with 'MSG_' and isn't a translatable message.
   * @public
   */
  // GENERATED CODE -- DO NOT EDIT!
  var goog = jspb;
  var global = Function('return this')();
  goog.exportSymbol('proto.types.ABI', null, global);
  goog.exportSymbol('proto.types.Block', null, global);
  goog.exportSymbol('proto.types.BlockBody', null, global);
  goog.exportSymbol('proto.types.BlockHeader', null, global);
  goog.exportSymbol('proto.types.FnArgument', null, global);
  goog.exportSymbol('proto.types.Function', null, global);
  goog.exportSymbol('proto.types.Query', null, global);
  goog.exportSymbol('proto.types.Receipt', null, global);
  goog.exportSymbol('proto.types.State', null, global);
  goog.exportSymbol('proto.types.StateProof', null, global);
  goog.exportSymbol('proto.types.Tx', null, global);
  goog.exportSymbol('proto.types.TxBody', null, global);
  goog.exportSymbol('proto.types.TxIdx', null, global);
  goog.exportSymbol('proto.types.TxInBlock', null, global);
  goog.exportSymbol('proto.types.TxList', null, global);
  goog.exportSymbol('proto.types.TxType', null, global);
  goog.exportSymbol('proto.types.Vote', null, global);
  goog.exportSymbol('proto.types.VoteList', null, global);
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */

  proto.types.Block = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
  };

  goog.inherits(proto.types.Block, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.Block.displayName = 'proto.types.Block';
  }

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.Block.prototype.toObject = function (opt_includeInstance) {
      return proto.types.Block.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.Block} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.Block.toObject = function (includeInstance, msg) {
      var f,
          obj = {
        hash: msg.getHash_asB64(),
        header: (f = msg.getHeader()) && proto.types.BlockHeader.toObject(includeInstance, f),
        body: (f = msg.getBody()) && proto.types.BlockBody.toObject(includeInstance, f)
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.Block}
   */


  proto.types.Block.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.Block();
    return proto.types.Block.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.Block} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.Block}
   */


  proto.types.Block.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setHash(value);
          break;

        case 2:
          var value = new proto.types.BlockHeader();
          reader.readMessage(value, proto.types.BlockHeader.deserializeBinaryFromReader);
          msg.setHeader(value);
          break;

        case 3:
          var value = new proto.types.BlockBody();
          reader.readMessage(value, proto.types.BlockBody.deserializeBinaryFromReader);
          msg.setBody(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.Block.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.Block.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.Block} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.Block.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getHash_asU8();

    if (f.length > 0) {
      writer.writeBytes(1, f);
    }

    f = message.getHeader();

    if (f != null) {
      writer.writeMessage(2, f, proto.types.BlockHeader.serializeBinaryToWriter);
    }

    f = message.getBody();

    if (f != null) {
      writer.writeMessage(3, f, proto.types.BlockBody.serializeBinaryToWriter);
    }
  };
  /**
   * optional bytes hash = 1;
   * @return {!(string|Uint8Array)}
   */


  proto.types.Block.prototype.getHash = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 1, "")
    );
  };
  /**
   * optional bytes hash = 1;
   * This is a type-conversion wrapper around `getHash()`
   * @return {string}
   */


  proto.types.Block.prototype.getHash_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getHash())
    );
  };
  /**
   * optional bytes hash = 1;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getHash()`
   * @return {!Uint8Array}
   */


  proto.types.Block.prototype.getHash_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getHash())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.Block.prototype.setHash = function (value) {
    jspb.Message.setField(this, 1, value);
  };
  /**
   * optional BlockHeader header = 2;
   * @return {?proto.types.BlockHeader}
   */


  proto.types.Block.prototype.getHeader = function () {
    return (
      /** @type{?proto.types.BlockHeader} */
      jspb.Message.getWrapperField(this, proto.types.BlockHeader, 2)
    );
  };
  /** @param {?proto.types.BlockHeader|undefined} value */


  proto.types.Block.prototype.setHeader = function (value) {
    jspb.Message.setWrapperField(this, 2, value);
  };

  proto.types.Block.prototype.clearHeader = function () {
    this.setHeader(undefined);
  };
  /**
   * Returns whether this field is set.
   * @return {!boolean}
   */


  proto.types.Block.prototype.hasHeader = function () {
    return jspb.Message.getField(this, 2) != null;
  };
  /**
   * optional BlockBody body = 3;
   * @return {?proto.types.BlockBody}
   */


  proto.types.Block.prototype.getBody = function () {
    return (
      /** @type{?proto.types.BlockBody} */
      jspb.Message.getWrapperField(this, proto.types.BlockBody, 3)
    );
  };
  /** @param {?proto.types.BlockBody|undefined} value */


  proto.types.Block.prototype.setBody = function (value) {
    jspb.Message.setWrapperField(this, 3, value);
  };

  proto.types.Block.prototype.clearBody = function () {
    this.setBody(undefined);
  };
  /**
   * Returns whether this field is set.
   * @return {!boolean}
   */


  proto.types.Block.prototype.hasBody = function () {
    return jspb.Message.getField(this, 3) != null;
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.BlockHeader = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
  };

  goog.inherits(proto.types.BlockHeader, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.BlockHeader.displayName = 'proto.types.BlockHeader';
  }

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.BlockHeader.prototype.toObject = function (opt_includeInstance) {
      return proto.types.BlockHeader.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.BlockHeader} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.BlockHeader.toObject = function (includeInstance, msg) {
      var obj = {
        prevblockhash: msg.getPrevblockhash_asB64(),
        blockno: jspb.Message.getFieldWithDefault(msg, 2, 0),
        timestamp: jspb.Message.getFieldWithDefault(msg, 3, 0),
        blocksroothash: msg.getBlocksroothash_asB64(),
        txsroothash: msg.getTxsroothash_asB64(),
        receiptsroothash: msg.getReceiptsroothash_asB64(),
        confirms: jspb.Message.getFieldWithDefault(msg, 7, 0),
        pubkey: msg.getPubkey_asB64(),
        sign: msg.getSign_asB64(),
        coinbaseaccount: msg.getCoinbaseaccount_asB64()
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.BlockHeader}
   */


  proto.types.BlockHeader.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.BlockHeader();
    return proto.types.BlockHeader.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.BlockHeader} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.BlockHeader}
   */


  proto.types.BlockHeader.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setPrevblockhash(value);
          break;

        case 2:
          var value =
          /** @type {number} */
          reader.readUint64();
          msg.setBlockno(value);
          break;

        case 3:
          var value =
          /** @type {number} */
          reader.readInt64();
          msg.setTimestamp(value);
          break;

        case 4:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setBlocksroothash(value);
          break;

        case 5:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setTxsroothash(value);
          break;

        case 6:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setReceiptsroothash(value);
          break;

        case 7:
          var value =
          /** @type {number} */
          reader.readUint64();
          msg.setConfirms(value);
          break;

        case 8:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setPubkey(value);
          break;

        case 9:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setSign(value);
          break;

        case 10:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setCoinbaseaccount(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.BlockHeader.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.BlockHeader.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.BlockHeader} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.BlockHeader.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getPrevblockhash_asU8();

    if (f.length > 0) {
      writer.writeBytes(1, f);
    }

    f = message.getBlockno();

    if (f !== 0) {
      writer.writeUint64(2, f);
    }

    f = message.getTimestamp();

    if (f !== 0) {
      writer.writeInt64(3, f);
    }

    f = message.getBlocksroothash_asU8();

    if (f.length > 0) {
      writer.writeBytes(4, f);
    }

    f = message.getTxsroothash_asU8();

    if (f.length > 0) {
      writer.writeBytes(5, f);
    }

    f = message.getReceiptsroothash_asU8();

    if (f.length > 0) {
      writer.writeBytes(6, f);
    }

    f = message.getConfirms();

    if (f !== 0) {
      writer.writeUint64(7, f);
    }

    f = message.getPubkey_asU8();

    if (f.length > 0) {
      writer.writeBytes(8, f);
    }

    f = message.getSign_asU8();

    if (f.length > 0) {
      writer.writeBytes(9, f);
    }

    f = message.getCoinbaseaccount_asU8();

    if (f.length > 0) {
      writer.writeBytes(10, f);
    }
  };
  /**
   * optional bytes prevBlockHash = 1;
   * @return {!(string|Uint8Array)}
   */


  proto.types.BlockHeader.prototype.getPrevblockhash = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 1, "")
    );
  };
  /**
   * optional bytes prevBlockHash = 1;
   * This is a type-conversion wrapper around `getPrevblockhash()`
   * @return {string}
   */


  proto.types.BlockHeader.prototype.getPrevblockhash_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getPrevblockhash())
    );
  };
  /**
   * optional bytes prevBlockHash = 1;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getPrevblockhash()`
   * @return {!Uint8Array}
   */


  proto.types.BlockHeader.prototype.getPrevblockhash_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getPrevblockhash())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.BlockHeader.prototype.setPrevblockhash = function (value) {
    jspb.Message.setField(this, 1, value);
  };
  /**
   * optional uint64 blockNo = 2;
   * @return {number}
   */


  proto.types.BlockHeader.prototype.getBlockno = function () {
    return (
      /** @type {number} */
      jspb.Message.getFieldWithDefault(this, 2, 0)
    );
  };
  /** @param {number} value */


  proto.types.BlockHeader.prototype.setBlockno = function (value) {
    jspb.Message.setField(this, 2, value);
  };
  /**
   * optional int64 timestamp = 3;
   * @return {number}
   */


  proto.types.BlockHeader.prototype.getTimestamp = function () {
    return (
      /** @type {number} */
      jspb.Message.getFieldWithDefault(this, 3, 0)
    );
  };
  /** @param {number} value */


  proto.types.BlockHeader.prototype.setTimestamp = function (value) {
    jspb.Message.setField(this, 3, value);
  };
  /**
   * optional bytes blocksRootHash = 4;
   * @return {!(string|Uint8Array)}
   */


  proto.types.BlockHeader.prototype.getBlocksroothash = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 4, "")
    );
  };
  /**
   * optional bytes blocksRootHash = 4;
   * This is a type-conversion wrapper around `getBlocksroothash()`
   * @return {string}
   */


  proto.types.BlockHeader.prototype.getBlocksroothash_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getBlocksroothash())
    );
  };
  /**
   * optional bytes blocksRootHash = 4;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getBlocksroothash()`
   * @return {!Uint8Array}
   */


  proto.types.BlockHeader.prototype.getBlocksroothash_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getBlocksroothash())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.BlockHeader.prototype.setBlocksroothash = function (value) {
    jspb.Message.setField(this, 4, value);
  };
  /**
   * optional bytes txsRootHash = 5;
   * @return {!(string|Uint8Array)}
   */


  proto.types.BlockHeader.prototype.getTxsroothash = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 5, "")
    );
  };
  /**
   * optional bytes txsRootHash = 5;
   * This is a type-conversion wrapper around `getTxsroothash()`
   * @return {string}
   */


  proto.types.BlockHeader.prototype.getTxsroothash_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getTxsroothash())
    );
  };
  /**
   * optional bytes txsRootHash = 5;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getTxsroothash()`
   * @return {!Uint8Array}
   */


  proto.types.BlockHeader.prototype.getTxsroothash_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getTxsroothash())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.BlockHeader.prototype.setTxsroothash = function (value) {
    jspb.Message.setField(this, 5, value);
  };
  /**
   * optional bytes receiptsRootHash = 6;
   * @return {!(string|Uint8Array)}
   */


  proto.types.BlockHeader.prototype.getReceiptsroothash = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 6, "")
    );
  };
  /**
   * optional bytes receiptsRootHash = 6;
   * This is a type-conversion wrapper around `getReceiptsroothash()`
   * @return {string}
   */


  proto.types.BlockHeader.prototype.getReceiptsroothash_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getReceiptsroothash())
    );
  };
  /**
   * optional bytes receiptsRootHash = 6;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getReceiptsroothash()`
   * @return {!Uint8Array}
   */


  proto.types.BlockHeader.prototype.getReceiptsroothash_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getReceiptsroothash())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.BlockHeader.prototype.setReceiptsroothash = function (value) {
    jspb.Message.setField(this, 6, value);
  };
  /**
   * optional uint64 confirms = 7;
   * @return {number}
   */


  proto.types.BlockHeader.prototype.getConfirms = function () {
    return (
      /** @type {number} */
      jspb.Message.getFieldWithDefault(this, 7, 0)
    );
  };
  /** @param {number} value */


  proto.types.BlockHeader.prototype.setConfirms = function (value) {
    jspb.Message.setField(this, 7, value);
  };
  /**
   * optional bytes pubKey = 8;
   * @return {!(string|Uint8Array)}
   */


  proto.types.BlockHeader.prototype.getPubkey = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 8, "")
    );
  };
  /**
   * optional bytes pubKey = 8;
   * This is a type-conversion wrapper around `getPubkey()`
   * @return {string}
   */


  proto.types.BlockHeader.prototype.getPubkey_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getPubkey())
    );
  };
  /**
   * optional bytes pubKey = 8;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getPubkey()`
   * @return {!Uint8Array}
   */


  proto.types.BlockHeader.prototype.getPubkey_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getPubkey())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.BlockHeader.prototype.setPubkey = function (value) {
    jspb.Message.setField(this, 8, value);
  };
  /**
   * optional bytes sign = 9;
   * @return {!(string|Uint8Array)}
   */


  proto.types.BlockHeader.prototype.getSign = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 9, "")
    );
  };
  /**
   * optional bytes sign = 9;
   * This is a type-conversion wrapper around `getSign()`
   * @return {string}
   */


  proto.types.BlockHeader.prototype.getSign_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getSign())
    );
  };
  /**
   * optional bytes sign = 9;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getSign()`
   * @return {!Uint8Array}
   */


  proto.types.BlockHeader.prototype.getSign_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getSign())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.BlockHeader.prototype.setSign = function (value) {
    jspb.Message.setField(this, 9, value);
  };
  /**
   * optional bytes coinbaseAccount = 10;
   * @return {!(string|Uint8Array)}
   */


  proto.types.BlockHeader.prototype.getCoinbaseaccount = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 10, "")
    );
  };
  /**
   * optional bytes coinbaseAccount = 10;
   * This is a type-conversion wrapper around `getCoinbaseaccount()`
   * @return {string}
   */


  proto.types.BlockHeader.prototype.getCoinbaseaccount_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getCoinbaseaccount())
    );
  };
  /**
   * optional bytes coinbaseAccount = 10;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getCoinbaseaccount()`
   * @return {!Uint8Array}
   */


  proto.types.BlockHeader.prototype.getCoinbaseaccount_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getCoinbaseaccount())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.BlockHeader.prototype.setCoinbaseaccount = function (value) {
    jspb.Message.setField(this, 10, value);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.BlockBody = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, proto.types.BlockBody.repeatedFields_, null);
  };

  goog.inherits(proto.types.BlockBody, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.BlockBody.displayName = 'proto.types.BlockBody';
  }
  /**
   * List of repeated fields within this message type.
   * @private {!Array<number>}
   * @const
   */


  proto.types.BlockBody.repeatedFields_ = [1];

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.BlockBody.prototype.toObject = function (opt_includeInstance) {
      return proto.types.BlockBody.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.BlockBody} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.BlockBody.toObject = function (includeInstance, msg) {
      var obj = {
        txsList: jspb.Message.toObjectList(msg.getTxsList(), proto.types.Tx.toObject, includeInstance)
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.BlockBody}
   */


  proto.types.BlockBody.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.BlockBody();
    return proto.types.BlockBody.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.BlockBody} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.BlockBody}
   */


  proto.types.BlockBody.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value = new proto.types.Tx();
          reader.readMessage(value, proto.types.Tx.deserializeBinaryFromReader);
          msg.addTxs(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.BlockBody.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.BlockBody.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.BlockBody} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.BlockBody.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getTxsList();

    if (f.length > 0) {
      writer.writeRepeatedMessage(1, f, proto.types.Tx.serializeBinaryToWriter);
    }
  };
  /**
   * repeated Tx txs = 1;
   * @return {!Array.<!proto.types.Tx>}
   */


  proto.types.BlockBody.prototype.getTxsList = function () {
    return (
      /** @type{!Array.<!proto.types.Tx>} */
      jspb.Message.getRepeatedWrapperField(this, proto.types.Tx, 1)
    );
  };
  /** @param {!Array.<!proto.types.Tx>} value */


  proto.types.BlockBody.prototype.setTxsList = function (value) {
    jspb.Message.setRepeatedWrapperField(this, 1, value);
  };
  /**
   * @param {!proto.types.Tx=} opt_value
   * @param {number=} opt_index
   * @return {!proto.types.Tx}
   */


  proto.types.BlockBody.prototype.addTxs = function (opt_value, opt_index) {
    return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.types.Tx, opt_index);
  };

  proto.types.BlockBody.prototype.clearTxsList = function () {
    this.setTxsList([]);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.TxList = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, proto.types.TxList.repeatedFields_, null);
  };

  goog.inherits(proto.types.TxList, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.TxList.displayName = 'proto.types.TxList';
  }
  /**
   * List of repeated fields within this message type.
   * @private {!Array<number>}
   * @const
   */


  proto.types.TxList.repeatedFields_ = [1];

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.TxList.prototype.toObject = function (opt_includeInstance) {
      return proto.types.TxList.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.TxList} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.TxList.toObject = function (includeInstance, msg) {
      var obj = {
        txsList: jspb.Message.toObjectList(msg.getTxsList(), proto.types.Tx.toObject, includeInstance)
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.TxList}
   */


  proto.types.TxList.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.TxList();
    return proto.types.TxList.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.TxList} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.TxList}
   */


  proto.types.TxList.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value = new proto.types.Tx();
          reader.readMessage(value, proto.types.Tx.deserializeBinaryFromReader);
          msg.addTxs(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.TxList.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.TxList.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.TxList} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.TxList.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getTxsList();

    if (f.length > 0) {
      writer.writeRepeatedMessage(1, f, proto.types.Tx.serializeBinaryToWriter);
    }
  };
  /**
   * repeated Tx txs = 1;
   * @return {!Array.<!proto.types.Tx>}
   */


  proto.types.TxList.prototype.getTxsList = function () {
    return (
      /** @type{!Array.<!proto.types.Tx>} */
      jspb.Message.getRepeatedWrapperField(this, proto.types.Tx, 1)
    );
  };
  /** @param {!Array.<!proto.types.Tx>} value */


  proto.types.TxList.prototype.setTxsList = function (value) {
    jspb.Message.setRepeatedWrapperField(this, 1, value);
  };
  /**
   * @param {!proto.types.Tx=} opt_value
   * @param {number=} opt_index
   * @return {!proto.types.Tx}
   */


  proto.types.TxList.prototype.addTxs = function (opt_value, opt_index) {
    return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.types.Tx, opt_index);
  };

  proto.types.TxList.prototype.clearTxsList = function () {
    this.setTxsList([]);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.Tx = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
  };

  goog.inherits(proto.types.Tx, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.Tx.displayName = 'proto.types.Tx';
  }

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.Tx.prototype.toObject = function (opt_includeInstance) {
      return proto.types.Tx.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.Tx} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.Tx.toObject = function (includeInstance, msg) {
      var f,
          obj = {
        hash: msg.getHash_asB64(),
        body: (f = msg.getBody()) && proto.types.TxBody.toObject(includeInstance, f)
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.Tx}
   */


  proto.types.Tx.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.Tx();
    return proto.types.Tx.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.Tx} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.Tx}
   */


  proto.types.Tx.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setHash(value);
          break;

        case 2:
          var value = new proto.types.TxBody();
          reader.readMessage(value, proto.types.TxBody.deserializeBinaryFromReader);
          msg.setBody(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.Tx.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.Tx.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.Tx} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.Tx.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getHash_asU8();

    if (f.length > 0) {
      writer.writeBytes(1, f);
    }

    f = message.getBody();

    if (f != null) {
      writer.writeMessage(2, f, proto.types.TxBody.serializeBinaryToWriter);
    }
  };
  /**
   * optional bytes hash = 1;
   * @return {!(string|Uint8Array)}
   */


  proto.types.Tx.prototype.getHash = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 1, "")
    );
  };
  /**
   * optional bytes hash = 1;
   * This is a type-conversion wrapper around `getHash()`
   * @return {string}
   */


  proto.types.Tx.prototype.getHash_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getHash())
    );
  };
  /**
   * optional bytes hash = 1;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getHash()`
   * @return {!Uint8Array}
   */


  proto.types.Tx.prototype.getHash_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getHash())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.Tx.prototype.setHash = function (value) {
    jspb.Message.setField(this, 1, value);
  };
  /**
   * optional TxBody body = 2;
   * @return {?proto.types.TxBody}
   */


  proto.types.Tx.prototype.getBody = function () {
    return (
      /** @type{?proto.types.TxBody} */
      jspb.Message.getWrapperField(this, proto.types.TxBody, 2)
    );
  };
  /** @param {?proto.types.TxBody|undefined} value */


  proto.types.Tx.prototype.setBody = function (value) {
    jspb.Message.setWrapperField(this, 2, value);
  };

  proto.types.Tx.prototype.clearBody = function () {
    this.setBody(undefined);
  };
  /**
   * Returns whether this field is set.
   * @return {!boolean}
   */


  proto.types.Tx.prototype.hasBody = function () {
    return jspb.Message.getField(this, 2) != null;
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.TxBody = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
  };

  goog.inherits(proto.types.TxBody, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.TxBody.displayName = 'proto.types.TxBody';
  }

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.TxBody.prototype.toObject = function (opt_includeInstance) {
      return proto.types.TxBody.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.TxBody} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.TxBody.toObject = function (includeInstance, msg) {
      var obj = {
        nonce: jspb.Message.getFieldWithDefault(msg, 1, 0),
        account: msg.getAccount_asB64(),
        recipient: msg.getRecipient_asB64(),
        amount: jspb.Message.getFieldWithDefault(msg, 4, 0),
        payload: msg.getPayload_asB64(),
        limit: jspb.Message.getFieldWithDefault(msg, 6, 0),
        price: jspb.Message.getFieldWithDefault(msg, 7, 0),
        type: jspb.Message.getFieldWithDefault(msg, 8, 0),
        sign: msg.getSign_asB64()
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.TxBody}
   */


  proto.types.TxBody.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.TxBody();
    return proto.types.TxBody.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.TxBody} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.TxBody}
   */


  proto.types.TxBody.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value =
          /** @type {number} */
          reader.readUint64();
          msg.setNonce(value);
          break;

        case 2:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setAccount(value);
          break;

        case 3:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setRecipient(value);
          break;

        case 4:
          var value =
          /** @type {number} */
          reader.readUint64();
          msg.setAmount(value);
          break;

        case 5:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setPayload(value);
          break;

        case 6:
          var value =
          /** @type {number} */
          reader.readUint64();
          msg.setLimit(value);
          break;

        case 7:
          var value =
          /** @type {number} */
          reader.readUint64();
          msg.setPrice(value);
          break;

        case 8:
          var value =
          /** @type {!proto.types.TxType} */
          reader.readEnum();
          msg.setType(value);
          break;

        case 9:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setSign(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.TxBody.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.TxBody.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.TxBody} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.TxBody.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getNonce();

    if (f !== 0) {
      writer.writeUint64(1, f);
    }

    f = message.getAccount_asU8();

    if (f.length > 0) {
      writer.writeBytes(2, f);
    }

    f = message.getRecipient_asU8();

    if (f.length > 0) {
      writer.writeBytes(3, f);
    }

    f = message.getAmount();

    if (f !== 0) {
      writer.writeUint64(4, f);
    }

    f = message.getPayload_asU8();

    if (f.length > 0) {
      writer.writeBytes(5, f);
    }

    f = message.getLimit();

    if (f !== 0) {
      writer.writeUint64(6, f);
    }

    f = message.getPrice();

    if (f !== 0) {
      writer.writeUint64(7, f);
    }

    f = message.getType();

    if (f !== 0.0) {
      writer.writeEnum(8, f);
    }

    f = message.getSign_asU8();

    if (f.length > 0) {
      writer.writeBytes(9, f);
    }
  };
  /**
   * optional uint64 nonce = 1;
   * @return {number}
   */


  proto.types.TxBody.prototype.getNonce = function () {
    return (
      /** @type {number} */
      jspb.Message.getFieldWithDefault(this, 1, 0)
    );
  };
  /** @param {number} value */


  proto.types.TxBody.prototype.setNonce = function (value) {
    jspb.Message.setField(this, 1, value);
  };
  /**
   * optional bytes account = 2;
   * @return {!(string|Uint8Array)}
   */


  proto.types.TxBody.prototype.getAccount = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 2, "")
    );
  };
  /**
   * optional bytes account = 2;
   * This is a type-conversion wrapper around `getAccount()`
   * @return {string}
   */


  proto.types.TxBody.prototype.getAccount_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getAccount())
    );
  };
  /**
   * optional bytes account = 2;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getAccount()`
   * @return {!Uint8Array}
   */


  proto.types.TxBody.prototype.getAccount_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getAccount())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.TxBody.prototype.setAccount = function (value) {
    jspb.Message.setField(this, 2, value);
  };
  /**
   * optional bytes recipient = 3;
   * @return {!(string|Uint8Array)}
   */


  proto.types.TxBody.prototype.getRecipient = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 3, "")
    );
  };
  /**
   * optional bytes recipient = 3;
   * This is a type-conversion wrapper around `getRecipient()`
   * @return {string}
   */


  proto.types.TxBody.prototype.getRecipient_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getRecipient())
    );
  };
  /**
   * optional bytes recipient = 3;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getRecipient()`
   * @return {!Uint8Array}
   */


  proto.types.TxBody.prototype.getRecipient_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getRecipient())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.TxBody.prototype.setRecipient = function (value) {
    jspb.Message.setField(this, 3, value);
  };
  /**
   * optional uint64 amount = 4;
   * @return {number}
   */


  proto.types.TxBody.prototype.getAmount = function () {
    return (
      /** @type {number} */
      jspb.Message.getFieldWithDefault(this, 4, 0)
    );
  };
  /** @param {number} value */


  proto.types.TxBody.prototype.setAmount = function (value) {
    jspb.Message.setField(this, 4, value);
  };
  /**
   * optional bytes payload = 5;
   * @return {!(string|Uint8Array)}
   */


  proto.types.TxBody.prototype.getPayload = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 5, "")
    );
  };
  /**
   * optional bytes payload = 5;
   * This is a type-conversion wrapper around `getPayload()`
   * @return {string}
   */


  proto.types.TxBody.prototype.getPayload_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getPayload())
    );
  };
  /**
   * optional bytes payload = 5;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getPayload()`
   * @return {!Uint8Array}
   */


  proto.types.TxBody.prototype.getPayload_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getPayload())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.TxBody.prototype.setPayload = function (value) {
    jspb.Message.setField(this, 5, value);
  };
  /**
   * optional uint64 limit = 6;
   * @return {number}
   */


  proto.types.TxBody.prototype.getLimit = function () {
    return (
      /** @type {number} */
      jspb.Message.getFieldWithDefault(this, 6, 0)
    );
  };
  /** @param {number} value */


  proto.types.TxBody.prototype.setLimit = function (value) {
    jspb.Message.setField(this, 6, value);
  };
  /**
   * optional uint64 price = 7;
   * @return {number}
   */


  proto.types.TxBody.prototype.getPrice = function () {
    return (
      /** @type {number} */
      jspb.Message.getFieldWithDefault(this, 7, 0)
    );
  };
  /** @param {number} value */


  proto.types.TxBody.prototype.setPrice = function (value) {
    jspb.Message.setField(this, 7, value);
  };
  /**
   * optional TxType type = 8;
   * @return {!proto.types.TxType}
   */


  proto.types.TxBody.prototype.getType = function () {
    return (
      /** @type {!proto.types.TxType} */
      jspb.Message.getFieldWithDefault(this, 8, 0)
    );
  };
  /** @param {!proto.types.TxType} value */


  proto.types.TxBody.prototype.setType = function (value) {
    jspb.Message.setField(this, 8, value);
  };
  /**
   * optional bytes sign = 9;
   * @return {!(string|Uint8Array)}
   */


  proto.types.TxBody.prototype.getSign = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 9, "")
    );
  };
  /**
   * optional bytes sign = 9;
   * This is a type-conversion wrapper around `getSign()`
   * @return {string}
   */


  proto.types.TxBody.prototype.getSign_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getSign())
    );
  };
  /**
   * optional bytes sign = 9;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getSign()`
   * @return {!Uint8Array}
   */


  proto.types.TxBody.prototype.getSign_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getSign())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.TxBody.prototype.setSign = function (value) {
    jspb.Message.setField(this, 9, value);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.TxIdx = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
  };

  goog.inherits(proto.types.TxIdx, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.TxIdx.displayName = 'proto.types.TxIdx';
  }

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.TxIdx.prototype.toObject = function (opt_includeInstance) {
      return proto.types.TxIdx.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.TxIdx} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.TxIdx.toObject = function (includeInstance, msg) {
      var obj = {
        blockhash: msg.getBlockhash_asB64(),
        idx: jspb.Message.getFieldWithDefault(msg, 2, 0)
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.TxIdx}
   */


  proto.types.TxIdx.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.TxIdx();
    return proto.types.TxIdx.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.TxIdx} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.TxIdx}
   */


  proto.types.TxIdx.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setBlockhash(value);
          break;

        case 2:
          var value =
          /** @type {number} */
          reader.readInt32();
          msg.setIdx(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.TxIdx.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.TxIdx.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.TxIdx} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.TxIdx.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getBlockhash_asU8();

    if (f.length > 0) {
      writer.writeBytes(1, f);
    }

    f = message.getIdx();

    if (f !== 0) {
      writer.writeInt32(2, f);
    }
  };
  /**
   * optional bytes blockHash = 1;
   * @return {!(string|Uint8Array)}
   */


  proto.types.TxIdx.prototype.getBlockhash = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 1, "")
    );
  };
  /**
   * optional bytes blockHash = 1;
   * This is a type-conversion wrapper around `getBlockhash()`
   * @return {string}
   */


  proto.types.TxIdx.prototype.getBlockhash_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getBlockhash())
    );
  };
  /**
   * optional bytes blockHash = 1;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getBlockhash()`
   * @return {!Uint8Array}
   */


  proto.types.TxIdx.prototype.getBlockhash_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getBlockhash())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.TxIdx.prototype.setBlockhash = function (value) {
    jspb.Message.setField(this, 1, value);
  };
  /**
   * optional int32 idx = 2;
   * @return {number}
   */


  proto.types.TxIdx.prototype.getIdx = function () {
    return (
      /** @type {number} */
      jspb.Message.getFieldWithDefault(this, 2, 0)
    );
  };
  /** @param {number} value */


  proto.types.TxIdx.prototype.setIdx = function (value) {
    jspb.Message.setField(this, 2, value);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.TxInBlock = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
  };

  goog.inherits(proto.types.TxInBlock, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.TxInBlock.displayName = 'proto.types.TxInBlock';
  }

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.TxInBlock.prototype.toObject = function (opt_includeInstance) {
      return proto.types.TxInBlock.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.TxInBlock} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.TxInBlock.toObject = function (includeInstance, msg) {
      var f,
          obj = {
        txidx: (f = msg.getTxidx()) && proto.types.TxIdx.toObject(includeInstance, f),
        tx: (f = msg.getTx()) && proto.types.Tx.toObject(includeInstance, f)
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.TxInBlock}
   */


  proto.types.TxInBlock.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.TxInBlock();
    return proto.types.TxInBlock.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.TxInBlock} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.TxInBlock}
   */


  proto.types.TxInBlock.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value = new proto.types.TxIdx();
          reader.readMessage(value, proto.types.TxIdx.deserializeBinaryFromReader);
          msg.setTxidx(value);
          break;

        case 2:
          var value = new proto.types.Tx();
          reader.readMessage(value, proto.types.Tx.deserializeBinaryFromReader);
          msg.setTx(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.TxInBlock.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.TxInBlock.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.TxInBlock} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.TxInBlock.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getTxidx();

    if (f != null) {
      writer.writeMessage(1, f, proto.types.TxIdx.serializeBinaryToWriter);
    }

    f = message.getTx();

    if (f != null) {
      writer.writeMessage(2, f, proto.types.Tx.serializeBinaryToWriter);
    }
  };
  /**
   * optional TxIdx txIdx = 1;
   * @return {?proto.types.TxIdx}
   */


  proto.types.TxInBlock.prototype.getTxidx = function () {
    return (
      /** @type{?proto.types.TxIdx} */
      jspb.Message.getWrapperField(this, proto.types.TxIdx, 1)
    );
  };
  /** @param {?proto.types.TxIdx|undefined} value */


  proto.types.TxInBlock.prototype.setTxidx = function (value) {
    jspb.Message.setWrapperField(this, 1, value);
  };

  proto.types.TxInBlock.prototype.clearTxidx = function () {
    this.setTxidx(undefined);
  };
  /**
   * Returns whether this field is set.
   * @return {!boolean}
   */


  proto.types.TxInBlock.prototype.hasTxidx = function () {
    return jspb.Message.getField(this, 1) != null;
  };
  /**
   * optional Tx tx = 2;
   * @return {?proto.types.Tx}
   */


  proto.types.TxInBlock.prototype.getTx = function () {
    return (
      /** @type{?proto.types.Tx} */
      jspb.Message.getWrapperField(this, proto.types.Tx, 2)
    );
  };
  /** @param {?proto.types.Tx|undefined} value */


  proto.types.TxInBlock.prototype.setTx = function (value) {
    jspb.Message.setWrapperField(this, 2, value);
  };

  proto.types.TxInBlock.prototype.clearTx = function () {
    this.setTx(undefined);
  };
  /**
   * Returns whether this field is set.
   * @return {!boolean}
   */


  proto.types.TxInBlock.prototype.hasTx = function () {
    return jspb.Message.getField(this, 2) != null;
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.State = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
  };

  goog.inherits(proto.types.State, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.State.displayName = 'proto.types.State';
  }

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.State.prototype.toObject = function (opt_includeInstance) {
      return proto.types.State.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.State} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.State.toObject = function (includeInstance, msg) {
      var obj = {
        nonce: jspb.Message.getFieldWithDefault(msg, 1, 0),
        balance: jspb.Message.getFieldWithDefault(msg, 2, 0),
        codehash: msg.getCodehash_asB64(),
        storageroot: msg.getStorageroot_asB64(),
        sqlrecoverypoint: jspb.Message.getFieldWithDefault(msg, 5, 0)
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.State}
   */


  proto.types.State.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.State();
    return proto.types.State.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.State} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.State}
   */


  proto.types.State.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value =
          /** @type {number} */
          reader.readUint64();
          msg.setNonce(value);
          break;

        case 2:
          var value =
          /** @type {number} */
          reader.readUint64();
          msg.setBalance(value);
          break;

        case 3:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setCodehash(value);
          break;

        case 4:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setStorageroot(value);
          break;

        case 5:
          var value =
          /** @type {number} */
          reader.readUint64();
          msg.setSqlrecoverypoint(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.State.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.State.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.State} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.State.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getNonce();

    if (f !== 0) {
      writer.writeUint64(1, f);
    }

    f = message.getBalance();

    if (f !== 0) {
      writer.writeUint64(2, f);
    }

    f = message.getCodehash_asU8();

    if (f.length > 0) {
      writer.writeBytes(3, f);
    }

    f = message.getStorageroot_asU8();

    if (f.length > 0) {
      writer.writeBytes(4, f);
    }

    f = message.getSqlrecoverypoint();

    if (f !== 0) {
      writer.writeUint64(5, f);
    }
  };
  /**
   * optional uint64 nonce = 1;
   * @return {number}
   */


  proto.types.State.prototype.getNonce = function () {
    return (
      /** @type {number} */
      jspb.Message.getFieldWithDefault(this, 1, 0)
    );
  };
  /** @param {number} value */


  proto.types.State.prototype.setNonce = function (value) {
    jspb.Message.setField(this, 1, value);
  };
  /**
   * optional uint64 balance = 2;
   * @return {number}
   */


  proto.types.State.prototype.getBalance = function () {
    return (
      /** @type {number} */
      jspb.Message.getFieldWithDefault(this, 2, 0)
    );
  };
  /** @param {number} value */


  proto.types.State.prototype.setBalance = function (value) {
    jspb.Message.setField(this, 2, value);
  };
  /**
   * optional bytes codeHash = 3;
   * @return {!(string|Uint8Array)}
   */


  proto.types.State.prototype.getCodehash = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 3, "")
    );
  };
  /**
   * optional bytes codeHash = 3;
   * This is a type-conversion wrapper around `getCodehash()`
   * @return {string}
   */


  proto.types.State.prototype.getCodehash_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getCodehash())
    );
  };
  /**
   * optional bytes codeHash = 3;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getCodehash()`
   * @return {!Uint8Array}
   */


  proto.types.State.prototype.getCodehash_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getCodehash())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.State.prototype.setCodehash = function (value) {
    jspb.Message.setField(this, 3, value);
  };
  /**
   * optional bytes storageRoot = 4;
   * @return {!(string|Uint8Array)}
   */


  proto.types.State.prototype.getStorageroot = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 4, "")
    );
  };
  /**
   * optional bytes storageRoot = 4;
   * This is a type-conversion wrapper around `getStorageroot()`
   * @return {string}
   */


  proto.types.State.prototype.getStorageroot_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getStorageroot())
    );
  };
  /**
   * optional bytes storageRoot = 4;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getStorageroot()`
   * @return {!Uint8Array}
   */


  proto.types.State.prototype.getStorageroot_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getStorageroot())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.State.prototype.setStorageroot = function (value) {
    jspb.Message.setField(this, 4, value);
  };
  /**
   * optional uint64 sqlRecoveryPoint = 5;
   * @return {number}
   */


  proto.types.State.prototype.getSqlrecoverypoint = function () {
    return (
      /** @type {number} */
      jspb.Message.getFieldWithDefault(this, 5, 0)
    );
  };
  /** @param {number} value */


  proto.types.State.prototype.setSqlrecoverypoint = function (value) {
    jspb.Message.setField(this, 5, value);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.StateProof = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, proto.types.StateProof.repeatedFields_, null);
  };

  goog.inherits(proto.types.StateProof, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.StateProof.displayName = 'proto.types.StateProof';
  }
  /**
   * List of repeated fields within this message type.
   * @private {!Array<number>}
   * @const
   */


  proto.types.StateProof.repeatedFields_ = [5];

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.StateProof.prototype.toObject = function (opt_includeInstance) {
      return proto.types.StateProof.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.StateProof} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.StateProof.toObject = function (includeInstance, msg) {
      var f,
          obj = {
        state: (f = msg.getState()) && proto.types.State.toObject(includeInstance, f),
        inclusion: jspb.Message.getFieldWithDefault(msg, 2, false),
        proofkey: msg.getProofkey_asB64(),
        proofval: msg.getProofval_asB64(),
        auditpathList: msg.getAuditpathList_asB64()
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.StateProof}
   */


  proto.types.StateProof.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.StateProof();
    return proto.types.StateProof.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.StateProof} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.StateProof}
   */


  proto.types.StateProof.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value = new proto.types.State();
          reader.readMessage(value, proto.types.State.deserializeBinaryFromReader);
          msg.setState(value);
          break;

        case 2:
          var value =
          /** @type {boolean} */
          reader.readBool();
          msg.setInclusion(value);
          break;

        case 3:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setProofkey(value);
          break;

        case 4:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setProofval(value);
          break;

        case 5:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.addAuditpath(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.StateProof.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.StateProof.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.StateProof} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.StateProof.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getState();

    if (f != null) {
      writer.writeMessage(1, f, proto.types.State.serializeBinaryToWriter);
    }

    f = message.getInclusion();

    if (f) {
      writer.writeBool(2, f);
    }

    f = message.getProofkey_asU8();

    if (f.length > 0) {
      writer.writeBytes(3, f);
    }

    f = message.getProofval_asU8();

    if (f.length > 0) {
      writer.writeBytes(4, f);
    }

    f = message.getAuditpathList_asU8();

    if (f.length > 0) {
      writer.writeRepeatedBytes(5, f);
    }
  };
  /**
   * optional State State = 1;
   * @return {?proto.types.State}
   */


  proto.types.StateProof.prototype.getState = function () {
    return (
      /** @type{?proto.types.State} */
      jspb.Message.getWrapperField(this, proto.types.State, 1)
    );
  };
  /** @param {?proto.types.State|undefined} value */


  proto.types.StateProof.prototype.setState = function (value) {
    jspb.Message.setWrapperField(this, 1, value);
  };

  proto.types.StateProof.prototype.clearState = function () {
    this.setState(undefined);
  };
  /**
   * Returns whether this field is set.
   * @return {!boolean}
   */


  proto.types.StateProof.prototype.hasState = function () {
    return jspb.Message.getField(this, 1) != null;
  };
  /**
   * optional bool inclusion = 2;
   * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
   * You should avoid comparisons like {@code val === true/false} in those cases.
   * @return {boolean}
   */


  proto.types.StateProof.prototype.getInclusion = function () {
    return (
      /** @type {boolean} */
      jspb.Message.getFieldWithDefault(this, 2, false)
    );
  };
  /** @param {boolean} value */


  proto.types.StateProof.prototype.setInclusion = function (value) {
    jspb.Message.setField(this, 2, value);
  };
  /**
   * optional bytes proofKey = 3;
   * @return {!(string|Uint8Array)}
   */


  proto.types.StateProof.prototype.getProofkey = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 3, "")
    );
  };
  /**
   * optional bytes proofKey = 3;
   * This is a type-conversion wrapper around `getProofkey()`
   * @return {string}
   */


  proto.types.StateProof.prototype.getProofkey_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getProofkey())
    );
  };
  /**
   * optional bytes proofKey = 3;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getProofkey()`
   * @return {!Uint8Array}
   */


  proto.types.StateProof.prototype.getProofkey_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getProofkey())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.StateProof.prototype.setProofkey = function (value) {
    jspb.Message.setField(this, 3, value);
  };
  /**
   * optional bytes proofVal = 4;
   * @return {!(string|Uint8Array)}
   */


  proto.types.StateProof.prototype.getProofval = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 4, "")
    );
  };
  /**
   * optional bytes proofVal = 4;
   * This is a type-conversion wrapper around `getProofval()`
   * @return {string}
   */


  proto.types.StateProof.prototype.getProofval_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getProofval())
    );
  };
  /**
   * optional bytes proofVal = 4;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getProofval()`
   * @return {!Uint8Array}
   */


  proto.types.StateProof.prototype.getProofval_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getProofval())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.StateProof.prototype.setProofval = function (value) {
    jspb.Message.setField(this, 4, value);
  };
  /**
   * repeated bytes auditPath = 5;
   * @return {!(Array<!Uint8Array>|Array<string>)}
   */


  proto.types.StateProof.prototype.getAuditpathList = function () {
    return (
      /** @type {!(Array<!Uint8Array>|Array<string>)} */
      jspb.Message.getRepeatedField(this, 5)
    );
  };
  /**
   * repeated bytes auditPath = 5;
   * This is a type-conversion wrapper around `getAuditpathList()`
   * @return {!Array.<string>}
   */


  proto.types.StateProof.prototype.getAuditpathList_asB64 = function () {
    return (
      /** @type {!Array.<string>} */
      jspb.Message.bytesListAsB64(this.getAuditpathList())
    );
  };
  /**
   * repeated bytes auditPath = 5;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getAuditpathList()`
   * @return {!Array.<!Uint8Array>}
   */


  proto.types.StateProof.prototype.getAuditpathList_asU8 = function () {
    return (
      /** @type {!Array.<!Uint8Array>} */
      jspb.Message.bytesListAsU8(this.getAuditpathList())
    );
  };
  /** @param {!(Array<!Uint8Array>|Array<string>)} value */


  proto.types.StateProof.prototype.setAuditpathList = function (value) {
    jspb.Message.setField(this, 5, value || []);
  };
  /**
   * @param {!(string|Uint8Array)} value
   * @param {number=} opt_index
   */


  proto.types.StateProof.prototype.addAuditpath = function (value, opt_index) {
    jspb.Message.addToRepeatedField(this, 5, value, opt_index);
  };

  proto.types.StateProof.prototype.clearAuditpathList = function () {
    this.setAuditpathList([]);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.Receipt = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
  };

  goog.inherits(proto.types.Receipt, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.Receipt.displayName = 'proto.types.Receipt';
  }

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.Receipt.prototype.toObject = function (opt_includeInstance) {
      return proto.types.Receipt.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.Receipt} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.Receipt.toObject = function (includeInstance, msg) {
      var obj = {
        contractaddress: msg.getContractaddress_asB64(),
        status: jspb.Message.getFieldWithDefault(msg, 2, ""),
        ret: jspb.Message.getFieldWithDefault(msg, 3, "")
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.Receipt}
   */


  proto.types.Receipt.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.Receipt();
    return proto.types.Receipt.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.Receipt} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.Receipt}
   */


  proto.types.Receipt.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setContractaddress(value);
          break;

        case 2:
          var value =
          /** @type {string} */
          reader.readString();
          msg.setStatus(value);
          break;

        case 3:
          var value =
          /** @type {string} */
          reader.readString();
          msg.setRet(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.Receipt.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.Receipt.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.Receipt} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.Receipt.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getContractaddress_asU8();

    if (f.length > 0) {
      writer.writeBytes(1, f);
    }

    f = message.getStatus();

    if (f.length > 0) {
      writer.writeString(2, f);
    }

    f = message.getRet();

    if (f.length > 0) {
      writer.writeString(3, f);
    }
  };
  /**
   * optional bytes contractAddress = 1;
   * @return {!(string|Uint8Array)}
   */


  proto.types.Receipt.prototype.getContractaddress = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 1, "")
    );
  };
  /**
   * optional bytes contractAddress = 1;
   * This is a type-conversion wrapper around `getContractaddress()`
   * @return {string}
   */


  proto.types.Receipt.prototype.getContractaddress_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getContractaddress())
    );
  };
  /**
   * optional bytes contractAddress = 1;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getContractaddress()`
   * @return {!Uint8Array}
   */


  proto.types.Receipt.prototype.getContractaddress_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getContractaddress())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.Receipt.prototype.setContractaddress = function (value) {
    jspb.Message.setField(this, 1, value);
  };
  /**
   * optional string status = 2;
   * @return {string}
   */


  proto.types.Receipt.prototype.getStatus = function () {
    return (
      /** @type {string} */
      jspb.Message.getFieldWithDefault(this, 2, "")
    );
  };
  /** @param {string} value */


  proto.types.Receipt.prototype.setStatus = function (value) {
    jspb.Message.setField(this, 2, value);
  };
  /**
   * optional string ret = 3;
   * @return {string}
   */


  proto.types.Receipt.prototype.getRet = function () {
    return (
      /** @type {string} */
      jspb.Message.getFieldWithDefault(this, 3, "")
    );
  };
  /** @param {string} value */


  proto.types.Receipt.prototype.setRet = function (value) {
    jspb.Message.setField(this, 3, value);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.Vote = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
  };

  goog.inherits(proto.types.Vote, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.Vote.displayName = 'proto.types.Vote';
  }

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.Vote.prototype.toObject = function (opt_includeInstance) {
      return proto.types.Vote.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.Vote} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.Vote.toObject = function (includeInstance, msg) {
      var obj = {
        candidate: msg.getCandidate_asB64(),
        amount: jspb.Message.getFieldWithDefault(msg, 2, 0)
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.Vote}
   */


  proto.types.Vote.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.Vote();
    return proto.types.Vote.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.Vote} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.Vote}
   */


  proto.types.Vote.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setCandidate(value);
          break;

        case 2:
          var value =
          /** @type {number} */
          reader.readUint64();
          msg.setAmount(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.Vote.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.Vote.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.Vote} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.Vote.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getCandidate_asU8();

    if (f.length > 0) {
      writer.writeBytes(1, f);
    }

    f = message.getAmount();

    if (f !== 0) {
      writer.writeUint64(2, f);
    }
  };
  /**
   * optional bytes candidate = 1;
   * @return {!(string|Uint8Array)}
   */


  proto.types.Vote.prototype.getCandidate = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 1, "")
    );
  };
  /**
   * optional bytes candidate = 1;
   * This is a type-conversion wrapper around `getCandidate()`
   * @return {string}
   */


  proto.types.Vote.prototype.getCandidate_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getCandidate())
    );
  };
  /**
   * optional bytes candidate = 1;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getCandidate()`
   * @return {!Uint8Array}
   */


  proto.types.Vote.prototype.getCandidate_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getCandidate())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.Vote.prototype.setCandidate = function (value) {
    jspb.Message.setField(this, 1, value);
  };
  /**
   * optional uint64 amount = 2;
   * @return {number}
   */


  proto.types.Vote.prototype.getAmount = function () {
    return (
      /** @type {number} */
      jspb.Message.getFieldWithDefault(this, 2, 0)
    );
  };
  /** @param {number} value */


  proto.types.Vote.prototype.setAmount = function (value) {
    jspb.Message.setField(this, 2, value);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.VoteList = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, proto.types.VoteList.repeatedFields_, null);
  };

  goog.inherits(proto.types.VoteList, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.VoteList.displayName = 'proto.types.VoteList';
  }
  /**
   * List of repeated fields within this message type.
   * @private {!Array<number>}
   * @const
   */


  proto.types.VoteList.repeatedFields_ = [1];

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.VoteList.prototype.toObject = function (opt_includeInstance) {
      return proto.types.VoteList.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.VoteList} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.VoteList.toObject = function (includeInstance, msg) {
      var obj = {
        votesList: jspb.Message.toObjectList(msg.getVotesList(), proto.types.Vote.toObject, includeInstance)
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.VoteList}
   */


  proto.types.VoteList.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.VoteList();
    return proto.types.VoteList.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.VoteList} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.VoteList}
   */


  proto.types.VoteList.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value = new proto.types.Vote();
          reader.readMessage(value, proto.types.Vote.deserializeBinaryFromReader);
          msg.addVotes(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.VoteList.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.VoteList.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.VoteList} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.VoteList.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getVotesList();

    if (f.length > 0) {
      writer.writeRepeatedMessage(1, f, proto.types.Vote.serializeBinaryToWriter);
    }
  };
  /**
   * repeated Vote votes = 1;
   * @return {!Array.<!proto.types.Vote>}
   */


  proto.types.VoteList.prototype.getVotesList = function () {
    return (
      /** @type{!Array.<!proto.types.Vote>} */
      jspb.Message.getRepeatedWrapperField(this, proto.types.Vote, 1)
    );
  };
  /** @param {!Array.<!proto.types.Vote>} value */


  proto.types.VoteList.prototype.setVotesList = function (value) {
    jspb.Message.setRepeatedWrapperField(this, 1, value);
  };
  /**
   * @param {!proto.types.Vote=} opt_value
   * @param {number=} opt_index
   * @return {!proto.types.Vote}
   */


  proto.types.VoteList.prototype.addVotes = function (opt_value, opt_index) {
    return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.types.Vote, opt_index);
  };

  proto.types.VoteList.prototype.clearVotesList = function () {
    this.setVotesList([]);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.FnArgument = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
  };

  goog.inherits(proto.types.FnArgument, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.FnArgument.displayName = 'proto.types.FnArgument';
  }

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.FnArgument.prototype.toObject = function (opt_includeInstance) {
      return proto.types.FnArgument.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.FnArgument} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.FnArgument.toObject = function (includeInstance, msg) {
      var obj = {
        name: jspb.Message.getFieldWithDefault(msg, 1, "")
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.FnArgument}
   */


  proto.types.FnArgument.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.FnArgument();
    return proto.types.FnArgument.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.FnArgument} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.FnArgument}
   */


  proto.types.FnArgument.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value =
          /** @type {string} */
          reader.readString();
          msg.setName(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.FnArgument.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.FnArgument.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.FnArgument} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.FnArgument.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getName();

    if (f.length > 0) {
      writer.writeString(1, f);
    }
  };
  /**
   * optional string name = 1;
   * @return {string}
   */


  proto.types.FnArgument.prototype.getName = function () {
    return (
      /** @type {string} */
      jspb.Message.getFieldWithDefault(this, 1, "")
    );
  };
  /** @param {string} value */


  proto.types.FnArgument.prototype.setName = function (value) {
    jspb.Message.setField(this, 1, value);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.Function = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, proto.types.Function.repeatedFields_, null);
  };

  goog.inherits(proto.types.Function, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.Function.displayName = 'proto.types.Function';
  }
  /**
   * List of repeated fields within this message type.
   * @private {!Array<number>}
   * @const
   */


  proto.types.Function.repeatedFields_ = [2];

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.Function.prototype.toObject = function (opt_includeInstance) {
      return proto.types.Function.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.Function} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.Function.toObject = function (includeInstance, msg) {
      var obj = {
        name: jspb.Message.getFieldWithDefault(msg, 1, ""),
        argumentsList: jspb.Message.toObjectList(msg.getArgumentsList(), proto.types.FnArgument.toObject, includeInstance)
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.Function}
   */


  proto.types.Function.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.Function();
    return proto.types.Function.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.Function} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.Function}
   */


  proto.types.Function.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value =
          /** @type {string} */
          reader.readString();
          msg.setName(value);
          break;

        case 2:
          var value = new proto.types.FnArgument();
          reader.readMessage(value, proto.types.FnArgument.deserializeBinaryFromReader);
          msg.addArguments(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.Function.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.Function.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.Function} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.Function.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getName();

    if (f.length > 0) {
      writer.writeString(1, f);
    }

    f = message.getArgumentsList();

    if (f.length > 0) {
      writer.writeRepeatedMessage(2, f, proto.types.FnArgument.serializeBinaryToWriter);
    }
  };
  /**
   * optional string name = 1;
   * @return {string}
   */


  proto.types.Function.prototype.getName = function () {
    return (
      /** @type {string} */
      jspb.Message.getFieldWithDefault(this, 1, "")
    );
  };
  /** @param {string} value */


  proto.types.Function.prototype.setName = function (value) {
    jspb.Message.setField(this, 1, value);
  };
  /**
   * repeated FnArgument arguments = 2;
   * @return {!Array.<!proto.types.FnArgument>}
   */


  proto.types.Function.prototype.getArgumentsList = function () {
    return (
      /** @type{!Array.<!proto.types.FnArgument>} */
      jspb.Message.getRepeatedWrapperField(this, proto.types.FnArgument, 2)
    );
  };
  /** @param {!Array.<!proto.types.FnArgument>} value */


  proto.types.Function.prototype.setArgumentsList = function (value) {
    jspb.Message.setRepeatedWrapperField(this, 2, value);
  };
  /**
   * @param {!proto.types.FnArgument=} opt_value
   * @param {number=} opt_index
   * @return {!proto.types.FnArgument}
   */


  proto.types.Function.prototype.addArguments = function (opt_value, opt_index) {
    return jspb.Message.addToRepeatedWrapperField(this, 2, opt_value, proto.types.FnArgument, opt_index);
  };

  proto.types.Function.prototype.clearArgumentsList = function () {
    this.setArgumentsList([]);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.ABI = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, proto.types.ABI.repeatedFields_, null);
  };

  goog.inherits(proto.types.ABI, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.ABI.displayName = 'proto.types.ABI';
  }
  /**
   * List of repeated fields within this message type.
   * @private {!Array<number>}
   * @const
   */


  proto.types.ABI.repeatedFields_ = [3];

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.ABI.prototype.toObject = function (opt_includeInstance) {
      return proto.types.ABI.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.ABI} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.ABI.toObject = function (includeInstance, msg) {
      var obj = {
        version: jspb.Message.getFieldWithDefault(msg, 1, ""),
        language: jspb.Message.getFieldWithDefault(msg, 2, ""),
        functionsList: jspb.Message.toObjectList(msg.getFunctionsList(), proto.types.Function.toObject, includeInstance)
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.ABI}
   */


  proto.types.ABI.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.ABI();
    return proto.types.ABI.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.ABI} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.ABI}
   */


  proto.types.ABI.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value =
          /** @type {string} */
          reader.readString();
          msg.setVersion(value);
          break;

        case 2:
          var value =
          /** @type {string} */
          reader.readString();
          msg.setLanguage(value);
          break;

        case 3:
          var value = new proto.types.Function();
          reader.readMessage(value, proto.types.Function.deserializeBinaryFromReader);
          msg.addFunctions(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.ABI.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.ABI.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.ABI} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.ABI.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getVersion();

    if (f.length > 0) {
      writer.writeString(1, f);
    }

    f = message.getLanguage();

    if (f.length > 0) {
      writer.writeString(2, f);
    }

    f = message.getFunctionsList();

    if (f.length > 0) {
      writer.writeRepeatedMessage(3, f, proto.types.Function.serializeBinaryToWriter);
    }
  };
  /**
   * optional string version = 1;
   * @return {string}
   */


  proto.types.ABI.prototype.getVersion = function () {
    return (
      /** @type {string} */
      jspb.Message.getFieldWithDefault(this, 1, "")
    );
  };
  /** @param {string} value */


  proto.types.ABI.prototype.setVersion = function (value) {
    jspb.Message.setField(this, 1, value);
  };
  /**
   * optional string language = 2;
   * @return {string}
   */


  proto.types.ABI.prototype.getLanguage = function () {
    return (
      /** @type {string} */
      jspb.Message.getFieldWithDefault(this, 2, "")
    );
  };
  /** @param {string} value */


  proto.types.ABI.prototype.setLanguage = function (value) {
    jspb.Message.setField(this, 2, value);
  };
  /**
   * repeated Function functions = 3;
   * @return {!Array.<!proto.types.Function>}
   */


  proto.types.ABI.prototype.getFunctionsList = function () {
    return (
      /** @type{!Array.<!proto.types.Function>} */
      jspb.Message.getRepeatedWrapperField(this, proto.types.Function, 3)
    );
  };
  /** @param {!Array.<!proto.types.Function>} value */


  proto.types.ABI.prototype.setFunctionsList = function (value) {
    jspb.Message.setRepeatedWrapperField(this, 3, value);
  };
  /**
   * @param {!proto.types.Function=} opt_value
   * @param {number=} opt_index
   * @return {!proto.types.Function}
   */


  proto.types.ABI.prototype.addFunctions = function (opt_value, opt_index) {
    return jspb.Message.addToRepeatedWrapperField(this, 3, opt_value, proto.types.Function, opt_index);
  };

  proto.types.ABI.prototype.clearFunctionsList = function () {
    this.setFunctionsList([]);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.Query = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
  };

  goog.inherits(proto.types.Query, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.Query.displayName = 'proto.types.Query';
  }

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.Query.prototype.toObject = function (opt_includeInstance) {
      return proto.types.Query.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.Query} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.Query.toObject = function (includeInstance, msg) {
      var obj = {
        contractaddress: msg.getContractaddress_asB64(),
        queryinfo: msg.getQueryinfo_asB64()
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.Query}
   */


  proto.types.Query.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.Query();
    return proto.types.Query.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.Query} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.Query}
   */


  proto.types.Query.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setContractaddress(value);
          break;

        case 2:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setQueryinfo(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.Query.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.Query.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.Query} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.Query.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getContractaddress_asU8();

    if (f.length > 0) {
      writer.writeBytes(1, f);
    }

    f = message.getQueryinfo_asU8();

    if (f.length > 0) {
      writer.writeBytes(2, f);
    }
  };
  /**
   * optional bytes contractAddress = 1;
   * @return {!(string|Uint8Array)}
   */


  proto.types.Query.prototype.getContractaddress = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 1, "")
    );
  };
  /**
   * optional bytes contractAddress = 1;
   * This is a type-conversion wrapper around `getContractaddress()`
   * @return {string}
   */


  proto.types.Query.prototype.getContractaddress_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getContractaddress())
    );
  };
  /**
   * optional bytes contractAddress = 1;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getContractaddress()`
   * @return {!Uint8Array}
   */


  proto.types.Query.prototype.getContractaddress_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getContractaddress())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.Query.prototype.setContractaddress = function (value) {
    jspb.Message.setField(this, 1, value);
  };
  /**
   * optional bytes queryinfo = 2;
   * @return {!(string|Uint8Array)}
   */


  proto.types.Query.prototype.getQueryinfo = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 2, "")
    );
  };
  /**
   * optional bytes queryinfo = 2;
   * This is a type-conversion wrapper around `getQueryinfo()`
   * @return {string}
   */


  proto.types.Query.prototype.getQueryinfo_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getQueryinfo())
    );
  };
  /**
   * optional bytes queryinfo = 2;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getQueryinfo()`
   * @return {!Uint8Array}
   */


  proto.types.Query.prototype.getQueryinfo_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getQueryinfo())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.Query.prototype.setQueryinfo = function (value) {
    jspb.Message.setField(this, 2, value);
  };
  /**
   * @enum {number}
   */


  proto.types.TxType = {
    NORMAL: 0,
    GOVERNANCE: 1
  };
  goog.object.extend(exports, proto.types);
});

var account_pb = createCommonjsModule(function (module, exports) {
  /**
   * @fileoverview
   * @enhanceable
   * @suppress {messageConventions} JS Compiler reports an error if a variable or
   *     field starts with 'MSG_' and isn't a translatable message.
   * @public
   */
  // GENERATED CODE -- DO NOT EDIT!
  var goog = jspb;
  var global = Function('return this')();
  goog.exportSymbol('proto.types.Account', null, global);
  goog.exportSymbol('proto.types.AccountList', null, global);
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */

  proto.types.Account = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
  };

  goog.inherits(proto.types.Account, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.Account.displayName = 'proto.types.Account';
  }

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.Account.prototype.toObject = function (opt_includeInstance) {
      return proto.types.Account.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.Account} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.Account.toObject = function (includeInstance, msg) {
      var obj = {
        address: msg.getAddress_asB64()
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.Account}
   */


  proto.types.Account.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.Account();
    return proto.types.Account.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.Account} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.Account}
   */


  proto.types.Account.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setAddress(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.Account.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.Account.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.Account} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.Account.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getAddress_asU8();

    if (f.length > 0) {
      writer.writeBytes(1, f);
    }
  };
  /**
   * optional bytes address = 1;
   * @return {!(string|Uint8Array)}
   */


  proto.types.Account.prototype.getAddress = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 1, "")
    );
  };
  /**
   * optional bytes address = 1;
   * This is a type-conversion wrapper around `getAddress()`
   * @return {string}
   */


  proto.types.Account.prototype.getAddress_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getAddress())
    );
  };
  /**
   * optional bytes address = 1;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getAddress()`
   * @return {!Uint8Array}
   */


  proto.types.Account.prototype.getAddress_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getAddress())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.Account.prototype.setAddress = function (value) {
    jspb.Message.setField(this, 1, value);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.AccountList = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, proto.types.AccountList.repeatedFields_, null);
  };

  goog.inherits(proto.types.AccountList, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.AccountList.displayName = 'proto.types.AccountList';
  }
  /**
   * List of repeated fields within this message type.
   * @private {!Array<number>}
   * @const
   */


  proto.types.AccountList.repeatedFields_ = [1];

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.AccountList.prototype.toObject = function (opt_includeInstance) {
      return proto.types.AccountList.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.AccountList} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.AccountList.toObject = function (includeInstance, msg) {
      var obj = {
        accountsList: jspb.Message.toObjectList(msg.getAccountsList(), proto.types.Account.toObject, includeInstance)
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.AccountList}
   */


  proto.types.AccountList.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.AccountList();
    return proto.types.AccountList.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.AccountList} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.AccountList}
   */


  proto.types.AccountList.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value = new proto.types.Account();
          reader.readMessage(value, proto.types.Account.deserializeBinaryFromReader);
          msg.addAccounts(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.AccountList.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.AccountList.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.AccountList} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.AccountList.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getAccountsList();

    if (f.length > 0) {
      writer.writeRepeatedMessage(1, f, proto.types.Account.serializeBinaryToWriter);
    }
  };
  /**
   * repeated Account accounts = 1;
   * @return {!Array.<!proto.types.Account>}
   */


  proto.types.AccountList.prototype.getAccountsList = function () {
    return (
      /** @type{!Array.<!proto.types.Account>} */
      jspb.Message.getRepeatedWrapperField(this, proto.types.Account, 1)
    );
  };
  /** @param {!Array.<!proto.types.Account>} value */


  proto.types.AccountList.prototype.setAccountsList = function (value) {
    jspb.Message.setRepeatedWrapperField(this, 1, value);
  };
  /**
   * @param {!proto.types.Account=} opt_value
   * @param {number=} opt_index
   * @return {!proto.types.Account}
   */


  proto.types.AccountList.prototype.addAccounts = function (opt_value, opt_index) {
    return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.types.Account, opt_index);
  };

  proto.types.AccountList.prototype.clearAccountsList = function () {
    this.setAccountsList([]);
  };

  goog.object.extend(exports, proto.types);
});

var node_pb = createCommonjsModule(function (module, exports) {
  /**
   * @fileoverview
   * @enhanceable
   * @suppress {messageConventions} JS Compiler reports an error if a variable or
   *     field starts with 'MSG_' and isn't a translatable message.
   * @public
   */
  // GENERATED CODE -- DO NOT EDIT!
  var goog = jspb;
  var global = Function('return this')();
  goog.exportSymbol('proto.types.PeerAddress', null, global);
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */

  proto.types.PeerAddress = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
  };

  goog.inherits(proto.types.PeerAddress, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.PeerAddress.displayName = 'proto.types.PeerAddress';
  }

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.PeerAddress.prototype.toObject = function (opt_includeInstance) {
      return proto.types.PeerAddress.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.PeerAddress} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.PeerAddress.toObject = function (includeInstance, msg) {
      var obj = {
        address: msg.getAddress_asB64(),
        port: jspb.Message.getFieldWithDefault(msg, 2, 0),
        peerid: msg.getPeerid_asB64()
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.PeerAddress}
   */


  proto.types.PeerAddress.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.PeerAddress();
    return proto.types.PeerAddress.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.PeerAddress} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.PeerAddress}
   */


  proto.types.PeerAddress.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setAddress(value);
          break;

        case 2:
          var value =
          /** @type {number} */
          reader.readUint32();
          msg.setPort(value);
          break;

        case 3:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setPeerid(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.PeerAddress.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.PeerAddress.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.PeerAddress} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.PeerAddress.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getAddress_asU8();

    if (f.length > 0) {
      writer.writeBytes(1, f);
    }

    f = message.getPort();

    if (f !== 0) {
      writer.writeUint32(2, f);
    }

    f = message.getPeerid_asU8();

    if (f.length > 0) {
      writer.writeBytes(3, f);
    }
  };
  /**
   * optional bytes address = 1;
   * @return {!(string|Uint8Array)}
   */


  proto.types.PeerAddress.prototype.getAddress = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 1, "")
    );
  };
  /**
   * optional bytes address = 1;
   * This is a type-conversion wrapper around `getAddress()`
   * @return {string}
   */


  proto.types.PeerAddress.prototype.getAddress_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getAddress())
    );
  };
  /**
   * optional bytes address = 1;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getAddress()`
   * @return {!Uint8Array}
   */


  proto.types.PeerAddress.prototype.getAddress_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getAddress())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.PeerAddress.prototype.setAddress = function (value) {
    jspb.Message.setField(this, 1, value);
  };
  /**
   * optional uint32 port = 2;
   * @return {number}
   */


  proto.types.PeerAddress.prototype.getPort = function () {
    return (
      /** @type {number} */
      jspb.Message.getFieldWithDefault(this, 2, 0)
    );
  };
  /** @param {number} value */


  proto.types.PeerAddress.prototype.setPort = function (value) {
    jspb.Message.setField(this, 2, value);
  };
  /**
   * optional bytes peerID = 3;
   * @return {!(string|Uint8Array)}
   */


  proto.types.PeerAddress.prototype.getPeerid = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 3, "")
    );
  };
  /**
   * optional bytes peerID = 3;
   * This is a type-conversion wrapper around `getPeerid()`
   * @return {string}
   */


  proto.types.PeerAddress.prototype.getPeerid_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getPeerid())
    );
  };
  /**
   * optional bytes peerID = 3;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getPeerid()`
   * @return {!Uint8Array}
   */


  proto.types.PeerAddress.prototype.getPeerid_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getPeerid())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.PeerAddress.prototype.setPeerid = function (value) {
    jspb.Message.setField(this, 3, value);
  };

  goog.object.extend(exports, proto.types);
});

var rpc_pb = createCommonjsModule(function (module, exports) {
  /**
   * @fileoverview
   * @enhanceable
   * @suppress {messageConventions} JS Compiler reports an error if a variable or
   *     field starts with 'MSG_' and isn't a translatable message.
   * @public
   */
  // GENERATED CODE -- DO NOT EDIT!
  var goog = jspb;
  var global = Function('return this')();
  goog.exportSymbol('proto.types.AccountAndRoot', null, global);
  goog.exportSymbol('proto.types.BlockHeaderList', null, global);
  goog.exportSymbol('proto.types.BlockchainStatus', null, global);
  goog.exportSymbol('proto.types.CommitResult', null, global);
  goog.exportSymbol('proto.types.CommitResultList', null, global);
  goog.exportSymbol('proto.types.CommitStatus', null, global);
  goog.exportSymbol('proto.types.Empty', null, global);
  goog.exportSymbol('proto.types.ImportFormat', null, global);
  goog.exportSymbol('proto.types.Input', null, global);
  goog.exportSymbol('proto.types.ListParams', null, global);
  goog.exportSymbol('proto.types.Output', null, global);
  goog.exportSymbol('proto.types.PeerList', null, global);
  goog.exportSymbol('proto.types.Personal', null, global);
  goog.exportSymbol('proto.types.SingleBytes', null, global);
  goog.exportSymbol('proto.types.VerifyResult', null, global);
  goog.exportSymbol('proto.types.VerifyStatus', null, global);
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */

  proto.types.BlockchainStatus = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
  };

  goog.inherits(proto.types.BlockchainStatus, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.BlockchainStatus.displayName = 'proto.types.BlockchainStatus';
  }

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.BlockchainStatus.prototype.toObject = function (opt_includeInstance) {
      return proto.types.BlockchainStatus.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.BlockchainStatus} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.BlockchainStatus.toObject = function (includeInstance, msg) {
      var obj = {
        bestBlockHash: msg.getBestBlockHash_asB64(),
        bestHeight: jspb.Message.getFieldWithDefault(msg, 2, 0)
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.BlockchainStatus}
   */


  proto.types.BlockchainStatus.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.BlockchainStatus();
    return proto.types.BlockchainStatus.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.BlockchainStatus} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.BlockchainStatus}
   */


  proto.types.BlockchainStatus.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setBestBlockHash(value);
          break;

        case 2:
          var value =
          /** @type {number} */
          reader.readUint64();
          msg.setBestHeight(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.BlockchainStatus.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.BlockchainStatus.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.BlockchainStatus} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.BlockchainStatus.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getBestBlockHash_asU8();

    if (f.length > 0) {
      writer.writeBytes(1, f);
    }

    f = message.getBestHeight();

    if (f !== 0) {
      writer.writeUint64(2, f);
    }
  };
  /**
   * optional bytes best_block_hash = 1;
   * @return {!(string|Uint8Array)}
   */


  proto.types.BlockchainStatus.prototype.getBestBlockHash = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 1, "")
    );
  };
  /**
   * optional bytes best_block_hash = 1;
   * This is a type-conversion wrapper around `getBestBlockHash()`
   * @return {string}
   */


  proto.types.BlockchainStatus.prototype.getBestBlockHash_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getBestBlockHash())
    );
  };
  /**
   * optional bytes best_block_hash = 1;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getBestBlockHash()`
   * @return {!Uint8Array}
   */


  proto.types.BlockchainStatus.prototype.getBestBlockHash_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getBestBlockHash())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.BlockchainStatus.prototype.setBestBlockHash = function (value) {
    jspb.Message.setField(this, 1, value);
  };
  /**
   * optional uint64 best_height = 2;
   * @return {number}
   */


  proto.types.BlockchainStatus.prototype.getBestHeight = function () {
    return (
      /** @type {number} */
      jspb.Message.getFieldWithDefault(this, 2, 0)
    );
  };
  /** @param {number} value */


  proto.types.BlockchainStatus.prototype.setBestHeight = function (value) {
    jspb.Message.setField(this, 2, value);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.Input = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, proto.types.Input.repeatedFields_, null);
  };

  goog.inherits(proto.types.Input, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.Input.displayName = 'proto.types.Input';
  }
  /**
   * List of repeated fields within this message type.
   * @private {!Array<number>}
   * @const
   */


  proto.types.Input.repeatedFields_ = [2];

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.Input.prototype.toObject = function (opt_includeInstance) {
      return proto.types.Input.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.Input} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.Input.toObject = function (includeInstance, msg) {
      var obj = {
        hash: msg.getHash_asB64(),
        addressList: msg.getAddressList_asB64(),
        value: msg.getValue_asB64(),
        script: msg.getScript_asB64()
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.Input}
   */


  proto.types.Input.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.Input();
    return proto.types.Input.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.Input} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.Input}
   */


  proto.types.Input.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setHash(value);
          break;

        case 2:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.addAddress(value);
          break;

        case 3:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setValue(value);
          break;

        case 4:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setScript(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.Input.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.Input.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.Input} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.Input.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getHash_asU8();

    if (f.length > 0) {
      writer.writeBytes(1, f);
    }

    f = message.getAddressList_asU8();

    if (f.length > 0) {
      writer.writeRepeatedBytes(2, f);
    }

    f = message.getValue_asU8();

    if (f.length > 0) {
      writer.writeBytes(3, f);
    }

    f = message.getScript_asU8();

    if (f.length > 0) {
      writer.writeBytes(4, f);
    }
  };
  /**
   * optional bytes hash = 1;
   * @return {!(string|Uint8Array)}
   */


  proto.types.Input.prototype.getHash = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 1, "")
    );
  };
  /**
   * optional bytes hash = 1;
   * This is a type-conversion wrapper around `getHash()`
   * @return {string}
   */


  proto.types.Input.prototype.getHash_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getHash())
    );
  };
  /**
   * optional bytes hash = 1;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getHash()`
   * @return {!Uint8Array}
   */


  proto.types.Input.prototype.getHash_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getHash())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.Input.prototype.setHash = function (value) {
    jspb.Message.setField(this, 1, value);
  };
  /**
   * repeated bytes address = 2;
   * @return {!(Array<!Uint8Array>|Array<string>)}
   */


  proto.types.Input.prototype.getAddressList = function () {
    return (
      /** @type {!(Array<!Uint8Array>|Array<string>)} */
      jspb.Message.getRepeatedField(this, 2)
    );
  };
  /**
   * repeated bytes address = 2;
   * This is a type-conversion wrapper around `getAddressList()`
   * @return {!Array.<string>}
   */


  proto.types.Input.prototype.getAddressList_asB64 = function () {
    return (
      /** @type {!Array.<string>} */
      jspb.Message.bytesListAsB64(this.getAddressList())
    );
  };
  /**
   * repeated bytes address = 2;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getAddressList()`
   * @return {!Array.<!Uint8Array>}
   */


  proto.types.Input.prototype.getAddressList_asU8 = function () {
    return (
      /** @type {!Array.<!Uint8Array>} */
      jspb.Message.bytesListAsU8(this.getAddressList())
    );
  };
  /** @param {!(Array<!Uint8Array>|Array<string>)} value */


  proto.types.Input.prototype.setAddressList = function (value) {
    jspb.Message.setField(this, 2, value || []);
  };
  /**
   * @param {!(string|Uint8Array)} value
   * @param {number=} opt_index
   */


  proto.types.Input.prototype.addAddress = function (value, opt_index) {
    jspb.Message.addToRepeatedField(this, 2, value, opt_index);
  };

  proto.types.Input.prototype.clearAddressList = function () {
    this.setAddressList([]);
  };
  /**
   * optional bytes value = 3;
   * @return {!(string|Uint8Array)}
   */


  proto.types.Input.prototype.getValue = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 3, "")
    );
  };
  /**
   * optional bytes value = 3;
   * This is a type-conversion wrapper around `getValue()`
   * @return {string}
   */


  proto.types.Input.prototype.getValue_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getValue())
    );
  };
  /**
   * optional bytes value = 3;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getValue()`
   * @return {!Uint8Array}
   */


  proto.types.Input.prototype.getValue_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getValue())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.Input.prototype.setValue = function (value) {
    jspb.Message.setField(this, 3, value);
  };
  /**
   * optional bytes script = 4;
   * @return {!(string|Uint8Array)}
   */


  proto.types.Input.prototype.getScript = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 4, "")
    );
  };
  /**
   * optional bytes script = 4;
   * This is a type-conversion wrapper around `getScript()`
   * @return {string}
   */


  proto.types.Input.prototype.getScript_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getScript())
    );
  };
  /**
   * optional bytes script = 4;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getScript()`
   * @return {!Uint8Array}
   */


  proto.types.Input.prototype.getScript_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getScript())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.Input.prototype.setScript = function (value) {
    jspb.Message.setField(this, 4, value);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.Output = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
  };

  goog.inherits(proto.types.Output, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.Output.displayName = 'proto.types.Output';
  }

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.Output.prototype.toObject = function (opt_includeInstance) {
      return proto.types.Output.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.Output} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.Output.toObject = function (includeInstance, msg) {
      var obj = {
        index: jspb.Message.getFieldWithDefault(msg, 1, 0),
        address: msg.getAddress_asB64(),
        value: msg.getValue_asB64(),
        script: msg.getScript_asB64()
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.Output}
   */


  proto.types.Output.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.Output();
    return proto.types.Output.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.Output} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.Output}
   */


  proto.types.Output.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value =
          /** @type {number} */
          reader.readUint32();
          msg.setIndex(value);
          break;

        case 2:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setAddress(value);
          break;

        case 3:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setValue(value);
          break;

        case 4:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setScript(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.Output.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.Output.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.Output} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.Output.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getIndex();

    if (f !== 0) {
      writer.writeUint32(1, f);
    }

    f = message.getAddress_asU8();

    if (f.length > 0) {
      writer.writeBytes(2, f);
    }

    f = message.getValue_asU8();

    if (f.length > 0) {
      writer.writeBytes(3, f);
    }

    f = message.getScript_asU8();

    if (f.length > 0) {
      writer.writeBytes(4, f);
    }
  };
  /**
   * optional uint32 index = 1;
   * @return {number}
   */


  proto.types.Output.prototype.getIndex = function () {
    return (
      /** @type {number} */
      jspb.Message.getFieldWithDefault(this, 1, 0)
    );
  };
  /** @param {number} value */


  proto.types.Output.prototype.setIndex = function (value) {
    jspb.Message.setField(this, 1, value);
  };
  /**
   * optional bytes address = 2;
   * @return {!(string|Uint8Array)}
   */


  proto.types.Output.prototype.getAddress = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 2, "")
    );
  };
  /**
   * optional bytes address = 2;
   * This is a type-conversion wrapper around `getAddress()`
   * @return {string}
   */


  proto.types.Output.prototype.getAddress_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getAddress())
    );
  };
  /**
   * optional bytes address = 2;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getAddress()`
   * @return {!Uint8Array}
   */


  proto.types.Output.prototype.getAddress_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getAddress())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.Output.prototype.setAddress = function (value) {
    jspb.Message.setField(this, 2, value);
  };
  /**
   * optional bytes value = 3;
   * @return {!(string|Uint8Array)}
   */


  proto.types.Output.prototype.getValue = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 3, "")
    );
  };
  /**
   * optional bytes value = 3;
   * This is a type-conversion wrapper around `getValue()`
   * @return {string}
   */


  proto.types.Output.prototype.getValue_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getValue())
    );
  };
  /**
   * optional bytes value = 3;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getValue()`
   * @return {!Uint8Array}
   */


  proto.types.Output.prototype.getValue_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getValue())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.Output.prototype.setValue = function (value) {
    jspb.Message.setField(this, 3, value);
  };
  /**
   * optional bytes script = 4;
   * @return {!(string|Uint8Array)}
   */


  proto.types.Output.prototype.getScript = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 4, "")
    );
  };
  /**
   * optional bytes script = 4;
   * This is a type-conversion wrapper around `getScript()`
   * @return {string}
   */


  proto.types.Output.prototype.getScript_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getScript())
    );
  };
  /**
   * optional bytes script = 4;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getScript()`
   * @return {!Uint8Array}
   */


  proto.types.Output.prototype.getScript_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getScript())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.Output.prototype.setScript = function (value) {
    jspb.Message.setField(this, 4, value);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.Empty = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
  };

  goog.inherits(proto.types.Empty, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.Empty.displayName = 'proto.types.Empty';
  }

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.Empty.prototype.toObject = function (opt_includeInstance) {
      return proto.types.Empty.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.Empty} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.Empty.toObject = function (includeInstance, msg) {
      var obj = {};

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.Empty}
   */


  proto.types.Empty.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.Empty();
    return proto.types.Empty.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.Empty} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.Empty}
   */


  proto.types.Empty.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.Empty.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.Empty.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.Empty} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.Empty.serializeBinaryToWriter = function (message, writer) {
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.SingleBytes = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
  };

  goog.inherits(proto.types.SingleBytes, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.SingleBytes.displayName = 'proto.types.SingleBytes';
  }

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.SingleBytes.prototype.toObject = function (opt_includeInstance) {
      return proto.types.SingleBytes.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.SingleBytes} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.SingleBytes.toObject = function (includeInstance, msg) {
      var obj = {
        value: msg.getValue_asB64()
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.SingleBytes}
   */


  proto.types.SingleBytes.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.SingleBytes();
    return proto.types.SingleBytes.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.SingleBytes} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.SingleBytes}
   */


  proto.types.SingleBytes.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setValue(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.SingleBytes.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.SingleBytes.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.SingleBytes} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.SingleBytes.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getValue_asU8();

    if (f.length > 0) {
      writer.writeBytes(1, f);
    }
  };
  /**
   * optional bytes value = 1;
   * @return {!(string|Uint8Array)}
   */


  proto.types.SingleBytes.prototype.getValue = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 1, "")
    );
  };
  /**
   * optional bytes value = 1;
   * This is a type-conversion wrapper around `getValue()`
   * @return {string}
   */


  proto.types.SingleBytes.prototype.getValue_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getValue())
    );
  };
  /**
   * optional bytes value = 1;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getValue()`
   * @return {!Uint8Array}
   */


  proto.types.SingleBytes.prototype.getValue_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getValue())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.SingleBytes.prototype.setValue = function (value) {
    jspb.Message.setField(this, 1, value);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.AccountAndRoot = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
  };

  goog.inherits(proto.types.AccountAndRoot, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.AccountAndRoot.displayName = 'proto.types.AccountAndRoot';
  }

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.AccountAndRoot.prototype.toObject = function (opt_includeInstance) {
      return proto.types.AccountAndRoot.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.AccountAndRoot} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.AccountAndRoot.toObject = function (includeInstance, msg) {
      var obj = {
        account: msg.getAccount_asB64(),
        root: msg.getRoot_asB64()
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.AccountAndRoot}
   */


  proto.types.AccountAndRoot.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.AccountAndRoot();
    return proto.types.AccountAndRoot.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.AccountAndRoot} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.AccountAndRoot}
   */


  proto.types.AccountAndRoot.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setAccount(value);
          break;

        case 2:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setRoot(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.AccountAndRoot.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.AccountAndRoot.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.AccountAndRoot} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.AccountAndRoot.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getAccount_asU8();

    if (f.length > 0) {
      writer.writeBytes(1, f);
    }

    f = message.getRoot_asU8();

    if (f.length > 0) {
      writer.writeBytes(2, f);
    }
  };
  /**
   * optional bytes Account = 1;
   * @return {!(string|Uint8Array)}
   */


  proto.types.AccountAndRoot.prototype.getAccount = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 1, "")
    );
  };
  /**
   * optional bytes Account = 1;
   * This is a type-conversion wrapper around `getAccount()`
   * @return {string}
   */


  proto.types.AccountAndRoot.prototype.getAccount_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getAccount())
    );
  };
  /**
   * optional bytes Account = 1;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getAccount()`
   * @return {!Uint8Array}
   */


  proto.types.AccountAndRoot.prototype.getAccount_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getAccount())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.AccountAndRoot.prototype.setAccount = function (value) {
    jspb.Message.setField(this, 1, value);
  };
  /**
   * optional bytes Root = 2;
   * @return {!(string|Uint8Array)}
   */


  proto.types.AccountAndRoot.prototype.getRoot = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 2, "")
    );
  };
  /**
   * optional bytes Root = 2;
   * This is a type-conversion wrapper around `getRoot()`
   * @return {string}
   */


  proto.types.AccountAndRoot.prototype.getRoot_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getRoot())
    );
  };
  /**
   * optional bytes Root = 2;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getRoot()`
   * @return {!Uint8Array}
   */


  proto.types.AccountAndRoot.prototype.getRoot_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getRoot())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.AccountAndRoot.prototype.setRoot = function (value) {
    jspb.Message.setField(this, 2, value);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.PeerList = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, proto.types.PeerList.repeatedFields_, null);
  };

  goog.inherits(proto.types.PeerList, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.PeerList.displayName = 'proto.types.PeerList';
  }
  /**
   * List of repeated fields within this message type.
   * @private {!Array<number>}
   * @const
   */


  proto.types.PeerList.repeatedFields_ = [1, 2];

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.PeerList.prototype.toObject = function (opt_includeInstance) {
      return proto.types.PeerList.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.PeerList} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.PeerList.toObject = function (includeInstance, msg) {
      var obj = {
        peersList: jspb.Message.toObjectList(msg.getPeersList(), node_pb.PeerAddress.toObject, includeInstance),
        statesList: jspb.Message.getRepeatedField(msg, 2)
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.PeerList}
   */


  proto.types.PeerList.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.PeerList();
    return proto.types.PeerList.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.PeerList} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.PeerList}
   */


  proto.types.PeerList.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value = new node_pb.PeerAddress();
          reader.readMessage(value, node_pb.PeerAddress.deserializeBinaryFromReader);
          msg.addPeers(value);
          break;

        case 2:
          var value =
          /** @type {!Array.<number>} */
          reader.readPackedInt32();
          msg.setStatesList(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.PeerList.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.PeerList.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.PeerList} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.PeerList.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getPeersList();

    if (f.length > 0) {
      writer.writeRepeatedMessage(1, f, node_pb.PeerAddress.serializeBinaryToWriter);
    }

    f = message.getStatesList();

    if (f.length > 0) {
      writer.writePackedInt32(2, f);
    }
  };
  /**
   * repeated PeerAddress peers = 1;
   * @return {!Array.<!proto.types.PeerAddress>}
   */


  proto.types.PeerList.prototype.getPeersList = function () {
    return (
      /** @type{!Array.<!proto.types.PeerAddress>} */
      jspb.Message.getRepeatedWrapperField(this, node_pb.PeerAddress, 1)
    );
  };
  /** @param {!Array.<!proto.types.PeerAddress>} value */


  proto.types.PeerList.prototype.setPeersList = function (value) {
    jspb.Message.setRepeatedWrapperField(this, 1, value);
  };
  /**
   * @param {!proto.types.PeerAddress=} opt_value
   * @param {number=} opt_index
   * @return {!proto.types.PeerAddress}
   */


  proto.types.PeerList.prototype.addPeers = function (opt_value, opt_index) {
    return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.types.PeerAddress, opt_index);
  };

  proto.types.PeerList.prototype.clearPeersList = function () {
    this.setPeersList([]);
  };
  /**
   * repeated int32 states = 2;
   * @return {!Array.<number>}
   */


  proto.types.PeerList.prototype.getStatesList = function () {
    return (
      /** @type {!Array.<number>} */
      jspb.Message.getRepeatedField(this, 2)
    );
  };
  /** @param {!Array.<number>} value */


  proto.types.PeerList.prototype.setStatesList = function (value) {
    jspb.Message.setField(this, 2, value || []);
  };
  /**
   * @param {!number} value
   * @param {number=} opt_index
   */


  proto.types.PeerList.prototype.addStates = function (value, opt_index) {
    jspb.Message.addToRepeatedField(this, 2, value, opt_index);
  };

  proto.types.PeerList.prototype.clearStatesList = function () {
    this.setStatesList([]);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.ListParams = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
  };

  goog.inherits(proto.types.ListParams, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.ListParams.displayName = 'proto.types.ListParams';
  }

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.ListParams.prototype.toObject = function (opt_includeInstance) {
      return proto.types.ListParams.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.ListParams} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.ListParams.toObject = function (includeInstance, msg) {
      var obj = {
        hash: msg.getHash_asB64(),
        height: jspb.Message.getFieldWithDefault(msg, 2, 0),
        size: jspb.Message.getFieldWithDefault(msg, 3, 0),
        offset: jspb.Message.getFieldWithDefault(msg, 4, 0),
        asc: jspb.Message.getFieldWithDefault(msg, 5, false)
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.ListParams}
   */


  proto.types.ListParams.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.ListParams();
    return proto.types.ListParams.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.ListParams} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.ListParams}
   */


  proto.types.ListParams.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setHash(value);
          break;

        case 2:
          var value =
          /** @type {number} */
          reader.readUint64();
          msg.setHeight(value);
          break;

        case 3:
          var value =
          /** @type {number} */
          reader.readUint32();
          msg.setSize(value);
          break;

        case 4:
          var value =
          /** @type {number} */
          reader.readUint32();
          msg.setOffset(value);
          break;

        case 5:
          var value =
          /** @type {boolean} */
          reader.readBool();
          msg.setAsc(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.ListParams.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.ListParams.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.ListParams} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.ListParams.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getHash_asU8();

    if (f.length > 0) {
      writer.writeBytes(1, f);
    }

    f = message.getHeight();

    if (f !== 0) {
      writer.writeUint64(2, f);
    }

    f = message.getSize();

    if (f !== 0) {
      writer.writeUint32(3, f);
    }

    f = message.getOffset();

    if (f !== 0) {
      writer.writeUint32(4, f);
    }

    f = message.getAsc();

    if (f) {
      writer.writeBool(5, f);
    }
  };
  /**
   * optional bytes hash = 1;
   * @return {!(string|Uint8Array)}
   */


  proto.types.ListParams.prototype.getHash = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 1, "")
    );
  };
  /**
   * optional bytes hash = 1;
   * This is a type-conversion wrapper around `getHash()`
   * @return {string}
   */


  proto.types.ListParams.prototype.getHash_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getHash())
    );
  };
  /**
   * optional bytes hash = 1;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getHash()`
   * @return {!Uint8Array}
   */


  proto.types.ListParams.prototype.getHash_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getHash())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.ListParams.prototype.setHash = function (value) {
    jspb.Message.setField(this, 1, value);
  };
  /**
   * optional uint64 height = 2;
   * @return {number}
   */


  proto.types.ListParams.prototype.getHeight = function () {
    return (
      /** @type {number} */
      jspb.Message.getFieldWithDefault(this, 2, 0)
    );
  };
  /** @param {number} value */


  proto.types.ListParams.prototype.setHeight = function (value) {
    jspb.Message.setField(this, 2, value);
  };
  /**
   * optional uint32 size = 3;
   * @return {number}
   */


  proto.types.ListParams.prototype.getSize = function () {
    return (
      /** @type {number} */
      jspb.Message.getFieldWithDefault(this, 3, 0)
    );
  };
  /** @param {number} value */


  proto.types.ListParams.prototype.setSize = function (value) {
    jspb.Message.setField(this, 3, value);
  };
  /**
   * optional uint32 offset = 4;
   * @return {number}
   */


  proto.types.ListParams.prototype.getOffset = function () {
    return (
      /** @type {number} */
      jspb.Message.getFieldWithDefault(this, 4, 0)
    );
  };
  /** @param {number} value */


  proto.types.ListParams.prototype.setOffset = function (value) {
    jspb.Message.setField(this, 4, value);
  };
  /**
   * optional bool asc = 5;
   * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
   * You should avoid comparisons like {@code val === true/false} in those cases.
   * @return {boolean}
   */


  proto.types.ListParams.prototype.getAsc = function () {
    return (
      /** @type {boolean} */
      jspb.Message.getFieldWithDefault(this, 5, false)
    );
  };
  /** @param {boolean} value */


  proto.types.ListParams.prototype.setAsc = function (value) {
    jspb.Message.setField(this, 5, value);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.BlockHeaderList = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, proto.types.BlockHeaderList.repeatedFields_, null);
  };

  goog.inherits(proto.types.BlockHeaderList, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.BlockHeaderList.displayName = 'proto.types.BlockHeaderList';
  }
  /**
   * List of repeated fields within this message type.
   * @private {!Array<number>}
   * @const
   */


  proto.types.BlockHeaderList.repeatedFields_ = [1];

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.BlockHeaderList.prototype.toObject = function (opt_includeInstance) {
      return proto.types.BlockHeaderList.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.BlockHeaderList} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.BlockHeaderList.toObject = function (includeInstance, msg) {
      var obj = {
        blocksList: jspb.Message.toObjectList(msg.getBlocksList(), blockchain_pb.Block.toObject, includeInstance)
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.BlockHeaderList}
   */


  proto.types.BlockHeaderList.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.BlockHeaderList();
    return proto.types.BlockHeaderList.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.BlockHeaderList} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.BlockHeaderList}
   */


  proto.types.BlockHeaderList.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value = new blockchain_pb.Block();
          reader.readMessage(value, blockchain_pb.Block.deserializeBinaryFromReader);
          msg.addBlocks(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.BlockHeaderList.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.BlockHeaderList.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.BlockHeaderList} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.BlockHeaderList.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getBlocksList();

    if (f.length > 0) {
      writer.writeRepeatedMessage(1, f, blockchain_pb.Block.serializeBinaryToWriter);
    }
  };
  /**
   * repeated Block blocks = 1;
   * @return {!Array.<!proto.types.Block>}
   */


  proto.types.BlockHeaderList.prototype.getBlocksList = function () {
    return (
      /** @type{!Array.<!proto.types.Block>} */
      jspb.Message.getRepeatedWrapperField(this, blockchain_pb.Block, 1)
    );
  };
  /** @param {!Array.<!proto.types.Block>} value */


  proto.types.BlockHeaderList.prototype.setBlocksList = function (value) {
    jspb.Message.setRepeatedWrapperField(this, 1, value);
  };
  /**
   * @param {!proto.types.Block=} opt_value
   * @param {number=} opt_index
   * @return {!proto.types.Block}
   */


  proto.types.BlockHeaderList.prototype.addBlocks = function (opt_value, opt_index) {
    return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.types.Block, opt_index);
  };

  proto.types.BlockHeaderList.prototype.clearBlocksList = function () {
    this.setBlocksList([]);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.CommitResult = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
  };

  goog.inherits(proto.types.CommitResult, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.CommitResult.displayName = 'proto.types.CommitResult';
  }

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.CommitResult.prototype.toObject = function (opt_includeInstance) {
      return proto.types.CommitResult.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.CommitResult} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.CommitResult.toObject = function (includeInstance, msg) {
      var obj = {
        hash: msg.getHash_asB64(),
        error: jspb.Message.getFieldWithDefault(msg, 2, 0),
        detail: jspb.Message.getFieldWithDefault(msg, 3, "")
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.CommitResult}
   */


  proto.types.CommitResult.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.CommitResult();
    return proto.types.CommitResult.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.CommitResult} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.CommitResult}
   */


  proto.types.CommitResult.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setHash(value);
          break;

        case 2:
          var value =
          /** @type {!proto.types.CommitStatus} */
          reader.readEnum();
          msg.setError(value);
          break;

        case 3:
          var value =
          /** @type {string} */
          reader.readString();
          msg.setDetail(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.CommitResult.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.CommitResult.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.CommitResult} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.CommitResult.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getHash_asU8();

    if (f.length > 0) {
      writer.writeBytes(1, f);
    }

    f = message.getError();

    if (f !== 0.0) {
      writer.writeEnum(2, f);
    }

    f = message.getDetail();

    if (f.length > 0) {
      writer.writeString(3, f);
    }
  };
  /**
   * optional bytes hash = 1;
   * @return {!(string|Uint8Array)}
   */


  proto.types.CommitResult.prototype.getHash = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 1, "")
    );
  };
  /**
   * optional bytes hash = 1;
   * This is a type-conversion wrapper around `getHash()`
   * @return {string}
   */


  proto.types.CommitResult.prototype.getHash_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getHash())
    );
  };
  /**
   * optional bytes hash = 1;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getHash()`
   * @return {!Uint8Array}
   */


  proto.types.CommitResult.prototype.getHash_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getHash())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.CommitResult.prototype.setHash = function (value) {
    jspb.Message.setField(this, 1, value);
  };
  /**
   * optional CommitStatus error = 2;
   * @return {!proto.types.CommitStatus}
   */


  proto.types.CommitResult.prototype.getError = function () {
    return (
      /** @type {!proto.types.CommitStatus} */
      jspb.Message.getFieldWithDefault(this, 2, 0)
    );
  };
  /** @param {!proto.types.CommitStatus} value */


  proto.types.CommitResult.prototype.setError = function (value) {
    jspb.Message.setField(this, 2, value);
  };
  /**
   * optional string detail = 3;
   * @return {string}
   */


  proto.types.CommitResult.prototype.getDetail = function () {
    return (
      /** @type {string} */
      jspb.Message.getFieldWithDefault(this, 3, "")
    );
  };
  /** @param {string} value */


  proto.types.CommitResult.prototype.setDetail = function (value) {
    jspb.Message.setField(this, 3, value);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.CommitResultList = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, proto.types.CommitResultList.repeatedFields_, null);
  };

  goog.inherits(proto.types.CommitResultList, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.CommitResultList.displayName = 'proto.types.CommitResultList';
  }
  /**
   * List of repeated fields within this message type.
   * @private {!Array<number>}
   * @const
   */


  proto.types.CommitResultList.repeatedFields_ = [1];

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.CommitResultList.prototype.toObject = function (opt_includeInstance) {
      return proto.types.CommitResultList.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.CommitResultList} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.CommitResultList.toObject = function (includeInstance, msg) {
      var obj = {
        resultsList: jspb.Message.toObjectList(msg.getResultsList(), proto.types.CommitResult.toObject, includeInstance)
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.CommitResultList}
   */


  proto.types.CommitResultList.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.CommitResultList();
    return proto.types.CommitResultList.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.CommitResultList} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.CommitResultList}
   */


  proto.types.CommitResultList.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value = new proto.types.CommitResult();
          reader.readMessage(value, proto.types.CommitResult.deserializeBinaryFromReader);
          msg.addResults(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.CommitResultList.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.CommitResultList.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.CommitResultList} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.CommitResultList.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getResultsList();

    if (f.length > 0) {
      writer.writeRepeatedMessage(1, f, proto.types.CommitResult.serializeBinaryToWriter);
    }
  };
  /**
   * repeated CommitResult results = 1;
   * @return {!Array.<!proto.types.CommitResult>}
   */


  proto.types.CommitResultList.prototype.getResultsList = function () {
    return (
      /** @type{!Array.<!proto.types.CommitResult>} */
      jspb.Message.getRepeatedWrapperField(this, proto.types.CommitResult, 1)
    );
  };
  /** @param {!Array.<!proto.types.CommitResult>} value */


  proto.types.CommitResultList.prototype.setResultsList = function (value) {
    jspb.Message.setRepeatedWrapperField(this, 1, value);
  };
  /**
   * @param {!proto.types.CommitResult=} opt_value
   * @param {number=} opt_index
   * @return {!proto.types.CommitResult}
   */


  proto.types.CommitResultList.prototype.addResults = function (opt_value, opt_index) {
    return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.types.CommitResult, opt_index);
  };

  proto.types.CommitResultList.prototype.clearResultsList = function () {
    this.setResultsList([]);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.VerifyResult = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
  };

  goog.inherits(proto.types.VerifyResult, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.VerifyResult.displayName = 'proto.types.VerifyResult';
  }

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.VerifyResult.prototype.toObject = function (opt_includeInstance) {
      return proto.types.VerifyResult.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.VerifyResult} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.VerifyResult.toObject = function (includeInstance, msg) {
      var f,
          obj = {
        tx: (f = msg.getTx()) && blockchain_pb.Tx.toObject(includeInstance, f),
        error: jspb.Message.getFieldWithDefault(msg, 2, 0)
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.VerifyResult}
   */


  proto.types.VerifyResult.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.VerifyResult();
    return proto.types.VerifyResult.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.VerifyResult} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.VerifyResult}
   */


  proto.types.VerifyResult.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value = new blockchain_pb.Tx();
          reader.readMessage(value, blockchain_pb.Tx.deserializeBinaryFromReader);
          msg.setTx(value);
          break;

        case 2:
          var value =
          /** @type {!proto.types.VerifyStatus} */
          reader.readEnum();
          msg.setError(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.VerifyResult.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.VerifyResult.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.VerifyResult} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.VerifyResult.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getTx();

    if (f != null) {
      writer.writeMessage(1, f, blockchain_pb.Tx.serializeBinaryToWriter);
    }

    f = message.getError();

    if (f !== 0.0) {
      writer.writeEnum(2, f);
    }
  };
  /**
   * optional Tx tx = 1;
   * @return {?proto.types.Tx}
   */


  proto.types.VerifyResult.prototype.getTx = function () {
    return (
      /** @type{?proto.types.Tx} */
      jspb.Message.getWrapperField(this, blockchain_pb.Tx, 1)
    );
  };
  /** @param {?proto.types.Tx|undefined} value */


  proto.types.VerifyResult.prototype.setTx = function (value) {
    jspb.Message.setWrapperField(this, 1, value);
  };

  proto.types.VerifyResult.prototype.clearTx = function () {
    this.setTx(undefined);
  };
  /**
   * Returns whether this field is set.
   * @return {!boolean}
   */


  proto.types.VerifyResult.prototype.hasTx = function () {
    return jspb.Message.getField(this, 1) != null;
  };
  /**
   * optional VerifyStatus error = 2;
   * @return {!proto.types.VerifyStatus}
   */


  proto.types.VerifyResult.prototype.getError = function () {
    return (
      /** @type {!proto.types.VerifyStatus} */
      jspb.Message.getFieldWithDefault(this, 2, 0)
    );
  };
  /** @param {!proto.types.VerifyStatus} value */


  proto.types.VerifyResult.prototype.setError = function (value) {
    jspb.Message.setField(this, 2, value);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.Personal = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
  };

  goog.inherits(proto.types.Personal, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.Personal.displayName = 'proto.types.Personal';
  }

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.Personal.prototype.toObject = function (opt_includeInstance) {
      return proto.types.Personal.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.Personal} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.Personal.toObject = function (includeInstance, msg) {
      var f,
          obj = {
        passphrase: jspb.Message.getFieldWithDefault(msg, 1, ""),
        account: (f = msg.getAccount()) && account_pb.Account.toObject(includeInstance, f)
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.Personal}
   */


  proto.types.Personal.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.Personal();
    return proto.types.Personal.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.Personal} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.Personal}
   */


  proto.types.Personal.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value =
          /** @type {string} */
          reader.readString();
          msg.setPassphrase(value);
          break;

        case 2:
          var value = new account_pb.Account();
          reader.readMessage(value, account_pb.Account.deserializeBinaryFromReader);
          msg.setAccount(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.Personal.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.Personal.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.Personal} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.Personal.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getPassphrase();

    if (f.length > 0) {
      writer.writeString(1, f);
    }

    f = message.getAccount();

    if (f != null) {
      writer.writeMessage(2, f, account_pb.Account.serializeBinaryToWriter);
    }
  };
  /**
   * optional string passphrase = 1;
   * @return {string}
   */


  proto.types.Personal.prototype.getPassphrase = function () {
    return (
      /** @type {string} */
      jspb.Message.getFieldWithDefault(this, 1, "")
    );
  };
  /** @param {string} value */


  proto.types.Personal.prototype.setPassphrase = function (value) {
    jspb.Message.setField(this, 1, value);
  };
  /**
   * optional Account account = 2;
   * @return {?proto.types.Account}
   */


  proto.types.Personal.prototype.getAccount = function () {
    return (
      /** @type{?proto.types.Account} */
      jspb.Message.getWrapperField(this, account_pb.Account, 2)
    );
  };
  /** @param {?proto.types.Account|undefined} value */


  proto.types.Personal.prototype.setAccount = function (value) {
    jspb.Message.setWrapperField(this, 2, value);
  };

  proto.types.Personal.prototype.clearAccount = function () {
    this.setAccount(undefined);
  };
  /**
   * Returns whether this field is set.
   * @return {!boolean}
   */


  proto.types.Personal.prototype.hasAccount = function () {
    return jspb.Message.getField(this, 2) != null;
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.ImportFormat = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
  };

  goog.inherits(proto.types.ImportFormat, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.ImportFormat.displayName = 'proto.types.ImportFormat';
  }

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.ImportFormat.prototype.toObject = function (opt_includeInstance) {
      return proto.types.ImportFormat.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.ImportFormat} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.ImportFormat.toObject = function (includeInstance, msg) {
      var f,
          obj = {
        wif: (f = msg.getWif()) && proto.types.SingleBytes.toObject(includeInstance, f),
        oldpass: jspb.Message.getFieldWithDefault(msg, 2, ""),
        newpass: jspb.Message.getFieldWithDefault(msg, 3, "")
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.ImportFormat}
   */


  proto.types.ImportFormat.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.ImportFormat();
    return proto.types.ImportFormat.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.ImportFormat} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.ImportFormat}
   */


  proto.types.ImportFormat.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value = new proto.types.SingleBytes();
          reader.readMessage(value, proto.types.SingleBytes.deserializeBinaryFromReader);
          msg.setWif(value);
          break;

        case 2:
          var value =
          /** @type {string} */
          reader.readString();
          msg.setOldpass(value);
          break;

        case 3:
          var value =
          /** @type {string} */
          reader.readString();
          msg.setNewpass(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.ImportFormat.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.ImportFormat.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.ImportFormat} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.ImportFormat.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getWif();

    if (f != null) {
      writer.writeMessage(1, f, proto.types.SingleBytes.serializeBinaryToWriter);
    }

    f = message.getOldpass();

    if (f.length > 0) {
      writer.writeString(2, f);
    }

    f = message.getNewpass();

    if (f.length > 0) {
      writer.writeString(3, f);
    }
  };
  /**
   * optional SingleBytes wif = 1;
   * @return {?proto.types.SingleBytes}
   */


  proto.types.ImportFormat.prototype.getWif = function () {
    return (
      /** @type{?proto.types.SingleBytes} */
      jspb.Message.getWrapperField(this, proto.types.SingleBytes, 1)
    );
  };
  /** @param {?proto.types.SingleBytes|undefined} value */


  proto.types.ImportFormat.prototype.setWif = function (value) {
    jspb.Message.setWrapperField(this, 1, value);
  };

  proto.types.ImportFormat.prototype.clearWif = function () {
    this.setWif(undefined);
  };
  /**
   * Returns whether this field is set.
   * @return {!boolean}
   */


  proto.types.ImportFormat.prototype.hasWif = function () {
    return jspb.Message.getField(this, 1) != null;
  };
  /**
   * optional string oldpass = 2;
   * @return {string}
   */


  proto.types.ImportFormat.prototype.getOldpass = function () {
    return (
      /** @type {string} */
      jspb.Message.getFieldWithDefault(this, 2, "")
    );
  };
  /** @param {string} value */


  proto.types.ImportFormat.prototype.setOldpass = function (value) {
    jspb.Message.setField(this, 2, value);
  };
  /**
   * optional string newpass = 3;
   * @return {string}
   */


  proto.types.ImportFormat.prototype.getNewpass = function () {
    return (
      /** @type {string} */
      jspb.Message.getFieldWithDefault(this, 3, "")
    );
  };
  /** @param {string} value */


  proto.types.ImportFormat.prototype.setNewpass = function (value) {
    jspb.Message.setField(this, 3, value);
  };
  /**
   * @enum {number}
   */


  proto.types.CommitStatus = {
    TX_OK: 0,
    TX_NONCE_TOO_LOW: 1,
    TX_ALREADY_EXISTS: 2,
    TX_INVALID_HASH: 3,
    TX_INVALID_SIGN: 4,
    TX_INVALID_FORMAT: 5,
    TX_INSUFFICIENT_BALANCE: 6,
    TX_INTERNAL_ERROR: 7
  };
  /**
   * @enum {number}
   */

  proto.types.VerifyStatus = {
    VERIFY_STATUS_OK: 0,
    VERIFY_STATUS_SIGN_NOT_MATCH: 1,
    VERIFY_STATUS_INVALID_HASH: 2
  };
  goog.object.extend(exports, proto.types);
});
var rpc_pb_1 = rpc_pb.Empty;
var rpc_pb_2 = rpc_pb.Personal;
var rpc_pb_3 = rpc_pb.Account;
var rpc_pb_4 = rpc_pb.SingleBytes;
var rpc_pb_5 = rpc_pb.TxList;
var rpc_pb_6 = rpc_pb.TxBody;
var rpc_pb_7 = rpc_pb.Tx;
var rpc_pb_8 = rpc_pb.CommitStatus;
var rpc_pb_9 = rpc_pb.ListParams;
var rpc_pb_10 = rpc_pb.Query;

var typesNode = /*#__PURE__*/Object.freeze({
	default: rpc_pb,
	__moduleExports: rpc_pb,
	Empty: rpc_pb_1,
	Personal: rpc_pb_2,
	Account: rpc_pb_3,
	SingleBytes: rpc_pb_4,
	TxList: rpc_pb_5,
	TxBody: rpc_pb_6,
	Tx: rpc_pb_7,
	CommitStatus: rpc_pb_8,
	ListParams: rpc_pb_9,
	Query: rpc_pb_10
});

// shim for using process in browser
// based off https://github.com/defunctzombie/node-process/blob/master/browser.js

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
var cachedSetTimeout = defaultSetTimout;
var cachedClearTimeout = defaultClearTimeout;
if (typeof global$1.setTimeout === 'function') {
    cachedSetTimeout = setTimeout;
}
if (typeof global$1.clearTimeout === 'function') {
    cachedClearTimeout = clearTimeout;
}

function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}
function nextTick(fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
}
// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
var title = 'browser';
var platform = 'browser';
var browser = true;
var env = {};
var argv = [];
var version = ''; // empty string to avoid regexp issues
var versions = {};
var release = {};
var config = {};

function noop() {}

var on = noop;
var addListener = noop;
var once = noop;
var off = noop;
var removeListener = noop;
var removeAllListeners = noop;
var emit = noop;

function binding(name) {
    throw new Error('process.binding is not supported');
}

function cwd () { return '/' }
function chdir (dir) {
    throw new Error('process.chdir is not supported');
}function umask() { return 0; }

// from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
var performance = global$1.performance || {};
var performanceNow =
  performance.now        ||
  performance.mozNow     ||
  performance.msNow      ||
  performance.oNow       ||
  performance.webkitNow  ||
  function(){ return (new Date()).getTime() };

// generate timestamp or delta
// see http://nodejs.org/api/process.html#process_process_hrtime
function hrtime(previousTimestamp){
  var clocktime = performanceNow.call(performance)*1e-3;
  var seconds = Math.floor(clocktime);
  var nanoseconds = Math.floor((clocktime%1)*1e9);
  if (previousTimestamp) {
    seconds = seconds - previousTimestamp[0];
    nanoseconds = nanoseconds - previousTimestamp[1];
    if (nanoseconds<0) {
      seconds--;
      nanoseconds += 1e9;
    }
  }
  return [seconds,nanoseconds]
}

var startTime = new Date();
function uptime() {
  var currentTime = new Date();
  var dif = currentTime - startTime;
  return dif / 1000;
}

var process = {
  nextTick: nextTick,
  title: title,
  browser: browser,
  env: env,
  argv: argv,
  version: version,
  versions: versions,
  on: on,
  addListener: addListener,
  once: once,
  off: off,
  removeListener: removeListener,
  removeAllListeners: removeAllListeners,
  emit: emit,
  binding: binding,
  cwd: cwd,
  chdir: chdir,
  umask: umask,
  hrtime: hrtime,
  platform: platform,
  release: release,
  config: config,
  uptime: uptime
};

var blockchain_pb$1 = createCommonjsModule(function (module, exports) {
  /**
   * @fileoverview
   * @enhanceable
   * @suppress {messageConventions} JS Compiler reports an error if a variable or
   *     field starts with 'MSG_' and isn't a translatable message.
   * @public
   */
  // GENERATED CODE -- DO NOT EDIT!
  var goog = jspb;
  var global = Function('return this')();
  goog.exportSymbol('proto.types.ABI', null, global);
  goog.exportSymbol('proto.types.Block', null, global);
  goog.exportSymbol('proto.types.BlockBody', null, global);
  goog.exportSymbol('proto.types.BlockHeader', null, global);
  goog.exportSymbol('proto.types.FnArgument', null, global);
  goog.exportSymbol('proto.types.Function', null, global);
  goog.exportSymbol('proto.types.Query', null, global);
  goog.exportSymbol('proto.types.Receipt', null, global);
  goog.exportSymbol('proto.types.State', null, global);
  goog.exportSymbol('proto.types.StateProof', null, global);
  goog.exportSymbol('proto.types.Tx', null, global);
  goog.exportSymbol('proto.types.TxBody', null, global);
  goog.exportSymbol('proto.types.TxIdx', null, global);
  goog.exportSymbol('proto.types.TxInBlock', null, global);
  goog.exportSymbol('proto.types.TxList', null, global);
  goog.exportSymbol('proto.types.TxType', null, global);
  goog.exportSymbol('proto.types.Vote', null, global);
  goog.exportSymbol('proto.types.VoteList', null, global);
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */

  proto.types.Block = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
  };

  goog.inherits(proto.types.Block, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.Block.displayName = 'proto.types.Block';
  }

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.Block.prototype.toObject = function (opt_includeInstance) {
      return proto.types.Block.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.Block} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.Block.toObject = function (includeInstance, msg) {
      var f,
          obj = {
        hash: msg.getHash_asB64(),
        header: (f = msg.getHeader()) && proto.types.BlockHeader.toObject(includeInstance, f),
        body: (f = msg.getBody()) && proto.types.BlockBody.toObject(includeInstance, f)
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.Block}
   */


  proto.types.Block.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.Block();
    return proto.types.Block.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.Block} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.Block}
   */


  proto.types.Block.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setHash(value);
          break;

        case 2:
          var value = new proto.types.BlockHeader();
          reader.readMessage(value, proto.types.BlockHeader.deserializeBinaryFromReader);
          msg.setHeader(value);
          break;

        case 3:
          var value = new proto.types.BlockBody();
          reader.readMessage(value, proto.types.BlockBody.deserializeBinaryFromReader);
          msg.setBody(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.Block.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.Block.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.Block} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.Block.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getHash_asU8();

    if (f.length > 0) {
      writer.writeBytes(1, f);
    }

    f = message.getHeader();

    if (f != null) {
      writer.writeMessage(2, f, proto.types.BlockHeader.serializeBinaryToWriter);
    }

    f = message.getBody();

    if (f != null) {
      writer.writeMessage(3, f, proto.types.BlockBody.serializeBinaryToWriter);
    }
  };
  /**
   * optional bytes hash = 1;
   * @return {!(string|Uint8Array)}
   */


  proto.types.Block.prototype.getHash = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 1, "")
    );
  };
  /**
   * optional bytes hash = 1;
   * This is a type-conversion wrapper around `getHash()`
   * @return {string}
   */


  proto.types.Block.prototype.getHash_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getHash())
    );
  };
  /**
   * optional bytes hash = 1;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getHash()`
   * @return {!Uint8Array}
   */


  proto.types.Block.prototype.getHash_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getHash())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.Block.prototype.setHash = function (value) {
    jspb.Message.setField(this, 1, value);
  };
  /**
   * optional BlockHeader header = 2;
   * @return {?proto.types.BlockHeader}
   */


  proto.types.Block.prototype.getHeader = function () {
    return (
      /** @type{?proto.types.BlockHeader} */
      jspb.Message.getWrapperField(this, proto.types.BlockHeader, 2)
    );
  };
  /** @param {?proto.types.BlockHeader|undefined} value */


  proto.types.Block.prototype.setHeader = function (value) {
    jspb.Message.setWrapperField(this, 2, value);
  };

  proto.types.Block.prototype.clearHeader = function () {
    this.setHeader(undefined);
  };
  /**
   * Returns whether this field is set.
   * @return {!boolean}
   */


  proto.types.Block.prototype.hasHeader = function () {
    return jspb.Message.getField(this, 2) != null;
  };
  /**
   * optional BlockBody body = 3;
   * @return {?proto.types.BlockBody}
   */


  proto.types.Block.prototype.getBody = function () {
    return (
      /** @type{?proto.types.BlockBody} */
      jspb.Message.getWrapperField(this, proto.types.BlockBody, 3)
    );
  };
  /** @param {?proto.types.BlockBody|undefined} value */


  proto.types.Block.prototype.setBody = function (value) {
    jspb.Message.setWrapperField(this, 3, value);
  };

  proto.types.Block.prototype.clearBody = function () {
    this.setBody(undefined);
  };
  /**
   * Returns whether this field is set.
   * @return {!boolean}
   */


  proto.types.Block.prototype.hasBody = function () {
    return jspb.Message.getField(this, 3) != null;
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.BlockHeader = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
  };

  goog.inherits(proto.types.BlockHeader, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.BlockHeader.displayName = 'proto.types.BlockHeader';
  }

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.BlockHeader.prototype.toObject = function (opt_includeInstance) {
      return proto.types.BlockHeader.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.BlockHeader} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.BlockHeader.toObject = function (includeInstance, msg) {
      var obj = {
        prevblockhash: msg.getPrevblockhash_asB64(),
        blockno: jspb.Message.getFieldWithDefault(msg, 2, 0),
        timestamp: jspb.Message.getFieldWithDefault(msg, 3, 0),
        blocksroothash: msg.getBlocksroothash_asB64(),
        txsroothash: msg.getTxsroothash_asB64(),
        receiptsroothash: msg.getReceiptsroothash_asB64(),
        confirms: jspb.Message.getFieldWithDefault(msg, 7, 0),
        pubkey: msg.getPubkey_asB64(),
        sign: msg.getSign_asB64(),
        coinbaseaccount: msg.getCoinbaseaccount_asB64()
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.BlockHeader}
   */


  proto.types.BlockHeader.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.BlockHeader();
    return proto.types.BlockHeader.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.BlockHeader} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.BlockHeader}
   */


  proto.types.BlockHeader.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setPrevblockhash(value);
          break;

        case 2:
          var value =
          /** @type {number} */
          reader.readUint64();
          msg.setBlockno(value);
          break;

        case 3:
          var value =
          /** @type {number} */
          reader.readInt64();
          msg.setTimestamp(value);
          break;

        case 4:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setBlocksroothash(value);
          break;

        case 5:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setTxsroothash(value);
          break;

        case 6:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setReceiptsroothash(value);
          break;

        case 7:
          var value =
          /** @type {number} */
          reader.readUint64();
          msg.setConfirms(value);
          break;

        case 8:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setPubkey(value);
          break;

        case 9:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setSign(value);
          break;

        case 10:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setCoinbaseaccount(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.BlockHeader.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.BlockHeader.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.BlockHeader} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.BlockHeader.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getPrevblockhash_asU8();

    if (f.length > 0) {
      writer.writeBytes(1, f);
    }

    f = message.getBlockno();

    if (f !== 0) {
      writer.writeUint64(2, f);
    }

    f = message.getTimestamp();

    if (f !== 0) {
      writer.writeInt64(3, f);
    }

    f = message.getBlocksroothash_asU8();

    if (f.length > 0) {
      writer.writeBytes(4, f);
    }

    f = message.getTxsroothash_asU8();

    if (f.length > 0) {
      writer.writeBytes(5, f);
    }

    f = message.getReceiptsroothash_asU8();

    if (f.length > 0) {
      writer.writeBytes(6, f);
    }

    f = message.getConfirms();

    if (f !== 0) {
      writer.writeUint64(7, f);
    }

    f = message.getPubkey_asU8();

    if (f.length > 0) {
      writer.writeBytes(8, f);
    }

    f = message.getSign_asU8();

    if (f.length > 0) {
      writer.writeBytes(9, f);
    }

    f = message.getCoinbaseaccount_asU8();

    if (f.length > 0) {
      writer.writeBytes(10, f);
    }
  };
  /**
   * optional bytes prevBlockHash = 1;
   * @return {!(string|Uint8Array)}
   */


  proto.types.BlockHeader.prototype.getPrevblockhash = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 1, "")
    );
  };
  /**
   * optional bytes prevBlockHash = 1;
   * This is a type-conversion wrapper around `getPrevblockhash()`
   * @return {string}
   */


  proto.types.BlockHeader.prototype.getPrevblockhash_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getPrevblockhash())
    );
  };
  /**
   * optional bytes prevBlockHash = 1;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getPrevblockhash()`
   * @return {!Uint8Array}
   */


  proto.types.BlockHeader.prototype.getPrevblockhash_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getPrevblockhash())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.BlockHeader.prototype.setPrevblockhash = function (value) {
    jspb.Message.setField(this, 1, value);
  };
  /**
   * optional uint64 blockNo = 2;
   * @return {number}
   */


  proto.types.BlockHeader.prototype.getBlockno = function () {
    return (
      /** @type {number} */
      jspb.Message.getFieldWithDefault(this, 2, 0)
    );
  };
  /** @param {number} value */


  proto.types.BlockHeader.prototype.setBlockno = function (value) {
    jspb.Message.setField(this, 2, value);
  };
  /**
   * optional int64 timestamp = 3;
   * @return {number}
   */


  proto.types.BlockHeader.prototype.getTimestamp = function () {
    return (
      /** @type {number} */
      jspb.Message.getFieldWithDefault(this, 3, 0)
    );
  };
  /** @param {number} value */


  proto.types.BlockHeader.prototype.setTimestamp = function (value) {
    jspb.Message.setField(this, 3, value);
  };
  /**
   * optional bytes blocksRootHash = 4;
   * @return {!(string|Uint8Array)}
   */


  proto.types.BlockHeader.prototype.getBlocksroothash = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 4, "")
    );
  };
  /**
   * optional bytes blocksRootHash = 4;
   * This is a type-conversion wrapper around `getBlocksroothash()`
   * @return {string}
   */


  proto.types.BlockHeader.prototype.getBlocksroothash_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getBlocksroothash())
    );
  };
  /**
   * optional bytes blocksRootHash = 4;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getBlocksroothash()`
   * @return {!Uint8Array}
   */


  proto.types.BlockHeader.prototype.getBlocksroothash_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getBlocksroothash())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.BlockHeader.prototype.setBlocksroothash = function (value) {
    jspb.Message.setField(this, 4, value);
  };
  /**
   * optional bytes txsRootHash = 5;
   * @return {!(string|Uint8Array)}
   */


  proto.types.BlockHeader.prototype.getTxsroothash = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 5, "")
    );
  };
  /**
   * optional bytes txsRootHash = 5;
   * This is a type-conversion wrapper around `getTxsroothash()`
   * @return {string}
   */


  proto.types.BlockHeader.prototype.getTxsroothash_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getTxsroothash())
    );
  };
  /**
   * optional bytes txsRootHash = 5;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getTxsroothash()`
   * @return {!Uint8Array}
   */


  proto.types.BlockHeader.prototype.getTxsroothash_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getTxsroothash())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.BlockHeader.prototype.setTxsroothash = function (value) {
    jspb.Message.setField(this, 5, value);
  };
  /**
   * optional bytes receiptsRootHash = 6;
   * @return {!(string|Uint8Array)}
   */


  proto.types.BlockHeader.prototype.getReceiptsroothash = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 6, "")
    );
  };
  /**
   * optional bytes receiptsRootHash = 6;
   * This is a type-conversion wrapper around `getReceiptsroothash()`
   * @return {string}
   */


  proto.types.BlockHeader.prototype.getReceiptsroothash_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getReceiptsroothash())
    );
  };
  /**
   * optional bytes receiptsRootHash = 6;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getReceiptsroothash()`
   * @return {!Uint8Array}
   */


  proto.types.BlockHeader.prototype.getReceiptsroothash_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getReceiptsroothash())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.BlockHeader.prototype.setReceiptsroothash = function (value) {
    jspb.Message.setField(this, 6, value);
  };
  /**
   * optional uint64 confirms = 7;
   * @return {number}
   */


  proto.types.BlockHeader.prototype.getConfirms = function () {
    return (
      /** @type {number} */
      jspb.Message.getFieldWithDefault(this, 7, 0)
    );
  };
  /** @param {number} value */


  proto.types.BlockHeader.prototype.setConfirms = function (value) {
    jspb.Message.setField(this, 7, value);
  };
  /**
   * optional bytes pubKey = 8;
   * @return {!(string|Uint8Array)}
   */


  proto.types.BlockHeader.prototype.getPubkey = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 8, "")
    );
  };
  /**
   * optional bytes pubKey = 8;
   * This is a type-conversion wrapper around `getPubkey()`
   * @return {string}
   */


  proto.types.BlockHeader.prototype.getPubkey_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getPubkey())
    );
  };
  /**
   * optional bytes pubKey = 8;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getPubkey()`
   * @return {!Uint8Array}
   */


  proto.types.BlockHeader.prototype.getPubkey_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getPubkey())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.BlockHeader.prototype.setPubkey = function (value) {
    jspb.Message.setField(this, 8, value);
  };
  /**
   * optional bytes sign = 9;
   * @return {!(string|Uint8Array)}
   */


  proto.types.BlockHeader.prototype.getSign = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 9, "")
    );
  };
  /**
   * optional bytes sign = 9;
   * This is a type-conversion wrapper around `getSign()`
   * @return {string}
   */


  proto.types.BlockHeader.prototype.getSign_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getSign())
    );
  };
  /**
   * optional bytes sign = 9;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getSign()`
   * @return {!Uint8Array}
   */


  proto.types.BlockHeader.prototype.getSign_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getSign())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.BlockHeader.prototype.setSign = function (value) {
    jspb.Message.setField(this, 9, value);
  };
  /**
   * optional bytes coinbaseAccount = 10;
   * @return {!(string|Uint8Array)}
   */


  proto.types.BlockHeader.prototype.getCoinbaseaccount = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 10, "")
    );
  };
  /**
   * optional bytes coinbaseAccount = 10;
   * This is a type-conversion wrapper around `getCoinbaseaccount()`
   * @return {string}
   */


  proto.types.BlockHeader.prototype.getCoinbaseaccount_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getCoinbaseaccount())
    );
  };
  /**
   * optional bytes coinbaseAccount = 10;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getCoinbaseaccount()`
   * @return {!Uint8Array}
   */


  proto.types.BlockHeader.prototype.getCoinbaseaccount_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getCoinbaseaccount())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.BlockHeader.prototype.setCoinbaseaccount = function (value) {
    jspb.Message.setField(this, 10, value);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.BlockBody = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, proto.types.BlockBody.repeatedFields_, null);
  };

  goog.inherits(proto.types.BlockBody, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.BlockBody.displayName = 'proto.types.BlockBody';
  }
  /**
   * List of repeated fields within this message type.
   * @private {!Array<number>}
   * @const
   */


  proto.types.BlockBody.repeatedFields_ = [1];

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.BlockBody.prototype.toObject = function (opt_includeInstance) {
      return proto.types.BlockBody.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.BlockBody} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.BlockBody.toObject = function (includeInstance, msg) {
      var obj = {
        txsList: jspb.Message.toObjectList(msg.getTxsList(), proto.types.Tx.toObject, includeInstance)
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.BlockBody}
   */


  proto.types.BlockBody.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.BlockBody();
    return proto.types.BlockBody.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.BlockBody} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.BlockBody}
   */


  proto.types.BlockBody.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value = new proto.types.Tx();
          reader.readMessage(value, proto.types.Tx.deserializeBinaryFromReader);
          msg.addTxs(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.BlockBody.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.BlockBody.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.BlockBody} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.BlockBody.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getTxsList();

    if (f.length > 0) {
      writer.writeRepeatedMessage(1, f, proto.types.Tx.serializeBinaryToWriter);
    }
  };
  /**
   * repeated Tx txs = 1;
   * @return {!Array.<!proto.types.Tx>}
   */


  proto.types.BlockBody.prototype.getTxsList = function () {
    return (
      /** @type{!Array.<!proto.types.Tx>} */
      jspb.Message.getRepeatedWrapperField(this, proto.types.Tx, 1)
    );
  };
  /** @param {!Array.<!proto.types.Tx>} value */


  proto.types.BlockBody.prototype.setTxsList = function (value) {
    jspb.Message.setRepeatedWrapperField(this, 1, value);
  };
  /**
   * @param {!proto.types.Tx=} opt_value
   * @param {number=} opt_index
   * @return {!proto.types.Tx}
   */


  proto.types.BlockBody.prototype.addTxs = function (opt_value, opt_index) {
    return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.types.Tx, opt_index);
  };

  proto.types.BlockBody.prototype.clearTxsList = function () {
    this.setTxsList([]);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.TxList = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, proto.types.TxList.repeatedFields_, null);
  };

  goog.inherits(proto.types.TxList, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.TxList.displayName = 'proto.types.TxList';
  }
  /**
   * List of repeated fields within this message type.
   * @private {!Array<number>}
   * @const
   */


  proto.types.TxList.repeatedFields_ = [1];

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.TxList.prototype.toObject = function (opt_includeInstance) {
      return proto.types.TxList.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.TxList} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.TxList.toObject = function (includeInstance, msg) {
      var obj = {
        txsList: jspb.Message.toObjectList(msg.getTxsList(), proto.types.Tx.toObject, includeInstance)
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.TxList}
   */


  proto.types.TxList.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.TxList();
    return proto.types.TxList.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.TxList} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.TxList}
   */


  proto.types.TxList.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value = new proto.types.Tx();
          reader.readMessage(value, proto.types.Tx.deserializeBinaryFromReader);
          msg.addTxs(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.TxList.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.TxList.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.TxList} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.TxList.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getTxsList();

    if (f.length > 0) {
      writer.writeRepeatedMessage(1, f, proto.types.Tx.serializeBinaryToWriter);
    }
  };
  /**
   * repeated Tx txs = 1;
   * @return {!Array.<!proto.types.Tx>}
   */


  proto.types.TxList.prototype.getTxsList = function () {
    return (
      /** @type{!Array.<!proto.types.Tx>} */
      jspb.Message.getRepeatedWrapperField(this, proto.types.Tx, 1)
    );
  };
  /** @param {!Array.<!proto.types.Tx>} value */


  proto.types.TxList.prototype.setTxsList = function (value) {
    jspb.Message.setRepeatedWrapperField(this, 1, value);
  };
  /**
   * @param {!proto.types.Tx=} opt_value
   * @param {number=} opt_index
   * @return {!proto.types.Tx}
   */


  proto.types.TxList.prototype.addTxs = function (opt_value, opt_index) {
    return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.types.Tx, opt_index);
  };

  proto.types.TxList.prototype.clearTxsList = function () {
    this.setTxsList([]);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.Tx = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
  };

  goog.inherits(proto.types.Tx, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.Tx.displayName = 'proto.types.Tx';
  }

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.Tx.prototype.toObject = function (opt_includeInstance) {
      return proto.types.Tx.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.Tx} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.Tx.toObject = function (includeInstance, msg) {
      var f,
          obj = {
        hash: msg.getHash_asB64(),
        body: (f = msg.getBody()) && proto.types.TxBody.toObject(includeInstance, f)
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.Tx}
   */


  proto.types.Tx.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.Tx();
    return proto.types.Tx.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.Tx} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.Tx}
   */


  proto.types.Tx.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setHash(value);
          break;

        case 2:
          var value = new proto.types.TxBody();
          reader.readMessage(value, proto.types.TxBody.deserializeBinaryFromReader);
          msg.setBody(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.Tx.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.Tx.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.Tx} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.Tx.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getHash_asU8();

    if (f.length > 0) {
      writer.writeBytes(1, f);
    }

    f = message.getBody();

    if (f != null) {
      writer.writeMessage(2, f, proto.types.TxBody.serializeBinaryToWriter);
    }
  };
  /**
   * optional bytes hash = 1;
   * @return {!(string|Uint8Array)}
   */


  proto.types.Tx.prototype.getHash = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 1, "")
    );
  };
  /**
   * optional bytes hash = 1;
   * This is a type-conversion wrapper around `getHash()`
   * @return {string}
   */


  proto.types.Tx.prototype.getHash_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getHash())
    );
  };
  /**
   * optional bytes hash = 1;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getHash()`
   * @return {!Uint8Array}
   */


  proto.types.Tx.prototype.getHash_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getHash())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.Tx.prototype.setHash = function (value) {
    jspb.Message.setField(this, 1, value);
  };
  /**
   * optional TxBody body = 2;
   * @return {?proto.types.TxBody}
   */


  proto.types.Tx.prototype.getBody = function () {
    return (
      /** @type{?proto.types.TxBody} */
      jspb.Message.getWrapperField(this, proto.types.TxBody, 2)
    );
  };
  /** @param {?proto.types.TxBody|undefined} value */


  proto.types.Tx.prototype.setBody = function (value) {
    jspb.Message.setWrapperField(this, 2, value);
  };

  proto.types.Tx.prototype.clearBody = function () {
    this.setBody(undefined);
  };
  /**
   * Returns whether this field is set.
   * @return {!boolean}
   */


  proto.types.Tx.prototype.hasBody = function () {
    return jspb.Message.getField(this, 2) != null;
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.TxBody = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
  };

  goog.inherits(proto.types.TxBody, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.TxBody.displayName = 'proto.types.TxBody';
  }

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.TxBody.prototype.toObject = function (opt_includeInstance) {
      return proto.types.TxBody.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.TxBody} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.TxBody.toObject = function (includeInstance, msg) {
      var obj = {
        nonce: jspb.Message.getFieldWithDefault(msg, 1, 0),
        account: msg.getAccount_asB64(),
        recipient: msg.getRecipient_asB64(),
        amount: jspb.Message.getFieldWithDefault(msg, 4, 0),
        payload: msg.getPayload_asB64(),
        limit: jspb.Message.getFieldWithDefault(msg, 6, 0),
        price: jspb.Message.getFieldWithDefault(msg, 7, 0),
        type: jspb.Message.getFieldWithDefault(msg, 8, 0),
        sign: msg.getSign_asB64()
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.TxBody}
   */


  proto.types.TxBody.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.TxBody();
    return proto.types.TxBody.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.TxBody} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.TxBody}
   */


  proto.types.TxBody.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value =
          /** @type {number} */
          reader.readUint64();
          msg.setNonce(value);
          break;

        case 2:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setAccount(value);
          break;

        case 3:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setRecipient(value);
          break;

        case 4:
          var value =
          /** @type {number} */
          reader.readUint64();
          msg.setAmount(value);
          break;

        case 5:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setPayload(value);
          break;

        case 6:
          var value =
          /** @type {number} */
          reader.readUint64();
          msg.setLimit(value);
          break;

        case 7:
          var value =
          /** @type {number} */
          reader.readUint64();
          msg.setPrice(value);
          break;

        case 8:
          var value =
          /** @type {!proto.types.TxType} */
          reader.readEnum();
          msg.setType(value);
          break;

        case 9:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setSign(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.TxBody.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.TxBody.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.TxBody} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.TxBody.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getNonce();

    if (f !== 0) {
      writer.writeUint64(1, f);
    }

    f = message.getAccount_asU8();

    if (f.length > 0) {
      writer.writeBytes(2, f);
    }

    f = message.getRecipient_asU8();

    if (f.length > 0) {
      writer.writeBytes(3, f);
    }

    f = message.getAmount();

    if (f !== 0) {
      writer.writeUint64(4, f);
    }

    f = message.getPayload_asU8();

    if (f.length > 0) {
      writer.writeBytes(5, f);
    }

    f = message.getLimit();

    if (f !== 0) {
      writer.writeUint64(6, f);
    }

    f = message.getPrice();

    if (f !== 0) {
      writer.writeUint64(7, f);
    }

    f = message.getType();

    if (f !== 0.0) {
      writer.writeEnum(8, f);
    }

    f = message.getSign_asU8();

    if (f.length > 0) {
      writer.writeBytes(9, f);
    }
  };
  /**
   * optional uint64 nonce = 1;
   * @return {number}
   */


  proto.types.TxBody.prototype.getNonce = function () {
    return (
      /** @type {number} */
      jspb.Message.getFieldWithDefault(this, 1, 0)
    );
  };
  /** @param {number} value */


  proto.types.TxBody.prototype.setNonce = function (value) {
    jspb.Message.setField(this, 1, value);
  };
  /**
   * optional bytes account = 2;
   * @return {!(string|Uint8Array)}
   */


  proto.types.TxBody.prototype.getAccount = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 2, "")
    );
  };
  /**
   * optional bytes account = 2;
   * This is a type-conversion wrapper around `getAccount()`
   * @return {string}
   */


  proto.types.TxBody.prototype.getAccount_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getAccount())
    );
  };
  /**
   * optional bytes account = 2;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getAccount()`
   * @return {!Uint8Array}
   */


  proto.types.TxBody.prototype.getAccount_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getAccount())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.TxBody.prototype.setAccount = function (value) {
    jspb.Message.setField(this, 2, value);
  };
  /**
   * optional bytes recipient = 3;
   * @return {!(string|Uint8Array)}
   */


  proto.types.TxBody.prototype.getRecipient = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 3, "")
    );
  };
  /**
   * optional bytes recipient = 3;
   * This is a type-conversion wrapper around `getRecipient()`
   * @return {string}
   */


  proto.types.TxBody.prototype.getRecipient_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getRecipient())
    );
  };
  /**
   * optional bytes recipient = 3;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getRecipient()`
   * @return {!Uint8Array}
   */


  proto.types.TxBody.prototype.getRecipient_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getRecipient())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.TxBody.prototype.setRecipient = function (value) {
    jspb.Message.setField(this, 3, value);
  };
  /**
   * optional uint64 amount = 4;
   * @return {number}
   */


  proto.types.TxBody.prototype.getAmount = function () {
    return (
      /** @type {number} */
      jspb.Message.getFieldWithDefault(this, 4, 0)
    );
  };
  /** @param {number} value */


  proto.types.TxBody.prototype.setAmount = function (value) {
    jspb.Message.setField(this, 4, value);
  };
  /**
   * optional bytes payload = 5;
   * @return {!(string|Uint8Array)}
   */


  proto.types.TxBody.prototype.getPayload = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 5, "")
    );
  };
  /**
   * optional bytes payload = 5;
   * This is a type-conversion wrapper around `getPayload()`
   * @return {string}
   */


  proto.types.TxBody.prototype.getPayload_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getPayload())
    );
  };
  /**
   * optional bytes payload = 5;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getPayload()`
   * @return {!Uint8Array}
   */


  proto.types.TxBody.prototype.getPayload_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getPayload())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.TxBody.prototype.setPayload = function (value) {
    jspb.Message.setField(this, 5, value);
  };
  /**
   * optional uint64 limit = 6;
   * @return {number}
   */


  proto.types.TxBody.prototype.getLimit = function () {
    return (
      /** @type {number} */
      jspb.Message.getFieldWithDefault(this, 6, 0)
    );
  };
  /** @param {number} value */


  proto.types.TxBody.prototype.setLimit = function (value) {
    jspb.Message.setField(this, 6, value);
  };
  /**
   * optional uint64 price = 7;
   * @return {number}
   */


  proto.types.TxBody.prototype.getPrice = function () {
    return (
      /** @type {number} */
      jspb.Message.getFieldWithDefault(this, 7, 0)
    );
  };
  /** @param {number} value */


  proto.types.TxBody.prototype.setPrice = function (value) {
    jspb.Message.setField(this, 7, value);
  };
  /**
   * optional TxType type = 8;
   * @return {!proto.types.TxType}
   */


  proto.types.TxBody.prototype.getType = function () {
    return (
      /** @type {!proto.types.TxType} */
      jspb.Message.getFieldWithDefault(this, 8, 0)
    );
  };
  /** @param {!proto.types.TxType} value */


  proto.types.TxBody.prototype.setType = function (value) {
    jspb.Message.setField(this, 8, value);
  };
  /**
   * optional bytes sign = 9;
   * @return {!(string|Uint8Array)}
   */


  proto.types.TxBody.prototype.getSign = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 9, "")
    );
  };
  /**
   * optional bytes sign = 9;
   * This is a type-conversion wrapper around `getSign()`
   * @return {string}
   */


  proto.types.TxBody.prototype.getSign_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getSign())
    );
  };
  /**
   * optional bytes sign = 9;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getSign()`
   * @return {!Uint8Array}
   */


  proto.types.TxBody.prototype.getSign_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getSign())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.TxBody.prototype.setSign = function (value) {
    jspb.Message.setField(this, 9, value);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.TxIdx = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
  };

  goog.inherits(proto.types.TxIdx, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.TxIdx.displayName = 'proto.types.TxIdx';
  }

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.TxIdx.prototype.toObject = function (opt_includeInstance) {
      return proto.types.TxIdx.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.TxIdx} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.TxIdx.toObject = function (includeInstance, msg) {
      var obj = {
        blockhash: msg.getBlockhash_asB64(),
        idx: jspb.Message.getFieldWithDefault(msg, 2, 0)
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.TxIdx}
   */


  proto.types.TxIdx.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.TxIdx();
    return proto.types.TxIdx.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.TxIdx} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.TxIdx}
   */


  proto.types.TxIdx.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setBlockhash(value);
          break;

        case 2:
          var value =
          /** @type {number} */
          reader.readInt32();
          msg.setIdx(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.TxIdx.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.TxIdx.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.TxIdx} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.TxIdx.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getBlockhash_asU8();

    if (f.length > 0) {
      writer.writeBytes(1, f);
    }

    f = message.getIdx();

    if (f !== 0) {
      writer.writeInt32(2, f);
    }
  };
  /**
   * optional bytes blockHash = 1;
   * @return {!(string|Uint8Array)}
   */


  proto.types.TxIdx.prototype.getBlockhash = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 1, "")
    );
  };
  /**
   * optional bytes blockHash = 1;
   * This is a type-conversion wrapper around `getBlockhash()`
   * @return {string}
   */


  proto.types.TxIdx.prototype.getBlockhash_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getBlockhash())
    );
  };
  /**
   * optional bytes blockHash = 1;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getBlockhash()`
   * @return {!Uint8Array}
   */


  proto.types.TxIdx.prototype.getBlockhash_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getBlockhash())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.TxIdx.prototype.setBlockhash = function (value) {
    jspb.Message.setField(this, 1, value);
  };
  /**
   * optional int32 idx = 2;
   * @return {number}
   */


  proto.types.TxIdx.prototype.getIdx = function () {
    return (
      /** @type {number} */
      jspb.Message.getFieldWithDefault(this, 2, 0)
    );
  };
  /** @param {number} value */


  proto.types.TxIdx.prototype.setIdx = function (value) {
    jspb.Message.setField(this, 2, value);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.TxInBlock = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
  };

  goog.inherits(proto.types.TxInBlock, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.TxInBlock.displayName = 'proto.types.TxInBlock';
  }

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.TxInBlock.prototype.toObject = function (opt_includeInstance) {
      return proto.types.TxInBlock.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.TxInBlock} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.TxInBlock.toObject = function (includeInstance, msg) {
      var f,
          obj = {
        txidx: (f = msg.getTxidx()) && proto.types.TxIdx.toObject(includeInstance, f),
        tx: (f = msg.getTx()) && proto.types.Tx.toObject(includeInstance, f)
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.TxInBlock}
   */


  proto.types.TxInBlock.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.TxInBlock();
    return proto.types.TxInBlock.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.TxInBlock} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.TxInBlock}
   */


  proto.types.TxInBlock.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value = new proto.types.TxIdx();
          reader.readMessage(value, proto.types.TxIdx.deserializeBinaryFromReader);
          msg.setTxidx(value);
          break;

        case 2:
          var value = new proto.types.Tx();
          reader.readMessage(value, proto.types.Tx.deserializeBinaryFromReader);
          msg.setTx(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.TxInBlock.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.TxInBlock.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.TxInBlock} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.TxInBlock.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getTxidx();

    if (f != null) {
      writer.writeMessage(1, f, proto.types.TxIdx.serializeBinaryToWriter);
    }

    f = message.getTx();

    if (f != null) {
      writer.writeMessage(2, f, proto.types.Tx.serializeBinaryToWriter);
    }
  };
  /**
   * optional TxIdx txIdx = 1;
   * @return {?proto.types.TxIdx}
   */


  proto.types.TxInBlock.prototype.getTxidx = function () {
    return (
      /** @type{?proto.types.TxIdx} */
      jspb.Message.getWrapperField(this, proto.types.TxIdx, 1)
    );
  };
  /** @param {?proto.types.TxIdx|undefined} value */


  proto.types.TxInBlock.prototype.setTxidx = function (value) {
    jspb.Message.setWrapperField(this, 1, value);
  };

  proto.types.TxInBlock.prototype.clearTxidx = function () {
    this.setTxidx(undefined);
  };
  /**
   * Returns whether this field is set.
   * @return {!boolean}
   */


  proto.types.TxInBlock.prototype.hasTxidx = function () {
    return jspb.Message.getField(this, 1) != null;
  };
  /**
   * optional Tx tx = 2;
   * @return {?proto.types.Tx}
   */


  proto.types.TxInBlock.prototype.getTx = function () {
    return (
      /** @type{?proto.types.Tx} */
      jspb.Message.getWrapperField(this, proto.types.Tx, 2)
    );
  };
  /** @param {?proto.types.Tx|undefined} value */


  proto.types.TxInBlock.prototype.setTx = function (value) {
    jspb.Message.setWrapperField(this, 2, value);
  };

  proto.types.TxInBlock.prototype.clearTx = function () {
    this.setTx(undefined);
  };
  /**
   * Returns whether this field is set.
   * @return {!boolean}
   */


  proto.types.TxInBlock.prototype.hasTx = function () {
    return jspb.Message.getField(this, 2) != null;
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.State = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
  };

  goog.inherits(proto.types.State, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.State.displayName = 'proto.types.State';
  }

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.State.prototype.toObject = function (opt_includeInstance) {
      return proto.types.State.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.State} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.State.toObject = function (includeInstance, msg) {
      var obj = {
        nonce: jspb.Message.getFieldWithDefault(msg, 1, 0),
        balance: jspb.Message.getFieldWithDefault(msg, 2, 0),
        codehash: msg.getCodehash_asB64(),
        storageroot: msg.getStorageroot_asB64(),
        sqlrecoverypoint: jspb.Message.getFieldWithDefault(msg, 5, 0)
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.State}
   */


  proto.types.State.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.State();
    return proto.types.State.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.State} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.State}
   */


  proto.types.State.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value =
          /** @type {number} */
          reader.readUint64();
          msg.setNonce(value);
          break;

        case 2:
          var value =
          /** @type {number} */
          reader.readUint64();
          msg.setBalance(value);
          break;

        case 3:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setCodehash(value);
          break;

        case 4:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setStorageroot(value);
          break;

        case 5:
          var value =
          /** @type {number} */
          reader.readUint64();
          msg.setSqlrecoverypoint(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.State.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.State.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.State} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.State.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getNonce();

    if (f !== 0) {
      writer.writeUint64(1, f);
    }

    f = message.getBalance();

    if (f !== 0) {
      writer.writeUint64(2, f);
    }

    f = message.getCodehash_asU8();

    if (f.length > 0) {
      writer.writeBytes(3, f);
    }

    f = message.getStorageroot_asU8();

    if (f.length > 0) {
      writer.writeBytes(4, f);
    }

    f = message.getSqlrecoverypoint();

    if (f !== 0) {
      writer.writeUint64(5, f);
    }
  };
  /**
   * optional uint64 nonce = 1;
   * @return {number}
   */


  proto.types.State.prototype.getNonce = function () {
    return (
      /** @type {number} */
      jspb.Message.getFieldWithDefault(this, 1, 0)
    );
  };
  /** @param {number} value */


  proto.types.State.prototype.setNonce = function (value) {
    jspb.Message.setField(this, 1, value);
  };
  /**
   * optional uint64 balance = 2;
   * @return {number}
   */


  proto.types.State.prototype.getBalance = function () {
    return (
      /** @type {number} */
      jspb.Message.getFieldWithDefault(this, 2, 0)
    );
  };
  /** @param {number} value */


  proto.types.State.prototype.setBalance = function (value) {
    jspb.Message.setField(this, 2, value);
  };
  /**
   * optional bytes codeHash = 3;
   * @return {!(string|Uint8Array)}
   */


  proto.types.State.prototype.getCodehash = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 3, "")
    );
  };
  /**
   * optional bytes codeHash = 3;
   * This is a type-conversion wrapper around `getCodehash()`
   * @return {string}
   */


  proto.types.State.prototype.getCodehash_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getCodehash())
    );
  };
  /**
   * optional bytes codeHash = 3;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getCodehash()`
   * @return {!Uint8Array}
   */


  proto.types.State.prototype.getCodehash_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getCodehash())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.State.prototype.setCodehash = function (value) {
    jspb.Message.setField(this, 3, value);
  };
  /**
   * optional bytes storageRoot = 4;
   * @return {!(string|Uint8Array)}
   */


  proto.types.State.prototype.getStorageroot = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 4, "")
    );
  };
  /**
   * optional bytes storageRoot = 4;
   * This is a type-conversion wrapper around `getStorageroot()`
   * @return {string}
   */


  proto.types.State.prototype.getStorageroot_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getStorageroot())
    );
  };
  /**
   * optional bytes storageRoot = 4;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getStorageroot()`
   * @return {!Uint8Array}
   */


  proto.types.State.prototype.getStorageroot_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getStorageroot())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.State.prototype.setStorageroot = function (value) {
    jspb.Message.setField(this, 4, value);
  };
  /**
   * optional uint64 sqlRecoveryPoint = 5;
   * @return {number}
   */


  proto.types.State.prototype.getSqlrecoverypoint = function () {
    return (
      /** @type {number} */
      jspb.Message.getFieldWithDefault(this, 5, 0)
    );
  };
  /** @param {number} value */


  proto.types.State.prototype.setSqlrecoverypoint = function (value) {
    jspb.Message.setField(this, 5, value);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.StateProof = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, proto.types.StateProof.repeatedFields_, null);
  };

  goog.inherits(proto.types.StateProof, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.StateProof.displayName = 'proto.types.StateProof';
  }
  /**
   * List of repeated fields within this message type.
   * @private {!Array<number>}
   * @const
   */


  proto.types.StateProof.repeatedFields_ = [5];

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.StateProof.prototype.toObject = function (opt_includeInstance) {
      return proto.types.StateProof.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.StateProof} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.StateProof.toObject = function (includeInstance, msg) {
      var f,
          obj = {
        state: (f = msg.getState()) && proto.types.State.toObject(includeInstance, f),
        inclusion: jspb.Message.getFieldWithDefault(msg, 2, false),
        proofkey: msg.getProofkey_asB64(),
        proofval: msg.getProofval_asB64(),
        auditpathList: msg.getAuditpathList_asB64()
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.StateProof}
   */


  proto.types.StateProof.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.StateProof();
    return proto.types.StateProof.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.StateProof} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.StateProof}
   */


  proto.types.StateProof.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value = new proto.types.State();
          reader.readMessage(value, proto.types.State.deserializeBinaryFromReader);
          msg.setState(value);
          break;

        case 2:
          var value =
          /** @type {boolean} */
          reader.readBool();
          msg.setInclusion(value);
          break;

        case 3:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setProofkey(value);
          break;

        case 4:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setProofval(value);
          break;

        case 5:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.addAuditpath(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.StateProof.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.StateProof.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.StateProof} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.StateProof.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getState();

    if (f != null) {
      writer.writeMessage(1, f, proto.types.State.serializeBinaryToWriter);
    }

    f = message.getInclusion();

    if (f) {
      writer.writeBool(2, f);
    }

    f = message.getProofkey_asU8();

    if (f.length > 0) {
      writer.writeBytes(3, f);
    }

    f = message.getProofval_asU8();

    if (f.length > 0) {
      writer.writeBytes(4, f);
    }

    f = message.getAuditpathList_asU8();

    if (f.length > 0) {
      writer.writeRepeatedBytes(5, f);
    }
  };
  /**
   * optional State State = 1;
   * @return {?proto.types.State}
   */


  proto.types.StateProof.prototype.getState = function () {
    return (
      /** @type{?proto.types.State} */
      jspb.Message.getWrapperField(this, proto.types.State, 1)
    );
  };
  /** @param {?proto.types.State|undefined} value */


  proto.types.StateProof.prototype.setState = function (value) {
    jspb.Message.setWrapperField(this, 1, value);
  };

  proto.types.StateProof.prototype.clearState = function () {
    this.setState(undefined);
  };
  /**
   * Returns whether this field is set.
   * @return {!boolean}
   */


  proto.types.StateProof.prototype.hasState = function () {
    return jspb.Message.getField(this, 1) != null;
  };
  /**
   * optional bool inclusion = 2;
   * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
   * You should avoid comparisons like {@code val === true/false} in those cases.
   * @return {boolean}
   */


  proto.types.StateProof.prototype.getInclusion = function () {
    return (
      /** @type {boolean} */
      jspb.Message.getFieldWithDefault(this, 2, false)
    );
  };
  /** @param {boolean} value */


  proto.types.StateProof.prototype.setInclusion = function (value) {
    jspb.Message.setField(this, 2, value);
  };
  /**
   * optional bytes proofKey = 3;
   * @return {!(string|Uint8Array)}
   */


  proto.types.StateProof.prototype.getProofkey = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 3, "")
    );
  };
  /**
   * optional bytes proofKey = 3;
   * This is a type-conversion wrapper around `getProofkey()`
   * @return {string}
   */


  proto.types.StateProof.prototype.getProofkey_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getProofkey())
    );
  };
  /**
   * optional bytes proofKey = 3;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getProofkey()`
   * @return {!Uint8Array}
   */


  proto.types.StateProof.prototype.getProofkey_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getProofkey())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.StateProof.prototype.setProofkey = function (value) {
    jspb.Message.setField(this, 3, value);
  };
  /**
   * optional bytes proofVal = 4;
   * @return {!(string|Uint8Array)}
   */


  proto.types.StateProof.prototype.getProofval = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 4, "")
    );
  };
  /**
   * optional bytes proofVal = 4;
   * This is a type-conversion wrapper around `getProofval()`
   * @return {string}
   */


  proto.types.StateProof.prototype.getProofval_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getProofval())
    );
  };
  /**
   * optional bytes proofVal = 4;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getProofval()`
   * @return {!Uint8Array}
   */


  proto.types.StateProof.prototype.getProofval_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getProofval())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.StateProof.prototype.setProofval = function (value) {
    jspb.Message.setField(this, 4, value);
  };
  /**
   * repeated bytes auditPath = 5;
   * @return {!(Array<!Uint8Array>|Array<string>)}
   */


  proto.types.StateProof.prototype.getAuditpathList = function () {
    return (
      /** @type {!(Array<!Uint8Array>|Array<string>)} */
      jspb.Message.getRepeatedField(this, 5)
    );
  };
  /**
   * repeated bytes auditPath = 5;
   * This is a type-conversion wrapper around `getAuditpathList()`
   * @return {!Array.<string>}
   */


  proto.types.StateProof.prototype.getAuditpathList_asB64 = function () {
    return (
      /** @type {!Array.<string>} */
      jspb.Message.bytesListAsB64(this.getAuditpathList())
    );
  };
  /**
   * repeated bytes auditPath = 5;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getAuditpathList()`
   * @return {!Array.<!Uint8Array>}
   */


  proto.types.StateProof.prototype.getAuditpathList_asU8 = function () {
    return (
      /** @type {!Array.<!Uint8Array>} */
      jspb.Message.bytesListAsU8(this.getAuditpathList())
    );
  };
  /** @param {!(Array<!Uint8Array>|Array<string>)} value */


  proto.types.StateProof.prototype.setAuditpathList = function (value) {
    jspb.Message.setField(this, 5, value || []);
  };
  /**
   * @param {!(string|Uint8Array)} value
   * @param {number=} opt_index
   */


  proto.types.StateProof.prototype.addAuditpath = function (value, opt_index) {
    jspb.Message.addToRepeatedField(this, 5, value, opt_index);
  };

  proto.types.StateProof.prototype.clearAuditpathList = function () {
    this.setAuditpathList([]);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.Receipt = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
  };

  goog.inherits(proto.types.Receipt, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.Receipt.displayName = 'proto.types.Receipt';
  }

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.Receipt.prototype.toObject = function (opt_includeInstance) {
      return proto.types.Receipt.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.Receipt} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.Receipt.toObject = function (includeInstance, msg) {
      var obj = {
        contractaddress: msg.getContractaddress_asB64(),
        status: jspb.Message.getFieldWithDefault(msg, 2, ""),
        ret: jspb.Message.getFieldWithDefault(msg, 3, "")
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.Receipt}
   */


  proto.types.Receipt.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.Receipt();
    return proto.types.Receipt.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.Receipt} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.Receipt}
   */


  proto.types.Receipt.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setContractaddress(value);
          break;

        case 2:
          var value =
          /** @type {string} */
          reader.readString();
          msg.setStatus(value);
          break;

        case 3:
          var value =
          /** @type {string} */
          reader.readString();
          msg.setRet(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.Receipt.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.Receipt.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.Receipt} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.Receipt.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getContractaddress_asU8();

    if (f.length > 0) {
      writer.writeBytes(1, f);
    }

    f = message.getStatus();

    if (f.length > 0) {
      writer.writeString(2, f);
    }

    f = message.getRet();

    if (f.length > 0) {
      writer.writeString(3, f);
    }
  };
  /**
   * optional bytes contractAddress = 1;
   * @return {!(string|Uint8Array)}
   */


  proto.types.Receipt.prototype.getContractaddress = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 1, "")
    );
  };
  /**
   * optional bytes contractAddress = 1;
   * This is a type-conversion wrapper around `getContractaddress()`
   * @return {string}
   */


  proto.types.Receipt.prototype.getContractaddress_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getContractaddress())
    );
  };
  /**
   * optional bytes contractAddress = 1;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getContractaddress()`
   * @return {!Uint8Array}
   */


  proto.types.Receipt.prototype.getContractaddress_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getContractaddress())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.Receipt.prototype.setContractaddress = function (value) {
    jspb.Message.setField(this, 1, value);
  };
  /**
   * optional string status = 2;
   * @return {string}
   */


  proto.types.Receipt.prototype.getStatus = function () {
    return (
      /** @type {string} */
      jspb.Message.getFieldWithDefault(this, 2, "")
    );
  };
  /** @param {string} value */


  proto.types.Receipt.prototype.setStatus = function (value) {
    jspb.Message.setField(this, 2, value);
  };
  /**
   * optional string ret = 3;
   * @return {string}
   */


  proto.types.Receipt.prototype.getRet = function () {
    return (
      /** @type {string} */
      jspb.Message.getFieldWithDefault(this, 3, "")
    );
  };
  /** @param {string} value */


  proto.types.Receipt.prototype.setRet = function (value) {
    jspb.Message.setField(this, 3, value);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.Vote = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
  };

  goog.inherits(proto.types.Vote, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.Vote.displayName = 'proto.types.Vote';
  }

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.Vote.prototype.toObject = function (opt_includeInstance) {
      return proto.types.Vote.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.Vote} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.Vote.toObject = function (includeInstance, msg) {
      var obj = {
        candidate: msg.getCandidate_asB64(),
        amount: jspb.Message.getFieldWithDefault(msg, 2, 0)
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.Vote}
   */


  proto.types.Vote.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.Vote();
    return proto.types.Vote.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.Vote} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.Vote}
   */


  proto.types.Vote.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setCandidate(value);
          break;

        case 2:
          var value =
          /** @type {number} */
          reader.readUint64();
          msg.setAmount(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.Vote.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.Vote.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.Vote} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.Vote.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getCandidate_asU8();

    if (f.length > 0) {
      writer.writeBytes(1, f);
    }

    f = message.getAmount();

    if (f !== 0) {
      writer.writeUint64(2, f);
    }
  };
  /**
   * optional bytes candidate = 1;
   * @return {!(string|Uint8Array)}
   */


  proto.types.Vote.prototype.getCandidate = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 1, "")
    );
  };
  /**
   * optional bytes candidate = 1;
   * This is a type-conversion wrapper around `getCandidate()`
   * @return {string}
   */


  proto.types.Vote.prototype.getCandidate_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getCandidate())
    );
  };
  /**
   * optional bytes candidate = 1;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getCandidate()`
   * @return {!Uint8Array}
   */


  proto.types.Vote.prototype.getCandidate_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getCandidate())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.Vote.prototype.setCandidate = function (value) {
    jspb.Message.setField(this, 1, value);
  };
  /**
   * optional uint64 amount = 2;
   * @return {number}
   */


  proto.types.Vote.prototype.getAmount = function () {
    return (
      /** @type {number} */
      jspb.Message.getFieldWithDefault(this, 2, 0)
    );
  };
  /** @param {number} value */


  proto.types.Vote.prototype.setAmount = function (value) {
    jspb.Message.setField(this, 2, value);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.VoteList = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, proto.types.VoteList.repeatedFields_, null);
  };

  goog.inherits(proto.types.VoteList, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.VoteList.displayName = 'proto.types.VoteList';
  }
  /**
   * List of repeated fields within this message type.
   * @private {!Array<number>}
   * @const
   */


  proto.types.VoteList.repeatedFields_ = [1];

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.VoteList.prototype.toObject = function (opt_includeInstance) {
      return proto.types.VoteList.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.VoteList} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.VoteList.toObject = function (includeInstance, msg) {
      var obj = {
        votesList: jspb.Message.toObjectList(msg.getVotesList(), proto.types.Vote.toObject, includeInstance)
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.VoteList}
   */


  proto.types.VoteList.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.VoteList();
    return proto.types.VoteList.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.VoteList} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.VoteList}
   */


  proto.types.VoteList.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value = new proto.types.Vote();
          reader.readMessage(value, proto.types.Vote.deserializeBinaryFromReader);
          msg.addVotes(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.VoteList.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.VoteList.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.VoteList} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.VoteList.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getVotesList();

    if (f.length > 0) {
      writer.writeRepeatedMessage(1, f, proto.types.Vote.serializeBinaryToWriter);
    }
  };
  /**
   * repeated Vote votes = 1;
   * @return {!Array.<!proto.types.Vote>}
   */


  proto.types.VoteList.prototype.getVotesList = function () {
    return (
      /** @type{!Array.<!proto.types.Vote>} */
      jspb.Message.getRepeatedWrapperField(this, proto.types.Vote, 1)
    );
  };
  /** @param {!Array.<!proto.types.Vote>} value */


  proto.types.VoteList.prototype.setVotesList = function (value) {
    jspb.Message.setRepeatedWrapperField(this, 1, value);
  };
  /**
   * @param {!proto.types.Vote=} opt_value
   * @param {number=} opt_index
   * @return {!proto.types.Vote}
   */


  proto.types.VoteList.prototype.addVotes = function (opt_value, opt_index) {
    return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.types.Vote, opt_index);
  };

  proto.types.VoteList.prototype.clearVotesList = function () {
    this.setVotesList([]);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.FnArgument = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
  };

  goog.inherits(proto.types.FnArgument, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.FnArgument.displayName = 'proto.types.FnArgument';
  }

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.FnArgument.prototype.toObject = function (opt_includeInstance) {
      return proto.types.FnArgument.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.FnArgument} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.FnArgument.toObject = function (includeInstance, msg) {
      var obj = {
        name: jspb.Message.getFieldWithDefault(msg, 1, "")
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.FnArgument}
   */


  proto.types.FnArgument.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.FnArgument();
    return proto.types.FnArgument.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.FnArgument} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.FnArgument}
   */


  proto.types.FnArgument.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value =
          /** @type {string} */
          reader.readString();
          msg.setName(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.FnArgument.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.FnArgument.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.FnArgument} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.FnArgument.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getName();

    if (f.length > 0) {
      writer.writeString(1, f);
    }
  };
  /**
   * optional string name = 1;
   * @return {string}
   */


  proto.types.FnArgument.prototype.getName = function () {
    return (
      /** @type {string} */
      jspb.Message.getFieldWithDefault(this, 1, "")
    );
  };
  /** @param {string} value */


  proto.types.FnArgument.prototype.setName = function (value) {
    jspb.Message.setField(this, 1, value);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.Function = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, proto.types.Function.repeatedFields_, null);
  };

  goog.inherits(proto.types.Function, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.Function.displayName = 'proto.types.Function';
  }
  /**
   * List of repeated fields within this message type.
   * @private {!Array<number>}
   * @const
   */


  proto.types.Function.repeatedFields_ = [2];

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.Function.prototype.toObject = function (opt_includeInstance) {
      return proto.types.Function.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.Function} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.Function.toObject = function (includeInstance, msg) {
      var obj = {
        name: jspb.Message.getFieldWithDefault(msg, 1, ""),
        argumentsList: jspb.Message.toObjectList(msg.getArgumentsList(), proto.types.FnArgument.toObject, includeInstance)
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.Function}
   */


  proto.types.Function.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.Function();
    return proto.types.Function.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.Function} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.Function}
   */


  proto.types.Function.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value =
          /** @type {string} */
          reader.readString();
          msg.setName(value);
          break;

        case 2:
          var value = new proto.types.FnArgument();
          reader.readMessage(value, proto.types.FnArgument.deserializeBinaryFromReader);
          msg.addArguments(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.Function.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.Function.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.Function} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.Function.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getName();

    if (f.length > 0) {
      writer.writeString(1, f);
    }

    f = message.getArgumentsList();

    if (f.length > 0) {
      writer.writeRepeatedMessage(2, f, proto.types.FnArgument.serializeBinaryToWriter);
    }
  };
  /**
   * optional string name = 1;
   * @return {string}
   */


  proto.types.Function.prototype.getName = function () {
    return (
      /** @type {string} */
      jspb.Message.getFieldWithDefault(this, 1, "")
    );
  };
  /** @param {string} value */


  proto.types.Function.prototype.setName = function (value) {
    jspb.Message.setField(this, 1, value);
  };
  /**
   * repeated FnArgument arguments = 2;
   * @return {!Array.<!proto.types.FnArgument>}
   */


  proto.types.Function.prototype.getArgumentsList = function () {
    return (
      /** @type{!Array.<!proto.types.FnArgument>} */
      jspb.Message.getRepeatedWrapperField(this, proto.types.FnArgument, 2)
    );
  };
  /** @param {!Array.<!proto.types.FnArgument>} value */


  proto.types.Function.prototype.setArgumentsList = function (value) {
    jspb.Message.setRepeatedWrapperField(this, 2, value);
  };
  /**
   * @param {!proto.types.FnArgument=} opt_value
   * @param {number=} opt_index
   * @return {!proto.types.FnArgument}
   */


  proto.types.Function.prototype.addArguments = function (opt_value, opt_index) {
    return jspb.Message.addToRepeatedWrapperField(this, 2, opt_value, proto.types.FnArgument, opt_index);
  };

  proto.types.Function.prototype.clearArgumentsList = function () {
    this.setArgumentsList([]);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.ABI = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, proto.types.ABI.repeatedFields_, null);
  };

  goog.inherits(proto.types.ABI, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.ABI.displayName = 'proto.types.ABI';
  }
  /**
   * List of repeated fields within this message type.
   * @private {!Array<number>}
   * @const
   */


  proto.types.ABI.repeatedFields_ = [3];

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.ABI.prototype.toObject = function (opt_includeInstance) {
      return proto.types.ABI.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.ABI} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.ABI.toObject = function (includeInstance, msg) {
      var obj = {
        version: jspb.Message.getFieldWithDefault(msg, 1, ""),
        language: jspb.Message.getFieldWithDefault(msg, 2, ""),
        functionsList: jspb.Message.toObjectList(msg.getFunctionsList(), proto.types.Function.toObject, includeInstance)
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.ABI}
   */


  proto.types.ABI.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.ABI();
    return proto.types.ABI.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.ABI} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.ABI}
   */


  proto.types.ABI.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value =
          /** @type {string} */
          reader.readString();
          msg.setVersion(value);
          break;

        case 2:
          var value =
          /** @type {string} */
          reader.readString();
          msg.setLanguage(value);
          break;

        case 3:
          var value = new proto.types.Function();
          reader.readMessage(value, proto.types.Function.deserializeBinaryFromReader);
          msg.addFunctions(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.ABI.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.ABI.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.ABI} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.ABI.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getVersion();

    if (f.length > 0) {
      writer.writeString(1, f);
    }

    f = message.getLanguage();

    if (f.length > 0) {
      writer.writeString(2, f);
    }

    f = message.getFunctionsList();

    if (f.length > 0) {
      writer.writeRepeatedMessage(3, f, proto.types.Function.serializeBinaryToWriter);
    }
  };
  /**
   * optional string version = 1;
   * @return {string}
   */


  proto.types.ABI.prototype.getVersion = function () {
    return (
      /** @type {string} */
      jspb.Message.getFieldWithDefault(this, 1, "")
    );
  };
  /** @param {string} value */


  proto.types.ABI.prototype.setVersion = function (value) {
    jspb.Message.setField(this, 1, value);
  };
  /**
   * optional string language = 2;
   * @return {string}
   */


  proto.types.ABI.prototype.getLanguage = function () {
    return (
      /** @type {string} */
      jspb.Message.getFieldWithDefault(this, 2, "")
    );
  };
  /** @param {string} value */


  proto.types.ABI.prototype.setLanguage = function (value) {
    jspb.Message.setField(this, 2, value);
  };
  /**
   * repeated Function functions = 3;
   * @return {!Array.<!proto.types.Function>}
   */


  proto.types.ABI.prototype.getFunctionsList = function () {
    return (
      /** @type{!Array.<!proto.types.Function>} */
      jspb.Message.getRepeatedWrapperField(this, proto.types.Function, 3)
    );
  };
  /** @param {!Array.<!proto.types.Function>} value */


  proto.types.ABI.prototype.setFunctionsList = function (value) {
    jspb.Message.setRepeatedWrapperField(this, 3, value);
  };
  /**
   * @param {!proto.types.Function=} opt_value
   * @param {number=} opt_index
   * @return {!proto.types.Function}
   */


  proto.types.ABI.prototype.addFunctions = function (opt_value, opt_index) {
    return jspb.Message.addToRepeatedWrapperField(this, 3, opt_value, proto.types.Function, opt_index);
  };

  proto.types.ABI.prototype.clearFunctionsList = function () {
    this.setFunctionsList([]);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.Query = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
  };

  goog.inherits(proto.types.Query, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.Query.displayName = 'proto.types.Query';
  }

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.Query.prototype.toObject = function (opt_includeInstance) {
      return proto.types.Query.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.Query} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.Query.toObject = function (includeInstance, msg) {
      var obj = {
        contractaddress: msg.getContractaddress_asB64(),
        queryinfo: msg.getQueryinfo_asB64()
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.Query}
   */


  proto.types.Query.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.Query();
    return proto.types.Query.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.Query} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.Query}
   */


  proto.types.Query.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setContractaddress(value);
          break;

        case 2:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setQueryinfo(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.Query.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.Query.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.Query} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.Query.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getContractaddress_asU8();

    if (f.length > 0) {
      writer.writeBytes(1, f);
    }

    f = message.getQueryinfo_asU8();

    if (f.length > 0) {
      writer.writeBytes(2, f);
    }
  };
  /**
   * optional bytes contractAddress = 1;
   * @return {!(string|Uint8Array)}
   */


  proto.types.Query.prototype.getContractaddress = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 1, "")
    );
  };
  /**
   * optional bytes contractAddress = 1;
   * This is a type-conversion wrapper around `getContractaddress()`
   * @return {string}
   */


  proto.types.Query.prototype.getContractaddress_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getContractaddress())
    );
  };
  /**
   * optional bytes contractAddress = 1;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getContractaddress()`
   * @return {!Uint8Array}
   */


  proto.types.Query.prototype.getContractaddress_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getContractaddress())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.Query.prototype.setContractaddress = function (value) {
    jspb.Message.setField(this, 1, value);
  };
  /**
   * optional bytes queryinfo = 2;
   * @return {!(string|Uint8Array)}
   */


  proto.types.Query.prototype.getQueryinfo = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 2, "")
    );
  };
  /**
   * optional bytes queryinfo = 2;
   * This is a type-conversion wrapper around `getQueryinfo()`
   * @return {string}
   */


  proto.types.Query.prototype.getQueryinfo_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getQueryinfo())
    );
  };
  /**
   * optional bytes queryinfo = 2;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getQueryinfo()`
   * @return {!Uint8Array}
   */


  proto.types.Query.prototype.getQueryinfo_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getQueryinfo())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.Query.prototype.setQueryinfo = function (value) {
    jspb.Message.setField(this, 2, value);
  };
  /**
   * @enum {number}
   */


  proto.types.TxType = {
    NORMAL: 0,
    GOVERNANCE: 1
  };
  goog.object.extend(exports, proto.types);
});

var account_pb$1 = createCommonjsModule(function (module, exports) {
  /**
   * @fileoverview
   * @enhanceable
   * @suppress {messageConventions} JS Compiler reports an error if a variable or
   *     field starts with 'MSG_' and isn't a translatable message.
   * @public
   */
  // GENERATED CODE -- DO NOT EDIT!
  var goog = jspb;
  var global = Function('return this')();
  goog.exportSymbol('proto.types.Account', null, global);
  goog.exportSymbol('proto.types.AccountList', null, global);
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */

  proto.types.Account = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
  };

  goog.inherits(proto.types.Account, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.Account.displayName = 'proto.types.Account';
  }

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.Account.prototype.toObject = function (opt_includeInstance) {
      return proto.types.Account.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.Account} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.Account.toObject = function (includeInstance, msg) {
      var obj = {
        address: msg.getAddress_asB64()
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.Account}
   */


  proto.types.Account.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.Account();
    return proto.types.Account.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.Account} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.Account}
   */


  proto.types.Account.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setAddress(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.Account.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.Account.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.Account} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.Account.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getAddress_asU8();

    if (f.length > 0) {
      writer.writeBytes(1, f);
    }
  };
  /**
   * optional bytes address = 1;
   * @return {!(string|Uint8Array)}
   */


  proto.types.Account.prototype.getAddress = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 1, "")
    );
  };
  /**
   * optional bytes address = 1;
   * This is a type-conversion wrapper around `getAddress()`
   * @return {string}
   */


  proto.types.Account.prototype.getAddress_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getAddress())
    );
  };
  /**
   * optional bytes address = 1;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getAddress()`
   * @return {!Uint8Array}
   */


  proto.types.Account.prototype.getAddress_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getAddress())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.Account.prototype.setAddress = function (value) {
    jspb.Message.setField(this, 1, value);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.AccountList = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, proto.types.AccountList.repeatedFields_, null);
  };

  goog.inherits(proto.types.AccountList, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.AccountList.displayName = 'proto.types.AccountList';
  }
  /**
   * List of repeated fields within this message type.
   * @private {!Array<number>}
   * @const
   */


  proto.types.AccountList.repeatedFields_ = [1];

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.AccountList.prototype.toObject = function (opt_includeInstance) {
      return proto.types.AccountList.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.AccountList} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.AccountList.toObject = function (includeInstance, msg) {
      var obj = {
        accountsList: jspb.Message.toObjectList(msg.getAccountsList(), proto.types.Account.toObject, includeInstance)
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.AccountList}
   */


  proto.types.AccountList.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.AccountList();
    return proto.types.AccountList.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.AccountList} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.AccountList}
   */


  proto.types.AccountList.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value = new proto.types.Account();
          reader.readMessage(value, proto.types.Account.deserializeBinaryFromReader);
          msg.addAccounts(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.AccountList.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.AccountList.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.AccountList} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.AccountList.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getAccountsList();

    if (f.length > 0) {
      writer.writeRepeatedMessage(1, f, proto.types.Account.serializeBinaryToWriter);
    }
  };
  /**
   * repeated Account accounts = 1;
   * @return {!Array.<!proto.types.Account>}
   */


  proto.types.AccountList.prototype.getAccountsList = function () {
    return (
      /** @type{!Array.<!proto.types.Account>} */
      jspb.Message.getRepeatedWrapperField(this, proto.types.Account, 1)
    );
  };
  /** @param {!Array.<!proto.types.Account>} value */


  proto.types.AccountList.prototype.setAccountsList = function (value) {
    jspb.Message.setRepeatedWrapperField(this, 1, value);
  };
  /**
   * @param {!proto.types.Account=} opt_value
   * @param {number=} opt_index
   * @return {!proto.types.Account}
   */


  proto.types.AccountList.prototype.addAccounts = function (opt_value, opt_index) {
    return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.types.Account, opt_index);
  };

  proto.types.AccountList.prototype.clearAccountsList = function () {
    this.setAccountsList([]);
  };

  goog.object.extend(exports, proto.types);
});

var node_pb$1 = createCommonjsModule(function (module, exports) {
  /**
   * @fileoverview
   * @enhanceable
   * @suppress {messageConventions} JS Compiler reports an error if a variable or
   *     field starts with 'MSG_' and isn't a translatable message.
   * @public
   */
  // GENERATED CODE -- DO NOT EDIT!
  var goog = jspb;
  var global = Function('return this')();
  goog.exportSymbol('proto.types.PeerAddress', null, global);
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */

  proto.types.PeerAddress = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
  };

  goog.inherits(proto.types.PeerAddress, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.PeerAddress.displayName = 'proto.types.PeerAddress';
  }

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.PeerAddress.prototype.toObject = function (opt_includeInstance) {
      return proto.types.PeerAddress.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.PeerAddress} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.PeerAddress.toObject = function (includeInstance, msg) {
      var obj = {
        address: msg.getAddress_asB64(),
        port: jspb.Message.getFieldWithDefault(msg, 2, 0),
        peerid: msg.getPeerid_asB64()
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.PeerAddress}
   */


  proto.types.PeerAddress.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.PeerAddress();
    return proto.types.PeerAddress.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.PeerAddress} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.PeerAddress}
   */


  proto.types.PeerAddress.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setAddress(value);
          break;

        case 2:
          var value =
          /** @type {number} */
          reader.readUint32();
          msg.setPort(value);
          break;

        case 3:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setPeerid(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.PeerAddress.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.PeerAddress.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.PeerAddress} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.PeerAddress.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getAddress_asU8();

    if (f.length > 0) {
      writer.writeBytes(1, f);
    }

    f = message.getPort();

    if (f !== 0) {
      writer.writeUint32(2, f);
    }

    f = message.getPeerid_asU8();

    if (f.length > 0) {
      writer.writeBytes(3, f);
    }
  };
  /**
   * optional bytes address = 1;
   * @return {!(string|Uint8Array)}
   */


  proto.types.PeerAddress.prototype.getAddress = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 1, "")
    );
  };
  /**
   * optional bytes address = 1;
   * This is a type-conversion wrapper around `getAddress()`
   * @return {string}
   */


  proto.types.PeerAddress.prototype.getAddress_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getAddress())
    );
  };
  /**
   * optional bytes address = 1;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getAddress()`
   * @return {!Uint8Array}
   */


  proto.types.PeerAddress.prototype.getAddress_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getAddress())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.PeerAddress.prototype.setAddress = function (value) {
    jspb.Message.setField(this, 1, value);
  };
  /**
   * optional uint32 port = 2;
   * @return {number}
   */


  proto.types.PeerAddress.prototype.getPort = function () {
    return (
      /** @type {number} */
      jspb.Message.getFieldWithDefault(this, 2, 0)
    );
  };
  /** @param {number} value */


  proto.types.PeerAddress.prototype.setPort = function (value) {
    jspb.Message.setField(this, 2, value);
  };
  /**
   * optional bytes peerID = 3;
   * @return {!(string|Uint8Array)}
   */


  proto.types.PeerAddress.prototype.getPeerid = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 3, "")
    );
  };
  /**
   * optional bytes peerID = 3;
   * This is a type-conversion wrapper around `getPeerid()`
   * @return {string}
   */


  proto.types.PeerAddress.prototype.getPeerid_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getPeerid())
    );
  };
  /**
   * optional bytes peerID = 3;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getPeerid()`
   * @return {!Uint8Array}
   */


  proto.types.PeerAddress.prototype.getPeerid_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getPeerid())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.PeerAddress.prototype.setPeerid = function (value) {
    jspb.Message.setField(this, 3, value);
  };

  goog.object.extend(exports, proto.types);
});

var rpc_pb$1 = createCommonjsModule(function (module, exports) {
  /**
   * @fileoverview
   * @enhanceable
   * @suppress {messageConventions} JS Compiler reports an error if a variable or
   *     field starts with 'MSG_' and isn't a translatable message.
   * @public
   */
  // GENERATED CODE -- DO NOT EDIT!
  var goog = jspb;
  var global = Function('return this')();
  goog.exportSymbol('proto.types.AccountAndRoot', null, global);
  goog.exportSymbol('proto.types.BlockHeaderList', null, global);
  goog.exportSymbol('proto.types.BlockchainStatus', null, global);
  goog.exportSymbol('proto.types.CommitResult', null, global);
  goog.exportSymbol('proto.types.CommitResultList', null, global);
  goog.exportSymbol('proto.types.CommitStatus', null, global);
  goog.exportSymbol('proto.types.Empty', null, global);
  goog.exportSymbol('proto.types.ImportFormat', null, global);
  goog.exportSymbol('proto.types.Input', null, global);
  goog.exportSymbol('proto.types.ListParams', null, global);
  goog.exportSymbol('proto.types.Output', null, global);
  goog.exportSymbol('proto.types.PeerList', null, global);
  goog.exportSymbol('proto.types.Personal', null, global);
  goog.exportSymbol('proto.types.SingleBytes', null, global);
  goog.exportSymbol('proto.types.VerifyResult', null, global);
  goog.exportSymbol('proto.types.VerifyStatus', null, global);
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */

  proto.types.BlockchainStatus = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
  };

  goog.inherits(proto.types.BlockchainStatus, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.BlockchainStatus.displayName = 'proto.types.BlockchainStatus';
  }

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.BlockchainStatus.prototype.toObject = function (opt_includeInstance) {
      return proto.types.BlockchainStatus.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.BlockchainStatus} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.BlockchainStatus.toObject = function (includeInstance, msg) {
      var obj = {
        bestBlockHash: msg.getBestBlockHash_asB64(),
        bestHeight: jspb.Message.getFieldWithDefault(msg, 2, 0)
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.BlockchainStatus}
   */


  proto.types.BlockchainStatus.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.BlockchainStatus();
    return proto.types.BlockchainStatus.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.BlockchainStatus} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.BlockchainStatus}
   */


  proto.types.BlockchainStatus.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setBestBlockHash(value);
          break;

        case 2:
          var value =
          /** @type {number} */
          reader.readUint64();
          msg.setBestHeight(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.BlockchainStatus.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.BlockchainStatus.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.BlockchainStatus} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.BlockchainStatus.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getBestBlockHash_asU8();

    if (f.length > 0) {
      writer.writeBytes(1, f);
    }

    f = message.getBestHeight();

    if (f !== 0) {
      writer.writeUint64(2, f);
    }
  };
  /**
   * optional bytes best_block_hash = 1;
   * @return {!(string|Uint8Array)}
   */


  proto.types.BlockchainStatus.prototype.getBestBlockHash = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 1, "")
    );
  };
  /**
   * optional bytes best_block_hash = 1;
   * This is a type-conversion wrapper around `getBestBlockHash()`
   * @return {string}
   */


  proto.types.BlockchainStatus.prototype.getBestBlockHash_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getBestBlockHash())
    );
  };
  /**
   * optional bytes best_block_hash = 1;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getBestBlockHash()`
   * @return {!Uint8Array}
   */


  proto.types.BlockchainStatus.prototype.getBestBlockHash_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getBestBlockHash())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.BlockchainStatus.prototype.setBestBlockHash = function (value) {
    jspb.Message.setField(this, 1, value);
  };
  /**
   * optional uint64 best_height = 2;
   * @return {number}
   */


  proto.types.BlockchainStatus.prototype.getBestHeight = function () {
    return (
      /** @type {number} */
      jspb.Message.getFieldWithDefault(this, 2, 0)
    );
  };
  /** @param {number} value */


  proto.types.BlockchainStatus.prototype.setBestHeight = function (value) {
    jspb.Message.setField(this, 2, value);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.Input = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, proto.types.Input.repeatedFields_, null);
  };

  goog.inherits(proto.types.Input, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.Input.displayName = 'proto.types.Input';
  }
  /**
   * List of repeated fields within this message type.
   * @private {!Array<number>}
   * @const
   */


  proto.types.Input.repeatedFields_ = [2];

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.Input.prototype.toObject = function (opt_includeInstance) {
      return proto.types.Input.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.Input} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.Input.toObject = function (includeInstance, msg) {
      var obj = {
        hash: msg.getHash_asB64(),
        addressList: msg.getAddressList_asB64(),
        value: msg.getValue_asB64(),
        script: msg.getScript_asB64()
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.Input}
   */


  proto.types.Input.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.Input();
    return proto.types.Input.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.Input} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.Input}
   */


  proto.types.Input.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setHash(value);
          break;

        case 2:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.addAddress(value);
          break;

        case 3:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setValue(value);
          break;

        case 4:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setScript(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.Input.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.Input.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.Input} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.Input.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getHash_asU8();

    if (f.length > 0) {
      writer.writeBytes(1, f);
    }

    f = message.getAddressList_asU8();

    if (f.length > 0) {
      writer.writeRepeatedBytes(2, f);
    }

    f = message.getValue_asU8();

    if (f.length > 0) {
      writer.writeBytes(3, f);
    }

    f = message.getScript_asU8();

    if (f.length > 0) {
      writer.writeBytes(4, f);
    }
  };
  /**
   * optional bytes hash = 1;
   * @return {!(string|Uint8Array)}
   */


  proto.types.Input.prototype.getHash = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 1, "")
    );
  };
  /**
   * optional bytes hash = 1;
   * This is a type-conversion wrapper around `getHash()`
   * @return {string}
   */


  proto.types.Input.prototype.getHash_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getHash())
    );
  };
  /**
   * optional bytes hash = 1;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getHash()`
   * @return {!Uint8Array}
   */


  proto.types.Input.prototype.getHash_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getHash())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.Input.prototype.setHash = function (value) {
    jspb.Message.setField(this, 1, value);
  };
  /**
   * repeated bytes address = 2;
   * @return {!(Array<!Uint8Array>|Array<string>)}
   */


  proto.types.Input.prototype.getAddressList = function () {
    return (
      /** @type {!(Array<!Uint8Array>|Array<string>)} */
      jspb.Message.getRepeatedField(this, 2)
    );
  };
  /**
   * repeated bytes address = 2;
   * This is a type-conversion wrapper around `getAddressList()`
   * @return {!Array.<string>}
   */


  proto.types.Input.prototype.getAddressList_asB64 = function () {
    return (
      /** @type {!Array.<string>} */
      jspb.Message.bytesListAsB64(this.getAddressList())
    );
  };
  /**
   * repeated bytes address = 2;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getAddressList()`
   * @return {!Array.<!Uint8Array>}
   */


  proto.types.Input.prototype.getAddressList_asU8 = function () {
    return (
      /** @type {!Array.<!Uint8Array>} */
      jspb.Message.bytesListAsU8(this.getAddressList())
    );
  };
  /** @param {!(Array<!Uint8Array>|Array<string>)} value */


  proto.types.Input.prototype.setAddressList = function (value) {
    jspb.Message.setField(this, 2, value || []);
  };
  /**
   * @param {!(string|Uint8Array)} value
   * @param {number=} opt_index
   */


  proto.types.Input.prototype.addAddress = function (value, opt_index) {
    jspb.Message.addToRepeatedField(this, 2, value, opt_index);
  };

  proto.types.Input.prototype.clearAddressList = function () {
    this.setAddressList([]);
  };
  /**
   * optional bytes value = 3;
   * @return {!(string|Uint8Array)}
   */


  proto.types.Input.prototype.getValue = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 3, "")
    );
  };
  /**
   * optional bytes value = 3;
   * This is a type-conversion wrapper around `getValue()`
   * @return {string}
   */


  proto.types.Input.prototype.getValue_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getValue())
    );
  };
  /**
   * optional bytes value = 3;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getValue()`
   * @return {!Uint8Array}
   */


  proto.types.Input.prototype.getValue_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getValue())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.Input.prototype.setValue = function (value) {
    jspb.Message.setField(this, 3, value);
  };
  /**
   * optional bytes script = 4;
   * @return {!(string|Uint8Array)}
   */


  proto.types.Input.prototype.getScript = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 4, "")
    );
  };
  /**
   * optional bytes script = 4;
   * This is a type-conversion wrapper around `getScript()`
   * @return {string}
   */


  proto.types.Input.prototype.getScript_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getScript())
    );
  };
  /**
   * optional bytes script = 4;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getScript()`
   * @return {!Uint8Array}
   */


  proto.types.Input.prototype.getScript_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getScript())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.Input.prototype.setScript = function (value) {
    jspb.Message.setField(this, 4, value);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.Output = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
  };

  goog.inherits(proto.types.Output, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.Output.displayName = 'proto.types.Output';
  }

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.Output.prototype.toObject = function (opt_includeInstance) {
      return proto.types.Output.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.Output} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.Output.toObject = function (includeInstance, msg) {
      var obj = {
        index: jspb.Message.getFieldWithDefault(msg, 1, 0),
        address: msg.getAddress_asB64(),
        value: msg.getValue_asB64(),
        script: msg.getScript_asB64()
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.Output}
   */


  proto.types.Output.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.Output();
    return proto.types.Output.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.Output} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.Output}
   */


  proto.types.Output.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value =
          /** @type {number} */
          reader.readUint32();
          msg.setIndex(value);
          break;

        case 2:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setAddress(value);
          break;

        case 3:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setValue(value);
          break;

        case 4:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setScript(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.Output.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.Output.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.Output} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.Output.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getIndex();

    if (f !== 0) {
      writer.writeUint32(1, f);
    }

    f = message.getAddress_asU8();

    if (f.length > 0) {
      writer.writeBytes(2, f);
    }

    f = message.getValue_asU8();

    if (f.length > 0) {
      writer.writeBytes(3, f);
    }

    f = message.getScript_asU8();

    if (f.length > 0) {
      writer.writeBytes(4, f);
    }
  };
  /**
   * optional uint32 index = 1;
   * @return {number}
   */


  proto.types.Output.prototype.getIndex = function () {
    return (
      /** @type {number} */
      jspb.Message.getFieldWithDefault(this, 1, 0)
    );
  };
  /** @param {number} value */


  proto.types.Output.prototype.setIndex = function (value) {
    jspb.Message.setField(this, 1, value);
  };
  /**
   * optional bytes address = 2;
   * @return {!(string|Uint8Array)}
   */


  proto.types.Output.prototype.getAddress = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 2, "")
    );
  };
  /**
   * optional bytes address = 2;
   * This is a type-conversion wrapper around `getAddress()`
   * @return {string}
   */


  proto.types.Output.prototype.getAddress_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getAddress())
    );
  };
  /**
   * optional bytes address = 2;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getAddress()`
   * @return {!Uint8Array}
   */


  proto.types.Output.prototype.getAddress_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getAddress())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.Output.prototype.setAddress = function (value) {
    jspb.Message.setField(this, 2, value);
  };
  /**
   * optional bytes value = 3;
   * @return {!(string|Uint8Array)}
   */


  proto.types.Output.prototype.getValue = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 3, "")
    );
  };
  /**
   * optional bytes value = 3;
   * This is a type-conversion wrapper around `getValue()`
   * @return {string}
   */


  proto.types.Output.prototype.getValue_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getValue())
    );
  };
  /**
   * optional bytes value = 3;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getValue()`
   * @return {!Uint8Array}
   */


  proto.types.Output.prototype.getValue_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getValue())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.Output.prototype.setValue = function (value) {
    jspb.Message.setField(this, 3, value);
  };
  /**
   * optional bytes script = 4;
   * @return {!(string|Uint8Array)}
   */


  proto.types.Output.prototype.getScript = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 4, "")
    );
  };
  /**
   * optional bytes script = 4;
   * This is a type-conversion wrapper around `getScript()`
   * @return {string}
   */


  proto.types.Output.prototype.getScript_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getScript())
    );
  };
  /**
   * optional bytes script = 4;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getScript()`
   * @return {!Uint8Array}
   */


  proto.types.Output.prototype.getScript_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getScript())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.Output.prototype.setScript = function (value) {
    jspb.Message.setField(this, 4, value);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.Empty = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
  };

  goog.inherits(proto.types.Empty, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.Empty.displayName = 'proto.types.Empty';
  }

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.Empty.prototype.toObject = function (opt_includeInstance) {
      return proto.types.Empty.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.Empty} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.Empty.toObject = function (includeInstance, msg) {
      var obj = {};

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.Empty}
   */


  proto.types.Empty.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.Empty();
    return proto.types.Empty.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.Empty} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.Empty}
   */


  proto.types.Empty.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.Empty.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.Empty.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.Empty} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.Empty.serializeBinaryToWriter = function (message, writer) {
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.SingleBytes = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
  };

  goog.inherits(proto.types.SingleBytes, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.SingleBytes.displayName = 'proto.types.SingleBytes';
  }

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.SingleBytes.prototype.toObject = function (opt_includeInstance) {
      return proto.types.SingleBytes.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.SingleBytes} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.SingleBytes.toObject = function (includeInstance, msg) {
      var obj = {
        value: msg.getValue_asB64()
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.SingleBytes}
   */


  proto.types.SingleBytes.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.SingleBytes();
    return proto.types.SingleBytes.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.SingleBytes} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.SingleBytes}
   */


  proto.types.SingleBytes.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setValue(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.SingleBytes.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.SingleBytes.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.SingleBytes} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.SingleBytes.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getValue_asU8();

    if (f.length > 0) {
      writer.writeBytes(1, f);
    }
  };
  /**
   * optional bytes value = 1;
   * @return {!(string|Uint8Array)}
   */


  proto.types.SingleBytes.prototype.getValue = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 1, "")
    );
  };
  /**
   * optional bytes value = 1;
   * This is a type-conversion wrapper around `getValue()`
   * @return {string}
   */


  proto.types.SingleBytes.prototype.getValue_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getValue())
    );
  };
  /**
   * optional bytes value = 1;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getValue()`
   * @return {!Uint8Array}
   */


  proto.types.SingleBytes.prototype.getValue_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getValue())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.SingleBytes.prototype.setValue = function (value) {
    jspb.Message.setField(this, 1, value);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.AccountAndRoot = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
  };

  goog.inherits(proto.types.AccountAndRoot, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.AccountAndRoot.displayName = 'proto.types.AccountAndRoot';
  }

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.AccountAndRoot.prototype.toObject = function (opt_includeInstance) {
      return proto.types.AccountAndRoot.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.AccountAndRoot} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.AccountAndRoot.toObject = function (includeInstance, msg) {
      var obj = {
        account: msg.getAccount_asB64(),
        root: msg.getRoot_asB64()
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.AccountAndRoot}
   */


  proto.types.AccountAndRoot.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.AccountAndRoot();
    return proto.types.AccountAndRoot.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.AccountAndRoot} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.AccountAndRoot}
   */


  proto.types.AccountAndRoot.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setAccount(value);
          break;

        case 2:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setRoot(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.AccountAndRoot.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.AccountAndRoot.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.AccountAndRoot} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.AccountAndRoot.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getAccount_asU8();

    if (f.length > 0) {
      writer.writeBytes(1, f);
    }

    f = message.getRoot_asU8();

    if (f.length > 0) {
      writer.writeBytes(2, f);
    }
  };
  /**
   * optional bytes Account = 1;
   * @return {!(string|Uint8Array)}
   */


  proto.types.AccountAndRoot.prototype.getAccount = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 1, "")
    );
  };
  /**
   * optional bytes Account = 1;
   * This is a type-conversion wrapper around `getAccount()`
   * @return {string}
   */


  proto.types.AccountAndRoot.prototype.getAccount_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getAccount())
    );
  };
  /**
   * optional bytes Account = 1;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getAccount()`
   * @return {!Uint8Array}
   */


  proto.types.AccountAndRoot.prototype.getAccount_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getAccount())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.AccountAndRoot.prototype.setAccount = function (value) {
    jspb.Message.setField(this, 1, value);
  };
  /**
   * optional bytes Root = 2;
   * @return {!(string|Uint8Array)}
   */


  proto.types.AccountAndRoot.prototype.getRoot = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 2, "")
    );
  };
  /**
   * optional bytes Root = 2;
   * This is a type-conversion wrapper around `getRoot()`
   * @return {string}
   */


  proto.types.AccountAndRoot.prototype.getRoot_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getRoot())
    );
  };
  /**
   * optional bytes Root = 2;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getRoot()`
   * @return {!Uint8Array}
   */


  proto.types.AccountAndRoot.prototype.getRoot_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getRoot())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.AccountAndRoot.prototype.setRoot = function (value) {
    jspb.Message.setField(this, 2, value);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.PeerList = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, proto.types.PeerList.repeatedFields_, null);
  };

  goog.inherits(proto.types.PeerList, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.PeerList.displayName = 'proto.types.PeerList';
  }
  /**
   * List of repeated fields within this message type.
   * @private {!Array<number>}
   * @const
   */


  proto.types.PeerList.repeatedFields_ = [1, 2];

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.PeerList.prototype.toObject = function (opt_includeInstance) {
      return proto.types.PeerList.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.PeerList} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.PeerList.toObject = function (includeInstance, msg) {
      var obj = {
        peersList: jspb.Message.toObjectList(msg.getPeersList(), node_pb$1.PeerAddress.toObject, includeInstance),
        statesList: jspb.Message.getRepeatedField(msg, 2)
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.PeerList}
   */


  proto.types.PeerList.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.PeerList();
    return proto.types.PeerList.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.PeerList} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.PeerList}
   */


  proto.types.PeerList.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value = new node_pb$1.PeerAddress();
          reader.readMessage(value, node_pb$1.PeerAddress.deserializeBinaryFromReader);
          msg.addPeers(value);
          break;

        case 2:
          var value =
          /** @type {!Array.<number>} */
          reader.readPackedInt32();
          msg.setStatesList(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.PeerList.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.PeerList.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.PeerList} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.PeerList.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getPeersList();

    if (f.length > 0) {
      writer.writeRepeatedMessage(1, f, node_pb$1.PeerAddress.serializeBinaryToWriter);
    }

    f = message.getStatesList();

    if (f.length > 0) {
      writer.writePackedInt32(2, f);
    }
  };
  /**
   * repeated PeerAddress peers = 1;
   * @return {!Array.<!proto.types.PeerAddress>}
   */


  proto.types.PeerList.prototype.getPeersList = function () {
    return (
      /** @type{!Array.<!proto.types.PeerAddress>} */
      jspb.Message.getRepeatedWrapperField(this, node_pb$1.PeerAddress, 1)
    );
  };
  /** @param {!Array.<!proto.types.PeerAddress>} value */


  proto.types.PeerList.prototype.setPeersList = function (value) {
    jspb.Message.setRepeatedWrapperField(this, 1, value);
  };
  /**
   * @param {!proto.types.PeerAddress=} opt_value
   * @param {number=} opt_index
   * @return {!proto.types.PeerAddress}
   */


  proto.types.PeerList.prototype.addPeers = function (opt_value, opt_index) {
    return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.types.PeerAddress, opt_index);
  };

  proto.types.PeerList.prototype.clearPeersList = function () {
    this.setPeersList([]);
  };
  /**
   * repeated int32 states = 2;
   * @return {!Array.<number>}
   */


  proto.types.PeerList.prototype.getStatesList = function () {
    return (
      /** @type {!Array.<number>} */
      jspb.Message.getRepeatedField(this, 2)
    );
  };
  /** @param {!Array.<number>} value */


  proto.types.PeerList.prototype.setStatesList = function (value) {
    jspb.Message.setField(this, 2, value || []);
  };
  /**
   * @param {!number} value
   * @param {number=} opt_index
   */


  proto.types.PeerList.prototype.addStates = function (value, opt_index) {
    jspb.Message.addToRepeatedField(this, 2, value, opt_index);
  };

  proto.types.PeerList.prototype.clearStatesList = function () {
    this.setStatesList([]);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.ListParams = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
  };

  goog.inherits(proto.types.ListParams, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.ListParams.displayName = 'proto.types.ListParams';
  }

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.ListParams.prototype.toObject = function (opt_includeInstance) {
      return proto.types.ListParams.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.ListParams} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.ListParams.toObject = function (includeInstance, msg) {
      var obj = {
        hash: msg.getHash_asB64(),
        height: jspb.Message.getFieldWithDefault(msg, 2, 0),
        size: jspb.Message.getFieldWithDefault(msg, 3, 0),
        offset: jspb.Message.getFieldWithDefault(msg, 4, 0),
        asc: jspb.Message.getFieldWithDefault(msg, 5, false)
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.ListParams}
   */


  proto.types.ListParams.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.ListParams();
    return proto.types.ListParams.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.ListParams} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.ListParams}
   */


  proto.types.ListParams.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setHash(value);
          break;

        case 2:
          var value =
          /** @type {number} */
          reader.readUint64();
          msg.setHeight(value);
          break;

        case 3:
          var value =
          /** @type {number} */
          reader.readUint32();
          msg.setSize(value);
          break;

        case 4:
          var value =
          /** @type {number} */
          reader.readUint32();
          msg.setOffset(value);
          break;

        case 5:
          var value =
          /** @type {boolean} */
          reader.readBool();
          msg.setAsc(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.ListParams.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.ListParams.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.ListParams} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.ListParams.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getHash_asU8();

    if (f.length > 0) {
      writer.writeBytes(1, f);
    }

    f = message.getHeight();

    if (f !== 0) {
      writer.writeUint64(2, f);
    }

    f = message.getSize();

    if (f !== 0) {
      writer.writeUint32(3, f);
    }

    f = message.getOffset();

    if (f !== 0) {
      writer.writeUint32(4, f);
    }

    f = message.getAsc();

    if (f) {
      writer.writeBool(5, f);
    }
  };
  /**
   * optional bytes hash = 1;
   * @return {!(string|Uint8Array)}
   */


  proto.types.ListParams.prototype.getHash = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 1, "")
    );
  };
  /**
   * optional bytes hash = 1;
   * This is a type-conversion wrapper around `getHash()`
   * @return {string}
   */


  proto.types.ListParams.prototype.getHash_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getHash())
    );
  };
  /**
   * optional bytes hash = 1;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getHash()`
   * @return {!Uint8Array}
   */


  proto.types.ListParams.prototype.getHash_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getHash())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.ListParams.prototype.setHash = function (value) {
    jspb.Message.setField(this, 1, value);
  };
  /**
   * optional uint64 height = 2;
   * @return {number}
   */


  proto.types.ListParams.prototype.getHeight = function () {
    return (
      /** @type {number} */
      jspb.Message.getFieldWithDefault(this, 2, 0)
    );
  };
  /** @param {number} value */


  proto.types.ListParams.prototype.setHeight = function (value) {
    jspb.Message.setField(this, 2, value);
  };
  /**
   * optional uint32 size = 3;
   * @return {number}
   */


  proto.types.ListParams.prototype.getSize = function () {
    return (
      /** @type {number} */
      jspb.Message.getFieldWithDefault(this, 3, 0)
    );
  };
  /** @param {number} value */


  proto.types.ListParams.prototype.setSize = function (value) {
    jspb.Message.setField(this, 3, value);
  };
  /**
   * optional uint32 offset = 4;
   * @return {number}
   */


  proto.types.ListParams.prototype.getOffset = function () {
    return (
      /** @type {number} */
      jspb.Message.getFieldWithDefault(this, 4, 0)
    );
  };
  /** @param {number} value */


  proto.types.ListParams.prototype.setOffset = function (value) {
    jspb.Message.setField(this, 4, value);
  };
  /**
   * optional bool asc = 5;
   * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
   * You should avoid comparisons like {@code val === true/false} in those cases.
   * @return {boolean}
   */


  proto.types.ListParams.prototype.getAsc = function () {
    return (
      /** @type {boolean} */
      jspb.Message.getFieldWithDefault(this, 5, false)
    );
  };
  /** @param {boolean} value */


  proto.types.ListParams.prototype.setAsc = function (value) {
    jspb.Message.setField(this, 5, value);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.BlockHeaderList = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, proto.types.BlockHeaderList.repeatedFields_, null);
  };

  goog.inherits(proto.types.BlockHeaderList, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.BlockHeaderList.displayName = 'proto.types.BlockHeaderList';
  }
  /**
   * List of repeated fields within this message type.
   * @private {!Array<number>}
   * @const
   */


  proto.types.BlockHeaderList.repeatedFields_ = [1];

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.BlockHeaderList.prototype.toObject = function (opt_includeInstance) {
      return proto.types.BlockHeaderList.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.BlockHeaderList} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.BlockHeaderList.toObject = function (includeInstance, msg) {
      var obj = {
        blocksList: jspb.Message.toObjectList(msg.getBlocksList(), blockchain_pb$1.Block.toObject, includeInstance)
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.BlockHeaderList}
   */


  proto.types.BlockHeaderList.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.BlockHeaderList();
    return proto.types.BlockHeaderList.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.BlockHeaderList} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.BlockHeaderList}
   */


  proto.types.BlockHeaderList.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value = new blockchain_pb$1.Block();
          reader.readMessage(value, blockchain_pb$1.Block.deserializeBinaryFromReader);
          msg.addBlocks(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.BlockHeaderList.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.BlockHeaderList.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.BlockHeaderList} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.BlockHeaderList.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getBlocksList();

    if (f.length > 0) {
      writer.writeRepeatedMessage(1, f, blockchain_pb$1.Block.serializeBinaryToWriter);
    }
  };
  /**
   * repeated Block blocks = 1;
   * @return {!Array.<!proto.types.Block>}
   */


  proto.types.BlockHeaderList.prototype.getBlocksList = function () {
    return (
      /** @type{!Array.<!proto.types.Block>} */
      jspb.Message.getRepeatedWrapperField(this, blockchain_pb$1.Block, 1)
    );
  };
  /** @param {!Array.<!proto.types.Block>} value */


  proto.types.BlockHeaderList.prototype.setBlocksList = function (value) {
    jspb.Message.setRepeatedWrapperField(this, 1, value);
  };
  /**
   * @param {!proto.types.Block=} opt_value
   * @param {number=} opt_index
   * @return {!proto.types.Block}
   */


  proto.types.BlockHeaderList.prototype.addBlocks = function (opt_value, opt_index) {
    return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.types.Block, opt_index);
  };

  proto.types.BlockHeaderList.prototype.clearBlocksList = function () {
    this.setBlocksList([]);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.CommitResult = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
  };

  goog.inherits(proto.types.CommitResult, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.CommitResult.displayName = 'proto.types.CommitResult';
  }

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.CommitResult.prototype.toObject = function (opt_includeInstance) {
      return proto.types.CommitResult.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.CommitResult} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.CommitResult.toObject = function (includeInstance, msg) {
      var obj = {
        hash: msg.getHash_asB64(),
        error: jspb.Message.getFieldWithDefault(msg, 2, 0),
        detail: jspb.Message.getFieldWithDefault(msg, 3, "")
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.CommitResult}
   */


  proto.types.CommitResult.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.CommitResult();
    return proto.types.CommitResult.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.CommitResult} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.CommitResult}
   */


  proto.types.CommitResult.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value =
          /** @type {!Uint8Array} */
          reader.readBytes();
          msg.setHash(value);
          break;

        case 2:
          var value =
          /** @type {!proto.types.CommitStatus} */
          reader.readEnum();
          msg.setError(value);
          break;

        case 3:
          var value =
          /** @type {string} */
          reader.readString();
          msg.setDetail(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.CommitResult.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.CommitResult.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.CommitResult} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.CommitResult.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getHash_asU8();

    if (f.length > 0) {
      writer.writeBytes(1, f);
    }

    f = message.getError();

    if (f !== 0.0) {
      writer.writeEnum(2, f);
    }

    f = message.getDetail();

    if (f.length > 0) {
      writer.writeString(3, f);
    }
  };
  /**
   * optional bytes hash = 1;
   * @return {!(string|Uint8Array)}
   */


  proto.types.CommitResult.prototype.getHash = function () {
    return (
      /** @type {!(string|Uint8Array)} */
      jspb.Message.getFieldWithDefault(this, 1, "")
    );
  };
  /**
   * optional bytes hash = 1;
   * This is a type-conversion wrapper around `getHash()`
   * @return {string}
   */


  proto.types.CommitResult.prototype.getHash_asB64 = function () {
    return (
      /** @type {string} */
      jspb.Message.bytesAsB64(this.getHash())
    );
  };
  /**
   * optional bytes hash = 1;
   * Note that Uint8Array is not supported on all browsers.
   * @see http://caniuse.com/Uint8Array
   * This is a type-conversion wrapper around `getHash()`
   * @return {!Uint8Array}
   */


  proto.types.CommitResult.prototype.getHash_asU8 = function () {
    return (
      /** @type {!Uint8Array} */
      jspb.Message.bytesAsU8(this.getHash())
    );
  };
  /** @param {!(string|Uint8Array)} value */


  proto.types.CommitResult.prototype.setHash = function (value) {
    jspb.Message.setField(this, 1, value);
  };
  /**
   * optional CommitStatus error = 2;
   * @return {!proto.types.CommitStatus}
   */


  proto.types.CommitResult.prototype.getError = function () {
    return (
      /** @type {!proto.types.CommitStatus} */
      jspb.Message.getFieldWithDefault(this, 2, 0)
    );
  };
  /** @param {!proto.types.CommitStatus} value */


  proto.types.CommitResult.prototype.setError = function (value) {
    jspb.Message.setField(this, 2, value);
  };
  /**
   * optional string detail = 3;
   * @return {string}
   */


  proto.types.CommitResult.prototype.getDetail = function () {
    return (
      /** @type {string} */
      jspb.Message.getFieldWithDefault(this, 3, "")
    );
  };
  /** @param {string} value */


  proto.types.CommitResult.prototype.setDetail = function (value) {
    jspb.Message.setField(this, 3, value);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.CommitResultList = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, proto.types.CommitResultList.repeatedFields_, null);
  };

  goog.inherits(proto.types.CommitResultList, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.CommitResultList.displayName = 'proto.types.CommitResultList';
  }
  /**
   * List of repeated fields within this message type.
   * @private {!Array<number>}
   * @const
   */


  proto.types.CommitResultList.repeatedFields_ = [1];

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.CommitResultList.prototype.toObject = function (opt_includeInstance) {
      return proto.types.CommitResultList.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.CommitResultList} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.CommitResultList.toObject = function (includeInstance, msg) {
      var obj = {
        resultsList: jspb.Message.toObjectList(msg.getResultsList(), proto.types.CommitResult.toObject, includeInstance)
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.CommitResultList}
   */


  proto.types.CommitResultList.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.CommitResultList();
    return proto.types.CommitResultList.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.CommitResultList} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.CommitResultList}
   */


  proto.types.CommitResultList.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value = new proto.types.CommitResult();
          reader.readMessage(value, proto.types.CommitResult.deserializeBinaryFromReader);
          msg.addResults(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.CommitResultList.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.CommitResultList.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.CommitResultList} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.CommitResultList.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getResultsList();

    if (f.length > 0) {
      writer.writeRepeatedMessage(1, f, proto.types.CommitResult.serializeBinaryToWriter);
    }
  };
  /**
   * repeated CommitResult results = 1;
   * @return {!Array.<!proto.types.CommitResult>}
   */


  proto.types.CommitResultList.prototype.getResultsList = function () {
    return (
      /** @type{!Array.<!proto.types.CommitResult>} */
      jspb.Message.getRepeatedWrapperField(this, proto.types.CommitResult, 1)
    );
  };
  /** @param {!Array.<!proto.types.CommitResult>} value */


  proto.types.CommitResultList.prototype.setResultsList = function (value) {
    jspb.Message.setRepeatedWrapperField(this, 1, value);
  };
  /**
   * @param {!proto.types.CommitResult=} opt_value
   * @param {number=} opt_index
   * @return {!proto.types.CommitResult}
   */


  proto.types.CommitResultList.prototype.addResults = function (opt_value, opt_index) {
    return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.types.CommitResult, opt_index);
  };

  proto.types.CommitResultList.prototype.clearResultsList = function () {
    this.setResultsList([]);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.VerifyResult = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
  };

  goog.inherits(proto.types.VerifyResult, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.VerifyResult.displayName = 'proto.types.VerifyResult';
  }

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.VerifyResult.prototype.toObject = function (opt_includeInstance) {
      return proto.types.VerifyResult.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.VerifyResult} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.VerifyResult.toObject = function (includeInstance, msg) {
      var f,
          obj = {
        tx: (f = msg.getTx()) && blockchain_pb$1.Tx.toObject(includeInstance, f),
        error: jspb.Message.getFieldWithDefault(msg, 2, 0)
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.VerifyResult}
   */


  proto.types.VerifyResult.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.VerifyResult();
    return proto.types.VerifyResult.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.VerifyResult} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.VerifyResult}
   */


  proto.types.VerifyResult.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value = new blockchain_pb$1.Tx();
          reader.readMessage(value, blockchain_pb$1.Tx.deserializeBinaryFromReader);
          msg.setTx(value);
          break;

        case 2:
          var value =
          /** @type {!proto.types.VerifyStatus} */
          reader.readEnum();
          msg.setError(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.VerifyResult.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.VerifyResult.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.VerifyResult} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.VerifyResult.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getTx();

    if (f != null) {
      writer.writeMessage(1, f, blockchain_pb$1.Tx.serializeBinaryToWriter);
    }

    f = message.getError();

    if (f !== 0.0) {
      writer.writeEnum(2, f);
    }
  };
  /**
   * optional Tx tx = 1;
   * @return {?proto.types.Tx}
   */


  proto.types.VerifyResult.prototype.getTx = function () {
    return (
      /** @type{?proto.types.Tx} */
      jspb.Message.getWrapperField(this, blockchain_pb$1.Tx, 1)
    );
  };
  /** @param {?proto.types.Tx|undefined} value */


  proto.types.VerifyResult.prototype.setTx = function (value) {
    jspb.Message.setWrapperField(this, 1, value);
  };

  proto.types.VerifyResult.prototype.clearTx = function () {
    this.setTx(undefined);
  };
  /**
   * Returns whether this field is set.
   * @return {!boolean}
   */


  proto.types.VerifyResult.prototype.hasTx = function () {
    return jspb.Message.getField(this, 1) != null;
  };
  /**
   * optional VerifyStatus error = 2;
   * @return {!proto.types.VerifyStatus}
   */


  proto.types.VerifyResult.prototype.getError = function () {
    return (
      /** @type {!proto.types.VerifyStatus} */
      jspb.Message.getFieldWithDefault(this, 2, 0)
    );
  };
  /** @param {!proto.types.VerifyStatus} value */


  proto.types.VerifyResult.prototype.setError = function (value) {
    jspb.Message.setField(this, 2, value);
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.Personal = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
  };

  goog.inherits(proto.types.Personal, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.Personal.displayName = 'proto.types.Personal';
  }

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.Personal.prototype.toObject = function (opt_includeInstance) {
      return proto.types.Personal.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.Personal} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.Personal.toObject = function (includeInstance, msg) {
      var f,
          obj = {
        passphrase: jspb.Message.getFieldWithDefault(msg, 1, ""),
        account: (f = msg.getAccount()) && account_pb$1.Account.toObject(includeInstance, f)
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.Personal}
   */


  proto.types.Personal.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.Personal();
    return proto.types.Personal.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.Personal} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.Personal}
   */


  proto.types.Personal.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value =
          /** @type {string} */
          reader.readString();
          msg.setPassphrase(value);
          break;

        case 2:
          var value = new account_pb$1.Account();
          reader.readMessage(value, account_pb$1.Account.deserializeBinaryFromReader);
          msg.setAccount(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.Personal.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.Personal.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.Personal} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.Personal.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getPassphrase();

    if (f.length > 0) {
      writer.writeString(1, f);
    }

    f = message.getAccount();

    if (f != null) {
      writer.writeMessage(2, f, account_pb$1.Account.serializeBinaryToWriter);
    }
  };
  /**
   * optional string passphrase = 1;
   * @return {string}
   */


  proto.types.Personal.prototype.getPassphrase = function () {
    return (
      /** @type {string} */
      jspb.Message.getFieldWithDefault(this, 1, "")
    );
  };
  /** @param {string} value */


  proto.types.Personal.prototype.setPassphrase = function (value) {
    jspb.Message.setField(this, 1, value);
  };
  /**
   * optional Account account = 2;
   * @return {?proto.types.Account}
   */


  proto.types.Personal.prototype.getAccount = function () {
    return (
      /** @type{?proto.types.Account} */
      jspb.Message.getWrapperField(this, account_pb$1.Account, 2)
    );
  };
  /** @param {?proto.types.Account|undefined} value */


  proto.types.Personal.prototype.setAccount = function (value) {
    jspb.Message.setWrapperField(this, 2, value);
  };

  proto.types.Personal.prototype.clearAccount = function () {
    this.setAccount(undefined);
  };
  /**
   * Returns whether this field is set.
   * @return {!boolean}
   */


  proto.types.Personal.prototype.hasAccount = function () {
    return jspb.Message.getField(this, 2) != null;
  };
  /**
   * Generated by JsPbCodeGenerator.
   * @param {Array=} opt_data Optional initial data array, typically from a
   * server response, or constructed directly in Javascript. The array is used
   * in place and becomes part of the constructed object. It is not cloned.
   * If no data is provided, the constructed object will be empty, but still
   * valid.
   * @extends {jspb.Message}
   * @constructor
   */


  proto.types.ImportFormat = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
  };

  goog.inherits(proto.types.ImportFormat, jspb.Message);

  if (goog.DEBUG && !COMPILED) {
    proto.types.ImportFormat.displayName = 'proto.types.ImportFormat';
  }

  if (jspb.Message.GENERATE_TO_OBJECT) {
    /**
     * Creates an object representation of this proto suitable for use in Soy templates.
     * Field names that are reserved in JavaScript and will be renamed to pb_name.
     * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
     * For the list of reserved names please see:
     *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
     * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
     *     for transitional soy proto support: http://goto/soy-param-migration
     * @return {!Object}
     */
    proto.types.ImportFormat.prototype.toObject = function (opt_includeInstance) {
      return proto.types.ImportFormat.toObject(opt_includeInstance, this);
    };
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Whether to include the JSPB
     *     instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!proto.types.ImportFormat} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */


    proto.types.ImportFormat.toObject = function (includeInstance, msg) {
      var f,
          obj = {
        wif: (f = msg.getWif()) && proto.types.SingleBytes.toObject(includeInstance, f),
        oldpass: jspb.Message.getFieldWithDefault(msg, 2, ""),
        newpass: jspb.Message.getFieldWithDefault(msg, 3, "")
      };

      if (includeInstance) {
        obj.$jspbMessageInstance = msg;
      }

      return obj;
    };
  }
  /**
   * Deserializes binary data (in protobuf wire format).
   * @param {jspb.ByteSource} bytes The bytes to deserialize.
   * @return {!proto.types.ImportFormat}
   */


  proto.types.ImportFormat.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.types.ImportFormat();
    return proto.types.ImportFormat.deserializeBinaryFromReader(msg, reader);
  };
  /**
   * Deserializes binary data (in protobuf wire format) from the
   * given reader into the given message object.
   * @param {!proto.types.ImportFormat} msg The message object to deserialize into.
   * @param {!jspb.BinaryReader} reader The BinaryReader to use.
   * @return {!proto.types.ImportFormat}
   */


  proto.types.ImportFormat.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      var field = reader.getFieldNumber();

      switch (field) {
        case 1:
          var value = new proto.types.SingleBytes();
          reader.readMessage(value, proto.types.SingleBytes.deserializeBinaryFromReader);
          msg.setWif(value);
          break;

        case 2:
          var value =
          /** @type {string} */
          reader.readString();
          msg.setOldpass(value);
          break;

        case 3:
          var value =
          /** @type {string} */
          reader.readString();
          msg.setNewpass(value);
          break;

        default:
          reader.skipField();
          break;
      }
    }

    return msg;
  };
  /**
   * Serializes the message to binary data (in protobuf wire format).
   * @return {!Uint8Array}
   */


  proto.types.ImportFormat.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.types.ImportFormat.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  };
  /**
   * Serializes the given message to binary data (in protobuf wire
   * format), writing to the given BinaryWriter.
   * @param {!proto.types.ImportFormat} message
   * @param {!jspb.BinaryWriter} writer
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */


  proto.types.ImportFormat.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getWif();

    if (f != null) {
      writer.writeMessage(1, f, proto.types.SingleBytes.serializeBinaryToWriter);
    }

    f = message.getOldpass();

    if (f.length > 0) {
      writer.writeString(2, f);
    }

    f = message.getNewpass();

    if (f.length > 0) {
      writer.writeString(3, f);
    }
  };
  /**
   * optional SingleBytes wif = 1;
   * @return {?proto.types.SingleBytes}
   */


  proto.types.ImportFormat.prototype.getWif = function () {
    return (
      /** @type{?proto.types.SingleBytes} */
      jspb.Message.getWrapperField(this, proto.types.SingleBytes, 1)
    );
  };
  /** @param {?proto.types.SingleBytes|undefined} value */


  proto.types.ImportFormat.prototype.setWif = function (value) {
    jspb.Message.setWrapperField(this, 1, value);
  };

  proto.types.ImportFormat.prototype.clearWif = function () {
    this.setWif(undefined);
  };
  /**
   * Returns whether this field is set.
   * @return {!boolean}
   */


  proto.types.ImportFormat.prototype.hasWif = function () {
    return jspb.Message.getField(this, 1) != null;
  };
  /**
   * optional string oldpass = 2;
   * @return {string}
   */


  proto.types.ImportFormat.prototype.getOldpass = function () {
    return (
      /** @type {string} */
      jspb.Message.getFieldWithDefault(this, 2, "")
    );
  };
  /** @param {string} value */


  proto.types.ImportFormat.prototype.setOldpass = function (value) {
    jspb.Message.setField(this, 2, value);
  };
  /**
   * optional string newpass = 3;
   * @return {string}
   */


  proto.types.ImportFormat.prototype.getNewpass = function () {
    return (
      /** @type {string} */
      jspb.Message.getFieldWithDefault(this, 3, "")
    );
  };
  /** @param {string} value */


  proto.types.ImportFormat.prototype.setNewpass = function (value) {
    jspb.Message.setField(this, 3, value);
  };
  /**
   * @enum {number}
   */


  proto.types.CommitStatus = {
    TX_OK: 0,
    TX_NONCE_TOO_LOW: 1,
    TX_ALREADY_EXISTS: 2,
    TX_INVALID_HASH: 3,
    TX_INVALID_SIGN: 4,
    TX_INVALID_FORMAT: 5,
    TX_INSUFFICIENT_BALANCE: 6,
    TX_INTERNAL_ERROR: 7
  };
  /**
   * @enum {number}
   */

  proto.types.VerifyStatus = {
    VERIFY_STATUS_OK: 0,
    VERIFY_STATUS_SIGN_NOT_MATCH: 1,
    VERIFY_STATUS_INVALID_HASH: 2
  };
  goog.object.extend(exports, proto.types);
});

var typesWeb = /*#__PURE__*/Object.freeze({
	default: rpc_pb$1,
	__moduleExports: rpc_pb$1
});

var platformWeb = typeof process === 'undefined' || process.env.TARGET == 'web';
var rpcTypes = platformWeb ? typesWeb : typesNode;

function encodeTxHash(bytes) {
  return bs58.encode(bytes);
}
function decodeTxHash(bs58string) {
  return bs58.decode(bs58string);
}

var ADDRESS_PREFIXES = {
  ACCOUNT: 0x42,
  CONTRACT: 0xC0
};
var UNITS = {
  NATIVE_TOKEN: {
    baseLabel: 'Aergo',
    baseLabelShort: 'ARG',
    baseDigits: 9,
    subUnits: [{
      e: 0,
      label: 'aer'
    }, {
      e: 9,
      label: 'ARG'
    }]
  }
};
var constants = {
  ADDRESS_PREFIXES: ADDRESS_PREFIXES,
  UNITS: UNITS
};

/**
 * A wrapper around addresses. Internally addresses are stored and sent as raw bytes,
 * but client-side they are displayed as base58-check encoded strings.
 * The encoding requires some computation, so you should only convert address objects to strings when needed.
 */

var Address =
/*#__PURE__*/
function () {
  function Address(address) {
    _classCallCheck(this, Address);

    if (address instanceof Address) {
      // Copy buffer
      this.value = Buffer.from(address.value);
    } else if (typeof address === 'string') {
      // Decode string
      this.value = Address.decode(address);
      this.encoded = address;
    } else if (address.length >= 0) {
      // Treat array-like as buffer
      this.value = address;
    } else {
      throw new Error('Instantiate Address with raw bytes or string in base58-check encoding, not');
    }
  }

  _createClass(Address, [{
    key: "asBytes",
    value: function asBytes() {
      return this.value;
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return this.toString();
    }
  }, {
    key: "toString",
    value: function toString() {
      if (!this.encoded) {
        this.encoded = Address.encode(this.value);
      }

      return this.encoded;
    }
  }], [{
    key: "decode",
    value: function decode(bs58string) {
      return bs58check.decode(bs58string).slice(1);
    }
  }, {
    key: "encode",
    value: function encode(byteArray) {
      if (!byteArray || byteArray.length === 0) return ''; // return empty string for null address

      var buf = Buffer.from([ADDRESS_PREFIXES.ACCOUNT].concat(_toConsumableArray(byteArray)));
      return bs58check.encode(buf);
    }
  }]);

  return Address;
}();

/**
 * Basically just a named struct that can be extended
 */
var BaseModel =
/*#__PURE__*/
function () {
  function BaseModel(data) {
    _classCallCheck(this, BaseModel);

    for (var key in data) {
      this[key] = data[key];
    }
  }

  _createClass(BaseModel, [{
    key: "toGrpc",
    value: function toGrpc() {
      throw new Error('not implemented');
    }
  }], [{
    key: "fromGrpc",
    value: function fromGrpc(grpcObject) {
      return grpcObject.toObject();
    }
  }]);

  return BaseModel;
}();

var Tx =
/*#__PURE__*/
function (_BaseModel) {
  _inherits(Tx, _BaseModel);

  function Tx() {
    _classCallCheck(this, Tx);

    return _possibleConstructorReturn(this, _getPrototypeOf(Tx).apply(this, arguments));
  }

  _createClass(Tx, [{
    key: "toGrpc",
    value: function toGrpc() {
      var msgtxbody = new rpcTypes.TxBody();
      msgtxbody.setNonce(this.nonce);

      if (typeof this.from === 'undefined' || !this.from) {
        throw new Error('Missing required transaction parameter \'from\'');
      }

      msgtxbody.setAccount(new Address(this.from).asBytes());

      if (typeof this.to !== 'undefined' && this.to !== null) {
        msgtxbody.setRecipient(new Address(this.to).asBytes());
      }

      msgtxbody.setAmount(this.amount);

      if (this.payload != null) {
        msgtxbody.setPayload(Buffer.from(this.payload));
      }

      if (typeof this.sign === 'string') {
        msgtxbody.setSign(Buffer.from(this.sign, 'base64'));
      } else {
        msgtxbody.setSign(this.sign);
      }

      msgtxbody.setType(this.type);

      if (typeof this.limit !== 'undefined') {
        msgtxbody.setLimit(this.limit);
      }

      if (typeof this.price !== 'undefined') {
        msgtxbody.setPrice(this.price);
      }

      var msgtx = new rpcTypes.Tx();

      if (this.hash != null) {
        var hash = this.hash;

        if (typeof hash === 'string') {
          hash = decodeTxHash(hash);
        }

        msgtx.setHash(Buffer.from(hash));
      }

      msgtx.setBody(msgtxbody);
      return msgtx;
    }
  }], [{
    key: "fromGrpc",

    /*
    hash: bytes;
    nonce: uint64;
    from: bytes;
    to: bytes;
    amount: uint64;
    payload: bytes;
    sign: bytes;
    type: int;
    limit: uint64;
    price: uint64;
    */
    value: function fromGrpc(grpcObject) {
      return new Tx({
        hash: encodeTxHash(grpcObject.getHash()),
        nonce: grpcObject.getBody().getNonce(),
        from: new Address(grpcObject.getBody().getAccount_asU8()),
        to: new Address(grpcObject.getBody().getRecipient_asU8()),
        amount: grpcObject.getBody().getAmount(),
        payload: grpcObject.getBody().getPayload(),
        sign: grpcObject.getBody().getSign_asB64(),
        type: grpcObject.getBody().getType(),
        limit: grpcObject.getBody().getLimit(),
        price: grpcObject.getBody().getPrice()
      });
    }
  }]);

  return Tx;
}(BaseModel);

var getOwnPropertyDescriptors = function getOwnPropertyDescriptors(originalObject) {
  return Object.getOwnPropertyNames(originalObject).reduce(function (descriptors, name) {
    descriptors[name] = Object.getOwnPropertyDescriptor(originalObject, name);
    return descriptors;
  }, {});
};

var kCustomPromisifiedSymbol = Symbol('util.promisify.custom');
function promisify(original, context) {
  if (typeof context === 'undefined') {
    context = this;
  }

  if (typeof original !== 'function') {
    throw new Error('original', 'Function', original);
  }

  function fn() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return new Promise(function (resolve, reject) {
      original.call.apply(original, [context].concat(args, [function (err, value) {
        if (err) {
          return reject(err);
        }

        resolve(value);
      }]));
    });
  }

  Object.setPrototypeOf(fn, Object.getPrototypeOf(original));
  Object.defineProperty(fn, kCustomPromisifiedSymbol, {
    value: fn,
    enumerable: false,
    writable: false,
    configurable: true
  });
  return Object.defineProperties(fn, (Object.getOwnPropertyDescriptors || getOwnPropertyDescriptors)(original));
}

/**
 * Accounts controller. It is exposed at `aergoClient.accounts`.
 */

var Accounts =
/*#__PURE__*/
function () {
  function Accounts(aergo) {
    _classCallCheck(this, Accounts);

    this.client = aergo.client;
  }
  /**
   * Create a new account in the node.
   * @param {string} passphrase 
   * @returns {Promise<string>} newly created account address
   */


  _createClass(Accounts, [{
    key: "create",
    value: function create(passphrase) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var personal = new rpc_pb_2();
        personal.setPassphrase(passphrase);

        try {
          _this.client.createAccount(personal, function (err, rsp) {
            if (err) {
              reject(err);
            } else {
              var createdAddress = rsp.getAddress_asU8();
              resolve(new Address(createdAddress));
            }
          });
        } catch (exception) {
          reject(exception);
        }
      });
    }
    /**
     * Get list of accounts.
     * @returns {Promise<string[]>} list of account addresses
     */

  }, {
    key: "get",
    value: function get() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        var empty = new rpc_pb_1();

        try {
          _this2.client.getAccounts(empty, function (err, rsp) {
            if (err) {
              reject(err);
            } else {
              var accounts = rsp.getAccountsList();
              var addresses = accounts.map(function (account) {
                return new Address(account.getAddress_asU8());
              });
              resolve(addresses);
            }
          });
        } catch (exception) {
          reject(exception);
        }
      });
    }
    /**
     * Unlock account.
     * @param {string} address 
     * @param {string} passphrase 
     * @returns {Promise<string>} unlocked account address
     */

  }, {
    key: "unlock",
    value: function unlock(address, passphrase) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        var account = new rpc_pb_3();
        account.setAddress(new Address(address).asBytes());
        var personal = new rpc_pb_2();
        personal.setPassphrase(passphrase);
        personal.setAccount(account);

        try {
          _this3.client.unlockAccount(personal, function (err, rsp) {
            if (err) {
              reject(err);
            } else {
              var createdAddress = rsp.getAddress_asU8();
              resolve(new Address(createdAddress));
            }
          });
        } catch (exception) {
          reject(exception);
        }
      });
    }
    /**
     * Lock account.
     * @param {string} address 
     * @param {string} passphrase 
     * @returns {Promise<string>} locked account address
     */

  }, {
    key: "lock",
    value: function lock(address, passphrase) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        var account = new rpc_pb_3();
        account.setAddress(new Address(address).asBytes());
        var personal = new rpc_pb_2();
        personal.setPassphrase(passphrase);
        personal.setAccount(account);

        try {
          _this4.client.lockAccount(personal, function (err, rsp) {
            if (err) {
              reject(err);
            } else {
              var createdAddress = rsp.getAddress_asU8();
              resolve(new Address(createdAddress));
            }
          });
        } catch (exception) {
          reject(exception);
        }
      });
    }
    /**
     * Convenience method to send transaction from account.
     * This method automatically retrieves the nonce, signs the transaction, and sends it to the network.
     * @param {Tx} tx transaction data
     * @returns {Promise<string>} transaction hash
     */

  }, {
    key: "sendTransaction",
    value: function sendTransaction(tx) {
      if (!(tx instanceof Tx)) {
        tx = new Tx(tx);
      }

      return promisify(this.client.sendTX, this.client)(tx.toGrpc()).then(function (result) {
        return encodeTxHash(result.getHash());
      });
    }
    /**
     * Sign transaction.
     * @param {Tx} tx transaction data
     * @returns {Promise<Tx>} transaction data including signature
     */

  }, {
    key: "signTransaction",
    value: function signTransaction(tx) {
      if (!(tx instanceof Tx)) {
        tx = new Tx(tx);
      }

      return promisify(this.client.signTX, this.client)(tx.toGrpc()).then(function (signedtx) {
        return Tx.fromGrpc(signedtx);
      });
    }
  }]);

  return Accounts;
}();

var CommitStatus = rpcTypes.CommitStatus;

var fromNumber = function fromNumber(d) {
  var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;

  if (d >= Math.pow(2, length * 8)) {
    throw new Error('Number exeeds range');
  }

  var arr = new Uint8Array(length);

  for (var i = 0, j = 1; i < 8; i++, j *= 0x100) {
    arr[i] = d / j & 0xff;
  }

  return arr;
};

var toBytesUint32 = function toBytesUint32(num) {
  var arr = new ArrayBuffer(8);
  var view = new DataView(arr);
  view.setUint32(0, num, true); // byteOffset = 0; litteEndian = true
  // view.setBigUint64(0, num, true)

  return arr;
};

var errorMessageForCode = function errorMessageForCode(code) {
  var errorMessage = 'UNDEFINED_ERROR';

  if (code && code < Object.values(CommitStatus).length) {
    errorMessage = Object.keys(CommitStatus)[Object.values(CommitStatus).indexOf(code)];
  }

  return errorMessage;
};

var waitFor = function waitFor(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
};

var basicCheck = function basicCheck(result) {
  return result instanceof Error === false;
};

var longPolling =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(func) {
    var check,
        timeout,
        wait,
        started,
        lastError,
        result,
        timePassed,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            check = _args.length > 1 && _args[1] !== undefined ? _args[1] : basicCheck;
            timeout = _args.length > 2 && _args[2] !== undefined ? _args[2] : 10000;
            wait = _args.length > 3 && _args[3] !== undefined ? _args[3] : 250;
            // keep calling func until it does not throw and also satifies check(result) or until timeout is reached
            started = +new Date();
            lastError = '';
            _context.prev = 5;
            _context.next = 8;
            return func();

          case 8:
            result = _context.sent;

            if (check(result)) {
              _context.next = 11;
              break;
            }

            throw new Error('Condition not satisfied');

          case 11:
            return _context.abrupt("return", result);

          case 14:
            _context.prev = 14;
            _context.t0 = _context["catch"](5);
            lastError = _context.t0;

          case 17:
            timePassed = new Date() - started;
            timeout -= timePassed;

            if (!(timeout < 0)) {
              _context.next = 21;
              break;
            }

            throw new Error('Long polling timed out. ' + lastError);

          case 21:
            _context.next = 23;
            return waitFor(wait);

          case 23:
            _context.next = 25;
            return longPolling(func, check, timeout - wait, wait);

          case 25:
            return _context.abrupt("return", _context.sent);

          case 26:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[5, 14]]);
  }));

  return function longPolling(_x) {
    return _ref.apply(this, arguments);
  };
}();

var Block =
/*#__PURE__*/
function (_BaseModel) {
  _inherits(Block, _BaseModel);

  function Block() {
    _classCallCheck(this, Block);

    return _possibleConstructorReturn(this, _getPrototypeOf(Block).apply(this, arguments));
  }

  _createClass(Block, [{
    key: "toGrpc",
    value: function toGrpc() {
      throw new Error('Not implemented');
    }
  }], [{
    key: "fromGrpc",
    value: function fromGrpc(grpcObject) {
      var obj = grpcObject.toObject();
      obj.hash = Block.encodeHash(grpcObject.getHash_asU8());
      obj.header.prevblockhash = Block.encodeHash(grpcObject.getHeader().getPrevblockhash_asU8());

      if (obj.body) {
        obj.body.txsList = grpcObject.getBody().getTxsList().map(function (tx) {
          return Tx.fromGrpc(tx);
        });
      }

      return new Block(obj);
    }
  }, {
    key: "encodeHash",
    value: function encodeHash(bytes) {
      return bs58.encode(bytes);
    }
  }, {
    key: "decodeHash",
    value: function decodeHash(bs58string) {
      return bs58.decode(bs58string);
    }
  }]);

  return Block;
}(BaseModel);

var CommitStatus$1 = rpcTypes.CommitStatus;
/**
 * Main aergo client controller.
 */

var AergoClient =
/*#__PURE__*/
function () {
  /**
   * Create a new auto-configured client with:
   * 
   * .. code-block:: javascript
   * 
   *     import AergoClient from '@herajs/client';
   *     const aergo = new AergoClient();
   * 
   * @param [object] configuration. Unused at the moment.
   * @param [Provider] custom configured provider. By default a provider is configured automatically depending on the environment.
   */
  function AergoClient(config) {
    var provider = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    _classCallCheck(this, AergoClient);

    this.version = 0.1;
    this.config = _objectSpread({}, config);
    this.client = provider || this.defaultProvider();
    this.accounts = new Accounts(this);
  }

  _createClass(AergoClient, [{
    key: "defaultProvider",
    value: function defaultProvider() {} // Platform-specific override, see ../platforms/**
    // for auto-configuration of a provider.
    // Can also manually pass provider to constructor.

    /**
     * Set a new provider
     * @param {Provider} provider
     */

  }, {
    key: "setProvider",
    value: function setProvider(provider) {
      this.client = provider;
    }
  }, {
    key: "getConfig",
    value: function getConfig() {
      return this.config;
    }
  }, {
    key: "isConnected",
    value: function isConnected() {
      return false;
    }
    /**
     * Request current status of blockchain.
     * @returns {Promise<object>} an object detailing the current status
     */

  }, {
    key: "blockchain",
    value: function blockchain() {
      var empty = new rpcTypes.Empty();
      return promisify(this.client.blockchain, this.client)(empty).then(function (result) {
        return _objectSpread({}, result.toObject(), {
          bestBlockHash: Block.encodeHash(result.getBestBlockHash_asU8())
        });
      });
    }
    /**
     * Get transaction information in the aergo node. 
     * If transaction is in the block return result with block hash and index.
     * @param {string} txhash transaction hash
     * @returns {Promise<object>} transaction details, object of tx: <Tx> and block: { hash, idx }
     */

  }, {
    key: "getTransaction",
    value: function getTransaction(txhash) {
      var _this = this;

      var singleBytes = new rpcTypes.SingleBytes();
      singleBytes.setValue(Buffer.from(decodeTxHash(txhash)));
      return new Promise(function (resolve, reject) {
        _this.client.getBlockTX(singleBytes, function (err, result) {
          if (err) {
            _this.client.getTX(singleBytes, function (err, result) {
              if (err) {
                reject(err);
              } else {
                var res = {};
                res.tx = Tx.fromGrpc(result);
                resolve(res);
              }
            });
          } else {
            var res = {};
            res.block = {
              hash: Block.encodeHash(result.getTxidx().getBlockhash_asU8()),
              idx: result.getTxidx().getIdx()
            };
            res.tx = Tx.fromGrpc(result.getTx());
            resolve(res);
          }
        });
      });
    }
    /**
     * Retrieve information about a block.
     * 
     * @param {string|number} hashOrNumber either 32-byte block hash encoded as a bs58 string or block height as a number.
     * @returns {Promise<Block>} block details
     */

  }, {
    key: "getBlock",
    value: function getBlock(hashOrNumber) {
      if (typeof hashOrNumber === 'undefined') {
        throw new Error('Missing argument block hash or number');
      }

      if (typeof hashOrNumber === 'string') {
        hashOrNumber = Block.decodeHash(hashOrNumber);
      } else if (typeof hashOrNumber === 'number') {
        hashOrNumber = fromNumber(hashOrNumber);
      }

      if (hashOrNumber.length != 32 && hashOrNumber.length != 8) {
        throw new Error('Invalid block hash. Must be 32 byte encoded in bs58. Did you mean to pass a block number?');
      }

      var singleBytes = new rpcTypes.SingleBytes();
      singleBytes.setValue(Buffer.from(hashOrNumber));
      return promisify(this.client.getBlock, this.client)(singleBytes).then(function (result) {
        return Block.fromGrpc(result);
      });
    }
    /**
     * Retrieve the last n blocks, beginning from given block .
     * 
     * @param {string|number} hashOrNumber either 32-byte block hash encoded as a bs58 string or block height as a number.
     * @param {number} size number of blocks to return
     * @returns {Promise<Block[]>} list of block headers (blocks without body)
     */

  }, {
    key: "getBlockHeaders",
    value: function getBlockHeaders(hashOrNumber) {
      var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
      var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var desc = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
      var params = new rpcTypes.ListParams();

      if (typeof hashOrNumber === 'string') {
        hashOrNumber = Block.decodeHash(hashOrNumber);

        if (hashOrNumber.length != 32) {
          throw new Error('Invalid block hash. Must be 32 byte encoded in bs58. Did you mean to pass a block number?');
        }

        params.setHash(Buffer.from(hashOrNumber));
      } else if (typeof hashOrNumber === 'number') {
        params.setHeight(hashOrNumber);
      } else {
        throw new Error('Block hash or number required.');
      }

      params.setSize(size);
      params.setOffset(offset);
      params.setAsc(!desc);
      return promisify(this.client.listBlockHeaders, this.client)(params).then(function (result) {
        return result.getBlocksList().map(function (item) {
          return Block.fromGrpc(item);
        });
      });
    }
  }, {
    key: "getBlockStream",
    value: function getBlockStream() {
      var empty = new rpcTypes.Empty();
      var stream = this.client.listBlockStream(empty);

      try {
        stream.on('error', function (error) {
          if (error.code === 1) {
            // grpc.status.CANCELLED
            return;
          }
        });
      } catch (e) {// ignore. 'error' does not work on grpc-web implementation
      }

      return {
        _stream: stream,
        on: function on(ev, callback) {
          return stream.on(ev, function (data) {
            return callback(Block.fromGrpc(data));
          });
        },
        cancel: function cancel() {
          return stream.cancel();
        }
      };
    }
    /**
     * Retrieve account state, including current balance and nonce.
     * @param {string} address Account address encoded in Base58check
     * @returns {Promise<object>} account state
     */

  }, {
    key: "getState",
    value: function getState(address) {
      var singleBytes = new rpcTypes.SingleBytes();
      singleBytes.setValue(Buffer.from(new Address(address).asBytes()));
      return promisify(this.client.getState, this.client)(singleBytes).then(function (state) {
        return state.toObject();
      });
    }
  }, {
    key: "getNonce",
    value: function getNonce(address) {
      var singleBytes = new rpcTypes.SingleBytes();
      singleBytes.setValue(Buffer.from(new Address(address).asBytes()));
      return promisify(this.client.getState, this.client)(singleBytes).then(function (state) {
        return state.getNonce();
      });
    }
  }, {
    key: "verifyTransaction",
    value: function verifyTransaction()
    /*tx*/
    {
      // Untested
      return promisify(this.client.verifyTX, this.client)()(function (grpcObject) {
        return Tx.fromGrpc(grpcObject);
      });
    }
    /**
     * Send a signed transaction to the network.
     * @param {Tx} tx signed transaction
     * @returns {Promise<string>} transaction hash
     */

  }, {
    key: "sendSignedTransaction",
    value: function sendSignedTransaction(tx) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        var txs = new rpcTypes.TxList();

        if (!(tx instanceof Tx)) {
          tx = new Tx(tx);
        }

        txs.addTxs(tx.toGrpc(), 0);

        _this2.client.commitTX(txs, function (err, result) {
          if (err == null && result.getResultsList()[0].getError()) {
            err = new Error();
            err.code = result.getResultsList()[0].getError();
            err.message = errorMessageForCode(err.code);
          }

          if (err) {
            reject(err);
          } else {
            resolve(encodeTxHash(result.getResultsList()[0].getHash()));
          }
        });
      });
    }
  }, {
    key: "getVoteResult",
    value: function getVoteResult(count) {
      var singleBytes = new rpcTypes.SingleBytes();
      singleBytes.setValue(new Uint8Array(toBytesUint32(count)));
      return promisify(this.client.getVotes, this.client)(singleBytes).then(function (state) {
        return state.getVotesList();
      });
    }
    /**
     * Retrieve the transaction receipt for a transaction
     * @param {string} txhash transaction hash
     * @return {Promise<object>} transaction receipt
     */

  }, {
    key: "getTransactionReceipt",
    value: function getTransactionReceipt(txhash) {
      var singleBytes = new rpcTypes.SingleBytes();
      singleBytes.setValue(Buffer.from(decodeTxHash(txhash)));
      return promisify(this.client.getReceipt, this.client)(singleBytes).then(function (grpcObject) {
        var obj = grpcObject.toObject();
        return {
          contractaddress: new Address(grpcObject.getContractaddress_asU8()),
          result: obj.ret,
          //JSON.parse(obj.ret),
          status: obj.status
        };
      });
    }
    /**
     * Query contract state
     * @param {FunctionCall} functionCall call details
     * @returns {Promise<object>} result of query
     */

  }, {
    key: "queryContract",
    value: function queryContract(functionCall) {
      var query = new rpcTypes.Query();
      query.setContractaddress(Buffer.from(new Address(functionCall.contractInstance.address).asBytes()));
      query.setQueryinfo(Buffer.from(JSON.stringify(functionCall.asQueryInfo())));
      return promisify(this.client.queryContract, this.client)(query).then(function (grpcObject) {
        return JSON.parse(Buffer.from(grpcObject.getValue()).toString());
      });
    }
    /**
     * Query contract ABI
     * @param {string} address of contract
     * @returns {Promise<object>} abi
     */

  }, {
    key: "getABI",
    value: function getABI(address) {
      var singleBytes = new rpcTypes.SingleBytes();
      singleBytes.setValue(Buffer.from(new Address(address).asBytes()));
      return promisify(this.client.getABI, this.client)(singleBytes).then(function (grpcObject) {
        var obj = grpcObject.toObject();
        return {
          language: obj.language,
          version: obj.version,
          functions: obj.functionsList.map(function (item) {
            return {
              name: item.name,
              arguments: item.argumentsList
            };
          })
        };
      });
    }
    /**
     * Get list of peers of connected node
     */

  }, {
    key: "getPeers",
    value: function getPeers() {
      var empty = new rpcTypes.Empty();
      return promisify(this.client.getPeers, this.client)(empty).then(function (grpcObject) {
        return grpcObject.toObject();
      });
    }
  }]);

  return AergoClient;
}();

var Provider = function Provider(config) {
  _classCallCheck(this, Provider);

  this.config = _objectSpread({}, this.defaultConfig, config); // Proxy that passes method calls to the provider's client object

  return new Proxy(this, {
    get: function get(obj, field) {
      if (field in obj) return obj[field];
      return obj.client[field];
    }
  });
};

var rpc_grpc_pb = createCommonjsModule(function (module, exports) {

  function serialize_types_ABI(arg) {
    if (!(arg instanceof blockchain_pb.ABI)) {
      throw new Error('Expected argument of type types.ABI');
    }

    return new Buffer(arg.serializeBinary());
  }

  function deserialize_types_ABI(buffer_arg) {
    return blockchain_pb.ABI.deserializeBinary(new Uint8Array(buffer_arg));
  }

  function serialize_types_Account(arg) {
    if (!(arg instanceof account_pb.Account)) {
      throw new Error('Expected argument of type types.Account');
    }

    return new Buffer(arg.serializeBinary());
  }

  function deserialize_types_Account(buffer_arg) {
    return account_pb.Account.deserializeBinary(new Uint8Array(buffer_arg));
  }

  function serialize_types_AccountAndRoot(arg) {
    if (!(arg instanceof rpc_pb.AccountAndRoot)) {
      throw new Error('Expected argument of type types.AccountAndRoot');
    }

    return new Buffer(arg.serializeBinary());
  }

  function deserialize_types_AccountAndRoot(buffer_arg) {
    return rpc_pb.AccountAndRoot.deserializeBinary(new Uint8Array(buffer_arg));
  }

  function serialize_types_AccountList(arg) {
    if (!(arg instanceof account_pb.AccountList)) {
      throw new Error('Expected argument of type types.AccountList');
    }

    return new Buffer(arg.serializeBinary());
  }

  function deserialize_types_AccountList(buffer_arg) {
    return account_pb.AccountList.deserializeBinary(new Uint8Array(buffer_arg));
  }

  function serialize_types_Block(arg) {
    if (!(arg instanceof blockchain_pb.Block)) {
      throw new Error('Expected argument of type types.Block');
    }

    return new Buffer(arg.serializeBinary());
  }

  function deserialize_types_Block(buffer_arg) {
    return blockchain_pb.Block.deserializeBinary(new Uint8Array(buffer_arg));
  }

  function serialize_types_BlockHeaderList(arg) {
    if (!(arg instanceof rpc_pb.BlockHeaderList)) {
      throw new Error('Expected argument of type types.BlockHeaderList');
    }

    return new Buffer(arg.serializeBinary());
  }

  function deserialize_types_BlockHeaderList(buffer_arg) {
    return rpc_pb.BlockHeaderList.deserializeBinary(new Uint8Array(buffer_arg));
  }

  function serialize_types_BlockchainStatus(arg) {
    if (!(arg instanceof rpc_pb.BlockchainStatus)) {
      throw new Error('Expected argument of type types.BlockchainStatus');
    }

    return new Buffer(arg.serializeBinary());
  }

  function deserialize_types_BlockchainStatus(buffer_arg) {
    return rpc_pb.BlockchainStatus.deserializeBinary(new Uint8Array(buffer_arg));
  }

  function serialize_types_CommitResult(arg) {
    if (!(arg instanceof rpc_pb.CommitResult)) {
      throw new Error('Expected argument of type types.CommitResult');
    }

    return new Buffer(arg.serializeBinary());
  }

  function deserialize_types_CommitResult(buffer_arg) {
    return rpc_pb.CommitResult.deserializeBinary(new Uint8Array(buffer_arg));
  }

  function serialize_types_CommitResultList(arg) {
    if (!(arg instanceof rpc_pb.CommitResultList)) {
      throw new Error('Expected argument of type types.CommitResultList');
    }

    return new Buffer(arg.serializeBinary());
  }

  function deserialize_types_CommitResultList(buffer_arg) {
    return rpc_pb.CommitResultList.deserializeBinary(new Uint8Array(buffer_arg));
  }

  function serialize_types_Empty(arg) {
    if (!(arg instanceof rpc_pb.Empty)) {
      throw new Error('Expected argument of type types.Empty');
    }

    return new Buffer(arg.serializeBinary());
  }

  function deserialize_types_Empty(buffer_arg) {
    return rpc_pb.Empty.deserializeBinary(new Uint8Array(buffer_arg));
  }

  function serialize_types_ImportFormat(arg) {
    if (!(arg instanceof rpc_pb.ImportFormat)) {
      throw new Error('Expected argument of type types.ImportFormat');
    }

    return new Buffer(arg.serializeBinary());
  }

  function deserialize_types_ImportFormat(buffer_arg) {
    return rpc_pb.ImportFormat.deserializeBinary(new Uint8Array(buffer_arg));
  }

  function serialize_types_ListParams(arg) {
    if (!(arg instanceof rpc_pb.ListParams)) {
      throw new Error('Expected argument of type types.ListParams');
    }

    return new Buffer(arg.serializeBinary());
  }

  function deserialize_types_ListParams(buffer_arg) {
    return rpc_pb.ListParams.deserializeBinary(new Uint8Array(buffer_arg));
  }

  function serialize_types_PeerList(arg) {
    if (!(arg instanceof rpc_pb.PeerList)) {
      throw new Error('Expected argument of type types.PeerList');
    }

    return new Buffer(arg.serializeBinary());
  }

  function deserialize_types_PeerList(buffer_arg) {
    return rpc_pb.PeerList.deserializeBinary(new Uint8Array(buffer_arg));
  }

  function serialize_types_Personal(arg) {
    if (!(arg instanceof rpc_pb.Personal)) {
      throw new Error('Expected argument of type types.Personal');
    }

    return new Buffer(arg.serializeBinary());
  }

  function deserialize_types_Personal(buffer_arg) {
    return rpc_pb.Personal.deserializeBinary(new Uint8Array(buffer_arg));
  }

  function serialize_types_Query(arg) {
    if (!(arg instanceof blockchain_pb.Query)) {
      throw new Error('Expected argument of type types.Query');
    }

    return new Buffer(arg.serializeBinary());
  }

  function deserialize_types_Query(buffer_arg) {
    return blockchain_pb.Query.deserializeBinary(new Uint8Array(buffer_arg));
  }

  function serialize_types_Receipt(arg) {
    if (!(arg instanceof blockchain_pb.Receipt)) {
      throw new Error('Expected argument of type types.Receipt');
    }

    return new Buffer(arg.serializeBinary());
  }

  function deserialize_types_Receipt(buffer_arg) {
    return blockchain_pb.Receipt.deserializeBinary(new Uint8Array(buffer_arg));
  }

  function serialize_types_SingleBytes(arg) {
    if (!(arg instanceof rpc_pb.SingleBytes)) {
      throw new Error('Expected argument of type types.SingleBytes');
    }

    return new Buffer(arg.serializeBinary());
  }

  function deserialize_types_SingleBytes(buffer_arg) {
    return rpc_pb.SingleBytes.deserializeBinary(new Uint8Array(buffer_arg));
  }

  function serialize_types_State(arg) {
    if (!(arg instanceof blockchain_pb.State)) {
      throw new Error('Expected argument of type types.State');
    }

    return new Buffer(arg.serializeBinary());
  }

  function deserialize_types_State(buffer_arg) {
    return blockchain_pb.State.deserializeBinary(new Uint8Array(buffer_arg));
  }

  function serialize_types_StateProof(arg) {
    if (!(arg instanceof blockchain_pb.StateProof)) {
      throw new Error('Expected argument of type types.StateProof');
    }

    return new Buffer(arg.serializeBinary());
  }

  function deserialize_types_StateProof(buffer_arg) {
    return blockchain_pb.StateProof.deserializeBinary(new Uint8Array(buffer_arg));
  }

  function serialize_types_Tx(arg) {
    if (!(arg instanceof blockchain_pb.Tx)) {
      throw new Error('Expected argument of type types.Tx');
    }

    return new Buffer(arg.serializeBinary());
  }

  function deserialize_types_Tx(buffer_arg) {
    return blockchain_pb.Tx.deserializeBinary(new Uint8Array(buffer_arg));
  }

  function serialize_types_TxInBlock(arg) {
    if (!(arg instanceof blockchain_pb.TxInBlock)) {
      throw new Error('Expected argument of type types.TxInBlock');
    }

    return new Buffer(arg.serializeBinary());
  }

  function deserialize_types_TxInBlock(buffer_arg) {
    return blockchain_pb.TxInBlock.deserializeBinary(new Uint8Array(buffer_arg));
  }

  function serialize_types_TxList(arg) {
    if (!(arg instanceof blockchain_pb.TxList)) {
      throw new Error('Expected argument of type types.TxList');
    }

    return new Buffer(arg.serializeBinary());
  }

  function deserialize_types_TxList(buffer_arg) {
    return blockchain_pb.TxList.deserializeBinary(new Uint8Array(buffer_arg));
  }

  function serialize_types_VerifyResult(arg) {
    if (!(arg instanceof rpc_pb.VerifyResult)) {
      throw new Error('Expected argument of type types.VerifyResult');
    }

    return new Buffer(arg.serializeBinary());
  }

  function deserialize_types_VerifyResult(buffer_arg) {
    return rpc_pb.VerifyResult.deserializeBinary(new Uint8Array(buffer_arg));
  }

  function serialize_types_VoteList(arg) {
    if (!(arg instanceof blockchain_pb.VoteList)) {
      throw new Error('Expected argument of type types.VoteList');
    }

    return new Buffer(arg.serializeBinary());
  }

  function deserialize_types_VoteList(buffer_arg) {
    return blockchain_pb.VoteList.deserializeBinary(new Uint8Array(buffer_arg));
  } // BlockService serves APIs that aergosvr provides.
  // Some methods optionally contains context path if it is also provided by REST API.


  var AergoRPCServiceService = exports.AergoRPCServiceService = {
    nodeState: {
      path: '/types.AergoRPCService/NodeState',
      requestStream: false,
      responseStream: false,
      requestType: rpc_pb.SingleBytes,
      responseType: rpc_pb.SingleBytes,
      requestSerialize: serialize_types_SingleBytes,
      requestDeserialize: deserialize_types_SingleBytes,
      responseSerialize: serialize_types_SingleBytes,
      responseDeserialize: deserialize_types_SingleBytes
    },
    blockchain: {
      path: '/types.AergoRPCService/Blockchain',
      requestStream: false,
      responseStream: false,
      requestType: rpc_pb.Empty,
      responseType: rpc_pb.BlockchainStatus,
      requestSerialize: serialize_types_Empty,
      requestDeserialize: deserialize_types_Empty,
      responseSerialize: serialize_types_BlockchainStatus,
      responseDeserialize: deserialize_types_BlockchainStatus
    },
    // option (google.api.http) = {
    //   get: "/blockchain"
    // };
    listBlockHeaders: {
      path: '/types.AergoRPCService/ListBlockHeaders',
      requestStream: false,
      responseStream: false,
      requestType: rpc_pb.ListParams,
      responseType: rpc_pb.BlockHeaderList,
      requestSerialize: serialize_types_ListParams,
      requestDeserialize: deserialize_types_ListParams,
      responseSerialize: serialize_types_BlockHeaderList,
      responseDeserialize: deserialize_types_BlockHeaderList
    },
    listBlockStream: {
      path: '/types.AergoRPCService/ListBlockStream',
      requestStream: false,
      responseStream: true,
      requestType: rpc_pb.Empty,
      responseType: blockchain_pb.Block,
      requestSerialize: serialize_types_Empty,
      requestDeserialize: deserialize_types_Empty,
      responseSerialize: serialize_types_Block,
      responseDeserialize: deserialize_types_Block
    },
    getBlock: {
      path: '/types.AergoRPCService/GetBlock',
      requestStream: false,
      responseStream: false,
      requestType: rpc_pb.SingleBytes,
      responseType: blockchain_pb.Block,
      requestSerialize: serialize_types_SingleBytes,
      requestDeserialize: deserialize_types_SingleBytes,
      responseSerialize: serialize_types_Block,
      responseDeserialize: deserialize_types_Block
    },
    // option (google.api.http) = {
    //   get: "/blocks/{blockHash}"
    // };    
    getTX: {
      path: '/types.AergoRPCService/GetTX',
      requestStream: false,
      responseStream: false,
      requestType: rpc_pb.SingleBytes,
      responseType: blockchain_pb.Tx,
      requestSerialize: serialize_types_SingleBytes,
      requestDeserialize: deserialize_types_SingleBytes,
      responseSerialize: serialize_types_Tx,
      responseDeserialize: deserialize_types_Tx
    },
    // option (google.api.http) = {
    //   get: "/transactions/{value}"
    // };    
    getBlockTX: {
      path: '/types.AergoRPCService/GetBlockTX',
      requestStream: false,
      responseStream: false,
      requestType: rpc_pb.SingleBytes,
      responseType: blockchain_pb.TxInBlock,
      requestSerialize: serialize_types_SingleBytes,
      requestDeserialize: deserialize_types_SingleBytes,
      responseSerialize: serialize_types_TxInBlock,
      responseDeserialize: deserialize_types_TxInBlock
    },
    getReceipt: {
      path: '/types.AergoRPCService/GetReceipt',
      requestStream: false,
      responseStream: false,
      requestType: rpc_pb.SingleBytes,
      responseType: blockchain_pb.Receipt,
      requestSerialize: serialize_types_SingleBytes,
      requestDeserialize: deserialize_types_SingleBytes,
      responseSerialize: serialize_types_Receipt,
      responseDeserialize: deserialize_types_Receipt
    },
    getABI: {
      path: '/types.AergoRPCService/GetABI',
      requestStream: false,
      responseStream: false,
      requestType: rpc_pb.SingleBytes,
      responseType: blockchain_pb.ABI,
      requestSerialize: serialize_types_SingleBytes,
      requestDeserialize: deserialize_types_SingleBytes,
      responseSerialize: serialize_types_ABI,
      responseDeserialize: deserialize_types_ABI
    },
    sendTX: {
      path: '/types.AergoRPCService/SendTX',
      requestStream: false,
      responseStream: false,
      requestType: blockchain_pb.Tx,
      responseType: rpc_pb.CommitResult,
      requestSerialize: serialize_types_Tx,
      requestDeserialize: deserialize_types_Tx,
      responseSerialize: serialize_types_CommitResult,
      responseDeserialize: deserialize_types_CommitResult
    },
    commitTX: {
      path: '/types.AergoRPCService/CommitTX',
      requestStream: false,
      responseStream: false,
      requestType: blockchain_pb.TxList,
      responseType: rpc_pb.CommitResultList,
      requestSerialize: serialize_types_TxList,
      requestDeserialize: deserialize_types_TxList,
      responseSerialize: serialize_types_CommitResultList,
      responseDeserialize: deserialize_types_CommitResultList
    },
    // option (google.api.http) = {
    //   post: "/transactions"
    //   body: "transaction"
    // };    
    getState: {
      path: '/types.AergoRPCService/GetState',
      requestStream: false,
      responseStream: false,
      requestType: rpc_pb.SingleBytes,
      responseType: blockchain_pb.State,
      requestSerialize: serialize_types_SingleBytes,
      requestDeserialize: deserialize_types_SingleBytes,
      responseSerialize: serialize_types_State,
      responseDeserialize: deserialize_types_State
    },
    getStateAndProof: {
      path: '/types.AergoRPCService/GetStateAndProof',
      requestStream: false,
      responseStream: false,
      requestType: rpc_pb.AccountAndRoot,
      responseType: blockchain_pb.StateProof,
      requestSerialize: serialize_types_AccountAndRoot,
      requestDeserialize: deserialize_types_AccountAndRoot,
      responseSerialize: serialize_types_StateProof,
      responseDeserialize: deserialize_types_StateProof
    },
    createAccount: {
      path: '/types.AergoRPCService/CreateAccount',
      requestStream: false,
      responseStream: false,
      requestType: rpc_pb.Personal,
      responseType: account_pb.Account,
      requestSerialize: serialize_types_Personal,
      requestDeserialize: deserialize_types_Personal,
      responseSerialize: serialize_types_Account,
      responseDeserialize: deserialize_types_Account
    },
    getAccounts: {
      path: '/types.AergoRPCService/GetAccounts',
      requestStream: false,
      responseStream: false,
      requestType: rpc_pb.Empty,
      responseType: account_pb.AccountList,
      requestSerialize: serialize_types_Empty,
      requestDeserialize: deserialize_types_Empty,
      responseSerialize: serialize_types_AccountList,
      responseDeserialize: deserialize_types_AccountList
    },
    lockAccount: {
      path: '/types.AergoRPCService/LockAccount',
      requestStream: false,
      responseStream: false,
      requestType: rpc_pb.Personal,
      responseType: account_pb.Account,
      requestSerialize: serialize_types_Personal,
      requestDeserialize: deserialize_types_Personal,
      responseSerialize: serialize_types_Account,
      responseDeserialize: deserialize_types_Account
    },
    unlockAccount: {
      path: '/types.AergoRPCService/UnlockAccount',
      requestStream: false,
      responseStream: false,
      requestType: rpc_pb.Personal,
      responseType: account_pb.Account,
      requestSerialize: serialize_types_Personal,
      requestDeserialize: deserialize_types_Personal,
      responseSerialize: serialize_types_Account,
      responseDeserialize: deserialize_types_Account
    },
    importAccount: {
      path: '/types.AergoRPCService/ImportAccount',
      requestStream: false,
      responseStream: false,
      requestType: rpc_pb.ImportFormat,
      responseType: account_pb.Account,
      requestSerialize: serialize_types_ImportFormat,
      requestDeserialize: deserialize_types_ImportFormat,
      responseSerialize: serialize_types_Account,
      responseDeserialize: deserialize_types_Account
    },
    exportAccount: {
      path: '/types.AergoRPCService/ExportAccount',
      requestStream: false,
      responseStream: false,
      requestType: rpc_pb.Personal,
      responseType: rpc_pb.SingleBytes,
      requestSerialize: serialize_types_Personal,
      requestDeserialize: deserialize_types_Personal,
      responseSerialize: serialize_types_SingleBytes,
      responseDeserialize: deserialize_types_SingleBytes
    },
    signTX: {
      path: '/types.AergoRPCService/SignTX',
      requestStream: false,
      responseStream: false,
      requestType: blockchain_pb.Tx,
      responseType: blockchain_pb.Tx,
      requestSerialize: serialize_types_Tx,
      requestDeserialize: deserialize_types_Tx,
      responseSerialize: serialize_types_Tx,
      responseDeserialize: deserialize_types_Tx
    },
    verifyTX: {
      path: '/types.AergoRPCService/VerifyTX',
      requestStream: false,
      responseStream: false,
      requestType: blockchain_pb.Tx,
      responseType: rpc_pb.VerifyResult,
      requestSerialize: serialize_types_Tx,
      requestDeserialize: deserialize_types_Tx,
      responseSerialize: serialize_types_VerifyResult,
      responseDeserialize: deserialize_types_VerifyResult
    },
    queryContract: {
      path: '/types.AergoRPCService/QueryContract',
      requestStream: false,
      responseStream: false,
      requestType: blockchain_pb.Query,
      responseType: rpc_pb.SingleBytes,
      requestSerialize: serialize_types_Query,
      requestDeserialize: deserialize_types_Query,
      responseSerialize: serialize_types_SingleBytes,
      responseDeserialize: deserialize_types_SingleBytes
    },
    getPeers: {
      path: '/types.AergoRPCService/GetPeers',
      requestStream: false,
      responseStream: false,
      requestType: rpc_pb.Empty,
      responseType: rpc_pb.PeerList,
      requestSerialize: serialize_types_Empty,
      requestDeserialize: deserialize_types_Empty,
      responseSerialize: serialize_types_PeerList,
      responseDeserialize: deserialize_types_PeerList
    },
    getVotes: {
      path: '/types.AergoRPCService/GetVotes',
      requestStream: false,
      responseStream: false,
      requestType: rpc_pb.SingleBytes,
      responseType: blockchain_pb.VoteList,
      requestSerialize: serialize_types_SingleBytes,
      requestDeserialize: deserialize_types_SingleBytes,
      responseSerialize: serialize_types_VoteList,
      responseDeserialize: deserialize_types_VoteList
    }
  };
  exports.AergoRPCServiceClient = grpc.makeGenericClientConstructor(AergoRPCServiceService);
});
var rpc_grpc_pb_1 = rpc_grpc_pb.AergoRPCServiceService;
var rpc_grpc_pb_2 = rpc_grpc_pb.AergoRPCServiceClient;

/**
 * Provider for standard GRPC connections over HTTP2.
 * This is only compatible with Node.js environments.
 */

var GrpcProvider =
/*#__PURE__*/
function (_Provider) {
  _inherits(GrpcProvider, _Provider);

  /**
   * .. code-block:: javascript
   * 
   *     import { GrpcProvider } from '@herajs/client';
   *     const provider = new GrpcProvider({url: 'localhost:7845'});
   * 
   * @param {object} config
   * @param {string} config.url URL to connect to (excluding protocol)
   */
  function GrpcProvider(config) {
    var _this;

    _classCallCheck(this, GrpcProvider);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(GrpcProvider).call(this, config));
    _this.client = new rpc_grpc_pb_2(_this.config.url, grpc.credentials.createInsecure());
    return _this;
  }

  _createClass(GrpcProvider, [{
    key: "defaultConfig",
    get: function get() {
      return {
        url: 'localhost:7845'
      };
    }
  }]);

  return GrpcProvider;
}(Provider);

/**
 * Data structure for contract function calls.
 * You should not need to build these yourself, they are returned from contract instance functions and
 * can be passed to the client.
 */

var FunctionCall =
/*#__PURE__*/
function () {
  function FunctionCall(contractInstance, definition, args) {
    _classCallCheck(this, FunctionCall);

    this.definition = definition;
    this.args = args;
    this.contractInstance = contractInstance;
  }
  /**
   * Generate transaction object that can be passed to :meth:`aergoClient.accounts.sendTrasaction`
   * 
   * .. code-block:: javascript
   * 
   *     import { Contract } from '@herajs/client';
   *     const contract = Contract.fromAbi(abi).atAddress(address);
   *     const functionCall = contract.someAbiFunction();
   *     aergo.accounts.sendTransaction(functionCall.asTransaction({
   *         from: myAddress
   *     })).then(result => {
   *         console.log(result);
   *     })
   * @param {obj} extraArgs
   * @param {string} extraArgs.from set from address for the transaction
   * @return {obj} transaction data
   */


  _createClass(FunctionCall, [{
    key: "asTransaction",
    value: function asTransaction(extraArgs) {
      var payload = JSON.stringify({
        Name: this.definition.name,
        Args: this.args
      });
      if (!this.contractInstance.address) throw new Error('Set address of contract before creating transactions');

      if (typeof extraArgs === 'undefined' || !extraArgs.from || extraArgs.from.length === 0) {
        throw new Error('Missing required transaction parameter \'from\'. Call with asTransaction({from: ...})');
      }

      return _objectSpread({
        to: this.contractInstance.address,
        amount: 0,
        payload: payload
      }, extraArgs);
    }
    /**
     * Generate query info that can be passed to the API.
     * You usually do not need to call this function yourself, :meth:`AergoClient.queryContract` takes care of that.
     * 
     * .. code-block:: javascript
     * 
     *     import { Contract } from '@herajs/client';
     *     const contract = Contract.fromAbi(abi).atAddress(address);
     *     const functionCall = contract.someAbiFunction();
     *     aergo.queryContract(functionCall).then(result => {
     *         console.log(result);
     *     })
     * 
     * @return {obj} queryInfo data
     */

  }, {
    key: "asQueryInfo",
    value: function asQueryInfo() {
      return {
        Name: this.definition.name,
        Args: this.args
      };
    }
  }]);

  return FunctionCall;
}();
/**
 * Smart contract interface.
 * You usually instantiante this class by using one of the static methods.
 * Most of the instance methods return the contract so they can be chained.
 * When an ABI is loaded, its functions will be added to the instance and can be called directly.
 * ABI functions return `FunctionCall` objects that can be queried or called.
 * 
 * .. code-block:: javascript
 * 
 *     import { Contract } from '@herajs/client';
 *     const contract = Contract.fromAbi(abi).atAddress(address);
 *     aergo.queryContract(contract.someAbiFunction()).then(result => {
 *         console.log(result);
 *     })
 * 
 */


var Contract =
/*#__PURE__*/
function (_BaseModel) {
  _inherits(Contract, _BaseModel);

  /**
   * @param {obj} [data]
   */
  function Contract(data) {
    var _this;

    _classCallCheck(this, Contract);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Contract).call(this, data));
    _this.functions = {}; // This class acts as a proxy that passes ABI method calls

    return _possibleConstructorReturn(_this, new Proxy(_assertThisInitialized(_assertThisInitialized(_this)), {
      get: function get(obj, field) {
        if (field in obj) return obj[field];
        if (field in obj.functions) return obj.functions[field];
        return undefined;
      }
    }));
  }
  /**
   * Create contract instance from code
   * @param {string} bs58checkCode base58-check encoded code
   * @return {Contract} contract instance
   */


  _createClass(Contract, [{
    key: "setAddress",

    /**
     * Set address of contract instance
     * @param {string} address 
     * @return {Contract} contract instance
     */
    value: function setAddress(address) {
      this.address = address;
      return this;
    }
    /**
     * Load contract ABI
     * @param {obj} abi parsed JSON ABI
     * @return {Contract} contract instance
     */

  }, {
    key: "loadAbi",
    value: function loadAbi(abi) {
      var _this2 = this;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        var _loop = function _loop() {
          var definition = _step.value;

          _this2.functions[definition.name] = function () {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            return new FunctionCall(_this2, definition, args);
          };
        };

        for (var _iterator = abi.functions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          _loop();
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

      return this;
    }
    /**
     * Return contract code as payload for transaction
     * @return {Buffer} a byte buffer
     */

  }, {
    key: "asPayload",
    value: function asPayload() {
      if (!this.code || !this.code.length) {
        throw new Error('Code is required to generate payload');
      } // First 4 bytes are the length


      return Buffer.concat([Buffer.from(fromNumber(4 + this.code.length, 4)), this.code]);
    }
  }], [{
    key: "fromCode",
    value: function fromCode(bs58checkCode) {
      var decoded = Contract.decodeCode(bs58checkCode);
      return new Contract({
        code: decoded
      });
    }
    /**
     * Create contract instance and set address
     * @param {string} address 
     * @return {Contract} contract instance 
     */

  }, {
    key: "atAddress",
    value: function atAddress(address) {
      var contract = new Contract();
      contract.setAddress(address);
      return contract;
    }
    /**
     * Create contract instance from ABI
     * @param {obj} abi parsed JSON ABI
     * @return {Contract} contract instance
     */

  }, {
    key: "fromAbi",
    value: function fromAbi(abi) {
      var contract = new Contract();
      contract.loadAbi(abi);
      return contract;
    }
  }, {
    key: "encodeCode",
    value: function encodeCode(byteArray) {
      var buf = Buffer.from([ADDRESS_PREFIXES.CONTRACT].concat(_toConsumableArray(byteArray)));
      return bs58check.encode(buf);
    }
  }, {
    key: "decodeCode",
    value: function decodeCode(bs58checkCode) {
      return bs58check.decode(bs58checkCode).slice(1); //return bs58.decode(bs58checkCode);
    }
  }]);

  return Contract;
}(BaseModel);

AergoClient.prototype.target = 'node';

AergoClient.prototype.defaultProvider = function () {
  return new GrpcProvider();
};

export default AergoClient;
export { AergoClient, GrpcProvider, constants, Contract };
