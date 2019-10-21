provider "azurerm" {

}

resource "azurerm_resource_group" "test" {
  name     = "testResourceGroup1"
  location = "West US"
}