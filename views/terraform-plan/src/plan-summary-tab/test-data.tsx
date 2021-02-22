export const examplePlan1 = `

An execution plan has been generated and is shown below.
Resource actions are indicated with the following symbols:
  [33m~[0m update in-place
 [36m<=[0m read (data resources)
[0m
Terraform will perform the following actions:

[1m  # data.azurerm_storage_account_sas.eastus2_uvsdk_data_mgmt_perf_storage_account_blob[0m will be read during apply
  # (config refers to values not yet known)[0m[0m
[0m [36m<=[0m[0m data "azurerm_storage_account_sas" "eastus2_uvsdk_data_mgmt_perf_storage_account_blob"  {
      [33m~[0m [0m[1m[0mexpiry[0m[0m            = "2021-12-04T12:09:13Z" [33m->[0m [0m(known after apply)
      [33m~[0m [0m[1m[0mid[0m[0m                = "a7b637f3eb27c01aa469ce661d56f9e621d5b56fac18166a5ad66c78c8e94a2a" [33m->[0m [0m(known after apply)
      [33m~[0m [0m[1m[0msas[0m[0m               = (sensitive value)
      [33m~[0m [0m[1m[0mstart[0m[0m             = "2020-12-04T12:09:13Z" [33m->[0m [0m(known after apply)
        [90m# (3 unchanged attributes hidden)[0m[0m




      [32m+[0m [0mtimeouts {
          [32m+[0m [0m[1m[0mread[0m[0m = (known after apply)
        }
        [90m# (3 unchanged blocks hidden)[0m[0m
    }

[1m  # data.azurerm_storage_account_sas.eastus2_uvsdk_data_mgmt_storage_account_blob[0m will be read during apply
  # (config refers to values not yet known)[0m[0m
[0m [36m<=[0m[0m data "azurerm_storage_account_sas" "eastus2_uvsdk_data_mgmt_storage_account_blob"  {
      [33m~[0m [0m[1m[0mexpiry[0m[0m            = "2021-12-04T12:09:13Z" [33m->[0m [0m(known after apply)
      [33m~[0m [0m[1m[0mid[0m[0m                = "0dd6149707003d2d9c28b2a5100d64738ed14537e2acc47a190536b8a3515c4d" [33m->[0m [0m(known after apply)
      [33m~[0m [0m[1m[0msas[0m[0m               = (sensitive value)
      [33m~[0m [0m[1m[0mstart[0m[0m             = "2020-12-04T12:09:13Z" [33m->[0m [0m(known after apply)
        [90m# (3 unchanged attributes hidden)[0m[0m




      [32m+[0m [0mtimeouts {
          [32m+[0m [0m[1m[0mread[0m[0m = (known after apply)
        }
        [90m# (3 unchanged blocks hidden)[0m[0m
    }

[1m  # azurerm_app_service.eastus2_app_service_sim_webjob[0m will be updated in-place[0m[0m
[0m  [33m~[0m[0m resource "azurerm_app_service" "eastus2_app_service_sim_webjob" {
        [1m[0mid[0m[0m                             = "/subscriptions/6876e24d-cd94-4c25-9563-7c96ed5a5f81/resourceGroups/eastus2-fxs-victor-np-sim-data-processor-webjob-rg/providers/Microsoft.Web/sites/sim-webjob-data-processor"
        [1m[0mname[0m[0m                           = "sim-webjob-data-processor"
        [1m[0mtags[0m[0m                           = {}
        [90m# (13 unchanged attributes hidden)[0m[0m





      [33m~[0m [0msite_config {
          [33m~[0m [0m[1m[0mjava_container_version[0m[0m      = "JAVA 11 (AUTO-UPDATE)" [33m->[0m [0m"Java 11 (auto-update)"
            [90m# (18 unchanged attributes hidden)[0m[0m

            [90m# (1 unchanged block hidden)[0m[0m
        }

        [90m# (5 unchanged blocks hidden)[0m[0m
    }

[1m  # azurerm_key_vault_secret.eastus2_kv_uvsdk_data_mgmt_perf_sas_primary_key[0m will be updated in-place[0m[0m
[0m  [33m~[0m[0m resource "azurerm_key_vault_secret" "eastus2_kv_uvsdk_data_mgmt_perf_sas_primary_key" {
        [1m[0mid[0m[0m           = "https://eastus2-victor-np-perf.vault.azure.net/secrets/uvsdk-data-mgmt-perf-storage-account-sas/73af6f971fd84492b0e8c5ec18b19e26"
        [1m[0mname[0m[0m         = "uvsdk-data-mgmt-perf-storage-account-sas"
        [1m[0mtags[0m[0m         = {}
      [33m~[0m [0m[1m[0mvalue[0m[0m        = (sensitive value)
        [90m# (3 unchanged attributes hidden)[0m[0m
    }

[1m  # azurerm_key_vault_secret.eastus2_kv_uvsdk_data_mgmt_sas_primary_key[0m will be updated in-place[0m[0m
[0m  [33m~[0m[0m resource "azurerm_key_vault_secret" "eastus2_kv_uvsdk_data_mgmt_sas_primary_key" {
        [1m[0mid[0m[0m           = "https://eastus2-victor-np-app.vault.azure.net/secrets/uvsdk-data-mgmt-storage-account-sas/bca816dfb52945c086d2e46acba79fad"
        [1m[0mname[0m[0m         = "uvsdk-data-mgmt-storage-account-sas"
        [1m[0mtags[0m[0m         = {}
      [33m~[0m [0m[1m[0mvalue[0m[0m        = (sensitive value)
        [90m# (3 unchanged attributes hidden)[0m[0m
    }

[1m  # module.eastus2_function_generic_ingest_ftm.azurerm_function_app.this[0m will be updated in-place[0m[0m
[0m  [33m~[0m[0m resource "azurerm_function_app" "this" {
        [1m[0mid[0m[0m                             = "/subscriptions/6876e24d-cd94-4c25-9563-7c96ed5a5f81/resourceGroups/eastus2-fxs-victor-np-recon-svcs-rg/providers/Microsoft.Web/sites/eastus2-fxs-victor-np-transportation-fusioningest-func"
        [1m[0mname[0m[0m                           = "eastus2-fxs-victor-np-transportation-fusioningest-func"
        [1m[0mtags[0m[0m                           = {
            "Name"        = "transportation-fusioningest"
            "application" = "Reconciliation-Services"
            "created-by"  = "terraform"
            "eai"         = "3536661"
            "itowner"     = "576340"
        }
        [90m# (20 unchanged attributes hidden)[0m[0m

      [33m~[0m [0mauth_settings {
            [90m# (7 unchanged attributes hidden)[0m[0m

          [32m+[0m [0mactive_directory {
              [32m+[0m [0m[1m[0mallowed_audiences[0m[0m = []
            }
        }



        [90m# (3 unchanged blocks hidden)[0m[0m
    }

[1m  # module.eastus2_function_sim_brand_result.azurerm_function_app.this[0m will be updated in-place[0m[0m
[0m  [33m~[0m[0m resource "azurerm_function_app" "this" {
      [33m~[0m [0m[1m[0mapp_settings[0m[0m                   = {
          [33m~[0m [0m"AzureWebJobsStorage"                        = "DefaultEndpointsProtocol=https;AccountName=sta713b0d792a44dd7a94c9a;AccountKey=luWpv6NOp5EnALZERGxyYrVcNUPLvbJTPNeFEbeIJ/Yex/HiABg6RHuDx2tVL5sVPqPvbPcKJUC6Iyr41Vqf7A==;EndpointSuffix=core.windows.net" [33m->[0m [0m"@Microsoft.KeyVault(SecretUri=https://eastus2-victor-np-sim-kv.vault.azure.net/secrets/sta713b0d792a44dd7a94c9a-connectionString/8fe1827a4fee444d8e89c30dc29f7a46)"
          [32m+[0m [0m"WEBSITE_CONTENTAZUREFILECONNECTIONSTRING"   = "@Microsoft.KeyVault(SecretUri=https://eastus2-victor-np-sim-kv.vault.azure.net/secrets/sta713b0d792a44dd7a94c9a-connectionString/8fe1827a4fee444d8e89c30dc29f7a46)"
          [32m+[0m [0m"WEBSITE_CONTENTSHARE"                       = "sim_brand_result12345"
            [90m# (13 unchanged elements hidden)[0m[0m
        }
        [1m[0mid[0m[0m                             = "/subscriptions/6876e24d-cd94-4c25-9563-7c96ed5a5f81/resourceGroups/eastus2-fxs-victor-np-sim-submitter-tool-rg/providers/Microsoft.Web/sites/eastus2-fxs-victor-np-sim-brand-result-func"
        [1m[0mname[0m[0m                           = "eastus2-fxs-victor-np-sim-brand-result-func"
        [1m[0mtags[0m[0m                           = {
            "Name"        = "sim-brand-result"
            "application" = "sim-test"
            "created-by"  = "terraform"
            "eai"         = "3536661"
            "itowner"     = "576340"
        }
        [90m# (18 unchanged attributes hidden)[0m[0m

      [33m~[0m [0mauth_settings {
            [90m# (7 unchanged attributes hidden)[0m[0m

          [32m+[0m [0mactive_directory {
              [32m+[0m [0m[1m[0mallowed_audiences[0m[0m = []
            }
        }



        [90m# (3 unchanged blocks hidden)[0m[0m
    }

[1m  # module.eastus2_function_sim_request_status.azurerm_function_app.this[0m will be updated in-place[0m[0m
[0m  [33m~[0m[0m resource "azurerm_function_app" "this" {
      [33m~[0m [0m[1m[0mapp_settings[0m[0m                   = {
          [33m~[0m [0m"AzureWebJobsStorage"                        = "DefaultEndpointsProtocol=https;AccountName=sta713b0d792a44dd7a94c9a;AccountKey=luWpv6NOp5EnALZERGxyYrVcNUPLvbJTPNeFEbeIJ/Yex/HiABg6RHuDx2tVL5sVPqPvbPcKJUC6Iyr41Vqf7A==;EndpointSuffix=core.windows.net" [33m->[0m [0m"@Microsoft.KeyVault(SecretUri=https://eastus2-victor-np-sim-kv.vault.azure.net/secrets/sta713b0d792a44dd7a94c9a-connectionString/8fe1827a4fee444d8e89c30dc29f7a46)"
          [32m+[0m [0m"WEBSITE_CONTENTAZUREFILECONNECTIONSTRING"   = "@Microsoft.KeyVault(SecretUri=https://eastus2-victor-np-sim-kv.vault.azure.net/secrets/sta713b0d792a44dd7a94c9a-connectionString/8fe1827a4fee444d8e89c30dc29f7a46)"
          [32m+[0m [0m"WEBSITE_CONTENTSHARE"                       = "sim-request-status654654654"
            [90m# (13 unchanged elements hidden)[0m[0m
        }
        [1m[0mid[0m[0m                             = "/subscriptions/6876e24d-cd94-4c25-9563-7c96ed5a5f81/resourceGroups/eastus2-fxs-victor-np-sim-submitter-tool-rg/providers/Microsoft.Web/sites/eastus2-fxs-victor-np-sim-request-status-func"
        [1m[0mname[0m[0m                           = "eastus2-fxs-victor-np-sim-request-status-func"
        [1m[0mtags[0m[0m                           = {
            "Name"        = "sim-request-status"
            "application" = "sim-test"
            "created-by"  = "terraform"
            "eai"         = "3536661"
            "itowner"     = "576340"
        }
        [90m# (18 unchanged attributes hidden)[0m[0m

      [33m~[0m [0mauth_settings {
            [90m# (7 unchanged attributes hidden)[0m[0m

          [32m+[0m [0mactive_directory {
              [32m+[0m [0m[1m[0mallowed_audiences[0m[0m = []
            }
        }



        [90m# (3 unchanged blocks hidden)[0m[0m
    }

[1m  # module.eastus2_function_sim_submitter_tool.azurerm_function_app.this[0m will be updated in-place[0m[0m
[0m  [33m~[0m[0m resource "azurerm_function_app" "this" {
      [33m~[0m [0m[1m[0mapp_settings[0m[0m                   = {
          [33m~[0m [0m"AzureWebJobsStorage"                          = "DefaultEndpointsProtocol=https;AccountName=sta713b0d792a44dd7a94c9a;AccountKey=luWpv6NOp5EnALZERGxyYrVcNUPLvbJTPNeFEbeIJ/Yex/HiABg6RHuDx2tVL5sVPqPvbPcKJUC6Iyr41Vqf7A==;EndpointSuffix=core.windows.net" [33m->[0m [0m"@Microsoft.KeyVault(SecretUri=https://eastus2-victor-np-sim-kv.vault.azure.net/secrets/sta713b0d792a44dd7a94c9a-connectionString/8fe1827a4fee444d8e89c30dc29f7a46)"
          [32m+[0m [0m"WEBSITE_CONTENTAZUREFILECONNECTIONSTRING"     = "@Microsoft.KeyVault(SecretUri=https://eastus2-victor-np-sim-kv.vault.azure.net/secrets/sta713b0d792a44dd7a94c9a-connectionString/8fe1827a4fee444d8e89c30dc29f7a46)"
          [32m+[0m [0m"WEBSITE_CONTENTSHARE"                         = "sim-submitter-tool871351546"
            [90m# (17 unchanged elements hidden)[0m[0m
        }
        [1m[0mid[0m[0m                             = "/subscriptions/6876e24d-cd94-4c25-9563-7c96ed5a5f81/resourceGroups/eastus2-fxs-victor-np-sim-submitter-tool-rg/providers/Microsoft.Web/sites/eastus2-fxs-victor-np-sim-submitter-tool-func"
        [1m[0mname[0m[0m                           = "eastus2-fxs-victor-np-sim-submitter-tool-func"
        [1m[0mtags[0m[0m                           = {
            "Name"        = "sim-submitter-tool"
            "application" = "sim-test"
            "created-by"  = "terraform"
            "eai"         = "3536661"
            "itowner"     = "576340"
        }
        [90m# (18 unchanged attributes hidden)[0m[0m

      [33m~[0m [0mauth_settings {
            [90m# (7 unchanged attributes hidden)[0m[0m

          [32m+[0m [0mactive_directory {
              [32m+[0m [0m[1m[0mallowed_audiences[0m[0m = []
            }
        }



        [90m# (3 unchanged blocks hidden)[0m[0m
    }

[1m  # module.eastus2_function_transform_enrich_tss.azurerm_function_app.this[0m will be updated in-place[0m[0m
[0m  [33m~[0m[0m resource "azurerm_function_app" "this" {
        [1m[0mid[0m[0m                             = "/subscriptions/6876e24d-cd94-4c25-9563-7c96ed5a5f81/resourceGroups/eastus2-fxs-victor-np-recon-svcs-rg/providers/Microsoft.Web/sites/eastus2-fxs-victor-np-reconciliation-services-func"
        [1m[0mname[0m[0m                           = "eastus2-fxs-victor-np-reconciliation-services-func"
        [1m[0mtags[0m[0m                           = {
            "Name"        = "reconciliation-services"
            "application" = "Reconciliation-Services"
            "created-by"  = "terraform"
            "eai"         = "3536661"
            "itowner"     = "576340"
        }
        [90m# (20 unchanged attributes hidden)[0m[0m

      [33m~[0m [0mauth_settings {
            [90m# (7 unchanged attributes hidden)[0m[0m

          [32m+[0m [0mactive_directory {
              [32m+[0m [0m[1m[0mallowed_audiences[0m[0m = []
            }
        }



        [90m# (3 unchanged blocks hidden)[0m[0m
    }

[1m  # module.eastus2_function_uvsdk_data_mgmt.azurerm_function_app.this[0m will be updated in-place[0m[0m
[0m  [33m~[0m[0m resource "azurerm_function_app" "this" {
      [33m~[0m [0m[1m[0mapp_settings[0m[0m                   = {
          [31m-[0m [0m"APPINSIGHTS_INSTRUMENTATIONKEY"        = "3d9f72eb-d23d-4a61-ad26-b6acec3a86cc"
          [31m-[0m [0m"APPLICATIONINSIGHTS_CONNECTION_STRING" = "InstrumentationKey=3d9f72eb-d23d-4a61-ad26-b6acec3a86cc"
          [31m-[0m [0m"AzureWebJobsStorage"                   = "DefaultEndpointsProtocol=https;AccountName=stc7082ed04e119b597d76a9;AccountKey=TlcIZgtzAJZIcXHUkzKWLaZMmtH1JIKcW3Sf/iKLAHOfctA6kNThsKFPOwe7zuuIukVi0Y8HHmvqbzyHJC2rVQ==;EndpointSuffix=core.windows.net"
          [31m-[0m [0m"BlobStorageConnectionString"           = "DefaultEndpointsProtocol=https;AccountName=stc7082ed04e119b597d76a9;AccountKey=TlcIZgtzAJZIcXHUkzKWLaZMmtH1JIKcW3Sf/iKLAHOfctA6kNThsKFPOwe7zuuIukVi0Y8HHmvqbzyHJC2rVQ==;EndpointSuffix=core.windows.net"
          [31m-[0m [0m"EditFileUri"                           = "https://stc7082ed04e119b597d76a9.blob.core.windows.net/ursa-files/202001p1.e5f?sv=2017-07-29&ss=b&srt=sco&sp=rwac&se=2021-12-04T12:09:13Z&st=2020-12-04T12:09:13Z&spr=https&sig=FSxraSH7MW5v5ECv6y6dnxHilpMYA%2F3U76ZnkztE3OU%3D"
          [31m-[0m [0m"FUNCTIONS_WORKER_RUNTIME"              = "java"
          [31m-[0m [0m"FtpDirectory"                          = "/FXSVICTORFUSE/PSPURSA"
          [31m-[0m [0m"FtpPassword"                           = "V1ct0rFu$e"
          [31m-[0m [0m"FtpPort"                               = "60022"
          [31m-[0m [0m"FtpURL"                                = "prod.ec.fedex.com"
          [31m-[0m [0m"FtpUserName"                           = "FXSVICTORFUSE"
          [31m-[0m [0m"MetaDataTableName"                     = "uvsdkMetaData"
          [31m-[0m [0m"SAS"                                   = "?sv=2017-07-29&ss=b&srt=sco&sp=rwac&se=2021-12-04T12:09:13Z&st=2020-12-04T12:09:13Z&spr=https&sig=FSxraSH7MW5v5ECv6y6dnxHilpMYA%2F3U76ZnkztE3OU%3D"
          [31m-[0m [0m"StorageUrl"                            = "https://stc7082ed04e119b597d76a9.blob.core.windows.net"
          [31m-[0m [0m"TableStorageConnectionString"          = "DefaultEndpointsProtocol=https;AccountName=stc7082ed04e119b597d76a9;AccountKey=TlcIZgtzAJZIcXHUkzKWLaZMmtH1JIKcW3Sf/iKLAHOfctA6kNThsKFPOwe7zuuIukVi0Y8HHmvqbzyHJC2rVQ==;EndpointSuffix=core.windows.net"
          [31m-[0m [0m"UrsaContainer"                         = "ursa-files"
          [31m-[0m [0m"UsePublicEndpoint"                     = "false"
          [31m-[0m [0m"WEBSITES_ENABLE_APP_SERVICE_STORAGE"   = "true"
          [31m-[0m [0m"WEBSITE_ENABLE_SYNC_UPDATE_SITE"       = "true"
          [31m-[0m [0m"WEBSITE_RUN_FROM_PACKAGE"              = "1"
        } [33m->[0m [0m(known after apply)
        [1m[0mid[0m[0m                             = "/subscriptions/6876e24d-cd94-4c25-9563-7c96ed5a5f81/resourceGroups/eastus2-fxs-victor-np-rg/providers/Microsoft.Web/sites/eastus2-fxs-victor-np-uvsdk-data-mgmt-func"
        [1m[0mname[0m[0m                           = "eastus2-fxs-victor-np-uvsdk-data-mgmt-func"
        [1m[0mtags[0m[0m                           = {
            "Name"        = "uvsdk-data-mgmt"
            "application" = "UVSDK Data Management"
            "created-by"  = "terraform"
            "eai"         = "3536661"
            "itowner"     = "576340"
        }
        [90m# (18 unchanged attributes hidden)[0m[0m




        [90m# (4 unchanged blocks hidden)[0m[0m
    }

[1m  # module.eastus2_function_uvsdk_data_mgmt_perf.azurerm_function_app.this[0m will be updated in-place[0m[0m
[0m  [33m~[0m[0m resource "azurerm_function_app" "this" {
      [33m~[0m [0m[1m[0mapp_settings[0m[0m                   = {
          [31m-[0m [0m"APPINSIGHTS_INSTRUMENTATIONKEY"        = "3d9f72eb-d23d-4a61-ad26-b6acec3a86cc"
          [31m-[0m [0m"APPLICATIONINSIGHTS_CONNECTION_STRING" = "InstrumentationKey=3d9f72eb-d23d-4a61-ad26-b6acec3a86cc"
          [31m-[0m [0m"AzureWebJobsStorage"                   = "DefaultEndpointsProtocol=https;AccountName=stca2404c68f86246e044bed;AccountKey=Q46qKeoq9TaMo8QvuvUB9iBtOX9YAOVWlLxXvlESwN9/iSDimo+6O4RqKcfP5AOrGbXGa3NUyZp/L6ildhcb5w==;EndpointSuffix=core.windows.net"
          [31m-[0m [0m"BlobStorageConnectionString"           = "DefaultEndpointsProtocol=https;AccountName=stca2404c68f86246e044bed;AccountKey=Q46qKeoq9TaMo8QvuvUB9iBtOX9YAOVWlLxXvlESwN9/iSDimo+6O4RqKcfP5AOrGbXGa3NUyZp/L6ildhcb5w==;EndpointSuffix=core.windows.net"
          [31m-[0m [0m"EditFileUri"                           = "https://stca2404c68f86246e044bed.blob.core.windows.net/ursa-files/202001p1.e5f?sv=2017-07-29&ss=b&srt=sco&sp=rwac&se=2021-12-04T12:09:13Z&st=2020-12-04T12:09:13Z&spr=https&sig=q5pHr4a5CUcspRfa9jNrOfpnrLUAFuxyy%2FKOo7KWZPs%3D"
          [31m-[0m [0m"FUNCTIONS_WORKER_RUNTIME"              = "java"
          [31m-[0m [0m"FtpDirectory"                          = "/FXSVICTORFUSE/PSPURSA"
          [31m-[0m [0m"FtpURL"                                = "prod.ec.fedex.com"
          [31m-[0m [0m"FtpUserName"                           = "FXSVICTORFUSE"
          [31m-[0m [0m"MetaDataTableName"                     = "uvsdkMetaData"
          [31m-[0m [0m"SAS"                                   = "?sv=2017-07-29&ss=b&srt=sco&sp=rwac&se=2021-12-04T12:09:13Z&st=2020-12-04T12:09:13Z&spr=https&sig=FSxraSH7MW5v5ECv6y6dnxHilpMYA%2F3U76ZnkztE3OU%3D"
          [31m-[0m [0m"StorageUrl"                            = "https://stca2404c68f86246e044bed.blob.core.windows.net"
          [31m-[0m [0m"TableStorageConnectionString"          = "DefaultEndpointsProtocol=https;AccountName=stca2404c68f86246e044bed;AccountKey=Q46qKeoq9TaMo8QvuvUB9iBtOX9YAOVWlLxXvlESwN9/iSDimo+6O4RqKcfP5AOrGbXGa3NUyZp/L6ildhcb5w==;EndpointSuffix=core.windows.net"
          [31m-[0m [0m"UrsaContainer"                         = "ursa-files"
          [31m-[0m [0m"UsePublicEndpoint"                     = "true"
          [31m-[0m [0m"WEBSITES_ENABLE_APP_SERVICE_STORAGE"   = "true"
          [31m-[0m [0m"WEBSITE_ENABLE_SYNC_UPDATE_SITE"       = "true"
        } [33m->[0m [0m(known after apply)
        [1m[0mid[0m[0m                             = "/subscriptions/6876e24d-cd94-4c25-9563-7c96ed5a5f81/resourceGroups/eastus2-fxs-victor-np-perf-rg/providers/Microsoft.Web/sites/eastus2-fxs-victor-np-uvsdk-data-mgmt-perf-func"
        [1m[0mname[0m[0m                           = "eastus2-fxs-victor-np-uvsdk-data-mgmt-perf-func"
        [1m[0mtags[0m[0m                           = {
            "Name"        = "uvsdk-data-mgmt-perf"
            "application" = "UVSDK Data Management"
            "created-by"  = "terraform"
            "eai"         = "3536661"
            "itowner"     = "576340"
        }
        [90m# (18 unchanged attributes hidden)[0m[0m




        [90m# (4 unchanged blocks hidden)[0m[0m
    }

[0m[1mPlan:[0m 0 to add, 10 to change, 0 to destroy.[0m
`;

export const exampleSummary = `{"resources":{"toCreate":1,"toDelete":0,"toUpdate":0,"unchanged":0},"outputs":{"toCreate":7,"toDelete":0,"toUpdate":0,"unchanged":0}}`;