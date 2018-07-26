#!/bin/bash
REPOPATH=`go env GOPATH`/src/github.com/aergoio/aergo/
grpc_tools_node_protoc --js_out=import_style=commonjs,binary:./types/ \
		--grpc_out=./types/ --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` \
		--proto_path=$REPOPATH/types rpc.proto account.proto blockchain.proto node.proto
