# Copyright (c) HashiCorp, Inc.
# SPDX-License-Identifier: MPL-2.0

terraform {
  backend "azurerm" {}
}

variable "environment" {
  default = "test"
}


provider "azurerm" {
  version = "=1.35.0"
}

resource "azurerm_resource_group" "test" {
  name     = "testResourceGroup1"
  location = "West US"
}