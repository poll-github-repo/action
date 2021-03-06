export interface Commit {
    path: string
    url: string
    sha: string
    message: string
    date: string
}

export interface IssueToCreate {
    title: string
    body: string
}

export interface CreatedIssue {
    number: number
    url: string
}
