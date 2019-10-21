import * as msRestNodeAuth from "@azure/ms-rest-nodeauth";
import { injectable } from "inversify";
import { ARMAuthenticationMethod } from "./ARMAuthenticationMethod";
import { ARMConnectedServiceOptions } from "./ARMConnectedServiceOptions";
import { AzureTokenCredentialsOptions } from "@azure/ms-rest-nodeauth";
import { StorageManagementClient } from "@azure/arm-storage";
import { ServiceClientCredentials } from "@azure/ms-rest-js";

/**
 * Access Azure Storage to get a key for the account
 */
@injectable()
export class AzureStorageService {
    private readonly StorageUrl = "https://management.azure.com/"

    constructor(private connectedService: ARMConnectedServiceOptions) {

    }

    public async getKey(storageAccountName: string, containerName: string) : Promise<string> {
        var creds = await this.login();
        var client = new StorageManagementClient(creds, this.connectedService.subscriptionId);
        var storageAccounts = await client.storageAccounts.list();

        var account = storageAccounts.find(item => item.name == storageAccountName);

        if (account == null) {
            throw new Error("Storage account not found");
        }

        var id = account.id || "";
        var regex = new RegExp("resourceGroups\/([a-zA-Z0-9_-]+)\/");
        var res = regex.exec(id) || [];
        var resourceGroupName = res[1];
        
        var keysResult = await client.storageAccounts.listKeys(resourceGroupName, storageAccountName);
        
        if (
            keysResult == null ||
            keysResult.keys == null ||
            keysResult.keys.length == 0 ||
            keysResult.keys[0].value == null
        ) {
            throw new Error("Could not get storage account keys");
        }

        return keysResult.keys[0].value;
    }

    private async login() : Promise<ServiceClientCredentials> {
        switch(this.connectedService.authenticationMethod) {
            case ARMAuthenticationMethod.ManagedIdentity:
                return this.loginWithManagedIdentity();
            case ARMAuthenticationMethod.ServicePrincipalKey:
                return this.loginWithServicePrincipalKey();
            case ARMAuthenticationMethod.ServicePrincipalCertificate:
                return this.loginWithServicePrincipalCertificate();
        }

        throw new Error("No valid authentication method specified");
    }

    private async loginWithManagedIdentity() : Promise<ServiceClientCredentials> {
        var creds = await msRestNodeAuth.loginWithVmMSI({
            "resource": this.StorageUrl
        });

        return creds;
    }

    private async loginWithServicePrincipalKey() : Promise<ServiceClientCredentials> {
        return msRestNodeAuth.loginWithServicePrincipalSecretWithAuthResponse(
            this.connectedService.clientId,
            this.connectedService.clientSecret,
            this.connectedService.tenantId,
            {
                "tokenAudience": this.StorageUrl
            } as AzureTokenCredentialsOptions
        ).then((authres) => {
            return authres.credentials;
        });
    }

    private async loginWithServicePrincipalCertificate() : Promise<ServiceClientCredentials> {
        var creds = await msRestNodeAuth.loginWithServicePrincipalCertificate(
            this.connectedService.clientId,
            this.connectedService.clientCertificatePath,
            this.StorageUrl
        );

       return creds;
    }
}
