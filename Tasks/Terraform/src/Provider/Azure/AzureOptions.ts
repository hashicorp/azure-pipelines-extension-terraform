/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { injectable } from "inversify";

/**
 * Loads connected service data for ARM from the Task into a strongly-typed object
 */
@injectable()
export class AzureOptions {
    public providerAzureConnectedServiceName : string = "";
    public backendAzureUseProviderConnectedServiceForBackend : boolean = true;
    public backendAzureConnectedServiceName : string = "";
    public backendAzureStorageAccountName : string = "";
    public backendAzureProviderStorageAccountName : string = "";
    public backendAzureContainerName : string = "";
    public backendAzureStateFileKey : string = "";
}