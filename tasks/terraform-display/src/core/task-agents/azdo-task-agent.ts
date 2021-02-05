import fs from 'fs';
import Q from 'q';
import { WebApi, getPersonalAccessTokenHandler } from 'azure-devops-node-api';
import { ITaskAgentApi } from 'azure-devops-node-api/TaskAgentApi';
import { ITaskAgent, ITaskAgentLib } from '.';

export default class TaskAgent implements ITaskAgent {
    private readonly api: WebApi;

    constructor(private readonly tasks: ITaskAgentLib) {

        const url = tasks.getVariable('System.TeamFoundationCollectionUri') || "";
        const credentials = tasks.getEndpointAuthorizationParameter('SYSTEMVSSCONNECTION', 'ACCESSTOKEN', false) || "";
        const authHandler = getPersonalAccessTokenHandler(credentials);

        const proxy = tasks.getHttpProxyConfiguration();
        const options = proxy ? { proxy, ignoreSslError: true } : undefined;
        
        this.api = new WebApi(url, authHandler, options);
    }

    async downloadSecureFile(secureFileId: string): Promise<string>{
        const fileName = this.tasks.getSecureFileName(secureFileId);
        this.tasks.debug(`Secure file id '${secureFileId}' resolved as file '${fileName}'`)
        const filePath = this.tasks.resolve(this.tasks.getVariable('Agent.TempDirectory'), fileName);
        this.tasks.debug(`Ensuring secure file available on agent at path: ${filePath}`);
        if(fs.existsSync(filePath)){
            this.tasks.debug('Secure file already exists at target path. Skipping download.');
        }
        else{
            const agent: ITaskAgentApi = await this.api.getTaskAgentApi();
            const file: NodeJS.WritableStream = fs.createWriteStream(filePath);
            const ticket = this.tasks.getSecureFileTicket(secureFileId);
            if(!ticket){
                throw new Error(`Download ticket for SecureFileId ${secureFileId} not found.`);
            }
            const project = this.tasks.getVariable('SYSTEM.TEAMPROJECT') || "";
            const stream: NodeJS.WritableStream = (await agent.downloadSecureFile(project, secureFileId, ticket, false)).pipe(file);
            const deferred = Q.defer();
            stream.on('finish', () => { deferred.resolve(); });
            await deferred.promise;
        }
        this.tasks.debug(`Secure file available at: ${filePath}`);
        return filePath;
    }

    attachNewFile(workingDirectory: string, name: string, content: string){
        const filePath = this.writeFile(workingDirectory, name, content);
        this.tasks.addAttachment(name, name, filePath);
    }

    writeFile(workingDirectory: string, fileName: string, content: string): string {
        const filePath = this.tasks.resolve(workingDirectory, fileName);
        this.tasks.writeFile(filePath, content);
        return filePath;
    }
}