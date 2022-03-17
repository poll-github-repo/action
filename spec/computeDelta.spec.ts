import { computeDeltaWithCore } from "../src/computeDelta"
import { getTestCore, InputOverrides, getMessages } from "../src/core/dummy"
import { COMMIT1, COMMIT2, COMMIT3 } from "./commits"
import { ISSUE1, ISSUE2 } from "./issues"

async function setup(overrides?: InputOverrides) {
    const core = await getTestCore(overrides)
    const computeDelta = computeDeltaWithCore(core)
    return { core, computeDelta }
}

describe("when matching by sha-short strategy", () => {
    it.concurrent("returns commits that have no issues with their short SHAs", async () => {
        const { core, computeDelta } = await setup({ "matching-strategy": "sha-short" })

        const delta = computeDelta([COMMIT1, COMMIT2, COMMIT3], [ISSUE1, ISSUE2])
        expect(delta).toEqual([COMMIT2, COMMIT3])

        expect(getMessages(core)).toEqual([])
    })
})

describe("when matching by sha-short strategy", () => {
    it.concurrent("returns all commits because there are no issues with full SHA in title", async () => {
        const { core, computeDelta } = await setup({ "matching-strategy": "sha-full" })

        const delta = computeDelta([COMMIT1, COMMIT2, COMMIT3], [ISSUE1, ISSUE2])
        expect(delta).toEqual([COMMIT1, COMMIT2, COMMIT3])

        expect(getMessages(core)).toEqual([])
    })
})

describe("when matching by unknown strategy", () => {
    it.concurrent("returns an error", async () => {
        const { core, computeDelta } = await setup({ "matching-strategy": "unknown" } as unknown as InputOverrides)

        const delta = computeDelta([COMMIT1, COMMIT2, COMMIT3], [ISSUE1, ISSUE2])
        expect(delta).toEqual([])

        expect(getMessages(core)).toEqual([
            `setFaled: Unsupported "matching-strategy" input unknown (supported are: sha-short, sha-full)`
        ])
    })
})
