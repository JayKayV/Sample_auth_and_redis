import { SetMetadata } from '@nestjs/common';

function assignRole(isAdmin) {
    if (isAdmin)
        return "Admin";
    return "User";
}

export const ROLES_KEY = 'roles';
export const Roles = (role : string) => SetMetadata(ROLES_KEY, role);