import createStyles from "../createStyles"

const classes = createStyles({
	keyword: {
		color: "#930f80"
	},
	name: {
		color: "#795da3"
	},
	operator: {
		color: "#0080c0"
	},
	variable: {
		color: "#ed6a43"
	},
	comment: {
		color: "#34a834"
	}
}, __MODULE_NAME)

const enum RegexGroup {
	COMMENT = 1,
	VARIABLE,
	KEYWORD,
	OPERATOR,
	WORD
}

export function ClipsCode(props: {code: string}) {
	const code = props.code
	const re = /(;[^\r\n]*)|(\?[^\s()&|~]*)|\b(defrule|deffacts|assert|retract|not|and|or|forall|exists)\b|((?:[&|~=><()-]+))|([^\s()]+)/g
	const fragment = document.createDocumentFragment()
	let lastClass = ""
	let offset = 0

	while (true) {
		const match = re.exec(code)
		if (!match) {
			if (offset < code.length) {
				fragment.append(code.slice(offset))
			}
			break
		}
		let className = ""
		if (match[RegexGroup.COMMENT] !== undefined) {
			className = classes.comment
		} else if (match[RegexGroup.VARIABLE] !== undefined) {
			className = classes.variable
		} else if (match[RegexGroup.KEYWORD] !== undefined) {
			className = classes.keyword
		} else if (match[RegexGroup.OPERATOR] !== undefined) {
			className = classes.operator
		} else if (match[RegexGroup.WORD] !== undefined && lastClass == classes.keyword) {
			className = classes.name
		}
		if (className) {
			if (offset != match.index) {
				fragment.append(code.slice(offset, match.index))
			}
			fragment.appendChild(<span class={className}>{match[0]}</span>)
			offset = re.lastIndex
			lastClass = className
		}
	}

	return fragment
}
