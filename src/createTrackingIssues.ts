import * as github from "@actions/github"
import { Config } from "./config"
import { Logger } from "./logger"
import { IssueToCreate, CreatedIssue } from "./types"

export function createTrackingIssuesWith(config: Config, logger: Logger) {
    const token = config.token
    const owner = config.currentRepoOwner
    const repo = config.currentRepo
    const label = config.currentRepoLabelToAdd!
    const yesCreateIssues = config.yesCreateIssues

    return async function createTrackingIssues(issuesToCreate: IssueToCreate[]): Promise<CreatedIssue[]> {
        const octokit = github.getOctokit(token)

        const createdIssues: CreatedIssue[] = []
        for (const issueToCreate of issuesToCreate) {
            const createIssueParams = {
                owner,
                repo,
                title: issueToCreate.title,
                body: issueToCreate.body,
                labels: [label]
            }
            logger.info(`=> Creating issue with params ${JSON.stringify(createIssueParams)}`)

            if (yesCreateIssues) {
                const { data: issue } = await octokit.rest.issues.create(createIssueParams)
                logger.info(`<= Created issue ${JSON.stringify(issue)}`)
                createdIssues.push({
                    number: issue.number,
                    url: issue.html_url
                })
            } else {
                logger.info("<= Skipping creating, yesCreateIssues is set to false")
            }
        }
        return createdIssues
    }
}
