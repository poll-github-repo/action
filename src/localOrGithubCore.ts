import * as githubCore from "@actions/core"
import * as fs from "fs/promises"
import * as path from "path"

export interface ICore {
    startGroup(name: string): void
    debug(message: string): void
    setFailed(message: string): void
    endGroup(): void
    getInput(name: InputKey, options?: { required?: boolean }): string
}

export interface LocalConfig {
    inputs: {
        "matching-strategy": "sha-short" | "sha-full"
        token: string
    }
}
export type InputKey = keyof LocalConfig["inputs"]
export type MatchingStrategy = LocalConfig["inputs"]["matching-strategy"]

class LocalCore implements ICore {
    config: LocalConfig

    constructor(config: LocalConfig) {
        this.config = config
    }

    // Proxy logging methods
    startGroup(name: string): void {
        githubCore.startGroup(name)
    }
    debug(message: string): void {
        githubCore.startGroup(message)
    }
    setFailed(message: string): void {
        githubCore.setFailed(message)
    }
    endGroup(): void {
        githubCore.endGroup()
    }

    // And override inputs based on a local config
    getInput(name: InputKey, options?: { required?: boolean }): string {
        const value = this.config.inputs[name]
        if (typeof (value) === "undefined" && options && options.required) {
            throw new Error(`Input required and not supplied: ${name}`)
        }
        return value
    }
}

export async function getLocalCore(): Promise<ICore> {
    const configPath = path.join(__dirname, "..", ".env.json")
    const rawConfig = await fs.readFile(configPath)
    const config = JSON.parse(rawConfig.toString()) as LocalConfig
    return new LocalCore(config)
}

export async function getCore(): Promise<ICore> {
    try {
        return await getLocalCore()
    } catch (err) {
        githubCore.warning(`Failed to read local .env.json, using real @github/core: ${err}`)
    }
    return githubCore
}
