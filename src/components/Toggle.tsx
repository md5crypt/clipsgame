import { Component } from "stagnate";
import createStyles from "../createStyles";

const classes = createStyles({
	root: {
		position: "relative",
		width: 40,
		height: 24,
		transition: "background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
		cursor: "pointer",
		backgroundColor: "#e5e5e5",
		borderRadius: 24,
		boxShadow: "0px 3px 4px -2px #00000014",
		"& > div": {
			position: "absolute",
			width: 20,
			height: 20,
			borderRadius: 20,
			top: 2,
			left: 2,
			background: "#fff",
			transition: "left 0.2s"
		}
	},
	toggled: {
		backgroundColor: "#999",
		"& > div": {
			left: 18
		}
	}
}, __MODULE_NAME)

interface Props {
	onToggle?: (value: boolean) => void,
	toggled?: boolean
}

export class Toggle extends Component<{}, Props> {
	private _value = false

	protected render() {
		return <div class={classes.root} onClick={() => this.handleClick()}>
			<div />
		</div>
	}

	protected onRender() {
		if (this.props.toggled) {
			this.value = true
		}
	}

	private handleClick() {
		this._value = !this._value
		this.root.classList.toggle(classes.toggled, this._value)
		if (this.props.onToggle) {
			this.props.onToggle(this._value)
		}
	}

	public get value() {
		return this._value
	}

	public set value(value: boolean) {
		this._value = value
		this.root.classList.toggle(classes.toggled, value)
	}
}
