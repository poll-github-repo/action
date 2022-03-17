import { Inputs } from "../localConfig"

export { Inputs }

export interface ICore {
    startGroup(name: string): void
    debug(message: string): void
    warning(message: string): void
    setFailed(message: string): void
    endGroup(): void
    getInput(name: keyof Inputs, options?: { required?: boolean }): string
}
