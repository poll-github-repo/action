const core = require('@actions/core')
const pollFileChanges = require('./pollFileChanges')
const listIssues = require('./listIssues')

import { GH_TOKEN } from '../.env.json'

pollFileChanges(core)({ token: GH_TOKEN, owner: 'poll-github-repo', repo: 'dummy-repo', path: 'data.txt' })
    .then(data => console.log(data))

listIssues(core)({ token: GH_TOKEN, owner: 'poll-github-repo', repo: 'dummy-repo', label: 'test-label' })
    .then(data => console.log(data))
