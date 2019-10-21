// import { injectable } from "inversify";
// import path = require("path");
// import fs = require("fs");
// import task = require('azure-pipelines-task-lib/task');
// import { TerraformProvider } from "../TerraformProvider";
// import { TaskOptions } from "../../TaskOptions";
// import { RemoteConnectedServiceOptions } from "./RemoteConnectedServiceOptions"
// /**
//  * Terraform Remote Provider and Backend
//  */
// @injectable()
// export class RemoteProvider extends TerraformProvider {
//     private cliConfigFileLocation : string = "";

//     constructor(private options : TaskOptions) {
//         super();
//     }

//     /**
//      * Create a terraform.rc file in the temp directory with the appropriate credentials
//      */
//     public async configure(): Promise<void> {
//        let remoteOptions = new RemoteConnectedServiceOptions(this.options.ConnectedServiceName);

//         var config = `
//             credentials "${remoteOptions.url}" {
//                  token = "${remoteOptions.token}"
//             }
//         `;

//         this.cliConfigFileLocation = path.join(this.options.TempDir, "terraform.rc");

//         fs.writeFileSync(this.cliConfigFileLocation, config);
//     }

//     /**
//      * Return environment varialbes specifying where to find the terraformrc file
//      */
//     public async getEnv(): Promise<{ [key: string]: string; }> {
//         return {
//             TF_CLI_CONFIG_FILE: this.cliConfigFileLocation
//         };
//     }

//     /**
//      * Returns an empty object as no config specification is needed with a Remote backend
//      */
//     public async getBackendConfig(): Promise<{ [key: string]: string; }> {
//         return {}
//     }
// }
