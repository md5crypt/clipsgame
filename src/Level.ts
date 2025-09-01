import { Clips } from "./Clips"

export interface LevelDefinition {
	/** title displayed in the header */
	title: string

	/** description / flavor text, markdown enabled */
	description: string

	/** goal description, markdown enabled, markdown enabled */
	goalDescription: string

	/** message displayed after completing the level, markdown enabled */
	winMessage: string

	/**
	 * the fact / facts needed to complete the game
	 * facts need to be given with ( ) and exactly one space
	 * between words
	 */
	goal: string | string[]

	/**
	 * array of restricted facts
	 * - facts need to be given with ( ) and exactly one space
	 * between words
	 * - ? can be used instead of a word to match all words
	 * - | can be used to create word union
	 * example: (foo bar|baz)
	 */
	tabu?: string[]

	/** amount of allowed assertions, omit or set to -1 for not restriction */
	limit?: number
}

export class ClipsEvalError extends Error {
}

export class ReAssertionError extends Error {
}

export class TabuAssertionError extends Error {
}

export class AssertionLimitError extends Error {
}

export class Level {
	private static parseTabuRule(rule: string) {
		const processed = rule.replace(/([()])/g, "\\$1")
			.replace(/\?/g, "[^\\s()]+")
			.replace(/((?:[\w-]+\s*\|\s*)+[\w-]+)/g, "\(?:$1\)")
		return new RegExp("^" + processed + "$")
	}

	private _tabu: RegExp[]
	private _facts: Set<string>
	private _assertions: string[]
	private _limit: number
	private _factsString: string

	public readonly name: string
	public readonly script: string
	public readonly definition: LevelDefinition
	public readonly clips: Clips
	public onOutput = (value: string) => {}

	constructor(clips: Clips, name: string, definition: LevelDefinition, script: string) {
		this.name = name
		this.definition = definition
		this.clips = clips
		this.script = script
		this._tabu = definition.tabu?.map(Level.parseTabuRule) || []
		this._facts = new Set()
		this._assertions = []
		this._limit = (definition.limit === undefined || definition.limit == -1) ? Infinity : definition.limit
		this._factsString = ""
	}

	private eval(...commands: string[]) {
		const buffer = [] as string[]
		for (const command of commands) {
			buffer.push(`CLIPS> ${command}\n`)
			if (!this.clips.command(command)) {
				buffer.push(this.clips.flush())
				this.onOutput(buffer.join(""))
				throw new ClipsEvalError(command)
			}
			buffer.push(this.clips.flush())
		}
		this.onOutput(buffer.join(""))
	}

	private run(value: string) {
		this.eval(
			`(assert ${value})`,
			"(run)"
		)
	}

	private readFacts() {
		this.clips.command("(facts)")
		const output = this.clips.flush()
		this._factsString = output
		const facts = this._facts
		facts.clear()
		const re = /[(][^)]+[)]/g
		while (true) {
			const match = re.exec(output)
			if (!match) {
				break
			}
			facts.add(match[0])
		}
	}

	public assert(assertion: string) {
		if (this._tabu.find(tabu => tabu.test(assertion))) {
			throw new TabuAssertionError(assertion)
		}
		if (this._facts.has(assertion)) {
			throw new ReAssertionError(assertion)
		}
		if (this._assertions.length >= this._limit) {
			throw new AssertionLimitError(assertion)
		}
		this._assertions.push(assertion)
		this.run(assertion)
		this.readFacts()
	}

	public undo() {
		const fact = this._assertions.pop()!
		this.reset(false)
		return fact
	}

	public reset(clear = true) {
		this.clips.setFile(this.script)
		this.clips.flush()
		this.eval(
			"(clear)",
			"(watch compilations)",
			"(watch facts)",
			"(watch activations)",
			"(watch rules)",
			`(load ${this.name}.clp)`
		)
		this.clips.flush()
		this.eval("(reset)", "(run)")
		if (clear) {
			this._assertions = []
		} else {
			for (const assertion of this._assertions) {
				this.run(assertion)
			}
		}
		this.readFacts()
	}

	public get canUndo() {
		return this._assertions.length > 0
	}

	public get remainingAssertions() {
		return this._limit - this._assertions.length
	}

	public get goalAchieved() {
		const goal = this.definition.goal
		if (Array.isArray(goal)) {
			return goal.every(fact => this._facts.has(fact))
		} else {
			return this._facts.has(goal)
		}
	}

	public get facts() {
		return this._factsString
	}

	public get assertions() {
		return this._assertions
	}
}
