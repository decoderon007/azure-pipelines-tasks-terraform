import * as SDK from "azure-devops-extension-sdk";
import { Attachment, IAttachmentService } from "./index";
import { CommonServiceIds, getClient, IProjectInfo, IProjectPageService } from "azure-devops-extension-api";
import { Build, BuildRestClient, BuildServiceIds, IBuildPageDataService, Timeline } from "azure-devops-extension-api/Build";

interface ThisBuild {
    project: IProjectInfo,
    buildId: number,
    build: Build,
    timeline: Timeline,
}

export default class AzdoAttachmentService implements IAttachmentService {
    private readonly buildClient: BuildRestClient;

    constructor(private readonly taskId: string) {        
        this.buildClient = getClient(BuildRestClient)
    }
    
    async getAttachments(type: string): Promise<Attachment[]> {
        const attachments: Attachment[] = [];
        const build = await this.getThisBuild();
        const attachmentNames = await this.getPlanAttachmentNames(build.project.id, build.buildId, type);        

        //todo: refactor this to utilize promise.all
        for (const name of attachmentNames) {
            const content = await this.getAttachmentContent(build, type, name);
            attachments.push({
                name,
                type,
                content
            });
        }

        return attachments;
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
        const build = await this.buildClient.getBuild(projectFromContext.name, buildId);
        const timeline = await this.buildClient.getBuildTimeline(projectFromContext.name, buildId);

        return {
            project: projectFromContext,
            buildId: buildId,
            build: build,
            timeline: timeline
        }
    }

    private async getPlanAttachmentNames(project: string, buildId: number, attachmentType: string): Promise<string[]> {
        const attachments = await this.buildClient.getAttachments(
            project,
            buildId,
            attachmentType
        )
        const attachmentNames = attachments.map(e => e.name)
        return attachmentNames
    }

    private async getAttachmentContent(build: ThisBuild, attachmentType: string, attachmentName: string): Promise<string> {
        let attachment: string | undefined
        try {
            attachment = await this.getAttachment(build, attachmentType, attachmentName)
        } catch (e) {
            throw new Error(`Failed to download plain plan: ${e}`)
        }

        return attachment;
    }

    private async getAttachment(build: ThisBuild, attachmentType: string, attachmentName: string): Promise<string> {
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

    private getRecordId(timeline: Timeline): string {
        for (let record of timeline.records) {
            if (record && record.task && record.task.id == this.taskId) {
                return record.id
            }
        }
        throw new Error(`Could not find record id.`)
    }
}
