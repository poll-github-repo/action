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
}

export interface Env {
    GITHUB_REPOSITORY: string
}

function isObj<T>(value: T | null | undefined): value is T {
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

export class LocalConfig {
    inputs: Inputs
    env: Env

    constructor(inputs: Inputs, env: Env) {
        this.inputs = inputs
        this.env = env
    }

    static async read(): Promise<LocalConfig> {
        const configPath = join(__dirname, "..", ".env.json")

        const rawConfig = await fs.promises.readFile(configPath)
        const { inputs, env } = JSON.parse(rawConfig.toString())

        if (!isObj(inputs)) formatErr("['inputs'] field must be an object")

        const token = inputs.token
        if (!isString(token)) formatErr("['inputs']['token'] must be a string")

        const matchingStrategy = inputs["matching-strategy"]
        if (!isString(matchingStrategy)) formatErr("['inputs']['matching-strategy]' must be a string")
        if (!isMatchingStrategy(matchingStrategy)) formatErr("['inputs']['matching-strategy]' must be either 'sha-short' or 'sha-full'")

        const trackingIssueTitle = inputs["tracking-issue-title"]
        if (!isString(trackingIssueTitle)) formatErr("['inputs']['tracking-issue-title'] must be a string")

        const trackingIssueBody = inputs["tracking-issue-body"]
        if (!isString(trackingIssueBody)) formatErr("['inputs']['tracking-issue-body'] must be a string")

        const owner = inputs.owner
        if (!isString(owner)) formatErr("['inputs']['owner'] must be a string")
        const repo = inputs.repo
        if (!isString(repo)) formatErr("['inputs']['repo'] must be a string")
        const path = inputs.path
        if (!isString(path)) formatErr("['inputs']['path'] must be a string")
        const label = inputs.label
        if (!isString(label)) formatErr("['inputs']['label'] must be a string")

        if (!isObj(env)) formatErr("['env'] field must be an object")
        const GITHUB_REPOSITORY = env.GITHUB_REPOSITORY
        if (!isString(GITHUB_REPOSITORY)) formatErr("['env']['GITHUB_REPOSITORY'] must be a string")

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
            },
            {
                GITHUB_REPOSITORY
            }
        )
    }
}
