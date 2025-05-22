import { User } from "../../domain/entities/users/user";

export interface UserDto {
    id: number;
    name: string;
    email: string;
    role?: {
        id: number;
        name: string;
    };
}

export function toUserDto(user: User): UserDto {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role ? { id: user.role.id, name: user.role.name } : undefined,
    };
}
