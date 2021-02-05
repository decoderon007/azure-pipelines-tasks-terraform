import { binding, given } from 'cucumber-tsflow';
import { MockTerraformDisplayContext } from '../../context';

@binding([MockTerraformDisplayContext])
export class TaskContextSteps {
    constructor(private ctx: MockTerraformDisplayContext) { } 

    @given("secure file specified with id {string} and name {string}")
    public inputTerraformSecureVarsFile(id: string, name: string){
        this.ctx.secureVarsFileId = id;
        this.ctx.secureVarsFileName = name;
        process.env[`SECUREFILE_NAME_${id}`] = name;
    }

    @given("the plan file path is {string}")
    public targetPlanOrStateFileIs(planFilePath: string){
        this.ctx.planFilePath = planFilePath;
    }
}   