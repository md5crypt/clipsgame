import "./errorHandler"
import { flushStyles } from "./createStyles"
import { RootComponent } from "./components/RootComponent"

flushStyles()

const rootComponent = new RootComponent()
rootComponent.createOrphanized(document.body)
