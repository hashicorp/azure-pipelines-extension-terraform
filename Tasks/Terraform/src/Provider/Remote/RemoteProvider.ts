import { injectable } from "inversify";
import path = require("path");
import fs = require("fs");
import task = require('azure-pipelines-task-lib/task');
import { TerraformProvider } from "../TerraformProvider";
import { TaskOptions } from "../../TaskOptions";
import { RemoteConnectedServiceOptions } from "./RemoteConnectedServiceOptions"
/**
 * Terraform Remote Provider and Backend
 */
@injectable()
export class RemoteProvider extends TerraformProvider {
    private cliConfigFileLocation : string = "";

    constructor(private taskOptions : TaskOptions, private options : RemoteConnectedServiceOptions) {
        super();
    }

    /**
     * Create a terraform.rc file in the temp directory with the appropriate credentials
     */
    public async authenticate() : Promise<{ [key: string]: string; }> {
        var config = `
            credentials "${this.options.backendRemoteUrl}" {
                 token = "${this.options.backendRemoteToken}"
            }
        `;

        this.cliConfigFileLocation = path.join(this.taskOptions.tempDir as string, "terraform.rc");

        fs.writeFileSync(this.cliConfigFileLocation, config);

        return {
            "TF_CLI_CONFIG_FILE ": this.cliConfigFileLocation
        }
    }

    /**
     * Returns an empty object as no config specification is needed with a Remote backend
     */
    public async getBackendConfigOptions(): Promise<{ [key: string]: string; }> {
        return {}
    }
}
