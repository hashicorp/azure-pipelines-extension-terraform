import { injectable } from "inversify";
import task = require('azure-pipelines-task-lib/task');
import { ARMConnectedServiceOptions } from "./ARMConnectedServiceOptions";
import { ARMAuthenticationMethod } from "./ARMAuthenticationMethod";
import { TerraformProvider } from "../TerraformProvider";
import { TaskOptions } from "../../TaskOptions";
import { AzureStorageService } from "./AzureStorageService"

/**
 * Terraform Azure Provider and Backend
 */
@injectable()
export class AzureProvider {
    private armConnectedService: ARMConnectedServiceOptions | undefined = undefined;
    
    constructor(private options : TaskOptions) {

    }

    /**
     * Loads the ARM connected service information into the environment
     */
    public async authenticate() : Promise<{ [key: string]: string; }> {
        if (!this.options.providerAzureConnectedServiceName) {
            throw new Error("No Azure connection specified")
        }
        
        this.armConnectedService = new ARMConnectedServiceOptions(this.options.providerAzureConnectedServiceName);

        let env : { [key: string]: string; };
                
        switch (this.armConnectedService.authenticationMethod) {
            case ARMAuthenticationMethod.ServicePrincipalKey:
                env = this.getServicePrincipalKeyEnv(this.armConnectedService);
                break;
            case ARMAuthenticationMethod.ServicePrincipalCertificate:
                env = this.getServicePrincipalCertificateEnv(this.armConnectedService);
                break;
            case ARMAuthenticationMethod.ManagedIdentity:
                env = this.getManagedIdentityEnv();
                break;
            default:
                env = {};
        }

        return {
            ARM_TENANT_ID: this.armConnectedService.tenantId,
            ARM_SUBSCRIPTION_ID: this.armConnectedService.subscriptionId,
            ...env
        };
    }

    /**
     * Builds an object containing all the apporpriate values needed to set as backend-config
     * for Terraform to be use an Azure Storage Account as the backend
     */
    public async getBackendConfigOptions(): Promise<{ [key: string]: string; }> {

        let connectedService : ARMConnectedServiceOptions;

        if (this.options.backendAzureUseProviderConnectedServiceForBackend) {
            if (!this.options.providerAzureConnectedServiceName) {
                throw new Error("No Azure provider connection speficied");
            }

            connectedService = new ARMConnectedServiceOptions(this.options.providerAzureConnectedServiceName);
        } else {
            if (!this.options.backendAzureConnectedServiceName) {
                throw new Error("Backend connected service not specified");
            }

            connectedService = new ARMConnectedServiceOptions(this.options.backendAzureConnectedServiceName);
        }

        let storage = new AzureStorageService(connectedService);
        let storageAccount = this.options.backendAzureUseProviderConnectedServiceForBackend ? this.options.backendAzureProviderStorageAccountName : this.options.backendAzureStorageAccountName;

        if (!storageAccount) {
            throw new Error("Storage account not specified");
        }

        if (!this.options.backendAzureContainerName) {
            throw new Error("Storage container name not specified");
        }

        if (!this.options.backendAzureStateFileKey) {
            throw new Error("State file key not specified");
        }

        // I'd much prefer to use a SAS here but generating SAS isn't supported via the JS SDK without using a key
        let storage_key = await storage.getKey(
            storageAccount,
            this.options.backendAzureContainerName);
        
        return {
            storage_account_name: storageAccount,
            container_name: this.options.backendAzureContainerName,
            key: this.options.backendAzureStateFileKey,
            access_key: storage_key
        }
    }

    /**
     * Gets the appropraite ENV vars for Service Principal Key authentication
     */
    private getServicePrincipalKeyEnv(armConnectedService : ARMConnectedServiceOptions): { [key: string]: string; } {
        return {
            ARM_CLIENT_ID: armConnectedService.clientId,
            ARM_CLIENT_SECRET: armConnectedService.clientSecret,
        };
    }

    /**
     * Gets the appropraite ENV vars for Service Principal Cert authentication
     */
    private getServicePrincipalCertificateEnv(armConnectedService : ARMConnectedServiceOptions): { [key: string]: string; } {
        return {
            ARM_CLIENT_ID: armConnectedService.clientId,
            ARM_CLIENT_SECRET: armConnectedService.clientSecret,
        };
    }

    /**
     * Gets the appropraite ENV vars for Managed Identity authentication
     */
    private getManagedIdentityEnv(): { [key: string]: string; } {
        return {
            ARM_USE_MSI: "true",
        };
    }
}
