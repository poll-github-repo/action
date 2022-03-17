import { BaseEnv } from "./base"
import { LocalConfig } from "../localConfig"
import { LocalEnv } from "./local"

export class DummyEnv extends BaseEnv {
    overrides?: Partial<LocalConfig["env"]>

    constructor(localEnv: LocalEnv, overrides?: Partial<LocalConfig["env"]>) {
        super(localEnv.env)
        this.overrides = overrides
    }

    override ownerAndRepoComponents(): [string, string] {
        const ownerAndRepo = this.overrides?.GITHUB_REPOSITORY || this.env.GITHUB_REPOSITORY
        const parts = BaseEnv.parseOwnerAndRepo(ownerAndRepo)
        if (!parts) {
            throw new Error(`GITHUB_REPOSITORY variable is malformed, expected to have format 'owner/repo', got ${ownerAndRepo}`)
        }
        return parts
    }
}
