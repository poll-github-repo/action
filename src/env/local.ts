import { BaseEnv } from "./base"
import { LocalConfig } from "../localConfig"

export class LocalEnv extends BaseEnv {
}

export async function getLocalEnv(): Promise<BaseEnv> {
    const localConfig = await LocalConfig.read()
    return new LocalEnv(localConfig.env)
}
