const github = require('@actions/github')

function pollFileChanges(core) {
    return async function ({ token, owner, repo, path, since, per_page }) {
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
        const result = []

        core.startGroup(`Pulling commits from ${owner}/${repo} since="${since}", path="${path}"`)
        try {
            for await (const { data } of iterator) {
                core.debug(`Pulled a page with ${data.length} commits`)
                for (const commitData of data) {
                    let commit = {
                        path,
                        url: commitData.html_url,
                        sha: commitData.sha,
                        message: commitData.commit.message,
                        date: commitData.commit.author.date
                    }
                    core.debug(`Extracted commit ${JSON.stringify(commit)}`)
                    result.push(commit)
                }
            }
        } catch (err) {
            core.setFailed(`Failed to pull data from GitHub: ${err}`)
        }
        core.endGroup()
        return result
    }
}

module.exports = pollFileChanges
