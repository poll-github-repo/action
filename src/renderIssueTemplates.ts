import { Commit, IssueToCreate } from "./types"
import { Config } from "./config"

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

export function renderIssueTemplatesWith(config: Config) {
    const titleTemplate = config.trackingIssueTemplateTitle
    const bodyTemplate = config.trackingIssueTemplateBody

    return function renderIssueTemplates(commits: Commit[]): IssueToCreate[] {
        return commits.map(commit => ({
            title: render(titleTemplate!, commit),
            body: render(bodyTemplate!.join("\n"), commit),
        }))
    }
}
