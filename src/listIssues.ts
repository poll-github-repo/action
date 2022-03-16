import * as github from "@actions/github"
import { ICore } from "./localOrGithubCore"

interface Params {
    owner: string
    repo: string
    label: string
    since?: string
    per_page?: number
}

export interface Issue {
    number: number
    title: string
    url: string
    labels: string[]
    state: string
    createdAt: string
}

export function listIssuesWithCore(core: ICore) {
    const token = core.getInput("token", { required: true })

    return async function listIssues(params: Params): Promise<Issue[]> {
        const { owner, repo, label, per_page, since } = params
        const octokit = github.getOctokit(token)

        const iterator = octokit.paginate.iterator(
            octokit.rest.issues.listForRepo,
            {
                owner,
                repo,
                labels: label,
                per_page,
                since
            }
        )

        const result: Issue[] = []

        core.startGroup(`Pulling issues from ${owner}/${repo} with label "${label}"`)
        try {
            for await (const { data } of iterator) {
                core.debug(`Pulled a page with ${data.length} issues`)
                for (const issueData of data) {
                    let issue: Issue = {
                        number: issueData.number,
                        title: issueData.title,
                        url: issueData.html_url,
                        labels: issueData.labels.map(label => {
                            if (typeof (label) === "string") {
                                return label
                            } else {
                                return label.name || "--unknown--"
                            }
                        }),
                        state: issueData.state,
                        createdAt: issueData.created_at
                    }
                    core.debug(`Extracted issue ${JSON.stringify(issue)}`)
                    result.push(issue)
                }
            }
        } catch (err) {
            core.setFailed(`Failed to pull data from GitHub: ${err}`)
        }
        core.endGroup()

        return result
    }
}
