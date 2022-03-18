import { pollCommitsWith } from "../src/pollCommits"
import { COMMIT1, COMMIT2, COMMIT3 } from "./commits"
import { Config } from "../src/config"
import { TestLogger } from "../src/logger/test"
import { testConfig } from "./testConfig"

function setup(overrides?: { config?: Partial<Config> }) {
    const config = { ...testConfig, ...overrides?.config }
    const logger = new TestLogger()
    const pollCommits = pollCommitsWith(config, logger)
    return { config, logger, pollCommits }
}

describe("when no options given", () => {
    it.concurrent("it returns all commits", async () => {
        const { logger, pollCommits } = setup()
        const commits = await pollCommits()

        expect(commits).toEqual([COMMIT3, COMMIT2, COMMIT1])
        expect(logger.getMessages()).toEqual([
            `startGroup: Pulling commits from poll-github-repo/dummy-source-repo since="undefined", path="data.txt"`,
            `info: Pulled a page with 3 commits`,
            `info: Extracted commit {"path":"data.txt","url":"https://github.com/poll-github-repo/dummy-source-repo/commit/a52684431a3fda35c2ac4cde291071a3430f2268","sha":"a52684431a3fda35c2ac4cde291071a3430f2268","message":"update data.txt (three)","date":"2022-03-14T16:23:55Z"}`,
            `info: Extracted commit {"path":"data.txt","url":"https://github.com/poll-github-repo/dummy-source-repo/commit/b6138d0ac3cf8fe1edc6fb48e46fefb990137746","sha":"b6138d0ac3cf8fe1edc6fb48e46fefb990137746","message":"update data.txt (two)","date":"2022-03-14T16:23:29Z"}`,
            `info: Extracted commit {"path":"data.txt","url":"https://github.com/poll-github-repo/dummy-source-repo/commit/3a84a578463d2b0e7f8abf4bd7a131a4ab59adaa","sha":"3a84a578463d2b0e7f8abf4bd7a131a4ab59adaa","message":"update data.txt","date":"2022-03-14T16:23:17Z"}`,
            `endGroup`,
        ])
    })
})

describe("when SINCE specified", () => {
    it.concurrent("it returns a subset", async () => {
        const { pollCommits } = setup()
        const commits = await pollCommits({ since: COMMIT2.date })

        expect(commits).toEqual([COMMIT3, COMMIT2])
    })
})

describe("when there are multiple pages", () => {
    it.concurrent("it still returns all commits", async () => {
        const { logger, pollCommits } = setup()
        const commits = await pollCommits({ per_page: 1 })

        expect(commits).toEqual([COMMIT3, COMMIT2, COMMIT1])
        expect(logger.getMessages()).toEqual([
            `startGroup: Pulling commits from poll-github-repo/dummy-source-repo since="undefined", path="data.txt"`,
            `info: Pulled a page with 1 commits`,
            `info: Extracted commit {"path":"data.txt","url":"https://github.com/poll-github-repo/dummy-source-repo/commit/a52684431a3fda35c2ac4cde291071a3430f2268","sha":"a52684431a3fda35c2ac4cde291071a3430f2268","message":"update data.txt (three)","date":"2022-03-14T16:23:55Z"}`,
            `info: Pulled a page with 1 commits`,
            `info: Extracted commit {"path":"data.txt","url":"https://github.com/poll-github-repo/dummy-source-repo/commit/b6138d0ac3cf8fe1edc6fb48e46fefb990137746","sha":"b6138d0ac3cf8fe1edc6fb48e46fefb990137746","message":"update data.txt (two)","date":"2022-03-14T16:23:29Z"}`,
            `info: Pulled a page with 1 commits`,
            `info: Extracted commit {"path":"data.txt","url":"https://github.com/poll-github-repo/dummy-source-repo/commit/3a84a578463d2b0e7f8abf4bd7a131a4ab59adaa","sha":"3a84a578463d2b0e7f8abf4bd7a131a4ab59adaa","message":"update data.txt","date":"2022-03-14T16:23:17Z"}`,
            `info: Pulled a page with 0 commits`,
            `endGroup`,
        ])
    })
})

describe("failures", () => {
    describe("when unknown owner given", () => {
        it.concurrent("it returns an empty commit list", async () => {
            const { logger, pollCommits } = setup({ config: { repoToSyncOwner: "definitely-unknown-user-42" } })
            const commits = await pollCommits()

            expect(commits).toEqual([])
            expect(logger.getMessages()).toEqual([
                `startGroup: Pulling commits from definitely-unknown-user-42/dummy-source-repo since="undefined", path="data.txt"`,
                `setFaled: Failed to pull data from GitHub: HttpError: Not Found`,
                `endGroup`,
            ])
        })
    })

    describe("when unknown repo given", () => {
        it.concurrent("it returns an empty commit list", async () => {
            const { logger, pollCommits } = setup({ config: { repoToSync: "unknown-repo" } })
            const commits = await pollCommits()

            expect(commits).toEqual([])
            expect(logger.getMessages()).toEqual([
                `startGroup: Pulling commits from poll-github-repo/unknown-repo since="undefined", path="data.txt"`,
                `setFaled: Failed to pull data from GitHub: HttpError: Not Found`,
                `endGroup`,
            ])
        })
    })

    describe("when unknown path given", () => {
        it.concurrent("it returns an empty list of commits", async () => {
            const { logger, pollCommits } = setup({ config: { repoToSyncPath: "missing.txt" } })
            const commits = await pollCommits()

            expect(commits).toEqual([])
            expect(logger.getMessages()).toEqual([
                `startGroup: Pulling commits from poll-github-repo/dummy-source-repo since="undefined", path="missing.txt"`,
                `info: Pulled a page with 0 commits`,
                `endGroup`,
            ])
        })
    })

    describe("when invalid token given", () => {
        it.concurrent("it returns an empty commit list ", async () => {
            const { logger, pollCommits } = setup({ config: { token: "invalid-token" } })
            const commits = await pollCommits()

            expect(commits).toEqual([])
            expect(logger.getMessages()).toEqual([
                `startGroup: Pulling commits from poll-github-repo/dummy-source-repo since="undefined", path="data.txt"`,
                `setFaled: Failed to pull data from GitHub: HttpError: Bad credentials`,
                `endGroup`,
            ])
        })
    })
})
