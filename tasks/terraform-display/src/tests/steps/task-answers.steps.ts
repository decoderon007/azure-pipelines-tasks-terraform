import { resetRequestedAnswers, TaskAnswers } from '../../core'
import { binding, given, after } from 'cucumber-tsflow';
import mock from 'mock-require';
import { TaskLibAnswerExecResult } from 'azure-pipelines-task-lib/mock-answer';
import fs from 'fs';

// this must be run before `import * as tasks from 'azure-pipelines-task-lib/mock-task'` is run
// otherwise the mock-task will use the actual instance of mock-answer and the tests will not be 
// able to intercept and record the requests.
mock("azure-pipelines-task-lib/mock-answer", '../../core/tests/mock-answer-spy');

@binding([TaskAnswers])
export class TaskAnswersSteps {
    constructor(private answers: TaskAnswers) { }
    @after()
    public clearExecutedCommandsSpy() {
        resetRequestedAnswers();
    }

    @given("terraform not exists")
    public answerTerraformNotExists() {
        this.answerToolExists("terraform", false);
    }

    @given("terraform exists")
    public answerTerraformExists() {
        this.answerToolExists("terraform", true);
    }

    @given("running command {string} returns successful result")
    public runningCommandReturnsSuccessfulResult(command: string) {
        this.answers.exec[command] = <TaskLibAnswerExecResult>{
            stderr: '',
            stdout: `${command} run successful`,
            code: 0
        }
    }

    @given("running command {string} returns successful result with stdout from file {string}")
    public runningCommandReturnsSuccessfulResultWithStdOutFromJsonFile(command: string, filePath: string){
        const stdout = fs.readFileSync(filePath, 'utf-8');
        this.answers.exec[command] = <TaskLibAnswerExecResult>{
            stderr: '',
            stdout: stdout,
            code: 0
        }         
    }

    private answerToolExists(tool: string, exists: boolean) {
        this.answers.which[tool] = tool;
        this.answers.checkPath = this.answers.checkPath || {};
        this.answers.checkPath[tool] = exists;
        if (exists) {
            this.answers.exec[`${tool} version`] = <TaskLibAnswerExecResult>{
                code: 0,
                stdout: `version successful`
            }
        }
    }
}