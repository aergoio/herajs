#!/bin/bash
PROTOPATH=aergo-protobuf/proto/

# For grpc-web target
grpc_tools_node_protoc \
    --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
    --ts_out=service=true:./types/web/ \
    --js_out=import_style=commonjs,binary:./types/web/ \
    --proto_path=$PROTOPATH rpc.proto account.proto blockchain.proto node.proto

# For grpc target
grpc_tools_node_protoc \
    --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
    --ts_out=./types/ \
    --js_out=import_style=commonjs,binary:./types/ \
    --grpc_out=./types/ --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` \
    --proto_path=$PROTOPATH rpc.proto account.proto blockchain.proto node.proto