# A Terraform CLI Extension for Azure DevOps

This repository contains the source for an Azure Pipelines extension that provides Tasks to easily install and use Terraform.

## Goals

The goals of this project is to make using Terraform within Azure DevOps just as easy as it is locally, mainly by abstracting the concerns of managing Service Principals and Storage access keys.

## Usage

Once the task has been installed from you can use it in any Azure Pipelines build or release job.

You can invoke the task in a yaml template using the following syntax:

```
  - task: terraform@0
    inputs:
      command: 'CLI'
      providerAzureConnectedServiceName: 'MTC Denver Sandbox'
      backendAzureProviderStorageAccountName: 'mtcdenterraformsandbox'
      backendAzureStateFileKey: 'tfclitest.tfstate'
      cwd: tests/test-template-azure
      script: |
        # Validate
        terraform validate

        # Plan
        terraform plan -input=false -out=testplan.tf
```
