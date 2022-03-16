import { Issue } from "../src/listIssues"

export const ISSUE1: Issue = {
    number: 1,
    title: "poll-github-repo/dummy-repo@3a84a57",
    url: "https://github.com/poll-github-repo/dummy-repo/issues/1",
    labels: ["test-label"],
    state: "open",
    createdAt: "2022-03-14T18:33:22Z",
}

export const ISSUE2: Issue = {
    number: 2,
    title: "poll-github-repo/dummy-repo@1234567",
    url: "https://github.com/poll-github-repo/dummy-repo/issues/2",
    labels: ["test-label", "other-label"],
    state: "open",
    createdAt: "2022-03-14T18:33:52Z"
}
