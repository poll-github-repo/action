import { BaseEnv } from "./base"
import { LocalConfig } from "../localConfig"
import { LocalEnv, getLocalEnv } from "./local"

export type EnvOverrides = Partial<LocalConfig["env"]>

export class DummyEnv extends BaseEnv {
    overrides?: EnvOverrides

    constructor(localEnv: LocalEnv, overrides?: EnvOverrides) {
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

export async function getDummyEnv(overrides?: EnvOverrides) {
    const localEnv = await getLocalEnv()
    return new DummyEnv(localEnv, overrides)
}
