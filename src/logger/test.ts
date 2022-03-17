import { Logger } from "."

export class TestLogger implements Logger {
    messages: string[]

    constructor() {
        this.messages = []
    }

    // Record logging to run assertions against it
    startGroup(message: string) {
        this.messages.push(`startGroup: ${message}`)
    }
    endGroup() {
        this.messages.push(`endGroup`)
    }
    debug(message: string) {
        this.messages.push(`debug: ${message}`)
    }
    warning(message: string) {
        this.messages.push(`warning: ${message}`)
    }
    setFailed(message: string) {
        this.messages.push(`setFaled: ${message}`)
    }

    getMessages(): string[] {
        return this.messages
    }
}
