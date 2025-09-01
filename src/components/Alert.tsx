import { ClassAttribute, Component, StagnateNode } from "stagnate"
import createStyles from "../createStyles"
import { Markdown } from "./Markdown"

const classes = createStyles({
	root: {
		padding: 15,
		position: "relative",
		border: [1, "solid", "transparent"],
		borderRadius: 4,
		boxSizing: "border-box",
		width: "100%",
		lineHeight: "normal",
		"& > a": {
			color: "currentColor",
			fontWeight: 600
		}
	},
	withButton: {
		paddingRight: 35
	},
	success: {
		color: "#3c763d",
		backgroundColor: "#dff0d8",
		borderColor: "#d6e9c6"
	},
	danger: {
		color: "#a94442",
		backgroundColor: "#f2dede",
		borderColor: "#ebccd1"
	},
	info: {
		color: "#31708f",
		backgroundColor: "#d9edf7",
		borderColor: "#bce8f1"
	},
	warning: {
		color: "#8a6d3b",
		backgroundColor: "#fcf8e3",
		borderColor: "#faebcc"
	},
	header: {
		fontWeight: "bold"
	},
	button: {
		position: "absolute",
		top: 16,
		right: 14,
		width: 20,
		fill: "currentColor",
		cursor: "pointer",
		opacity: 0.2,
		"&:hover": {
			color: "#000",
			opacity: 0.5
		}
	}
}, __MODULE_NAME)

interface Props {
	content: string
	type: "danger" | "success" | "info" | "warning"
	closable?: boolean
	class?: ClassAttribute
	children?: StagnateNode
}

export class Alert extends Component<{}, Props> {
	public render() {
		const props = this.props
		return <div class={[classes.root, classes[props.type], props.closable && classes.withButton, props.class]}>
			{props.content && <Markdown inline content={props.content} />}
			{props.children}
			{props.closable && <svg class={classes.button} viewBox="0 0 24 24" onClick={() => this.destroy()}>
				<svg:path d="M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12L20 6.91Z" />
			</svg>}
		</div>
	}
}