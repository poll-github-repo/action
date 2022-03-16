export default class DummyGithubCore {
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
