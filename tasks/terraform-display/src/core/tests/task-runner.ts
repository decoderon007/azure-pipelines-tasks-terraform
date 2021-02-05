import intercept from 'intercept-stdout';
import { TaskAnswers } from '.';
import { ITaskResponse, ITask } from "..";

export default class TaskRunner {
    error?: Error;
    response?: ITaskResponse;
    logs: string[] = [];
    constructor(
        private readonly task: ITask,
        private readonly setAnswers: (answers: TaskAnswers) => void
    ) {

    }
    public async run(taskAnswers: TaskAnswers) {     
        this.setAnswers(taskAnswers);
        try{
            //separate the stdout from task and cucumbers test
            const unhook_intercept = intercept((text: string) => {
                this.logs.push(text);
                return '';
            })
            this.response = await this.task.exec();
            unhook_intercept();
        }
        catch(error){
            this.error = error;
        }
    }
}