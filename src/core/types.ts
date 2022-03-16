export interface Inputs {
    token: string
    "matching-strategy": "sha-short" | "sha-full"
    "tracking-issue-title": string
    "tracking-issue-body": string
    owner: string
    repo: string
    path: string
    label: string
}

export interface ICore {
    startGroup(name: string): void
    debug(message: string): void
    warning(message: string): void
    setFailed(message: string): void
    endGroup(): void
    getInput(name: keyof Inputs, options?: { required?: boolean }): string
}
