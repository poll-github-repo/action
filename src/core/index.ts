export * from "./types"

import { ICore } from "./types"

import { getGithubCore } from "./github"
import { getLocalCore } from "./local"

export enum Mode {
    Github,
    Local,
}

const githubCore = getGithubCore()

export async function getCore(): Promise<ICore> {
    try {
        return await getLocalCore()
    } catch (err) {
        githubCore.warning(`Failed to read local .env.json, using real @github/core: ${err}`)
    }
    return githubCore
}
