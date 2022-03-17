import { pollCommitsWith } from "./pollCommits"
import { renderIssueTemplatesWith } from "./renderIssueTemplates"
import { getLastSyncDateWith } from "./getLastSyncDate"
import { getLogger } from "./logger"
import { load as loadConfig } from "./config"

async function run() {
    const config = await loadConfig()
    console.log("config = ", config)

    const logger = getLogger()

    const getLastSyncDate = getLastSyncDateWith(config, logger)
    const pollCommits = pollCommitsWith(config, logger)
    const renderIssueTemplates = renderIssueTemplatesWith(config)

    const lastSyncDate = await getLastSyncDate()

    const commits = await pollCommits({
        since: lastSyncDate!
    })
    console.log(commits)

    const rendered = renderIssueTemplates(commits)
    rendered.forEach(({ title, body }) => {
        console.log("=== TITLE")
        console.log(title)
        console.log("=== BODY")
        console.log(body)
    })
}

run()
