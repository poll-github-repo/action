import { LocalConfig } from "../localConfig"
import { ICore } from "./types"
import { Inputs } from "../localConfig"
import { getGithubCore } from "./github"

class LocalCore implements ICore {
    githubCore: ICore
    inputs: LocalConfig["inputs"]

    constructor(inputs: LocalConfig["inputs"]) {
        this.githubCore = getGithubCore()
        this.inputs = inputs
    }

    // Proxy logging methods
    startGroup(name: string): void {
        this.githubCore.startGroup(name)
    }
    debug(message: string): void {
        this.githubCore.debug(message)
    }
    warning(message: string): void {
        this.githubCore.warning(message)
    }
    setFailed(message: string): void {
        this.githubCore.setFailed(message)
    }
    endGroup(): void {
        this.githubCore.endGroup()
    }

    // And override inputs based on a local config
    getInput(name: keyof Inputs, options?: { required?: boolean }): string {
        const value = this.inputs[name]
        if (typeof (value) === "undefined" && options && options.required) {
            throw new Error(`Input required and not supplied: ${name}`)
        }
        return value
    }
}

export async function getLocalCore(): Promise<ICore> {
    const localConfig = await LocalConfig.read()
    return new LocalCore(localConfig.inputs)
}
