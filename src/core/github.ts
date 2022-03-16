import * as github from "@actions/core"
import { ICore } from "./types"

export function getGithubCore(): ICore {
    return github
}
