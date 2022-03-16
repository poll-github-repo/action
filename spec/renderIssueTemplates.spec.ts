import { renderIssueTemplatesWithCore } from "../src/renderIssueTemplates"
import { getDummyGithubCore, InputOverrides } from "./dummyGithubCore"
import { COMMIT1, COMMIT2 } from "./commits"

async function setup(overrides?: InputOverrides) {
    const core = await getDummyGithubCore(overrides)
    const renderIssueTemplates = renderIssueTemplatesWithCore(core)
    return { core, renderIssueTemplates }
}

it.concurrent("renders given template for every commit", async () => {
    const { renderIssueTemplates } = await setup({
        "tracking-issue-title": "SHA short = {{ sha-short }}",
        "tracking-issue-body": [
            "path = {{ path }}",
            "sha-short = {{ sha-short }}",
            "sha-full = {{ sha-full }}",
            "message = {{ message }}",
            "commit-date = {{ commit-date }}",
            "url = {{ url }}",
            // and render it again to make sure we replace globally
            "url (again) = {{ url }}",
        ].join("\n")
    })

    const rendered = renderIssueTemplates([COMMIT1, COMMIT2])
    expect(rendered).toEqual([
        {
            title: "SHA short = 3a84a57",
            body: [
                "path = data.txt",
                "sha-short = 3a84a57",
                "sha-full = 3a84a578463d2b0e7f8abf4bd7a131a4ab59adaa",
                "message = update data.txt",
                "commit-date = 2022-03-14T16:23:17Z",
                "url = https://github.com/poll-github-repo/dummy-repo/commit/3a84a578463d2b0e7f8abf4bd7a131a4ab59adaa",
                "url (again) = https://github.com/poll-github-repo/dummy-repo/commit/3a84a578463d2b0e7f8abf4bd7a131a4ab59adaa",
            ].join("\n"),
        },
        {
            title: "SHA short = b6138d0",
            body: [
                "path = data.txt",
                "sha-short = b6138d0",
                "sha-full = b6138d0ac3cf8fe1edc6fb48e46fefb990137746",
                "message = update data.txt (two)",
                "commit-date = 2022-03-14T16:23:29Z",
                "url = https://github.com/poll-github-repo/dummy-repo/commit/b6138d0ac3cf8fe1edc6fb48e46fefb990137746",
                "url (again) = https://github.com/poll-github-repo/dummy-repo/commit/b6138d0ac3cf8fe1edc6fb48e46fefb990137746",
            ].join("\n")
        },
    ])
})
