# Azure Pipelines Extension for Terraform

This repository contains the source for an Azure Pipelines extension that provides Tasks to easily install and use Terraform.

This extension provides a `TerraformInstaller` task to ease in installing specific Terraform versions, as well as a `Terraform` task to help call Terraform without needing to manage authentication yourself.  The `Terraform` task wraps `init`, `plan`, `validate`, `apply`, and `destroy` commands, as well as providing a `CLI` option.

`CLI` is used to execute a custom script in a pre-authenticated environment.  This can be a great option if you need to use more complex terraform scripts, such as gathering output and setting it to a Piplelines variable (see example below).

Once this task has been added to your Organization from the Azure DevOps Marketplace you can use it in any Azure Pipelines build or release job.  It is available in both the GUI pipeline editor as well as yaml templates.

## Options


#### General
*Common options available in most configurations*

| Name | Type | Description |
|-|-|-|
| `command` | `pickList` | The Terraform command to run.   <br />*Options*: `init`, `validate`, `plan`, `apply`, `destroy`, `cli` |
| `provider` | `pickList` | The Cloud provider to authenticate with.  <br />*Options*: `Azure`, `Remote` (`AWS` and `GCP` Coming soon) |
| `backend` | `pickList` | Where to store the Terraform backend state. <br />*Options*: `Azure`, `Remote` (`AWS` and `GCP` Coming soon)


#### Azure
*Options which are available when Azure Backend and Providers are selected.*

| Name | Type | Description |
|-|-|-|
| `providerAzureConnectedServiceName` | `serviceConnection` | The Azure Subscription to execute Terraform against|
| `backendAzureUseProviderConnectedServiceForBackend` | bool | Should the specified provider connection be re-used to talk to the backend storage account? |
| `backendAzureConnectedServiceName` | `serviceConnection` | The Azure Subscription to be used to talk to the backend storage accoutn |
| `backendAzureStorageAccountName` | `serviceConnection` | If a separate backend connection is specified: the Storage Account to store the backend state in. |
| `backendAzureProviderStorageAccountName` | `serviceConnection` | If no separate backend connection is specified: the Storage Account to store the backend state in. |
| `backendAzureContainerName` | `string` | The Storage Account Container name |
| `backendAzureStateFileKey` | `string` | The name of the terraform state file |

#### CLI
*Options which are available when command is set to CLI*

| Name | Type | Description |
|-|-|-|
| `initialize` | `bool` | Should `terraform init` run before executing the CLI script |
| `scriptLocation` | `pickList` | How will the CLI script be provided? <br /> *Options*: `Inline script`, `Script path`|
| `scriptPath` | `filePath` | The path to the CLI script to execute |
| `script` | `string` | The inline script to execute |

#### Advanced
*Advanced options available for all non-CLI commands*

| Name | Type | Description |
|-|-|-|
| `args` | `string` | Additional arguments to pass to the Terraform command being run |


## YAML Pipeline Examples

#### Install Terraform

```yaml
pool:
  vmImage: 'Ubuntu-16.04'

steps:
- task: terraformInstaller@0
  inputs:
    terraformVersion: '0.12.12'
  displayName: Install Terraform
```

#### Init, plan, and apply
You can invoke the task in a yaml template using the following syntax:

```yaml
pool:
  vmImage: 'Ubuntu-16.04'

steps:
- task: terraform@0
  inputs:
    command: 'init'
    providerAzureConnectedServiceName: 'MTC Denver Sandbox'
    backendAzureProviderStorageAccountName: 'mtcdenterraformsandbox'
  displayName: Terraform Init
    
- task: terraform@0
  inputs:
    command: 'plan'
    providerAzureConnectedServiceName: 'MTC Denver Sandbox'
    args: -var=environment=demo -out=tfplan.out
  displayName: Terraform Plan

- task: terraform@0
  inputs:
    command: 'apply'
    providerAzureConnectedServiceName: 'MTC Denver Sandbox'
    args: tfplan.out
  displayName: Terraform Apply
```

#### Execute a Terraform-authenticated CLI Script


```yaml
pool:
  vmImage: 'Ubuntu-16.04'

steps:
- task: terraform@0
  inputs:
    command: 'CLI'
    providerAzureConnectedServiceName: 'MTC Denver Sandbox'
    backendAzureProviderStorageAccountName: 'mtcdenterraformsandbox'
    script: |
      # Validate
      terraform validate

      # Plan
      terraform plan -input=false -out=testplan.tf

      # Get output
      STORAGE_ACCOUNT=`terraform output storage_account`

      # Set storageAccountName variable from terraform output
      echo "##vso[task.setvariable variable=storageAccountName]$STORAGE_ACCOUNT"
    displayName: Execute Terraform CLI Script
    
```
