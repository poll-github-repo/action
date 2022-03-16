import { Commit } from "./pollFileChanges"
import { Issue } from "./listIssues"
import { ICore } from "./localOrGithubCore"

type MatchFn = (commit: Commit, issue: Issue) => boolean

function matchByShaShort(commit: Commit, issue: Issue): boolean {
    const shaShort = commit.sha.slice(0, 7)
    return issue.title.includes(shaShort)
}

function matchByShaFull(commit: Commit, issue: Issue): boolean {
    return issue.title.includes(commit.sha)
}

function getMatchingStrategy(core: ICore): MatchFn {
    const strategy = core.getInput("matching-strategy", { required: true })

    switch (strategy) {
        case "sha-short":
            return matchByShaShort
        case "sha-long":
            return matchByShaFull
        default:
            const message = `Unsupported "matching-strategy" input ${strategy} (supported are: sha-short, sha-full)`;
            core.setFailed(message)
            throw new Error(message)
    }
}

export function computeDeltaWithCore(core: ICore) {
    const issueMatchesCommit = getMatchingStrategy(core)

    return function computeDelta(commits: Commit[], issues: Issue[]): Commit[] {
        return commits.filter(commit => {
            const matchingIssueIdx = issues.findIndex(issue => issueMatchesCommit(commit, issue))
            return matchingIssueIdx != -1
        })
    }
}
