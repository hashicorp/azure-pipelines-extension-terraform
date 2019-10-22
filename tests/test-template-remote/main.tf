terraform {
  backend "remote" {
    hostname = "app.terraform.io"
    organization = "msus"

    workspaces {
      name = "tfcloud-test"
    }
  }
}

provider "azurerm" {
  version = "=1.35.0"
}

resource "azurerm_resource_group" "test" {
  name     = "testResourceGroup1"
  location = "West US"
}