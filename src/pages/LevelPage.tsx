import { Component, ComponentProps } from "stagnate"
import { fileStorage } from "../FileStorage"
import { NavigationError, router } from "../Router"
import { Header, Paragraph, List, CodeSpan, CodeBlock } from "../components/typography"
import createStyles from "../createStyles"
import { Clips } from "../Clips"
import { AssertionLimitError, Level, ReAssertionError, TabuAssertionError, ClipsEvalError } from "../Level"
import { BackButton } from "../components/BackButton"
import { Markdown } from "../components/Markdown"
import { ClipsCode } from "../components/ClipsCode"
import { Toggle } from "../components/Toggle"
import { Alert } from "../components/Alert"
import { parseInput, InputParseError } from "../inputParser"
import { ClipsOutput } from "../components/ClipsOutput"

const classes = createStyles({
	root: {
		display: "flex",
		flexDirection: "column"
	},
	input: {
		width: "100%",
		padding: [0, 8],
		margin: 0,
		fontFamily: "SourceCodePro, monospace",
		fontSize: 14,
		fontWeight: 450,
		boxSizing: "border-box",
		border: [1, "solid", "#ccc"],
		height: 36,
		color: "inherit",
		borderRadius: 4,
		"&:focus": {
			outline: "none"
		}
	},
	textarea: {
		height: "auto",
		resize: "none",
		overflowX: "auto",
		overflowY: "hidden",
		whiteSpace: "pre",
		padding: 8,
		margin: 0,
		lineHeight: "inherit"
	},
	hint: {
		fontSize: 12,
		color: "#777",
		marginTop: 6,
		marginLeft: 3,
		textAlign: "justify",
		"$smallScreen &": {
			marginLeft: 0
		}
	},
	buttons: {
		display: "flex",
		flexDirection: "row",
		marginTop: 16,
		"$smallScreen &": {
			flexDirection: "row-reverse"
		}
	},
	scriptToggle: {
		float: "right",
		display: "flex",
		alignItems: "center",
		flexDirection: "column",
		marginTop: 2,
		userSelect: "none",
		"& > span": {
			color: "#777",
			fontSize: 12,
			fontWeight: 380,
			marginTop: 5
		}
	},
	spacer: {
		flexGrow: 1,
		"$smallScreen &": {
			display: "none"
		}
	},
	button: {
		"&:first-child": {
			marginLeft: 0
		},
		"$smallScreen &": {
			flexGrow: 1,
			"&:last-child": {
				marginLeft: 0
			},
			"&:first-child": {
				marginLeft: 10
			},
		},
		position: "relative",
		borderRadius: 4,
		padding: [18, 0],
		lineHeight: 0,
		backgroundColor: "#999",
		color: "#f6f6f6",
		cursor: "pointer",
		textAlign: "center",
		fontWeight: 500,
		width: 100,
		boxSizing: "border-box",
		marginLeft: 10,
		boxShadow: "inset 0px -2px 2px 0px #0000002e, inset 0px 2px 6px -1px #ffffff6e, 0px 2px 4px #00000024",
		userSelect: "none"
	},
	badge: {
		position: "absolute",
		bottom: -18,
		width: "100%",
		fontSize: 12,
		color: "#777",
		fontWeight: 380,
		lineHeight: 1
	},
	alert: {
		marginBottom: 16
	},
	disabled: {
		boxShadow: "none",
		background: "#ccc",
		pointerEvents: "none"
	},
	lineMode: {
		"& $scriptOnly": {
			display: "none"
		}
	},
	scriptMode: {
		"& $lineOnly": {
			display: "none"
		}
	},
	scriptOnly: {},
	lineOnly: {}
}, __MODULE_NAME)

interface Props {
	level: Level
	index: string[]
}

interface Refs {
	factTable: Text
	console: HTMLPreElement
	lineInput: HTMLInputElement
	scriptInput: HTMLTextAreaElement
	counter: Text
	assertButton: HTMLDivElement
	undoButton: HTMLDivElement
	resetButton: HTMLDivElement
}

class LevelPage extends Component<Refs, Props> {
	public static pattern = /^level-(.+)$/

	public static async onNavigate(match: RegExpMatchArray) {
		const name = match[1]
		const index = await fileStorage.getJson<string[]>("levels/index.json")
		if (!index.includes(name)) {
			throw new NavigationError(`**No such level!** Level \`${name}\` does not exist. Go back to [level select](#home).`)
		}
		let definition
		let script
		let clips
		await Promise.all([
			this.getClips().then(x => clips = x),
			fileStorage.getJson(`levels/${name}.json`).then(x => definition = x),
			fileStorage.getString(`levels/${name}.clp`).then(x => script = x),
		])
		return new LevelPage({level: new Level(clips!, name, definition!, script!), index})
	}

	private static _clips?: Clips

	private static async getClips() {
		if (!this._clips) {
			this._clips = await fileStorage.get("clips/clips.wasm").then(wasm => Clips.create(wasm))
		}
		return this._clips
	}

	private _alert?: Alert
	private _populateTextarea = false

	protected render() {
		const level = this.props.level
		const definition = level.definition
		const scriptMode = localStorage.getItem("scriptMode")
		return <div class={[classes.root, scriptMode ? classes.scriptMode : classes.lineMode]}>
			<Header level={1}><BackButton />{`Level ${this.props.index.indexOf(level.name) + 1}: ${definition.title}`}</Header>
			<Paragraph><Markdown content={definition.description} inline /></Paragraph>
			<Header level={4} text="Goal" />
			<Paragraph><Markdown content={definition.goalDescription} inline /></Paragraph>
			{definition.tabu && definition.tabu.length > 0 && <>
				<Header level={4} text="Restricted facts" />
				<List items={definition.tabu.map(x => <CodeSpan text={x} />)} />
			</>}
			<Header level={2} text="Definitions" />
			<CodeBlock><ClipsCode code={level.script} /></CodeBlock>
			<Header level={2} text="Output" />
			<Header level={4} text="Fact Table" />
			<CodeBlock><text ref={this.ref("factTable")}/></CodeBlock>
			<Header level={4} text="Console" />
			<CodeBlock ref={this.ref("console")} />
			<Header level={2}>
				<span>Input</span>
				<div class={classes.scriptToggle}>
					<Toggle
						toggled={scriptMode != null}
						onToggle={value => this.handleModeToggle(value)}
					/>
					<span>Script mode</span>
				</div>
			</Header>
			<input
				ref={this.ref("lineInput")}
				class={[classes.input, classes.lineOnly]}
				placeholder="(fact to be asserted)"
				onKeyDown={e => e.key == "Enter" && this.handleAssert()}
			/>
			<textarea
				ref={this.ref("scriptInput")}
				class={[classes.input, classes.textarea, classes.scriptOnly]}
				placeholder={"(fact to be asserted)"}
				spellcheck="false"
				onInput={() => {
					const input = this.refs.scriptInput
					const value = input.value
					let count = 1
					for (let i = 0; i < value.length; i += 1) {
						if (value[i] == "\n") {
							count += 1
						}
					}
					input.rows = Math.max(4, count)
				}}
				rows={4}
			/>
			<div class={classes.hint}>
				<span class={classes.lineOnly}>
					A single fact to be asserted, parenthesis around the fact are optional
					eg. <CodeSpan>(dog is bark)</CodeSpan> and <CodeSpan>dog is bark</CodeSpan> are both valid.
				</span>
				<span class={classes.scriptOnly}>
					One fact per line, parenthesis are optional, comments are allowed with <CodeSpan>;</CodeSpan>.
					Pressing <CodeSpan>RUN</CodeSpan> resets the level and asserts all listed facts one by one.
				</span>
			</div>
			<div class={classes.buttons}>
				<div ref={this.ref("assertButton")} onClick={() => this.handleAssert()} class={[classes.button, classes.lineOnly]}>
					ASSERT
					{isFinite(level.remainingAssertions) && <div class={classes.badge}>
						<text ref={this.ref("counter")} /> remaining
					</div>}
				</div>
				<div ref={this.ref("undoButton")} onClick={() => this.handleUndo()} class={[classes.button, classes.lineOnly]}>UNDO</div>
				<div class={classes.spacer} />
				<div ref={this.ref("resetButton")} onClick={() => this.handleReset()} class={[classes.button, classes.lineOnly]}>RESET</div>
				<div onClick={() => this.handleRun()} class={[classes.button, classes.scriptOnly]}>RUN</div>
			</div>
		</div>
	}

	protected onAttach() {
		const level = this.props.level
		level.onOutput = value => this.refs.console.appendChild(<ClipsOutput input={value} />)
		level.reset()
		this.update()
	}

	private clearConsole() {
		const console = this.refs.console
		while (console.lastChild) {
			console.lastChild.remove()
		}
	}

	private clearAlert() {
		if (this._alert) {
			this._alert.destroy()
			this._alert = undefined
		}
	}

	private alert(content: string, type: ComponentProps<Alert>["type"]) {
		this.clearAlert()
		this._alert = new Alert({closable: true, content, type, class: classes.alert})
		this._alert.create(this, null, this.refs.lineInput)
	}
	
	private update() {
		const level = this.props.level
		this.refs.factTable.nodeValue = level.facts || "empty"
		this.refs.undoButton.classList.toggle(classes.disabled, !level.canUndo)
		this.refs.resetButton.classList.toggle(classes.disabled, !level.canUndo)
		const remainingAssertions = level.remainingAssertions
		if (isFinite(remainingAssertions)) {
			this.refs.counter.nodeValue = remainingAssertions.toString()
			this.refs.assertButton.classList.toggle(classes.disabled, remainingAssertions == 0)
		}
		if (level.goalAchieved) {
			const levels = this.props.index
			const next = levels.indexOf(level.name) + 1
			const nextLevelMessage = next < levels.length ? ` Click [here](#level-${levels[next]}) to continue to the next level.` : ""
			this.alert(`**Level cleared!** ${level.definition.winMessage}${nextLevelMessage}`, "success")
			return true
		} else if (remainingAssertions == 0) {
			this.alert(`**Level failed!** No more facts can be asserted and the goal has not been reached.`, "warning")
			return true
		}
		return false
	}

	private displayError(error: Error) {
		if (error instanceof ClipsEvalError) {
			this.alert(`**Evaluation Error!** The input \`${error.message}\` has incorrect syntax.`, "danger")
		} else if (error instanceof InputParseError) {
			this.alert(`**Incorrect Input!** ${error.message}`, "danger")
		} else if (error instanceof ReAssertionError) {
			this.alert(`**Fact reassertion!** The fact \`${error.message}\` is already in the fact table.`, "warning")
		} else if (error instanceof TabuAssertionError) {
			this.alert(`**Restricted fact!** The fact \`${error.message}\` is restricted in this level and can not be asserted.`, "warning")
		} else if (error instanceof AssertionLimitError) {
			this.alert(`**Assertion limit reached!** The fact \`${error.message}\` could not be asserted due to reaching level's assertion limit.`, "warning")
		} else {
			throw error
		}
	}

	private handleAssert() {
		const line = this.refs.lineInput.value
		if (!line) {
			return
		}
		try {
			const fact = parseInput(line)
			if (line.length == 0) {
				// empty
				return
			} else if (fact.length != 1) {
				throw new InputParseError("only single fact allowed, for multiple fact input use script mode")
			}
			this.props.level.assert(fact[0])
			this.refs.lineInput.value = ""
			if (!this.update()) {
				this.alert(`**Fact asserted!** The fact \`${fact[0]}\` has been added to the fact table.`, "info")
			}
			this._populateTextarea = true
		} catch (e) {
			this.displayError(e as Error)
		}
		window.scrollTo(0, document.body.scrollHeight)
	}

	private handleRun() {
		const script = this.refs.scriptInput.value
		if (!script) {
			return
		}
		try {
			this.clearConsole()
			const level = this.props.level
			level.reset()
			const facts = parseInput(script)
			facts.forEach(fact => level.assert(fact))
			if (!this.update()) {
				this.alert(`**Level unsolved!** Provided facts did not solve the level, try again.`, "warning")
			}
		} catch (e) {
			this.update()
			this.displayError(e as Error)
		}
		window.scrollTo(0, document.body.scrollHeight)
	}

	private handleUndo() {
		this.clearConsole()
		const fact = this.props.level.undo()
		this.refs.lineInput.value = fact
		if (!this.update()) {
			this.alert(`**Undo complete!** State before assertion of \`${fact}\` has been restored.`, "info")
		}
		this._populateTextarea = true
		window.scrollTo(0, document.body.scrollHeight)
	}

	private handleReset() {
		this.clearConsole()
		this.refs.lineInput.value = ""
		this.props.level.reset()
		this.update()
		this.alert(`**Reset complete!** Level has been reset to it\'s initial state.`, "info")
		window.scrollTo(0, document.body.scrollHeight)
	}

	private handleModeToggle(mode: boolean) {
		this.root.classList.toggle(classes.lineMode, !mode)
		this.root.classList.toggle(classes.scriptMode, mode)
		if (mode) {
			const assertions = this.props.level.assertions
			if (this._populateTextarea && assertions.length) {
				this.refs.scriptInput.value = assertions.join("\n")
			}
			this._populateTextarea = false
			localStorage.setItem("scriptMode", "1")
		} else {
			localStorage.removeItem("scriptMode")
		}
	}
}

router.register(LevelPage)
