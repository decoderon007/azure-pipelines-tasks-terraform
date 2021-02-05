import tasks = require("azure-pipelines-task-lib/task");
import { TerraformDisplayContext } from "./context";
import TerraformDisplayTask from "./task";
import { TaskLogger, AzdoToolFactory, AzdoRunner, AzdoTaskAgent, ITaskResponse } from "./core";

const ctx = new TerraformDisplayContext(tasks);
const taskAgent = new AzdoTaskAgent(tasks);
const logger = new TaskLogger(tasks);
const tools = new AzdoToolFactory(tasks);
const runner = new AzdoRunner(tools, logger);
const task = new TerraformDisplayTask(ctx, taskAgent, runner, logger);

task.exec()
.then((res: ITaskResponse) => {
    tasks.setResult(res.result, res.message, true);
}).catch((err) => {
    tasks.error(`TerraformDisplay failed ${err}`)
    tasks.setResult(tasks.TaskResult.Failed, err, true)
});
