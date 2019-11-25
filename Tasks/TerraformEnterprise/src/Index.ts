import "reflect-metadata";
import { Container } from "inversify";
import { TaskResult } from "azure-pipelines-task-lib/task";
import task = require('azure-pipelines-task-lib/task');

import { TerraformEnterpriseTask } from './TerraformEnterpriseTask';
import { TerraformApi } from "./TerraformApi";
import { TaskOptions } from './TaskOptions';



let container = new Container();
let options = new TaskOptions();

container.bind(TerraformEnterpriseTask).toSelf()
container.bind(TaskOptions).toSelf()
container.bind(TerraformApi).toSelf();



var terraformEnterpriseTask = container.get<TerraformEnterpriseTask>(TerraformEnterpriseTask);

terraformEnterpriseTask.run().then(function() 
{
    task.setResult(TaskResult.Succeeded, "Terraform successfully ran");
}, function() {
    task.setResult(TaskResult.Failed, "Terraform failed to run");
});
