import { Component, StagnateNode } from "stagnate"
import { fileStorage } from "../FileStorage"
import { router } from "../Router"
import { Header, Paragraph, Link, Strong } from "../components/typography"
import createStyles from "../createStyles"

const classes = createStyles({
	menuLink: {
		display: "flex",
		flexDirection: "row",
		fontSize: 24,
		alignContent: "center",
		marginBottom: 2,
		"& svg": {
			width: 14,
			opacity: 0.4,
			marginRight: 20
		}
	}
}, __MODULE_NAME)

function MenuLink(props: {href: string, children: StagnateNode}) {
	return <div class={classes.menuLink}>
		<svg viewBox="0 0 14 14">
			<svg:path d="M3.404 2.051 8.354 7l-4.95 4.95 2.121 2.12L12.596 7 5.525-.071z"/>
		</svg>
		<Link href={props.href}>{props.children}</Link>
	</div>
}

interface Props {
	index: string[]
}

class IndexPage extends Component<{}, Props> {
	public static pattern = /.*/

	public static async onNavigate() {
		return new IndexPage({index: await fileStorage.getJson("levels/index.json")})
	}

	protected render() {
		return <div>
			<Header level={1} text="Clips the Game" />
			<Paragraph>
				A demanding logic game based on the <Link text="clips rule engine" href="http://www.clipsrules.net/"/>.
			</Paragraph>
			<Header level={2} text="Level Select" />
			<MenuLink href="#how-to-play">How to Play</MenuLink>
			{this.props.index.map((x, i) => <MenuLink href={`#level-${x}`}>
				<Strong text={`Level ${i + 1}`} />: <em>{`${x}.clp`}</em>
			</MenuLink>)}
		</div>
	}
}

router.register(IndexPage)
