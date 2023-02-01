# Copyright (c) HashiCorp, Inc.
# SPDX-License-Identifier: MPL-2.0

provider "azurerm" {

}

resource "azurerm_resource_group" "test" {
  name     = "testResourceGroup1"
  location = "West US"
}