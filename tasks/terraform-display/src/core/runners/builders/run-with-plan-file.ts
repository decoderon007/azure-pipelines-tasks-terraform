import { RunnerOptionsBuilder, RunnerOptionsDecorator } from ".";
import { RunnerOptions } from "..";

export default class RunWithPlanFile extends RunnerOptionsDecorator{
    constructor(builder: RunnerOptionsBuilder, private readonly planFile: string) {
        super(builder);
    }
    async build(): Promise<RunnerOptions> {   
        const options = await this.builder.build();
        options.args.push(this.planFile);
        return options;
    }
}

declare module "." {
    interface RunnerOptionsBuilder {
        withPlanFile(this: RunnerOptionsBuilder, planOrStateFile: string): RunnerOptionsBuilder;
    }
}

RunnerOptionsBuilder.prototype.withPlanFile = function(this: RunnerOptionsBuilder, planOrStateFile: string): RunnerOptionsBuilder {
    return new RunWithPlanFile(this, planOrStateFile);
}