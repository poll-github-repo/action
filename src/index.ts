import { pollFileChangesWithCore } from "./pollFileChanges"
import { listIssuesWithCore } from "./listIssues"
import { computeDeltaWithCore } from "./computeDelta"
import { getCore } from "./localOrGithubCore"
import { renderIssueTemplatesWithCore } from "./renderIssueTemplates"

async function run() {
    const core = await getCore()

    const pollFileChanges = pollFileChangesWithCore(core)
    const listIssues = listIssuesWithCore(core)
    const computeDelta = computeDeltaWithCore(core)
    const renderIssueTemplates = renderIssueTemplatesWithCore(core)

    const commits = await pollFileChanges({
        owner: "poll-github-repo",
        repo: "dummy-repo",
        path: "data.txt"
    })
    console.log(commits)

    const issues = await listIssues({
        owner: "poll-github-repo",
        repo: "dummy-repo",
        label: "test-label"
    })
    console.log(issues)

    const delta = computeDelta(commits, issues)
    console.log(delta)

    const rendered = renderIssueTemplates(delta)
    rendered.forEach(({ title, body }) => {
        console.log("=== TITLE")
        console.log(title)
        console.log("=== BODY")
        console.log(body)
    })
}

run()
