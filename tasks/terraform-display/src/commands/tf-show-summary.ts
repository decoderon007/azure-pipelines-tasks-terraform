import { ILogger, ITaskAgent, IRunner, RunWithTerraform } from '../core';
import { ITerraformDisplayContext } from '../context';

interface ActionSummary {
    toCreate: number
    toDelete: number
    toUpdate: number
    unchanged: number
}

interface PlanSummary {
    resources: ActionSummary | undefined
    outputs: ActionSummary | undefined
}

export default class TerraformShowSummary {
    private readonly produceWarningsAtSummary: boolean = true

    constructor(
        private readonly taskAgent: ITaskAgent,
        private readonly runner: IRunner, 
        private readonly logger: ILogger
        ) {
    }

    async exec(ctx: ITerraformDisplayContext): Promise<number> {        
        const options = await new RunWithTerraform(ctx, "show", true)
            .withSecureFile(this.taskAgent, ctx.secureVarsFileId, ctx.secureVarsFileName)    
            .withJsonOutput()
            .withoutColor()
            .withPlanFile(ctx.planFilePath)
            .build();

        const result = await this.runner.exec(options);
        const summary = this.getPlanSummary(result.stdout);
        if (this.produceWarningsAtSummary && summary) { this.produceWarnings(summary) }
        this.taskAgent.attachNewFile(ctx.cwd, "summary.json", JSON.stringify(summary));
        return result.exitCode;
    }

    private getPlanSummary(planJson: string): PlanSummary | undefined {
        const summary: PlanSummary = {
            resources: undefined,
            outputs: undefined
        }

        const jsonResult = JSON.parse(planJson.replace(/(\r\n|\r|\n)/gm, ""));
        if (!jsonResult) {
            this.logger.error("Failed to parse JSON plan output.")
            return undefined
        }

        if (!jsonResult.format_version) {
            this.logger.warning("Terraform show json output does not have format_version key. Task code update might be required.")
        } else {
            this.logger.debug(`Getting values from plan json version: ${jsonResult.format_version}.`)
        }

        const resources: Array<any> = jsonResult.resource_changes as Array<any>
        if (!resources) {
            this.logger.debug("There is no 'resources' key in plan json. The plan does not have any resources defined.")
            summary.resources = { toCreate: 0, toUpdate: 0, toDelete: 0, unchanged: 0 } // -1 to report unknow, because there is no way to calculate that.
        } else {
            summary.resources = this.getChanges(resources, (resource: any) => { return resource.change.actions || [] })
        }

        if (!jsonResult.output_changes) {
            this.logger.debug("No 'output_changes' key in the json plan, outputs are not defined for the plan.")
            summary.outputs = { toCreate: 0, toUpdate: 0, toDelete: 0, unchanged: 0 }
        } else {
            const outputs: Array<any> = Object.keys(jsonResult.output_changes).map((key) => { return jsonResult.output_changes[key] })
            summary.outputs = this.getChanges(outputs, (resource: any) => { return resource.actions || [] })
        }

        this.logger.debug("Calculated the following summary: " + JSON.stringify(summary))

        return summary
    }

    private getChanges(items: Array<any>, fetchActions: (obj: any) => Array<string>) {
        let summary: ActionSummary = {
            toCreate: 0,
            toDelete: 0,
            toUpdate: 0,
            unchanged: 0,
        }
        let errors: Boolean = false

        for (let item of items) {
            const actions = fetchActions(item)
            if (actions.length > 0) {
                for (let action of actions) {
                    summary = this.updateSummary(action, summary)
                }
            } else {
                this.logger.debug("Got empty actions array. It is possible that plan json schema is different.")
                errors = true
            }
        }

        return summary

    }

    private updateSummary(action: string, summary: ActionSummary): ActionSummary {
        switch (action) {
            case "no-op":
                summary.unchanged++
                break
            case "delete":
                summary.toDelete++
                break
            case "create":
                summary.toCreate++
                break
            case "update":
                summary.toUpdate++
                break
        }
        return summary
    }

    private produceWarnings(s: PlanSummary): void {
        this.planWarningLine("destroy", s.resources ? s.resources.toDelete : -1, s.outputs ? s.outputs.toDelete : -1)
        this.planWarningLine("update", s.resources ? s.resources.toUpdate : -1, s.outputs ? s.outputs.toUpdate : -1)
        this.planWarningLine("create", s.resources ? s.resources.toCreate : -1, s.outputs ? s.outputs.toCreate : -1)
    }

    private planWarningLine(t: string, resources: number, outputs: number) {
        const l: string = `This plan is going to ${t} ${this.getStr(resources, 'resource')} and ${this.getStr(outputs, 'output')}.`
        if (resources != 0 || outputs != 0) {
            this.logger.warning(l)
        }
    }

    private getStr(i: number, w: string): string {
        let m = "unknown amount of"
        let s = "s"
        if (i >= 0) {
            m = `${i}`
            if (i == 1) { s = '' }
        }

        return `${m} ${w}${s}`
    }
}