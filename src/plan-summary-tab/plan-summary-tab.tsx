import {
    default as AnsiUp
} from 'ansi_up';
import * as API from "azure-devops-extension-api";
import { CommonServiceIds, getClient, IProjectPageService } from "azure-devops-extension-api";
import { Build, BuildRestClient, BuildServiceIds, IBuildPageDataService, Timeline } from "azure-devops-extension-api/Build";

import * as SDK from "azure-devops-extension-sdk";

import { Card } from "azure-devops-ui/Card";
import { ObservableArray, ObservableValue } from "azure-devops-ui/Core/Observable";
import { Observer } from "azure-devops-ui/Observer";
import { renderSimpleCell, Table, TableColumnLayout } from "azure-devops-ui/Table";
import * as React from "react";
import * as ReactDOM from "react-dom";
import "./plan-summary-tab.scss";
import {
    ITableItem,
    renderAdd,
    renderChange,
    renderDestroy,
    renderNoChange
} from "./table-data";

interface ThisBuild {
    project: API.IProjectInfo,
    buildId: number,
    build: Build,
    timeline: Timeline,
}

interface TypeSummary {
    toCreate: number
    toDelete: number
    toUpdate: number
    unchanged: number
}

interface PlanSummary {
    resources: TypeSummary
    outputs: TypeSummary
}

class TerraformPlanDisplay extends React.Component {

    private readonly buildClient: BuildRestClient
    private readonly taskId: string = "721c3f90-d938-11e8-9d92-09d7594721b5"

    private planC = new ObservableValue({ __html: "Not ready yet." })
    private tableItemProvider = new ObservableArray<ITableItem | ObservableValue<ITableItem | undefined>>(
        new Array(4).fill(new ObservableValue<ITableItem | undefined>(undefined)))

    private readonly fixedColumns = [
        {
            columnLayout: TableColumnLayout.singleLine,
            id: "action",
            name: "Action",
            readonly: true,
            renderCell: renderSimpleCell,
            width: new ObservableValue(-30),
        },
        {
            columnLayout: TableColumnLayout.singleLine,
            id: "resources",
            name: "Resources",
            readonly: true,
            renderCell: renderSimpleCell,
            width: new ObservableValue(-30),
        },

        {
            columnLayout: TableColumnLayout.singleLine,
            id: "outputs",
            name: "Outputs",
            readonly: true,
            renderCell: renderSimpleCell,
            width: new ObservableValue(-30),
        },
    ]

    constructor(props: {} | Readonly<{}>) {
        super(props)
        this.buildClient = getClient(BuildRestClient)
    }

    public async componentDidMount() {

        let plan: string | undefined
        let summary: PlanSummary | undefined

        if (process.env.TEST) {
            const testData = require('./test-data');
            // Inject test values here
            plan = testData.examplePlan1 as string;
            summary = JSON.parse(testData.exampleSummary) as PlanSummary;
        } else {
            SDK.init()
            const build = await this.getThisBuild()
            plan = await this.getPlainPlanAttachment(build)
            summary = await this.getJsonSummaryAttachment(build)
        }

        if(plan){
            const ansi_up = new AnsiUp()
            plan = "<pre>" + ansi_up.ansi_to_html(plan) + "</pre>"

            this.planC.value = { __html: plan }
            //this.tableItemProvider.value
        }
        else{
            this.planC.value = { __html: "No terraform plans have been published for this pipeline run. The terraform cli task must run plan with <code>publishPlanResults: true</code> to view plans."}
        }
        
        if(summary){
            this.tableItemProvider.change(0,
                {
                    action: { iconProps: { render: renderDestroy }, text: "To destroy" },
                    resources: summary.resources.toDelete,
                    outputs: summary.outputs.toDelete
                },
                {
                    action: { iconProps: { render: renderChange }, text: "To update" },
                    resources: summary.resources.toUpdate,
                    outputs: summary.outputs.toUpdate
                },
                {
                    action: { iconProps: { render: renderAdd }, text: "To create" },
                    resources: summary.resources.toCreate,
                    outputs: summary.outputs.toCreate
                },
                {
                    action: { iconProps: { render: renderNoChange }, text: "Unchanged" },
                    resources: summary.resources.unchanged,
                    outputs: summary.outputs.unchanged
                },
            )
        }
    }

    public render(): JSX.Element {
        const summaryCard =
            <Card className="flex-grow bolt-table-card"
                titleProps={{ text: "Terraform plan summary" }}
                contentProps={{ contentPadding: false }}>

                <Table
                    ariaLabel="Basic Table"
                    columns={this.fixedColumns}
                    itemProvider={this.tableItemProvider}
                    role="table"
                    className="tf-plan-summary"
                    containerClassName="h-scroll-auto"
                />
            </Card>
        const planCard = 
            <Card className="flex-grow"
                titleProps={{ text: "Terraform plan output" }}>
                <div className="flex-grow flex-column">
                    <Observer dangerouslySetInnerHTML={this.planC}>
                        <div />
                    </Observer>
                </div>
            </Card>
        return (
            <div className="flex-grow">
                {this.tableItemProvider.value[0].value && summaryCard}
                {planCard}
            </div>
        )
    }

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
        return await this.buildClient.getBuild(project, buildId)
    }

    async getBuildTimeline(project: string, buildId: number): Promise<Timeline> {
        return await this.buildClient.getBuildTimeline(project, buildId)
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

    async getJsonSummaryAttachment(build: ThisBuild): Promise<PlanSummary> {
        const attachmentType: string = "summary.json"
        const attachmentName: string = "summary.json"

        const attachment = await this.getAttachment(build, attachmentType, attachmentName)

        const jsonResult: PlanSummary = JSON.parse(attachment.replace(/(\r\n|\r|\n)/gm, ""))
        if (!jsonResult) {
            throw new Error(`Cannot parse json attachment to <PlanSummary>: got ${jsonResult}`)
        }

        return jsonResult
    }

    async getPlainPlanAttachment(build: ThisBuild): Promise<string> {
        const attachmentType: string = "plan.text"
        const attachmentName: string = "tfplan.txt"

        let attachment: string | undefined
        try {
            attachment = await this.getAttachment(build, attachmentType, attachmentName)
        } catch (e) {
            throw new Error(`Failed to download plain plan: ${e}`)
        }

        return attachment;
    }
}

ReactDOM.render(<TerraformPlanDisplay />, document.getElementById("root"))