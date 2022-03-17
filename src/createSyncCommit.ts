import * as github from "@actions/github"
import { Config } from "./config"
import { Logger } from "./logger"

export function createSyncCommitWith(config: Config, logger: Logger) {
    const token = config.token
    const owner = config.currentRepoOwner
    const repo = config.currentRepo
    const cachePath = config.currentRepoCachePath
    const yesCreateIssues = config.yesCreateIssues

    return async function createSyncCommit(): Promise<string | undefined> {
        if (!yesCreateIssues) {
            logger.debug(`Skipping updating ${cachePath} because yesCreateIssues is set to false`)
            return undefined
        }

        const content = new Date().toISOString()
        const octokit = github.getOctokit(token)

        const { data } = await octokit.rest.repos.getContent({
            owner,
            repo,
            path: cachePath
        })
        const sha = (data as { sha: string }).sha

        const { data: { commit } } = await octokit.rest.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: cachePath,
            content: Buffer.from(content).toString("base64"),
            sha,
            message: `sync: update ${cachePath}`
        })

        return commit.html_url
    }
}
