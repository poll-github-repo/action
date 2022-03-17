import * as path from "path"
import * as fs from "fs"
import { IEnv } from "./types"

export class LocalEnv implements IEnv {
    owner: string
    repo: string

    constructor(options: { owner: string, repo: string }) {
        this.owner = options.owner
        this.repo = options.repo
    }

    getOwner(): string | undefined {
        return this.owner
    }

    getRepo(): string | undefined {
        return this.repo
    }
}

export async function getLocalEnv(): Promise<IEnv> {
    const configPath = path.join(__dirname, "..", "..", ".env.json")
    const rawConfig = await fs.promises.readFile(configPath)
    const config = JSON.parse(rawConfig.toString()) as { env?: { GITHUB_REPOSITORY?: string } }
    if (config.env?.GITHUB_REPOSITORY) {
        const [owner, repo] = config.env.GITHUB_REPOSITORY.split("/")
        if (owner && repo) {
            return new LocalEnv({ owner, repo })
        }
    }
    throw new Error("Expected .env.json config to define 'GITHUB_REPOSITORY' env variable in 'owner/repo' format")
}
