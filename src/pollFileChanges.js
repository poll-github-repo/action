import * as github from '@actions/github';
import * as core from '@actions/core';

export async function pollFileChanges(
    token,
    owner,
    repo,
    path,
    since
) {
    const octokit = github.getOctokit(token);

    const iterator = octokit.paginate.iterator(
        octokit.rest.repos.listCommits,
        {
            owner,
            repo,
            since,
            path
        }
    );
    const result = [];

    core.startGroup(`Pulling commits from ${owner}/${repo} since="${since}", path="${path}"`);
    for await (const { data } of iterator) {
        core.debug(`Pulled a page with ${data.length} commits`);
        for (const commitData of data) {
            let commit = {
                path,
                url: commitData.html_url,
                sha: commitData.sha,
                message: commitData.commit.message,
                date: commitData.commit.author.date
            };
            core.debug(`Extracted commit ${JSON.stringify(commit)}`);
            result.push(commit);
        }
    }
    core.endGroup();
    return result;
}
