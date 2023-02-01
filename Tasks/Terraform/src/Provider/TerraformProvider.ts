/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { injectable } from "inversify";

/**
 * A Provider for Terraform
 */
@injectable()
export abstract class TerraformProvider {
    /**
     * Configures the file system and process environment variables necessary to run Terraform
     * in an authenticated manner.
     * 
     * @returns Variables to set for auth in the spawned process env
     */
    abstract authenticate() : Promise<{ [key: string]: string; }>;

    /**
     * Get's a dictionary containing the backend-config parameters
     * to set on init
     */
    abstract getBackendConfigOptions() : Promise<{ [key: string]: string; }>;
}