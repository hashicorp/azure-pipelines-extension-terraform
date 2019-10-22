import task = require('azure-pipelines-task-lib/task');
import { injectable } from "inversify";

/**
 * Strong-type accessor for Task configuration
 */
@injectable()
export class Options {

    private getProperty<T, K extends keyof T>(o: T, name: K) {
        return o[name];
    }

    private static getTypeofProperty<T, K extends keyof T>(o: T, name: K) {
        return typeof o[name];
    }

    private static setProperty<T, K extends keyof T>(o: T, name: K, value : any) {
        return o[name] = value;
    }

    /**
     * Returns the parsed value of this config
     */
    public static load<T>(type: { new (): T }) : T {
        let options : T = new type();

        for (let propertyName in options) {
            let propertyType = this.getTypeofProperty(options, propertyName);

            let value : any;

            switch (propertyType){
                case "string":
                    value = task.getInput(propertyName);
                    break;
                case "boolean":
                    value = task.getBoolInput(propertyName);
                    break;
                default:
                    value = "";
            }

            this.setProperty(options, propertyName, value);
        }

        return options;
    }
}