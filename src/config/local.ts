import { join } from "path"
import * as fs from "fs"
import { Config } from "."

export async function load(): Promise<Config> {
    const configPath = join(__dirname, "..", ".env.json")

    const configContent = await fs.promises.readFile(configPath)
    const maybeConfig = JSON.parse(configContent.toString())
    return validations.validateConfig(maybeConfig)
}

namespace validations {
    type UnknownObject = {
        [K in string]?: unknown
    }

    export function validateConfig(config: any): Config {
        if (typeof (config) === "object") {
            formatErr("expected JSON to contain an object")
        }

        const {
            token,
            currentRepo: maybeCurrentRepo,
            repoToSync: maybeRepoToSync,
            trackingIssueTemplate: maybeTrackingIssueTemplate
        } = config

        if (!isString(token)) stringErr("token")
        const currentRepo = validateCurrentRepo(maybeCurrentRepo)
        const repoToSync = validateRepoToSync(maybeRepoToSync)
        const trackingIssueTemplate = validateTrackingIssueTemplate(maybeTrackingIssueTemplate)

        return { token, currentRepo, repoToSync, trackingIssueTemplate }
    }

    function validateCurrentRepo(data: UnknownObject): Config["currentRepo"] {
        if (!data || (typeof (data) !== "object")) formatErr("[currentRepo] must be an object")
        const { owner, repo, cachePath, labelToAdd } = data
        if (!isString(owner)) stringErr("currentRepo", "owner")
        if (!isString(repo)) stringErr("currentRepo", "repo")
        if (!isString(cachePath)) stringErr("currentRepo", "cachePath")
        if (!isString(labelToAdd)) stringErr("currentRepo", "labelToAdd")
        return { owner, repo, cachePath, labelToAdd }
    }
    function validateRepoToSync(data: UnknownObject): Config["repoToSync"] {
        if (!data || (typeof (data) !== "object")) formatErr("[repoToSync] must be an object")
        const { owner, repo, pathToSync } = data
        if (!isString(owner)) stringErr("repoToSync", "owner")
        if (!isString(repo)) stringErr("repoToSync", "repo")
        if (!isString(pathToSync)) stringErr("repoToSync", "pathToSync")
        return { owner, repo, pathToSync }
    }
    function validateTrackingIssueTemplate(data: UnknownObject): Config["trackingIssueTemplate"] {
        if (!data || (typeof (data) !== "object")) formatErr("[trackingIssueTemplate] must be an object")
        const { title, body } = data
        if (!isString(title)) stringErr("trackingIssueTemplate", "title")
        if (!isString(body)) stringErr("trackingIssueTemplate", "body")
        return { title, body }
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
