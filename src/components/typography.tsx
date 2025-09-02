import { StagnateNode } from "stagnate"
import createStyles from "../createStyles"
import { router } from "../Router"

const classes = createStyles({
	list: {
		marginBottom: 16,
		marginTop: 0,
		paddingLeft: "2em",
		"&:last-child": {
			marginBottom: 0,
		},
		"& $list": {
			marginBottom: 0,
		},
		"& $list ol": {
			listStyleType: "lower-roman"
		},
		"& $list $list ol": {
			listStyleType: "lower-alpha"
		},
		"& li + li": {
			marginTop: 4
		}
	},
	link: {
		color: "#4fa1db",
		textDecoration: "none",
		"&:hover": {
			textDecoration: "underline"
		}
	},
	header: {
		lineHeight: 1.25,
		paddingTop: ".25em",
		margin: 0,
		marginBottom: 16,
		fontWeight: 400,
		"&:first-child": {
			paddingTop: 0
		},
		"h1&": {
			fontWeight: 360,
			fontSize: "2.6em",
			paddingBottom: ".2em",
			borderBottom: [1, "solid", "#c9c9c9c9"],
			"$smallScreen &": {
				fontSize: "2.4em"
			}
		},
		"h2&": {
			fontWeight: 340,
			fontSize: "2.15em",
			paddingBottom: ".2em",
			borderBottom: [1, "solid", "#c9c9c9c9"]
		},
		"h3&": {
			fontSize: "1.5em"
		},
		"h4&": {
			fontSize: "1.2em"
		},
		"h5&": {
			fontSize: 16
		},
		"h6&": {
			fontSize: ".85em",
			color: "#6a737d"
		}
	},
	code: {
		fontFamily: "SourceCodePro, monospace",
		padding: [0, ".25em"],
		paddingTop: ".175em",
		paddingBottom: ".175em",
		margin: 0,
		fontSize: ".882em",
		backgroundColor: "#80808014",
		borderRadius: 3,
		fontWeight: 450,
	},
	block: {
		margin: 0,
		marginBottom: 16,
		fontFamily: "SourceCodePro, monospace",
		wordWrap: "normal",
		overflow: "auto",
		padding: 16,
		borderRadius: 3,
		backgroundColor: "#1b1f2305",
		tabSize: 4,
		paddingBottom: 16,
		fontSize: 14,
		lineHeight: 1.8,
		fontWeight: 450,
		"&:last-child": {
			marginBottom: 0,
		}
	},
	blockquote: {
		margin: 0,
		marginBottom: 16,
		padding: 16,
		color: "#6a737d",
		borderLeft: [10, "solid", "#80808013"],
		backgroundColor: "#1b1f2305",
		"&:last-child": {
			marginBottom: 0,
		}
	},
	line: {
		height: "0.25em",
		margin: [24, 0],
		border: 0,
		borderBottom: [1, "solid", "#eee"],
		backgroundColor: "#e1e4e880",
	},
	paragraph: {
		margin: 0,
		marginBottom: 16,
		textAlign: "justify",
		"&:last-child": {
			marginBottom: 0
		}
	},
	bold: {
		fontWeight: 600
	}
}, __MODULE_NAME)

export function Header(props: {level: number, text?: string, children?: StagnateNode, ref?: (x: HTMLHeadingElement) => void}) {
	const Tag = `h${props.level as 1|6}` as const
	return <Tag class={classes.header}>
		{props.text || props.children}
	</Tag>
}

export function CodeBlock(props: {text?: string, children?: StagnateNode, ref?: (x: HTMLPreElement) => void}) {
	return <pre class={classes.block}>
		{props.text || props.children}
	</pre>
}

export function CodeSpan(props: {text?: string, children?: StagnateNode, ref?: (x: HTMLElement) => void}) {
	return <code class={classes.code}>
		{props.text || props.children}
	</code>
}

export function Strong(props: {text?: string, children?: StagnateNode, ref?: (x: HTMLElement) => void}) {
	return <strong class={classes.bold}>
		{props.text || props.children}
	</strong>
}

export function Paragraph(props: {text?: string, children?: StagnateNode, ref?: (x: HTMLElement) => void}) {
	return <p class={classes.paragraph}>
		{props.text || props.children}
	</p>
}

export function BlockQuote(props: {text?: string, children?: StagnateNode, ref?: (x: HTMLElement) => void}) {
	return <blockquote class={classes.blockquote}>
		{props.text || props.children}
	</blockquote>
}

export function HLine(props: {ref?: (x: HTMLElement) => void}) {
	return <hr class={classes.line} />
}

export function Link(props: {href: string, text?: string, children?: StagnateNode, ref?: (x: HTMLElement) => void}) {
	return <a class={classes.link} href={props.href}>{props.text || props.children}</a>
}

export function List(props: {start?: number, items?: StagnateNode[], children?: StagnateNode, ref?: (x: HTMLElement) => void}) {
	const children = props.items ? props.items.map(x => <li>{x}</li>) : props.children
	if (props.start === undefined) {
		return <ul class={classes.list}>{children}</ul>
	} else {
		return <ol start={props.start} class={classes.list}>{children}</ol>
	}
}
