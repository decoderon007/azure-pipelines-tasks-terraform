import { ProxyConfiguration } from "azure-pipelines-task-lib"
import { WriteFileOptions } from "fs";

export interface ITaskAgent {
    downloadSecureFile(secureFileId: string): Promise<string>
    attachNewFile(workingDirectory: string, name: string, content: string): void;
    writeFile(workingDirectory: string, fileName: string, content: string): string;
}

export interface ITaskAgentLib {
    getVariable: (name: string) => string | undefined;
    getEndpointAuthorizationParameter: (id: string, key: string, optional: boolean) => string | undefined;
    getHttpProxyConfiguration: (requestUrl?: string) => ProxyConfiguration | null;
    resolve: (...pathSegments: any[]) => string;
    getSecureFileTicket: (id: string) => string | undefined;
    debug: (message: string) => void;
    error: (message: string) => void;
    warning: (message: string) => void;
    getSecureFileName: (id: string) => string | undefined;
    writeFile: (file: string, data: string | Buffer, options?: BufferEncoding | WriteFileOptions) => void;
    addAttachment: (type: string, name: string, path: string) => void;
}

export { default as AzdoTaskAgent } from './azdo-task-agent';
export { default as MockTaskAgent } from './mock-task-agent';