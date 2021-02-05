export interface ILogger {
    command(name: string, success: boolean, duration: number): void;
    error(error: string | Error, properties?: any): void;
    warning(message: string): void;
    debug(message: string): void;
}

export interface ITaskLoggerLib {
    debug: (message: string) => void;
    error: (message: string) => void;
    warning: (message: string) => void;
}

export { default as ApplicationInsightsLogger } from './ai-logger'
export { default as TaskLogger } from './task-logger'