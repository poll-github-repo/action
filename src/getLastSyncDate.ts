import * as github from "@actions/github"
import { Config } from "./config"
import { Logger } from "./logger"

export function getLastSyncDateWith(config: Config, logger: Logger) {
    const token = config.token
    const owner = config.currentRepoOwner
    const repo = config.currentRepo
    const cachePath = config.currentRepoCachePath

    return async function getLastSyncDate() {
        const octokit = github.getOctokit(token)
        const { data } = await octokit.rest.repos.getContent({
            owner,
            repo,
            path: cachePath
        })
        const content: string | undefined = (data as unknown as { content?: string }).content
        if (!content) {
            logger.info(JSON.stringify(data, null, 4))
            logger.setFailed(`Failed to read "${cachePath}" file contents`)
            return null
        }
        return Buffer.from(content, "base64").toString("ascii")
    }
}
