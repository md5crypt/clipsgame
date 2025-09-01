import createStyles from "../createStyles"

const classes = createStyles({
	input: {
		color: "#888"
	},
	fact: {
		color: "#795da3"
	},
	activation: {
		color: "#930f80"
	},
	fire: {
		color: "#0080c0"
	},
	remove: {
		textDecoration: "line-through"
	},
	name: {
		fontWeight: 640
	}
}, __MODULE_NAME)

const enum RegexGroup {
	INPUT = 1,
	FACT,
	ACTIVATION,
	FIRE
}

export function ClipsOutput(props: {input: string}) {
	const input = props.input
	if (input.length == 0) {
		return null
	}
	const re = /(?:(CLIPS)>|(==>|<==)\s*f-\d+|(==>|<==)\s*Activation\s*\d+|(FIRE)\s*\d+)\s*/gy
	const fragment = document.createDocumentFragment()

	let offset = 0

	while (offset < input.length) {
		re.lastIndex = offset
		const match = re.exec(input)
		let end = input.indexOf("\n", match ? re.lastIndex : offset)
		if (end < 0) {
			end = input.length
		} else {
			end += 1
		}
		if (match) {
			if (match[RegexGroup.INPUT] !== undefined) {
				fragment.appendChild(<span class={classes.input}>{input.slice(offset, end)}</span>)
			} else if (match[RegexGroup.FACT] !== undefined) {
				fragment.appendChild(
					<span class={[classes.fact, match[0][0] == "<" && classes.remove]}>
						{input.slice(offset, re.lastIndex)}
						<span class={classes.name}>{input.slice(re.lastIndex, end)}</span>
					</span>
				)
			} else {
				let semicolon = input.indexOf(":", re.lastIndex)
				if (semicolon < 0) {
					semicolon = match.index
				}
				fragment.appendChild(
					<span class={match[RegexGroup.FIRE] !== undefined ? classes.fire : [classes.activation, match[0][0] == "<" && classes.remove]}>
						{input.slice(offset, re.lastIndex)}
						{match.index < semicolon && <span class={classes.name}>{input.slice(re.lastIndex, semicolon)}</span>}
						{input.slice(semicolon, end)}
					</span>
				)
			}
		} else {
			fragment.append(input.slice(offset, end))
		}
		offset = end
	}

	return fragment
}
