import { NavigationError, router } from "../Router"

const legacyLevels = [
	"tiger",
	"bow",
	"life",
	"wife",
	"traveler",
	"tea",
	"athena"
]

router.register({
	pattern: /^level-(\d+)$/,
	onNavigate: async (match) => {
		const value = parseInt(match[1]) - 1
		if (value >= 0 && value < legacyLevels.length) {
			return "level-" + legacyLevels[value]
		}
		throw new NavigationError(`**No such level!** Level \`${match[0]}\` does not exist. Go back to [level select](#home).`)
	}
})
