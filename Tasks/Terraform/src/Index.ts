import "reflect-metadata";
import { Container } from "inversify";
import { TaskResult } from "azure-pipelines-task-lib/task";
import task = require('azure-pipelines-task-lib/task');

import { TerraformTask } from './TerraformTask';
import { TerraformCommandRunner } from "./TerraformCommandRunner";
import { TaskOptions } from './TaskOptions';
import { Options } from './Options';

import { TerraformProvider } from "./Provider/TerraformProvider";
import { AzureProvider } from './Provider/Azure/AzureProvider'
import { RemoteProvider } from './Provider/Remote/RemoteProvider'
import { RemoteConnectedServiceOptions } from "./Provider/Remote/RemoteConnectedServiceOptions";
import { AzureOptions } from "./Provider/Azure/AzureOptions"

// Configure DI
let container = new Container();

// Bind Task
container.bind(TerraformTask).toSelf();
container.bind(TerraformCommandRunner).toSelf();

// Bind Options
container.bind<TaskOptions>(TaskOptions).toDynamicValue((context) => {
    return Options.load(TaskOptions); 
});

container.bind<AzureOptions>(AzureOptions).toDynamicValue((context) => {
    return Options.load(AzureOptions); 
});

container.bind<RemoteConnectedServiceOptions>(RemoteConnectedServiceOptions).toDynamicValue((context) => {
    return Options.load(RemoteConnectedServiceOptions); 
});

// Bind Terraform Provider
let options = container.get(TaskOptions);

switch (options.provider || options.backend) {
    case "Azure":
        container.bind(TerraformProvider).to(AzureProvider);
        break;
    case "Remote":
        container.bind(TerraformProvider).to(RemoteProvider)
    default:
        break;
}


// Get and run the task
var terraformTask = container.get<TerraformTask>(TerraformTask);

terraformTask.run().then(function() 
{
    task.setResult(TaskResult.Succeeded, "Terraform successfully ran");
}, function(reason) {
    task.setResult(TaskResult.Failed, "Terraform failed to run" + reason);
});
