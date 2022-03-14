const pollFileChanges = require("../src/pollFileChanges")
const GH_TOKEN = require('../.env.json').GH_TOKEN
const DummyGithubCore = require('./dummyGithubCore')
const OWNER = 'poll-github-repo'
const REPO = 'dummy-repo'
const PATH = 'data.txt'
const { COMMIT1, COMMIT2, COMMIT3 } = require('./commits')

beforeEach(() => {
    this.core = new DummyGithubCore()
    this.pollFileChanges = pollFileChanges(this.core)
})

test('it returns all commits when no options fiven', async () => {
    const commits = await this.pollFileChanges({
        token: GH_TOKEN,
        owner: OWNER,
        repo: REPO,
        path: PATH
    })

    expect(commits).toEqual([COMMIT3, COMMIT2, COMMIT1])

    expect(this.core.messages).toEqual([
        `startGroup: Pulling commits from poll-github-repo/dummy-repo since="undefined", path="data.txt"`,
        `debug: Pulled a page with 3 commits`,
        `debug: Extracted commit {"path":"data.txt","url":"https://github.com/poll-github-repo/dummy-repo/commit/a52684431a3fda35c2ac4cde291071a3430f2268","sha":"a52684431a3fda35c2ac4cde291071a3430f2268","message":"update data.txt (three)","date":"2022-03-14T16:23:55Z"}`,
        `debug: Extracted commit {"path":"data.txt","url":"https://github.com/poll-github-repo/dummy-repo/commit/b6138d0ac3cf8fe1edc6fb48e46fefb990137746","sha":"b6138d0ac3cf8fe1edc6fb48e46fefb990137746","message":"update data.txt (two)","date":"2022-03-14T16:23:29Z"}`,
        `debug: Extracted commit {"path":"data.txt","url":"https://github.com/poll-github-repo/dummy-repo/commit/3a84a578463d2b0e7f8abf4bd7a131a4ab59adaa","sha":"3a84a578463d2b0e7f8abf4bd7a131a4ab59adaa","message":"update data.txt","date":"2022-03-14T16:23:17Z"}`,
        `endGroup`,
    ])
})

test('it returns an empty commit list when unknown owner given', async () => {
    const commits = await this.pollFileChanges({
        token: GH_TOKEN,
        owner: 'definitely-unknown-user-42',
        repo: REPO,
        path: PATH
    })

    expect(commits).toEqual([])

    expect(this.core.messages).toEqual([
        `startGroup: Pulling commits from definitely-unknown-user-42/dummy-repo since="undefined", path="data.txt"`,
        `setFaled: Failed to pull data from GitHub: HttpError: Not Found`,
        `endGroup`,
    ])
})

test('it returns an empty commit list when unknown repo given', async () => {
    const commits = await this.pollFileChanges({
        token: GH_TOKEN,
        owner: OWNER,
        repo: 'unknown-repo',
        path: PATH
    })

    expect(commits).toEqual([])

    expect(this.core.messages).toEqual([
        `startGroup: Pulling commits from poll-github-repo/unknown-repo since="undefined", path="data.txt"`,
        `setFaled: Failed to pull data from GitHub: HttpError: Not Found`,
        `endGroup`,
    ])
})

test('it returns an empty list of commits when unknown path given', async () => {
    const commits = await this.pollFileChanges({
        token: GH_TOKEN,
        owner: OWNER,
        repo: REPO,
        path: 'missing.txt'
    })

    expect(commits).toEqual([])

    expect(this.core.messages).toEqual([
        `startGroup: Pulling commits from poll-github-repo/dummy-repo since="undefined", path="missing.txt"`,
        `debug: Pulled a page with 0 commits`,
        `endGroup`,
    ])
})

test('it returns a subset when SINCE specified', async () => {
    const commits = await this.pollFileChanges({
        token: GH_TOKEN,
        owner: OWNER,
        repo: REPO,
        path: PATH,
        since: COMMIT2.date
    })

    expect(commits).toEqual([COMMIT3, COMMIT2])
})

test('it still returns all commits when there are multiple pages', async () => {
    const commits = await this.pollFileChanges({
        token: GH_TOKEN,
        owner: OWNER,
        repo: REPO,
        path: PATH,
        per_page: 1
    })

    expect(commits).toEqual([COMMIT3, COMMIT2, COMMIT1])
    expect(this.core.messages).toEqual([
        `startGroup: Pulling commits from poll-github-repo/dummy-repo since="undefined", path="data.txt"`,
        `debug: Pulled a page with 1 commits`,
        `debug: Extracted commit {"path":"data.txt","url":"https://github.com/poll-github-repo/dummy-repo/commit/a52684431a3fda35c2ac4cde291071a3430f2268","sha":"a52684431a3fda35c2ac4cde291071a3430f2268","message":"update data.txt (three)","date":"2022-03-14T16:23:55Z"}`,
        `debug: Pulled a page with 1 commits`,
        `debug: Extracted commit {"path":"data.txt","url":"https://github.com/poll-github-repo/dummy-repo/commit/b6138d0ac3cf8fe1edc6fb48e46fefb990137746","sha":"b6138d0ac3cf8fe1edc6fb48e46fefb990137746","message":"update data.txt (two)","date":"2022-03-14T16:23:29Z"}`,
        `debug: Pulled a page with 1 commits`,
        `debug: Extracted commit {"path":"data.txt","url":"https://github.com/poll-github-repo/dummy-repo/commit/3a84a578463d2b0e7f8abf4bd7a131a4ab59adaa","sha":"3a84a578463d2b0e7f8abf4bd7a131a4ab59adaa","message":"update data.txt","date":"2022-03-14T16:23:17Z"}`,
        `debug: Pulled a page with 0 commits`,
        `endGroup`,
    ])
})

test('it returns an empty commit list when invalid token given', async () => {
    const commits = await this.pollFileChanges({
        token: 'invalid-token',
        owner: OWNER,
        repo: REPO,
        path: PATH,
    })

    expect(commits).toEqual([])
    expect(this.core.messages).toEqual([
        `startGroup: Pulling commits from poll-github-repo/dummy-repo since="undefined", path="data.txt"`,
        `setFaled: Failed to pull data from GitHub: HttpError: Bad credentials`,
        `endGroup`,
    ])
})
