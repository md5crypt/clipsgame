export class InputParseError extends Error {
}

const enum MatchGroup {
	NAME = 1,
	WORD,
	PARENTHESIS,
	LINE,
	INVALID
}

interface StackNode extends Array<StackNode | string> {}

export function parseInput(input: string) {
	const re = /([a-zA-Z_][\w-]*)|([\w-]+)|([()])|(\n|$)|;[^\n]*|[^\S\n]+|(.)/g
	const lines = [] as string[]
	const stack = [] as StackNode[]
	let lineStart = 0
	let top = [] as StackNode

	function error(message: string) {
		const endLine = input.indexOf("\n", lineStart)
		const line = input.slice(lineStart, endLine < 0 ? undefined : endLine)
		throw new InputParseError(`Failed to parse \`${line}\`, ${message}.`)
	}

	function flatten(node: StackNode): string {
		return "(" + node.map(x => Array.isArray(x) ? flatten(x) : x).join(" ") + ")"
	}

	let match
	do {
		match = re.exec(input)
		if (!match) {
			throw new Error("this should not happen")
		}
		if (match[MatchGroup.NAME] !== undefined) {
			top.push(match[MatchGroup.NAME])
		} else if (match[MatchGroup.WORD]) {
			if (top.length == 0) {
				error(`a fact has to start from a word, got \`${match[0]}\``)
			}
			top.push(match[MatchGroup.NAME])
		} else if (match[MatchGroup.PARENTHESIS] !== undefined) {
			if (match[0] == "(") {
				stack.push(top)
				top = []
			} else {
				if (stack.length == 0) {
					error(`unmatched \`)\``)
				}
				if (top.length == 0) {
					error(`empty parenthesis group`)
				}
				const tmp = top
				top = stack.pop()!
				top.push(tmp)
			}
		} else if (match[MatchGroup.LINE] !== undefined) {
			if (stack.length != 0) {
				error(`unclosed \`(\``)
			}
			if (top.length > 0) {
				if (top.length == 1 && Array.isArray(top[0])) {
					top = top[0]
				}
				if (top.length == 2 && top[0] == "assert" && Array.isArray(top[1])) {
					top = top[1]
				}
				if (top.length == 0) {
					error(`empty input`)
				}
				const item = top.find(x => Array.isArray(x))
				if (item) {
					error(`unexpected nested group \`${flatten(item)}\``)
				}
				lines.push(flatten(top))
				top = []
			}
			lineStart = re.lastIndex
		} else if (match[MatchGroup.INVALID] !== undefined) {
			error(`unexpected character: \`${match[0]}\``)
		}
	} while(match.index < input.length)
	return lines
}
