// source: metric.proto
/**
 * @fileoverview
 * @enhanceable
 * @suppress {missingRequire} reports error on implicit type usages.
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!
/* eslint-disable */
// @ts-nocheck

var jspb = require("google-protobuf");
var goog = jspb;
var proto = {};

goog.exportSymbol("types.MetricType", null, proto);
goog.exportSymbol("types.Metrics", null, proto);
goog.exportSymbol("types.MetricsRequest", null, proto);
goog.exportSymbol("types.PeerMetric", null, proto);
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
proto.types.MetricsRequest = function (opt_data) {
  jspb.Message.initialize(
    this,
    opt_data,
    0,
    -1,
    proto.types.MetricsRequest.repeatedFields_,
    null
  );
};
goog.inherits(proto.types.MetricsRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.types.MetricsRequest.displayName = "proto.types.MetricsRequest";
}
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
proto.types.Metrics = function (opt_data) {
  jspb.Message.initialize(
    this,
    opt_data,
    0,
    -1,
    proto.types.Metrics.repeatedFields_,
    null
  );
};
goog.inherits(proto.types.Metrics, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.types.Metrics.displayName = "proto.types.Metrics";
}
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
proto.types.PeerMetric = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.types.PeerMetric, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.types.PeerMetric.displayName = "proto.types.PeerMetric";
}

/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.types.MetricsRequest.repeatedFields_ = [1];

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.types.MetricsRequest.prototype.toObject = function (
    opt_includeInstance
  ) {
    return proto.types.MetricsRequest.toObject(opt_includeInstance, this);
  };

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.types.MetricsRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.types.MetricsRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        typesList:
          (f = jspb.Message.getRepeatedField(msg, 1)) == null ? undefined : f,
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
 * @return {!proto.types.MetricsRequest}
 */
proto.types.MetricsRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.types.MetricsRequest();
  return proto.types.MetricsRequest.deserializeBinaryFromReader(msg, reader);
};

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.types.MetricsRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.types.MetricsRequest}
 */
proto.types.MetricsRequest.deserializeBinaryFromReader = function (
  msg,
  reader
) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
      case 1:
        var values = /** @type {!Array<!proto.types.MetricType>} */ (
          reader.isDelimited() ? reader.readPackedEnum() : [reader.readEnum()]
        );
        for (var i = 0; i < values.length; i++) {
          msg.addTypes(values[i]);
        }
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
proto.types.MetricsRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter();
  proto.types.MetricsRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.types.MetricsRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.types.MetricsRequest.serializeBinaryToWriter = function (
  message,
  writer
) {
  var f = undefined;
  f = message.getTypesList();
  if (f.length > 0) {
    writer.writePackedEnum(1, f);
  }
};

/**
 * repeated MetricType types = 1;
 * @return {!Array<!proto.types.MetricType>}
 */
proto.types.MetricsRequest.prototype.getTypesList = function () {
  return /** @type {!Array<!proto.types.MetricType>} */ (
    jspb.Message.getRepeatedField(this, 1)
  );
};

/**
 * @param {!Array<!proto.types.MetricType>} value
 * @return {!proto.types.MetricsRequest} returns this
 */
proto.types.MetricsRequest.prototype.setTypesList = function (value) {
  return jspb.Message.setField(this, 1, value || []);
};

/**
 * @param {!proto.types.MetricType} value
 * @param {number=} opt_index
 * @return {!proto.types.MetricsRequest} returns this
 */
proto.types.MetricsRequest.prototype.addTypes = function (value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 1, value, opt_index);
};

/**
 * Clears the list making it empty but non-null.
 * @return {!proto.types.MetricsRequest} returns this
 */
proto.types.MetricsRequest.prototype.clearTypesList = function () {
  return this.setTypesList([]);
};

/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.types.Metrics.repeatedFields_ = [1];

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.types.Metrics.prototype.toObject = function (opt_includeInstance) {
    return proto.types.Metrics.toObject(opt_includeInstance, this);
  };

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.types.Metrics} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.types.Metrics.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        peersList: jspb.Message.toObjectList(
          msg.getPeersList(),
          proto.types.PeerMetric.toObject,
          includeInstance
        ),
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
 * @return {!proto.types.Metrics}
 */
proto.types.Metrics.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.types.Metrics();
  return proto.types.Metrics.deserializeBinaryFromReader(msg, reader);
};

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.types.Metrics} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.types.Metrics}
 */
proto.types.Metrics.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
      case 1:
        var value = new proto.types.PeerMetric();
        reader.readMessage(
          value,
          proto.types.PeerMetric.deserializeBinaryFromReader
        );
        msg.addPeers(value);
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
proto.types.Metrics.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter();
  proto.types.Metrics.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.types.Metrics} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.types.Metrics.serializeBinaryToWriter = function (message, writer) {
  var f = undefined;
  f = message.getPeersList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.types.PeerMetric.serializeBinaryToWriter
    );
  }
};

/**
 * repeated PeerMetric peers = 1;
 * @return {!Array<!proto.types.PeerMetric>}
 */
proto.types.Metrics.prototype.getPeersList = function () {
  return /** @type{!Array<!proto.types.PeerMetric>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.types.PeerMetric, 1)
  );
};

/**
 * @param {!Array<!proto.types.PeerMetric>} value
 * @return {!proto.types.Metrics} returns this
 */
proto.types.Metrics.prototype.setPeersList = function (value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};

/**
 * @param {!proto.types.PeerMetric=} opt_value
 * @param {number=} opt_index
 * @return {!proto.types.PeerMetric}
 */
proto.types.Metrics.prototype.addPeers = function (opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(
    this,
    1,
    opt_value,
    proto.types.PeerMetric,
    opt_index
  );
};

/**
 * Clears the list making it empty but non-null.
 * @return {!proto.types.Metrics} returns this
 */
proto.types.Metrics.prototype.clearPeersList = function () {
  return this.setPeersList([]);
};

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.types.PeerMetric.prototype.toObject = function (opt_includeInstance) {
    return proto.types.PeerMetric.toObject(opt_includeInstance, this);
  };

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.types.PeerMetric} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.types.PeerMetric.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        peerid: msg.getPeerid_asB64(),
        sumin: jspb.Message.getFieldWithDefault(msg, 2, 0),
        avrin: jspb.Message.getFieldWithDefault(msg, 3, 0),
        sumout: jspb.Message.getFieldWithDefault(msg, 4, 0),
        avrout: jspb.Message.getFieldWithDefault(msg, 5, 0),
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
 * @return {!proto.types.PeerMetric}
 */
proto.types.PeerMetric.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.types.PeerMetric();
  return proto.types.PeerMetric.deserializeBinaryFromReader(msg, reader);
};

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.types.PeerMetric} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.types.PeerMetric}
 */
proto.types.PeerMetric.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes());
        msg.setPeerid(value);
        break;
      case 2:
        var value = /** @type {number} */ (reader.readInt64());
        msg.setSumin(value);
        break;
      case 3:
        var value = /** @type {number} */ (reader.readInt64());
        msg.setAvrin(value);
        break;
      case 4:
        var value = /** @type {number} */ (reader.readInt64());
        msg.setSumout(value);
        break;
      case 5:
        var value = /** @type {number} */ (reader.readInt64());
        msg.setAvrout(value);
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
proto.types.PeerMetric.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter();
  proto.types.PeerMetric.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.types.PeerMetric} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.types.PeerMetric.serializeBinaryToWriter = function (message, writer) {
  var f = undefined;
  f = message.getPeerid_asU8();
  if (f.length > 0) {
    writer.writeBytes(1, f);
  }
  f = message.getSumin();
  if (f !== 0) {
    writer.writeInt64(2, f);
  }
  f = message.getAvrin();
  if (f !== 0) {
    writer.writeInt64(3, f);
  }
  f = message.getSumout();
  if (f !== 0) {
    writer.writeInt64(4, f);
  }
  f = message.getAvrout();
  if (f !== 0) {
    writer.writeInt64(5, f);
  }
};

/**
 * optional bytes peerID = 1;
 * @return {!(string|Uint8Array)}
 */
proto.types.PeerMetric.prototype.getPeerid = function () {
  return /** @type {!(string|Uint8Array)} */ (
    jspb.Message.getFieldWithDefault(this, 1, "")
  );
};

/**
 * optional bytes peerID = 1;
 * This is a type-conversion wrapper around `getPeerid()`
 * @return {string}
 */
proto.types.PeerMetric.prototype.getPeerid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getPeerid()));
};

/**
 * optional bytes peerID = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getPeerid()`
 * @return {!Uint8Array}
 */
proto.types.PeerMetric.prototype.getPeerid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getPeerid()));
};

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.types.PeerMetric} returns this
 */
proto.types.PeerMetric.prototype.setPeerid = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};

/**
 * optional int64 sumIn = 2;
 * @return {number}
 */
proto.types.PeerMetric.prototype.getSumin = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};

/**
 * @param {number} value
 * @return {!proto.types.PeerMetric} returns this
 */
proto.types.PeerMetric.prototype.setSumin = function (value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};

/**
 * optional int64 avrIn = 3;
 * @return {number}
 */
proto.types.PeerMetric.prototype.getAvrin = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};

/**
 * @param {number} value
 * @return {!proto.types.PeerMetric} returns this
 */
proto.types.PeerMetric.prototype.setAvrin = function (value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};

/**
 * optional int64 sumOut = 4;
 * @return {number}
 */
proto.types.PeerMetric.prototype.getSumout = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};

/**
 * @param {number} value
 * @return {!proto.types.PeerMetric} returns this
 */
proto.types.PeerMetric.prototype.setSumout = function (value) {
  return jspb.Message.setProto3IntField(this, 4, value);
};

/**
 * optional int64 avrOut = 5;
 * @return {number}
 */
proto.types.PeerMetric.prototype.getAvrout = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 5, 0));
};

/**
 * @param {number} value
 * @return {!proto.types.PeerMetric} returns this
 */
proto.types.PeerMetric.prototype.setAvrout = function (value) {
  return jspb.Message.setProto3IntField(this, 5, value);
};

/**
 * @enum {number}
 */
proto.types.MetricType = {
  NOTHING: 0,
  P2P_NETWORK: 1,
};

goog.object.extend(exports, proto.types);
