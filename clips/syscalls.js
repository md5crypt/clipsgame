addToLibrary({
	$UTF8Encoder__postset: "UTF8Encoder = new TextEncoder(\"utf8\")",
	$UTF8Encoder: {},

	outputBuffer: [],
	inputPosition: 0,

	inputBuffer: {},
	inputBuffer__postset: "_inputBuffer = new Uint8Array(0)",

	$setInput__deps: ["$UTF8Encoder", "inputBuffer", "inputPosition"],
	$setInput: function(data) {
		_inputBuffer = UTF8Encoder.encode(data)
		_inputPosition = 0
	},

	$setInput__deps: ["$UTF8Decoder", "outputBuffer"],
	$flushOutput: function() {
		const buffer = new Uint8Array(_outputBuffer.reduce((a, b) => a + b.length, 0))
		let offset = 0
		for (const item of _outputBuffer) {
			buffer.set(item, offset)
			offset += item.length
		}
		_outputBuffer = []
		return UTF8Decoder.decode(buffer)
	},

	__syscall_openat__deps: ["inputPosition"],
	__syscall_openat: function (dirfd, pathPtr, flags, varargs) {
		_inputPosition = 0
		return 0
	},

	fd_write__deps: ["outputBuffer"],
	fd_write: function (fd, iov, iovcnt, pnum) {
		let num = 0;
		for (let i = 0; i < iovcnt; i += 1) {
			num += HEAPU32[(iov + 4 + (i * 8)) >> 2]
		}
		const buffer = new Uint8Array(num)
		let offset = 0
		for (let i = 0; i < iovcnt; i += 1) {
			const iovPtr = (iov + (i * 8)) >> 2
			const ptr = HEAPU32[iovPtr + 0]
			const len = HEAPU32[iovPtr + 1]
			buffer.set(HEAPU8.subarray(ptr, ptr + len), offset)
			offset += len
		}
		_outputBuffer.push(buffer)
		HEAPU32[pnum >> 2] = num
		return 0
	},

	fd_read__deps: ["inputBuffer", "inputPosition"],
	fd_read: function (fd, iov, iovcnt, pnum) {
		const buffer = _inputBuffer
		let offset = _inputPosition
		let left = buffer.length - offset
		let count = 0

		for (let i = 0; i < iovcnt && left > 0; i += 1) {
			const iovPtr = (iov + (i * 8)) >> 2
			const ptr = HEAPU32[iovPtr + 0]
			const len = Math.min(left, HEAPU32[iovPtr + 1])
			HEAPU8.set(buffer.subarray(offset, offset + len), ptr);
			offset += len
			count += len
			left -= len
		}

		_inputPosition = offset
		HEAPU32[pnum >> 2] = count
		return 0;
	},

	fd_seek__deps: ["inputBuffer", "inputPosition"],
	fd_seek: function (fd, offset, whence, newOffsetPtr) {
		if (whence == 1) {
			offset += _inputPosition
		} else if (whence == 2) {
			offset += _inputBuffer.length
		}
		offset = Math.max(0, Math.min(offset))
		_inputPosition = offset
		HEAPU32[(newOffsetPtr >> 2) + 0] = offset;
		HEAPU32[(newOffsetPtr >> 2) + 1] = 0;
		return 0
	},

	fd_close__deps: [],
	fd_close: function (fd) {
		return 0
	},

	_gmtime_js__deps: [],
	_gmtime_js: function (time, tmPtr) {},

	_localtime_js__deps: [],
	_localtime_js: function (time, tmPtr) {},

	_tzset_js__deps: [],
	_tzset_js: function (timezone, daylight, std_name, dst_name) {},

	_setitimer_js: [],
	_setitimer_js: function(which, timeout_ms) {}
})
