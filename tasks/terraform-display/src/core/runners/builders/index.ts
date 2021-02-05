import { RunnerOptions } from '..';

export abstract class RunnerOptionsBuilder {
    abstract build(): Promise<RunnerOptions>;
}

export abstract class RunnerOptionsDecorator extends RunnerOptionsBuilder{   
    constructor(protected readonly builder: RunnerOptionsBuilder){        
        super();
    }
}

export { default as RunWithTerraform } from './run-with-terraform';
export { default as RunWithCommandOptions } from './run-with-command-options';
export { default as RunWithSecureFile } from './run-with-secure-file';
export { default as RunWithJsonOutput } from './run-with-json-output';
export { default as RunWithPlanFile } from './run-with-plan-file';
export { default as RunWithoutColor } from './run-without-color';
