import { pollCommitsWith } from "./pollCommits"
import { renderIssueTemplatesWith } from "./renderIssueTemplates"
import { getLastSyncDateWith } from "./getLastSyncDate"
import { getLogger, Logger } from "./logger"
import { Config, load as loadConfig } from "./config"
import { createTrackingIssuesWith } from "./createTrackingIssues"
import { createSyncCommitWith } from "./createSyncCommit"
import { setActionOutput } from "./setActionOutput";
import { Commit } from "./types";

async function run() {
    const config = await loadConfig()
    const logger = getLogger()

    logger.startGroup("Config")
    logger.info(JSON.stringify(config, null, 4))
    logger.endGroup()

    const getLastSyncDate = getLastSyncDateWith(config, logger)
    const pollCommits = pollCommitsWith(config, logger)
    const createSyncCommit = createSyncCommitWith(config, logger)

    logger.startGroup("Fetching last sync date")
    let maybeLastSyncDate = await getLastSyncDate()
    if (!maybeLastSyncDate) {
        logger.setFailed(`Failed to pull sync date from "${config.repoToSyncPath}" file. Does it exist?`)
    }
    const lastSyncDate = maybeLastSyncDate!.trim()
    logger.info(`Last sync date is ${lastSyncDate}`)
    logger.endGroup()

    logger.startGroup(`Fetching commits since ${lastSyncDate}`)
    const commits = await pollCommits({ since: lastSyncDate })
    logger.info(JSON.stringify(commits, null, 4))
    logger.endGroup()

    const createdIssues = config.yesCreateIssues ? await createIssues(config, logger, commits) : [];

    logger.startGroup("Saving last sync date")
    const syncCommitUrl = await createSyncCommit()
    logger.info(`Created commit ${syncCommitUrl}`)
    logger.endGroup()

    logger.startGroup("Starting output creation")
    const actionOutput = setActionOutput(createdIssues, commits)
    logger.info(`Set action output: ${JSON.stringify(actionOutput, null, 4)}`)
    logger.endGroup()
}

async function createIssues(config: Config, logger: Logger, commits: Commit[]) {
    logger.startGroup("Starting rendering")
    const renderIssueTemplates = renderIssueTemplatesWith(config)

    const issuesToCreate = renderIssueTemplates(commits)
    issuesToCreate.forEach(({ title, body }) => {
        logger.info("=== TITLE")
        logger.info(title)
        logger.info("=== BODY")
        logger.info(body)
    })
    logger.endGroup()

    logger.startGroup("Creating tracking issues")
    const createTrackingIssues = createTrackingIssuesWith(config, logger)
    const createdIssues = await createTrackingIssues(issuesToCreate)
    logger.info(`Created issues:`)
    logger.info(JSON.stringify(createdIssues, null, 4))
    logger.endGroup()

    return createdIssues
}

run()
