export * from "./base"
import { BaseEnv } from "./base"

import { getGithubEnv } from "./github"
import { getLocalEnv } from "./local"
import { getGithubCore } from "../core/github"

const githubCore = getGithubCore()

export async function getEnv(): Promise<BaseEnv> {
    try {
        return getLocalEnv()
    } catch (err) {
        githubCore.warning(`Failed to read local .env.json, using ENV variables: ${err}`)
    }
    return getGithubEnv()
}
