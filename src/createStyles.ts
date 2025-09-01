import { Jss, JssRuleSet } from "kiss-jss"

import UniqueIdGen from "kiss-jss/lib/UniqueIdGen"
import defaultUnits from "kiss-jss/lib/defaultUnits"

const instance = new Jss({
	idGen: UniqueIdGen.create(),
	defaultUnits,
	prefixedKeys: [
		"user-select",
		"tab-size"
	]
})

export function createStyles<T extends string>(styles: JssRuleSet<T>, sheet?: string) {
	return instance.buffer(styles, sheet)
}

export function flushStyles() {
	instance.flush()
}

instance.buffer({
	$smallScreen: {},
})

export default createStyles
