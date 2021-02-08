import {
    default as AnsiUp
} from 'ansi_up';
import * as API from "azure-devops-extension-api";
import { CommonServiceIds, getClient, IProjectPageService } from "azure-devops-extension-api";
import { Build, BuildRestClient, BuildServiceIds, IBuildPageDataService, Timeline } from "azure-devops-extension-api/Build";

import * as SDK from "azure-devops-extension-sdk";

import { Card } from "azure-devops-ui/Card";
import { Dropdown } from "azure-devops-ui/Dropdown";
import { ListSelection } from 'azure-devops-ui/List';
import { Observer } from "azure-devops-ui/Observer";
import * as React from "react";
import * as ReactDOM from "react-dom";
import "./plan-summary-tab.scss";

interface ThisBuild {
    project: API.IProjectInfo,
    buildId: number,
    build: Build,
    timeline: Timeline,
}

interface TerraformPlan {
    name: string,
    plan: string,
}

const terraformCliTaskId = '721c3f90-d938-11e8-9d92-09d7594721b5';
const terraformPlanAttachmentType = 'terraform-plan-results';

const buildClient = getClient(BuildRestClient);

const getBuild = async (project: string, buildId: number): Promise<Build> => {
    return await buildClient.getBuild(project, buildId)
}

const getBuildTimeline = async (project: string, buildId: number): Promise<Timeline> => {
    return await buildClient.getBuildTimeline(project, buildId)
}

const getThisBuild = async ():Promise<ThisBuild> => {
    const projectService = await SDK.getService<IProjectPageService>(CommonServiceIds.ProjectPageService)
    const buildService = await SDK.getService<IBuildPageDataService>(BuildServiceIds.BuildPageDataService)
    const projectFromContext = await projectService.getProject()
    const buildFromContext = await buildService.getBuildPageData() //requires await to work eventhough does not return Promise

    if (!projectFromContext || !buildFromContext) {
        throw new Error('Not running in AzureDevops context.')
    } else {
        console.log(`Running for project ${projectFromContext.id} and build ${buildFromContext.build?.id.toString()}`)
    }

    if (!buildFromContext.build?.id) {
        console.log("Cannot get build id.")
        throw new Error('Cannot get build from page data')
    }

    const buildId = buildFromContext.build.id
    const build = await getBuild(projectFromContext.name, buildId)
    const timeline = await getBuildTimeline(projectFromContext.name, buildId)

    return {
        project: projectFromContext,
        buildId: buildId,
        build: build,
        timeline: timeline
    }
}

const getRecordId = (timeline: Timeline): string => {
    for (let record of timeline.records) {
        if (record && record.task && record.task.id == terraformCliTaskId) {
            return record.id
        }
    }
    throw new Error(`Could not find record id.`)
}


const getPlanAttachmentNames = async (build: ThisBuild): Promise<string[]> => {
    const attachments = await buildClient.getAttachments(
        build.project.id,
        build.buildId,
        terraformPlanAttachmentType
    )
    const attachmentNames = attachments.map(e => e.name)
    return attachmentNames
}

const getAttachment = async (build: ThisBuild, attachmentType: string, attachmentName: string): Promise<string> => {
    const recordId = getRecordId(build.timeline)
    const attachment = await buildClient.getAttachment(
        build.project.id,
        build.buildId,
        build.timeline.id,
        recordId,
        attachmentType,
        attachmentName)
    const td = new TextDecoder()
    return td.decode(attachment)
}

const getPlainPlanAttachment = async (build: ThisBuild, attachmentName: string): Promise<string> => {
    const attachmentType: string = terraformPlanAttachmentType

    let attachment: string | undefined
    try {
        attachment = await getAttachment(build, attachmentType, attachmentName)
    } catch (e) {
        throw new Error(`Failed to download plain plan: ${e}`)
    }

    return attachment;
}

const TerraformPlanDisplay: React.FC = props => {
    const [chosenPlanIndex, setChosenPlanIndex] = React.useState(-1)
    const [plans, setPlans] = React.useState<TerraformPlan[]>([])
    //const selection = new ListSelection();

    React.useEffect(() => {

        const fetchPlans = async () => {
            let foundPlans : TerraformPlan[] = [];

            if (process.env.TEST) {
                const testData = require('./test-data')
                // Inject test values here
                const plan = testData.examplePlan1 as string
                foundPlans.push({
                    name: 'test_deploy.tfplan',
                    plan
                });
                foundPlans.push({
                    name: 'stage_deploy.tfplan',
                    plan
                });
            } else {
                SDK.init()
                const build = await getThisBuild()
                const attachmentNames = await getPlanAttachmentNames(build);
                for (const name of attachmentNames) {
                    const plan = await getPlainPlanAttachment(build, name);
                    foundPlans.push({
                        name,
                        plan
                    });
                }
            }

            setPlans(foundPlans);
            setChosenPlanIndex(foundPlans.length - 1);
            //selection.select(chosenPlanIndex);
        }

        fetchPlans();
    }, []);

    const ansi_up = new AnsiUp()
    let planHTML = {
        __html: "Not ready yet."
    }

    if (chosenPlanIndex === -1) {
        planHTML.__html = "<pre>" + ansi_up.ansi_to_html("No Terraform Plan Found") + "</pre>";
    } else if (chosenPlanIndex <= plans.length) {
        const plan = plans[chosenPlanIndex];
        planHTML.__html = "<pre>" + ansi_up.ansi_to_html(plan.plan) + "</pre>";
    }

    const planNames = plans.map(e => e.name);

    return (
        <React.Fragment>
            <Card className="flex-grow"
                titleProps={{ text: "Terraform plan output" }}>
                <div className="flex-column">
                <label htmlFor="work-item-type-picker">New work item type:</label>
                    {/* <Dropdown<string>
                        className="sample-work-item-type-picker"
                        items={planNames}
                        onSelect={(event, item) => {
                            // selectedPlan.select(chosenPlanIndex);
                            // setSelectedPlan(selectedPlan);
                            console.log(item);
                        }}
                        selection={selection}
                    /> */}
                </div>
                <div className="flex-grow flex-column">
                    <Observer dangerouslySetInnerHTML={planHTML}>
                        <div />
                    </Observer>
                </div>
            </Card>
        </React.Fragment>
    )
}

ReactDOM.render(<TerraformPlanDisplay />, document.getElementById("root"))
