import { Config } from "../src/config"

export const testConfig: Config = {
    token: process.env["GITHUB_TOKEN"]!,
    currentRepoOwner: "poll-github-repo",
    currentRepo: "dummy-source-repo",
    currentRepoCachePath: "sync/.data.txt.last-sync",
    currentRepoLabelToAdd: "test-label",
    repoToSyncOwner: "poll-github-repo",
    repoToSync: "dummy-source-repo",
    repoToSyncPath: "data.txt",
    trackingIssueTemplateTitle: "Tracking issue for {{ path }}: {{ sha-short }}",
    trackingIssueTemplateBody: [
        "URL: [{{ message }}]({{ url }})",
        "Commit date: {{ commit-date }}",
        "Full SHA: {{ sha-full }}"
    ],
    yesCreateIssues: true
}
