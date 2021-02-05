import { ITaskContext } from "../..";
import { RunnerOptionsBuilder } from ".";
import { RunnerOptions } from "..";

export default class RunWithTerraform extends RunnerOptionsBuilder {
    constructor(
        private readonly ctx: ITaskContext,
        private readonly command: string,
        private readonly silent?: boolean
    ) {
        super();
    }
    build(): Promise<RunnerOptions> {
        const command = this.command;
        return Promise.resolve(
            new RunnerOptions("terraform", command, this.ctx.cwd, this.silent)
        )
    }
}
