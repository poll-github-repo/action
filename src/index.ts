import { getCore } from "./core"

import { pollFileChangesWithCore } from "./pollFileChanges"
import { listIssuesWithCore } from "./listIssues"
import { computeDeltaWithCore } from "./computeDelta"
import { renderIssueTemplatesWithCore } from "./renderIssueTemplates"
import { getEnv } from "./env"

async function run() {
    const core = await getCore()
    const env = await getEnv()
    console.log("Env = ", env)

    const pollFileChanges = pollFileChangesWithCore(core)
    const listIssues = listIssuesWithCore(core, env)
    const computeDelta = computeDeltaWithCore(core)
    const renderIssueTemplates = renderIssueTemplatesWithCore(core)

    const commits = await pollFileChanges({})
    console.log(commits)

    const issues = await listIssues()
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
