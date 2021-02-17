export interface Attachment {
    name: string;
    type: string;
    content: string;
}

export interface IAttachmentService {
    getAttachments(type: string): Promise<Attachment[]>
}

