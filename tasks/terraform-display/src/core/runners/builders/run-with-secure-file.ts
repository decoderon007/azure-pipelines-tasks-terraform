import { RunnerOptionsDecorator, RunnerOptionsBuilder } from ".";
import { ITaskAgent } from "../../task-agents";
import { RunnerOptions } from "..";
import * as dotenv from "dotenv"
import path from 'path';

export default class RunWithSecureFile extends RunnerOptionsDecorator{    
    private readonly taskAgent: ITaskAgent;
    private readonly secureFileId: string | undefined;
    private readonly secureFileName: string | undefined;
    constructor(builder: RunnerOptionsBuilder, taskAgent: ITaskAgent, secureFileId?: string | undefined, secureFileName?: string | undefined) {
        super(builder);
        this.taskAgent = taskAgent;
        this.secureFileId = secureFileId;
        this.secureFileName = secureFileName;
    }
    async build(): Promise<RunnerOptions> {        
        const options = await this.builder.build();
        if(this.secureFileId && this.secureFileName){
            let secureFilePath = await this.taskAgent.downloadSecureFile(this.secureFileId);
            if(this.isEnvFile(this.secureFileName)) {
                let config = dotenv.config({ path: secureFilePath }).parsed;
                if ((!config) || (Object.keys(config).length === 0 && config.constructor === Object)) {
                    throw "The .env file doesn't have valid entries.";
                }
            } else {
                if(options.command === 'init' || options.command === 'show') {
                    throw `terraform ${options.command} command supports only env files, no tfvars are allowed during this stage.`;
                }
                secureFilePath = secureFilePath.replace(/ /g, '\\ ');                
                options.addArgs(`-var-file=${secureFilePath}`);
            }
        }
        return options;
    }
    isEnvFile(fileName: string) {
        if (fileName === undefined || fileName === null) return false;
        if (fileName === '.env') return true;
        return ('.env' === path.extname(fileName))
    }
}

declare module "."{
    interface RunnerOptionsBuilder{
        withSecureFile(this: RunnerOptionsBuilder, taskAgent: ITaskAgent, secureFileId?: string | undefined, secureFileName?: string | undefined): RunnerOptionsBuilder;
    }
}

RunnerOptionsBuilder.prototype.withSecureFile = function(this: RunnerOptionsBuilder, taskAgent: ITaskAgent, secureFileId?: string | undefined, secureFileName?: string | undefined): RunnerOptionsBuilder {
    return new RunWithSecureFile(this, taskAgent, secureFileId, secureFileName);
}