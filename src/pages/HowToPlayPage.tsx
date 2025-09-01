import { Component } from "stagnate"
import { Markdown } from "../components/Markdown"
import { fileStorage } from "../FileStorage"
import { router } from "../Router"
import { BackButton } from "../components/BackButton"

interface Props {
	content: string
}

class HowToPlayPage extends Component<{}, Props> {
	public static pattern = /^how-to-play$/

	public static async onNavigate() {
		return new HowToPlayPage({content: await fileStorage.getString("howtoplay.md")})
	}

	protected render() {
		return <div>
			<Markdown content={this.props.content} />
		</div>
	}

	protected onRender() {
		const node = this.root.firstChild
		if (node) {
			node.insertBefore(<BackButton />, node.firstChild)
		}
	}
}

router.register(HowToPlayPage)
