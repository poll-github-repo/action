import { join } from "path"
import * as fs from "fs"
import { Config } from "."

export async function load(): Promise<Config> {
    const configPath = join(__dirname, "..", "..", ".env.json")

    const configContent = await fs.promises.readFile(configPath)
    const maybeConfig = JSON.parse(configContent.toString())
    return validations.validateConfig(maybeConfig)
}

namespace validations {
    export function validateConfig(config: any): Config {
        if (typeof (config) !== "object") {
            formatErr("expected JSON to contain an object")
        }

        const {
            token,
            currentRepoOwner,
            currentRepo,
            currentRepoCachePath,
            currentRepoLabelToAdd,
            repoToSyncOwner,
            repoToSync,
            repoToSyncPath,
            trackingIssueTemplateTitle,
            trackingIssueTemplateBody,
            yesCreateIssues
        } = config

        if (yesCreateIssues !== true && yesCreateIssues !== false) formatErr(`["yesCreateIssues"] must be a boolean`)
        if (!isString(token)) stringErr("token")
        if (!isString(currentRepoOwner)) stringErr("currentRepoOwner")
        if (!isString(currentRepo)) stringErr("currentRepo")
        if (!isString(currentRepoCachePath)) stringErr("currentRepoCachePath")
        if ((yesCreateIssues || currentRepoLabelToAdd !== undefined) && !isString(currentRepoLabelToAdd)) stringErr("currentRepoLabelToAdd")
        if (!isString(repoToSyncOwner)) stringErr("repoToSyncOwner")
        if (!isString(repoToSync)) stringErr("repoToSync")
        if (!isString(repoToSyncPath)) stringErr("repoToSyncPath")
        if ((yesCreateIssues || trackingIssueTemplateTitle !== undefined) && !isString(trackingIssueTemplateTitle)) stringErr("trackingIssueTemplateTitle")
        if ((yesCreateIssues || trackingIssueTemplateBody !== undefined) && !Array.isArray(trackingIssueTemplateBody)) formatErr(`["trackingIssueTemplateBody"] must be an array of strings`)

        return {
            token,
            currentRepoOwner,
            currentRepo,
            currentRepoCachePath,
            currentRepoLabelToAdd,
            repoToSyncOwner,
            repoToSync,
            repoToSyncPath,
            trackingIssueTemplateTitle,
            trackingIssueTemplateBody,
            yesCreateIssues
        }
    }

    function isString(value: any): value is string {
        return typeof (value) === "string"
    }

    function formatErr(message: string): never {
        throw new Error(`Your .json.env file is malformed: ${message}`)
    }

    function stringErr(...path: string[]): never {
        const jsonPath = path.map(part => `["${part}"]`).join("")
        formatErr(`${jsonPath} must be a string`)
    }
}
