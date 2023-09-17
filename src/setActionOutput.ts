import { Commit, CreatedIssue } from "./types";
import * as core from "@actions/core";

export type ActionOutputResult = {
    newCommitsInSyncRepo: boolean,
    newCommits: string,
    createdIssues?: string,
}

export function setActionOutput(createdIssues: CreatedIssue[], newCommits: Commit[]) {
    const result: ActionOutputResult = { newCommitsInSyncRepo: newCommits.length > 0, newCommits: JSON.stringify(newCommits) }

    core.setOutput("newCommitsInSyncRepo", result.newCommitsInSyncRepo)
    core.setOutput("newCommits", result.newCommits)

    if (createdIssues.length > 0) {
        result.createdIssues = JSON.stringify(createdIssues)
        core.setOutput("createdIssues", result.createdIssues)
    }

    return result
}
