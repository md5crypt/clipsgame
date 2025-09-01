import { fileStorage } from "../FileStorage";
import { NavigationError, router } from "../Router";

router.register({
	pattern: /^level-(\d+)$/,
	onNavigate: async (match) => {
		const value = parseInt(match[1]) - 1
		const index = await fileStorage.getJson<string[]>("levels/index.json")
		if (value >= 0 && value < index.length) {
			return "level-" + index[value]
		}
		throw new NavigationError(`**No such level!** Level \`${match[0]}\` does not exist. Go back to [level select](#home).`)
	}
})
