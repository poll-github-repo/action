import * as github from "@actions/github"
import { ICore } from "./core"
import { BaseEnv } from "./env"

export function getLastSyncDateWithCore(core: ICore, env: BaseEnv) {
    const token = core.getInput("token", { required: true })
    const owner = env.getOwner()
    const repo = env.getRepo()
    const path = core.getInput("sync-path", { required: true })

    return async function getLastSyncDate() {
        const octokit = github.getOctokit(token)
        const { data } = await octokit.rest.repos.getContent({
            owner,
            repo,
            path
        })
        const content: string | undefined = (data as unknown as { content?: string }).content
        if (!content) {
            console.log(JSON.stringify(data, null, 4))
            core.setFailed(`Failed to read "${path}" file contents`)
            return null
        }
        return Buffer.from(content, "base64").toString("ascii")

    }
}
