import { UserRole } from './user-role.enum';

export class User {
    constructor(
        public readonly id: string,
        public _name: string,
        public _email: string,
        public _role: UserRole
    ) { }

    get name(): string {
        return this._name;
    }

    get email(): string {
        return this._email;
    }

    get role(): UserRole {
        return this._role;
    }

    updateName(name: string): void {
        this._name = name;
    }

    updateEmail(email: string): void {
        this._email = email;
    }

    updateRole(role: UserRole): void {
        this._role = role;
    }
}