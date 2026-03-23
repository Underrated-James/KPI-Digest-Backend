import { Injectable } from '@nestjs/common';

 export type UserRole = 'ADMIN' | 'DEVS' | "QA";

@Injectable()
export class UsersService {

  private users = [
    {
      id: 1,
      name: 'Alex Rivers',
      email: 'alex.rivers@example.com',
      role: 'ADMIN',
    },
    {
      id: 2,
      name: 'Sam Varma',
      email: 'sam.varma@example.com',
      role: 'DEVS',
    },
    {
      id: 3,
      name: 'Jordan Lee',
      email: 'jordan.lee@example.com',
      role: 'QA',
    },
    {
      id: 4,
      name: 'Taylor Chen',
      email: 'taylor.chen@example.com',
      role: 'DEVS',
    },
    {
      id: 5,
      name: 'Morgan Smith',
      email: 'morgan.smith@example.com',
      role: 'QA',
    },
  ];

  findAll(role?: UserRole) {
    if (role){
        return this.users.filter(user => user.role === role)
    }
    return this.users
  }

  findOne(id: number){
    const user = this.users.find(user => user.id === id)
    return user
  }

  create(user: {name: string, email: string, role: UserRole}){
    const usersByHighestId = [...this.users].sort((a,b) => b.id - a.id)

    const newUser = {
        id: usersByHighestId[0].id + 1,
        ...user
    }
    this.users.push(newUser)
    return newUser
  }

  patch(id: number, updatedUser: {name?: string, email?: string, role?: UserRole}){
    this.users = this.users.map(user => {
        if(user.id == id) {
            return {...user, ...updatedUser}
        }
        return user;
    });

    return this.findOne(id)
  }



   delete(id: number){
    const removedUser = this.findOne(id)

    this.users = this.users.filter(user => user.id !== id)

    return removedUser;

  }

}
