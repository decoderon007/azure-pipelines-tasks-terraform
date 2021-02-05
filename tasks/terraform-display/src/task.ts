import { TaskResult } from 'azure-pipelines-task-lib'
import { TerraformShow, TerraformShowSummary } from './commands'
import { ITerraformDisplayContext } from "./context";
import { ITask, ITaskResponse } from "./core";
import { ILogger } from "./core/loggers";
import { ITaskAgent } from "./core/task-agents";
import { IRunner } from "./core/runners";

export default class TerraformDisplayTask implements ITask{
    private readonly plain: TerraformShow;
    private readonly json: TerraformShowSummary;
    constructor(
        private readonly ctx: ITerraformDisplayContext,
        taskAgent: ITaskAgent,
        runner: IRunner,
        private readonly logger: ILogger) {
            this.plain = new TerraformShow(taskAgent, runner)
            this.json = new TerraformShowSummary(taskAgent, runner, logger);
    }

    async exec(): Promise<ITaskResponse> {
        try{
            await Promise.all([
                this.json.exec(this.ctx),
                this.plain.exec(this.ctx)
            ])
            return <ITaskResponse>{
                result: TaskResult.Succeeded,
                message: ""
            }
        }
        catch(err){
            this.logger.error(`TerraformDisplay failed ${err}`)
            return <ITaskResponse>{
                result: TaskResult.Failed,
                message: err
            }
        }
    }

}