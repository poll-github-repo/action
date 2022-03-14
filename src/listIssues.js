const github = require('@actions/github')

function listIssues(core) {
    return async function ({ token, owner, repo, label, per_page, since }) {
        const octokit = github.getOctokit(token)

        const iterator = octokit.paginate.iterator(
            octokit.rest.issues.listForRepo,
            {
                owner,
                repo,
                labels: [label],
                per_page,
                since
            }
        )

        const result = []

        core.startGroup(`Pulling issues from ${owner}/${repo} with label "${label}"`)
        try {
            for await (const { data } of iterator) {
                core.debug(`Pulled a page with ${data.length} issues`)
                for (const issueData of data) {
                    let issue = {
                        number: issueData.number,
                        url: issueData.html_url,
                        labels: issueData.labels.map(label => label.name),
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

module.exports = listIssues
