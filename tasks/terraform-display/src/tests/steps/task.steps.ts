import { binding, then, when } from 'cucumber-tsflow';
import { TableDefinition } from 'cucumber';
import { expect } from 'chai'; 
import { MockTerraformDisplayContext } from '../../context';
import { TaskResult } from 'azure-pipelines-task-lib/task';
import TerraformDisplayTask from '../../task';
import * as tasks from 'azure-pipelines-task-lib/mock-task';
import { setAnswers } from 'azure-pipelines-task-lib/mock-task'
import fs from 'fs';
import { MockTaskAgent, AzdoRunner, MockToolFactory, ITaskLoggerLib, TaskLogger, requestedAnswers, TaskAnswers, TaskRunner } from '../../core';

@binding([TaskAnswers, MockTerraformDisplayContext])
export class TerraformSteps {

    private readonly test: TaskRunner;
    private readonly taskAgent: MockTaskAgent;
    private readonly summaryAttachmentName: string = "summary.json";
    private readonly detailAttachmentName: string = "tfplan.txt";
    
    constructor(
        private answers: TaskAnswers,
        private readonly ctx: MockTerraformDisplayContext) { 
            const toolFactory = new MockToolFactory(tasks);
            this.taskAgent = new MockTaskAgent()
            const logger = new TaskLogger(<ITaskLoggerLib><any>tasks)
            const runner = new AzdoRunner(toolFactory, logger);
            const task = new TerraformDisplayTask(this.ctx, this.taskAgent, runner, logger);
            this.test = new TaskRunner(task, setAnswers);
        }  

    @when("terraform display task is run")
    public async terraformDisplayIsExecuted(){
        try{
            await this.test.run(this.answers);
        }
        catch(err)
        {
            throw err;
        }
    }

    @then("the command {string} was executed")
    public assertExecutedCommand(command: string){
        const executions = requestedAnswers['exec']
        expect(executions).to.not.be.undefined;
        if(executions){
            expect(executions.indexOf(command)).to.be.greaterThan(-1);
        }
    }

    @then("the terraform display task was successful")
    public terraformDisplayTaskWasSuccessful(){
        if(this.test.error){
            throw this.test.error;
        }
        else{
            expect(this.test.response).to.not.be.undefined;
            expect(this.test.error).to.be.undefined;
            if(this.test.response){
                expect(this.test.response.result).to.eq(TaskResult.Succeeded);
            }
        }        
    }

    @then("the plan summary is attached with the following result")
    public planSummaryIsAttachedWithFollowingResult(table: TableDefinition){
        const summaryContent = this.expectAttachmentContent(this.summaryAttachmentName);
        const actualResults = JSON.parse(summaryContent);
        const expectedResults = table.hashes();

        expectedResults.forEach(expectedResult => {
            expect(actualResults[expectedResult.type][expectedResult.action]).to.eq(Number.parseInt(expectedResult.count));
        })
    }

    @then("the plan details are attached with the following content from file {string}")
    public planDetailsAreAttachedWithTheFollowingContentFromFile(filePath: string){
        const actualPlan = this.expectAttachmentContent(this.detailAttachmentName);
        const expectedPlan = fs.readFileSync(filePath, 'utf-8');
        
        expect(actualPlan).to.eq(expectedPlan);
    }

    @then("the terraform display task was run with the following environment variables")
    public terraformDisplayTaskRunWithEnvironmentVariables(table: TableDefinition){
        const expectedEnv = table.rowsHash();
        for(let key in expectedEnv){
            expect(process.env[key]).to.not.be.undefined
            expect(process.env[key]).to.eq(expectedEnv[key]);
        }
    }

    private expectAttachmentContent(name: string){
        const attachment = this.taskAgent.attachedFiles[name];
        expect(attachment).not.does.be.undefined;
        const content = this.taskAgent.writtenFiles[attachment.path];
        expect(content).not.does.be.undefined;
        return content;
    }
}