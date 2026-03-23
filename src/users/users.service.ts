import { CreateUserDto } from './dtos/create-user-dto';
import { UpdateUserDto } from './dtos/update-user-dto';
import { NotFoundException, Injectable} from '@nestjs/common';

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
        const roleArray = this.users.filter(user => user.role === role)
        if(roleArray.length === 0) throw new NotFoundException('User Role not Found')
        return roleArray
    }

    return this.users
  }

  findOne(id: number){
    const user = this.users.find(user => user.id === id)
    if(!user) throw new NotFoundException('User Not Found')
    return user
  }

  create(user: CreateUserDto){
    const usersByHighestId = [...this.users].sort((a,b) => b.id - a.id)

    const newUser = {
        id: usersByHighestId[0].id + 1,
        ...user
    }
    this.users.push(newUser)
    return newUser
  }

  patch(id: number, updatedUser: UpdateUserDto){
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
