
import { BaseModel } from '../../../../shared';
import { UserModel } from '../../../user/components/user.model';

export class DepartmentModel extends BaseModel {
    public DepartmentId: number;
    public DepartmentName: string;
    public ContactNo: string;
    public Description: string;
    public ParentDepartmentId?: number;
    public DepartmentSpoc?: number;

    public ParentDepartment?: DepartmentModel;
    public UserProfile?: UserModel;
}