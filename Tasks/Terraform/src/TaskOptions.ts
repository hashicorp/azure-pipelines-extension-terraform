import task = require('azure-pipelines-task-lib/task');
import { injectable } from "inversify";
import { taskVariable } from "./Options";

 /**
 * Strong-type accessor for Task configuration
 */
@injectable()
export class TaskOptions {

    // Basic
    public command : string = "";
    public provider : string = "";
    public backend : string = "";

    // CLI
    public scriptLocation : string = "";
    public scriptPath : string = "";
    public script : string = "";
    public initialize : boolean = true;

    // Advanced
    public cwd : string = "";
    public args : string = "";

    @taskVariable("Agent.TempDirectory")
    public tempDir : string = "";
}