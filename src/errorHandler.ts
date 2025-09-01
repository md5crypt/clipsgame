import { ErrorMessage } from "./components/ErrorMessage"

export type ErrorHandler = (error: Error) => void

let dead = false

let errorHandler: ErrorHandler = error => {
	document.body.innerHTML = ""
	document.body.append(ErrorMessage({error}))
}

export function setErrorHandler(handler: ErrorHandler) {
	errorHandler = handler
}

window.addEventListener("error", event => {
	const error = event.error
	if (error instanceof Error) {
		console.error(error)
		if (!dead) {
			errorHandler(error)
			dead = true
		}
	} else {
		console.error(event.message)
	}
})

window.addEventListener("unhandledrejection", event => {
	const error = event.reason
	console.error(error)
	if (error instanceof Error) {
		if (!dead) {
			errorHandler(error)
			dead = true
		}
	}
})
