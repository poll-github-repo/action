import * as github from "@actions/github"
import { Config } from "./config"
import { Commit } from "./types"
import { Logger } from "./logger"

interface Params {
    since?: string
    per_page?: number
}

export function pollCommitsWith(config: Config, logger: Logger) {
    const token = config.token
    const owner = config.repoToSyncOwner
    const repo = config.repoToSync
    const path = config.repoToSyncPath

    return async function pollFileChanges(params?: Params): Promise<Commit[]> {
        const { since, per_page } = params || {}
        const octokit = github.getOctokit(token)

        const iterator = octokit.paginate.iterator(
            octokit.rest.repos.listCommits,
            {
                owner,
                repo,
                since,
                path,
                per_page
            }
        )
        const result: Commit[] = []

        logger.startGroup(`Pulling commits from ${owner}/${repo} since="${since}", path="${path}"`)
        try {
            for await (const { data } of iterator) {
                logger.info(`Pulled a page with ${data.length} commits`)
                for (const commitData of data) {
                    let commit: Commit = {
                        path,
                        url: commitData.html_url,
                        sha: commitData.sha,
                        message: commitData.commit.message,
                        date: commitData.commit.author?.date || "--unknown-date--"
                    }
                    logger.info(`Extracted commit ${JSON.stringify(commit)}`)
                    result.push(commit)
                }
            }
        } catch (err) {
            logger.setFailed(`Failed to pull data from GitHub: ${err}`)
        }
        logger.endGroup()
        return result
    }
}
