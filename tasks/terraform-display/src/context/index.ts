import { AzdoTaskContext, ITaskContext, MockTaskContext } from '../core/context';
import { ITaskLib } from '../core';

export interface ITerraformDisplayContext extends ITaskContext {
    secureVarsFileId: string | undefined;
    secureVarsFileName: string | undefined;
    planFilePath: string;
}

export class TerraformDisplayContext extends AzdoTaskContext implements ITerraformDisplayContext {
    constructor(tasks: ITaskLib) {
        super(tasks);        
    }
    get cwd(){
        return this.getInput("workingDirectory") || "./"
    }    
    get secureVarsFileId(){
        return this.getInput("secureVarsFile");
    }
    get secureVarsFileName(){
        return this.getSecureFileName(this.secureVarsFileId);
    }
    get planFilePath(){
        return this.getInput("planFilePath") || "tfplan";
    }
}

export class MockTerraformDisplayContext extends MockTaskContext implements ITerraformDisplayContext {
    secureVarsFileId: string | undefined = "";    
    secureVarsFileName: string | undefined = "";
    planFilePath: string = "";
}