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
    // private readonly timelineId: string = "6c731c3c-3c68-459a-a5c9-bde6e6595b5b" // this is the id of the task from task.json
    private readonly taskId: string = "320ec1e4-3b96-11eb-adc1-0242ac120002"

    private planC = new ObservableValue({ __html: "Not ready yet." })
    private tableItemProvider = new ObservableArray<ITableItem | ObservableValue<ITableItem | undefined>
    >(new Array(4).fill(new ObservableValue<ITableItem | undefined>(undefined)));

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
    ];

    constructor(props: {} | Readonly<{}>) {
        super(props)
        this.buildClient = getClient(BuildRestClient)
    }

    public componentDidMount() {
        SDK.init();

        this.getThisBuild()
            .then((build) => {
                return Promise.all([
                    this.getPlainPlanAttachment(build),
                    this.getJsonSummaryAttachment(build)
                ])
            })
            .then((res) => {
                console.log("promises")
                let plan: string
                let summary: PlanSummary
                [plan, summary] = res

                this.planC.value = { __html: plan }
                this.tableItemProvider.value

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
            })
            .catch((err) => {
                console.log(`Error: ${err}`)
            })
    }

    public render(): JSX.Element {
        return (
            <div className="flex-grow">
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

                <Card className="flex-grow"
                    titleProps={{ text: "Terraform plan output" }}>
                    <div className="flex-grow flex-column">
                        <Observer dangerouslySetInnerHTML={this.planC}>
                            <div />
                        </Observer>
                    </div>
                </Card>
            </div>
        );
    }

    private async getThisBuild(): Promise<ThisBuild> {

        const projectService = await SDK.getService<IProjectPageService>(CommonServiceIds.ProjectPageService);
        const buildService = await SDK.getService<IBuildPageDataService>(BuildServiceIds.BuildPageDataService);
        const projectFromContext = await projectService.getProject();
        const buildFromContext = await buildService.getBuildPageData(); //requires await to work eventhough does not return Promise

        if (!projectFromContext || !buildFromContext) {
            console.log("No running in AzureDevops context.")
            return new Promise<ThisBuild>((resolve, reject) => {
                reject('Not running in AzureDevops context.')
            })
        } else {
            console.log(`Running for project ${projectFromContext.id} and build ${buildFromContext.build?.id.toString()}`)
        }
        const projectId = projectFromContext.id

        if (!buildFromContext.build?.id) {
            console.log("Cannot get build id.")
            return new Promise<ThisBuild>((resolve, reject) => {
                reject('Cannot get build from page data.')
            })
        }
        const buildId = buildFromContext.build.id

        var build: Build
        var timeline: Timeline

        return this.buildClient.getBuild(projectFromContext.name, buildId)
            .then((res) => {
                build = res
                return this.buildClient.getBuildTimeline(projectFromContext.name, buildId)
            })
            .then((res) => {
                return new Promise<ThisBuild>((resolve, reject) => {
                    if (!res) {
                        throw new Error("getBuildTimeline resulted in void.")
                    }
                    resolve({
                        project: projectFromContext,
                        buildId: buildId,
                        build: build,
                        timeline: res
                    })
                })

            })
            .catch((err) => {
                console.log(`Failed to get build or timeline from API: ${err}`)
                return new Promise<ThisBuild>((resolve, reject) => { reject(`Failed to get build or timeline from API: ${err}`) })
            })
    }

    getRecordId(timeline: Timeline): Promise<string> {
        return new Promise<string>((resolve, reject) => {

            for (let record of timeline.records) {
                if (record && record.task && record.task.id == this.taskId) {
                    console.log("GOTCHA!!!")
                    resolve(record.id)
                }
            }
            reject(`Did not find and record for task ${this.taskId}`)
        })

    }

    getAttachment(build: ThisBuild, attachmentType: string, attachmentName: string): Promise<string> {

        return this.getRecordId(build.timeline)
            .then((recordId) => {
                return this.buildClient.getAttachment(
                    build.project.id,
                    build.buildId,
                    build.timeline.id,
                    recordId,
                    attachmentType,
                    attachmentName)
                    .then((res) => {
                        const td = new TextDecoder()
                        return td.decode(res)
                    })
                    .catch((err) => {
                        console.log(`Failed to download plain plan: ${err}`)
                        return new Promise<string>((resolve, reject) => { reject(`Failed to download plain plan: ${err}`) })
                    })
            })


    }

    getJsonSummaryAttachment(build: ThisBuild): Promise<PlanSummary> {
        const attachmentType: string = "summary.json"
        const attachmentName: string = "summary.json"

        return this.getAttachment(build, attachmentType, attachmentName)
            .then((res) => {
                return new Promise<PlanSummary>((resolve, reject) => {
                    let jsonResult: PlanSummary = JSON.parse(res.replace(/(\r\n|\r|\n)/gm, ""));
                    if (jsonResult) {
                        console.log("Successfully parsed json attachment.")
                        resolve(jsonResult)
                    } else {
                        reject(`Cannot parse json attachment to <PlanSummary>: got ${jsonResult}`)
                    }
                })
            })
    }

    getPlainPlanAttachment(build: ThisBuild): Promise<string> {
        const attachmentType: string = "plan.text"
        const attachmentName: string = "tfplan.txt"

        return this.getAttachment(build, attachmentType, attachmentName)
            .then((res) => {
                return new Promise<string>((resolve, reject) => {
                    const ansi_up = new AnsiUp();
                    resolve("<pre>" + ansi_up.ansi_to_html(res) + "</pre>")
                })
            })
            .catch((err) => {
                console.log(`Failed to download plain plan: ${err}`)
                return new Promise<string>((resolve, reject) => { reject(`Failed to download plain plan: ${err}`) })
            })

    }
}

ReactDOM.render(<TerraformPlanDisplay />, document.getElementById("root"));