import { MockAnswers as MockLibAnswers, TaskLibAnswers, MockedCommand} from 'azure-pipelines-task-lib/mock-answer'

export const requestedAnswers: { [key: string]: string[] } = {};

export class MockAnswers {
    private readonly mockAnswers: MockLibAnswers;
    constructor(){
        this.mockAnswers = new MockLibAnswers();
    }

    public initialize(answers: TaskLibAnswers){
        this.mockAnswers.initialize(answers);
    }

    public getResponse(cmd: MockedCommand, key: string, debug: (message: string) => void): any {
        if(!requestedAnswers[cmd]){
            requestedAnswers[cmd] = [];
        }
        requestedAnswers[cmd].push(key);
        let response = this.mockAnswers.getResponse(cmd, key, debug);
        if(!response && cmd == `exec`){
            throw new Error(`No exec answer found for command "${key}". Make sure to mock answer for commands!`);
        }
        return response;
    }
}

export function resetRequestedAnswers(){
    for(let k in requestedAnswers){
        delete requestedAnswers[k];
    }
}