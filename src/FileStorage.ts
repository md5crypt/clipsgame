class FileStorage {
	private static loadFromUrl(url: string) {
		return new Promise<ArrayBuffer>((resolve, reject) => {
			const request = new XMLHttpRequest()
			request.responseType = "arraybuffer"
			request.onload = () => {
				if (request.status >= 200 && request.status < 300) {
					resolve(request.response)
				} else {
					reject(new Error(request.statusText))
				}
			}
			request.onerror = () => reject(new Error(request.statusText))
			request.open("GET", url)
			request.send(null)
		})
	}

	private _cache = new Map<string, ArrayBuffer>()
	private _inProgress = new Map<string, Promise<ArrayBuffer>>()
	
	public async get(path: string) {
		let data = this._cache.get(path)
		if (!data) {
			let promise = this._inProgress.get(path)
			if (promise) {
				return promise
			}
			promise = FileStorage.loadFromUrl(path)
			this._inProgress.set(path, promise)
			data = await promise
			this._inProgress.delete(path)
			this._cache.set(path, data)
		}
		return data
	}

	public getString(path: string) {
		return this.get(path).then(x => new TextDecoder("utf8").decode(x))
	}

	public getJson<T = any>(path: string) {
		return this.getString(path).then(x => JSON.parse(x) as T)
	}
}

export const fileStorage = new FileStorage()
