import task = require('azure-pipelines-task-lib/task');
import { injectable } from "inversify";
import { TaskOptions } from "./TaskOptions";
const axios = require('axios');

@injectable()
export class TerraformApi {

    public constructor(
        private options: TaskOptions
    ) {
    }

    public async call(url: string, method: string, body: string = "") {
        const skipcertcheck = this.options.skipcertcheck;
        const baseUrl = this.options.url
        const requestUrl = url;
        const metadata = body;
        console.log(body);
        const requestMethod = method;
        console.log(requestUrl);
        const accessToken = this.options.token;
        console.log(accessToken);

        try {
            await axios({
                method: requestMethod,
                baseURL: baseUrl,
                url: requestUrl,
                data: metadata,
                headers: {
                  'Authorization': 'Bearer ' + accessToken,
                  'Content-Type': 'application/vnd.api+json'
                }
          }).then((response: Response) => {
              console.log(response.statusText);
          });
        }
        catch (error) {
            console.log("Unable to update Terraform Api, Error: " + error);
            throw new Error("Unable to update Terraform Api, Error: " + error);
        }
    }


    public async workspaceIdLookup(url: string) {
        const skipcertcheck = this.options.skipcertcheck;
        const baseUrl = this.options.url
        const requestUrl = url;
        console.log(requestUrl);
        const accessToken = this.options.token;
        interface ServerResponse {
          data: ServerDataWrapper
        }
        interface ServerDataWrapper {
          data: ServerData
        }
        interface ServerData {
          id: string
        }

        try {
          let response = await axios({
            method: 'get',
            baseURL: baseUrl,
            url: requestUrl,
            headers: {
              'Authorization': 'Bearer ' + accessToken,
              'Content-Type': 'application/vnd.api+json'
            }
          });
          console.log(response.data.data.id);
          return response.data.data.id;
        }
        catch (error) {
            console.log("Unable to update Terraform Api, Error: " + error);
            throw new Error("Unable to update Terraform Api, Error: " + error);
        }
    }

    public async latestRunIdLookup(url: string) {
        const skipcertcheck = this.options.skipcertcheck;
        const baseUrl = this.options.url
        const requestUrl = url;
        console.log(requestUrl);
        const accessToken = this.options.token;
        interface ServerResponse {
          data: ServerDataWrapper
        }
        interface ServerDataWrapper {
          data: ServerData
        }
        interface ServerData {
          id: string
        }

        try {
          let response = await axios({
            method: 'get',
            baseURL: baseUrl,
            url: requestUrl,
            headers: {
              'Authorization': 'Bearer ' + accessToken,
              'Content-Type': 'application/vnd.api+json'
            }
          });
          console.log(response.data.data[0].id);
          return response.data.data[0].id;
        }
        catch (error) {
            console.log("Unable to update Terraform Api, Error: " + error);
            throw new Error("Unable to update Terraform Api, Error: " + error);
        }
    }

    public async variableIdLookup(url: string, variable: string) {
        const skipcertcheck = this.options.skipcertcheck;
        const baseUrl = this.options.url
        const requestUrl = url;
        console.log(requestUrl);
        const accessToken = this.options.token;
        interface ServerResponse {
          data: ServerDataWrapper
        }
        interface ServerDataWrapper {
          data: ServerData
        }
        interface ServerData {
          id: string
        }

        try {
          let response = await axios({
            method: 'get',
            baseURL: baseUrl,
            url: requestUrl,
            headers: {
              'Authorization': 'Bearer ' + accessToken,
              'Content-Type': 'application/vnd.api+json'
            }
          });
          for (var i=0; i < response.data.data.length; i++) {
              if (response.data.data[i]['attributes']['key'] == variable) {
                  console.log(response.data.data[i]['id']);
                  return response.data.data[i]['id'];
               }
          }
        }
        catch (error) {
            console.log("Unable to update Terraform Api, Error: " + error);
            throw new Error("Unable to update Terraform Api, Error: " + error);
        }
    }
}
