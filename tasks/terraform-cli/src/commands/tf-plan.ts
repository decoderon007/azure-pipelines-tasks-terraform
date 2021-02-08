import { CommandResponse, ICommand } from ".";
import { ITaskContext } from "../context";
import { ITerraformProvider } from "../providers";
import AzureRMProvider from "../providers/azurerm";
import { IRunner, RunnerResult } from "../runners";
import { RunWithTerraform } from "../runners/builders";
import { ITaskAgent } from "../task-agent";

export const publishedPlanAttachmentType = "terraform-plan-results";

export class TerraformPlan implements ICommand {
    constructor(
        private readonly taskAgent: ITaskAgent,
        private readonly runner: IRunner
        ) {
    }

    // todo: refactor this so its not repeated in all command handlers
    private getProvider(ctx: ITaskContext): ITerraformProvider | undefined {
        let provider: ITerraformProvider | undefined;
        if(ctx.environmentServiceName){
            provider = new AzureRMProvider(this.runner);
        }
        return provider;
    }

    async exec(ctx: ITaskContext): Promise<CommandResponse> {
        const provider = this.getProvider(ctx);
        const successCodes = this.getPlanSuccessfulExitCodes(ctx.commandOptions)
        const options = await new RunWithTerraform(ctx)            
            .withProvider(ctx, provider)
            .withSecureVarFile(this.taskAgent, ctx.secureVarsFileId, ctx.secureVarsFileName)
            .withCommandOptions(ctx.commandOptions)
            .withSuccessCodes(successCodes)
            .build();
        const result = await this.runner.exec(options);

        this.setPlanHasChangesVariable(ctx, result.exitCode);

        if(ctx.publishPlanResults){
            this.publishPlanResults(ctx, result);
        }

        return result.toCommandResponse();
    }

    private getPlanSuccessfulExitCodes(commandOptions: string | undefined): number[]{
        let successCodes: number[] = [];
        successCodes.push(0);
        if(this.hasDetailedExitCode(commandOptions))
            successCodes.push(2);
        return successCodes;
    }

    private hasDetailedExitCode(commandOptions: string | undefined): boolean{
        return commandOptions !== undefined && commandOptions !== null && commandOptions.indexOf('-detailed-exitcode') > -1;
    }

    private getPlanHasChangesExitCode(commandOptions: string | undefined): number{
        return this.hasDetailedExitCode(commandOptions) ? 2 : 0;
    }

    private setPlanHasChangesVariable(ctx: ITaskContext, exitCode: number): void{
        let planHasChanges:boolean = exitCode === this.getPlanHasChangesExitCode(ctx.commandOptions);
        ctx.setVariable("TERRAFORM_PLAN_HAS_CHANGES", planHasChanges.toString(), false);
    }

    private publishPlanResults(ctx: ITaskContext, result: RunnerResult): void{
        const name = `${ctx.systemStageName}_${ctx.systemJobName}.tfplan`
        this.taskAgent.attachNewFile(ctx.cwd, publishedPlanAttachmentType, name, result.stdout);
    }
}