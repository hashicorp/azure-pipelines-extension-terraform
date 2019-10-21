import "reflect-metadata";
import { Container } from "inversify";
import { TaskResult } from "azure-pipelines-task-lib/task";
import task = require('azure-pipelines-task-lib/task');

import { TerraformTask } from './TerraformTask';
import { TerraformCommandRunner } from "./TerraformCommandRunner";
import { TaskOptions } from './TaskOptions';

import { AzureProvider } from './Provider/Azure/AzureProvider'
import { TerraformProvider } from "./Provider/TerraformProvider";
import { TerraformProviderType } from "./Provider/TerraformProviderType";

import { TYPES } from "./types";

let container = new Container();
let options = new TaskOptions();

container.bind(TerraformTask).toSelf()
container.bind(TaskOptions).toSelf()
container.bind(TerraformCommandRunner).toSelf();

container.bind(AzureProvider).toSelf()

// switch (options.terraformProviderType) {
//     case TerraformProviderType.Azure:
//         container.bind(AzureProvider).to(AzureProvider);
//         break;
//     default:
//         break;
// }


var terraformTask = container.get<TerraformTask>(TerraformTask);

terraformTask.run().then(function() 
{
    task.setResult(TaskResult.Succeeded, "Terraform successfully ran");
}, function() {
    task.setResult(TaskResult.Failed, "Terraform failed to run");
});
