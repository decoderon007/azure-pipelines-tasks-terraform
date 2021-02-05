import { ILogger, ITaskLoggerLib } from ".";

export default class TaskLogger implements ILogger {    
    constructor(
        private readonly tasks: ITaskLoggerLib){
    }

    command(name: string, success: boolean, duration: number): void {
        const args = {
            name: name,
            success: success,
            resultCode: success ? 200 : 500,
            duration: duration
        };
        this.tasks.debug(`executed command '${name}' ${args}`)
    }

    error(message: string): void {
        this.tasks.error(message);
    }

    warning(message: string): void {
        this.tasks.warning(message);
    }

    debug(message: string): void {
        this.tasks.debug(message);
    }
}