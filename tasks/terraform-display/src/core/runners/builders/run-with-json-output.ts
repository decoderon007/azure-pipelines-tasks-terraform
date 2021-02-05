import { RunnerOptionsBuilder, RunnerOptionsDecorator } from ".";
import { RunnerOptions } from "..";

export default class RunWithJsonOutput extends RunnerOptionsDecorator{
    constructor(builder: RunnerOptionsBuilder, private readonly commandOptions?: string) {
        super(builder);
    }
    async build(): Promise<RunnerOptions> {   
        const options = await this.builder.build();
        const jsonOutputOption = "-json";
        // is not defined already as an arg and not provided in command options input
        if((!options.args || (options.args && options.args.indexOf(jsonOutputOption) === -1)) && (!this.commandOptions || !this.commandOptions.includes(jsonOutputOption))){
            options.args.push(jsonOutputOption);
        }
        return options;
    }
}

declare module "." {
    interface RunnerOptionsBuilder {
        withJsonOutput(this: RunnerOptionsBuilder, commandOptions?: string): RunnerOptionsBuilder;
    }
}

RunnerOptionsBuilder.prototype.withJsonOutput = function(this: RunnerOptionsBuilder, commandOptions?: string): RunnerOptionsBuilder {
    return new RunWithJsonOutput(this, commandOptions);
}