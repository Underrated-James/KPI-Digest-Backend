import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UsersService, UserRole } from './users.service';

@Controller('users')
export class UsersController {

    constructor(private readonly userService: UsersService){}
    /*
    GET /api/users - Get all users
    GET /api/users/:id - Get a user by ID
    POST /api/users - Create a new user
    PUT /api/users/:id - Update a user by ID
    PATCH /api/users/:id - Partially update a user by ID
    DELETE /api/users/:id - Delete a user by ID
    */

    @Get() // Get all users
    findAll(@Query('role') role?: 'ADMIN' | 'DEVS' | 'QA'){
        return this.userService.findAll(role)
    }

    // @Get('developers') // Get all developers
    // findAllDevelopers(){
    //     return [];
    // }

    // @Get('quality-assurance') // Get all quality assurance engineers
    // findAllQualityAssurance(){
    //     return [];
    // }

    @Get(':id') // Get a user by ID
    findOne(@Param('id') id: string){
        return this.userService.findOne(+id);
    }

    @Post()
    create(@Body() newUser: {name: string, email: string, role: UserRole}){
        return this.userService.create(newUser)
    }

    @Patch(':id')
    patch(@Param('id') id: string, @Body() userUpdate: {name?: string, email?: string, role?: UserRole}){
        return this.userService.patch(+id, userUpdate)
    }

    @Delete(':id') // Delete a user by ID
    delete(@Param('id') id: string){
        return this.userService.delete(+id)
    }

    


}
