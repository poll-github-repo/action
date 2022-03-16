import { Core as CommitsCore } from "../src/pollFileChanges"
import { Core as IssuesCore } from "../src/listIssues"

export default class DummyGithubCore implements CommitsCore, IssuesCore {
    messages: string[] = []

    startGroup(message: string) {
        this.messages.push(`startGroup: ${message}`)
    }

    endGroup() {
        this.messages.push(`endGroup`)
    }

    debug(message: string) {
        this.messages.push(`debug: ${message}`)
    }

    setFailed(message: string) {
        this.messages.push(`setFaled: ${message}`)
    }
}
