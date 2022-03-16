import { ICore, Inputs } from "../src/core/types"
import { getLocalCore } from "../src/core/local"

interface ITestCore extends ICore {
    getMessages(): string[]
}

export type InputOverrides = Partial<Inputs>

export class TestCore implements ITestCore {
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
    warning(message: string) {
        this.messages.push(`warning: ${message}`)
    }
    setFailed(message: string) {
        this.messages.push(`setFaled: ${message}`)
    }
    getMessages(): string[] {
        return this.messages
    }

    // Support overriding inputs from inputOverrides passed to constructor
    // If no override specified fallback to JSON config
    getInput(name: keyof Inputs, options?: { required?: boolean }): string {
        if (this.inputOverrides) {
            const override = this.inputOverrides[name]
            if (override) {
                return override
            }
        }
        return this.localCore.getInput(name, options)
    }
}

export async function getTestCore(overrides?: InputOverrides): Promise<ITestCore> {
    const localCore = await getLocalCore()
    if (localCore == undefined) {
        throw new Error("Failed to run tests without .env.json file")
    }
    return new TestCore(localCore, overrides)
}
