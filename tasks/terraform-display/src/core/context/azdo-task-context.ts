import { ITaskContext } from ".";
import { ITaskLib } from "..";

export default class AzdoTaskContext implements ITaskContext {
    protected getInput: (name: string, required?: boolean | undefined) => string;
    protected getBoolInput: (name: string, required?: boolean | undefined) => boolean;
    protected getEndpointAuthorizationScheme: (id: string, optional: boolean) => string;
    protected getEndpointDataParameter: (id: string, key: string, optional: boolean) => string;
    protected getEndpointAuthorizationParameter: (id: string, key: string, optional: boolean) => string;
    protected getVariable: (name: string) => string | undefined;     
    protected getSecureFileName: (id: string) => string | undefined;
    public setVariable: (name: string, val: string, secret?: boolean | undefined) => void;
    public startedAt: [number, number];
    public finishedAt: [number, number] | undefined;
    public runTime: number = 0;
    constructor(tasks: ITaskLib) {
        this.getInput = <(name: string, required?: boolean | undefined) => string>tasks.getInput;
        this.getBoolInput = tasks.getBoolInput;
        this.getEndpointAuthorizationScheme = <(id: string, optional: boolean) => string>tasks.getEndpointAuthorizationScheme;
        this.getEndpointDataParameter = <(id: string, key: string, optional: boolean) => string>tasks.getEndpointDataParameter;
        this.getEndpointAuthorizationParameter = <(id: string, key: string, optional: boolean) => string>tasks.getEndpointAuthorizationParameter;
        this.setVariable = tasks.setVariable;
        this.getVariable = tasks.getVariable;        
        this.getSecureFileName = <(id: string) => string>tasks.getSecureFileName;
        this.startedAt = process.hrtime();
    }
    get cwd() {
        return this.getInput("workingDirectory");
    }
    get aiInstrumentationKey() {
        return this.getInput("aiInstrumentationKey");
    }
    get allowTelemetryCollection() {
        return this.getBoolInput("allowTelemetryCollection");
    }
    get adoOrganizationUri() {
        return this.getVariable('System.TeamFoundationCollectionUri') || ""
    }
    get adoAccessToken() {
        return this.getEndpointAuthorizationParameter('SYSTEMVSSCONNECTION', 'ACCESSTOKEN', false) || "";
    }
    finished() {
        this.finishedAt = process.hrtime(this.startedAt);
        this.runTime = this.finishedAt[1] / 1000000;
    }
}