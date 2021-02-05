import { TaskLibAnswerExecResult, TaskLibAnswers } from "azure-pipelines-task-lib/mock-answer";

export class TaskAnswers implements TaskLibAnswers {
    checkPath: { [key: string]: boolean; } = {};
    cwd: { [key: string]: string; } = {};
    exec: { [key: string]: TaskLibAnswerExecResult; } = {};
    exist: { [key: string]: boolean; } = {};
    find: { [key: string]: string[]; } = {};
    findMatch: { [key: string]: string[]; } = {};
    ls: { [key: string]: string; } = {};
    osType: { [key: string]: string; } = {};
    stats: { [key: string]: any; } = {};
    which: { [key: string]: string; } = {};
    rmRF: { [key: string]: { success: boolean; }; } = {};    
}