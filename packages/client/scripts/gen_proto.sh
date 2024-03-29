#!/bin/bash
PROTOPATH=aergo-protobuf/proto/

rm -rf ./types/*

mkdir -p ./types/web

# For grpc target
grpc_tools_node_protoc \
    --plugin=protoc-gen-ts=../../node_modules/.bin/protoc-gen-ts \
    --ts_out=./types/ \
    --js_out=import_style=commonjs_strict,binary:./types/ \
    --grpc_out=./types/ --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` \
    --proto_path=$PROTOPATH rpc.proto account.proto blockchain.proto node.proto p2p.proto metric.proto raft.proto

# For grpc-web target
grpc_tools_node_protoc \
    --plugin=protoc-gen-ts=../../node_modules/.bin/protoc-gen-ts \
    --ts_out=service=grpc-web:./types/web/ \
    --js_out=import_style=commonjs_strict,binary:./types/web/ \
    --proto_path=$PROTOPATH rpc.proto account.proto blockchain.proto node.proto p2p.proto metric.proto raft.proto

cp ./types/web/rpc_pb_service.js ./types/rpc_grpc_web_pb.js
rm -rf ./types/web/

