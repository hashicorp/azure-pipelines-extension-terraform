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