import task = require('azure-pipelines-task-lib/task');
import { injectable } from "inversify";
import "reflect-metadata";

const valueMetadataKey = Symbol("devopsTaskMetadataKey");

enum TaskInputType {
    Default = 1,
    TaskVariable,
    EndpointAuthorizationParameter,
    EndpointDataParameter,
    EndpointAuthorizationScheme
}

class OptionMetadata {
    constructor (
        public type: TaskInputType = TaskInputType.Default,
        public id: string = "",
        public key : string = "",
        public required : boolean = false) {

    }
}

export function taskVariable(id : string, required : boolean = false) :any {
    return function(target : any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata(valueMetadataKey, new OptionMetadata(TaskInputType.TaskVariable, id, "", required), target, propertyKey)
    }
}

export function endpointAuthorizationParameter(id : string, key : string, required : boolean = false) :any {
    return function(target : any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata(valueMetadataKey, new OptionMetadata(TaskInputType.EndpointAuthorizationParameter, id, key, required), target, propertyKey)
    }
}

export function endpointDataParameter(id : string, key : string, required : boolean = false) :any {
    return function(target : any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata(valueMetadataKey, new OptionMetadata(TaskInputType.EndpointDataParameter, id, key, required), target, propertyKey)
    }
}

export function endpointAuthorizationScheme(id : string, required = false) :any {
    return function(target : any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata(valueMetadataKey, new OptionMetadata(TaskInputType.EndpointAuthorizationScheme, id, "", required), target, propertyKey)
    }
}


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

        for (let propertyKey in options) {
            let metadata = Reflect.getMetadata(valueMetadataKey, options, propertyKey) as OptionMetadata;

            let type = metadata && metadata.type || TaskInputType.Default;
            let value : any;

            switch (type) {
                case TaskInputType.Default:
                    value = this.getInputVariableFromProperty(options, propertyKey)
                    break;
                case TaskInputType.TaskVariable:
                    value = task.getTaskVariable(metadata.id);
                    break;
                case TaskInputType.EndpointAuthorizationScheme:
                    value = task.getEndpointAuthorizationScheme(metadata.id, false);
                    break;
                case TaskInputType.EndpointAuthorizationParameter:
                    value = task.getEndpointAuthorizationParameter(metadata.id, metadata.key, false);
                    break;
                case TaskInputType.EndpointDataParameter:
                    value = task.getEndpointDataParameter(metadata.id, metadata.key, false);
                    break;
            }

            this.setProperty(options, propertyKey, value);
        }

        return options;
    }

    private static getInputVariableFromProperty(options : any, id : string) : any{
        let propertyType = this.getTypeofProperty(options, id);

        let value : any;

        switch (propertyType){
            case "string":
                value = task.getInput(id);
                break;
            case "boolean":
                value = task.getBoolInput(id);
                break;
            default:
                value = "";
        }

        return value
    }
}