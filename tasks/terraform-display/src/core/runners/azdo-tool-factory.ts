import { ITaskToolLib, IToolFactory, IToolRunner } from './index';

export default class AzdoToolFactory implements IToolFactory {
    constructor(private readonly tasks: ITaskToolLib) {
    }
    create(tool: string): IToolRunner {
        const terraformPath = this.tasks.which(tool, true);
        return this.tasks.tool(terraformPath);
    }
}
