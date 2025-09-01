import { Component } from "stagnate"
import createStyles from "../createStyles"
import { setErrorHandler } from "../errorHandler"
import { NavigationError, Router, router } from "../Router"
import { Alert } from "./Alert"
import "../pages"

const classes = createStyles({
	"@global": {
		body: {
			margin: 0,
			padding: 0,
			backgroundColor: "#f6f6f6"
		}
	},
	root: {
		boxSizing: "border-box",
		width: "100%",
		padding: 45,
		fontFamily: "SourceSans3",
		fontWeight: 380,
		fontSize: 17,
		lineHeight: 1.45,
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		color: "#3f3f3f",
		"& > *":{
			minWidth: 200,
			maxWidth: 900,
			width: "100%"
		},
		"&$smallScreen": {
			padding: 24
		}
	},
	$smallScreen: {}
}, __MODULE_NAME)

export class RootComponent extends Component {
	private _page: Component | null = null
	private _alert: Alert | null = null

	private clearAlert() {
		if (this._alert) {
			this._alert.destroy()
			this._alert = null
		}
	}

	private alert(message: string, error = false) {
		this.clearAlert()
		this.root.appendChild(<Alert
			ref={x => this._alert = x}
			content={message}
			type={error ? "danger" : "info"}
		/>)
	}

	protected render() {
		return <div class={classes.root} />
	}

	protected onAttach() {
		const query = window.matchMedia("(width <= 600px)")
		this.root.classList.toggle(classes.$smallScreen, query.matches)
		query.addEventListener("change", e => {
			this.root.classList.toggle(classes.$smallScreen, e.matches)
		})
		setErrorHandler(error => {
			this._page?.destroy()
			this.alert(`**Unexpected error**: ${error.message}`, true)
		})
		router.onNavigationStart = () => {
			this._page?.destroy()
			this.alert("**Loading...** please wait while the game loads.")
		}
		router.onNavigationEnd = page => {
			this.clearAlert()
			this._page = page
			page.create(this)
		}
		router.onNavigationError = error => {
			if (error instanceof NavigationError) {
				this.alert(error.message, true)
			} else {
				throw error
			}
		}
		void this.start()
	}

	private async start() {
		await Promise.allSettled(["SourceCodePro", "SourceSans3"].map(name => {
			const fontFace = new FontFace(name, `url(fonts/${name}.woff2)`, {
				weight: "200 900",
				display: "swap",
				style: "normal"
			})
			const promise = fontFace.load()
			document.fonts.add(fontFace)
			return promise
		}))
		router.navigate(Router.parseUri(), "none")
		window.addEventListener("popstate", () => router.navigate(Router.parseUri(), "replace"))
	}
}
