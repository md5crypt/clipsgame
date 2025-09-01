import { MdNode, MdNodeType, mdParse } from "micromd"
import { ClipsCode } from "./ClipsCode"
import {
	BlockQuote,
	CodeBlock,
	CodeSpan,
	Header,
	HLine,
	Link,
	List,
	Paragraph,
	Strong
} from "./typography"
import { BackButton } from "./BackButton"

interface Props {
	content: string
	inline?: boolean
}

function renderTree(node: MdNode | undefined, parent: Node) {
	while (node) {
		renderNode(node, parent)
		node = node.next
	}
}

function renderNode(node: MdNode, parent: Node) {
	function add(element: Node) {
		parent.appendChild(element)
		renderTree(node.tree, element)
	}
	switch (node.type) {
		case MdNodeType.TEXT:
			add(<text>{node.value}</text>)
			break
		case MdNodeType.LINE_BREAK:
			add(<br/>)
			break
		case MdNodeType.HORIZONTAL_LINE:
			add(<HLine />)
			break
		case MdNodeType.PARAGRAPH:
			add(<Paragraph />)
			break
		case MdNodeType.BOLD:
			add(<Strong />)
			break
		case MdNodeType.ITALIC:
			add(<em />)
			break
		case MdNodeType.BOLD_ITALIC:
			parent.appendChild(<em><strong ref={x => renderTree(node.tree, x)} /></em>)
			break
		case MdNodeType.STRIKETHROUGH:
			add(<del />)
			break
		case MdNodeType.BLOCKQUOTE:
			add(<BlockQuote />)
			break
		case MdNodeType.CODE:
			add(<CodeSpan text={node.value} />)
			break
		case MdNodeType.CODE_BLOCK:
			add(<CodeBlock>{node.lang == "clips" ? <ClipsCode code={node.value} /> : node.value}</CodeBlock>)
			break
		case MdNodeType.HEADER:
			add(<Header level={node.level} />)
			break
		case MdNodeType.LIST:
			add(<List start={node.start} />)
			break
		case MdNodeType.LIST_ITEM:
			add(<li />)
			break
		case MdNodeType.LINK:
			add(<Link href={node.href} />)
			break
		case MdNodeType.IMAGE:
			add(<img alt={node.alt} src={node.src} />)
			break
	}
}

export function Markdown(props: Props) {
	const accumulator = document.createDocumentFragment()
	if (props.inline) {
		renderTree(mdParse(props.content, {inline: true}), accumulator)
	} else {
		mdParse(props.content, {stream: x => renderNode(x, accumulator)})
	}
	return accumulator
}
