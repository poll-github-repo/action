import { pollCommitsWith } from "./pollCommits"
import { renderIssueTemplatesWith } from "./renderIssueTemplates"
import { getLastSyncDateWith } from "./getLastSyncDate"
import { getLogger } from "./logger"
import { load as loadConfig } from "./config"
import { createTrackingIssuesWith } from "./createTrackingIssues"
import { createSyncCommitWith } from "./createSyncCommit"

async function run() {
    const config = await loadConfig()
    console.log("config = ", config)

    const logger = getLogger()

    const getLastSyncDate = getLastSyncDateWith(config, logger)
    const pollCommits = pollCommitsWith(config, logger)
    const renderIssueTemplates = renderIssueTemplatesWith(config)
    const createTrackingIssues = createTrackingIssuesWith(config, logger)
    const createSyncCommit = createSyncCommitWith(config, logger)

    const lastSyncDate = await getLastSyncDate()

    const commits = await pollCommits({ since: lastSyncDate! })
    console.log(commits)

    const issuesToCreate = renderIssueTemplates(commits)
    issuesToCreate.forEach(({ title, body }) => {
        console.log("=== TITLE")
        console.log(title)
        console.log("=== BODY")
        console.log(body)
    })

    const createdIssues = await createTrackingIssues(issuesToCreate)
    console.log(createdIssues)

    const syncCommit = await createSyncCommit()
    console.log(syncCommit)
}

run()
