# Plan Summary Tab UI

The Plan Summary Tab user interface is a simple React web page.
It is compiled with Webpack and is shown to the user inside of an Azure DevOps Build Pipeline if the Terraform extension is used.

The summary tab reads two attachments from the pipeline:

- Summary JSON: Which is a `.json` file with a summary of resources/outputs to create, update, destroy, or are unchanged
- Plan output: Which is a `.txt` file which is the stdout of running `terraform plan`

## Local Development and Testing

You can locally develop and test the summary tab.

From the root project directory:

1. Run `npm i` to install required packages
2. Run `npm run compile:test` to compile the tab with test data
3. If using VSCode you can use the Run/Debug Launch command `debug:test - summary tab - Chrome`
    - Alternatively you can open the `./dist/plan-summary-tab/plan-summary-tab.html` file in a browser of your choice
    - For breakpoints to be enabled you will need to launch Chrome with the `--remote-debugging-port=9222` command line option.
    For more information on this CLI option consult the `Debugger for Chrome` VSCode extension.

A Chrome browser with the plan summary tab will open.
The displayed content is the content which will be inside of the Azure DevOps Build Pipeline Tab.

For local testing purposes, a set mocked dummy terraform data is loaded.
