#!/bin/bash

cd "$(dirname "${BASH_SOURCE[0]}")"

set -e

if ! command -v emcc &> /dev/null; then
	if test -f ~/emsdk/emsdk_env.sh; then
		source ~/emsdk/emsdk_env.sh
	else
		echo "emsdk not found, run \"source ~/emsdk_env.sh\""
		exit 1
	fi
fi

set -x

if ! test -d core; then
	curl -L "https://downloads.sourceforge.net/project/clipsrules/CLIPS/6.4.2/clips_core_source_642.zip" -o clips_core_source.zip
	unzip -j clips_core_source.zip "clips_core_source_642/core/*" -d core
	rm -f clips_core_source.zip
fi

emcc \
	-Oz \
	-flto \
	-std=c99 \
	-fno-strict-aliasing \
	-D DEFMODULE_CONSTRUCT=0 \
	-D FACT_SET_QUERIES=0 \
	-D DEFGLOBAL_CONSTRUCT=0 \
	-D DEFFUNCTION_CONSTRUCT=0 \
	-D DEFGENERIC_CONSTRUCT=0 \
	-D OBJECT_SYSTEM=0 \
	-D DEFINSTANCES_CONSTRUCT=0 \
	-D INSTANCE_SET_QUERIES=0 \
	-D EXTENDED_MATH_FUNCTIONS=0 \
	-D TEXTPRO_FUNCTIONS=0 \
	-D CONSTRUCT_COMPILER=0 \
	-D IO_FUNCTIONS=0 \
	-D STRING_FUNCTIONS=0 \
	-D MULTIFIELD_FUNCTIONS=0 \
	-D PROFILING_FUNCTIONS=0 \
	-D SYSTEM_FUNCTION=0 \
	-s EVAL_CTORS \
	-s ALLOW_MEMORY_GROWTH=1 \
	-s MODULARIZE=1 \
	-s INVOKE_RUN=0 \
	-s FILESYSTEM=0 \
	-s EXPORT_ES6=1 \
	-s WASM_BIGINT=0 \
	-s MINIMAL_RUNTIME=1 \
	-s EXPORT_KEEPALIVE=1 \
	-s EXPORT_ALL=0 \
	-s POLYFILL=0 \
	-s ENVIRONMENT=web \
	-s EXPORT_NAME=wasmModuleFactory \
	-s DYNAMIC_EXECUTION=0 \
	-s TEXTDECODER=2 \
	-s EXPORTED_FUNCTIONS="[ \
		_CreateEnvironment, _DestroyEnvironment, _RouteCommand, _SetHaltExecution, _SetEvaluationError, \
		_malloc, _free, \
		UTF8Encoder, UTF8Decoder, setInput, flushOutput
	]" \
	-s EXPORTED_RUNTIME_METHODS="[HEAP8]" \
	-o ./wasmModuleFactory.js \
	--js-library=syscalls.js \
	./core/*.c

mv -f wasmModuleFactory.wasm ./clips.wasm

echo "done"
