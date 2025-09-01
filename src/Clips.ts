import { default as wasmModuleFactory, WasmModule } from "../clips/wasmModuleFactory"

export class Clips {
	public static create(wasm: ArrayBufferLike) {
		return wasmModuleFactory({wasm}).then(module => new this(module))
	}

	private readonly _module: WasmModule
	private _commandBuffer: number
	private _env: number

	private constructor(module: WasmModule) {
		this._module = module
		this._commandBuffer = this._module._malloc(1024)
		this._env = this._module._CreateEnvironment()
	}

	public destroy() {
		this._module._free(this._commandBuffer)
		this._module._DestroyEnvironment(this._env)
	}

	public setFile(data: string) {
		this._module.setInput(data)
	}

	public flush() {
		return this._module.flushOutput()
	}

	public command(input: string) {
		const data = this._module.UTF8Encoder.encode(input)
		if (data.length > 1023) {
			throw new Error("input too long")
		}
		this._module.HEAP8.set(data, this._commandBuffer)
		this._module.HEAP8[this._commandBuffer + data.length] = 0
		this._module._SetEvaluationError(this._env, false)
		this._module._SetHaltExecution(this._env, false)
		return this._module._RouteCommand(this._env, this._commandBuffer, false)
	}
}