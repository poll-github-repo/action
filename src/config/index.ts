import { load as loadLocal } from "./local"
import { load as loadCI } from "./ci"

export interface Config {
    token: string
    currentRepoOwner: string
    currentRepo: string
    currentRepoCachePath: string
    currentRepoLabelToAdd: string
    repoToSyncOwner: string
    repoToSync: string
    repoToSyncPath: string
    trackingIssueTemplateTitle: string
    trackingIssueTemplateBody: string
}

export async function load(): Promise<Config> {
    if (process.env["CI"]) {
        return loadCI()
    } else {
        return loadLocal()
    }
}
