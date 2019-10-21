import path = require("path");
import fs = require("fs");
import os = require("os");

import { injectable } from "inversify";
import { TerraformCommandRunner } from "./TerraformCommandRunner";
import { TaskOptions } from './TaskOptions';

@injectable()
export class TerraformTask {

    constructor(
        private terraform : TerraformCommandRunner,
        private options: TaskOptions)
    {
        
    }

    public async run() {
        switch(this.options.command) {
            case "init":
                await this.terraform.init(["-input=false"]);
                break;
            case "validate":
                await this.terraform.exec(["validate"], false);
                break;
            case "plan":
                await this.terraform.exec(["plan", "-input=false"]);
                break;
            case "apply":
                await this.terraform.exec(["apply", "-input=false", "-auto-approve"]);
                break;
            case "destroy":
                await this.terraform.exec(["destroy", "-auto-approve=true"]);
                break;
            case "CLI":
                if(this.options.initialize) {
                    await this.terraform.init(["-input=false"]);
                }

                var path = this.initScriptAtPath();
                await this.terraform.cli(path);
                break;
            default:
                throw new Error("Invalid command");
        }
    }

    /**
     * Loads the specified CLI script into a file and returns the path
     */
    private initScriptAtPath(): string {
        let scriptPath: string;

        if (this.options.scriptLocation === "scriptPath") {
            if (!this.options.scriptPath){
                throw new Error("Script path not specified");
            }

            scriptPath = this.options.scriptPath;
        }
        else {
            if (!this.options.script){
                throw new Error("Script not specified");
            }

            var tmpDir = this.options.tempDir || os.tmpdir();

            if (os.type() != "Windows_NT") {
                scriptPath = path.join(tmpDir, "terraformclitaskscript" + new Date().getTime() + ".sh");
            }
            else {
                scriptPath = path.join(tmpDir, "terraformclitaskscript" + new Date().getTime() + ".bat");
            }
            
            this.createFile(scriptPath, this.options.script);
        }

        return scriptPath;
    }

    /**
     * Creates a file from a string at the given path
     */
    private createFile(filePath: string, data: string) {
        try {
            fs.writeFileSync(filePath, data);
        }
        catch (err) {
            this.deleteFile(filePath);
            throw err;
        }
    }

    /**
     * Deletes a file at the given path if it exists
     */
    private deleteFile(filePath: string): void {
        if (fs.existsSync(filePath)) {
            try {
                //delete the publishsetting file created earlier
                fs.unlinkSync(filePath);
            }
            catch (err) {
                //error while deleting should not result in task failure
                console.error(err.toString());
            }
        }
    }
}