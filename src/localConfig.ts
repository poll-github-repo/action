import { join } from "path"
import * as fs from "fs"

export interface Inputs {
    token: string
    "matching-strategy": "sha-short" | "sha-full"
    "tracking-issue-title": string
    "tracking-issue-body": string
    owner: string
    repo: string
    path: string
    label: string
    "sync-path": string
}

export interface Env {
    GITHUB_REPOSITORY: string
}

function isObj<T>(value: any): value is T {
    return typeof (value) != null
}

function isString(value: any): value is string {
    return typeof (value) === "string"
}

function isMatchingStrategy(value: string): value is Inputs["matching-strategy"] {
    return (value === "sha-short") || (value == "sha-full")
}

function formatErr(message: string): never {
    throw new Error(`Your .json.env file is malformed: ${message}`)
}

function stringInputErr(fieldName: string): never {
    formatErr(`[inputs][${fieldName}] must be a string`)
}

export class LocalConfig {
    inputs: Inputs
    env: Env

    constructor(inputs: Inputs, env: Env) {
        this.inputs = inputs
        this.env = env
    }

    static async read(): Promise<LocalConfig> {
        const configPath = join(__dirname, "..", ".env.json")

        const configContent = await fs.promises.readFile(configPath)
        const config = JSON.parse(configContent.toString())
        const inputs: Partial<Inputs> | undefined = config.inputs
        const env: Partial<Env> | undefined = config.env

        if (!isObj<Partial<Inputs>>(inputs)) formatErr("[inputs] field must be an object")

        const token = inputs.token
        if (!isString(token)) stringInputErr("token")

        const matchingStrategy = inputs["matching-strategy"]
        if (!isString(matchingStrategy)) stringInputErr("matching-strategy")
        if (!isMatchingStrategy(matchingStrategy)) formatErr(`[inputs][matching-strategy] must be either "sha-short" or "sha-full"`)

        const trackingIssueTitle = inputs["tracking-issue-title"]
        if (!isString(trackingIssueTitle)) stringInputErr("tracking-issue-title")

        const trackingIssueBody = inputs["tracking-issue-body"]
        if (!isString(trackingIssueBody)) stringInputErr("tracking-issue-body")

        const owner = inputs.owner
        if (!isString(owner)) stringInputErr("owner")
        const repo = inputs.repo
        if (!isString(repo)) stringInputErr("repo")
        const path = inputs.path
        if (!isString(path)) stringInputErr("path")
        const label = inputs.label
        if (!isString(label)) stringInputErr("label")
        const syncPath = inputs["sync-path"]
        if (!isString(syncPath)) stringInputErr("sync-path")

        console.log(inputs)

        if (!isObj<Partial<Env>>(env)) formatErr("[env] field must be an object")
        const GITHUB_REPOSITORY = env.GITHUB_REPOSITORY
        if (!isString(GITHUB_REPOSITORY)) formatErr("[env][GITHUB_REPOSITORY] must be a string")

        return new LocalConfig(
            {
                token,
                "matching-strategy": matchingStrategy,
                "tracking-issue-title": trackingIssueTitle,
                "tracking-issue-body": trackingIssueBody,
                owner,
                repo,
                path,
                label,
                "sync-path": syncPath
            },
            {
                GITHUB_REPOSITORY
            }
        )
    }
}
