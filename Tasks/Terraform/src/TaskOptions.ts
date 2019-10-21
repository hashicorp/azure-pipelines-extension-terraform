import task = require('azure-pipelines-task-lib/task');
import { injectable } from "inversify";
import { TerraformProviderType } from "./Provider/TerraformProviderType"

/**
 * Strong-type accessor for Task configuration
 */
@injectable()
export class TaskOptions {

    // Basic
    readonly command : string | undefined;
    readonly provider : string | undefined;
    readonly backend : string | undefined;

    // Azure
    readonly providerAzureConnectedServiceName : string | undefined;
    readonly backendAzureUseProviderConnectedServiceForBackend : boolean | undefined;
    readonly backendAzureConnectedServiceName : string | undefined;
    readonly backendAzureStorageAccountName : string | undefined;
    readonly backendAzureProviderStorageAccountName : string | undefined;
    readonly backendAzureContainerName : string | undefined;
    readonly backendAzureStateFileKey : string | undefined;

    // CLI
    readonly scriptLocation : string | undefined;
    readonly scriptPath : string | undefined;
    readonly script : string | undefined;
    readonly initialize : boolean | undefined;

    // Advanced
    readonly cwd : string | undefined;
    readonly args : string | undefined;
    readonly tempDir : string | undefined;
    readonly terraformProviderType : TerraformProviderType;

    /**
     * Creates and loads a well-formed options object
     */
    constructor() {
        // This can be massively improved, it should be automatic
        this.provider = task.getInput("provider", true);
        this.command = task.getInput("command", true);
        
        this.backend = task.getInput("backend");

        // Azure Backend
        this.providerAzureConnectedServiceName = task.getInput("providerAzureConnectedServiceName")
        this.backendAzureUseProviderConnectedServiceForBackend = task.getBoolInput("backendAzureUseProviderConnectedServiceForBackend");
        this.backendAzureConnectedServiceName = task.getInput("backendAzureConnectedServiceName")
        this.backendAzureStorageAccountName = task.getInput("backendAzureStorageAccountName")
        this.backendAzureProviderStorageAccountName = task.getInput("backendAzureProviderStorageAccountName")
        this.backendAzureContainerName = task.getInput("backendAzureContainerName")
        this.backendAzureStateFileKey = task.getInput("backendAzureStateFileKey")

        // CLI
        this.initialize = task.getInput("initialize") === "true";
        this.scriptLocation = task.getInput("scriptLocation");
        this.scriptPath = task.getInput("scriptPath");
        this.script = task.getInput("script");
        this.initialize = task.getBoolInput("initialize");

        // Advanced Task Options
        this.args = task.getInput("args");
        this.cwd = task.getInput("cwd");

        // System Variables
        this.tempDir = task.getVariable("Agent.TempDirectory");

        // Provider
        switch (task.getInput("providerType")) {
            case "Azure":
                this.terraformProviderType = TerraformProviderType.Azure;
                break;
            case "AWS":
                this.terraformProviderType = TerraformProviderType.Aws;
                break;
            case "GCP":
                this.terraformProviderType = TerraformProviderType.Gcp;
                break;
            case "Remote":
                this.terraformProviderType = TerraformProviderType.Remote;
                break;
            default:
                this.terraformProviderType = TerraformProviderType.Unknown;
        }
    }
}