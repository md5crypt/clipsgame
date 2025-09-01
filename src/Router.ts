import { Component } from "stagnate"

export interface RouteEntry {
	pattern: RegExp
	onNavigate: (match: RegExpMatchArray) => Promise<Component | string>
}

export class NavigationError extends Error {
}

export class Router {
	public static createUri(path: string) {
		return window.location.pathname + window.location.search + (path ? "#" + path : "")
	}

	public static parseUri(uri?: string) {
		const url = (uri === undefined) ? window.location : new URL(uri)
		return url.hash.slice(1)
	}

	private _sequence = 0

	private _routes = [] as RouteEntry[]

	public onNavigationStart?: () => void
	public onNavigationEnd?: (page: Component) => void
	public onNavigationError?: (error: Error) => void

	private resolvePath(path: string) {
		let match
		const route = this._routes.find(route => {
			match = path.match(route.pattern)
			return match
		})
		if (!route) {
			throw new Error(`route for path \`${path}\` not found`)
		}
		return route.onNavigate(match!)
	}

	public register(route: RouteEntry) {
		this._routes.push(route)
	}

	public async navigate(path: string, mode: "push" | "replace" | "none" = "push") {
		const id = this._sequence + 1
		this._sequence = id
		this.onNavigationStart?.()
		let component: Component | null = null
		while (!component) {
			if (mode == "push") {
				window.history.pushState(null, "", Router.createUri(path))
			} else if (mode == "replace") {
				window.history.replaceState(null, "", Router.createUri(path))
			}
			try {
				const page = await this.resolvePath(path)
				if (typeof page == "string") {
					path = page
					mode = "replace"
				} else {
					component = page
				}
			} catch (error) {
				if (error instanceof Error && this.onNavigationError) {
					this.onNavigationError(error)
					return
				} else {
					throw error
				}
			}
		}
		if (this._sequence == id) {
			this.onNavigationEnd?.(component)
		} else {
			component.destroy()
		}
	}
}

export const router = new Router()
