import { Commit } from "../src/pollFileChanges"

// This commit DOES have tracking issue
export const COMMIT1: Commit = {
    date: "2022-03-14T16:23:17Z",
    message: "update data.txt",
    path: "data.txt",
    sha: "3a84a578463d2b0e7f8abf4bd7a131a4ab59adaa",
    url: "https://github.com/poll-github-repo/dummy-repo/commit/3a84a578463d2b0e7f8abf4bd7a131a4ab59adaa",
}

// This commit does NOT have tracking issue
export const COMMIT2: Commit = {
    date: "2022-03-14T16:23:29Z",
    message: "update data.txt (two)",
    path: "data.txt",
    sha: "b6138d0ac3cf8fe1edc6fb48e46fefb990137746",
    url: "https://github.com/poll-github-repo/dummy-repo/commit/b6138d0ac3cf8fe1edc6fb48e46fefb990137746",
}

// This commit does NOT have tracking issue
export const COMMIT3: Commit = {
    date: "2022-03-14T16:23:55Z",
    message: "update data.txt (three)",
    path: "data.txt",
    sha: "a52684431a3fda35c2ac4cde291071a3430f2268",
    url: "https://github.com/poll-github-repo/dummy-repo/commit/a52684431a3fda35c2ac4cde291071a3430f2268",
}
