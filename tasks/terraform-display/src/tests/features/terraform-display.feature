Feature: terraform display

    As a engineer, I would like the terraform attached to my pipeline run, so that I can quickly see what changes will occur

    Scenario: plan with changes
        Given terraform exists
        And running command "terraform show -json -no-color ./tfplan" returns successful result with stdout from file "./src/tests/show_plan_stdout.json"
        And running command "terraform show ./tfplan" returns successful result with stdout from file "./src/tests/show_plan_stdout.txt"
        And the plan file path is "./tfplan"
        When terraform display task is run
        Then the terraform display task was successful
        And the plan summary is attached with the following result
            | type      | action    | count |
            | resources | toCreate  | 1     |
            | resources | toDelete  | 0     |
            | resources | toUpdate  | 0     |
            | resources | unchanged | 0     |
            | outputs   | toCreate  | 7     |
            | outputs   | toDelete  | 0     |
            | outputs   | toUpdate  | 0     |
            | outputs   | unchanged | 0     |
        And the plan details are attached with the following content from file "./src/tests/show_plan_stdout.txt"

    Scenario: plan with changes uses secure env file
        Given terraform exists
        And running command "terraform show -json -no-color ./tfplan" returns successful result with stdout from file "./src/tests/show_plan_stdout.json"
        And running command "terraform show ./tfplan" returns successful result with stdout from file "./src/tests/show_plan_stdout.txt"
        And the plan file path is "./tfplan"
        And secure file specified with id "b8ed8b26-9dce-48e6-b6a5-c167333f0f04" and name "./src/tests/default.env"
        When terraform display task is run
        Then the terraform display task was successful
        And the terraform display task was run with the following environment variables
            | TF_VAR_app-short-name | tffoo  |
            | TF_VAR_region         | eastus |
            | TF_VAR_env-short-name | dev    |
        And the plan summary is attached with the following result
            | type      | action    | count |
            | resources | toCreate  | 1     |
            | resources | toDelete  | 0     |
            | resources | toUpdate  | 0     |
            | resources | unchanged | 0     |
            | outputs   | toCreate  | 7     |
            | outputs   | toDelete  | 0     |
            | outputs   | toUpdate  | 0     |
            | outputs   | unchanged | 0     |
        And the plan details are attached with the following content from file "./src/tests/show_plan_stdout.txt"