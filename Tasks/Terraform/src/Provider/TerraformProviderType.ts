/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * Different ways to authenticate from an ARM connected service
 */
export enum TerraformProviderType {
    Unknown = 0,
    Azure,
    Aws,
    Gcp,
    Remote
}