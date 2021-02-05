import { IMockTaskToolLib, IToolFactory, IToolRunner } from './index';

export default class MockToolFactory implements IToolFactory {
    constructor(private readonly tasks: IMockTaskToolLib) {
    }
    create(tool: string): IToolRunner {        
        const terraformPath = this.tasks.which(tool, true);
        return <IToolRunner>this.tasks.tool(terraformPath);
    }
}