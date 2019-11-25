import path = require("path");
import fs = require("fs");
import os = require("os");

import { injectable } from "inversify";
import { TerraformApi } from "./TerraformApi";
import { TaskOptions } from './TaskOptions';

@injectable()
export class TerraformEnterpriseTask {

    constructor(
        private terraformapi : TerraformApi,
        private options: TaskOptions)
    {
        
    }

    public async run() {
        console.log(this.options.command);
        switch(this.options.command) {
           case "lookup":
                switch(this.options.lookupcommand) {
                    case "workspaceId":
                        var workspacelookupurl = "/organizations/" + this.options.organization + "/workspaces/" + this.options.workspace;
                        var workspaceId = await this.terraformapi.workspaceIdLookup(workspacelookupurl)
                        return workspaceId;
                        break;
                    case "latestRunId":
                        var workspacelookupurl = "/organizations/" + this.options.organization + "/workspaces/" + this.options.workspace;
                        var workspaceId = await this.terraformapi.workspaceIdLookup(workspacelookupurl)
                        var runlookupurl = "/workspaces/" + workspaceId + "/runs?page%5Bsize%5D=1";
                        var runId = await this.terraformapi.latestRunIdLookup(runlookupurl);
                        console.log(runId);
                        return runId;
                        break;
                    case "variableId":
                        const variablekey = "" + this.options.variablekey;
                        var variablelookupurl = "/vars?filter%5Borganization%5D%5Bname%5D=" + this.options.organization + "&filter%5Bworkspace%5D%5Bname%5D=" + this.options.workspace;
                        var variableId = await this.terraformapi.variableIdLookup(variablelookupurl, variablekey);
                        return variableId;
                    default: 
                        console.log("Invalid lookup command");
                        throw new Error("Invalid lookup command");
                        break;
                 }
                 break;
           case "workspace":
                switch(this.options.workspacecommand) {
                    case "create":
                        console.log('create');
                        var method = 'post';
                        var endpoint = '/workspaces';
                        var payload = this.workspacePayload();
                        break;
                    case "update":
                        var method = 'patch';
                        var endpoint = '/workspaces/' + this.options.workspace;
                        var payload = this.workspacePayload();
                        break;
                    case "delete":
                        var method = 'delete';
                        var endpoint = '/workspaces/' + this.options.workspace;
                        var payload = this.workspacePayload();
                        break;
                    default:
                        console.log("Invalid workspace command");
                        throw new Error("Invalid workspace command");
                        break;
                }

                console.log('workspace');
                console.log('payload');
                var url = "/organizations/" + this.options.organization + endpoint;
                console.log(url);
                await this.terraformapi.call(url, method, JSON.stringify(payload));
                break;
            case "run":
                console.log('run');
                switch(this.options.runcommand) {
                    case "create":
                        console.log('create');
                        const runconfigversion = this.options.runconfigversion;
                        const runisdestroy = this.options.runisdestroy;
                        const runmessage = this.options.runmessage;
                        var url = '/runs';
                        var workspacelookupurl = "/organizations/" + this.options.organization + "/workspaces/" + this.options.workspace;
                        var method = 'post';
                        var attributes:any = {};
                        var relationshipsworkspacedata:any = {};
                        var relationshipsworkspace:any = {};
                        var relationshipsconfigversiondata:any = {};
                        var relationshipsconfigversion:any = {};
                        var relationships:any = {};
                        var payloaddata:any = {};
                        var payload:any = {};
                        console.log("Calling workspace lookup");
                        var workspaceId = await this.terraformapi.workspaceIdLookup(workspacelookupurl)
                        console.log(workspaceId);
                        relationshipsworkspacedata["type"] = "workspaces";
                        relationshipsworkspacedata["id"] = workspaceId;
                        relationshipsworkspace["data"] = relationshipsworkspacedata;
                        relationships["workspace"] = relationshipsworkspace;
                        if ( runconfigversion ) {
                            relationshipsconfigversiondata["type"] = "configuration-versions";
                            relationshipsconfigversiondata["id"] = runconfigversion;
                            relationshipsconfigversion["data"] = relationshipsconfigversiondata;
                            relationships["configuration-version"] = relationshipsconfigversion;
                        }
                        console.log(relationships);
                        if ( runisdestroy === true ) {
                            attributes["is-destroy"] = runisdestroy
                        }
                        if ( runmessage ) {
                            attributes["message"] = runmessage
                        }
                        console.log(attributes);
                        payloaddata["attributes"] = attributes;
                        payloaddata["relationships"] = relationships;
                        payloaddata["type"] = "runs";
                        payload["data"] = payloaddata;
                        console.log(payload);
                        await this.terraformapi.call(url, method, JSON.stringify(payload));
                        break;
                    case "apply":
                        console.log('apply');
                        const runid = this.options.runid;
                        const runapplycomment = this.options.runapplycomment;
                        var url = '/runs/' + runid + '/actions/apply';
                        var method = 'post';
                        var payload:any = {};
                        if ( runapplycomment ) {
                            payload["comment"] = runapplycomment;
                        }
                        await this.terraformapi.call(url, method, JSON.stringify(payload));
                        break;
                    default:
                         console.log("Invalid command");
                         throw new Error("Invalid command");
                         break;
                }
                break;
            case "variable":
                console.log('variable');
                switch(this.options.variablecommand) {
                    case "create":
                        console.log('create');
                        var method = 'post';
                        var url = '/vars';
                        var workspacelookupurl = "/organizations/" + this.options.organization + "/workspaces/" + this.options.workspace;
                        var workspaceId = await this.terraformapi.workspaceIdLookup(workspacelookupurl)
                        var payload = this.variablePayload(workspaceId);
                        break;
                    case "update":
                        var method = 'patch';
                        var workspacelookupurl = "/organizations/" + this.options.organization + "/workspaces/" + this.options.workspace;
                        var workspaceId = await this.terraformapi.workspaceIdLookup(workspacelookupurl)
                        var variablekey = "" + this.options.variablekey;
                        var variablelookupurl = "/vars?filter%5Borganization%5D%5Bname%5D=" + this.options.organization + "&filter%5Bworkspace%5D%5Bname%5D=" + this.options.workspace;
                        var variableId = await this.terraformapi.variableIdLookup(variablelookupurl, variablekey);
                        console.log(variableId);
                        var url = '/vars/' + variableId;
                        console.log('building payload');
                        var payload = this.variablePayload(workspaceId, variableId);
                        console.log('finish payload');
                        break;
                    case "delete":
                        var method = 'delete';
                        var variablekey = "" + this.options.variablekey;
                        var variablelookupurl = "/vars?filter%5Borganization%5D%5Bname%5D=" + this.options.organization + "&filter%5Bworkspace%5D%5Bname%5D=" + this.options.workspace;
                        var variableId = await this.terraformapi.variableIdLookup(variablelookupurl, variablekey);
                        var url = '/vars/' + variableId;
                        var payload = this.workspacePayload();
                        break;
                    default:
                        console.log("Invalid workspace command");
                        throw new Error("Invalid workspace command");
                        break;
                }
                console.log('calling terraform api for variable');
                await this.terraformapi.call(url, method, JSON.stringify(payload));
                break;
            default:
                console.log("Invalid command");
                throw new Error("Invalid command");
                break;
        }
    }

    private workspacePayload() {
        const sourcename = 'Created by Azure DevOps Pipeline Extension for Terraform Enterprise';
        const sourceurl = 'https://github.com/hashicorp/azure-pipelines-extension-terraform';

        const workspace = this.options.workspace;
        const autoapply = this.options.workspaceautoapply;
        const description = this.options.workspacedescription;
        const filetriggersenabled = this.options.workspacefiletriggersenabled;
        const queueallruns = this.options.workspacequeueallruns;
        const speculativeenabled = this.options.workspacespeculativeenabled;
        const terraformversion = this.options.workspaceterraformversion;
        const triggerprefixes = this.options.workspacetriggerprefixes;
        const workingdirectory = this.options.workspaceworkingdirectory;
        const vcsrepo = this.options.workspacevcsrepo;
        const vcsrepotokenid = this.options.vcsrepooauthtokenid;
        const vcsrepobranch = this.options.vcsrepobranch;
        const vcsrepoingresssubmodules = this.options.vcsrepoingresssubmodules;
        const vcsrepoidentifier = this.options.vcsrepoidentifier;

        var args:any = {}
        
        args["name"] = workspace;
        args["source-name"] = sourcename;
        args["source-url"] = sourceurl;        
        // this.getBoolInput seems to return false for undefined, so we are setting this to only run if the non-default value is set.
        if ( autoapply === true ) {
            args["auto-apply"] = autoapply
        }
        if ( description ) {
            args["description"] = description
        }
        // this.getBoolInput seems to return false for undefined, so we are setting this to only run if the non-default value is set.
        if ( filetriggersenabled === false ) {
            args["file-triggers-enabled"] = filetriggersenabled
        }
        // this.getBoolInput seems to return false for undefined, so we are setting this to only run if the non-default value is set.
        if ( queueallruns === true ) {
            args["queue-all-runs"] = queueallruns
        }
        // this.getBoolInput seems to return false for undefined, so we are setting this to only run if the non-default value is set.
        if ( speculativeenabled === false ) {
            args["speculative-enabled"] = speculativeenabled
        }
        if ( terraformversion ) {
            args["terraform-version"] = terraformversion
        }
        // this.getDelimintedInput seems to return an empty array for undefined, so we are checking for an array with data inside.
        if ( triggerprefixes != undefined && triggerprefixes.length > 0 ) {
            args["trigger-prefixes"] = triggerprefixes
        }
        if ( workingdirectory ) {
            args["working-directory"] = workingdirectory
        }
        // this.getBoolInput seems to return false for undefined, so we are setting this to only run if the non-default value is set.
        if ( vcsrepo === true ) {
            var vcsrepoPayload:any = {}
            if ( vcsrepotokenid ) {
                vcsrepoPayload["oauth-token-id"] = vcsrepotokenid
            }
            if ( vcsrepobranch ) {
                vcsrepoPayload["branch"] = vcsrepobranch
            }
        // this.getBoolInput seems to return false for undefined, so we are setting this to only run if the non-default value is set.
            if ( vcsrepoingresssubmodules === true ) {
                vcsrepoPayload["ingress-submodules"] = vcsrepoingresssubmodules
            }
            if ( vcsrepoidentifier ) {
                vcsrepoPayload["identifier"] = vcsrepoidentifier
            }
            args["vcs-repo"] = vcsrepoPayload;
        }
        console.log(args);
        var attributesPayload:any = {}
        console.log("created empty variable")
        attributesPayload["attributes"] = args
        console.log(attributesPayload);
        var payload:any = {}
        payload["data"] = attributesPayload;
        console.log(payload);

        return payload;
    }

    private variablePayload(workspaceId: string, variableId: string = "") {
        const variablekey = this.options.variablekey;
        const variablevalue = this.options.variablevalue;
        const variablecategory = this.options.variablecategory;
        const variablehcl = this.options.variablehcl;
        const variablesensitive = this.options.variablesensitive;
        var payload:any = {};
        var payloaddata:any = {};
        var attributes:any = {};
        var relationships:any = {};
        var relationshipsworkspace:any = {};
        var relationshipsworkspacedata:any = {};
        attributes["key"] = variablekey;
        attributes["value"] = variablevalue;
        attributes["category"] = variablecategory;
// this.getBoolInput seems to return false for undefined, so we are setting this to only run if the non-default value is set.
        if ( variablehcl === true ) {
            attributes["hcl"] = variablehcl;
        }
// this.getBoolInput seems to return false for undefined, so we are setting this to only run if the non-default value is set.
        if ( variablesensitive === true ) {
            attributes["sensitive"] = variablesensitive;
        }
        relationshipsworkspacedata["type"] = 'workspaces';
        relationshipsworkspacedata["id"] = workspaceId;
        relationshipsworkspace["data"] = relationshipsworkspacedata;
        relationships["workspace"] = relationshipsworkspace;
        payloaddata["type"] = "vars";
        if ( variableId != "" ) {
            payloaddata["id"] = variableId;
        }
        payloaddata["attributes"] = attributes;
        payloaddata["relationships"] = relationships;
        payload["data"] = payloaddata;

        return payload;
   }
}
