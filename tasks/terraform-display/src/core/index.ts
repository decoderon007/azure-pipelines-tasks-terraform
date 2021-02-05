import { TaskResult } from "azure-pipelines-task-lib";
import { WriteFileOptions } from "fs";

export interface ITaskLib{
    getInput: (name: string, required?: boolean | undefined) => string | undefined;
    getBoolInput: (name: string, required?: boolean | undefined) => boolean;
    getEndpointAuthorizationScheme: (id: string, optional: boolean) => string | undefined;
    getEndpointDataParameter: (id: string, key: string, optional: boolean) => string | undefined;
    getEndpointAuthorizationParameter: (id: string, key: string, optional: boolean) => string | undefined;
    getVariable: (name: string) => string | undefined;
    setVariable: (name: string, val: string, secret?: boolean | undefined) => void;
    getSecureFileName: (id: string) => string | undefined;
    debug: (message: string) => void;
    error: (message: string) => void;
    warning: (message: string) => void;
    resolve: (...pathSegments: any[]) => string;
    writeFile: (file: string, data: string | Buffer, options?: BufferEncoding | WriteFileOptions) => void;
    addAttachment: (type: string, name: string, path: string) => void;
    setResult: (result: TaskResult, message: string, done?: boolean) => void;
}

export interface ITaskResponse{
    result: TaskResult;
    message: string
}

export interface ITask {
    exec(): Promise<ITaskResponse>
}

export * from './context'
export * from './loggers'
export * from './runners'
export * from './task-agents'
export * from './tests'