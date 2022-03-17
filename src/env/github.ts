import { IEnv } from "./types"

const ownerAndRepo = process.env["GITHUB_REPOSITORY"]
const [owner, repo] = ownerAndRepo?.split("/") || []

export class GithubEnv implements IEnv {
    getOwner(): string | undefined {
        return owner
    }

    getRepo(): string | undefined {
        return repo
    }
}

export function getGithubEnv(): IEnv {
    return new GithubEnv()
}
