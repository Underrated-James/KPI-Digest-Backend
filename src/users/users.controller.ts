import { Body, 
    Controller,
     Delete, 
     Get, 
     Param, 
     Patch, 
     Post, 
     Query, 
    ValidationPipe,
    BadRequestException } from '@nestjs/common';
import { UsersService} from './users.service';
import { CreateUserDto } from './dtos/create-user-dto';
import { UpdateUserDto } from './dtos/update-user-dto';


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
        if (role && !['ADMIN', 'DEVS', 'QA'].includes(role)) {
            throw new BadRequestException(`Invalid role: ${role}. Valid roles are: ADMIN, DEVS, QA`);
        }
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
        return this.userService.findOne(id);
    }

    @Post()
    create(@Body(ValidationPipe) newUser: CreateUserDto){
        return this.userService.create(newUser)
    }

    @Patch(':id')
    patch(@Param('id') id: string, @Body(ValidationPipe) userUpdate: UpdateUserDto){
        return this.userService.patch(id, userUpdate)
    }

    @Delete(':id') // Delete a user by ID
    delete(@Param('id') id: string){
        return this.userService.delete(id)
    }

    


}
