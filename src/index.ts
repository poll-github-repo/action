import { pollCommitsWith } from "./pollCommits"
import { renderIssueTemplatesWith } from "./renderIssueTemplates"
import { getLastSyncDateWith } from "./getLastSyncDate"
import { getLogger } from "./logger"
import { load as loadConfig } from "./config"
import { createTrackingIssuesWith } from "./createTrackingIssues"
import { createSyncCommitWith } from "./createSyncCommit"

async function run() {
    const config = await loadConfig()
    const logger = getLogger()

    logger.startGroup("Config")
    logger.debug(JSON.stringify(config, null, 4))
    logger.endGroup()

    const getLastSyncDate = getLastSyncDateWith(config, logger)
    const pollCommits = pollCommitsWith(config, logger)
    const renderIssueTemplates = renderIssueTemplatesWith(config)
    const createTrackingIssues = createTrackingIssuesWith(config, logger)
    const createSyncCommit = createSyncCommitWith(config, logger)

    logger.startGroup("Fetching last sync date")
    const lastSyncDate = (await getLastSyncDate())!.trim()
    logger.debug(`Last sync date is ${lastSyncDate}`)
    logger.endGroup()

    logger.startGroup(`Fetching commits since ${lastSyncDate}`)
    const commits = await pollCommits({ since: lastSyncDate })
    logger.debug(JSON.stringify(commits, null, 4))
    logger.endGroup()

    logger.startGroup("Starting rendering")
    const issuesToCreate = renderIssueTemplates(commits)
    issuesToCreate.forEach(({ title, body }) => {
        logger.debug("=== TITLE")
        logger.debug(title)
        logger.debug("=== BODY")
        logger.debug(body)
    })
    logger.endGroup()

    logger.startGroup("Creating tracking issues")
    const createdIssues = await createTrackingIssues(issuesToCreate)
    logger.debug(`Created issues:`)
    logger.debug(JSON.stringify(createdIssues, null, 4))
    logger.endGroup()

    logger.startGroup("Saving last sync date")
    const syncCommitUrl = await createSyncCommit()
    logger.debug(`Created commit ${syncCommitUrl}`)
    logger.endGroup()

}

run()
