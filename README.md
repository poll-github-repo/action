## `poll-github-repo` action

This action can be useful if your repo depends on specific files in other repo and you want to be notified
every time these files are changed.

GitHub actions can be configured to run periodicaly using `on: schedule` setup:

```yaml
on:
  schedule:
    # Run every day
    - cron: '0 1 * * *'
```

Naming:

+ `current repo` - your repository that runs this action
+ `repo-to-sync` - repository that you want to track
+ `target file` - file in `repo-to-sync` that you want to track

The action:

1. retrieves `last sync date` from the `current repo` (filepath is taken from your action configuration). It's just a timestamp stored in ISO format.
2. retrieves all commits from the `repo-to-sync` that modify `target file` and are older than `last sync date` from the previous step.
3. for each commit it creates an issue in the `current repo` according to configured templates.
4. finally, it creates a commit that modifies `last sync date` in the `current repo`

Usage:

```yaml
  - uses: poll-github-repo/action@v1
    with:
        # Repository you want to track
        # Must have a format "owner/repo" (like "facebook/react")
        repo-to-sync: owner/repo

        # Path to the file in <repo-to-sync> that you want to track
        path-to-sync: CHANGELOG.md

        # Path to a local file that stores timestamps of the last check in ISO format.
        # This is required to check only a small subset of changes on every run.
        # NOTE: this file MUST exist before the action runs
        # 2022-03-18T00:33:40Z is an example of what it could contain
        cache-path: .sync/CHANGELOG.md.last-sync

        # Label that is added to every created issue
        tracking-issue-label: upstream-changelog-md

        # Template for tracking issue title (see available placeholders below)
        tracking-issue-title: "Update on {{ path }}: {{ sha-short }}"

        # Template for tracking issue body (see available placeholders below)
        tracking-issue-body: |
            New commit in owner/repo:

            **{{ message }}** [link]({{ url }})
            token: ${{ secrets.GITHUB_TOKEN }}
            yes-create-issues: true

        # GitHub token
        #
        # You can use ${{ secrets.GITHUB_TOKEN }} to create issues/commits
        # using `github-actions` account.
        #
        # Of course, you can generate and pass token
        # of your own GitHub bot if you want to
        token: ${{ secrets.GITHUB_TOKEN }}

        # Special boolean flag that simplifies initial setup
        #
        # When set to `false` the action doesn't do any issues/commit creation,
        # but it still prints what would be created
        #
        # Configure everything, make sure it does what expected and set it to `true`
        yes-create-issues: false
```

Available placeholders:

+ `{{ path }}` - path of the file that is tracked, useful if you track multiple files
+ `{{ sha-short }}` - short (7 chars) SHA of the observed commit
+ `{{ sha-full }}` - full SHA of the observer commit
+ `{{ message }}` - message of the observed commit
+ `{{ commit-date }}` - creation date of the observer commit
+ `{{ url }}` - GitHub URL that points to observer commit

### Example

`poll-github-repo` action has two dummy repositories:

+ [`dummy-source-repo`](https://github.com/poll-github-repo/dummy-source-repo)
+ [`dummy-observer-repo`](https://github.com/poll-github-repo/dummy-observer-repo)

`dummy-source-repo` has `data.txt` file with 3 commits that `dummy-observer-repo` monitors.
Observer repo stores last sync date in [`.last-sync` file](https://github.com/poll-github-repo/dummy-observer-repo/blob/main/.last-sync)

1. [GitHub action on observer repo](https://github.com/poll-github-repo/dummy-observer-repo/blob/main/.github/workflows/test.yml) is configured to create an issue on every commit that modifies `data.txt`
2. Here's the [list of created issues](https://github.com/poll-github-repo/dummy-observer-repo/issues)
3. And here's the output of the action (it will be removed eventually)

<details>
 <summary>Log of the action</summary>

```
2022-03-18T00:33:38.5541373Z ##[group]Run poll-github-repo/action@v1
2022-03-18T00:33:38.5541672Z with:
2022-03-18T00:33:38.5541949Z   repo-to-sync: poll-github-repo/dummy-source-repo
2022-03-18T00:33:38.5542270Z   path-to-sync: data.txt
2022-03-18T00:33:38.5542521Z   cache-path: .last-sync
2022-03-18T00:33:38.5542820Z   tracking-issue-label: upstream-data-txt
2022-03-18T00:33:38.5543251Z   tracking-issue-title: Update on {{ path }}: {{ sha-short }}
2022-03-18T00:33:38.5543709Z   tracking-issue-body: New commit in poll-github-repo/dummy-source-repo:

**{{ message }}** [link]({{ url }})

2022-03-18T00:33:38.5544572Z   token: ***
2022-03-18T00:33:38.5544806Z   yes-create-issues: true
2022-03-18T00:33:38.5545054Z ##[endgroup]
2022-03-18T00:33:38.7645846Z ##[group]Config
2022-03-18T00:33:38.7669072Z {
2022-03-18T00:33:38.7669908Z     "token": "***",
2022-03-18T00:33:38.7670537Z     "currentRepoOwner": "poll-github-repo",
2022-03-18T00:33:38.7670962Z     "currentRepo": "dummy-observer-repo",
2022-03-18T00:33:38.7671414Z     "currentRepoCachePath": ".last-sync",
2022-03-18T00:33:38.7671836Z     "currentRepoLabelToAdd": "upstream-data-txt",
2022-03-18T00:33:38.7672268Z     "repoToSyncOwner": "poll-github-repo",
2022-03-18T00:33:38.7672659Z     "repoToSync": "dummy-source-repo",
2022-03-18T00:33:38.7672945Z     "repoToSyncPath": "data.txt",
2022-03-18T00:33:38.7673419Z     "trackingIssueTemplateTitle": "Update on {{ path }}: {{ sha-short }}",
2022-03-18T00:33:38.7673790Z     "trackingIssueTemplateBody": [
2022-03-18T00:33:38.7674242Z         "New commit in poll-github-repo/dummy-source-repo:",
2022-03-18T00:33:38.7674600Z         "**{{ message }}** [link]({{ url }})"
2022-03-18T00:33:38.7674849Z     ],
2022-03-18T00:33:38.7675083Z     "yesCreateIssues": true
2022-03-18T00:33:38.7675310Z }
2022-03-18T00:33:38.7675806Z ##[endgroup]
2022-03-18T00:33:38.7676255Z ##[group]Fetching last sync date
2022-03-18T00:33:38.9504322Z Last sync date is 2022-03-14T16:23:18Z
2022-03-18T00:33:38.9505613Z ##[endgroup]
2022-03-18T00:33:38.9507029Z ##[group]Fetching commits since 2022-03-14T16:23:18Z
2022-03-18T00:33:38.9724879Z ##[group]Pulling commits from poll-github-repo/dummy-source-repo since="2022-03-14T16:23:18Z", path="data.txt"
2022-03-18T00:33:39.1234840Z Pulled a page with 2 commits
2022-03-18T00:33:39.1238973Z Extracted commit {"path":"data.txt","url":"https://github.com/poll-github-repo/dummy-source-repo/commit/a52684431a3fda35c2ac4cde291071a3430f2268","sha":"a52684431a3fda35c2ac4cde291071a3430f2268","message":"update data.txt (three)","date":"2022-03-14T16:23:55Z"}
2022-03-18T00:33:39.1242529Z Extracted commit {"path":"data.txt","url":"https://github.com/poll-github-repo/dummy-source-repo/commit/b6138d0ac3cf8fe1edc6fb48e46fefb990137746","sha":"b6138d0ac3cf8fe1edc6fb48e46fefb990137746","message":"update data.txt (two)","date":"2022-03-14T16:23:29Z"}
2022-03-18T00:33:39.1245814Z ##[endgroup]
2022-03-18T00:33:39.1249103Z [
2022-03-18T00:33:39.1249548Z     {
2022-03-18T00:33:39.1250418Z         "path": "data.txt",
2022-03-18T00:33:39.1251320Z         "url": "https://github.com/poll-github-repo/dummy-source-repo/commit/a52684431a3fda35c2ac4cde291071a3430f2268",
2022-03-18T00:33:39.1252391Z         "sha": "a52684431a3fda35c2ac4cde291071a3430f2268",
2022-03-18T00:33:39.1252896Z         "message": "update data.txt (three)",
2022-03-18T00:33:39.1253890Z         "date": "2022-03-14T16:23:55Z"
2022-03-18T00:33:39.1254330Z     },
2022-03-18T00:33:39.1255099Z     {
2022-03-18T00:33:39.1255515Z         "path": "data.txt",
2022-03-18T00:33:39.1256744Z         "url": "https://github.com/poll-github-repo/dummy-source-repo/commit/b6138d0ac3cf8fe1edc6fb48e46fefb990137746",
2022-03-18T00:33:39.1257445Z         "sha": "b6138d0ac3cf8fe1edc6fb48e46fefb990137746",
2022-03-18T00:33:39.1258449Z         "message": "update data.txt (two)",
2022-03-18T00:33:39.1259014Z         "date": "2022-03-14T16:23:29Z"
2022-03-18T00:33:39.1259847Z     }
2022-03-18T00:33:39.1260239Z ]
2022-03-18T00:33:39.1261586Z ##[endgroup]
2022-03-18T00:33:39.1265576Z ##[group]Starting rendering
2022-03-18T00:33:39.1272133Z === TITLE
2022-03-18T00:33:39.1274022Z Update on data.txt: a526844
2022-03-18T00:33:39.1275912Z === BODY
2022-03-18T00:33:39.1278432Z New commit in poll-github-repo/dummy-source-repo:
2022-03-18T00:33:39.1279393Z **update data.txt (three)** [link](https://github.com/poll-github-repo/dummy-source-repo/commit/a52684431a3fda35c2ac4cde291071a3430f2268)
2022-03-18T00:33:39.1280747Z === TITLE
2022-03-18T00:33:39.1281228Z Update on data.txt: b6138d0
2022-03-18T00:33:39.1282302Z === BODY
2022-03-18T00:33:39.1284249Z New commit in poll-github-repo/dummy-source-repo:
2022-03-18T00:33:39.1285449Z **update data.txt (two)** [link](https://github.com/poll-github-repo/dummy-source-repo/commit/b6138d0ac3cf8fe1edc6fb48e46fefb990137746)
2022-03-18T00:33:39.1287503Z ##[endgroup]
2022-03-18T00:33:39.1289717Z ##[group]Creating tracking issues
2022-03-18T00:33:39.1343367Z => Creating issue with params {"owner":"poll-github-repo","repo":"dummy-observer-repo","title":"Update on data.txt: a526844","body":"New commit in poll-github-repo/dummy-source-repo:\n**update data.txt (three)** [link](https://github.com/poll-github-repo/dummy-source-repo/commit/a52684431a3fda35c2ac4cde291071a3430f2268)","labels":["upstream-data-txt"]}
2022-03-18T00:33:39.6513042Z <= Created issue {"url":"https://api.github.com/repos/poll-github-repo/dummy-observer-repo/issues/5","repository_url":"https://api.github.com/repos/poll-github-repo/dummy-observer-repo","labels_url":"https://api.github.com/repos/poll-github-repo/dummy-observer-repo/issues/5/labels{/name}","comments_url":"https://api.github.com/repos/poll-github-repo/dummy-observer-repo/issues/5/comments","events_url":"https://api.github.com/repos/poll-github-repo/dummy-observer-repo/issues/5/events","html_url":"https://github.com/poll-github-repo/dummy-observer-repo/issues/5","id":1173058043,"node_id":"I_kwDOHBWrAM5F63H7","number":5,"title":"Update on data.txt: a526844","user":{"login":"github-actions[bot]","id":41898282,"node_id":"MDM6Qm90NDE4OTgyODI=","avatar_url":"https://avatars.githubusercontent.com/in/15368?v=4","gravatar_id":"","url":"https://api.github.com/users/github-actions%5Bbot%5D","html_url":"https://github.com/apps/github-actions","followers_url":"https://api.github.com/users/github-actions%5Bbot%5D/followers","following_url":"https://api.github.com/users/github-actions%5Bbot%5D/following{/other_user}","gists_url":"https://api.github.com/users/github-actions%5Bbot%5D/gists{/gist_id}","starred_url":"https://api.github.com/users/github-actions%5Bbot%5D/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/github-actions%5Bbot%5D/subscriptions","organizations_url":"https://api.github.com/users/github-actions%5Bbot%5D/orgs","repos_url":"https://api.github.com/users/github-actions%5Bbot%5D/repos","events_url":"https://api.github.com/users/github-actions%5Bbot%5D/events{/privacy}","received_events_url":"https://api.github.com/users/github-actions%5Bbot%5D/received_events","type":"Bot","site_admin":false},"labels":[{"id":3940096601,"node_id":"LA_kwDOHBWrAM7q2RpZ","url":"https://api.github.com/repos/poll-github-repo/dummy-observer-repo/labels/upstream-data-txt","name":"upstream-data-txt","color":"ededed","default":false,"description":null}],"state":"open","locked":false,"assignee":null,"assignees":[],"milestone":null,"comments":0,"created_at":"2022-03-18T00:33:39Z","updated_at":"2022-03-18T00:33:39Z","closed_at":null,"author_association":"NONE","active_lock_reason":null,"body":"New commit in poll-github-repo/dummy-source-repo:\n**update data.txt (three)** [link](https://github.com/poll-github-repo/dummy-source-repo/commit/a52684431a3fda35c2ac4cde291071a3430f2268)","closed_by":null,"reactions":{"url":"https://api.github.com/repos/poll-github-repo/dummy-observer-repo/issues/5/reactions","total_count":0,"+1":0,"-1":0,"laugh":0,"hooray":0,"confused":0,"heart":0,"rocket":0,"eyes":0},"timeline_url":"https://api.github.com/repos/poll-github-repo/dummy-observer-repo/issues/5/timeline","performed_via_github_app":null}
2022-03-18T00:33:39.6520919Z => Creating issue with params {"owner":"poll-github-repo","repo":"dummy-observer-repo","title":"Update on data.txt: b6138d0","body":"New commit in poll-github-repo/dummy-source-repo:\n**update data.txt (two)** [link](https://github.com/poll-github-repo/dummy-source-repo/commit/b6138d0ac3cf8fe1edc6fb48e46fefb990137746)","labels":["upstream-data-txt"]}
2022-03-18T00:33:40.1952066Z <= Created issue {"url":"https://api.github.com/repos/poll-github-repo/dummy-observer-repo/issues/6","repository_url":"https://api.github.com/repos/poll-github-repo/dummy-observer-repo","labels_url":"https://api.github.com/repos/poll-github-repo/dummy-observer-repo/issues/6/labels{/name}","comments_url":"https://api.github.com/repos/poll-github-repo/dummy-observer-repo/issues/6/comments","events_url":"https://api.github.com/repos/poll-github-repo/dummy-observer-repo/issues/6/events","html_url":"https://github.com/poll-github-repo/dummy-observer-repo/issues/6","id":1173058044,"node_id":"I_kwDOHBWrAM5F63H8","number":6,"title":"Update on data.txt: b6138d0","user":{"login":"github-actions[bot]","id":41898282,"node_id":"MDM6Qm90NDE4OTgyODI=","avatar_url":"https://avatars.githubusercontent.com/in/15368?v=4","gravatar_id":"","url":"https://api.github.com/users/github-actions%5Bbot%5D","html_url":"https://github.com/apps/github-actions","followers_url":"https://api.github.com/users/github-actions%5Bbot%5D/followers","following_url":"https://api.github.com/users/github-actions%5Bbot%5D/following{/other_user}","gists_url":"https://api.github.com/users/github-actions%5Bbot%5D/gists{/gist_id}","starred_url":"https://api.github.com/users/github-actions%5Bbot%5D/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/github-actions%5Bbot%5D/subscriptions","organizations_url":"https://api.github.com/users/github-actions%5Bbot%5D/orgs","repos_url":"https://api.github.com/users/github-actions%5Bbot%5D/repos","events_url":"https://api.github.com/users/github-actions%5Bbot%5D/events{/privacy}","received_events_url":"https://api.github.com/users/github-actions%5Bbot%5D/received_events","type":"Bot","site_admin":false},"labels":[{"id":3940096601,"node_id":"LA_kwDOHBWrAM7q2RpZ","url":"https://api.github.com/repos/poll-github-repo/dummy-observer-repo/labels/upstream-data-txt","name":"upstream-data-txt","color":"ededed","default":false,"description":null}],"state":"open","locked":false,"assignee":null,"assignees":[],"milestone":null,"comments":0,"created_at":"2022-03-18T00:33:39Z","updated_at":"2022-03-18T00:33:40Z","closed_at":null,"author_association":"NONE","active_lock_reason":null,"body":"New commit in poll-github-repo/dummy-source-repo:\n**update data.txt (two)** [link](https://github.com/poll-github-repo/dummy-source-repo/commit/b6138d0ac3cf8fe1edc6fb48e46fefb990137746)","closed_by":null,"reactions":{"url":"https://api.github.com/repos/poll-github-repo/dummy-observer-repo/issues/6/reactions","total_count":0,"+1":0,"-1":0,"laugh":0,"hooray":0,"confused":0,"heart":0,"rocket":0,"eyes":0},"timeline_url":"https://api.github.com/repos/poll-github-repo/dummy-observer-repo/issues/6/timeline","performed_via_github_app":null}
2022-03-18T00:33:40.1956835Z Created issues:
2022-03-18T00:33:40.1957053Z [
2022-03-18T00:33:40.1957230Z     {
2022-03-18T00:33:40.1957671Z         "number": 5,
2022-03-18T00:33:40.1958290Z         "url": "https://github.com/poll-github-repo/dummy-observer-repo/issues/5"
2022-03-18T00:33:40.1958674Z     },
2022-03-18T00:33:40.1958876Z     {
2022-03-18T00:33:40.1959086Z         "number": 6,
2022-03-18T00:33:40.1959557Z         "url": "https://github.com/poll-github-repo/dummy-observer-repo/issues/6"
2022-03-18T00:33:40.1959898Z     }
2022-03-18T00:33:40.1960076Z ]
2022-03-18T00:33:40.1961183Z ##[endgroup]
2022-03-18T00:33:40.1961631Z ##[group]Saving last sync date
2022-03-18T00:33:40.6872381Z Created commit https://github.com/poll-github-repo/dummy-observer-repo/commit/ec8582dd869bdc870388bf4bb99e8555a157cec6
2022-03-18T00:33:40.6873851Z ##[endgroup]
```

</details>

### Development

1. Clone the repo
2. Run `yarn install` do download dependencies
3. Copy `.env.json.example` to `.env.json` and set `token` to your GitHub token
4. Run `GITHUB_TOKEN=<github token> yarn test` to run tests
5. Run `yarn build` to get a static build in `dist/index.js`
6. Run `yarn build-and-run` to build and run it

You can change `.env.json` as you want, it's under `.gitignore` anyway. Please, **DO NOT** create any spam with this action.
