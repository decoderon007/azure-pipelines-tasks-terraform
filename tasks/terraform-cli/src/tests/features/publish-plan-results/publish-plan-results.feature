Feature: publish plan results

    As an engineer,
    I would like the results of my terraform plan to be published to the pipeline run so that,
    I can quickly see actions terraform will apply to my infrastrucutre

    Scenario: publish plan results enabled
        Given terraform exists
        And terraform command is "plan"
        And running command "terraform plan" returns successful result with stdout from file "./src/tests/features/publish-plan-results/plan-stdout-with-color.txt"
        And publish plan result is enabled
        When the terraform cli task is run
        Then the terraform cli task is successful
        And the plan details are attached with the following content from file "./src/tests/features/publish-plan-results/plan-stdout-with-color.txt"

    Scenario: publish plan results not specified
        Given terraform exists
        And terraform command is "plan"
        And running command "terraform plan" returns successful result with stdout from file "./src/tests/features/publish-plan-results/plan-stdout-with-color.txt"        
        When the terraform cli task is run
        Then the terraform cli task is successful
        And the plan details are not attached