import { LocalConfig } from "../localConfig"

export class BaseEnv {
    env: LocalConfig["env"]

    constructor(env: LocalConfig["env"]) {
        this.env = env
    }

    static parseOwnerAndRepo(ownerAndRepo: string): [string, string] | null {
        const parts = ownerAndRepo.split("/")
        if (parts.length === 2) {
            return [parts[0]!, parts[1]!]
        }
        return null
    }

    ownerAndRepoComponents(): [string, string] {
        const ownerAndRepo = this.env["GITHUB_REPOSITORY"]
        const parts = BaseEnv.parseOwnerAndRepo(ownerAndRepo)
        if (parts) {
            return parts
        }
        throw new Error(`GITHUB_REPOSITORY variable is malformed, expected to have format 'owner/repo', got ${ownerAndRepo}`)
    }

    getOwner(): string {
        return this.ownerAndRepoComponents()[0]
    }

    getRepo(): string {
        return this.ownerAndRepoComponents()[1]
    }
}
