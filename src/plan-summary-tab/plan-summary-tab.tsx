import {
    default as AnsiUp
} from 'ansi_up';
import * as API from "azure-devops-extension-api";
import { CommonServiceIds, getClient, IProjectPageService } from "azure-devops-extension-api";
import { Build, BuildRestClient, BuildServiceIds, IBuildPageDataService, Timeline } from "azure-devops-extension-api/Build";

import * as SDK from "azure-devops-extension-sdk";

import { Card } from "azure-devops-ui/Card";
import { ObservableArray, ObservableValue } from "azure-devops-ui/Core/Observable";
import { Dropdown } from "azure-devops-ui/Dropdown";
import { DropdownSelection } from "azure-devops-ui/Utilities/DropdownSelection";
import { Observer } from "azure-devops-ui/Observer";
import * as React from "react";
import "./plan-summary-tab.scss";
import { IListBoxItem } from 'azure-devops-ui/ListBox';

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

export const NoPublishedPlanMessage = "No terraform plans have been published for this pipeline run. The terraform cli task must run plan with <code>publishPlanResults: true</code> to view plans.";

export default class TerraformPlanDisplay extends React.Component {

    private readonly buildClient: BuildRestClient
    private readonly terraformPlanAttachmentType: string = "terraform-plan-results"
    private readonly taskId: string = "721c3f90-d938-11e8-9d92-09d7594721b5"

    private planSelection = new DropdownSelection();
    private chosenPlan = new ObservableValue(-1);
    private plans = new ObservableArray<TerraformPlan>([]);

    constructor(props: {} | Readonly<{}>) {
        super(props)
        this.buildClient = getClient(BuildRestClient)
    }

    public async componentDidMount() {

        let foundPlans: TerraformPlan[] = [];

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
            await SDK.init();
            const build = await this.getThisBuild()
            const attachmentNames = await this.getPlanAttachmentNames(build);
            for (const name of attachmentNames) {
                const plan = await this.getPlainPlanAttachment(build, name);
                foundPlans.push({
                    name,
                    plan
                });
            }
        }

        this.plans.change(0, ...foundPlans)
        const initialSelection = foundPlans.length - 1
        this.planSelection.select(initialSelection)
        this.chosenPlan.value = initialSelection
    }

    public render(): JSX.Element {


        return (
            <div>
                <Card className="flex-grow flex-column"
                    titleProps={{ text: "Terraform plan output" }}>

                    <Observer chosenPlan={this.chosenPlan} plans={this.plans} >
                        {(props: { chosenPlan: number, plans: TerraformPlan[] }) => {
                            const planItems = props.plans.map((e: TerraformPlan, index: number) => {
                                return {
                                    id: index.toString(),
                                    text: e.name
                                }
                            });

                            let html = NoPublishedPlanMessage;
                            if (props.chosenPlan > -1) {
                                const ansi_up = new AnsiUp()
                                const planText = props.plans[props.chosenPlan].plan;
                                html = `<pre>${ansi_up.ansi_to_html(planText)}</pre>`
                            }

                            let dropDown = props.plans.length > 1 ? (
                                <div className="flex-row">
                                    <Dropdown
                                        ariaLabel="Basic"
                                        className="example-dropdown"
                                        placeholder="Select an Option"
                                        items={planItems}
                                        selection={this.planSelection}
                                        onSelect={this.onSelect}
                                    />
                                </div>) : null

                            return (
                                <div className="flex-column">
                                    {dropDown}
                                    <div className="flex-row">
                                        <div dangerouslySetInnerHTML={{ __html: html }} />
                                    </div>
                                </div>
                            )
                        }}
                    </Observer>
                </Card>
            </div>
        )
    }

    private onSelect = (event: React.SyntheticEvent<HTMLElement>, item: IListBoxItem<{}>) => {
        this.chosenPlan.value = parseInt(item.id);
    };

    private async getThisBuild(): Promise<ThisBuild> {
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
        const build = await this.getBuild(projectFromContext.name, buildId)
        const timeline = await this.getBuildTimeline(projectFromContext.name, buildId)

        return {
            project: projectFromContext,
            buildId: buildId,
            build: build,
            timeline: timeline
        }
    }

    getRecordId(timeline: Timeline): string {
        for (let record of timeline.records) {
            if (record && record.task && record.task.id == this.taskId) {
                return record.id
            }
        }
        throw new Error(`Could not find record id.`)
    }

    async getBuild(project: string, buildId: number): Promise<Build> {
        return 
    }

    async getBuildTimeline(project: string, buildId: number): Promise<Timeline> {
        return await this.buildClient.getBuildTimeline(project, buildId)
    }

    async getPlanAttachmentNames(build: ThisBuild): Promise<string[]> {
        const attachments = await this.buildClient.getAttachments(
            build.project.id,
            build.buildId,
            this.terraformPlanAttachmentType
        )
        const attachmentNames = attachments.map(e => e.name)
        return attachmentNames
    }

    async getAttachment(build: ThisBuild, attachmentType: string, attachmentName: string): Promise<string> {
        const recordId = this.getRecordId(build.timeline)
        const attachment = await this.buildClient.getAttachment(
            build.project.id,
            build.buildId,
            build.timeline.id,
            recordId,
            attachmentType,
            attachmentName)
        const td = new TextDecoder()
        return td.decode(attachment)
    }

    async getPlainPlanAttachment(build: ThisBuild, attachmentName: string): Promise<string> {
        let attachment: string | undefined
        try {
            attachment = await this.getAttachment(build, this.terraformPlanAttachmentType, attachmentName)
        } catch (e) {
            throw new Error(`Failed to download plain plan: ${e}`)
        }

        return attachment;
    }
}