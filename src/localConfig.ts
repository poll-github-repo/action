import { join } from "path"
import * as fs from "fs"

export enum MatchingStrategy {
    SHA_SHORT = "sha-short",
    SHA_FULL = "sha-full"
}

export interface Inputs {
    token: string
    "matching-strategy": MatchingStrategy.SHA_SHORT | MatchingStrategy.SHA_FULL
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
        const maybeConfig = JSON.parse(configContent.toString())
        const config = validations.validateConfig(maybeConfig)

        return new LocalConfig(config.inputs, config.env)
    }
}

namespace validations {
    type UnknownObject = {
        [K in string]?: unknown
    }

    export function validateConfig(config: any): { inputs: Inputs, env: Env } {
        if (typeof (config) === "object") {
            formatErr("expected JSON to contain an object")
        }

        const { inputs, env } = config
        if (!inputs || (typeof (inputs) !== "object")) formatErr("[inputs] must be an object")
        if (!env || (typeof (inputs) !== "object")) formatErr("[env] must be an object")
        return {
            inputs: validateInputs(inputs),
            env: validateEnv(env)
        }
    }

    function validateInputs(inputs: UnknownObject): Inputs {
        const {
            token,
            "matching-strategy": matchingStrategy,
            "tracking-issue-title": trackingIssueTitle,
            "tracking-issue-body": trackingIssueBody,
            owner,
            repo,
            path,
            label,
            "sync-path": syncPath,
        } = inputs

        function stringErr(fieldName: string): never {
            formatErr(`[inputs][${fieldName}] must be a string`)
        }

        if (!isString(token)) stringErr("token")
        if (!isString(matchingStrategy)) stringErr("matchingStrategy")
        if (!isString(trackingIssueTitle)) stringErr("trackingIssueTitle")
        if (!isString(trackingIssueBody)) stringErr("trackingIssueBody")
        if (!isString(owner)) stringErr("owner")
        if (!isString(repo)) stringErr("repo")
        if (!isString(path)) stringErr("path")
        if (!isString(label)) stringErr("label")
        if (!isString(syncPath)) stringErr("syncPath")

        if ((matchingStrategy !== MatchingStrategy.SHA_SHORT) && (matchingStrategy !== MatchingStrategy.SHA_FULL)) {
            formatErr(`[inputs][matching-strategy] must be either "${MatchingStrategy.SHA_SHORT}" or "${MatchingStrategy.SHA_FULL}"`)
        }

        return {
            token,
            "matching-strategy": matchingStrategy,
            "tracking-issue-title": trackingIssueTitle,
            "tracking-issue-body": trackingIssueBody,
            owner,
            repo,
            path,
            label,
            "sync-path": syncPath,
        }
    }

    function validateEnv(env: UnknownObject): Env {
        const {
            GITHUB_REPOSITORY
        } = env

        function stringErr(varName: string): never {
            formatErr(`[env][${varName}] must be a string`)
        }

        if (!isString(GITHUB_REPOSITORY)) stringErr("GITHUB_REPOSITORY")

        return {
            GITHUB_REPOSITORY
        }
    }

    function isString(value: any): value is string {
        return typeof (value) === "string"
    }

    function formatErr(message: string): never {
        throw new Error(`Your .json.env file is malformed: ${message}`)
    }
}
