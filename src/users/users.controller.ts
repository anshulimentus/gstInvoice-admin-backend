import { Controller, Get, Post, Put, Body, UseGuards, Request, Param, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from './roles.enum';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './create-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('register')
    async register(@Body(ValidationPipe) createUserDto: CreateUserDto) {
        return await this.usersService.create(createUserDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get('admin-data')
    getAdminData(@Request() req) {
        return `Welcome Admin ${req.user.email}`;
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() req) {
        const user = await this.usersService.findById(req.user.userId);
        if (user) {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        return null;
    }

    @UseGuards(JwtAuthGuard)
    @Put('profile')
    async updateProfile(@Request() req, @Body(ValidationPipe) updateUserDto: UpdateUserDto) {
        return await this.usersService.update(req.user.userId, updateUserDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get('all')
    async getAllUsers() {
        return await this.usersService.findAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get(':id')
    async getUserById(@Param('id') id: number) {
        return await this.usersService.findById(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Put(':id')
    async updateUser(@Param('id') id: number, @Body(ValidationPipe) updateUserDto: UpdateUserDto) {
        return await this.usersService.update(id, updateUserDto);
    }
}