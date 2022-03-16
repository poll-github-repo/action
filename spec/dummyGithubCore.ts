import { ICore, getLocalCore, InputKey, LocalConfig } from "../src/localOrGithubCore"

export type InputOverrides = Partial<LocalConfig["inputs"]>

interface IDummyCore extends ICore {
    getMessages(): string[]
}

export class DummyGithubCore implements IDummyCore {
    messages: string[] = []
    localCore: ICore
    inputOverrides?: InputOverrides

    constructor(localCore: ICore, inputOverrides?: InputOverrides) {
        this.localCore = localCore
        this.inputOverrides = inputOverrides
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

    setFailed(message: string) {
        this.messages.push(`setFaled: ${message}`)
    }

    getMessages(): string[] {
        return this.messages
    }

    // Support overriding inputs from inputOverrides passed to constructor
    // If no override specified fallback to JSON config
    getInput(name: InputKey, options?: { required?: boolean }): string {
        if (this.inputOverrides) {
            const override = this.inputOverrides[name]
            if (override) {
                return override
            }
        }
        return this.localCore.getInput(name, options)
    }
}

export async function getDummyGithubCore(overrides?: InputOverrides): Promise<IDummyCore> {
    const localCore = await getLocalCore()
    if (localCore == undefined) {
        throw new Error("Failed to run tests without .env.json file")
    }
    return new DummyGithubCore(localCore, overrides)
}
