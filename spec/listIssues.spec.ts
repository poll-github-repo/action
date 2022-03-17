import { listIssuesWithCore } from "../src/listIssues"
import { getTestCore, InputOverrides, getMessages } from "../src/core/dummy"
import { ISSUE1, ISSUE2 } from "./issues"

const DEFAULTS = {
    owner: "poll-github-repo",
    repo: "dummy-repo",
    label: "test-label"
}

async function setup(overrides?: InputOverrides) {
    const core = await getTestCore({ ...DEFAULTS, ...overrides })
    const listIssues = listIssuesWithCore(core)
    return { core, listIssues }
}

describe("when no options given", () => {
    it.concurrent("returns all issues", async () => {
        const { core, listIssues } = await setup()
        const issues = await listIssues()

        expect(issues).toEqual([ISSUE2, ISSUE1])
        expect(getMessages(core)).toEqual([
            `startGroup: Pulling issues from poll-github-repo/dummy-repo with label "test-label"`,
            `debug: Pulled a page with 2 issues`,
            `debug: Extracted issue {"number":2,"title":"poll-github-repo/dummy-repo@1234567","url":"https://github.com/poll-github-repo/dummy-repo/issues/2","labels":["test-label","other-label"],"state":"open","createdAt":"2022-03-14T18:33:52Z"}`,
            `debug: Extracted issue {"number":1,"title":"poll-github-repo/dummy-repo@3a84a57","url":"https://github.com/poll-github-repo/dummy-repo/issues/1","labels":["test-label"],"state":"open","createdAt":"2022-03-14T18:33:22Z"}`,
            `endGroup`,
        ])
    })
})

describe("when SINCE specified", () => {
    it.concurrent("it returns a subset", async () => {
        const { listIssues } = await setup()
        const issues = await listIssues({ since: ISSUE2.createdAt })

        expect(issues).toEqual([ISSUE2])
    })
})

describe("when there are multiple pages", () => {
    it.concurrent("it still returns all issues", async () => {
        const { core, listIssues } = await setup()
        const issues = await listIssues({ per_page: 1 })

        expect(issues).toEqual([ISSUE2, ISSUE1])
        expect(getMessages(core)).toEqual([
            `startGroup: Pulling issues from poll-github-repo/dummy-repo with label "test-label"`,
            `debug: Pulled a page with 1 issues`,
            `debug: Extracted issue {"number":2,"title":"poll-github-repo/dummy-repo@1234567","url":"https://github.com/poll-github-repo/dummy-repo/issues/2","labels":["test-label","other-label"],"state":"open","createdAt":"2022-03-14T18:33:52Z"}`,
            `debug: Pulled a page with 1 issues`,
            `debug: Extracted issue {"number":1,"title":"poll-github-repo/dummy-repo@3a84a57","url":"https://github.com/poll-github-repo/dummy-repo/issues/1","labels":["test-label"],"state":"open","createdAt":"2022-03-14T18:33:22Z"}`,
            `endGroup`,
        ])
    })
})

describe("failures", () => {
    describe("when unknown owner given", () => {
        it.concurrent("it returns an empty list of issues", async () => {
            const { core, listIssues } = await setup({ owner: "definitely-unknown-user-42" })
            const issues = await listIssues()

            expect(issues).toEqual([])
            expect(getMessages(core)).toEqual([
                `startGroup: Pulling issues from definitely-unknown-user-42/dummy-repo with label "test-label"`,
                `setFaled: Failed to pull data from GitHub: HttpError: Not Found`,
                `endGroup`,
            ])
        })
    })

    describe("when unknown repo given", () => {
        it.concurrent("it returns an empty list of issues", async () => {
            const { core, listIssues } = await setup({ repo: "unknown-repo" })
            const issues = await listIssues()

            expect(issues).toEqual([])
            expect(getMessages(core)).toEqual([
                `startGroup: Pulling issues from poll-github-repo/unknown-repo with label "test-label"`,
                `setFaled: Failed to pull data from GitHub: HttpError: Not Found`,
                `endGroup`,
            ])
        })
    })

    describe("when unknown label given", () => {
        it.concurrent("it returns an empty list of issues", async () => {
            const { core, listIssues } = await setup({ label: "unknown-label" })
            const issues = await listIssues()

            expect(issues).toEqual([])
            expect(getMessages(core)).toEqual([
                `startGroup: Pulling issues from poll-github-repo/dummy-repo with label "unknown-label"`,
                `debug: Pulled a page with 0 issues`,
                `endGroup`,
            ])
        })
    })

    describe("when invalid token given", () => {
        it.concurrent("it returns an empty issue list", async () => {
            const { core, listIssues } = await setup({ token: "invalid-token" })
            const issues = await listIssues()

            expect(issues).toEqual([])
            expect(getMessages(core)).toEqual([
                `startGroup: Pulling issues from poll-github-repo/dummy-repo with label "test-label"`,
                `setFaled: Failed to pull data from GitHub: HttpError: Bad credentials`,
                `endGroup`,
            ])
        })
    })
})
