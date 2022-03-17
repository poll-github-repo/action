import { load as loadLocal } from "./local"
import { load as loadCI } from "./ci"

export interface Config {
    token: string
    currentRepo: {
        owner: string
        repo: string
        cachePath: string
        labelToAdd: string
    }
    repoToSync: {
        owner: string
        repo: string
        pathToSync: string
    }
    trackingIssueTemplate: {
        title: string
        body: string
    }
}

export async function load(): Promise<Config> {
    if (process.env["CI"]) {
        return loadCI()
    } else {
        return loadLocal()
    }
}
