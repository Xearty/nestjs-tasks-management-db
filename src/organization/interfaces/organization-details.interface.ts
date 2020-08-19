import { OrganizationType } from "../enum/organization-type.enum";
import { OrganizationMemberRole } from "../enum/organization-member-role.enum";
import { User } from "src/auth/entities/User/user.entity";

export interface IOrganizationDetails {
    id: number;
    name: string;
    type: OrganizationType;
    role?: OrganizationMemberRole;
    members?: User[];
}