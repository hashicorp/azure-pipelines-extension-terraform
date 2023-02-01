/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { injectable } from "inversify";
import task = require('azure-pipelines-task-lib/task');

/**
 * Loads connected service data for ARM from the Task into a strongly-typed object
 */
@injectable()
export class RemoteConnectedServiceOptions {
    public backendRemoteUrl: string = "";
    public backendRemoteToken: string = "";
}