import { RunnerOptionsBuilder, RunnerOptionsDecorator } from ".";
import { RunnerOptions } from "..";

export default class RunWithoutColor extends RunnerOptionsDecorator{
    constructor(builder: RunnerOptionsBuilder) {
        super(builder);
    }
    async build(): Promise<RunnerOptions> {   
        const options = await this.builder.build();
        const noColorOption = "-no-color";
        if(!options.args || (options.args && options.args.indexOf(noColorOption) === -1)){
            options.args.push(noColorOption);
        }
        return options;
    }
}

declare module "." {
    interface RunnerOptionsBuilder {
        withoutColor(this: RunnerOptionsBuilder): RunnerOptionsBuilder;
    }
}

RunnerOptionsBuilder.prototype.withoutColor = function(this: RunnerOptionsBuilder): RunnerOptionsBuilder {
    return new RunWithoutColor(this);
}