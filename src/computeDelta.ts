import { Commit } from "./pollFileChanges"
import { Issue } from "./listIssues"
import { ICore, Inputs } from "./core"

function matchByShaShort(commit: Commit, issue: Issue) {
    const shaShort = commit.sha.slice(0, 7)
    return issue.title.includes(shaShort)
}

function matchByShaFull(commit: Commit, issue: Issue) {
    return issue.title.includes(commit.sha)
}

function getMatchingStrategy(core: ICore) {
    const strategy = core.getInput("matching-strategy", { required: true }) as Inputs["matching-strategy"]

    switch (strategy) {
        case "sha-short":
            return matchByShaShort
        case "sha-full":
            return matchByShaFull
        default:
            const message = `Unsupported "matching-strategy" input ${strategy} (supported are: sha-short, sha-full)`
            core.setFailed(message)
            return null
    }
}

export function computeDeltaWithCore(core: ICore) {
    const issueMatchesCommit = getMatchingStrategy(core)

    return function computeDelta(commits: Commit[], issues: Issue[]) {
        if (issueMatchesCommit == null) {
            return []
        }

        return commits.filter(commit => {
            const matchingIssueIdx = issues.findIndex(issue => issueMatchesCommit(commit, issue))
            return matchingIssueIdx == -1
        })
    }
}
