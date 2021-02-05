import { ITaskContext } from ".";

export default class MockTaskContext implements ITaskContext {
    
    cwd: string = "";
    aiInstrumentationKey?: string | undefined;
    allowTelemetryCollection: boolean = true;
    adoOrganizationUri: string = "";
    adoAccessToken: string = "";
    public readonly startedAt: [number, number];
    private _finishedAt: [number, number] | undefined;
    runTime: number = 0;

    constructor() {
        this.startedAt = process.hrtime();
    }
    

    public readonly variables: { [key: string]: { val: string, secret?: boolean }} = {};    

    public setVariable(name: string, val: string, secret?: boolean){
        this.variables[name] = { val, secret };
    }

    get finishedAt(){
        return this._finishedAt;
    }

    public finished() {
        this._finishedAt = process.hrtime(this.startedAt);
        this.runTime = this._finishedAt[1] / 1000000
    }
}