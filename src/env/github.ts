import { BaseEnv } from "./base"

export class GithubEnv extends BaseEnv {
}

export function getGithubEnv(): BaseEnv {
    if (!process.env["GITHUB_REPOSITORY"]) {
        throw new Error("GITHUB_REPOSITORY env var is required")
    }
    return new GithubEnv({ GITHUB_REPOSITORY: process.env["GITHUB_REPOSITORY"] })
}
