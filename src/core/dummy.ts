import { ICore, Inputs } from "./types"
import { getLocalCore } from "./local"

const messagesRegistry = new Map<ICore, string[]>()
export function getMessages(core: ICore): string[] {
    if (!messagesRegistry.has(core)) {
        messagesRegistry.set(core, [])
    }
    return messagesRegistry.get(core)!
}

export type InputOverrides = Partial<Inputs>

export class TestCore implements ICore {
    localCore: ICore
    inputOverrides?: InputOverrides

    constructor(localCore: ICore, inputOverrides?: InputOverrides) {
        this.localCore = localCore
        this.inputOverrides = inputOverrides
    }

    // Record logging to run assertions against it
    startGroup(message: string) {
        getMessages(this).push(`startGroup: ${message}`)
    }
    endGroup() {
        getMessages(this).push(`endGroup`)
    }
    debug(message: string) {
        getMessages(this).push(`debug: ${message}`)
    }
    warning(message: string) {
        getMessages(this).push(`warning: ${message}`)
    }
    setFailed(message: string) {
        getMessages(this).push(`setFaled: ${message}`)
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

export async function getTestCore(overrides?: InputOverrides): Promise<ICore> {
    const localCore = await getLocalCore()
    if (localCore == undefined) {
        throw new Error("Failed to run tests without .env.json file")
    }
    return new TestCore(localCore, overrides)
}
