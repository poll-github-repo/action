class DummyGithubCore {
    constructor() {
        this.messages = []
    }

    startGroup(message) {
        this.messages.push(`startGroup: ${message}`)
    }

    endGroup() {
        this.messages.push(`endGroup`)
    }

    debug(message) {
        this.messages.push(`debug: ${message}`)
    }

    setFailed(message) {
        this.messages.push(`setFaled: ${message}`)
    }
}

module.exports = DummyGithubCore
