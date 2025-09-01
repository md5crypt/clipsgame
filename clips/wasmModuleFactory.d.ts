export interface WasmModule {
	_malloc: (size: number) => number
	_free: (ptr: number) => void
	_CreateEnvironment: () => number
	_DestroyEnvironment: (env: number) => boolean
	_RouteCommand: (env: number, command: number, printResult: boolean) => boolean
	_SetHaltExecution: (env: number, value: boolean) => void
	_SetEvaluationError: (env: number, value: boolean) => void
	setInput: (data: string) => void
	flushOutput: () => string
	UTF8Encoder: TextEncoder
	UTF8Decoder: TextDecoder
	HEAP8: Int8Array
}

export default function wasmModuleFactory(options: {wasm: ArrayBufferLike}): Promise<WasmModule>
