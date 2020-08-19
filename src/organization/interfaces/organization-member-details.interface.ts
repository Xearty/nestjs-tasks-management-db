import { OrganizationMemberRole } from "../enum/organization-member-role.enum";
import { Task } from "src/tasks/entities/task/task.entity";
import { OrganizationMember } from "../entities/organization-member/organization-member.entity";

export interface IOrganizationMemberDetails {
    id: number;
    username: string;
    role: OrganizationMemberRole;
    memberships?: OrganizationMember[];
    tasks?: Task[];
}