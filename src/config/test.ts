import { Config } from "."
import { load as loadLocal } from "./local"

export async function load(overrides?: Partial<Config>): Promise<Config> {
    const localConfig = await loadLocal()
    return { ...localConfig, ...overrides }
}
