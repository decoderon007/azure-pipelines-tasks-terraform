import { ITerraformDisplayContext } from '../context';
import { IRunner, RunWithTerraform, ITaskAgent } from '../core';

export default class TerraformShow {

    constructor(
        private readonly taskAgent: ITaskAgent,
        private readonly runner: IRunner
    ) {
    }

    async exec(ctx: ITerraformDisplayContext): Promise<number> {
        const options = await new RunWithTerraform(ctx, "show", false)
            .withSecureFile(this.taskAgent, ctx.secureVarsFileId, ctx.secureVarsFileName)
            .withPlanFile(ctx.planFilePath)
            .build();

        const result = await this.runner.exec(options);
        this.taskAgent.attachNewFile(ctx.cwd, "tfplan.txt", result.stdout);
        return result.exitCode;
    }
}