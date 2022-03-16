import { Commit } from "./pollFileChanges"
import { ICore } from "./core"

export interface IssueToCreate {
    title: string
    body: string
}

const PATTERNS = new Map<string, (commit: Commit) => string>()
PATTERNS.set("path", (commit) => commit.path)
PATTERNS.set("sha-short", (commit) => commit.sha.slice(0, 7))
PATTERNS.set("sha-full", (commit) => commit.sha)
PATTERNS.set("message", (commit) => commit.message)
PATTERNS.set("commit-date", (commit) => commit.date)
PATTERNS.set("url", (commit) => commit.url)

function render(template: string, commit: Commit) {
    for (const pattern of PATTERNS.keys()) {
        const fn = PATTERNS.get(pattern)!
        template = template.replace(new RegExp(`{{ ${pattern} }}`, "g"), fn(commit))
    }
    return template
}

export function renderIssueTemplatesWithCore(core: ICore) {
    const titleTemplate = core.getInput("tracking-issue-title", { required: true })
    const bodyTemplate = core.getInput("tracking-issue-body", { required: true })

    return function renderIssueTemplates(commits: Commit[]) {
        return commits.map(commit => ({
            title: render(titleTemplate, commit),
            body: render(bodyTemplate, commit),
        }))
    }
}
