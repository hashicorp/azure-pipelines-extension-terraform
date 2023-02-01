/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * Different ways to authenticate from an ARM connected service
 */
export enum ARMAuthenticationMethod {
    Unknown = 0,
    ServicePrincipalKey,
    ServicePrincipalCertificate,
    ManagedIdentity,
}