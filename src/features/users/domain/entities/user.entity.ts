import { UserRole } from '../enums/user-role.enum';

export class User {
    constructor(
        public readonly id: string,
        public _name: string,
        public _email: string,
        public _role: UserRole,
        public _status: boolean,
        public readonly _createdAt?: Date,
        public readonly _updatedAt?: Date,
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

    get status(): boolean {
        return this._status;
    }

    get createdAt(): Date | undefined {
        return this._createdAt;
    }

    get updatedAt(): Date | undefined {
        return this._updatedAt;
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

    updateStatus(status: boolean): void {
        this._status = status;
    }
}
