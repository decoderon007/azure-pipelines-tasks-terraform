Feature: terraform init

    terraform init [options] [dir]

    Scenario: init with null backend
        Given terraform exists
        And terraform command is "init"
        And running command "terraform init" returns successful result
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform init"
        And the terraform cli task is successful
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"

    Scenario: init fails
        Given terraform exists
        And terraform command is "init"
        And running command "terraform init" fails with error "init failed"
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform init"
        And the terraform cli task fails with message "init failed"
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "1"

    Scenario: init with command options
        Given terraform exists
        And terraform command is "init" with options "-input=true -lock=false -no-color"
        And running command "terraform init -input=true -lock=false -no-color" returns successful result
        When the terraform cli task is run
        Then terraform is initialized with the following options
            | option      |
            | -input=true |
            | -lock=false |
            | -no-color   |
        And the terraform cli task is successful
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"

    Scenario: init with backend azurerm
        Given terraform exists
        And terraform command is "init"
        And azurerm backend service connection "backend" exists as
            | scheme         | ServicePrincipal       |
            | subscriptionId | sub1                   |
            | tenantId       | ten1                   |
            | clientId       | servicePrincipal1      |
            | clientSecret   | servicePrincipalKey123 |
        And azurerm backend type selected with the following storage account
            | resourceGroup | rg-backend-storage |
            | name          | storage            |
            | container     | container          |
            | key           | master             |
        And running command "terraform init" with the following options returns successful result
            | option                                                   |
            | -backend-config=storage_account_name=storage             |
            | -backend-config=container_name=container                 |
            | -backend-config=key=master                               |
            | -backend-config=resource_group_name=rg-backend-storage   |
            | -backend-config=arm_subscription_id=sub1                 |
            | -backend-config=arm_tenant_id=ten1                       |
            | -backend-config=arm_client_id=servicePrincipal1          |
            | -backend-config=arm_client_secret=servicePrincipalKey123 |
        When the terraform cli task is run
        Then terraform is initialized with the following options
            | option                                                   |
            | -backend-config=storage_account_name=storage             |
            | -backend-config=container_name=container                 |
            | -backend-config=key=master                               |
            | -backend-config=resource_group_name=rg-backend-storage   |
            | -backend-config=arm_subscription_id=sub1                 |
            | -backend-config=arm_tenant_id=ten1                       |
            | -backend-config=arm_client_id=servicePrincipal1          |
            | -backend-config=arm_client_secret=servicePrincipalKey123 |
        And the terraform cli task is successful
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"

    Scenario: init with backend azurerm ensured and storage account does not exist
        Given terraform exists
        And terraform command is "init"
        And azurerm backend service connection "backend" exists as
            | scheme         | ServicePrincipal       |
            | subscriptionId | sub1                   |
            | tenantId       | ten1                   |
            | clientId       | servicePrincipal1      |
            | clientSecret   | servicePrincipalKey123 |
        And azurerm backend type selected with the following storage account
            | resourceGroup | rg-backend-storage |
            | name          | storage            |
            | container     | container          |
            | key           | master             |
        And azurerm ensure backend is checked with the following
            | location | eastus         |
            | sku      | Standard_RAGRS |
        And running command "terraform init" with the following options returns successful result
            | option                                                   |
            | -backend-config=storage_account_name=storage             |
            | -backend-config=container_name=container                 |
            | -backend-config=key=master                               |
            | -backend-config=resource_group_name=rg-backend-storage   |
            | -backend-config=arm_subscription_id=sub1                 |
            | -backend-config=arm_tenant_id=ten1                       |
            | -backend-config=arm_client_id=servicePrincipal1          |
            | -backend-config=arm_client_secret=servicePrincipalKey123 |
        And azure cli exists
        And running command "az login" with the following options returns successful result
            | option                    |
            | --service-principal       |
            | -t ten1                   |
            | -u servicePrincipal1      |
            | -p servicePrincipalKey123 |
        And running command "az account set -s sub1" returns successful result
        And running command "az group create --name rg-backend-storage --location eastus" returns successful result
        And running command "az storage account show --name storage --resource-group rg-backend-storage" fails with error "The Resource 'Microsoft.Storage/storageAccounts/storage' under resource group 'rg-backend-storage' was not found."
        And running command "az storage account create" with the following options returns successful result
            | option                              |
            | --name storage                      |
            | --resource-group rg-backend-storage |
            | --sku Standard_RAGRS                |
            | --kind StorageV2                    |
            | --encryption-services blob          |
            | --access-tier hot                   |
        And running command "az storage container create --auth-mode login --name container --account-name storage" returns successful result
        When the terraform cli task is run
        Then an azure storage account is created with the following options
            | option                              |
            | --name storage                      |
            | --resource-group rg-backend-storage |
            | --sku Standard_RAGRS                |
            | --kind StorageV2                    |
            | --encryption-services blob          |
            | --access-tier hot                   |
        And an azure storage container is created with the following options
            | option                |
            | --auth-mode login     |
            | --name container      |
            | --account-name storage |
        And terraform is initialized with the following options
            | option                                                   |
            | -backend-config=storage_account_name=storage             |
            | -backend-config=container_name=container                 |
            | -backend-config=key=master                               |
            | -backend-config=resource_group_name=rg-backend-storage   |
            | -backend-config=arm_subscription_id=sub1                 |
            | -backend-config=arm_tenant_id=ten1                       |
            | -backend-config=arm_client_id=servicePrincipal1          |
            | -backend-config=arm_client_secret=servicePrincipalKey123 |
        And the terraform cli task is successful
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"

    Scenario: init with backend azurerm ensured and storage account exists
        Given terraform exists
        And terraform command is "init"
        And azurerm backend service connection "backend" exists as
            | scheme         | ServicePrincipal       |
            | subscriptionId | sub1                   |
            | tenantId       | ten1                   |
            | clientId       | servicePrincipal1      |
            | clientSecret   | servicePrincipalKey123 |
        And azurerm backend type selected with the following storage account
            | resourceGroup | rg-backend-storage |
            | name          | storage            |
            | container     | container          |
            | key           | master             |
        And azurerm ensure backend is checked with the following
            | location | eastus         |
            | sku      | Standard_RAGRS |
        And running command "terraform init" with the following options returns successful result
            | option                                                   |
            | -backend-config=storage_account_name=storage             |
            | -backend-config=container_name=container                 |
            | -backend-config=key=master                               |
            | -backend-config=resource_group_name=rg-backend-storage   |
            | -backend-config=arm_subscription_id=sub1                 |
            | -backend-config=arm_tenant_id=ten1                       |
            | -backend-config=arm_client_id=servicePrincipal1          |
            | -backend-config=arm_client_secret=servicePrincipalKey123 |
        And azure cli exists
        And running command "az login" with the following options returns successful result
            | option                    |
            | --service-principal       |
            | -t ten1                   |
            | -u servicePrincipal1      |
            | -p servicePrincipalKey123 |
        And running command "az account set -s sub1" returns successful result
        And running command "az group create --name rg-backend-storage --location eastus" returns successful result
        And running command "az storage account show --name storage --resource-group rg-backend-storage" returns successful result
        And running command "az storage account create" with the following options returns successful result
            | option                              |
            | --name storage                      |
            | --resource-group rg-backend-storage |
            | --sku Standard_RAGRS                |
            | --kind StorageV2                    |
            | --encryption-services blob          |
            | --access-tier hot                   |
        And running command "az storage container create --auth-mode login --name container --account-name storage" returns successful result
        When the terraform cli task is run
        Then an azure storage account is not created
        And an azure storage container is created with the following options
            | option                |
            | --auth-mode login     |
            | --name container      |
            | --account-name storage |
        And terraform is initialized with the following options
            | option                                                   |
            | -backend-config=storage_account_name=storage             |
            | -backend-config=container_name=container                 |
            | -backend-config=key=master                               |
            | -backend-config=resource_group_name=rg-backend-storage   |
            | -backend-config=arm_subscription_id=sub1                 |
            | -backend-config=arm_tenant_id=ten1                       |
            | -backend-config=arm_client_id=servicePrincipal1          |
            | -backend-config=arm_client_secret=servicePrincipalKey123 |
        And the terraform cli task is successful
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"

    Scenario: init with secure env file
        Given terraform exists
        And terraform command is "init"
        And secure file specified with id "6b4ef608-ca4c-4185-92fb-0554b8a2ec72" and name "./src/tests/default.env"
        And running command "terraform init" returns successful result
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform init" with the following environment variables
            | TF_VAR_app-short-name | tffoo  |
            | TF_VAR_region         | eastus |
            | TF_VAR_env-short-name | dev    |
        And the terraform cli task is successful
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"

    Scenario: init with secure vars file
        Given terraform exists
        And terraform command is "init"
        And secure file specified with id "6b4ef608-ca4c-4185-92fb-0554b8a2ec72" and name "./src/tests/default.vars"
        When the terraform cli task is run
        Then the terraform cli task fails with message "terraform init command supports only env files, no tfvars are allowed during this stage."
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "1"