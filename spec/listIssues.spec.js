const listIssues = require("../src/listIssues")
const GH_TOKEN = require('../.env.json').GH_TOKEN
const DummyGithubCore = require('./dummyGithubCore')
const OWNER = 'poll-github-repo'
const REPO = 'dummy-repo'
const { ISSUE1, ISSUE2 } = require('./issues')

beforeEach(() => {
    this.core = new DummyGithubCore()
    this.listIssues = listIssues(this.core)
})

it('returns all issues with given label by default', async () => {
    const issues = await this.listIssues({
        token: GH_TOKEN,
        owner: OWNER,
        repo: REPO,
        label: 'test-label'
    })

    expect(issues).toEqual([ISSUE2, ISSUE1])
    expect(this.core.messages).toEqual([
        `startGroup: Pulling issues from poll-github-repo/dummy-repo with label "test-label"`,
        `debug: Pulled a page with 2 issues`,
        `debug: Extracted issue {"number":2,"title":"poll-github-repo/dummy-repo@1234567","url":"https://github.com/poll-github-repo/dummy-repo/issues/2","labels":["test-label","other-label"],"state":"open","createdAt":"2022-03-14T18:33:52Z"}`,
        `debug: Extracted issue {"number":1,"title":"poll-github-repo/dummy-repo@3a84a57","url":"https://github.com/poll-github-repo/dummy-repo/issues/1","labels":["test-label"],"state":"open","createdAt":"2022-03-14T18:33:22Z"}`,
        `endGroup`,
    ])
})

test('it returns an empty list of issues when unknown owner given', async () => {
    const issues = await this.listIssues({
        token: GH_TOKEN,
        owner: 'definitely-unknown-user-42',
        repo: REPO,
        label: 'test-label'
    })

    expect(issues).toEqual([])
    expect(this.core.messages).toEqual([
        `startGroup: Pulling issues from definitely-unknown-user-42/dummy-repo with label "test-label"`,
        `setFaled: Failed to pull data from GitHub: HttpError: Not Found`,
        `endGroup`,
    ])
})

test('it returns an empty list of issues when unknown repo given', async () => {
    const issues = await this.listIssues({
        token: GH_TOKEN,
        owner: OWNER,
        repo: 'unknown-repo',
        label: 'test-label'
    })

    expect(issues).toEqual([])
    expect(this.core.messages).toEqual([
        `startGroup: Pulling issues from poll-github-repo/unknown-repo with label "test-label"`,
        `setFaled: Failed to pull data from GitHub: HttpError: Not Found`,
        `endGroup`,
    ])
})

test('it returns an empty list of issues when unknown label given', async () => {
    const issues = await this.listIssues({
        token: GH_TOKEN,
        owner: OWNER,
        repo: REPO,
        label: 'unknown-label'
    })

    expect(issues).toEqual([])
    expect(this.core.messages).toEqual([
        `startGroup: Pulling issues from poll-github-repo/dummy-repo with label "unknown-label"`,
        `debug: Pulled a page with 0 issues`,
        `endGroup`,
    ])
})

test('it returns an empty issue list when invalid token given', async () => {
    const issues = await this.listIssues({
        token: 'invalid-token',
        owner: OWNER,
        repo: REPO,
        label: 'test-label'
    })

    expect(issues).toEqual([])
    expect(this.core.messages).toEqual([
        `startGroup: Pulling issues from poll-github-repo/dummy-repo with label "test-label"`,
        `setFaled: Failed to pull data from GitHub: HttpError: Bad credentials`,
        `endGroup`,
    ])
})

test('it still returns all issues when there are multiple pages', async () => {
    const issues = await this.listIssues({
        token: GH_TOKEN,
        owner: OWNER,
        repo: REPO,
        label: 'test-label',
        per_page: 1
    })

    expect(issues).toEqual([ISSUE2, ISSUE1])
    expect(this.core.messages).toEqual([
        `startGroup: Pulling issues from poll-github-repo/dummy-repo with label "test-label"`,
        `debug: Pulled a page with 1 issues`,
        `debug: Extracted issue {"number":2,"title":"poll-github-repo/dummy-repo@1234567","url":"https://github.com/poll-github-repo/dummy-repo/issues/2","labels":["test-label","other-label"],"state":"open","createdAt":"2022-03-14T18:33:52Z"}`,
        `debug: Pulled a page with 1 issues`,
        `debug: Extracted issue {"number":1,"title":"poll-github-repo/dummy-repo@3a84a57","url":"https://github.com/poll-github-repo/dummy-repo/issues/1","labels":["test-label"],"state":"open","createdAt":"2022-03-14T18:33:22Z"}`,
        `endGroup`,
    ])
})

test('it returns a subset when SINCE specified', async () => {
    const issues = await this.listIssues({
        token: GH_TOKEN,
        owner: OWNER,
        repo: REPO,
        label: 'test-label',
        since: ISSUE2.createdAt
    })

    expect(issues).toEqual([ISSUE2])
})
