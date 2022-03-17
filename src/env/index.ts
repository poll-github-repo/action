export * from "./types"
import { IEnv } from "./types"

import { getGithubEnv } from "./github"
import { getLocalEnv } from "./local"
import { getGithubCore } from "../core/github"

const githubCore = getGithubCore()

export async function getEnv(): Promise<IEnv> {
    try {
        return getLocalEnv()
    } catch (err) {
        githubCore.warning(`Failed to read local .env.json, using real @github/core: ${err}`)
    }
    return getGithubEnv()
}
