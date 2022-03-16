import * as core from "@actions/core"
import { pollFileChangesWithCore } from "./pollFileChanges"
import { listIssuesWithCore } from "./listIssues"
import computeDelta from "./computeDelta"

import { GH_TOKEN } from "../.env.json"

async function run() {
    const commits = await pollFileChangesWithCore(core)({
        token: GH_TOKEN,
        owner: "poll-github-repo",
        repo: "dummy-repo",
        path: "data.txt"
    })
    const issues = await listIssuesWithCore(core)({
        token: GH_TOKEN,
        owner: "poll-github-repo",
        repo: "dummy-repo",
        label: "test-label"
    })

    const delta = computeDelta(commits, issues)
    console.log(delta)
}

run()
