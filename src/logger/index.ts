import * as core from "@actions/core"

export interface Logger {
    startGroup(name: string): void
    info(message: string): void
    warning(message: string): void
    setFailed(message: string): void
    endGroup(): void
}

export function getLogger(): Logger {
    return core
}
