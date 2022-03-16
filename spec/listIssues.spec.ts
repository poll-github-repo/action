import { listIssuesWithCore } from "../src/listIssues"
import { GH_TOKEN } from "../.env.json"
import DummyGithubCore from "./dummyGithubCore"
const OWNER = "poll-github-repo"
const REPO = "dummy-repo"
import { ISSUE1, ISSUE2 } from "./issues"

function setup() {
    const core = new DummyGithubCore()
    const listIssues = listIssuesWithCore(core)
    return { core, listIssues }
}

describe("when no options given", () => {
    it.concurrent("returns all issues", async () => {
        const { core, listIssues } = setup()

        const issues = await listIssues({
            token: GH_TOKEN,
            owner: OWNER,
            repo: REPO,
            label: "test-label"
        })

        expect(issues).toEqual([ISSUE2, ISSUE1])
        expect(core.messages).toEqual([
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
        const { core, listIssues } = setup()

        const issues = await listIssues({
            token: GH_TOKEN,
            owner: OWNER,
            repo: REPO,
            label: "test-label",
            since: ISSUE2.createdAt
        })

        expect(issues).toEqual([ISSUE2])
    })
})

describe("when there are multiple pages", () => {
    it.concurrent("it still returns all issues", async () => {
        const { core, listIssues } = setup()

        const issues = await listIssues({
            token: GH_TOKEN,
            owner: OWNER,
            repo: REPO,
            label: "test-label",
            per_page: 1
        })

        expect(issues).toEqual([ISSUE2, ISSUE1])
        expect(core.messages).toEqual([
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
            const { core, listIssues } = setup()

            const issues = await listIssues({
                token: GH_TOKEN,
                owner: "definitely-unknown-user-42",
                repo: REPO,
                label: "test-label"
            })

            expect(issues).toEqual([])
            expect(core.messages).toEqual([
                `startGroup: Pulling issues from definitely-unknown-user-42/dummy-repo with label "test-label"`,
                `setFaled: Failed to pull data from GitHub: HttpError: Not Found`,
                `endGroup`,
            ])
        })
    })

    describe("when unknown repo given", () => {
        it.concurrent("it returns an empty list of issues", async () => {
            const { core, listIssues } = setup()

            const issues = await listIssues({
                token: GH_TOKEN,
                owner: OWNER,
                repo: "unknown-repo",
                label: "test-label"
            })

            expect(issues).toEqual([])
            expect(core.messages).toEqual([
                `startGroup: Pulling issues from poll-github-repo/unknown-repo with label "test-label"`,
                `setFaled: Failed to pull data from GitHub: HttpError: Not Found`,
                `endGroup`,
            ])
        })
    })

    describe("when unknown label given", () => {
        it.concurrent("it returns an empty list of issues", async () => {
            const { core, listIssues } = setup()

            const issues = await listIssues({
                token: GH_TOKEN,
                owner: OWNER,
                repo: REPO,
                label: "unknown-label"
            })

            expect(issues).toEqual([])
            expect(core.messages).toEqual([
                `startGroup: Pulling issues from poll-github-repo/dummy-repo with label "unknown-label"`,
                `debug: Pulled a page with 0 issues`,
                `endGroup`,
            ])
        })
    })

    describe("when invalid token given", () => {
        it.concurrent("it returns an empty issue list", async () => {
            const { core, listIssues } = setup()

            const issues = await listIssues({
                token: "invalid-token",
                owner: OWNER,
                repo: REPO,
                label: "test-label"
            })

            expect(issues).toEqual([])
            expect(core.messages).toEqual([
                `startGroup: Pulling issues from poll-github-repo/dummy-repo with label "test-label"`,
                `setFaled: Failed to pull data from GitHub: HttpError: Bad credentials`,
                `endGroup`,
            ])
        })
    })
})
