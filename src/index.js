const core = require('@actions/core')
const pollFileChanges = require('./pollFileChanges')

import { GH_TOKEN } from '../.env.json'
pollFileChanges(core)({ token: GH_TOKEN, owner: 'poll-github-repo', repo: 'dummy-repo', path: 'data.txt' })
    .then(data => console.log(data))
