import * as path from "path"
import * as fs from "fs"
import { ICore, Inputs } from "./types"
import { getGithubCore } from "./github"

export interface LocalConfig {
    inputs: Inputs
}

class LocalCore implements ICore {
    githubCore: ICore
    config: LocalConfig

    constructor(config: LocalConfig) {
        this.githubCore = getGithubCore()
        this.config = config
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
        const value = this.config.inputs[name]
        if (typeof (value) === "undefined" && options && options.required) {
            throw new Error(`Input required and not supplied: ${name}`)
        }
        return value
    }
}

export async function getLocalCore(): Promise<ICore> {
    const configPath = path.join(__dirname, "..", "..", ".env.json")
    const rawConfig = await fs.promises.readFile(configPath)
    const config = JSON.parse(rawConfig.toString()) as LocalConfig
    return new LocalCore(config)
}
