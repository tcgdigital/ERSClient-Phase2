import { BaseModel } from '../../../shared';
import { QuickLinkModel } from './../quicklink';

export class QuickLinkGroupModel extends BaseModel {
    public QuickLinkGroupId: number;
    public GroupName: string;
    public Active: boolean;
    public QuickLinks: QuickLinkModel[];

    constructor() {
        super();
        this.QuickLinkGroupId = 0;
        this.GroupName = '';
    }
}