export function ErrorMessage(props: {error: Error}) {
	const styles = {
		margin: "0",
		padding: "20px",
		fontSize: "14px",
		color: "white",
		backgroundColor: "black",
		whiteSpace: "pre-wrap",
		fontFamily: "monospace"
	} as CSSStyleDeclaration
	const stack = (props.error.stack || "").replace(/^Error:[^\n]*\n/, "")
	return <pre style={styles}>
		{props.error.toString() + "\n" + stack}
	</pre>
}
