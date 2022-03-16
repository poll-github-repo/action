import { pollFileChangesWithCore } from "./pollFileChanges"
import { listIssuesWithCore } from "./listIssues"
import { computeDeltaWithCore } from "./computeDelta"
import { getCore } from "./localOrGithubCore"

async function run() {
    const core = await getCore()

    const pollFileChanges = pollFileChangesWithCore(core)
    const listIssues = listIssuesWithCore(core)
    const computeDelta = computeDeltaWithCore(core)

    const commits = await pollFileChanges({
        owner: "poll-github-repo",
        repo: "dummy-repo",
        path: "data.txt"
    })
    const issues = await listIssues({
        owner: "poll-github-repo",
        repo: "dummy-repo",
        label: "test-label"
    })

    console.log(commits)
    console.log(issues)
    const delta = computeDelta(commits, issues)
    console.log(delta)
}

run()
