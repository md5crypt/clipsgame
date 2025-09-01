
import { ClassAttribute } from "stagnate"
import createStyles from "../createStyles"
import { router } from "../Router"

const classes = createStyles({
	root: {
		color: "#000",
		opacity: 0.4,
		fontSize: 16,
		verticalAlign: "middle",
		display: "inline-block",
		"$smallScreen &": {
			marginRight: 8,
			"& svg": {
				marginLeft: -6
			}
		},
		"& svg": {
			width: "1em",
			fill: "currentColor",
			marginLeft: -28
		},
		"&:hover": {
			opacity: 0.75
		}
	}
}, __MODULE_NAME)

interface Props {
	path?: string
	class?: ClassAttribute
}

export function BackButton(props: Props) {
	return <a
		class={[classes.root, props.class]}
		href={"#" + (props.path || "")}
		onClick={e => {
			e.preventDefault()
			router.navigate(props.path || "")
		}}
	>
		<svg viewBox="0 0 14 14">
			<svg:path d="M5,3V0L1,4l4,4V5c0,0,6,0,6,3s-5,4-5,4v2c0,0,7-1,7-6C13,4,8,3,5,3z" />
		</svg>
	</a>
}